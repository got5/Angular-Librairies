/** Used in appModule, to load angular artifacts dynamically. */
define([], function() {
    return function(dependencies) {
        var definition = {
            resolver: ['$q','$rootScope', function($q, $rootScope) {
                var deferred = $q.defer();
                
                // Loads dependencies.
                require(dependencies, function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();
                    });
                });
                return deferred.promise;
            }]
        };
        return definition;
    };
});