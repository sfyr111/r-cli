const inquirer = require('inquirer');
const pullProject = require('./pullProject')

module.exports = (config) => {
	
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'name',
				message: "请选择部署商户",
				choices: Object.keys(config)
			},
		]).then(async answers => {
			const { name } = answers
			await pullProject(name, configprompts)
		});
}
