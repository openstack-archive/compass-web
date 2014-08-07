var app = angular.module('compass.clusterlist', [
    'ui.router',
    'ui.bootstrap',
    'ngTable'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('clusterList', {
            url: '/clusterlist',
            controller: 'clustersListCtrl',
            templateUrl: 'src/app/cluster/cluster-list.tpl.html',
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
})

.controller('clustersListCtrl', function($scope, ngTableParams, $filter, dataService, allClusterData) {
    var clusters = allClusterData
    angular.forEach(clusters, function(cluster) {
        dataService.getClusterProgress(cluster.id).success(function(data) {
            cluster.progress = data.status;
            cluster.state = data.state;
        });
    });

    var data = clusters;
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

    //button alerts

    $scope.alert = function(text) {
        alert('delete?');
    }
    $scope.export = function(text) {
        alert('export?');
    }

});
