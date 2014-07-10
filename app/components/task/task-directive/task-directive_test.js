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
		},
		filingFormTask = function(elem, task){
			var textElem, timeElem;

			ptor.actions().mouseMove(elem).perform();

			elem.findElement(by.css('.task-editButton')).click();
			textElem = elem.findElement(by.model('task.Text'));
			timeElem = elem.findElement(by.model('task.DueTime'));
			textElem.clear();
			textElem.sendKeys(task.Text);
			timeElem.sendKeys(task.DueTime);

			return{
				save: function(){
					elem.findElement(by.buttonText('Сохранить')).click();
				},
				cancel: function(){
					elem.findElement(by.buttonText('Отмена')).click();
				}
			};
		};

	it('Изменение статуса задачи', function() {
		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			elem.findElement(by.css('[ng-click="finished()"]')).click();
		});

		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			expect(elem.getAttribute('class')).toContain('task-status-finished');
		});
	});
	it('Отмена редактирования востанавливает данные', function(){
		var taskElem = element(by.repeater('task in tasksCtrl.tasks').row(0));

		protractor.promise.all([
			taskElem.element(by.css('.task-text')).getText(),
			taskElem.element(by.css('.task-dueTime')).getText()
		]).then(function(result){
			filingFormTask(taskElem, task).cancel();

			expect(taskElem.findElement(by.css('.task-text')).getText()).toBe(result[0]);
			expect(taskElem.findElement(by.css('.task-dueTime')).getText()).toBe(result[1]);
		});
	});
	it('Редактирование задачи', function(){
		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			protractor.promise.all([
				elem.findElement(by.css('.task-text')).getText(),
				elem.findElement(by.css('.task-dueTime')).getText()
			]).then(function(result){
				filingFormTask(elem, task).save();

				expect(elem.findElement(by.css('.task-text')).getText()).toBe(task.Text);
				expect(elem.findElement(by.css('.task-dueTime')).getText()).toBe(task.DueTimeText);

				filingFormTask(elem, {
					Text: result[0],
					DueTime: result[1].replace(/(\d\d).(\d\d).(\d{4,4})\s(\d\d):(\d\d)/, '$1$2$3' + protractor.Key.RIGHT + '$4$5')
				}).save();
			});
		});
	});
});