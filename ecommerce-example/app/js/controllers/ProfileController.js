define(['appModule'], function(app)
{
    app.lazy.controller('ProfileController', [ '$scope', 'UserService', function($scope, userService) {
        
    	$scope.user = userService.currentUser;
    	
    	$scope.updateUser = function() {
    		// TODO
    	};
    }]);
});