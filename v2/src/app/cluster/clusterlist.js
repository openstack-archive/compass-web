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
            templateUrl: 'src/app/cluster/cluster-list.tpl.html'
        });
})

.controller('ClusterListCtrl', function($scope, ngTableParams, $filter) {
    var data = [{
        id: 1,
        clusterName: "Cluster 1",
        clusterState: "Deploying",
        deploymentDetails: "Total:17 | Waiting:15 | Installing:2 | Finished:0 | Failed:0",
        targetSystem: "OpenStack",
        dateModified: "03/10/2014 10:50 AM"
    }, {
        id: 2,
        clusterName: "Cluster 2",
        clusterState: "Failed",
        deploymentDetails: "Total:34 | Waiting:0 | Installing:0 | Finished:0 | Failed:34",
        targetSystem: "CentOS",
        dateModified: "01/04/2014 02:00 PM"
    }, {
        id: 3,
        clusterName: "Cluster 3",
        clusterState: "Undeployed",
        deploymentDetails: "Total:23 | Waiting:23 | Installing:0 | Finished:0 | Failed:0",
        targetSystem: "Hadoop",
        dateModified: "04/02/2014 12:50 AM"
    }, {
        id: 4, 
        clusterName: "Cluster 4",
        clusterState: "Successful",
        deploymentDetails: "Total:42 | Waiting:0 | Installing:0 | Finished:42 | Failed:0",
        targetSystem: "Ceph",
        dateModified: "06/24/2014 11:18 AM"
    }, {
        id: 5, 
        clusterName: "Cluster 5",
        clusterState: "Deploying",
        deploymentDetails: "Total:33 | Waiting:3 | Installing:25 | Finished:5 | Failed:0",
        targetSystem: "OpenStack",
        dateModified: "06/22/2014 09:02 AM"
    }, {
        id: 6, 
        clusterName: "Cluster 6",
        clusterState: "Undeployed",
        deploymentDetails: "Total:77 | Waiting:7 | Installing:4 | Finished:65 | Failed:1",
        targetSystem: "Ceph",
        dateModified: "03/29/2014 07:34 AM"
    }, {
        id: 7, 
        clusterName: "Cluster 7",
        clusterState: "Successful",
        deploymentDetails: "Total:7 | Waiting:0 | Installing:0 | Finished:7 | Failed:0",
        targetSystem: "CentOS",
        dateModified: "01/27/2014 12:00 PM"
    }];

    //button alerts

    $scope.alert = function(text) {
        alert('delete?');
    }
    $scope.export = function(text) {
        alert('export?');
    }

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
