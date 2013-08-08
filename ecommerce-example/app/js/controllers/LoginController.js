define(['appModule'], function(app)
{
	/** Login view controller */
    app.lazy.controller('LoginController',
    [
        '$scope', '$location', 'UserService',
        function($scope, $location, userService)
        {
        	$scope.logUser = function(login, password) {
        		userService.logUser(login, password).success(function(user) {
        			if (userService.currentUser) {
        				// Redirection to home page.
            			$location.path("/");
        			} else {
        				$scope.hasAuthFailed = true;
        			}
                });
        	};
        }
    ]);
});