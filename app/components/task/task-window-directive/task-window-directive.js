/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-window-directive', ['template/components/task/task-window-directive.html'])
	.directive('taskWindow', ['Task', function(Task){
		return {
			scope: {
				task: "=?taskWindow",
				position: "=?",
				open: "=?"
			},
			replace: true,
			templateUrl: "template/components/task/task-window-directive.html",
			link: function(scope, elem, attrs){
				var removeListener = scope.$on('task-directive-save', function(event, task){
					scope.open = false;
					scope.$broadcast('task-directive-newTask');
					event.stopPropagation();
				});

				if (!scope.task){
					scope.task = getNewTask();
				}

				scope.$on('destroy', function(){
					removeListener();
				});

				function getNewTask(){
					return new Task({$edit: true});
				}
			}
		}
	}])
;

angular.module('template/components/task/task-window-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/task/task-window-directive.html',
			'<div class="taskWindow dropdown-menu" ng-style="{display: open&&\'block\' || \'none\', top: position.top+\'px\', right: position.right+\'px\'}">' +
			'	<div task="task"></div>' +
			'</div>'
	);
}]);