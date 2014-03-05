/** Controller used for "create directives" slides. Resets the example directive each time the code is edited. */
var DirectiveSlideController = function ($scope, $timeout) {

    var directiveName = null,directiveFactory = null;

    var bIsInit = false;

    var getDirectiveName = function (js) {
        var index = js.indexOf("angular.module('angularTrainingApp').directive(");
        if (index >= 0) {
            var dName = js.substring(index + 48);
            dName = dName.substring(0, dName.indexOf('\''));
            return dName;
        }
        return null;
    };

    var getDirectiveFactory = function(js){
        var index = js.indexOf('function');
        if (index >= 0) {
            var fn = js.substring(index,js.lastIndexOf(')'));
            return eval('(' + fn + ')');
        }
        return null;
    };

    /** Watcher on any editor code change. */
    $scope.$watch('code.js', function (newValue, oldValue) {
        if (newValue != oldValue || !bIsInit) {
            bIsInit = true;
            directiveName = getDirectiveName($scope.code.js);
            directiveFactory = getDirectiveFactory($scope.code.js);
            application.compileProvider.directive(directiveName,directiveFactory);

        }

    });
};
DirectiveSlideController.$inject = ['$scope', '$timeout'];