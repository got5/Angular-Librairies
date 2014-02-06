'use strict';

var AnimationController = function ($scope, $animate ) {
    $scope.animationOn = true;
    $scope.$watch('animationOn', function (newValue, oldValue) {
        $animate.enabled(newValue);
    });

}
AnimationController.$inject = [ '$scope', '$animate' ];