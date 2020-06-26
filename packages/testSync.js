const bluebird = require('bluebird')
const git = require('simple-git/promise')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer');
const Rsync = require('rsync')

const workDir = path.resolve('.')


console.log(chalk.red(`This platform is ${process.platform}\n`))

const stdoutHandler = function(data) {
	console.log(chalk.green('stdoutHandler: '))
	console.log(data.toString())
	console.log(chalk.green('================\n'))
}
const stderrHandler = function() {
	console.log(chalk.red('stderrHandler: '))
	console.log(data.toString())
	console.log(chalk.red('================\n'))
}

module.exports = async (txt) => {
	
	const outFile = path.resolve(workDir, `testSync.txt`)
	await fse.outputFile(outFile, txt)
	
	const cmd = new Rsync()
		.flags('avz')
		.shell('ssh')
		.source(outFile)
		.destination('appadmin@10.254.0.144:/home/appadmin/cli');
	
	cmd.execute(function(error, code, cmd) {
		console.log('code: ', code)
		if (error) {
			console.error(error)
			console.log('error: ', cmd)
			process.exit(1)
		}
		console.log('All done executing: ', cmd);
	}, stdoutHandler, stderrHandler);
}