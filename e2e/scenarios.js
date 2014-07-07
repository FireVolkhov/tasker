/**
 *
 *
 * Created on 04.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

(function(){

	describe('Start', function(){
		it('Open page', function(){
			var mockModule = require('./mocked-backend');
			var ptor = protractor.getInstance();
			ptor.addMockModule('httpBackendMock', mockModule);
			ptor.get('http://localhost:63342/tasker/index.html');
			expect(ptor.getCurrentUrl()).toContain('tasker');
			expect(ptor.getTitle()).toContain('Просмотор задач');
		});
	});
})();
