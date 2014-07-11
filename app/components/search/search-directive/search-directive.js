/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('search-directive', ['search-templates', 'task-service', 'ui.bootstrap', 'typeahead-underline-filler', 'scroll-directive'])
	.directive('search', ['Task', function(Task){
		return {
			replace: true,
			templateUrl: "template/search/search-directive.html",
			link: function(scope, elem, attrs){
				scope.tasks = Task.getAll();
				scope.edit = function(task){
				    scope.task = null;
					task.$edit = true;
					task.$hide = false;
				};
			}
		}
	}])
;

angular.module('search-templates', ['template/search/search-directive.html', 'template/search/search-task-typeahead.html', 'template/search/typeahead-popup.html']);

angular.module('template/search/search-directive.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/search/search-directive.html',
			'<div class="search">' +
			'	<input type="text" class="form-control"' +
			'		data-ng-model="task"' +
			'		typeahead="task as task.Text for task in tasks | filter:$viewValue"' +
			'		typeahead-template-url="template/search/search-task-typeahead.html"' +
			'		typeahead-on-select="edit($model)">' +
			'</div>'
	);
}]);

angular.module('template/search/search-task-typeahead.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/search/search-task-typeahead.html',
			'<div class="searchTaskTypeahead searchTaskTypeahead-status-{{ match.model.$status }}">' +
			'	<div class="searchTaskTypeahead-text" bind-html-unsafe="match.model.Text | typeaheadUnderline:query"></div>' +
			'	<div class="searchTaskTypeahead-dueTime">{{ match.model.DueTime | date: \'dd.MM.yyyy H:mm\' }}</div>' +
			'</div>'
	);
}]);

angular.module("template/search/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
	$templateCache.put("template/typeahead/typeahead-popup.html",
			"<div class=\"dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
			"	<ul class='search-scroll'>\n" +
			"    	<li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index)}\" scroll=\"isActive($index)\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\">\n" +
			"        	<div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
			"    	</li>\n" +
			"	</ul>\n" +
			"</ul>");
}]);