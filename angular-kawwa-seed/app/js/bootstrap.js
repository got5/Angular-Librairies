require.config({
    baseUrl: '/js',
    paths: {}
});

require
(
    [
        'app'
    ],
    function(app)
    {
        angular.bootstrap(document, ['app']);
    }
);