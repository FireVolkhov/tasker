/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('add-new-task-button-directive', ['template/add-new-task/add-new-task-button.html', 'task-window-directive', 'ui.bootstrap.position'])
	.directive('addNewTaskButton', ['$document', '$position', function($document, $position){
		return {
			replace: true,
			templateUrl: "template/add-new-task/add-new-task-button.html",
			link: function(scope, elem, attrs){
				scope.open = false;

				scope.openWin = function(){
					scope.open = !scope.open;
					if (scope.open){
						scope.position = $position.position(elem);
						scope.position.top = scope.position.top + elem.prop('offsetHeight');
						scope.position.right = $document.children('html')[0].offsetWidth - scope.position.left - scope.position.width;
					}
				};

				var dismissClickHandler = function (evt) {
					var target = angular.element(evt.target),
						clickInDirective = false;

					// Клик внутри директивы?
					if (scope.open){
						while(target[0] !== $document[0]){
							if (elem[0] === target[0]) {
								clickInDirective = true;
								break;
							}
							target = target.parent();
						}
					}

					if (!clickInDirective){
						scope.open = false;
						scope.$digest();
					}
				};

				$document.bind('click', dismissClickHandler);

				scope.$on('$destroy', function(){
					$document.unbind('click', dismissClickHandler);
				});
			}
		}
	}])
;

angular.module('template/add-new-task/add-new-task-button.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/add-new-task/add-new-task-button.html',
			'<div class="addNewTaskButton">' +
			'	<i class="addNewTaskButton-iconPlus" ng-click="openWin()"></i>' +
			'	<div task-window open="open" position="position"></div>' +
			'</div>'
	);
}]);