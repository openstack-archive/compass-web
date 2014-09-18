angular.module('compass.monitoring', [
    'ui.router',
    'ui.bootstrap',
    'compass.charts',
    'ngAnimate',
    'angular-rickshaw',
    'nvd3ChartDirectives',
    'ui.tree'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster.monitoring', {
            url: '/monitoring',
            templateUrl: 'src/app/monitoring/cluster-monitoring.tpl.html',
            authenticate: true
        })
        .state('cluster.monitoring.overview', {
            url: '/overview',
            controller: 'moniOverviewCtrl',
            templateUrl: 'src/app/monitoring/overview.tpl.html',
            authenticate: true
        })
        .state('cluster.monitoring.topology', {
            url: '/topology',
            controller: 'topologyCtrl',
            templateUrl: 'src/app/monitoring/topology.tpl.html',
            authenticate: true
        })
        .state('cluster.monitoring.alerts', {
            url: '/alerts',
            controller: 'alertsCtrl',
            templateUrl: 'src/app/monitoring/alerts.tpl.html',
            authenticate: true
        })
        .state('cluster.monitoring.metrics', {
            url: '/metrics',
            controller: 'metricsCtrl',
            templateUrl: 'src/app/monitoring/metrics.tpl.html',
            authenticate: true
        })
        .state('cluster.monitoring.charts', {
            url: '/charts',
            templateUrl: 'src/app/monitoring/charts.tpl.html',
            authenticate: true
        })
})

.controller('moniOverviewCtrl', function($scope, dataService, $stateParams) {
    var clusterId = $stateParams.id;

    $scope.goDash = function(locs) {
        //alert(locs);
        setTimeout(function() {
            document.getElementById('dashboards').src = "/dash/#/dashboard/file/" + locs;
        }, 600);
    }

    $scope.moniOverviewData = [];
    dataService.monitorOverview(clusterId).success(function(data) {
        $scope.moniOverviewData = data;
    }).error(function(response) {
        // TODO: error handle
    });

})

.controller('topologyCtrl', function($scope, dataService, $stateParams) {
    var clusterId = $stateParams.id;

    $scope.physicalTopoData = {};
    $scope.physicalTopoDataReady = "false";

    dataService.monitorTopology(clusterId).success(function(data) {
        $scope.physicalTopoData = data;
        $scope.physicalTopoDataReady = "true";
    }).error(function(response) {
        // TODO: error handling
    });


    $scope.logicalTopoData = {};
    $scope.logicalTopoDataReady = "false";

    dataService.monitorServiceTopology(clusterId).success(function(data) {
        $scope.logicalTopoData = data;
        $scope.logicalTopoDataReady = "true";
    }).error(function(response) {
        // TODO: error handling
    });

})

.controller('alertsCtrl', function($scope, dataService, $stateParams) {
    var clusterId = $stateParams.id;

    $scope.alerts = [];
    $scope.alertDataReady = "false";

    dataService.monitorAlarms(clusterId).success(function(data) {
        $scope.alerts = data;
        $scope.alertDataReady = "true";
    }).error(function(response) {
        //TODO: error handling
    });

})

.controller('metricsCtrl', function($scope, dataService, $stateParams) {
    var clusterId = $stateParams.id;

    $scope.metricsTree = [];
    dataService.monitorMetricsTree().success(function(data) {
        $scope.metricsTree = data;
    }).error(function(response) {
        // TODO
    });

    $scope.metrics = [];
    dataService.monitorMetrics().success(function(data) {
        $scope.metrics = data;
    }).error(function(response) {
        // TODO
    });

    $scope.metricsData = [];
    $scope.generate = function(node) {
        console.log(node);

        dataService.monitorClusterMetric(clusterId, node.title).success(function(data) {
            $scope.metricsData = data;

        }).error(function(response) {
            // TODO
        });

    };

    // For Angular UI Tree
    $scope.toggle = function(scope) {
        scope.toggle();
    };

    var getRootNodesScope = function() {
        return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
        var scope = getRootNodesScope();
        scope.collapseAll();
    };

    $scope.expandAll = function() {
        var scope = getRootNodesScope();
        scope.expandAll();
    };

    // For NVD3 Line Chart
    $scope.xAxisTickFormatFunction = function() {
        return function(d) {
            return d3.time.format('%x')(new Date(d));
        }
    };

    $scope.toolTipContentFunction = function() {
        return function(key, x, y, e, graph) {
            return 'Super New Tooltip' +
                '<h1>' + key + '</h1>' +
                '<p>' + y + ' at ' + x + '</p>'
        }
    };

    /* 
    // customize stack/line chart colors
    $scope.colorFunction = function() {
        var colors = ["#68bc31", "#2091cf", "#6fb3e0", "#fee074", "#f89406", "#af4e96"];
        return function(d, i) {
            return colors[i%6];
        };
    }
    */

})