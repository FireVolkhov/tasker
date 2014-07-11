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
			    if (!scope.task){
					scope.task = getNewTask();
				}

				Task.addEventListener('save', function(task){
				    if (task == scope.task){
						scope.open = false;
						scope.task = getNewTask();
					}
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