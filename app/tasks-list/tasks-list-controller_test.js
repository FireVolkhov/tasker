/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('tasks-list', function(){
	var texts = ["Показать список задач", "Реализовать изменение статуса", "Раскрасить задачи", "Добавление новой задачи", "Поиск задачи", "Показать график", "Обновить график после изменения данных", "Редактирование задач из списка и поиска"];

	it('Отображение списка задач', function() {
		texts.forEach(function(text){
			expect(element(by.css('.tasksList')).getText()).toContain(text);
		});
	});
});