define([], function()
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
            '/books': {
                templateUrl: '/templates/views/catalog.html',
                dependencies: [
                    'controllers/CatalogController'
                ],
                access: null
            },
            '/book/:id': {
                templateUrl: '/templates/views/detail.html',
                dependencies: [
                    'controllers/DetailController'
                ],
                access: null
            },
            '/basket': {
                templateUrl: '/templates/views/basket.html',
                dependencies: [
                    'controllers/BasketController'
                ],
                access: "user"
            },
            '/profile': {
                templateUrl: '/templates/views/profile.html',
                dependencies: [
                    'controllers/ProfileController'
                ],
                access: "user"
            },
            '/404': {
                templateUrl: '/templates/views/404.html',
                dependencies: [],
                access: null
            }
        }
    };
});