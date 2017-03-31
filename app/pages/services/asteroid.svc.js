(() => {
    'use strict';

     angular.module('NearEarth')
        .factory('AsteroidService', AsteroidService);

     AsteroidService.$inject = ['$http', 'NEOСonfig'];
     function AsteroidService($http, NEOСonfig) {
        return {
            getNEOList: getNEOList,
            getNEODetails: getNEODetails
        };

        function getNEOList(startDate, endDate) {
            return $http.get(`${NEOСonfig.ASTEROID_API}/feed?start_date=${startDate}&end_date=${endDate}&detailed=false&api_key=${NEOСonfig.ASTEROID_KEY}`);
        }

        function getNEODetails(id) {
            return $http.get(`${NEOСonfig.ASTEROID_API}/neo/${id}?api_key=${NEOСonfig.ASTEROID_KEY}`);
        }
     }
})();