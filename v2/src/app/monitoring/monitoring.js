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

.controller('alertsCtrl', ['$scope',
    function($scope) {
        $scope.options = {
            renderer: 'area'
        };

        $scope.alertsData = {"id":"server-1.huawei.com","name":"server-1.huawei.com","resource":"hosts","state":"running","type":"server",  "metrics":[],  "alarms":[
                {"id":"critical","name":"critical","data":[
                                {"start":1406831282409,"end":1406870037149},
                                {"start":1406745382748,"end":1406761927670}
                ]},
                {"id":"minor","name":"minor","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]},
                {"id":"positive","name":"positive","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]},
                {"id":"info","name":"info","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]}
        ]};
    }
])


/*
.value("graphConfigurations", {
        apis: {
                'simulation': {
                    uri: { v : "/monit/api/1.0.0/", displayName: 'Testing Cluster'},
                        metrics: true, alarms: true, topos: true,
                },
                'simulation.alarms': {
                        uri: "/monit/api/1.0.0/hosts/uc-server-2.huawei.com/alarms"
                },
                '192.168.255.85.hostgroup': {
                    uri: { v : '/monit/api/hostgroup/host1/metric/cpu.0.cpu.system.value',
                            displayName: 'Cluster 1'},
                        metrics: true, alarms: true
                },
                '192.168.255.85.topology': {
                    uri: { v: '/monit/api/topologies/1', displayName: 'Cluster 1'}, topos:true
                }
        },
        renderers:{
                line: {
                        name: "line",
                        metrics: true,
                        view: com.huawei.compass.LineGraph,
                        model: com.huawei.compass.LineGraphModel
                },
                area: {
                        name: "area",
                        metrics: true,
                        view: com.huawei.compass.AreaGraph,
                        model: com.huawei.compass.AreaGraphModel
                },
                sparkline: {
                        name: "sparkline",
                        metrics: true,
                        view: com.huawei.compass.SparkGraph,
                        model: com.huawei.compass.SparkGraphModel
                },
                all: {
                        name: "all",
                        alarms: true,
                        view: com.huawei.compass.BlockGraph,
                        model: com.huawei.compass.BlockGraphModel,
                        value:""
                },

                critical: {
                        name: "critical",
                        alarms: true,
                        view: com.huawei.compass.BlockGraph,
                        model: com.huawei.compass.BlockGraphModel,
                        value:"critical"
                },
                warning: {
                        name: "warning",
                        alarms: true,
                        view: com.huawei.compass.BlockGraph,
                        model: com.huawei.compass.BlockGraphModel,
                        value:"minor"
                },
                success: {
                        name: "success",
                        alarms: true,
                        view: com.huawei.compass.BlockGraph,
                        model: com.huawei.compass.BlockGraphModel,
                        value:"positive"
                },
                unknown: {
                        name: "unknown",
                        alarms: true,
                        view: com.huawei.compass.BlockGraph,
                        model: com.huawei.compass.BlockGraphModel,
                        value:"info"
                },
                tree: {
                        name: "tree",
                        topos: true,
                        view: com.huawei.compass.TreeGraph,
                        model: com.huawei.compass.TreeGraphModel,
                        value:"info"
                }
        },
        styles:{
                "switch":"/assets/images/switch.png",
                "server":"/assets/images/server.png",
                "service":"/assets/images/switch.png",
                "running":"#669900",
                "error" : "#CC0000",
            "warning" : "#ffff33",
            "unknown" : "#33b5e5"
        }
})
*/

.controller('alarmsCtrl', ['$scope', '$http', 'graphConfigurations', 'graphService',
    function($scope, $http, graphConfigurations, graphService) {
                $scope.uris = graphService.getUris(graphConfigurations,"alarms");
            $scope.renderers = graphService.getRenderers(graphConfigurations,"alarms");
            $scope.rendererChanged = graphService.getRendererListener($scope);
            $scope.uriChanged = graphService.getUriListener($scope);
            $scope.alertsData = {"id":"server-1.huawei.com","name":"server-1.huawei.com","resource":"hosts","state":"running","type":"server",  "metrics":[],  "alarms":[
                {"id":"critical","name":"critical","data":[
                                {"start":1406831282409,"end":1406870037149},
                                {"start":1406745382748,"end":1406761927670}
                ]},
                {"id":"minor","name":"minor","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]},
                {"id":"positive","name":"positive","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]},
                {"id":"info","name":"info","data":[
                                {"start":1406873957790,"end":1406886655198},
                                {"start":1406774590378,"end":1406850781190}
                ]}
           ]};
           $scope.changeSeriesData = graphService.getDataListener($scope, function(data) {
                var uri = $scope.uri;
                console.log("URI is .....", uri);
                var renderer = $scope.renderer;
                var isValidApi = (uri == graphConfigurations.apis["192.168.255.85.hostgroup"].uri.v);
                if (isValidApi) for (var i = 0; i < data.length; i++) data[i].name = data[i].id;
                var gFormatter = com.huawei.compass.formatter.hourminute;
                var gName = "Alarms";
                var gData = isValidApi ? data : data.groups[0].hosts;
                // TODO(jiahua): graphConfigurations.renderers[renderer] is undefined
                var gProperty = graphConfigurations.renderers[renderer].value;
                        var view = new graphConfigurations.renderers[renderer].view({
                                name: gName,
                                model: new graphConfigurations.renderers[renderer].model({data:gData, propertyKey:"alarms", propertyName:gProperty}).model,
                                formatter: gFormatter,
                                yFormatter: d3.format('.3e'),
                                css: "chart-title",
                                width: 500,
                                height: 500,
                                css: {
                            "header":"chart-title",
                            "critical" : "alarm-critical",
                            "major" : "alarm-major",
                            "minor" : "alarm-minor",
                            "info" : "alarm-info",
                            "positive" : "alarm-positive"
                        },
                        listener: function(d) {
                                alert("Alarm Selected (" + d.startDate + ", " + d.endDate + ")");
                        }
                        });
                        $.graphs.get("alarmsGraphContainer").innerHTML = "";
                        $.graphs.get("alarmsGraphContainer").appendChild(view);
                });
    }
])


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

    //$scope.topoDropDown = 'service';

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
