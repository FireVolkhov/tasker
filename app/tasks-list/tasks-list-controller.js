/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('taskList', ['task-service', 'task-directive'])
	.controller('taskListController', ['Task', function(Task){
		this.nowTime = Task.getNowTime();
		this.tasks = Task.getAll();
	}])
;