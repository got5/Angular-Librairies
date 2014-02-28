/** Service which handle all user logic. */
var UserService = function($http, $q, $log,isDebugMode) {
	
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
				if (isDebugMode) {
					$log.info("[INFO] All users loaded.");
				}
				
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
				if (isDebugMode) {
					$log.error("[ERROR] Unable to load users...");
				}
				deferred.reject(reason);
			});
		
		// A promise is returned, so we can make: userService.logUser(u, p).then(success, error).
		return deferred.promise;
	};
};

/** UserService provider. */
function UserServiceProvider() {
	
	var isDebugMode = false;
	
	this.setDebugMode = function(pIsDebug) {
		isDebugMode = pIsDebug;
	};
	
	this.$get = [ '$http', '$q', '$log', function($http, $q, $log) {
		return new UserService($http, $q, $log, isDebugMode);
	}];
};

/** Registers our service in a new sub module. */
angular.module('sdcoServices', []).provider('UserService', UserServiceProvider);




















