/** Login view controller */
angular.module('app').controller('LoginController', 
		[ '$scope', '$location', '$cookies', 'UserService', function($scope, $location, $cookies, userService)
{
	$scope.errorMsg = null;
	
	/** Called on a click on the Login button. */
	$scope.logUser = function() {
		userService.logUser($scope.login, $scope.password)
			.then(function(currentUser) {
				$cookies.login = currentUser.login;
				$location.path("/");
			}, function(reason) {
				$scope.errorMsg = reason;
			});
	};
}]);








