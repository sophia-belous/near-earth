(() => {
    'use strict';

    angular.module('NearEarth')
        .controller('AsteroidListCtrl', AsteroidListCtrl);

    AsteroidListCtrl.$inject = ['$scope', '$http', 'moment', 'AsteroidService', '$rootScope'];
    function AsteroidListCtrl($scope, $http, moment, AsteroidService, $rootScope) {
        const vm = this;
        const dateNow = Date.now();
        vm.endDate = moment(dateNow).format("YYYY-MM-DD");
        vm.startDate = moment(vm.endDate)
                        .subtract(7, "days")
                        .format("YYYY-MM-DD");
        vm.endCalendarDate = moment(dateNow).toDate();
        vm.startCalendarDate = moment(vm.endDate).subtract(7, "days").toDate();

        vm.date = formatString(vm.startDate);
        vm.getPrevNEOList = getPrevNEOList;
        vm.getNextNEOList = getNextNEOList;
        vm.changeDateRange = changeDateRange;
        vm.onlySevenDaysAllowed = onlySevenDaysAllowed;
        vm.nasaData = {};
        vm.NEOData = [];
        vm.firstChange = true;
        vm.diffBetweenDates = getDifDate(vm.startDate, vm.endDate);

        emitAboutChanges(true);
        getListOfAsteroids(vm.startDate, vm.endDate);

        $scope.$watch('vm.startCalendarDate', () => {
            debugger;
            if(!vm.firstChange) {
                vm.endCalendarDate = undefined
            } else {
                vm.firstChange = !vm.firstChange;
            }
        });

        function emitAboutChanges(is) {
            vm.firstChange = is;
            
            vm.startCalendarDate = moment(vm.startDate).toDate();
            vm.endCalendarDate = moment(vm.endDate).toDate();
            $rootScope.$emit('changeDates', { startDate: vm.startDate, endDate: vm.endDate})
        }
        
        function getPrevNEOList() {
            vm.endDate = vm.startDate;
            vm.startDate = moment(vm.startDate)
                            .subtract(vm.diffBetweenDates, "days")
                            .format("YYYY-MM-DD");
            emitAboutChanges(true);
            getListOfAsteroids(vm.startDate, vm.endDate);
        }

        function getNextNEOList() {
            vm.startDate = vm.endDate;
            vm.endDate = moment(vm.endDate)
                            .add(vm.diffBetweenDates, "days")
                            .format("YYYY-MM-DD");
            emitAboutChanges(true);
            getListOfAsteroids(vm.startDate, vm.endDate);
        }

        function changeNasaData(data) {
            vm.nasaData = data;

            vm.NEOData = Object.keys(vm.nasaData.near_earth_objects)
                            .map(key => { return {
                                                    date: key, 
                                                    nearEarthObjects: vm.nasaData.near_earth_objects[key]
                                                }});
        }

        function getListOfAsteroids(startDate, endDate) {
            AsteroidService.getNEOList(startDate, endDate)
                .then((res) => changeNasaData(res.data));
        }

        function getDifDate(startDate, endDate) {
            const date2 = moment(endDate);
            const date1 = moment(startDate);

            return date2.diff(date1, 'days');

        }

        function formatString(format) {
            const [year, month, day] = format.split('-');
            const date = new Date(year, month - 1, day);

            return date;
        }

        function changeDateRange(startDate, endDate) {
            vm.startDate  = moment(startDate).format("YYYY-MM-DD");
            vm.endDate = moment(endDate).format("YYYY-MM-DD");

            emitAboutChanges();
            getListOfAsteroids(vm.startDate, vm.endDate);
        }

        function onlySevenDaysAllowed(date) {
            const diffDates =  getDifDate(vm.startCalendarDate, date);
            return diffDates > 7 || diffDates < 0? false : true;
        }
    }
})();