/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('add-new-task-button-directive', ['template/add-new-task/add-new-task-button.html'])
	.directive('addNewTaskButton', [function(){
		return {
			replace: true,
			templateUrl: "template/add-new-task/add-new-task-button.html"
		}
	}])
;

angular.module('template/add-new-task/add-new-task-button.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/add-new-task/add-new-task-button.html',
		'<div class="addNewTaskButton">' +
		'	<i class="glyphicon glyphicon-plus"></i>' +
		'	<div></div>' +
		'</div>'
	);
}]);