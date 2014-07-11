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
	.factory('Task', ['$http', '$q', '$rootScope', 'TASK_STATUS', function($http, $q, $rootScope, TASK_STATUS){
		var Task,
			tasks = [],
			cached = false,

			today = new Date(),
			timer,
			TIMER_INTERVAL = 1000 * 60,

			events = {},
			addEventListener, removeEventListener, fireEvent;

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
			this.$edit = false;
			this.$hide = false;

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

		/**
		 * Время сервера
		 * @returns {Date}
		 */
		function getNowTime(){
			getAll();
			return today;
		}

		/**
		 * Получение всех задач
		 * @returns {[Task]}
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
						today = extendDate(today, data.Today);

						angular.forEach(data.Items, function(task){
							task = new Task(updateStatus(task));
							tasks.push(task);
						});

						return tasks;
					})
					.then(function(tasks){
						fireEvent('change', tasks);
					    return tasks;
					});

				cached = true;
			}

		    return tasks;
		}

		/**
		 * Сохранение изменений задачи
		 * @returns {Task}
		 */
		function save(){
		    var task = this;

			task.$resolved = false;
			task.$promise = $http.post('./SaveTask.json', task)
				.finally(function(){
				    task.$resolved = true;
				})
				.then(checkError)

				//TODO: Удалить при запуске с сервером
				// Велосипед для тестов через json файлы
				.then(function(result){
					var maxId = 0;

				    if (!result.data || !result.data.Text){
						result.data = angular.copy(task);
						angular.forEach(tasks, function(task){
						    maxId = task.Id > maxId ? task.Id : maxId;
						});
						result.data.Id = ++ maxId;
					}
					return result;
				})


				.then(function(result){
					// Без Id значит создана новая задача добавляем в общий список
					if (!task.Id && result.data.Id) tasks.push(task);
				    angular.extend(task, updateStatus(result.data));
					task.$edit = false;
					task.$hide = false;
					return task;
				})
				.then(function(task){
					fireEvent('change', task);
				    fireEvent('save', task);
					return task;
				});

			return task;
		}

		/**
		 * Обнавление всех задач
		 * @returns {[Task]}
		 */
		function updateAll(){
		    cached = false;
			return getAll();
		}

		/**
		 * Выставляет статус
		 * @param task
		 * @returns {task}
		 */
		function updateStatus(task){
			if (task.IsFinished){
				task.$status = TASK_STATUS.FINISHED;
			} else if (task.DueTime < today){
				task.$status = TASK_STATUS.OVERDUE;
			} else if (task.DueTime >= today && clearHMSMs2timeStamp(task.DueTime) == clearHMSMs2timeStamp(today)){
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

		function extendDate(date, date2){
			if(angular.isDate(date) && angular.isDate(date2) && date2.getTime()){
				date.setTime(date2.getTime());
			}
		    return date;
		}

		/**
		 * Обновляет время и статусы задач
		 */
		timer = function(){
		    var oldTime = now(),
				interval = TIMER_INTERVAL,

			wait = function(){
				today.setTime(today.getTime() + now() - oldTime);
				oldTime = now();

				angular.forEach(tasks, function(task){
					updateStatus(task);
				});

				fireEvent('change', tasks);
				$rootScope.$apply();

				setTimeout(wait, interval);
			};

			setTimeout(wait, interval);

			function now(){
			    return new Date().getTime();
			}
		};
		timer();

		/**
		 * Event manager
		 */
		addEventListener = function(event, listener){
			if (!events[event]) events[event] = [];
			events[event].push(listener);
		};

		removeEventListener = function(event, listener){
			if (!events[event]) return undefined;
			var i = events[event].instanceOf(listener);
			if (i > -1){
				events[event].splice(i, 1);
			}
		};

		fireEvent = function(event){
			var arg = arguments;
			arg = Array.prototype.slice.call(arg, 1);
			angular.forEach(events[event], function(listener){
				listener.apply(listener, arg);
			});
		};


		Task.getNowTime = Task.prototype.$getNowTime;
		Task.getAll = Task.prototype.$getAll;
		Task.updateAll = Task.prototype.$updateAll;

		Task.addEventListener = addEventListener;
		Task.removeEventListener = removeEventListener;
		Task.fireEvent = fireEvent;

		Task.STATUS = TASK_STATUS;

		return Task;
	}])
;