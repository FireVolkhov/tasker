/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-service', [])
	.constant('TASK_STATUS', {
		FINISHED: "finished",
		TODAY: "today",
		LATER: "later",
		OVERDUE: "overdue"
	})
	.factory('Task', ['$http', '$q', 'TASK_STATUS', function($http, $q, TASK_STATUS){
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

			this.$status = null;

			this.$resolved = true;
			this.$promise = null;

			angular.extend(this, value || {});
		};

		Task.prototype = {
			$getNowTime: getNowTime,
			$getAll: getAll,
			$save: save,
			$updateAll: updateAll
		};

		function getNowTime(){
			if (cached){
				return today;
			} else {
				var now = new Date();

				getAll().$promise.finally(function(){
				    now.setTime(today.getTime());
				});

				return now;
			}
		}

		/**
		 * Получение всех задач
		 * @returns {Array}
		 */
		function getAll(){
			if (!cached){

				tasks = [];
				tasks.$resolved = false;
				tasks.$promise = $http.get('./GetData.json')
					.finally(function(){
						tasks.$resolved = true;
					})
					.then(checkError)
					.then(function(result){

						var data = result.data;
						today = new Date(data.Today) || today;

						angular.forEach(data.Items, function(task){
							task = new Task(transformServerData(task));
							tasks.push(task);
						});

						return tasks;
					});

				cached = true;
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
			task.$promise = $http.post('./SaveTask.json')
				.finally(function(){
				    task.$resolved = true;
				})
				.then(checkError)
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

		/**
		 * Заменяет текстовые даты объектами и выставляет статус
		 * @param task
		 * @returns {*}
		 */
		function transformServerData(task){
			task.CreateTime = new Date(task.CreateTime) || null;
			task.DueTime = new Date(task.DueTime) || null;
			task.FinishTime = new Date(task.FinishTime) || null;

			if (task.IsFinished){
				task.$status = TASK_STATUS.FINISHED;
			} else if (task.DueTime < today){
				task.$status = TASK_STATUS.OVERDUE;
			} else if (task.DueTime > today && clearHMSMs2timeStamp(task.DueTime) == clearHMSMs2timeStamp(today)){
				task.$status = TASK_STATUS.TODAY;
			} else {
				task.$status = TASK_STATUS.LATER;
			}

			return task;
		}

		/**
		 * Очищает в дате время и возращает timestamp
		 * @param date
		 * @returns {number|null}
		 */
		function clearHMSMs2timeStamp(date){
			date = angular.copy(date);

			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);

		    return date.getTime() || null;
		}

		function checkError(result){
		    if (result.data.error){
				return $q.reject(result.data.error);
			}

			return result;
		}

		Task.getNowTime = Task.prototype.$getNowTime;
		Task.getAll = Task.prototype.$getAll;
		Task.updateAll = Task.prototype.$updateAll;

		return Task;
	}])
;