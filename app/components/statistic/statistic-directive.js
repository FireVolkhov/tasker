/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.cohttps://github.com/angular-ui/bootstrap/tree/master/src/typeaheadm
 */
"use strict";

angular.module('statistic-directive', ['template/components/statistic/statistic-directive.html', 'task-service', 'diagram-directive'])
	.directive('statistic', ['Task', function(Task){
		return {
			scope: {},
			replace: true,
			templateUrl: 'template/components/statistic/statistic-directive.html',
			link: function(scope, elem, attrs){
				var tasks = Task.getAll(),
					all = 0;

				scope.slices = {};
				scope.config = {
					animateTime: 500,

					width: 400,
					height: 400,

					chartSizePercent: 80,			// Радиус диаграммы, выраженный в процентах от размеров области рисования

					lineWidth: 30,

					shadowOffsetX: 0,
					shadowOffsetY: 4,
					shadowBlur: 8,
					shadowColor: "rgba( 0, 0, 0, 0.14 )",

					labelFont: "33.333px PF DinDisplay Pro Light, Verdana, Arial, Helvetica, sans-serif",
					labelColor: "black",
					labelCenterRadius: 5,		// Радиус размещения от центра

					smallLabelFont: "16px PF DinDisplay Pro Light, Verdana, Arial, Helvetica, sans-serif",
					smallLabelColor: "#a8a8a8",
					offsetRadiusSmallLabel: 30		// Внешний отступ линиии для размещения текста
				};

				update();

				Task.addEventListener('change', update);
				scope.$on('destroy', function(){
					Task.removeEventListener('change', update);
				});

				scope.count2percent = function(value){
					return Math.round(value / all * 100);
				};

				function update(){
					clearData();

					angular.forEach(tasks, function(task){
						angular.forEach(Task.STATUS, function(STATUS){
							if (task.$status == STATUS){
								scope.slices[STATUS].value ++;
								all ++;
							}
						});
					});

					slicesUpdate();
				}

				function clearData(){
					all = 0;
					scope.slices = {};
					scope.slices.finished = {value: 0, color: "#9ec54d", labelColor: "#9ec54d"};
					scope.slices.overdue = {value: 0, color: "#e55c9a", labelColor: "#e55c9a"};
					scope.slices.today = {value: 0, color: "#61acec", labelColor: "#61acec"};
					scope.slices.later = {value: 0, color: "#ededed", labelColor: "#a8a8a8"};
				}

				function slicesUpdate(){
					scope.$broadcast('diagram-update', scope.slices);
				}
			}
		};
	}])
;

angular.module('template/components/statistic/statistic-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/statistic/statistic-directive.html',
			'<div class="statistic">' +
			'	<div diagram="config" slices="slices"></div>' +
			'</div>'
	);
}]);