define(['angularAnimate', 'angularUiTree', 'nvd3Directive','ngSpinner'], function() {

    var monitoringModule = angular.module('compass.monitoring', [
        'ui.router',
        'ui.bootstrap',
        'compass.charts',
        'ngAnimate',
        'nvd3ChartDirectives',
        'ui.tree',
        'angularSpinner'
    ]);

    monitoringModule.config(function($stateProvider, $urlRouterProvider) {
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
    });

    monitoringModule.controller('moniOverviewCtrl', function($scope, dataService, $stateParams) {
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

    });

    monitoringModule.controller('topologyCtrl', function($scope, dataService, $stateParams) {
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

    });

    monitoringModule.controller('alertsCtrl', function($scope, dataService, $stateParams) {
        var clusterId = $stateParams.id;

        $scope.alerts = [];
        $scope.alertDataReady = "false";

        dataService.monitorAlarms(clusterId).success(function(data) {
            $scope.alerts = data;
            $scope.alertDataReady = "true";
        }).error(function(response) {
            //TODO: error handling
        });

    });

    monitoringModule.controller('metricsCtrl', function($scope, dataService, $stateParams) {
        var clusterId = $stateParams.id;
        $scope.clickedHashTable = {};
        $scope.metricsTree = [];
        $scope.loading = 0;
        dataPreprocessing = function(data,name){
            angular.forEach(data.nodes,function(node){
                if(node.nodes.length == 0)
                {
                    var start = 0;
                    if((start = node.title.indexOf("(")) > -1)
                    {

                        var end = node.title.indexOf(")");
                        var insideWord = node.title.substring(start+1,end);
                        node.id = name +"."+node.title.substring(0,start-1)+"."+insideWord;

                        // console.log(node.title);
                    }
                    else
                    {
                        node.id = name+"."+node.title;
                    }
                    return;
                }
                dataPreprocessing(node,name+"."+node.title);
            })
        }
        dataService.monitorMetricsTree().success(function(data) {
            angular.forEach(data,function(node){
                dataPreprocessing(node,node.title);
            });
            $scope.metricsTree = data;
            $scope.loading++;
        }).error(function(response) {
            // TODO
        });
        /*$scope.metrics = [];
        dataService.monitorMetrics().success(function(data) {
            $scope.metrics = data;
        }).error(function(response) {
            // TODO
        });*/
        $scope.metricsName = [];
        dataService.monitorMetricsName().success(function(data) {
            $scope.metricsName = data;
            $scope.loading++;
        }).error(function(response) {
            // TODO
        });

        $scope.metricsData = [];
        $scope.metricsDataKey = [];
        $scope.generate = function(node) {
            var checked = $scope.metricsDataKey.indexOf(node.id) > -1? false: true;
            if (checked) {
                 dataService.monitorClusterMetric(clusterId, node.id).success(function(data) {
                     $scope.metricsData.push(data);
                     $scope.metricsDataKey.push(data.key);

                 }).error(function(response) {
                     // TODO
                 });
             } else{
                var index = $scope.metricsDataKey.indexOf(node);
                $scope.metricsData.splice(index, 1);
                $scope.metricsDataKey.splice(index, 1);
             }
        };

        $scope.isChecked = function(node){
            return $scope.metricsDataKey.indexOf(node.id) > -1? true: false;
        }

        // For Angular UI Tree
        // $scope.toggle = function(scope) {
        //     scope.toggle();
        // };

        $scope.toggleTab = function(scope) {
            var choice = scope.$element.text().trim();
            if (!$scope.clickedHashTable[choice]) {
                $scope.clickedHashTable[choice] = true;
            }
            scope.toggle();
        }
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

        $scope.yAxisTickFormatFunction = function(){
            return function(d){
                return d3.format(',d')(d);
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
    });
    monitoringModule.directive('multiSelect', function($filter, dataService, $stateParams) {  
        return {
            templateUrl: "src/app/monitoring/multiSelect.tpl.html",
            scope: {
                metricsData: "=metricsdata",
                names: "=allnames",
                metricsDataKey: "=metricsdatakey"

            },

            link: function(scope, elem, attrs) {
                // set focus on input text area
                $(".chosen-choices").click(function(event) {
                    event.stopPropagation();
                    $(".search-field > input").focus();
                    $(".chosen-container").addClass("chosen-with-drop chosen-container-active");
                    scope.$apply();
                });
                // select one and put it in input area
                $(".chosen-results").on("click", "li.active-result", function() {
                    var clusterId = $stateParams.id;
                    var selected = $(this).text();
                    dataService.monitorClusterMetric(clusterId, selected).success(function(data) {
                        console.log(data);
                        scope.metricsData.push(data);
                        scope.metricsDataKey.push(data.key);
                    }).error(function(response) {
                        // TODO
                    });

                    //$(insertContent).insertBefore(".search-field");
                    scope.searchText = "";
                    scope.$apply();
                });
                //hight light
                $(".chosen-results").on('mouseenter', 'li.active-result', function() {
                    $(this).addClass("highlighted");
                }).on('mouseleave', 'li', function() {
                    $(this).removeClass("highlighted");
                });
                // remove the selected one
                scope.removeSelected = function(target){
                    var index = scope.metricsDataKey.indexOf(target.data);
                    scope.metricsData.splice(index, 1);
                    scope.metricsDataKey.splice(index,1);
                };
                //hide options when a user clicks other places
                $(document).click(function(e) {
                    $(".chosen-container").removeClass("chosen-with-drop chosen-container-active");
                });

            }  
        };
    });

});
