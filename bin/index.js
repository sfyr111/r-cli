#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const argv = require('yargs').argv
const init = require('../packages/init')
const syncBetaRemote = require('../packages/syncBetaRemote')
const publishBeta = require('../packages/publishBeta')
const publishRelease = require('../packages/publishRelease')
const genPathFile = require('../packages/genPathFile')
const testSync = require('../packages/testSync')
// const config = require('../platform.config')
const axios = require('axios')
const PKG = require('../package.json')
// let config = {};
// 配置文件如果存在则读取

// if(fs.existsSync(path.resolve('platform.config.js'))){
// 	config = require(path.resolve('platform.config.js'));
// }


!(async () => {
	// http://cms-admin.retailo2o.com/page/998/107 | /H5 发布项目配置
	// const data = await axios('https://miniapi.retailo2o.com/common/cms/publish/998/config/107.json?_platform_num=100100')
	// if (data.data.code !== 0) {
	// 	console.error('配置获取失败')
	// 	return process.exit(1)
	// }
	// const config = data.data.data
	const config = require('../platform.config')



	program
		.version(PKG.version,'-v, --version')
	
	program
		.command('init')
		.description('')
		.action(() => init(config))
	
	program
		.command('test <version>')
		.description('测试文件同步')
		.action((version) => {
			testSync(version)
		}) // 需要询问确定项目
	
	program
		.command('sync <version>')
		.description('同步测试环境文件')
		.action((version) => {
			syncBetaRemote(config, version)
		}) // 需要询问确定项目
	
	program
		.command('beta <src> <desc>')
		.description('发布至测试环境')
		.action((src, desc) => {
			publishBeta(src, desc)
		})
	
	program
		.command('publish <version>')
		.description('发布分支合并 master')
		.action((version) => {
			publishRelease(config, version)
		})
	
	
	program
		.command('new <projectPath>')
		.description('生成文件')
		.action((projectPath) => {
			genPathFile(projectPath)
		})
	
	program.parse(process.argv)
})()
