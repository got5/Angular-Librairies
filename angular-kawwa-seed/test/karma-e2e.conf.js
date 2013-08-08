module.exports = function(config) {
  config.set({
    urlRoot: '/_karma_/',
    proxies: {
    	'/': 'http://localhost:9000/'
    },
    files: [  
        '../e2e/{,*/}*.js'
	],
	browsers: [
		'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' // ['Chrome', 'Firefox']
	],
  });
};
