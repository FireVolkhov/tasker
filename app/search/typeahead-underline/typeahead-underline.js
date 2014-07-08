/**
 *
 *
 * Created on 08.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('typeahead-underline', [])
	.filter('typeaheadUnderline', [function() {

		function escapeRegexp(queryToEscape) {
			return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
		}

		return function(matchItem, query) {
			return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="typeaheadUnderline">$&</span>') : matchItem;
		};
	}])
;