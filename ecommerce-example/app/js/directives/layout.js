define(['appModule', 'services/UserService'], function(app)
{
	/** Layout directive controller */
	var LayoutController = function($scope, $cookies, $rootScope, $location, $route, userService) {
		
		/** Gets registered user from cookies. */
		if (!userService.isLoggedIn() && $cookies.loginECommerce != undefined && $cookies.passwordECommerce != undefined) {
			userService.logUser($cookies.loginECommerce, $cookies.passwordECommerce)
				.success(function (user) {
					$scope.user = userService.currentUser;
				});
		}
		
		/** User access check, could also be done with $rootScope.$on("$routeChangeStart"...) */
		$rootScope.authError = null;
	    if (!userService.isAuthorized($route.current.access)) {
	    	if(userService.isLoggedIn()) {
	    		$rootScope.authError = "Access forbidden!";
	    		$location.path('/');
	    	} else { 
	    		$rootScope.authError = "You need to login before!";
	    		$location.path('/login');
	    	}
	    }
		
		$scope.user = userService.currentUser;
		$scope.nbItems = userService.getCartNbItems();
		
		/** Logout function */
		$scope.logout = function() {
			userService.logout();
			$scope.user = null;
			$location.path('/');
		};
	};
	
	/** Layout directive. Wraps every view in the application. */
    app.lazy.directive('layout', function() {
    	return {
    		restrict: 'E',
    		replace: true,
    		transclude: true,
    		templateUrl: "templates/partials/layout.html",
			controller : [ 
			    '$scope', '$cookies', '$rootScope', '$location', '$route', 'UserService',
			    function($scope, $cookies, $rootScope, $location, $route, userService) {
			    	return new LayoutController($scope, $cookies, $rootScope, $location, $route, userService);
			}]
    	};
    });
});