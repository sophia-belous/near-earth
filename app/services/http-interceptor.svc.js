(() => {
    'use strict';

    angular.module('NearEarth')
        .factory('httpInterceptorSvc', httpInterceptorSvc);

    httpInterceptorSvc.$inject = ['$q', '$injector'];
    function httpInterceptorSvc($q, $injector) {
        return {
            responseError: responseError
        };

        function responseError(rejection) {
            var $state = $injector.get('$state');
            var $location = $injector.get('$location');

            var locpath = $location.path();

            if (rejection.status === 404) {
                    $state.go('Asteroids.NotFound');
            }

            return $q.reject(rejection);
        }
    }
})();