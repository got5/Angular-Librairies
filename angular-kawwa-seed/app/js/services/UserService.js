define([], function()
{
	/** User service */
	var UserService = function() {
		
		/** Currently logged user */
		this.currentUser = null;
		
		/** Returns true if the current user is authorized to see the page. */
		this.isAuthorized = function(pRole) {
			return true;
		};
	};
	
	angular.module('app-services', []).factory('UserService', function() {
    	return new UserService();
    });
});