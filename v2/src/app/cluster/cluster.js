angular.module('compass.cluster', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster', {
            url: '/cluster/{id}',
            //controller: 'clusterCtrl',
            templateUrl: 'src/app/cluster/cluster.tpl.html'
        })
        .state('cluster.overview', {
            url: '/overview',
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

.controller('clusternavCtrl', function($scope, $state, dataService, stateService) {
    $scope.state = $state;

    dataService.getMonitoringNav().success(function(data) {
        $scope.monitoringNav = data;
        stateService.addStates($scope.monitoringNav);
    });

}).directive('clusternav', function() {
    return {
        templateUrl: 'src/app/cluster/cluster-nav.tpl.html'
    };
})

.controller('createClusterCtrl', ['$scope', '$state', '$modal', '$log', 'dataService', 'wizardFactory',
    function($scope, $state, $modal, $log, dataService, wizardFactory) {
        dataService.getAdapters().success(function(data) {
            $scope.adapters = data;
            $scope.compatible_os = [];

            $scope.cluster = {};
            $scope.cluster.name = "";
            $scope.cluster.adapter_id = $scope.adapters[0].id;

            $scope.$watch('cluster.adapter_id', function() {
                angular.forEach($scope.adapters, function(adapter) {
                    if (adapter.id == $scope.cluster.adapter_id) {
                        $scope.compatible_os = adapter.compatible_os;
                        console.log($scope.compatible_os);
                    }
                })
            });

            $scope.open = function(size) {
                var modalInstance = $modal.open({
                    templateUrl: 'createClusterModal.html',
                    controller: ModalInstanceCtrl,
                    size: size,
                    resolve: {
                        adapters: function() {
                            return $scope.adapters;
                        },
                        cluster: function() {
                            return $scope.cluster;
                        },
                        compatible_os: function() {
                            return $scope.compatible_os;
                        }
                    }
                });

                modalInstance.result.then(function(cluster) {
                    $scope.cluster = cluster;
                    dataService.createCluster(cluster).success(function(data, status) {
                        wizardFactory.setClusterInfo(data);
                        $state.go('wizard');
                        $scope.cluster = {};
                    });
                }, function() {
                    console.log("modal cancelled");
                });
            };
        });
    }
]);


var ModalInstanceCtrl = function($scope, $modalInstance, adapters, cluster, compatible_os) {
    $scope.adapters = adapters;
    $scope.cluster = cluster;
    $scope.compatible_os = compatible_os;

    $scope.ok = function() {
        $scope.result = 'ok';
        $modalInstance.close($scope.cluster);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.result = 'cancel';
    };
};
