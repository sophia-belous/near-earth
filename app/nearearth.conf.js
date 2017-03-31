(() => {
    'use strict';

    angular.module('NearEarth')
        .config(nearEarthConfig);

    nearEarthConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$mdThemingProvider'];
    function nearEarthConfig($stateProvider, $locationProvider, $urlRouterProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);

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
            ;
    }
})();
