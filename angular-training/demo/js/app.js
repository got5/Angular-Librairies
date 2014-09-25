var app = angular.module("app",[]);

app.factory('SonService', function ($http, $q) {
    return {
        getWeather: function() {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.get('customers.json')
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        return "hello";
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    };
});

var mainCtrl = function($scope,SonService){
    // function somewhere in father-controller.js
    var makePromiseWithSon = function() {
        // This service's function returns a promise, but we'll deal with that shortly
        SonService.getWeather()
            // then() called when son gets back
            .then(function(data) {
                // promise fulfilled
                if (data.forecast==='good') {
                    console.log("hello");
                } else {
                    console.log("hello2");
                }
            }, function(error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log("fail");
            });
    };

    makePromiseWithSon();
}
