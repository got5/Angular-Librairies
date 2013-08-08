define([], function()
{
    return {
        defaultRoutePath: '/404',
        routes: {
            '/': {
                templateUrl: '/templates/views/home.html',
                dependencies: [
                    'controllers/HomeController',
                    'directives/layout'
                ],
                access: null
            },
            '/login': {
                templateUrl: '/templates/views/login.html',
                dependencies: [
                    'controllers/LoginController',
                    'services/UserService',
                    'directives/layout'
                ],
                access: null
            },
            '/books': {
                templateUrl: '/templates/views/catalog.html',
                dependencies: [
                    'controllers/CatalogController',
                    'directives/layout',
                    'directives/productSummary',
                ],
                access: null
            },
            '/book/:id': {
                templateUrl: '/templates/views/detail.html',
                dependencies: [
                    'controllers/DetailController',
                    'directives/layout'
                ],
                access: null
            },
            '/basket': {
                templateUrl: '/templates/views/basket.html',
                dependencies: [
                    'controllers/BasketController',
                    'directives/layout'
                ],
                access: "user"
            },
            '/profile': {
                templateUrl: '/templates/views/profile.html',
                dependencies: [
                    'controllers/ProfileController',
                    'directives/layout'
                ],
                access: "user"
            },
            '/404': {
                templateUrl: '/templates/views/404.html',
                dependencies: [ 
                    'directives/layout'
                ],
                access: null
            }
        }
    };
});