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
			'			<input ng-if="task.$edit" type="datetime-local" data-ng-model="task.DueTime" required>' +
			'		</div>' +
			'		<div class="task-buttons">' +
			'			<button ng-if="!task.$edit" class="task-hideButton" ng-click="task.$hide = !task.$hide">Скрыть</button>' +
			'			<button ng-if="!task.$edit" class="task-editButton" ng-click="task.$edit = true">Редактировать</button>' +
			'			<button ng-if="task.$edit" class="task-cancelButton" ng-click="task.$edit = false">Отмена</button>' +
			'			<button ng-if="task.$edit" class="task-saveButton" ng-click="task.$save()" ng-disabled="!task.$resolved || form.$invalid">Сохранить</button>' +
			'		</div>' +
			'	</div>' +
			'</div>'
	);
}]);