define(['appModule'], function(app)
{
    app.lazy.controller('HomeController',
    [
        '$scope',
        function($scope)
        {
        	$scope.message = "Welcome in our shop!!!";
        }
    ]);
});