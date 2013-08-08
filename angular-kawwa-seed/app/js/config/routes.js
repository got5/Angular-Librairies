define(['controllers/RootController'], function()
{
    return {
        defaultRoutePath: '/404',
        routes: {
            '/': {
                templateUrl: '/templates/views/home.html',
                dependencies: [
                    'controllers/HomeController'
                ],
                access: null
            },
            '/login': {
                templateUrl: '/templates/views/login.html',
                dependencies: [
                    'controllers/LoginController'
                ],
                access: null
            },
            '/404': {
                templateUrl: '/templates/views/404.html',
                dependencies: [ ],
                access: null
            }
        }
    };
});