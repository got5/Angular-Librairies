'use strict';

var application = angular.module('trainingApp',
        [ 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'training.editor' ])
    .config(['$routeProvider','$locationProvider','$compileProvider','$injector',
        function ($routeProvider, $locationProvider, $compileProvider, $injector) {

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

    }]);