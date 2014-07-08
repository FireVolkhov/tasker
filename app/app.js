/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('tasker', ['appController', 'taskList', 'top-menu', 'ui.router'])
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
;