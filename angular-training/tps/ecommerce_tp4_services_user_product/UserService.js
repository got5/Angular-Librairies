/** Service which handle all user logic. */
var UserService = function($http, $q, $log) {
	
	/** Currently logged user. */
	var currentUser = null;
	
	this.getCurrentUser = function() {
		return currentUser;
	};
	
	this.logUser = function(login, password) {
		// We create a promise to offer the possibility to users to call some functions after the
		// asynchronous call of $http.get.
		var deferred = $q.defer();
		
		$http.get('/data/users.json')
			.success(function(users) {
				for (var index = 0; index < users.length; index++) {
					var user = users[index];
					if (user.login == login && user.password == password) {
						currentUser = user;
						
						// Success function in then() will be called, with the user as a parameter.
						deferred.resolve(user);
						return;
					}
				}
				
				// Error function in then() will be called.
				deferred.reject("No user found.");
				
			})
			.error(function(reason) {
				$log.error("Unable to load users...");
				deferred.reject(reason);
			});
		
		// A promise is returned, so we can make: userService.logUser(u, p).then(success, error).
		return deferred.promise;
	};
};

/** Registers our service in our application main module. */
app.factory('UserService', function($http, $q, $log) {
	return new UserService($http, $q, $log);
});




















