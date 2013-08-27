define(
		[ 'config/routes', 'services/dependencyResolver', 'lib/angular/angular-cookies', 'directives/mainLayout',
		  'lib/angular/localize', 'lib/angular/ui-bootstrap-tpls-0.4.0', 'lib/angular/angular-fire', 'lib/angular/angular-resource' ], 
		function(config, dependencyResolver)
{
    var app = angular.module('app', [ 'ngCookies', 'ngResource', 'localization', 'firebase', 'ui.bootstrap', 'directives' ]);
    
    /** Services configuration */
    app.config(
    [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide)
        {
        	// References angular providers to use them later.
            app.lazy =
            {
                controller : $controllerProvider.register,
                directive : $compileProvider.directive,
                filter : $filterProvider.register,
                factory : $provide.factory,
                service : $provide.service,
                value : $provide.value
            };
            
            $locationProvider.html5Mode(false);

            if(config.routes !== undefined)
            {
            	// Registers all routes in appRoutes.js
                angular.forEach(config.routes, function(route, path)
                {
                    $routeProvider.when(path, {
                    	templateUrl: route.templateUrl, 
                    	resolve: dependencyResolver(route.dependencies),
                    	access: route.access
                    });
                });
            }

            if(config.defaultRoutePath !== undefined)
            {
                $routeProvider.otherwise({redirectTo: config.defaultRoutePath});
            }
        }
    ]);

   return app;
});