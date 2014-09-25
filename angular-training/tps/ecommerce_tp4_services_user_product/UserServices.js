(function () {
    "use strict";

    /** Service which handle all user logic. */
    var UserService = function ($http, $q, $log, $cookies, $cookieStore, User, isDebugMode) {

        /** Currently logged user. */
        var currentUser = null;

        var saveCurrentUser = function(){
            $cookieStore.put('cart',currentUser.cart.getItems());
            $cookieStore.put('user',currentUser);
        };

        this.getCurrentUser = function () {

            if (!currentUser) {
                currentUser = $cookieStore.get('user');
                if (!currentUser) {
                   /*todo complete what's missing*/
                }else{
                    currentUser.cart = User.createCart($cookieStore.get('cart'));
                }
            }
            return currentUser;
        };

        this.logUser = function (login, password) {
            // We create a promise to offer the possibility to users to call some functions after the
            // asynchronous call of $http.get.
            var deferred = $q.defer();

            /** Gets all users... */
            $http.post('/api/login', {login: login, password: password})
                .success(function (user) {
                    if (isDebugMode) {
                        $log.info('Authentication successed !');
                    }
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

                    /**
                     * Add Cart Method
                     */
                    user.cart = User.createCart(user.cart);
                    currentUser = user;
                    saveCurrentUser();
                    deferred.resolve(user);
                })
                .error(function (reason) {
                    if (isDebugMode) {
                        $log.error('unable to log  ' + reason);
                    }
                    deferred.reject("Bad login and/or password");
                });

            // A promise is returned, so we can make: userService.logUser(u, p).then(success, error).
            return deferred.promise;
        };


    };


    /** Registers our service in a new sub module. */
    angular.module('sdcoServices').provider('UserService',function() {

        var isDebugMode = false;

        this.setDebugMode = function (pIsDebug) {
            isDebugMode = pIsDebug;
        };

        this.$get = [ '$http', '$q', '$log', '$cookies', '$cookieStore', 'User', function ($http, $q, $log, $cookies, $cookieStore, User) {
            return new UserService($http, $q, $log, $cookies, $cookieStore, User, isDebugMode);
        }];
    });

}());