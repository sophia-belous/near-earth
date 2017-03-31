(() => {
    'use strict';

    angular.module('NearEarth')
        .config(nearEarthConfig);

    nearEarthConfig.$inject = ['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', '$mdThemingProvider'];
    function nearEarthConfig($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('httpInterceptorSvc');

        $mdThemingProvider.theme('dark-theme', 'default')
            .primaryPalette('grey')
            .dark();


        $stateProvider
            .state('Asteroids', {
                abstract: true,
                views: {
                    header: {
                        templateUrl: 'app/partials/header/main-header.tpl.html',
                        controller: 'HeaderCtrl',
                        controllerAs: 'vm'
                    },
                    '': {
                        template: '<ui-view layout="column"/>'
                    }
                }
            })
            .state('Asteroids.Root', {
                url: '/',
                controller: AsteroidsRootCtrl,
                controllerAs: 'vm'
            })
            .state('Asteroids.List', {
                url: '/asteroids',
                templateUrl: 'app/pages/asteroids-list/asteroid-list.tpl.html',
                controller: 'AsteroidListCtrl',
                controllerAs: 'vm'
            })
            .state('Asteroids.Detail', {
                url: '/asteroids/:id',
                templateUrl: 'app/pages/asteroid-details/asteroid-detail.tpl.html',
                controller: 'AsteroidDetailsCtrl',
                controllerAs: 'vm'
            })
            .state('Asteroids.NotFound', {
                url: '/not-found',
                templateUrl: 'app/pages/not-found/not-found.tpl.html'
            })
            ;

        $urlRouterProvider.otherwise(function ($injector) {
            const $state = $injector.get('$state');
            $state.go('Asteroids.List');
        });

        AsteroidsRootCtrl.$inject = ['$rootScope', '$state'];
        function AsteroidsRootCtrl($rootScope, $state) {
            $state.go('Asteroids.List')
        }
    }
})();
