(function () {
    "use strict";

    angular.module('app')
        .controller('LoginController', ['$scope' , '$http', '$log', '$cookies', '$location', function ($scope, $http, $log, $cookies, $location) {
            $scope.errorMsg = null;

            $scope.logUser = function () {
                $http.post('/api/login', {login: $scope.login, password: $scope.password})
                    .success(function (user) {
                        $log.info('Authentication successed !');
                        /**
                         * Add the auth token to the http headers. It's that token which allow you to be authenticated on your Server.
                         */
                        $http.defaults.headers.common.Authentication = user.token;
                        /**
                         * Save the token in the cookies to not lose the token when the page is refreshed
                         */
                        $cookies.token = user.token;
                        /**
                         * We don't want the token to be everywhere in the app
                         */
                        user.token = '';
                        $location.path('/');

                    })
                    .error(function (reason) {
                            $log.error('unable to log  ' + reason);
                            $scope.errorMsg = "Bad Login and/or password";
                    });

            };
        }]);
}());








