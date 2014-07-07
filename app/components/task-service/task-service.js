/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-service', [])
	.factory('Task', ['$http', '$q', function($http, $q){
		var Task,
			today = new Date(),
			tasks = [],
			cached = false;

		Task = function(value){
			// Убираем лишние переменные
			angular.copy({}, this);

			this.Id = null;
			this.Text = "";
			this.IsFinished = false;
			this.CreateTime = null;
			this.DueTime = null;
			this.FinishTime = null;

			this.$resolved = true;
			this.$promise = null;

			angular.extend(this, value || {});
		};

		Task.prototype = {
			$getAll: getAll,
			$save: save,
			$updateAll: updateAll
		};

		/**
		 * Получение всех задач
		 * @returns {Array}
		 */
		function getAll(){
			if (!cached){

				tasks = [];
				tasks.$resolved = false;
				tasks.$promise = $http.get('/getData.json')
					.finally(function(){
						tasks.$resolved = true;
					})
					.then(function(result){

						var data = result.data;
						today = new Date(data.Today) || today;

						angular.forEach(data.Items, function(task){
							task.CreateTime = new Date(task.CreateTime) || null;
							task.DueTime = new Date(task.DueTime) || null;
							task.FinishTime = new Date(task.FinishTime) || null;

							tasks.push(task);
						});

						cached = true;

						return tasks;
					});
			}

		    return tasks;
		}

		/**
		 * Сохранение изменений задачи
		 * @returns {save}
		 */
		function save(){
		    var task = this;

			task.$resolved = false;
			task.$promise = $http.post('/saveTask.json')
				.finally(function(){
				    task.$resolved = true;
				})
				.then(function(result){
				    return angular.extend(task, result.data);
				});

			return task;
		}

		/**
		 * Обнавление всех задач
		 * @returns {Array}
		 */
		function updateAll(){
		    cached = false;
			return getAll();
		}

		Task.getAll = Task.prototype.$getAll;
		Task.updateAll = Task.prototype.$updateAll;

		return Task;
	}])
;