define(['angularAnimate', 'angularUiTree', 'nvd3Directive', 'ngSpinner'], function() {

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

    monitoringModule.controller('metricsCtrl', function($rootScope, $scope, dataService, $stateParams, metricsFactory) {
        var clusterId = $stateParams.id;
        $scope.clickedHashTable = {};
        $scope.metricsTree = []; // contains ui tree data
        $scope.loading = 0;
        metricsFactory.init();
        $scope.timeUnit = ["milliseconds","seconds","minutes", "hours", "days", "months", "years"];
        $scope.start_relative = {
            "value": 1,
            "unit": "hours"
        };
        /*==== format data for ui-tree ====*/
        dataPreprocessing = function(data, name) {
            angular.forEach(data.nodes, function(node) {
                if (node.nodes.length == 0) {
                    var start = 0;
                    if ((start = node.title.indexOf("(")) > -1) {

                        var end = node.title.indexOf(")");
                        var insideWord = node.title.substring(start + 1, end);
                        node.id = name + "." + node.title.substring(0, start - 1) + "." + insideWord;

                        // console.log(node.title);
                    } else {
                        node.id = name + "." + node.title;
                    }
                    return;
                }
                dataPreprocessing(node, name + "." + node.title);
            })
        }
        dataService.monitorMetricsTree().success(function(data) {
            angular.forEach(data, function(node) {
                dataPreprocessing(node, node.title);
            });
            $scope.metricsTree = data;
            $scope.loading++;
        }).error(function(response) {
            // TODO
        });

        $scope.metricsName = [];
        dataService.monitorMetricsName().success(function(data) {
            $scope.metricsName = data;
            $scope.loading++;
        }).error(function(response) {
            // TODO
        });

        $scope.metricsData = [];
        $scope.metricsDataKey = [];
        /*==== ui tree draw graph ====*/
        $scope.generate = function(node) {
            var checked = $scope.metricsDataKey.indexOf(node.id) > -1 ? false : true;
            if (checked) {

                var selected = node.id;
                var index = metricsFactory.addSelectedMetrics(selected); //store the initial query

                var query = metricsFactory.getSelectedMetricsQuery(index);
                var clusterId = $stateParams.id;
                dataService.monitorMetricsQuery(clusterId, query).success(function(data) {
                    var index = metricsFactory.addDisplayData(data);
                    $scope.metricsData.push(metricsFactory.getDisplayData(index));
                    $scope.metricsDataKey.push(selected); // show selected on both multi-selection and ui-tree
                }).error(function(response) {
                    // TODO
                });

            } else {
                metricsFactory.removeSelectedMetrics(node.id);
                var index = $scope.metricsDataKey.indexOf(node.id);
                $scope.metricsData.splice(index, 1);
                $scope.metricsDataKey.splice(index, 1);
            }

        };

        $scope.isChecked = function(node) {
            return $scope.metricsDataKey.indexOf(node.id) > -1 ? true : false;
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

        $scope.yAxisTickFormatFunction = function() {
            return function(d) {
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

        $scope.changeTimeRange = function() {
            metricsFactory.setStartRelative($scope.start_relative);

            metricsFactory.setEndRelative($scope.end_relative);
            var clusterId = $stateParams.id;
            for (var i = 0; i < metricsFactory.getSelectedSize(); i++) {
                var query = metricsFactory.getSelectedMetricsQuery(i);
                console.log(query);
                dataService.monitorMetricsQuery(clusterId, query).success(function(data) {
                    var index = metricsFactory.updateDisplayData(data);
                }).error(function(response) {
                    // TODO
                });
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

    // this is the helper function to find index for a target object in an array
    var findTargetIndex = function(container, target) {
        var index = -1;
        var count = 0;

        angular.forEach(container, function(t) {
            if (t.key == target) {
                index = count;
            }
            count++;
        });
        if (index > -1)
            return index;
        return -1;
    };
    monitoringModule.directive('multiSelect', function($filter, dataService, $modal, $stateParams, metricsFactory) {  
        return {
            templateUrl: "src/app/monitoring/multiSelect.tpl.html",
            scope: {
                metricsData: "=metricsdata", //metricsData is the data that show on the graph
                names: "=allnames",
                metricsDataKey: "=metricsdatakey"

            },

            link: function(scope, elem, attrs) {
                var selected = "";
                // set focus on input text area
                $(".chosen-choices").click(function(event) {
                    event.stopPropagation();
                    if(event.target.nodeName != "A")
                    {
                        $(".search-field > input").focus();
                        $(".chosen-container").addClass("chosen-with-drop chosen-container-active");
                    }
                    scope.$apply();
                });
                // select one and put it in input area
                $(".chosen-results").on("click", "li.active-result", function() {
                    var clusterId = $stateParams.id;
                    selected = $(this).text();

                    var index = metricsFactory.addSelectedMetrics(selected); //store the initial query

                    var query = metricsFactory.getSelectedMetricsQuery(index);
                    dataService.monitorMetricsQuery(clusterId, query).success(function(data) {
                        var index = metricsFactory.addDisplayData(data);
                        scope.metricsData.push(metricsFactory.getDisplayData(index));
                        scope.metricsDataKey.push(selected); // show selected on both multi-selection and ui-tree
                    }).error(function(response) {
                        // TODO
                    });

                    //$(insertContent).insertBefore(".search-field");
                    scope.searchText = "";
                    scope.$apply();
                });

                //high light
                $(".chosen-results").on('mouseenter', 'li.active-result', function() {
                    $(this).addClass("highlighted");
                }).on('mouseleave', 'li', function() {
                    $(this).removeClass("highlighted");
                });
                // remove the selected one
                scope.removeSelected = function(target) {
                    metricsFactory.removeSelectedMetrics(target.data);
                    var index = scope.metricsDataKey.indexOf(target.data);
                    scope.metricsData.splice(index, 1);
                    scope.metricsDataKey.splice(index, 1);
                };
                //hide options when a user clicks other places
                $(document).click(function(e) {
                    $(".chosen-container").removeClass("chosen-with-drop chosen-container-active");
                });

                scope.filter = function(target) {
                    var modalInstance = $modal.open({
                        templateUrl: 'filter.html',
                        controller: 'metricsModalInstanceCtrl',
                        resolve: {
                            tags: function($q, dataService) {
                                var deferred = $q.defer();
                                var clusterId = $stateParams.id;
                                dataService.monitorMetricsTagName(clusterId, target.data).success(function(data) {
                                    deferred.resolve(data.queries[0].results[0].tags);
                                }).error(function(response) {
                                    // TODO
                                });
                                return deferred.promise;
                            },
                            metricsName: function() {
                                return target.data;
                            }
                        }
                    });
                };
            }  
        };
    });
    monitoringModule.controller('metricsModalInstanceCtrl', function($rootScope, $scope, $modalInstance,$stateParams, tags, metricsName, metricsFactory, dataService) {

        $scope.groups = ["tag", "time", "value"];
        $scope.timeUnit = ["milliseconds","seconds","minutes", "hours", "days", "months", "years"];
        $scope.aggregatorTypes = ["avg", "dev", "div","min", "max", "rate", "sampler", "sum", "scale", "count", "least_squares","percentile"];


        $scope.allTags = [];
        $scope.displayTags = tags;

        var index = metricsFactory.getIndex(metricsName);
        $scope.metrics = metricsFactory.getSelectedMetricsQuery(index).metrics;
        if (!jQuery.isEmptyObject($scope.metrics[0].tags)) {
            angular.forEach($scope.metrics[0].tags, function(value, key) {
                console.log(value)
                angular.forEach(value, function(v) {
                    var temp = {};
                    temp.selectedTag = key;
                    temp.tagValue = v;
                    $scope.allTags.push(temp);
                });
            });
        }
        $scope.addGroup = function() {
            if (!$scope.metrics[0].group_by) {
                $scope.metrics[0].group_by = [];
            }
            $scope.metrics[0].group_by.push({});
        };
        $scope.removeGroup = function(index) {
            $scope.metrics[0].group_by.splice(index, 1);
        };
        $scope.addAggregator = function() {
            $scope.metrics[0].aggregators.push({});
        };
        $scope.removeAggregator = function(index) {
            $scope.metrics[0].aggregators.splice(index, 1);
        }
        $scope.addTag = function() {
            $scope.allTags.push({});
        };
        $scope.removeTag = function(index) {
            $scope.allTags.splice(index, 1);
        }
        $scope.ok = function() {
            $scope.metrics[0].tags = {};
            angular.forEach($scope.allTags, function(tag) {
                if (!$scope.metrics[0].tags[tag.selectedTag]) {
                    $scope.metrics[0].tags[tag.selectedTag] = [];
                }
                $scope.metrics[0].tags[tag.selectedTag].push(tag.tagValue);
            });
            var index = metricsFactory.getIndex(metricsName);
            var query = metricsFactory.getSelectedMetricsQuery(index);
            var clusterId = $stateParams.id;
            dataService.monitorMetricsQuery(clusterId,query).success(function(data) {
                var index = metricsFactory.updateDisplayData(data);
            }).error(function(response) {
                // TODO
            });
            $modalInstance.close();
        };
        $scope.cleanGroupBy = function(index) {
            var temp = $scope.metrics[0].group_by[index].name;
            $scope.metrics[0].group_by[index] = {};
            $scope.metrics[0].group_by[index].name = temp;
        };
        $scope.cheanAggregator = function(index){
            var temp = $scope.metrics[0].aggregators[index].name;
            $scope.metrics[0].aggregators[index]= {};
            if(temp != "div" && temp != "rate" && temp != "sampler" && temp !="scale")
            {
                $scope.metrics[0].aggregators[index].align_sampling = true;
            }
            $scope.metrics[0].aggregators[index].name= temp;
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });

});