define(['angular'], function() {
    var clusterModule = angular.module('compass.cluster', [
        //'ui.router',
        //'ui.bootstrap',
        //'compass.charts',
        //'ngAnimate',
        //'ngTable',
    ]);

    clusterModule.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('cluster', {
                url: '/cluster/{id}',
                controller: 'clusterCtrl',
                templateUrl: 'src/app/cluster/cluster.tpl.html',
                authenticate: true,
                resolve: {
                    clusterhostsData: function($stateParams, $q, dataService) {
                        var clusterId = $stateParams.id;
                        var deferred = $q.defer();
                        dataService.getClusterHosts(clusterId).success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            })
            .state('cluster.overview', {
                url: '/overview',
                controller: 'clusterProgressCtrl',
                templateUrl: 'src/app/cluster/cluster-overview.tpl.html',
                authenticate: true
            })
            .state('cluster.config', {
                url: '/config',
                controller: 'configurationCtrl',
                templateUrl: 'src/app/cluster/cluster-config.tpl.html',
                authenticate: true
            })
            .state('cluster.config.security', {
                url: '/security',
                templateUrl: 'src/app/cluster/cluster-security.tpl.html',
                authenticate: true
            })
            .state('cluster.config.network', {
                url: '/network',
                templateUrl: 'src/app/cluster/cluster-network.tpl.html',
                authenticate: true
            })
            .state('cluster.config.partition', {
                url: '/partition',
                templateUrl: 'src/app/cluster/cluster-partition.tpl.html',
                authenticate: true
            })
            .state('cluster.config.roles', {
                url: '/roles',
                templateUrl: 'src/app/cluster/cluster-roles.tpl.html',
                authenticate: true
            })
            .state('cluster.log', {
                url: '/log',
                controller: "clusterLogCtrl",
                templateUrl: 'src/app/cluster/cluster-log.tpl.html',
                authenticate: true
            });
    });

    clusterModule.controller('clusterCtrl', function($scope, $state, dataService, $stateParams) {
        $scope.clusterId = $stateParams.id;
        $scope.state = $state;

        dataService.getClusterById($scope.clusterId).success(function(data) {
            $scope.clusterInfo = data;
        });

    });
    clusterModule.directive('clusternav', function($timeout) {
        return {
            restrict: 'EAC',
            templateUrl: 'src/app/cluster/cluster-nav.tpl.html',
            link: function($scope, elem, attrs) {
                $timeout(function() {
                    $('.nav-list ul a').on('click touchend', function(e) {
                        var el = $(this);
                        var link = el.attr('href');
                        window.location = link;
                    });
                }, 0);

                elem.bind('$destroy', function() {
                    $('.nav-list ul a').off('click touchend');
                });
            }
        }
    });

    clusterModule.controller('clusterLogCtrl', function() {

    });

    clusterModule.controller('clusterProgressCtrl', function($scope, dataService, $stateParams, $filter, ngTableParams, $timeout, $modal, clusterhostsData) {
        var clusterId = $stateParams.id;
        var progressTimer;
        var fireTimer = true;
        $scope.hosts = clusterhostsData;

        var getClusterProgress = function() {
            dataService.getClusterProgress(clusterId).success(function(data) {
                $scope.clusterProgress = data;
                if (fireTimer) {
                    progressTimer = $timeout(getClusterProgress, 5000);
                }
            });
        };

        getClusterProgress();

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.progress;
        });


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
            fireTimer = false;
            $timeout.cancel(progressTimer);
        });

    });

    clusterModule.controller('createClusterCtrl', ['$scope', '$state', '$modal', '$log', 'dataService', 'wizardFactory', '$rootScope',
        function($scope, $state, $modal, $log, dataService, wizardFactory, $rootScope) {
            dataService.getAdapters().success(function(data) {
                $scope.allAdapters = data;
                $scope.cluster = {};

                $scope.open = function(size) {
                    var modalInstance = $modal.open({
                        templateUrl: 'createClusterModal.html',
                        controller: ClusterModalCtrl,
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
                        var postClusterData = {
                            "name": cluster.name,
                            "adapter_id": cluster.adapter.id,
                            "os_id": cluster.os.id
                        };
                        if (cluster.flavor) {
                            postClusterData.flavor_id = cluster.flavor.id;
                        }
                        dataService.createCluster(postClusterData).success(function(data, status) {
                            $scope.clusters.push(data);
                            $rootScope.$emit('clusters', $scope.clusters);
                            wizardFactory.setClusterInfo(data);
                            angular.forEach($scope.allAdapters, function(adapter) {
                                if (adapter.id == $scope.cluster.adapter_id) {
                                    wizardFactory.setAdapter(adapter);
                                }
                            })
                            $state.go('wizard', {
                                "id": data.id,
                                "config": "true"
                            });
                            $scope.cluster = {};
                        });
                    }, function() {
                        // modal cancelled
                    });
                };
            });
        }
    ]);

    clusterModule.controller('configurationCtrl', function($scope, dataService, $stateParams, $filter, ngTableParams, clusterhostsData) {
        var clusterId = $stateParams.id;
        $scope.partitionarray = [];
        dataService.getClusterConfig(clusterId).success(function(data) {
            $scope.configuration = data;


            angular.forEach($scope.configuration.os_config.partition, function(value, key) {
                $scope.partitionarray.push({
                    "name": key,
                    "number": value.percentage
                });
            });

        });

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.roles;
        });

        $scope.hosts = clusterhostsData;

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
    });

    var ClusterModalCtrl = function($scope, $modalInstance, allAdapters, cluster) {
        $scope.allAdapters = allAdapters;
        $scope.cluster = cluster;

        $scope.updateSelectedAdapter = function() {
            angular.forEach($scope.allAdapters, function(adapter) {
                if (adapter.id == $scope.cluster.adapter.id) {
                    $scope.supported_oses = adapter.supported_oses;
                    $scope.flavors = adapter.flavors;
                }
            })
        };

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
    };
});