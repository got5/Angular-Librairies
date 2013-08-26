var app = angular.module('app', [ 'ngCookies', 'localization', 'firebase', 'ui.bootstrap', 'ngResource' ]);

/** Services configuration */
app.config(
    [
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider)
    {
    	
        $locationProvider.html5Mode(false);

        $routeProvider.when('/', {
            templateUrl: 'templates/views/home.html',
            controller: HomeController,
            access: null
        }).when('/login', {
            templateUrl: 'templates/views/login.html',
            controller: LoginController,
            access: null
        }).when('/books', {
            templateUrl: 'templates/views/catalog.html',
            controller: CatalogController,
            access: null
        }).when('/book/:id', {
            templateUrl: 'templates/views/detail.html',
            controller: DetailController,
            access: null
        }).when('/basket', {
            templateUrl: 'templates/views/basket.html',
            controller: BasketController,
            access: null
        }).when('/profile', {
            templateUrl: 'templates/views/profile.html',
            controller: ProfileController,
            access: null
        }).when('/404', {
            templateUrl: 'templates/views/404.html',
            access: null
        }).otherwise({
            redirectTo : '/404'
        });
    }
    ]);