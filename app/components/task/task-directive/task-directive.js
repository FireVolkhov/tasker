/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-directive', ['template/components/task/task-directive.html', 'focus-directive', 'datetime-local-directive', 'task-service'])
	.directive('task', ['Task', function(Task){
		return {
			scope: {
				task: "=",
				notSaveOldTask: "=?"
			},
			replace: true,
			templateUrl: 'template/components/task/task-directive.html',
			link: function(scope, elem, attrs){
				var oldTask;

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

				scope.$watch('task.$edit', function($edit){
				    if ($edit && !scope.notSaveOldTask){
						// Сохраняем данные до редактирования для возрата при отмене
						oldTask = scope.task;
						scope.task = angular.copy(oldTask);
					}
				});

				scope.cancel = function(){
				    if (!scope.notSaveOldTask) scope.task = oldTask;
					scope.task.$edit = false;
				};

				scope.save = function(){
					if (!scope.notSaveOldTask){
						angular.extend(oldTask, scope.task);
						scope.task = oldTask;
					}
				    scope.task.$save().$promise.then(function(){
				        scope.task.$edit = false;
						scope.$emit('task-directive-save', scope.task);
				    });
				};

				var removeListener = scope.$on('task-directive-newTask', function(event){
				    scope.task = new Task({$edit: true});
					event.stopPropagation();
				});

				scope.$on('destroy', function(){
				    removeListener();
				});
			}
		};
	}])
;

angular.module('template/components/task/task-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/components/task/task-directive.html',
			'<div class="taskDirective task-status-{{ task.$status }}" ng-hide="task.$hide" ng-form="form">' +
			'	<div class="task-isFinished-container">' +
			'		<i class="task-icon{{ task.IsFinished ? \'Check\' : \'UnCheck\' }}" ng-click="finished()"></i>' +
			'	</div>' +
			'	<div class="task-text-dueTime-buttons-container">' +
			'		<div class="task-text">' +
			'			<span ng-if="!task.$edit" >{{ task.Text }}</span>' +
			'			<textarea ng-if="task.$edit" data-ng-model="task.Text" focus required></textarea>' +
			'		</div>' +
			'		<div class="task-dueTime-buttons-container">' +
			'			<div ng-if="!task.$edit">' +
			'				<span class="task-dueTime">{{ task.DueTime | date: \'dd.MM.yyyy H:mm\' }}</span>' +
			'				<div class="task-buttons">' +
			'					<button class="task-hideButton" ng-click="task.$hide = !task.$hide">Скрыть</button>' +
			'					<button class="task-editButton" ng-click="task.$edit = true">Редактировать</button>' +
			'				</div>' +
			'			</div>' +
			'			<div ng-if="task.$edit">' +
			'				<input class="task-dueTime" type="datetime-local" data-ng-model="task.DueTime" required datetime-local>' +
			'				<div class="task-buttons">' +
			'					<button class="task-cancelButton" ng-click="cancel()">Отмена</button>' +
			'					<button class="task-saveButton" ng-click="save()" ng-disabled="!task.$resolved || form.$invalid">Сохранить</button>' +
			'				</div>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>'
	);
}]);