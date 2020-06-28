'use strict';
const path = require('path');

module.exports = function (plop) {
	
	const template = path.join(__dirname, '../template', 'plop-template')
	const srcPath = path.join(process.cwd(), 'src')
	
	const delayLog = msg => answers => new Promise((resolve) => {
		setTimeout(() => resolve(msg), 1000);
	});

	plop.setGenerator('component', {
		description: 'this is a component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your component name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}
		],
		actions: [
			// `this is a comment`,
			// delayLog('delayed thing'),
			{
				type: 'add',
				path: `${srcPath}/component/{{ dashCase name }}/{{ dashCase name }}.tsx`,
				templateFile: `${template}/component/component.tsx.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/component/{{ dashCase name }}/{{ dashCase name }}.styl`,
				templateFile: `${template}/component/component.styl.hbs`,
				abortOnFail: true
			},
		]
	});

	plop.setGenerator('container', {
		description: 'this is a container',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your container name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}
		],
		actions: [
			// `this is a comment`,
			// delayLog('delayed thing'),
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/{{ dashCase name }}.tsx`,
				templateFile: `${template}/container/container.tsx.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/{{ dashCase name }}.styl`,
				templateFile: `${template}/container/container.styl.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/store/api.ts`,
				templateFile: `${template}/container/store/api.ts.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/store/{{ dashCase name }}.action.ts`,
				templateFile: `${template}/container/store/container.action.ts.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/store/{{ dashCase name }}.reducer.ts`,
				templateFile: `${template}/container/store/container.reducer.ts.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/store/{{ dashCase name }}.saga.ts`,
				templateFile: `${template}/container/store/container.saga.ts.hbs`,
				abortOnFail: true
			},
			{
				type: 'add',
				path: `${srcPath}/container/{{ dashCase name }}/store/{{ dashCase name }}.type.ts`,
				templateFile: `${template}/container/store/container.type.ts.hbs`,
			},
		]
	});
	
};


// https://juejin.im/post/5d83caf2f265da03ba3279e5#heading-3
// https://github.com/SawyerSven/sea-admin/blob/master/plop-templates/view/prompt.js
// https://juejin.im/post/5e3cf407f265da576c24b93f#heading-12
// https://github.com/lagoufed/fed-e-code/blob/master/part-02/module-01/02-06-plop-react-app/plop-templates/component.js.hbs
