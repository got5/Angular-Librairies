/** Layout directive controller */
var LayoutController = function($scope, $cookies, $rootScope, $location, $route) {

	/** TODO: Gets registered user from cookies. */

	/** TODO: User access check */

	/** Logout function */
	$scope.logout = function() {
			// TODO
	};
};
	
/** Layout directive. Wraps every view in the application. */
angular.module('app').directive('mainLayout', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "templates/partials/mainLayout.html",
		controller : [ '$scope', '$cookies', '$rootScope', '$location', '$route', LayoutController ]
	};
});