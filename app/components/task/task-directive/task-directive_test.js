/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('task-directive', function(){
	var ptor = protractor.getInstance(),
		task = {
			Text: "Новый текст задачи",
			DueTime: "25032014" + protractor.Key.RIGHT + "1700",
			DueTimeText: "25.03.2014 17:00"
		};

	it('Изменение статуса задачи', function() {
		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			elem.findElement(by.css('[ng-click="finished()"]')).click();
		});

		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			expect(elem.getAttribute('class')).toContain('task-status-finished');
		});
	});
	it('Редактирование задачи', function(){
		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			ptor.actions().mouseMove(elem).perform();
		    elem.findElement(by.css('.task-editButton')).click();
			var textElem = elem.findElement(by.model('task.Text'));
			var timeElem = elem.findElement(by.model('task.DueTime'));
			textElem.clear();
			textElem.sendKeys(task.Text);
			timeElem.clear();
			timeElem.sendKeys(task.DueTime);
			elem.findElement(by.buttonText('Сохранить')).click();

			expect(elem.findElement(by.model('task.Text')).getText()).toBe(task.Text);
			expect(elem.findElement(by.model('task.DueTime')).getText()).toBe(task.DueTimeText);
		});
	});
});