'use strict';
var application = angular.module('angularTrainingApp',
        [ 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'firebase', 'directives', 'filters', 'services' ])
    .config(function ($routeProvider, $locationProvider, $compileProvider, $injector, $provide) {

        var request = new XMLHttpRequest();
        request.open("GET", "data/slides.json", false);
        request.send(null);
        application.slides = JSON.parse(request.responseText);
        $locationProvider.html5Mode(false); // TODO

        $routeProvider
            .when('/', {templateUrl: 'partials/main.html'});
        angular.forEach(application.slides, function(route) {
            $routeProvider.when("/" + route.content, {
                templateUrl : "partials/" + route.content + ".html"
            });
        });

        // Used for the slide code samples, to dynamically add directives.
        application.compileProvider = $compileProvider;
        application.injector = $injector;

        $provide.decorator('$log', [ '$delegate',
            'configurationData', function ($delegate, config) {
                return {
                    error: function (text) {
                        return $delegate.error(text);
                    },
                    warn: function (text) {
                        return $delegate.warn(text);
                    },
                    log: function (text) {
                        return $delegate.log(text);
                    },
                    info: function (text) {
                        if (config.mode == 'development') {
                            $delegate.info("[INFO] " + text);
                        }
                    }
                };
            }
        ]);
    });