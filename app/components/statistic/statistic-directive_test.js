/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('statistic-directive', function(){
	it('Отображение статистики', function(){
		expect(element(by.css('.statistic')).getText()).toMatch(/\d\d%\s\d\d%\s\d\d%\s\d\d%/);
	});
	it('Обнавление статистики', function(){
		element(by.css('.statistic')).getText().then(function(oldStatistic){
			element(by.repeater('task in tasksCtrl.tasks').row(3)).element(by.css('[ng-click="finished()"]')).click();
			expect(element(by.css('.statistic')).getText()).not.toBe(oldStatistic);
		});
	});
});