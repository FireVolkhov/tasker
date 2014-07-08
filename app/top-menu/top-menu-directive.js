/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('top-menu', ['template/top-menu/top-menu.html'])
	.directive('topMenu', [function(){
		return {
			replace: true,
			templateUrl: "template/top-menu/top-menu.html"
		}
	}])
;

angular.module('template/top-menu/top-menu.html', []).run(['$templateCache', function($templateCache) {
	$templateCache.put('template/top-menu/top-menu.html',
			'<nav class="topMenu">' +
			'	<div class="container">' +
			'		<div class="topMenu-search-container">' +
			'			<input type="text" class="form-control" placeholder="Search">' +
			'		</div>' +
			'		<div class="topMenu-buttons-container">' +
			'			<i class="glyphicon glyphicon-plus"></i>' +
			'		</div>' +
			'	</div><!-- /.container-fluid -->' +
			'</nav>'
	);
}]);