/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('task-window-directive', function(){
	var task = {
			Text: "Кнопка \"скрыть\" для задачи по наведению курсора",
			DueDate: "25032014",
			DueTime: "1700"
		},
		elements = {
			text: function(){
				return element(by.css('.addNewTaskButton .taskWindow [data-ng-model="task.Text"]'));
			},
			dueTime: function(){
			    return element(by.css('.addNewTaskButton .taskWindow [data-ng-model="task.DueTime"]'));
			},
			addButton: function(){
				return element(by.css('.addNewTaskButton i'));
			},
			saveButton: function(){
			    return element(by.css('.addNewTaskButton')).element(by.buttonText('Сохранить'));
			},
			taskWindow: function(){
			    return element(by.css('.addNewTaskButton .taskWindow'));
			},
			taskList: function(){
			    return element(by.css('.tasksList'))
			}
		};


	it('Сохранения заполнения формы до нажатия "Сохранить"', function() {
		elements.addButton().click();

		elements.text().sendKeys(task.Text);
		elements.dueTime().sendKeys(task.DueDate, protractor.Key.RIGHT, task.DueTime);

		elements.addButton().click();
		elements.addButton().click();

		expect(elements.text().getAttribute('value')).toBe(task.Text);
//		expect(elements.dueTime().getAttribute('value')).toBe(task.DueTime);
	});
	it('Сохранение', function() {
		elements.saveButton().click();
		expect(elements.taskWindow().isDisplayed()).toBe(false);
		expect(elements.taskList().getText()).toContain(task.Text);
	});
	it('После сохранения форма не заполнена', function(){
		elements.addButton().click();

		expect(elements.text().getAttribute('value')).toBe('');
//		expect(elements.dueTime().getAttribute('value')).toBe('');

		elements.addButton().click();
	});
});