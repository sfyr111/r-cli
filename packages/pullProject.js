const git = require('simple-git/promise')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

// const workDir = path.resolve(__dirname, '..')
const workDir = path.resolve('.')

module.exports = async function(platformName, config) {
	
	const projectDir = path.resolve(workDir, `./project/${platformName}`)
	
	await fse.remove(projectDir)
	
	const has = await fse.exists(projectDir)
	if (!has) await fse.ensureDir(projectDir)
	
	console.log(chalk.blue(`正在拉取代码... ${config[platformName].hubAddress}`))
	
	await git().clone(config[platformName].hubAddress, projectDir)
		.then(res => console.log(chalk.green(`代码拉取成功.`)))
		.catch(err => console.error(chalk.red(`代码拉取失败: ${err}`)))
}
