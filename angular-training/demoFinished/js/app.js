/**
 * Created by pierremarot on 19/02/2014.
 */
"use strict";

var app = angular.module('customerApp', ['ngRoute','ngAnimate']);

app.config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: '/views/customers.html',
        controller: 'CustomersController'
    }).when('/orders/:customerId', {
        templateUrl: '/views/orders.html',
        controller: 'OrdersController'
    });

})

app.controller('OrdersController',function($scope,$routeParams){
    $scope.customerId = $routeParams.customerId;

})
app.controller('CustomersController',function($scope,customersFactory){
    $scope.customers = [];
    
    customersFactory.query().success(function(data){
        $scope.customers = data;
        
    })
});

app.factory('customersFactory',function($http){
    var factory = {};
    
    factory.query = function(){
       return  $http.get('/customers.json')
    }
    return factory;
})