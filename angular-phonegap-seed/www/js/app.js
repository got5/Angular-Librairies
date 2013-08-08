define(['config/routes', 'services/dependencyResolver' ], 
		function(config, dependencyResolver)
{
    var app = angular.module('app', [ 'jqm' ]);

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
                service : $provide.service
            };

            $locationProvider.html5Mode(true);

            if(config.routes !== undefined)
            {
            	// Registers all routes in appRoutes.js
                angular.forEach(config.routes, function(route, path)
                {
                    $routeProvider.when(path, {
                    	animation: route.animation,
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