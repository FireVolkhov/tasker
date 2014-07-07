/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

describe('task-directive', function(){
	it('Изменение статуса задачи', function() {
		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			elem.findElement(by.model('task.IsFinished')).click();
		});

		element.all(by.repeater('task in tasksCtrl.tasks')).each(function(elem){
			expect(elem.findElement(by.model('task.IsFinished')).getAttribute('checked')).toBe('true');
		});
	});
});