/**
 *
 *
 * Created on 07.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

module.exports = function() {
	angular.module('httpBackendMock', ['tasker', 'ngMockE2E'])
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
				var task;

			    if (data.Id){
					angular.forEach(tasks, function(t, i){
					    if (t.Id == data.Id){
							task = t;
						}
					});
					if (!task){
						return [404, {"error": "Task with Id:" + data.Id + " not found"}, {}];
					}

					task.Text = data.Text;
					if (!task.IsFinished && data.IsFinished) {
						task.IsFinished = true;
						task.FinishTime = new Date();
					}

					return [200, angular.toJson(task), {}];
				} else {

					if (!data.Text || !angular.isDate(data.DueTime)){
						return [500, {"error": "Bad request"}, {}]
					}

					task = {
						Id: ++ count,
						Text: data.Text,
						IsFinished: false,
						CreateTime: new Date(),
						DueTime: data.DueTime,
						FinishTime: null
					};

					tasks.push(task);

					return [200, angular.toJson(task), {}];
				}
			});
		});
};