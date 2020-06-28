const semver = require("semver");
const { engines } = require("../package");
const version = engines.node;
console.log(process.version, version)
if (!semver.satisfies(process.version, version)) {
	console.error('node version error')
	process.exit(1);
}

