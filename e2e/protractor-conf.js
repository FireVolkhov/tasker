/**
 *
 *
 * Created on 05.07.14.
 * @author FireVolkhov ( Sergey Gavrilov )
 * @mail FireVolkhov@gmail.com
 */
"use strict";

/**
 * Запуск теста
 * $ webdriver-manager start
 * $ protractor e2e/protractor-conf.js
 **/

	// An example configuration file.
exports.config = {
	allScriptsTimeout: 60000,
	// The address of a running selenium server.
	seleniumAddress: 'http://localhost:4444/wd/hub',

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome'
	},

	// Spec patterns are relative to the location of the spec file. They may
	// include glob patterns.
	specs: [
		'scenarios.js',
		'./../app/**/*_test.js',
	],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true, // Use colors in the command line report.
		defaultTimeoutInterval: 60000
	},

	rootElement: '[ng-app="tasker"]'
};