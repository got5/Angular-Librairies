/** Login view controller */
var LoginController = function($scope, $location, $cookies, userService)
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
};
LoginController.$inject = ['$scope', '$location', '$cookies', 'UserService'];








