/**
 *
 *
 * Created on 10.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('scroll-directive', [])
	.directive('scroll', [function(){
		return {
			restrict: 'A',
			link: function(scope, elem, attrs){
				scope.$watch(attrs.scroll, function(value){
					if (value){
						var parent = elem.parent()[0],

							visibleUp = parent.scrollTop,
							visibleDown = parent.scrollTop + parent.offsetHeight,
							elemUp = elem[0].offsetTop,
							elemDown = elem[0].offsetTop + elem[0].offsetHeight,

							offsetUp = elemUp - visibleUp,
							offsetDown = elemDown - visibleDown;

						if (offsetUp < 0){
							parent.scrollTop = parent.scrollTop + offsetUp;
						} else if (offsetDown > 0) {
							parent.scrollTop = parent.scrollTop + offsetDown;
						}
					}
				});
			}
		}
	}])
;