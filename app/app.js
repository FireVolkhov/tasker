/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('tasker', ['appController', 'taskList', 'top-menu', 'ui.router',/*TODO: для тестов*/'ngMockE2E'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('tasks-list', {
				url: "/",
				templateUrl: "app/tasks-list/tasks-list.html",
				controller: 'taskListController as tasksCtrl'
			});

		$httpProvider.defaults.transformResponse.push(function(responseData){
			convertDateStringsToDates(responseData);
			return responseData;
		});

		var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(:(\d{2})(\.(\d{1,}))?)?(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

		function convertDateStringsToDates(input) {
			// Ignore things that aren't objects.
			if (typeof input !== "object") return input;

			for (var key in input) {
				if (!input.hasOwnProperty(key)) continue;

				var value = input[key];
				var match;
				// Check for string properties which look like dates.
				if (typeof value === "string" && (match = value.match(regexIso8601))) {
					var milliseconds = Date.parse(match[0]);
					if (!isNaN(milliseconds)) {
						input[key] = new Date(milliseconds);
					}
				} else if (typeof value === "object") {
					// Recurse into object
					convertDateStringsToDates(value);
				}
			}
		}
	}])

	//TODO: Для тестов
	.run(function($httpBackend) {
		var tasks = [
				{
					"Id": 1,
					"Text": "Показать список задач",
					"IsFinished": true,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-03T15:00:00.000Z",
					"FinishTime": "2014-07-03T10:00:00.000Z"
				},{
					"Id": 2,
					"Text": "Реализовать изменение статуса",
					"IsFinished": true,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-03T15:00:00.000Z",
					"FinishTime": "2014-07-03T10:00:00.000Z"
				},{
					"Id": 3,
					"Text": "Раскрасить задачи",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-03T15:00:00.000Z",
					"FinishTime": null
				},{
					"Id": 4,
					"Text": "Добавление новой задачи",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-03T15:00:00.000Z",
					"FinishTime": null
				},{
					"Id": 5,
					"Text": "Поиск задачи",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-04T15:00:00.000Z",
					"FinishTime": null
				},{
					"Id": 6,
					"Text": "Показать график",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-04T15:00:00.000Z",
					"FinishTime": null
				},{
					"Id": 7,
					"Text": "Обновить график после изменения данных",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-05T15:00:00.000Z",
					"FinishTime": null
				},{
					"Id": 8,
					"Text": "Редактирование задач из списка и поиска",
					"IsFinished": false,
					"CreateTime": "2014-07-03T00:00:00.000Z",
					"DueTime": "2014-07-05T15:00:00.000Z",
					"FinishTime": null
				}
			],
			count = 8;

		// Пропускаем запросы к темам
		$httpBackend.whenGET(/.*\.html/).passThrough();

		$httpBackend.whenGET('./GetData.json').respond(function(method, url, data){
			var data = {
				"Today": "2014-07-04T10:00:00.000Z",
				"Items": tasks
			};
			return [200, angular.toJson(data), {}];
		});
		$httpBackend.whenPOST('./SaveTask.json').respond(function(method, url, data){
			var data = angular.fromJson(data),
				regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(:(\d{2})(\.(\d{1,}))?)?(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/,
				task;

			if (!data.Text || !regexIso8601.test(data.DueTime)){
				return [500, {"error": "Bad request"}, {}];
			}

			if (data.Id){
				// Ищем задачу
				angular.forEach(tasks, function(t, i){
					if (t.Id == data.Id){
						task = t;
					}
				});
				if (!task){
					return [404, {"error": "Task with Id:" + data.Id + " not found"}, {}];
				}

				task.Text = data.Text;
				task.DueTime = data.DueTime;
				if (!task.IsFinished && data.IsFinished) {
					task.IsFinished = true;
					task.FinishTime = new Date();
				}

				return [200, angular.toJson(task), {}];
			} else {
				// Делаем новую
				task = {
					Id: ++ count,
					Text: data.Text,
					IsFinished: data.IsFinished || false,
					CreateTime: new Date(),
					DueTime: data.DueTime,
					FinishTime: data.IsFinished ? new Date() : null
				};

				tasks.push(task);

				return [200, angular.toJson(task), {}];
			}
		});
	});