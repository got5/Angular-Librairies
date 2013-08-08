define(['appModule'], function(app)
{
    app.lazy.controller('BasketController',
    [
        '$scope', 'UserService',
        function($scope, userService)
        {
            $scope.items = userService.getCartItems();
            $scope.nbItems = $scope.items != undefined ? $scope.items.length : 0;
            
            $scope.getTotal = function() {
            	if ($scope.items != undefined) {
                	var total = 0;
                	for (var index = 0; index < $scope.items.length; index++) {
                		var cartItem = $scope.items[index];
                		total += cartItem.qty * cartItem.price;
                	}
                	return total;
                }
            	return 0;
            };
        }
    ]);
});