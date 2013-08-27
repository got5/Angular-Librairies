var app = angular.module('app', [ 'jqm' ]);

app.config([
		'$routeProvider',
		'$locationProvider',

		function($routeProvider, $locationProvider) {

			$locationProvider.html5Mode(true);
			
			$routeProvider.when('/', {
				templateUrl: 'templates/views/home.html',
				controller: HomeController,
				animation: null,
                access: null
			}).when('/login', {
				templateUrl: 'templates/views/login.html',
				controller: LoginController,
				animation: 'page-slide',
                access: null
			}).otherwise({
				redirectTo : '/'
			});
		} ]);