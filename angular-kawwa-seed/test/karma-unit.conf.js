module.exports = function(config) {
	config.set({
    
	    files: [
	    	//extra testing code
	    	'../../components/angular-mocks/index.js',
	    	
	    	'../../app/js/bootstrap.js',
	    	
	    	//test files
	    	'../unit/{,*/}*.js',
	    	
	    	'../test-main.js'
		],
		browsers: [
		    // 'PhantomJS'
		    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
		],
	});
};
