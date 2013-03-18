var convict = require('convict')
var pkg = require('./package.json')
var conf = convict({
	name: {
		doc: 'app name'
		, format: '*'
		, default: pkg.name || 'ooxx'
		, env: ''
	}
	, env: {
		doc: 'select app running ENV'
		, format: ['development', 'production', 'test']
		, default: 'development'
		, env: ''
	}
	, url: {
		doc: 'project url'
		, format: 'url'
		, default: pkg.url || 'http://ooxx.org'
		, env: ''
	}
	, email: {
		doc: 'feedback email'
		, format: 'email'
		, default: pkg.email || 'leecade@163.com'
		, env: ''
	}
})
var env = conf.get('env')
conf.loadFile('./config/' + env + '.json').validate()
module.exports = conf