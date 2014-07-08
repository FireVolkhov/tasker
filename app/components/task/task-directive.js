/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-directive', ['template/components/task/task-directive.html'])
	.directive('task', [function(){
		return {
			scope: {
				task: "="
			},
			replace: true,
			templateUrl: 'template/components/task/task-directive.html',
			link: function(scope, elem, attrs){
				scope.finished = function(){
					var task = scope.task;
					
					if (task.$edit){
						task.IsFinished = !task.IsFinished;
					} else {
						if (!task.IsFinished){
							task.IsFinished = true;
							task.$save().$promise.catch(function(){
								task.IsFinished = false;
							});
						}
					}
				};

				scope.$watch('task', function(){
					if (scope.task){
						scope.task.$isValid = function(){
							return scope.form.$valid;
						}
					}
				});
			}
		};
	}])
;

angular.module('template/components/task/task-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/task/task-directive.html',
			'<div class="taskDirective task-status-{{ task.$status }}" ng-hide="task.$hide" ng-form="form">' +
			'	<div class="task-isFinished-container">' +
			'		<input type="checkbox" data-ng-model="task.IsFinished" ng-disabled="task.IsFinished && !task.$edit" ng-click="finished()">' +
			'	</div>' +
			'	<div>' +
			'		<div class="task-text">' +
			'			<span ng-if="!task.$edit" >{{ task.Text }}</span>' +
			'			<textarea ng-if="task.$edit" data-ng-model="task.Text" required></textarea>' +
			'		</div>' +
			'		<div class="task-dueTime">' +
			'			<span ng-if="!task.$edit">{{ task.DueTime | date: \'dd.MM.yyyy H:mm\' }}</span>' +
			'			<button ng-if="!task.$edit" class="task-hideButton" ng-click="task.$hide = !task.$hide">скрыть</button>' +
			'			<input ng-if="task.$edit" type="datetime-local" data-ng-model="task.DueTime" required>' +
			'		</div>' +
			'	</div>' +
			'</div>'
	);
}]);