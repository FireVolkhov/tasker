/**
 *
 *
 * Created on 11.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('diagram-directive', ['template/components/diagram/diagram-directive.html'])
	.value('diagram-default-config', {
		width: 200,
		height: 200,

		chartSizePercent: 80,			// Радиус диаграммы, выраженный в процентах от размеров области рисования
		chartStartAngle: -.5 * Math.PI,	// Начало диаграммы на 12 часов, а не на 3-х

		lineWidth: 15,
		lineColor: "black",

		shadowOffsetX: 0,
		shadowOffsetY: 5,
		shadowBlur: 5,
		shadowColor: "rgba( 0, 0, 0, 0.1 )",

		smallLabelFont: "Verdana, sans-serif",
		smallLabelFontSize: 16,
		smallLabelColor: "black",
		offsetRadiusSmallLabel: 20		// Внешний отступ линиии для размещения текста
	})
	.directive('diagram', ['diagram-default-config', function(defConfig){
		return {
			scope: {
				config: '=diagram',
				slices: '='
			},
			replace: true,
			templateUrl: 'template/components/diagram/diagram-directive.html',
			link: function(scope, elem, attrs){
				var canvas = elem.children('canvas')[0];

				scope.config = angular.extend(defConfig, scope.config || {});

				var removeListerSlice = scope.$watch('slices', function(slices){
					update({slices: angular.copy(slices)});
				});

				var removeListerUpdate = scope.$on('diagram-update', function(event, slices){
					update({slices: angular.copy(slices)});
				});

				scope.$on('destroy', function(){
				    removeListerSlice();
					removeListerUpdate();
				});

				function update(data){
					var	currentPos = 0, // Текущая позиция сектора (от 0 до 1)
						totalValue = 0;

					if (typeof canvas.getContext === 'undefined') return undefined;

					angular.forEach(data.slices, function(slice){
						totalValue += slice.value;
					});

					angular.forEach(data.slices, function(slice){
						slice.startAngle = 2 * Math.PI * currentPos;
						slice.endAngle = 2 * Math.PI * (currentPos + (slice.value / totalValue));
						currentPos += slice.value / totalValue;
					});

					drawChart(data);
				}

				function drawChart(data) {
					var config = scope.config;

					// Получаем контекст для рисования
					data.context = canvas.getContext('2d');

					// Очищаем область рисования
					data.context.clearRect(0, 0, config.width, config.height);

					drawShadow(data);

					// Рисуем каждый сектор диаграммы
					angular.forEach(data.slices, function(slice){
						drawSlice(slice, data);
					});
				}

				function drawShadow(data){
					var config = scope.config,
						context = data.context,

						radius = Math.min(config.width, config.height) / 2 * (config.chartSizePercent / 100) - config.lineWidth / 2,

					// рисуем от центра диаграммы
						centerX = config.width/2,
						centerY = config.height/ 2;

					// Рисуем тень
					context.beginPath();
					context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
					context.lineWidth = config.lineWidth;
					context.shadowOffsetX = config.shadowOffsetX;
					context.shadowOffsetY = config.shadowOffsetY;
					context.shadowBlur = config.shadowBlur;
					context.shadowColor = config.shadowColor;
					context.strokeStyle = '#fff';
					context.stroke();
					context.shadowColor = 'rgba(0,0,0,0)';
				}

				function drawSlice(slice, data) {
					var config = scope.config,
						context = data.context,

					// Вычисляем выверенные начальный и конечный углы для сектора
						startAngle = slice.startAngle + config.chartStartAngle,
						endAngle = slice.endAngle + config.chartStartAngle,

						radius = Math.min(config.width, config.height) / 2 * (config.chartSizePercent / 100) - config.lineWidth / 2,
						smallLabelRadius = radius + config.offsetRadiusSmallLabel,

					// рисуем от центра диаграммы
						centerX = config.width/2,
						centerY = config.height/ 2,

						smallLabelX = centerX + Math.cos(startAngle) * smallLabelRadius,
						smallLabelY = centerY + Math.sin(startAngle) * smallLabelRadius + config.smallLabelFontSize/3;

					if (slice.startAngle != slice.endAngle){
						// Рисуем сектор
						context.beginPath();
						context.arc(centerX, centerY, radius, startAngle, endAngle, false);
						context.lineWidth = config.lineWidth;
						context.strokeStyle = slice.color ? slice.color : config.lineColor;
						context.stroke();

						// Пишем текст
						context.fillStyle = slice.smallLabelColor ? slice.smallLabelColor : config.smallLabelColor;
						context.textAlign = 'center';
						context.font = config.smallLabelFontSize + 'px ' + config.smallLabelFont;
						context.fillText(angle2percent(slice.startAngle), smallLabelX, smallLabelY);
					}
				}

				function angle2percent(angle){
					var value = angle / (2 * Math.PI) * 100;
					return Math.round(value >= 100 ? value - 100 : value);
				}
			}
		};
	}])
;

angular.module('template/components/diagram/diagram-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/diagram/diagram-directive.html',
			'<div class="diagram">' +
			'	<canvas width="{{config.width}}" height="{{config.height}}"></canvas>' +
			'</div>'
	);
}]);