angular.module('compass.cluster', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngTable',
    'angular-rickshaw'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster', {
            url: '/cluster/{id}',
            controller: 'clusterCtrl',
            templateUrl: 'src/app/cluster/cluster.tpl.html',
            authenticate: true
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
    $scope.clusterId = $stateParams.id;
    $scope.state = $state;

    dataService.getClusterById($scope.clusterId).success(function(data) {
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
    var fireTimer = true;

    var getClusterProgress = function() {
        dataService.getClusterProgress(clusterId).success(function(data) {
            $scope.clusterProgress = data;
            //if ($scope.clusterProgress.state == "INSTALLING") {
            if (fireTimer) {
                progressTimer = $timeout(getClusterProgress, 5000);
            }
            //}
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
        fireTimer = false;
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
                        $state.go('wizard', {
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
])

.controller('monitoringCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.options = {
            renderer: $scope.renderer
        };
        $scope.features = {
            palette: 'spectrum14',
            legend: {
                toggle: true,
                highlight: false
            },
            hover: {
                xFormatter: function(x) {
                    return 't=' + x;
                },
                yFormatter: function(y) {
                    return  y + ' load';
                }
            }
        };

        $scope.metrics = [
            'interface.eth0.if_octets.tx',
            'cpu.0.cpu.system.value',
            'entropy.entropy.value',
            'disk.sda.disk_ops.write'
        ];

        $scope.renderers = [{
                id: 'area',
                name: 'Area'
            }, {
                id: 'line',
                name: 'Line'
            }, {
                id: 'bar',
                name: 'Bar'
            }, {
                id: 'scatterplot',
                name: 'Scatterplot'
            }];

        $scope.palettes = [
            'spectrum14',
            'spectrum2000',
            'spectrum2001',
            'colorwheel',
            'cool',
            'classic9',
            'munin'
        ];

        $scope.rendererChanged = function(id) {
            $scope.options = {
                renderer: id
            };
        };

        $scope.paletteChanged = function(id) {
            $scope.features = {
                palette: id,
                legend: {
                    toggle: true,
                    highlight: false
                },
                hover: {
                    xFormatter: function(x) {
                        return 't=' + x;
                    },
                    yFormatter: function(y) {
                        return  y + ' data';
                    }
                }
            };
        };

        $scope.metricChanged = function(id) {
            $scope.metric = id
        };

        $scope.changeSeriesData = function(id) {
            //var seriesList = [];

            var myChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var myLen = 24;
            var myUrl = 'http://127.0.0.1:5000/monit/api/rshostgroup/nova-compute_local/metric/'
            //var myMetric = 'interface.eth0.if_octets.tx'
            //var myMetric = 'cpu.0.cpu.system.value'
            var myMetric = 'entropy.entropy.value'
            //var myMetric = 'disk.sda.disk_ops.write'
            var myUrlArg = '?callback=JSON_CALLBACK'
            var myCallbackId = '';

            for (var i = myLen; i > 0; --i) myCallbackId += myChars[Math.round(Math.random() * (myChars.length - 1))];

            //var urlsCallback = myUrl.concat(myMetric, myUrlArg, myCallbackId)
            var urlsCallback = myUrl.concat($scope.metric, myUrlArg)

            //$http.jsonp('http://127.0.0.1:5000/monit/api/rshostgroup/nova-compute_local/metric/interface.eth0.if_octets.tx?callback=JSON_CALLBACK').success(function(data){
            $http.jsonp(urlsCallback).success(function(data){
              $scope.series = data
            }).error(function(response){
              console.log("Error: ")
              console.log(response)
              $scope.series = [{ "name": "JSONP system.error", "data": [{ "x": 0, "y": 23 }, { "x": 1, "y": 15 }, { "x": 2, "y": 79 }, { "x": 3, "y": 31 }, { "x": 4, "y": 60 }]}]
        
            })

            //new Rickshaw.Graph.JSONP({
                //element: document.querySelector('#chart'),
                //dataURL: 'http://127.0.0.1:5000/monit/api/rshostgroup/nova-compute_local/metric/interface.eth0.if_octets.tx'
            //});
            
            //$scope['series' + id] = seriesList;
        };
        $scope.series = [{
            "name": ' Controller cpu.system.value',
            "data": [{
                "x": 0,
                "y": 23
            }, {
                "x": 1,
                "y": 15
            }, {
                "x": 2,
                "y": 79
            }, {
                "x": 3,
                "y": 31
            }, {
                "x": 4,
                "y": 60
            }]
        }, {
            "name": ' Nova-compute cpu.system.value',
            "data": [{
                "x": 0,
                "y": 30
            }, {
                "x": 1,
                "y": 20
            }, {
                "x": 2,
                "y": 64
            }, {
                "x": 3,
                "y": 50
            }, {
                "x": 4,
                "y": 15
            }]
        }, {
            "name": ' Neutron cpu.system.value',
            "data": [{
                "x": 0,
                "y": 22
            }, {
                "x": 1,
                "y": 78
            }, {
                "x": 2,
                "y": 14
            }, {
                "x": 3,
                "y": 26
            }, {
                "x": 4,
                "y": 44
            }]
        }];

        $scope.options2 = {
            renderer: 'line'
        };
        $scope.features2 = {
            hover: {
                xFormatter: function(x) {
                    return 't=' + x;
                },
                yFormatter: function(y) {
                    return '$' + y;
                }
            }
        };
        $scope.series2 = [{
            name: 'Series 1',
            color: 'steelblue',
            data: [{
                x: 0,
                y: 23
            }, {
                x: 1,
                y: 15
            }, {
                x: 2,
                y: 79
            }, {
                x: 3,
                y: 31
            }, {
                x: 4,
                y: 60
            }]
        }, {
            name: 'Series 2',
            color: 'lightblue',
            data: [{
                x: 0,
                y: 30
            }, {
                x: 1,
                y: 20
            }, {
                x: 2,
                y: 64
            }, {
                x: 3,
                y: 50
            }, {
                x: 4,
                y: 15
            }]
        }];
    }
])

var ModalInstanceCtrl = function($scope, $modalInstance, allAdapters, cluster) {
    $scope.allAdapters = allAdapters;
    $scope.cluster = cluster;

    $scope.$watch('cluster.adapter_id', function() {
        angular.forEach($scope.allAdapters, function(adapter) {
            if (adapter.id == $scope.cluster.adapter_id) {
                $scope.supported_oses = adapter.supported_oses;
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
