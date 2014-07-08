/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('add-new-task-button-directive', ['template/add-new-task/add-new-task-button.html', 'task-window-directive'])
	.directive('addNewTaskButton', [function(){
		return {
			replace: true,
			templateUrl: "template/add-new-task/add-new-task-button.html",
			link: function(scope, elem, attrs){
			    scope.open = false;
			}
		}
	}])
;

angular.module('template/add-new-task/add-new-task-button.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/add-new-task/add-new-task-button.html',
		'<div class="addNewTaskButton">' +
		'	<i class="glyphicon glyphicon-plus" ng-click="open = !open"></i>' +
		'	<div task-window open="open"></div>' +
		'</div>'
	);
}]);