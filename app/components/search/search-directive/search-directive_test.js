/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('search-directive', function(){
	var ptor = protractor.getInstance(),
		searchInput = function(){
			return element(by.css('.search [data-ng-model="task"]'));
		};

	it('Поиск "задач"', function() {
		var matches = ["Показать список задач", "Раскрасить задачи", "Добавление новой задачи"];

		searchInput().sendKeys('задач');
		element(by.css('.search ul')).getText().then(function(text){
			matches.forEach(function(task){
				expect(text).toContain(task);
			});
		});

		searchInput().clear();
	});
	it('Прокрутка по клавиатуре', function(){
		searchInput().sendKeys('задач');
		element.all(by.css('.search .searchTaskTypeahead')).count().then(function(count){
			for(var i = 0; i < count; i ++){
				searchInput().sendKeys(protractor.Key.DOWN);
				expect(isDisplayedInScroll('.search .active')).toBe(true);
			}
		});

		searchInput().clear();
	});
	it('Редактрования из поиска', function(){
		searchInput().sendKeys('задач');
		element(by.css('.search ul .searchTaskTypeahead:first-child .searchTaskTypeahead-text')).getText()
			.then(function(text){
				searchInput().sendKeys(protractor.Key.ENTER);
				var elem = browser.driver.switchTo().activeElement();
				expect(elem.getAttribute('value')).toBe(text);

				element.all(by.css('.tasksList .taskDirective')).each(function(elem){
					elem.findElements(by.css('.task-text textarea')).then(function(elements){
						if (elements.length == 1){
							return elements[0].getAttribute('value');
						} else {
							return "";
						}
					}).then(function(value){
						if (value == text) elem.findElement(by.css('.task-cancelButton')).click();
					});
				});
			});
	});

	/**
	 * Проверяет видно ли елемент в блоке с прокруткой
	 * @param {string} query
	 * @returns {promise}
	 */
	var isDisplayedInScroll = function(query){
		return element(by.css(query)).isDisplayed().then(function(displayed){
			if (!displayed) return false;

			return ptor.driver.executeScript(
					"var query = '" + query + "'," +
					"	elem = document.querySelector(query)," +
					"	parent = elem.parentNode," +

					"	visibleUp = parent.scrollTop," +
					"	visibleDown = parent.scrollTop + parent.offsetHeight," +
					"	elemUp = elem.offsetTop," +
					"	elemDown = elem.offsetTop + elem.offsetHeight;" +

					"return (elemUp >= visibleUp && elemUp < visibleDown) ||" +
					"	(elemDown > visibleUp && elemDown <= visibleDown)"
			);
		});
	};
});