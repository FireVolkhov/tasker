/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('add-new-task-button-directive', function(){
	it('Отбражение окна по клику', function() {
		element(by.css('.addNewTaskButton')).click();
		expect(element(by.css('.taskWindowDirective')).isDisplayed()).toBe(true);
	});
	it('Скрытие окна по второму клику', function() {
		element(by.css('.addNewTaskButton')).click();
		expect(element(by.css('.taskWindowDirective')).isDisplayed()).toBe(false);
	});
});