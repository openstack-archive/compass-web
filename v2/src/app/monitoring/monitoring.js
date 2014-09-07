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

        $scope.alertsData = {
            "id": "server-1.huawei.com",
            "name": "server-1.huawei.com",
            "resource": "hosts",
            "state": "running",
            "type": "server",
            "metrics": [],
            "alarms": [{
                "id": "critical",
                "name": "critical",
                "data": [{
                    "start": 1406831282409,
                    "end": 1406870037149
                }, {
                    "start": 1406745382748,
                    "end": 1406761927670
                }]
            }, {
                "id": "minor",
                "name": "minor",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }, {
                "id": "positive",
                "name": "positive",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }, {
                "id": "info",
                "name": "info",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }]
        };

        $scope.alerts = [{
            "startDate": new Date("Sun Dec 09 01:36:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 02:36:45 EST 2012"),
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 04:56:32 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:35:47 EST 2012"),
            "name": "os-db-node",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 06:29:53 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:34:04 EST 2012"),
            "name": "os-db-node",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 05:35:21 EST 2012"),
            "endDate": new Date("Sun Dec 09 06:21:22 EST 2012"),
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 05:00:06 EST 2012"),
            "endDate": new Date("Sun Dec 09 05:05:07 EST 2012"),
            "name": "os-keystone",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 03:46:59 EST 2012"),
            "endDate": new Date("Sun Dec 09 04:54:19 EST 2012"),
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 04:02:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 04:48:56 EST 2012"),
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 03:27:35 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:58:43 EST 2012"),
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 01:40:11 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:26:35 EST 2012"),
            "name": "os-db-node",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 03:00:03 EST 2012"),
            "endDate": new Date("Sun Dec 09 03:09:51 EST 2012"),
            "name": "os-keystone",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 01:21:00 EST 2012"),
            "endDate": new Date("Sun Dec 09 02:51:42 EST 2012"),
            "name": "os-mq",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 01:08:42 EST 2012"),
            "endDate": new Date("Sun Dec 09 01:33:42 EST 2012"),
            "name": "os-keystone",
            "status": "CRITICAL"
        }, {
            "startDate": new Date("Sun Dec 09 00:27:15 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:54:56 EST 2012"),
            "name": "os-controller",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 00:29:48 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:44:50 EST 2012"),
            "name": "os-image",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 07:39:21 EST 2012"),
            "endDate": new Date("Sun Dec 09 07:43:22 EST 2012"),
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 07:00:06 EST 2012"),
            "endDate": new Date("Sun Dec 09 07:05:07 EST 2012"),
            "name": "os-compute2",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 08:46:59 EST 2012"),
            "endDate": new Date("Sun Dec 09 09:54:19 EST 2012"),
            "name": "os-compute1",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 09:02:45 EST 2012"),
            "endDate": new Date("Sun Dec 09 09:48:56 EST 2012"),
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sun Dec 09 08:27:35 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:58:43 EST 2012"),
            "name": "os-compute2",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 08:40:11 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:46:35 EST 2012"),
            "name": "os-mq",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 08:00:03 EST 2012"),
            "endDate": new Date("Sun Dec 09 08:09:51 EST 2012"),
            "name": "os-compute2",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 10:21:00 EST 2012"),
            "endDate": new Date("Sun Dec 09 10:51:42 EST 2012"),
            "name": "os-compute1",
            "status": "SUCCESSFUL"
        }, {
            "startDate": new Date("Sun Dec 09 11:08:42 EST 2012"),
            "endDate": new Date("Sun Dec 09 11:33:42 EST 2012"),
            "name": "os-network",
            "status": "CRITICAL"
        }, {
            "startDate": new Date("Sun Dec 09 12:27:15 EST 2012"),
            "endDate": new Date("Sun Dec 09 12:54:56 EST 2012"),
            "name": "os-mq",
            "status": "WARNING"
        }, {
            "startDate": new Date("Sat Dec 08 23:12:24 EST 2012"),
            "endDate": new Date("Sun Dec 09 00:26:13 EST 2012"),
            "name": "os-controller",
            "status": "UNKNOWN"
        }];

        $scope.hosts = ["os-controller", "os-db-node", "os-keystone", "os-network", "os-image", "os-mq", "os-compute1", "os-compute2"];

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
        $scope.uris = graphService.getUris(graphConfigurations, "alarms");
        $scope.renderers = graphService.getRenderers(graphConfigurations, "alarms");
        $scope.rendererChanged = graphService.getRendererListener($scope);
        $scope.uriChanged = graphService.getUriListener($scope);
        $scope.alertsData = {
            "id": "server-1.huawei.com",
            "name": "server-1.huawei.com",
            "resource": "hosts",
            "state": "running",
            "type": "server",
            "metrics": [],
            "alarms": [{
                "id": "critical",
                "name": "critical",
                "data": [{
                    "start": 1406831282409,
                    "end": 1406870037149
                }, {
                    "start": 1406745382748,
                    "end": 1406761927670
                }]
            }, {
                "id": "minor",
                "name": "minor",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }, {
                "id": "positive",
                "name": "positive",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }, {
                "id": "info",
                "name": "info",
                "data": [{
                    "start": 1406873957790,
                    "end": 1406886655198
                }, {
                    "start": 1406774590378,
                    "end": 1406850781190
                }]
            }]
        };
        $scope.changeSeriesData = graphService.getDataListener($scope, function(data) {
            var uri = $scope.uri;
            console.log("URI is .....", uri);
            var renderer = $scope.renderer;
            var isValidApi = (uri == graphConfigurations.apis["192.168.255.85.hostgroup"].uri.v);
            if (isValidApi)
                for (var i = 0; i < data.length; i++) data[i].name = data[i].id;
            var gFormatter = com.huawei.compass.formatter.hourminute;
            var gName = "Alarms";
            var gData = isValidApi ? data : data.groups[0].hosts;
            // TODO(jiahua): graphConfigurations.renderers[renderer] is undefined
            var gProperty = graphConfigurations.renderers[renderer].value;
            var view = new graphConfigurations.renderers[renderer].view({
                name: gName,
                model: new graphConfigurations.renderers[renderer].model({
                    data: gData,
                    propertyKey: "alarms",
                    propertyName: gProperty
                }).model,
                formatter: gFormatter,
                yFormatter: d3.format('.3e'),
                css: "chart-title",
                width: 500,
                height: 500,
                css: {
                    "header": "chart-title",
                    "critical": "alarm-critical",
                    "major": "alarm-major",
                    "minor": "alarm-minor",
                    "info": "alarm-info",
                    "positive": "alarm-positive"
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



.controller('moniOverviewCtrl', function($scope) {
    $scope.moniOverviewData = [{
        "name": "cluster_summary",
        "display_name": "Cluster Summary",
        "state": "ok"
    }, {
        "name": "controller",
        "display_name": "Controller",
        "state": "error"
    }, {
        "name": "alert",
        "display_name": "Alert",
        "state": "",
        "alerts": [{
            "type": "critical",
            "name": "host-1"
        }, {
            "type": "warning",
            "name": "host-22",
        }, {
            "type": "warning",
            "name": "host-13"
        }, {
            "type": "critical",
            "name": "host-20"
        }, {
            "type": "warning",
            "name": "host-20"
        }]
    }, {
        "name": "compute",
        "display_name": "Compute",
        "state": "ok"
    }, {
        "name": "security",
        "display_name": "Security",
        "state": "warning"
    }, {
        "name": "database",
        "display_name": "Database",
        "state": "warning"
    }, {
        "name": "image",
        "display_name": "Image",
        "state": "warning"
    }, {
        "name": "store",
        "display_name": "Store",
        "state": "ok"
    }, {
        "name": "messagebus",
        "display_name": "Message Bus",
        "state": "ok"
    }, {
        "name": "processes",
        "display_name": "Processes",
        "state": "ok"
    }, {
        "name": "monitoring",
        "display_name": "Monitoring",
        "state": "ok"
    }, {
        "name": "users",
        "display_name": "Users",
        "state": "ok"
    }];


    $scope.logicalTopoData = {
        "name": "cluster",
        "children": [{
            "name": "compute",
            "state": "error",
            "children": [{
                "name": "os-compute1",
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
                "name": "os-compute2",
                "state": "error",
                "children": [{
                    "name": "service1"
                }, {
                    "name": "service2"
                }]
            }]
        }, {
            "name": "controller",
            "state": "ok",
            "children": [{
                "name": "os-controller",
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
                "name": "os-network",
                "state": "warning",
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
            }]
        }, {
            "name": "image",
            "state": "warning",
            "children": [{
                "name": "os-image",
                "state": "warning",
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
            }]
        }, {
            "name": "database",
            "state": "warning",
            "children": [{
                "name": "os-db-node",
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
            }]
        }, {
            "name": "message queue",
            "state": "ok",
            "children": [{
                "name": "os-mq",
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
            }]
        }]
    };
/*
    $scope.physicalTopoData = {
        "name": "compass-dc1",
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
*/
    $scope.physicalTopoData = {
        "name": "compass-dc1",
        "children": [{
            "name": "172.29.8.40",
            "state": "warning",
            "children": [{
                "name": "os-controller",
                "state": "warning"
            }, {
                "name": "os-db-node",
                "state": "ok"
            }, {
                "name": "os-keystone",
                "state": "ok"
            }, {
                "name": "os-network",
                "state": "ok"
            }, {
                "name": "os-image",
                "state": "ok"
            }, {
                "name": "os-mq",
                "state": "ok"
            }, {
                "name": "os-compute1",
                "state": "warning"
            }, {
                "name": "os-compute2",
                "state": "ok"
            }]
        }]
    };
    $scope.serverCount = 8;

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
