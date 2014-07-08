/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('search-directive', ['template/search/search-directive.html', 'template/search/search-task-typeahead.html', 'task-service', 'ui.bootstrap', 'typeahead-underline'])
	.directive('search', ['Task', function(Task){
		return {
			replace: true,
			templateUrl: "template/search/search-directive.html",
			link: function(scope, elem, attrs){
				scope.tasks = Task.getAll();
			}
		}
	}])
;

angular.module('template/search/search-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/search/search-directive.html',
			'<div class="search">' +
			'	<input type="text" class="form-control"' +
			'		data-ng-model="task"' +
			'		typeahead="task as task.Text for task in tasks | filter:$viewValue"' +
			'		typeahead-template-url="template/search/search-task-typeahead.html">' +
			'</div>'
	);
}]);

angular.module('template/search/search-task-typeahead.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/search/search-task-typeahead.html',
			'<div class="searchTaskTypeahead">' +
			'	<div class="searchTaskTypeahead-text" bind-html-unsafe="match.model.Text | typeaheadUnderline:query"></div>' +
			'	<div class="searchTaskTypeahead-dueTime">{{ match.model.DueTime | date: \'dd.MM.yyyy H:mm\' }}</div>' +
			'</div>'
	);
}]);