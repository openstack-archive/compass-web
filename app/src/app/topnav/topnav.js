define(['angular'], function() {
    var topNavModule = angular.module('compass.topnav', [
        'ui.router',
        'ui.bootstrap'
    ]);

    topNavModule.controller('topnavCtrl', function($scope, $state, $http, dataService, $rootScope) {
        // get all clusters
        dataService.getClusters().success(function(data) {
            $scope.clusters = data;
        });
        $rootScope.$on('clusters', function(event, data) {
            $scope.clusters = data;
        });

        $scope.gotoCluster = function(id) {
            dataService.getClusterProgress(id).success(function(data) {
                if (data.state == "UNINITIALIZED") {
                    $state.go("wizard", {
                        "id": id,
                        "config": "true"
                    });
                } else {
                    $state.go("cluster.overview", {
                        "id": id
                    });

                }
            });
        };

    });
    topNavModule.directive('topnav', function() {
        return {
            templateUrl: 'src/app/topnav/topnav.tpl.html'
        };
    });
});