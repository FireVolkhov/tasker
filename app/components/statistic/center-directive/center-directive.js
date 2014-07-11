/**
 *
 *
 * Created on 11.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('center-directive', [])
	.directive('center', ['$window', '$timeout', function($window, $timeout) {
		return{
			restrict: 'A',
			link: function(scope, elem, attrs){
				var parent = elem.parent();

				elem.css({"display": "none"});

				// Ждем когда завершится сборка других директив
				$timeout(function(){
					parent.css({"position": "relative"});
					elem.css({
						"display": "block",
						"position": "absolute",
						"top": "0px",
						"left": "0px"
					});

					update();
				});

				$window.addEventListener('resize', update);

				scope.$on('destroy', function(){
				    $window.removeEventListener('resize', update);
				});

				function update(){
					elem.css({
						"top": parent[0].offsetHeight/2 - elem[0].offsetHeight/2 + "px",
						"left": parent[0].offsetWidth/2 - elem[0].offsetWidth/2 + "px"
					});
				}
			}
		};
	}])
;