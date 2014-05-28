(function () {
    "use strict";

    /** Product detail view controller */
    angular.module('app')
        .controller('DetailController', ['$scope', '$location', '$routeParams', 'catalogService',
            function ($scope, $location, $routeParams, catalogService) {

            $scope.product = {};

            catalogService.getProduct($routeParams.id).success(function (result) {
                $scope.product = result;
            });

            $scope.quantity = 1;



        }]);
}());