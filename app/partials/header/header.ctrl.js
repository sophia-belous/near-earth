(() => {
    'use strict';

    angular.module('NearEarth')
        .controller('HeaderCtrl', HeaderCtrl);

    HeaderCtrl.$inject = ['$scope', '$state', 'AsteroidService', '$rootScope'];
    function HeaderCtrl($scope, $state, AsteroidService, $rootScope) {
        $scope.$state = $state;
        const vm = this;
        vm.allAsteroids = [];
        vm.querySearch = querySearch;
        vm.openAsteroidPage = openAsteroidPage;
        vm.startDate = '';
        vm.endDate = '';

        function openAsteroidPage(asteroid) {
            if (!asteroid) return;
            $state.go('Asteroids.Detail', {
                id: asteroid
            })
        }

        $rootScope.$on('changeDates', function (event, data) {
            vm.startDate = data.startDate;
            vm.endDate = data.endDate;
            getAllAsteroids();
        });

        function getAllAsteroids() {
            AsteroidService.getNEOList(vm.startDate, vm.endDate)
                .then((res) => changeNasaData(res.data));
        }

        function changeNasaData(data) {
            let asteroids = [];
            vm.nasaData = data;

            const NEOData = Object.keys(vm.nasaData.near_earth_objects)
                .map(key => vm.nasaData.near_earth_objects[key]);

            asteroids = [].concat.apply([], NEOData);
            vm.allAsteroids = asteroids.map(asteroid => {
                return {
                    value: asteroid.name,
                    id: asteroid.neo_reference_id,
                    display: asteroid.name
                };
            });
            
        }


        function querySearch(query) {
            const results = query ? vm.allAsteroids.filter(createFilterFor(query)) : vm.allAsteroids;
            return results;
        }

        function createFilterFor(query) {
            const lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) !== -1);
            };

        }


    }
})();