(() => {
    'use strict';

    angular.module('NearEarth')
        .controller('AsteroidDetailsCtrl', AsteroidDetailsCtrl);
        AsteroidDetailsCtrl.$inject = ['$state', 'AsteroidService'];
        function AsteroidDetailsCtrl($state, AsteroidService) {
            const vm = this;
            vm.currentAsteroid = {};
            AsteroidService.getNEODetails($state.params.id)
                .then((asteroid) => {
                    vm.currentAsteroid = asteroid.data;
                })
        }
})();