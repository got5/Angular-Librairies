'use strict';

var application = angular.module('angularTrainingApp',
        [ 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'directives', 'filters', 'services' ])
    .config(function ($routeProvider, $locationProvider, $compileProvider, $injector, $provide) {

        var request = new XMLHttpRequest();
        request.open("GET", "slides", false);
        request.send(null);

        //var jsonRes= request.responseText.replace(/\\\r\n/g, ' ');
        var jsonRes= request.responseText;



        application.slides = JSON.parse(jsonRes);
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


var request = new XMLHttpRequest();
request.open("GET", "/options", false);
request.send(null);

application.constant('customOptions', angular.fromJson(request.responseText));