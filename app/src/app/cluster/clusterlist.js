define(['angular'], function() {
    var clusterlistModule = angular.module('compass.clusterlist', [
        //'ui.router',
        //'ui.bootstrap',
        //'ngTable'
    ]);

    clusterlistModule.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('clusterList', {
                url: '/clusterlist',
                controller: 'clustersListCtrl',
                templateUrl: 'src/app/cluster/cluster-all.tpl.html',
                authenticate: true,
                resolve: {
                    allClusterData: function($q, dataService) {
                        var deferred = $q.defer();
                        dataService.getClusters().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            });
    });

    clusterlistModule.controller('clustersListCtrl', function($scope, $state, ngTableParams, $filter, dataService, allClusterData) {
        $scope.clusters = allClusterData;
        angular.forEach($scope.clusters, function(cluster) {
            dataService.getClusterProgress(cluster.id).success(function(data) {
                cluster.progress = data.status;
                cluster.state = data.state;
            });
        });

        var data = $scope.clusters;
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 10, // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.goToCluster = function(id, state) {
            if (state == "UNINITIALIZED") {
                $state.go("wizard", {
                    "id": id,
                    "config": "true"
                });
            } else {
                $state.go("cluster.overview", {
                    "id": id
                });
            }
        };

        //button alerts

        $scope.alert = function(text) {
            alert('delete?');
        }
        $scope.export = function(text) {
            alert('export?');
        }

    });
})