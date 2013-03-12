var convict = require('convict')
var pkg = require('./package.json')
var conf = convict({
	env: {
		doc: 'select app running ENV'
		, format: ['dev', 'test', 'release']
		, default: 'dev'
		, env: 'NODE_ENV'
	}
	, url: {
		doc: 'project url'
		, format: 'url'
		, default: pkg.url || 'http://ooxx.org'
		, env: 'URL'
	}
	, email: {
		doc: 'feedback email'
		, format: 'email'
		, default: pkg.email || 'leecade@163.com'
		, env: 'EMAIL'
	}
})
var env = conf.get('env')
conf.loadFile('./config/' + env + '.json').validate()
module.exports = conf