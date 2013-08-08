/** Root application controller */
var RootController = function($scope, $rootScope, $location, userService) {
	
	/** User access management */
	$rootScope.$on("$routeChangeStart", function (event, next, current) {
    	if (!userService.isAuthorized(next.access)) {
    		$location.path('/');
    	}
    });
};
RootController.$inject = ['$scope', '$rootScope', '$location', 'UserService'];