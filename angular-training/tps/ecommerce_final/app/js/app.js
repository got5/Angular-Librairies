(function () {
    "use strict";

    var app = angular.module('app', [ 'ngCookies', 'ngRoute', 'ui.bootstrap', 'pascalprecht.translate']);

    /** Services configuration */
    app.config(
        [
            '$routeProvider',
            '$locationProvider',
            '$translateProvider',
            function ($routeProvider, $locationProvider, $translateProvider) {

                $locationProvider.html5Mode(false);


                $routeProvider.when('/', {
                    templateUrl: 'templates/views/home.html',
                    controller: 'HomeController',
                    access: null
                }).when('/login', {
                    templateUrl: 'templates/views/login.html',
                    controller: 'LoginController',
                    access: null
                }).when('/books', {
                    templateUrl: 'templates/views/catalog.html',
                    controller: 'CatalogController',
                    access: null
                }).when('/book/:id', {
                    templateUrl: 'templates/views/detail.html',
                    controller: 'DetailController',
                    access: null
                }).when('/basket', {
                    templateUrl: 'templates/views/basket.html',
                    controller: 'BasketController',
                    access: null
                }).when('/profile', {
                    templateUrl: 'templates/views/profile.html',
                    controller: 'ProfileController',
                    access: null
                }).when('/404', {
                    templateUrl: 'templates/views/404.html',
                    access: null
                }).otherwise({
                    redirectTo: '/404'
                });

                $translateProvider.translations('en', {
                    "_Slogan": "All the books you need, at the highest price!",
                    "_Basket_Items_": "item(s) in your basket",
                    "_Logout_": "Logout",
                    "_Sign_In_": "Sign-in"
                });
                $translateProvider.translations('fr', {
                    "_Slogan": "All the books you need, at the highest price!",
                    "_Basket_Items_": "item(s) in your basket",
                    "_Logout_": "Logout",
                    "_Sign_In_": "Sign-in"
                });
            }
        ]).run(function run( $http, $cookies ){
        $http.defaults.headers.common.Authentication = $cookies.token;
    });
}());