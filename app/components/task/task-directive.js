/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

angular.module('task-directive', [])
	.directive('task', [function(){
		return {
			scope: {
				task: "="
			},
			replace: true,
			template: '<div class="task-directive">\n    <div class="task-text">{{ task.Text }}</div>\n</div>'
		};
	}])
;