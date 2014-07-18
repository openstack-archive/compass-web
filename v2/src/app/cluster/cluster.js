angular.module('compass.cluster', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngTable'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster', {
            url: '/cluster/{id}',
            controller: 'clusterCtrl',
            templateUrl: 'src/app/cluster/cluster.tpl.html'
        })
        .state('cluster.overview', {
            url: '/overview',
            controller: 'clusterProgressCtrl',
            templateUrl: 'src/app/cluster/cluster-overview.tpl.html'
        })
        .state('cluster.config', {
            url: '/config',
            templateUrl: 'src/app/cluster/cluster-config.tpl.html'
        })
        .state('cluster.config.security', {
            url: '/security',
            templateUrl: 'src/app/cluster/cluster-security.tpl.html'
        })
        .state('cluster.config.network', {
            url: '/network',
            templateUrl: 'src/app/cluster/cluster-network.tpl.html'
        })
        .state('cluster.config.partition', {
            url: '/partition',
            templateUrl: 'src/app/cluster/cluster-partition.tpl.html'
        })
        .state('cluster.config.roles', {
            url: '/roles',
            templateUrl: 'src/app/cluster/cluster-roles.tpl.html'
        })
        .state('cluster.log', {
            url: '/log',
            templateUrl: 'src/app/cluster/cluster-log.tpl.html'
        })
        .state('cluster.monitoring', {
            url: '/monitoring',
            templateUrl: 'src/app/cluster/cluster-monitoring.tpl.html'
        });
})

.controller('clusterCtrl', function($scope, $state, dataService, stateService, $stateParams) {
    var clusterId = $stateParams.id;
    $scope.state = $state;

    dataService.getClusterById(clusterId).success(function(data) {
        $scope.clusterInfo = data;
    });

    dataService.getMonitoringNav().success(function(data) {
        $scope.monitoringNav = data;
        stateService.addStates($scope.monitoringNav);
    });

}).directive('clusternav', function() {
    return {
        templateUrl: 'src/app/cluster/cluster-nav.tpl.html'
    }
})

.controller('clusterProgressCtrl', function($scope, dataService, $stateParams, $filter, ngTableParams, $timeout, $modal) {
    var clusterId = $stateParams.id;
    var progressTimer;

    var getClusterProgress = function() {
        dataService.getClusterProgress(clusterId).success(function(data) {
            $scope.clusterProgress = data;
            if ($scope.clusterProgress.state == "DEPLOYING") {
                progressTimer = $timeout(getClusterProgress, 5000);
            }
        });
    }

    getClusterProgress();

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.progress;
    });

    dataService.getClusterHostMachines(clusterId).success(function(data) {
        $scope.hosts = data;

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.hosts.length + 1 // count per page
        }, {
            counts: [], // hide count-per-page box
            total: $scope.hosts.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.hosts, params.orderBy()) : $scope.hosts;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.deleteHost = function(index) {
            dataService.deleteHost($scope.hosts[index].id)
            $scope.hosts.splice(index, 1);
            $scope.tableParams.reload();
        };
    });

    $scope.selectAllServers = function(flag) {
        if (flag) {
            angular.forEach($scope.hosts, function(sv) {
                sv.selected = true;
            })
        } else {
            angular.forEach($scope.hosts, function(sv) {
                sv.selected = false;
            })
        }
    };

    $scope.openDeleteHostModal = function(index) {
        var modalInstance = $modal.open({
            templateUrl: 'deleteHostConfirm.html',
            controller: deleteHostModalCtrl,
            resolve: {
                host: function() {
                    return $scope.hosts[index];
                }
            }
        });

        modalInstance.result.then(function() {
            // ok
            $scope.deleteHost(index);
        }, function() {
            // cancel
        });
    };

    $scope.$on('$destroy', function() {
        $timeout.cancel(progressTimer);
    });
})

.controller('createClusterCtrl', ['$scope', '$state', '$modal', '$log', 'dataService', 'wizardFactory',
    function($scope, $state, $modal, $log, dataService, wizardFactory) {
        dataService.getAdapters().success(function(data) {
            $scope.allAdapters = data;
            $scope.cluster = {};

            $scope.open = function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'createClusterModal.html',
                    controller: ModalInstanceCtrl,
                    size: size,
                    resolve: {
                        allAdapters: function() {
                            return $scope.allAdapters;
                        },
                        cluster: function() {
                            return $scope.cluster;
                        }
                    }
                });

                modalInstance.result.then(function(cluster) {
                    $scope.cluster = cluster;
                    dataService.createCluster(cluster).success(function(data, status) {
                        wizardFactory.setClusterInfo(data);
                        angular.forEach($scope.allAdapters, function(adapter) {
                            if (adapter.id == $scope.cluster.adapter_id) {
                                wizardFactory.setAdapter(adapter);
                            }
                        })
                        $state.go('wizard');
                        $scope.cluster = {};
                    });
                }, function() {
                    // modal cancelled
                });
            };
        });
    }
]);

var ModalInstanceCtrl = function($scope, $modalInstance, allAdapters, cluster) {
    $scope.allAdapters = allAdapters;
    $scope.cluster = cluster;

    $scope.$watch('cluster.adapter_id', function() {
        angular.forEach($scope.allAdapters, function(adapter) {
            if (adapter.id == $scope.cluster.adapter_id) {
                $scope.compatible_os = adapter.compatible_os;
            }
        })
    });

    $scope.ok = function() {
        $scope.result = 'ok';
        $modalInstance.close($scope.cluster);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.result = 'cancel';
    };
};

var deleteHostModalCtrl = function($scope, $modalInstance, host) {
    $scope.host = host;
    $scope.ok = function() {
        $modalInstance.close();
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}
