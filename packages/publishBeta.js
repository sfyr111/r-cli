const git = require('simple-git/promise')
const fse = require('fs-extra')
const bluebird = require('bluebird')
const readfile = require('fs').readFile
const path = require('path')
const chalk = require('chalk')
const Rsync = require('rsync')

const workDir = path.resolve(__dirname, '..')

module.exports = async function(src, desc) {
	
	console.log(src, desc)
	const rsync = new Rsync()
		.shell('ssh')
		.flags('azvph')
		.delete()
		.source(src)
		.destination(desc);
	
	const execute = bluebird.promisify(rsync.execute, { context: rsync })
	
	const result = await execute()
	console.log(result)
	// rsync.execute(function(error, code, cmd) {
	// 	if (error)
	// 		return error
	//
	// 	console.log(code)
	// 	console.log(cmd)
	// 	console.log('同步成功')
	// });
}