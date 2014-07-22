var app = angular.module('compass.clusterlist', [
    'ui.router',
    'ui.bootstrap',
    'ngTable'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('clusterList', {
            url: '/clusterlist',
            controller: 'ClusterListCtrl',
            templateUrl: 'src/app/cluster/cluster-list.tpl.html',
            authenticate: true
        });
})

.controller('ClusterListCtrl', function($scope, ngTableParams, $filter, dataService) {

    clusters = []
    dataService.getClusters().success(function(data) {
        clusters = data;
        angular.forEach(clusters, function(cluster) {
            dataService.getClusterProgress(cluster.id).success(function(data) {
                cluster.progress = "Total: " + data.status.total_hosts + " |" + " Installing: " + data.status.installing_hosts + " |" + " Completed: " + data.status.completed_hosts + " |" + " Failed: " + data.status.failed_hosts + " |" + " Status: " + data.status.message;
                cluster.state = data.state;
            });

        })

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

    });

    //button alerts

    $scope.alert = function(text) {
        alert('delete?');
    }
    $scope.export = function(text) {
        alert('export?');
    }


});
