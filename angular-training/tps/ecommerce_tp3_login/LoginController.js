/** Login view controller */
var LoginController = function($scope, $http, $location, $cookies, $log)
{
	$scope.errorMsg = null;

	/** Called on a click on the Login button. */
	$scope.logUser = function() {
		/** Gets all users... */
		$http.get('/data/users.json')
			.success(function(users) {
				/** ... And checks if one of them has the good login/password. */
				for (var index = 0; index < users.length; index++) {
					var user = users[index];
					if (user.login == $scope.login && user.password == $scope.password) {
						/** Login is registered in a cookie. */
						$cookies.login = $scope.login;
						/** Redirects on home page. */
						$location.path("/");
					}
				}
				$scope.errorMsg = "User not found.";
			})
			.error(function(reason) {
				$log.error('Unable to load users...');
			});
	};
};
LoginController.$inject = ['$scope', '$http', '$location', '$cookies', '$log'];








