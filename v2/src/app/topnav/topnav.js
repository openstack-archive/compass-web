define(['angular'], function() {
    var topNavModule = angular.module('compass.topnav', [
        'ui.router',
        'ui.bootstrap'
    ])

    topNavModule.controller('topnavCtrl', function($scope, $http, dataService, $rootScope) {
        // get all clusters
        dataService.getClusters().success(function(data) {
            $scope.clusters = data;
        });
        $rootScope.$on('clusters', function(event, data) {
            $scope.clusters = data;
        })
    })
    topNavModule.directive('topnav', function() {
        return {
            templateUrl: 'src/app/topnav/topnav.tpl.html'
        };
    });
});