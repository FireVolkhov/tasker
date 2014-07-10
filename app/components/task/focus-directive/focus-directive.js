/**
 *
 *
 * Created on 09.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('focus-directive', [])
	.directive('focus', [function(){
		return {
			link: function(scope, elem, attrs){
				elem[0].focus();
			}
		}
	}])
;