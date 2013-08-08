'use strict';

var application = angular.module('angularTrainingApp',
		[ 'ngResource', 'ui.bootstrap', 'directives', 'filters', 'services' ])
		.config(function($routeProvider, $locationProvider, $compileProvider, $injector, $provide) {
			$locationProvider.html5Mode(false); // TODO

			$routeProvider.when('/', {
				templateUrl : 'partials/main.html'
			}).otherwise({
				redirectTo : '/'
			});

			// Used for the slide code samples, to dynamically add directives.
			application.compileProvider = $compileProvider;
			application.injector = $injector;

			$provide.decorator('$log', [ '$delegate',
				'configurationData', function($delegate, config) {
					return {
						error : function(text) { return $delegate.error(text); },
						warn : function(text) { return $delegate.warn(text); },
						log: function(text) { return $delegate.log(text); },
						info : function(text) {
							if (config.mode == 'development') {
								$delegate.info("[INFO] " + text);
							}
						}
					};
				} 
			]);
		});
		