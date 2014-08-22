angular.module('compass.monitoring', [
    'ui.router',
    'ui.bootstrap',
    'compass.charts',
    'ngAnimate',
    'angular-rickshaw',
    'nvd3ChartDirectives'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster.monitoring', {
            url: '/monitoring',
            templateUrl: 'src/app/monitoring/cluster-monitoring.tpl.html',
            authenticate: true
        })
})

.controller('monitoringCtrl', ['$scope',
    function($scope) {
        $scope.options = {
            renderer: 'area'
        };
        $scope.features = {
            hover: {
                xFormatter: function(x) {
                    return 't=' + x;
                },
                yFormatter: function(y) {
                    return '$' + y;
                }
            }
        };
        $scope.series = [{
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

.controller('moniOverviewCtrl', function($scope) {
    $scope.logicalTopoData = {
        "name": "cluster1",
        "children": [{
            "name": "compute",
            "state": "error",
            "children": [{
                "name": "host1",
                "state": "error",
                "children": [{
                    "name": "service1"
                }, {
                    "name": "service2"
                }, {
                    "name": "service3"
                }, {
                    "name": "service4"
                }]
            }, {
                "name": "host2",
                "state": "error",
                "children": [{
                    "name": "service1"
                }, {
                    "name": "service2"
                }]
            }, {
                "name": "host3",
                "state": "error",
                "children": [{
                    "name": "service1",
                    "children": [{
                        "name": "metric1"
                    }, {
                        "name": "metric2"
                    }]
                }]
            }]
        }, {
            "name": "storage",
            "state": "ok",
            "children": [{
                "name": "host7",
                "state": "ok",
                "children": [{
                    "name": "service5",
                    "state": "ok",
                    "children": [{
                        "name": "metric1"
                    }, {
                        "name": "metric2"
                    }]
                }, {
                    "name": "service6",
                    "state": "ok",
                    "children": [{
                        "name": "metric1"
                    }, {
                        "name": "metric2"
                    }]
                }]
            }, {
                "name": "host8",
                "state": "ok",
                "children": [{
                    "name": "service7",
                    "state": "ok",
                    "children": [{
                        "name": "metric1"
                    }]
                }, {
                    "name": "service8"
                }]
            }]
        }, {
            "name": "network",
            "state": "warning",
            "children": [{
                "name": "host10",
                "state": "warning",
                "children": []
            }, {
                "name": "host11",
                "state": "warning",
                "children": []
            }]
        }, {
            "name": "controller",
            "state": "warning",
            "children": [{
                "name": "host12",
                "state": "warning",
                "children": []
            }, {
                "name": "host13",
                "state": "warning",
                "children": []
            }]
        }, {
            "name": "database",
            "state": "warning",
            "children": [{
                "name": "host14",
                "children": []
            }, {
                "name": "host15",
                "children": []
            }]
        }, {
            "name": "image",
            "state": "ok",
            "children": [{
                "name": "host16",
                "children": []
            }, {
                "name": "host17",
                "children": []
            }]
        }]
    };

    $scope.physicalTopoData = {
        "name": "Compass Server",
        "children": [{
            "name": "switch1",
            "state": "error",
            "children": [{
                "name": "server1",
                "state": "error"
            }, {
                "name": "server2",
                "state": "ok"
            }]
        }, {
            "name": "switch2",
            "state": "ok",
            "children": [{
                "name": "server3",
                "state": "ok"
            }, {
                "name": "server4",
                "state": "ok"
            }]
        }, {
            "name": "switch3",
            "state": "warning",
            "children": [{
                "name": "server4",
                "state": "ok"
            }, {
                "name": "server5",
                "state": "ok"
            }, {
                "name": "server6",
                "state": "warning"
            }, {
                "name": "server7",
                "state": "ok"
            }, {
                "name": "server8"
            }, {
                "name": "server9",
                "state": "warning"
            }]
        }]
    };
    $scope.serverCount = 9;

    $scope.exampleData = [{
        "key": "Series 1",
        "values": [
            [1, 0],
            [2, 6],
            [3, 5],
            [4, 11],
            [5, 5]
        ]
    }, {
        "key": "Series 2",
        "values": [
            [1, 0],
            [2, 10],
            [3, 5],
            [4, 5],
            [5, 0]
        ]
    }, {
        "key": "Series 3",
        "values": [
            [1, 0],
            [2, 6],
            [3, 5],
            [4, 11],
            [5, 5]
        ]
    }, {
        "key": "Series 4",
        "values": [
            [1, 7],
            [2, 14],
            [3, 14],
            [4, 23],
            [5, 16]
        ]
    }];

    $scope.xAxisTickFormat = function() {
        return function(d) {
            return d3.time.format('%x')(new Date(d));
        }
    };

    $scope.toolTipContentFunction = function() {
        return function(key, x, y, e, graph) {
            console.log('tooltip content');
            return 'Super New Tooltip' +
                '<h1>' + key + '</h1>' +
                '<p>' + y + ' at ' + x + '</p>'
        }
    };

    /*  // customize stack/line chart colors
    $scope.colorFunction = function() {
        var colors = ["#68bc31", "#2091cf", "#6fb3e0", "#fee074", "#f89406", "#af4e96"];
        return function(d, i) {
            return colors[i%6];
        };
    }
*/

})
