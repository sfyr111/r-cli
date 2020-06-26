const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

module.exports = async (projectPath) => {

	const reactPath = require.resolve('../template/generator-ui/app')
	
	env.register(reactPath, 'my:app');
	
	env.run('my:app', { projectPath } ,() => console.log('done'));
}

// https://www.jianshu.com/p/93211004c5ac
// https://juejin.im/post/5d83caf2f265da03ba3279e5#heading-6
// https://github.com/korbinzhao/generator-vueui
// https://juejin.im/post/5a488bd2f265da431c70a625#heading-24