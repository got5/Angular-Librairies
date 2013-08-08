define(['directives/layout'], function()
{
    return {
        defaultRoutePath: '/',
        routes: {
            '/': {
                templateUrl: '/templates/views/home.html',
                dependencies: [
                    'controllers/HomeController'
                ],
                animation: null,
                access: null
            },
            '/login': {
                templateUrl: '/templates/views/login.html',
                dependencies: [
                    'controllers/LoginController'
                ],
                animation: 'page-slide',
                access: null
            }
        }
    };
});