/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('tasker', ['appController', 'taskList', 'ui.router'])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('tasks-list', {
				url: "/",
				templateUrl: "app/tasks-list/tasks-list.html",
				controller: 'taskListController as tasksCtrl'
			});
	}])
;