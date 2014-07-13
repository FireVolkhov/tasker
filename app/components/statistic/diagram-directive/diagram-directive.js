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
		animate: true,
		animateTime: 1000,
		animateInterval: 10,

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

		labelFont: "16px Verdana, sans-serif",
		labelColor: "black",
		labelCenterRadius: 20,		// Радиус размещения от центра

		smallLabelFont: "16px Verdana, sans-serif",
		smallLabelColor: "black",
		offsetRadiusSmallLabel: 20		// Внешний отступ линиии для размещения текста
	})
	.directive('diagram', ['$timeout', 'diagram-default-config', function($timeout, defConfig){
		return {
			scope: {
				config: '=diagram',
				slices: '='
			},
			replace: true,
			templateUrl: 'template/components/diagram/diagram-directive.html',
			link: function(scope, elem, attrs){
				var canvas = elem.children('canvas')[0],
					nowSlices, 			// Состояние диаграммы в данный момент
					init = false, 		// Иницилизация прошла?
					targetSlices, 		// Конечное состояние после анимации
					targetTotalValue, 	// Временная переменная для иницилизации хранит сумму значений диаграммы
					startTime, 			// Время старта анимации
					targetTime, 		// Время завершения анимации
					timer; 				// Id таймера

				scope.config = angular.extend(defConfig, scope.config || {});

				var removeListerSlice = scope.$watch('slices', updateListener);
				var removeListerUpdate = scope.$on('diagram-update', function(event, slices){
				    updateListener(slices);
				});

				scope.$on('destroy', function(){
				    removeListerSlice();
					removeListerUpdate();
				});

				function updateListener(slices){
				    slices = angular.copy(slices);
					if (scope.config.animate){
						animate(slices);
					} else {
						update(slices);
					}
				}

				/**
				 * Подготовка к старту анимации
				 * @param slices
				 */
				function animate(slices){
				    stopAnimate();

					targetSlices = slices;
					startTime = now();
					targetTime = startTime + scope.config.animateTime;

					if (!init){
						// Если не завершилась иницилизация стартуем заново
						targetTotalValue = 0;
						nowSlices = angular.copy(slices);
						angular.forEach(nowSlices, function(slice){
						    targetTotalValue += slice.value;
							slice.value = 0;
						});
					}

					angular.forEach(nowSlices, function(slice){
					    slice.startValue = slice.value;
					});

					startAnimate();
				}

				/**
				 * Рекурсия анимации
				 */
				function startAnimate(){
					if (now() > targetTime){
						if (!init) init = true;
						update(targetSlices);
					} else {
						angular.forEach(targetSlices, function(target, key){
							var from = nowSlices[key];
							from.value = animateValue(from.startValue, from.value, target.value, startTime, now(), targetTime);
						});
						update(nowSlices);
						timer = setTimeout(startAnimate, scope.config.animateInterval);
					}
				}

				/**
				 * Выключение
				 */
				function stopAnimate(){
					clearTimeout(timer);
				}

				/**
				 * Функция расчета значения анимации
				 * @param start
				 * @param now
				 * @param target
				 * @param startTime
				 * @param nowTime
				 * @param targetTime
				 * @returns {value}
				 */
				function animateValue(start, now, target, startTime, nowTime, targetTime){
					var percent = (nowTime - startTime) / (targetTime - startTime);
				    return (target - start) * percent + start;
				}

				/**
				 * Обновление графика
				 * @param slices
				 * @returns {undefined}
				 */
				function update(slices){
					var	currentPos = 0, // Текущая позиция сектора (от 0 до 1)
						totalValue = 0;

					nowSlices = slices;

					if (typeof canvas.getContext === 'undefined') return undefined;

					if (!init){
						totalValue = targetTotalValue;
					} else {
						// Если иицилизация пройдена считаем из данных
						angular.forEach(slices, function(slice){
							totalValue += slice.value;
						});
					}

					angular.forEach(slices, function(slice){
						slice.startAngle = 2 * Math.PI * currentPos;
						slice.endAngle = 2 * Math.PI * (currentPos + (slice.value / totalValue));
						slice.percent = Math.round(slice.value / totalValue * 100);
						currentPos += slice.value / totalValue;
					});

					drawChart(slices);
				}

				/**
				 * Рисуем график
				 * @param slices
				 */
				function drawChart(slices) {
					var config = scope.config;

					// Получаем контекст для рисования
					var context = canvas.getContext('2d');
					// Очищаем область рисования
					context.clearRect(0, 0, config.width, config.height);

					drawShadow(context, slices);

					// Рисуем каждый сектор диаграммы
					angular.forEach(slices, function(slice){
						drawSlice(context, slice);
					});

					drawCenterText(context, slices);
				}

				/**
				 * Тень
				 * @param context
				 * @param slices
				 */
				function drawShadow(context, slices){
					var config = scope.config,
						radius = Math.min(config.width, config.height) / 2 * (config.chartSizePercent / 100) - config.lineWidth / 2,

					// Рисуем от центра диаграммы
						centerX = config.width/2,
						centerY = config.height/ 2,

					// Рисуем тень только под графиком
						startAngle = null,
						endAngle = null;

					angular.forEach(slices, function(slice){
					    if (startAngle === null){
							startAngle = slice.startAngle;
						}
						endAngle = slice.endAngle;
					});

					// Рисуем тень
					context.beginPath();
					context.arc(centerX, centerY, radius, startAngle + config.chartStartAngle, endAngle + config.chartStartAngle, false);
					context.lineWidth = config.lineWidth;
					context.shadowOffsetX = config.shadowOffsetX;
					context.shadowOffsetY = config.shadowOffsetY;
					context.shadowBlur = config.shadowBlur;
					context.shadowColor = config.shadowColor;
					context.strokeStyle = '#fff';
					context.stroke();
					context.shadowColor = 'rgba(0,0,0,0)';
				}

				/**
				 * Одна секция
				 * @param context
				 * @param slice
				 */
				function drawSlice(context, slice) {
					var config = scope.config,

					// Вычисляем выверенные начальный и конечный углы для сектора
						startAngle = slice.startAngle + config.chartStartAngle,
						endAngle = slice.endAngle + config.chartStartAngle,

						radius = Math.min(config.width, config.height) / 2 * (config.chartSizePercent / 100) - config.lineWidth / 2,
						smallLabelRadius = radius + config.offsetRadiusSmallLabel,

					// рисуем от центра диаграммы
						centerX = config.width/2,
						centerY = config.height/ 2,

						smallLabelX = centerX + Math.cos(startAngle) * smallLabelRadius,
						smallLabelY = centerY + Math.sin(startAngle) * smallLabelRadius;

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
						context.textBaseline = 'middle';
						context.font = config.smallLabelFont;
						context.fillText(slice.percent, smallLabelX, smallLabelY);
					}
				}

				/**
				 * Рисуем центральный текст
				 * @param context
				 * @param slices
				 */
				function drawCenterText(context, slices){
					var config = scope.config,
						radius = config.labelCenterRadius,
						count = 0,
						sliceAngle,
						currentAngle = config.chartStartAngle,

					// Размеры левой и правой сторон
						rightBlockWidth = 0,
						leftBlockWidth = 0,

					// рисуем от центра диаграммы
						centerX = config.width/2,
						centerY = config.height/ 2;

					angular.forEach(slices, function(){
						count ++;
					});

					sliceAngle = Math.PI * 2 / count;

					// Определяем размеры лабелов и блоков
					angular.forEach(slices, function(slice){
						var metrics;
						// Добавляем половину чтоб текст был на середине отрезка
					    slice.labelAngle = currentAngle + sliceAngle / 2;
						currentAngle += sliceAngle;

						slice.labelX = Math.cos(slice.labelAngle) * radius;
						slice.labelY = Math.sin(slice.labelAngle) * radius;
						slice.labelText = slice.percent + '%';

						context.fillStyle = slice.labelColor ? slice.labelColor : config.labelColor;
						context.font = config.labelFont;
						metrics = context.measureText(slice.labelText);
						slice.labelWidth = metrics.width;

						if (slice.labelX > 0){
							rightBlockWidth = Math.max(rightBlockWidth, slice.labelWidth);
						}
						if (slice.labelX < 0){
							leftBlockWidth = Math.max(leftBlockWidth, slice.labelWidth);
						}
					});

					// Рисуем
					angular.forEach(slices, function(slice){
						var x = slice.labelX,
							y = slice.labelY,

						// Положение текста
							textX = centerX + x,
							textY = centerY + y;

						// Пишем текст
						context.fillStyle = slice.labelColor ? slice.labelColor : config.labelColor;
						context.font = config.labelFont;
						context.textAlign = 'right';

						if (x > 0){
							textX += rightBlockWidth;
						} else if (x == 0) {
							textX -= slice.labelWidth/2;
						}

						if (y == 0){
							context.textBaseline = 'middle';
						} else if (y > 0){
							context.textBaseline = 'hanging';
						} else {
							context.textBaseline = 'alphabetic';
						}

						context.fillText(slice.labelText, textX, textY);
					});
				}

				function now(){
				    return new Date().getTime();
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