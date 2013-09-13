angular.module('app', [ 'gpsServices', 'ngCookies', 'localization', 'firebase', 'ui.bootstrap', 'ngResource' ])
	.config([
	    '$routeProvider',
	    '$locationProvider',
	    'UserServiceProvider',
	    function($routeProvider, $locationProvider, userServiceProvider)
	    {
	    	userServiceProvider.setDebugMode(true);
	    	
	        $locationProvider.html5Mode(false);
	
	        $routeProvider.when('/', {
	            templateUrl: 'templates/views/home.html',
	            controller: 'HomeController'
	        }).when('/login', {
	            templateUrl: 'templates/views/login.html',
	            controller: 'LoginController'
	        }).when('/books', {
	            templateUrl: 'templates/views/catalog.html',
	            controller: 'CatalogController'
	        }).when('/book/:id', {
	            templateUrl: 'templates/views/detail.html',
	            controller: 'DetailController'
	        }).when('/basket', {
	            templateUrl: 'templates/views/basket.html',
	            controller: 'BasketController'
	        }).when('/profile', {
	            templateUrl: 'templates/views/profile.html',
	            controller: 'ProfileController'
	        }).when('/404', {
	            templateUrl: 'templates/views/404.html'
	        }).otherwise({
	            redirectTo : '/404'
	        });
	    }
    ]);