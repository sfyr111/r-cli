const bluebird = require('bluebird')
const git = require('simple-git/promise')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer');
const Rsync = require('rsync')

// const workDir = path.resolve(__dirname, '..')
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
			
			inquirer.prompt([
				{
					type: 'checkbox',
					name: 'projects',
					message: '选择项目',
					choices: config[name].projectNames
				}
			]).then(async (res) => {
				
				// 同步测试环境代码
				const projectDir = path.resolve(workDir, `./project/${name}`)
				// const projectDir = path.resolve(workDir, `./project/sdeer`)
				console.log(projectDir)
				const betaRemote = config[name].betaRemote
				
				const { projects } = res
				if (!projects.length) return
			
				const newBranchName = `release-${version}`
				const r = await git(projectDir).checkoutBranch(newBranchName, 'master')
				// const r = await git (projectDir).branchLocal()
				// const r = await git(projectDir).status()
				console.log(r)
				console.log(chalk.blue('发布分支: ', newBranchName))
				
				// 从测试环境同步本地, 删除本地无用文件
				const webTasks = projects.map(item => ([`appadmin@${betaRemote}:/data/web/${name}/${item}/`, `${projectDir}/web/${item}/`]))
				// const webTasks = projects.map(item => ([`appadmin@${betaRemote}:/data/web/sdeer/coupon/`, `${projectDir}/web/coupon/`]))
				const staticTasks = projects.map(item => ([`appadmin@${betaRemote}:/data/static/${name}/${item}/`, `${projectDir}/static/${item}/`]))
				// const staticTasks = projects.map(item => ([`appadmin@${betaRemote}:/data/static/sdeer/coupon/`, `${projectDir}/static/coupon/`]))
				
				console.log(webTasks, staticTasks)
				const syncResult = []
				
				while (!!webTasks.length && !!staticTasks.length) {
					
					const [web, st] = [webTasks.shift(), staticTasks.shift()]
					
					const webRsync = new Rsync()
						.shell('ssh')
						.flags('azvph')
						.delete()
						.source(web[0])
						.destination(web[1]);
					
					const stRsync = new Rsync()
						.shell('ssh')
						.flags('azvph')
						.delete()
						.source(st[0])
						.destination(st[1]);
					
					const stExecute = bluebird.promisify(stRsync.execute, { context: stRsync })
					const webExecute = bluebird.promisify(webRsync.execute, { context: webRsync })
					
					const result = await Promise.all([webExecute(), stExecute()]).catch((err) => console.error(err))
					console.log(result)
					console.log(syncResult)
					
					await new Promise((res) => setTimeout(res, 300))
					
					syncResult.push(...result)
					console.log(chalk.blue(`src: ${web[0]} - desc: ${web[1]}`))
					console.log(chalk.blue(`src: ${st[0]} - desc: ${st[1]}`))
					console.log(result.every(r => r === 0) ? chalk.green('同步成功') : chalk.red('同步失败'))
					console.log('\n')
				}
				
				if (syncResult.some(r => r !== 0)) {
					console.log(chalk.red('同步有失败任务'))
					process.exit(1)
				}
				
			})
		}
	)
	;
}

