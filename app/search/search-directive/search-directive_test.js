/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('search-directive', function(){
	it('Поиск "задач"', function() {
		var matches = ["Показать список задач", "Раскрасить задачи", "Добавление новой задачи"];

		element(by.css('.search [data-ng-model="task"]')).sendKeys('задач');
		element(by.css('.search ul')).getText().then(function(text){
			matches.forEach(function(task){
			    expect(text).toContain(task);
			});
		});

		element(by.css('.search [data-ng-model="task"]')).clear();
	});
});