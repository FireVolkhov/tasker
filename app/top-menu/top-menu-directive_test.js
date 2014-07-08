/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('top-menu', function(){
	it('Отображение топ меню', function() {
		expect(element(by.css('.topMenu')).isDisplayed()).toBe(true);
	});
});