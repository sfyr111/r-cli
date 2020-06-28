const path = require('path')
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();
const { run, Plop } = require('plop')
const args = process.argv.slice(2);
const argv = require('minimist')(args);

async function genTemplate(projectPath) {
	const reactPath = require.resolve('../template/generator-ui/app')
	env.register(reactPath, 'my:app');
	env.run('my:app', { projectPath } ,() => console.log('项目模板生成成功'));
}

async function genComponent(name) {
	const configPath = path.join(__dirname, 'plopfile.js')
	
	Plop.launch({
		cwd: argv.cwd,
		configPath,
		require: argv.require,
		completion: argv.completion
	}, env => run(env, undefined, true));

}

async function genContainer(name) {
	const configPath = path.join(__dirname, 'plopfile.js')
	
	Plop.launch({
		cwd: argv.cwd,
		configPath,
		require: argv.require,
		completion: argv.completion
	}, env => run(env, undefined, true));

}

module.exports = {
	genTemplate,
	genComponent,
	genContainer,
}

// https://www.jianshu.com/p/93211004c5ac
// https://juejin.im/post/5d83caf2f265da03ba3279e5#heading-6
// https://github.com/korbinzhao/generator-vueui
// https://juejin.im/post/5a488bd2f265da431c70a625#heading-24