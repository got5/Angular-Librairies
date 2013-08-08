require.config({
    baseUrl: '/js',
    paths: {}
});

require
(
    [
        'appModule'
    ],
    function(app)
    {
        angular.bootstrap(document, ['app']);
    }
);