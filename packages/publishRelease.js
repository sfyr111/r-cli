const bluebird = require('bluebird')
const gitp = require('simple-git/promise')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer');

const workDir = path.resolve('.')

module.exports = async (config, version) => {
	
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
			const projectDir = path.resolve(workDir, `./project/${name}`)
			const git = gitp(projectDir)
			console.log(projectDir)
			
			const needBranchName = `release-${version}`
			// const r = await git(projectDir).checkoutBranch(newBranchName, 'master')
			const r = await git.branchLocal()
			// const r = await git(projectDir).status()
			console.log(r.all)
			const allBranchs = r.all
			
			if (!~allBranchs.indexOf(needBranchName)) {
				console.log(chalk.red('不存在分支版本', needBranchName))
				process.exit(1)
			}
			
			// 打印 status 检查发布项目变动情况
			
			const status = await git.status()
			// console.log(status)
			console.log(chalk.blue('当前分支', needBranchName, '\n'))
			console.log(chalk.red('当前未提交的文件有:', '\n'))
			status.not_added.forEach(file => console.log(chalk.red(file)))
			
			inquirer.prompt([
				{
					type: 'confirm',
					name: 'confirmed',
					message: `确认发布${name}商户的${needBranchName}吗`,
					default: false
				}
			]).then(async ({ confirmed }) => {
				
				if (!confirmed) {
					console.log(chalk.red('取消发布'))
					process.exit(1)
				}
				const master = 'fmaster'
				
				// 先 commit 发布分支
				await git.checkout(needBranchName)
				await git.add('.')
				await git.commit(needBranchName + '发布')
				await git.checkout(master)
				const m = await git.mergeFromTo(needBranchName, master)
				// push master
				// tag
				const r = await git.log()
				
				console.log(r.all[0])
				
				// 6 切换master
				// 切个假分支 fmaster
				// const m = await git.checkout(master)
				// console.log(m)
				// 7 merge 发布分支
				// const r = await git.mergeFromTo(needBranchName, master)
				
				// console.log(r)
				// 9 push master
				
				// 10 生成 tag
				// 11 log 获得 commit 值
			})
		}
	)
}


// var questions = [
// 	{
// 		type: 'editor',
// 		name: 'bio',
// 		message: 'Please write a short bio of at least 3 lines.',
// 		validate: function(text) {
// 			if (text.split('\n').length < 3) {
// 				return 'Must be at least 3 lines.';
// 			}
//
// 			return true;
// 		}
// 	}
// ];
//
// inquirer.prompt(questions).then(answers => {
// 	console.log(JSON.stringify(answers, null, '  '));
// });
