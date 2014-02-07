/** Controller used for "create directives" slides. Resets the example directive each time the code is edited. */
var DirectiveSlideController = function($scope, $timeout) {
	
	var directiveName = null;
	
	var bIsInit = false;
	
	var getDirectiveName = function(code) {
		var index = code.indexOf('application.directive(');
		if (index > 0) {
			var dName = code.substring(index + 23);
			dName = dName.substring(0, dName.indexOf('\''));
			return dName;
		}
		return null;
 	};
	
	/** Watcher on any editor code change. */
	$scope.$watch('code', function(newValue, oldValue) {
		if (newValue != oldValue || !bIsInit) {
			bIsInit = true;
			if (!directiveName && newValue) {
				directiveName = getDirectiveName($scope.code);
			}
			if (directiveName) {
				application.compileProvider.resetDirective(directiveName);
				$timeout(function() {
					$scope.code = $scope.code.replace('application.directive', 'application.compileProvider.directive');
				});
			}
		}
	});
};
DirectiveSlideController.$inject = ['$scope', '$timeout'];