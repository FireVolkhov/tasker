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
				    if (!scope.task.IsFinished){
						scope.task.IsFinished = true;
						scope.task.$save().$promise.catch(function(){
						    scope.task.IsFinished = false;
						});
					}
				};
			}
		};
	}])
;

angular.module('template/components/task/task-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/task/task-directive.html',
			'<div class="taskDirective task-status-{{ task.$status }}" ng-hide="task.$hide">' +
			'	<div class="task-isFinished-container">' +
			'		<input type="checkbox" data-ng-model="task.IsFinished" ng-disabled="task.IsFinished" ng-click="finished()">' +
			'	</div>' +
			'	<div>' +
			'		<div class="task-text">{{ task.Text }}</div>' +
			'		<diV>' +
			'			<span class="task-dueTime">{{ task.DueTime | date: \'dd.MM.yyyy H:mm\' }}</span>' +
			'			<button class="task-hideButton" ng-click="task.$hide = !task.$hide">скрыть</button>' +
			'		</div>' +
			'	</div>' +
			'</div>'
	);
}]);