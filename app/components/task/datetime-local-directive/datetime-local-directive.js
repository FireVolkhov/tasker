/**
 *
 *
 * Created on 10.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('datetime-local-directive', [])
	.directive('datetimeLocal', ['$filter', function($filter){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$formatters.unshift(function(value){
					if (angular.isDate(value) && value.getTime()){
						return $filter('date')(value, 'yyyy-MM-ddTH:mm');
					}
					return value;
				});
				ctrl.$parsers.unshift(function(value){
					var date = new Date(value);

					if (date.getTime()){
						return local2global(date);
					}
					return undefined;
				});

				function local2global(local){
				    return new Date(local.getTime() + local.getTimezoneOffset() * 60 * 1000);
				}
			}
		};
	}])
;