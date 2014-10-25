define(['angular', 'ganttChart'], function(angular, ganttChart) {
    var chartsModule = angular.module('compass.charts', []);

    chartsModule.directive('piechart', function() {
        return {
            restrict: 'E',
            scope: {
                piedata: '='
            },
            link: function(scope, element, attrs) {
                var piedata = scope.piedata;

                var width = 300,
                    height = 250,
                    radius = Math.min(width, height) / 2;
                //var color = d3.scale.category20();
                var color = d3.scale.ordinal()
                    .range(["#fee188", "#cb6fd7", "#9abc32", "#f79263", "#6fb3e0", "#d53f40", "#1F77B4"]);

                var svg = d3.select("piechart").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

                scope.$watch('piedata', function(val) {
                    piedata = val;

                    svg.selectAll('g.arc').remove();

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.number;
                        });

                    piedata.forEach(function(d) {
                        d.number = +d.number;
                    });

                    var g = svg.selectAll(".arc")
                        .data(pie(piedata))
                        .enter().append("g")
                        .attr("class", "arc");

                    g.append("path")
                        .attr("d", arc)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', '3')
                        .style("fill", function(d) {
                            return color(d.data.name);
                        });

                    g.append("text")
                        .attr("transform", function(d) {
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.name;
                        });

                }, true)
            }
        }
    });

    chartsModule.directive('hostprogressbar', function(dataService, $timeout) {
        return {
            restrict: 'E',
            scope: {
                hostid: '=',
                clusterid: '=',
                clusterstate: '=',
                progressdata: '@'
            },
            templateUrl: "src/common/progressbar.tpl.html",
            link: function(scope, element, attrs) {
                var hostId = scope.hostid;
                var clusterId = scope.clusterid;
                var clusterState = scope.clusterstate;
                var progress = 0;
                var progressTimer;
                var fireTimer = true;
                scope.progressdata = 0;
                scope.progressSeverity = "INFO";
                var getProgress = function(num) {
                    dataService.getClusterHostProgress(clusterId, hostId).then(function(progressData) {
                        //success
                        progress = parseInt(eval(progressData.data.percentage * 100));
                        scope.progressdata = progress;
                        if (fireTimer && progress < 100 && num != 1) {
                            progressTimer = $timeout(getProgress, 5000);
                        }
                        scope.message = progressData.data.message;
                        scope.progressSeverity = progressData.data.severity;
                    }, function(response) {

                    })
                };

                scope.$watch('clusterstate', function(val) {
                    if (clusterState != "SUCCESSFUL" && clusterState != "ERROR") {
                        $timeout(getProgress, 1000);
                    } else {
                        getProgress(1);
                    }
                });

                element.bind('$destroy', function() {
                    fireTimer = false;
                    $timeout.cancel(progressTimer);
                });
            }
        }
    });

    chartsModule.directive('circlepacking', function() {
     return {
         restrict: 'EAC',
         scope: {
             data: '=',
             dataready: '=',
             id: '@'
         },
         link: function(scope, elem, attrs) {
             scope.$watch('dataready', function(newVal, oldVal) {
                 if (newVal != oldVal) {
                     if (newVal == "true") {
                         drawCircleGraph();
                     }
                 }
             }, true);

             function drawCircleGraph() {

                 var elemId = scope.id,
                     data = scope.data,
                     margin = 20,
                     diameter = 660;
                 var color = d3.scale.linear()
                     .domain([-1, 5])
                     .range(["hsl(204, 80%, 71%)", "hsl(236, 100%, 50%)"])
                     .interpolate(d3.interpolateHcl);

                 var pack = d3.layout.pack()
                     .padding(2)
                     .size([diameter - margin, diameter - margin])
                     .value(function(d) {
                         return 500;
                     });

                 var svg = d3.select("#" + elemId).append("svg", "h2")
                     .attr("width", diameter)
                     .attr("height", diameter)
                     .append("g")
                     .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
                 var focus = root = data,
                     nodes = pack.nodes(root),
                     view;
                 var circle = svg.selectAll("circle")
                     .data(nodes)
                     .enter().append("circle")
                     .attr("class", function(d) {
                         return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"
                     })
                     .style("fill", function(d) {
                         return d.children ? color(d.depth) : null;
                     })
                     .style("stroke", function(d) {
                         return d.state == "error" ? "red" : null;
                     })
                     .on("mouseover", function(d) {
                         var name = d.name;
                         svg.selectAll("text")
                             .style("fill", function(d) {
                                 return d.name == name ? "red" : null;
                             })
                             .attr("class", function(d) {
                                 return d.name == name ? "chartLabel-hover" : "chartLabel"
                             });
                     })
                     .on("mouseout", function(d) {
                         var name = d.name;
                         svg.selectAll("text")
                             .style("fill", function(d) {
                                 return d.name == name ? "black" : null;
                             })
                             .attr("class", "chartLabel");
                     })
                     .on("click", function(d) {
                         if (focus !== d) zoom(d);
                         d3.event.stopPropagation();
                     });

                 var text = svg.selectAll("text")
                     .data(nodes)
                     .enter().append("text")
                     .attr("class", "chartLabel")
                     .style("fill-opacity", function(d) {
                         return d.parent === root ? 1 : 0;
                     })
                     .style("display", function(d) {
                         return d.parent === root ? null : "none";
                     })
                     .text(function(d) {
                         return d.name;
                     });
                 var node = svg.selectAll("circle,text");

                 zoomTo([root.x, root.y, root.r * 2 + margin]);

                 d3.select("#" + elemId)
                     .on("click", function() {
                         zoom(root);
                     });

                 function zoomTo(v) {
                     var k = diameter / v[2];
                     view = v;
                     node.attr("transform", function(d) {
                         return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                     });
                     circle.attr("r", function(d) {
                         if (isOverlap(d)) {
                             return (d.r - 10) * k;
                         }
                         return d.r * k;
                     });
                 }

                 function isOverlap(d) {
                     if (d === root) {
                         return false;
                     }
                     if (d.r == d.parent.r) {
                         return true;
                     }

                     return isOverlap(d.parent);

                 }

                 function zoom(d) {
                     var focus0 = focus;
                     focus = d;
                     var transition = d3.transition()
                         .duration(d3.event.altKey ? 7500 : 750)
                         .tween("zoom", function(d) {
                             var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                             return function(t) {
                                 zoomTo(i(t));
                             };
                         });
                     transition.selectAll("text")
                         .filter(function(d) {
                             return d.parent === focus || this.style.display === "inline"
                         })
                         .style("fill-opacity", function(d) {
                             return d.parent === focus ? 1 : 0
                         })
                         .each("start", function(d) {
                             if (d.parent === focus) this.style.display = "inline";
                         })
                         .each("end", function(d) {
                             if (d.parent !== focus) this.style.display = "none";
                         })
                 }

             }
         }

     }
 });

    chartsModule.directive('treechart', function() {
        return {
            restrict: 'EAC',
            scope: {
                data: '=',
                dataready: '=',
                id: '@'
            },
            link: function(scope, elem, attrs) {
                scope.$watch('dataready', function(newVal, oldVal) {
                    if (newVal != oldVal) {
                        if (newVal == "true") {
                            drawTree();
                        }
                    }
                }, true);

                function drawTree() {
                    var elemId = scope.id,
                        tree = d3.layout.tree();

                    var margin = {
                        top: 20,
                        right: 120,
                        bottom: 0,
                        left: 130
                    };

                    // calculate servers count
                    var serverCount = 0;
                    var treeNodes = tree.nodes(scope.data).reverse();
                    treeNodes.forEach(function(d) {
                        if (d.depth == 2)
                            serverCount++;
                    });

                    var serversHeight = serverCount * 68;
                    if (serversHeight < 500) {
                        serversHeight = 500;
                    }

                    var width = 1000 - margin.right - margin.left,
                        height = serversHeight - margin.top - margin.bottom;
                    tree.size([height, width]);

                    imgWidth = 163;
                    imgHeight = 32;

                    var i = 0,
                        duration = 750,
                        root = scope.data;

                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) {
                            return [d.y, d.x];
                        });

                    var svg = d3.select("#" + elemId).append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    root.x0 = height / 2;
                    root.y0 = 0;

                    update(root);

                    d3.select(self.frameElement).style("height", "600px");

                    function update(source) {

                        // Compute the new tree layout.
                        var nodes = tree.nodes(root).reverse(),
                            links = tree.links(nodes);

                        // Normalize for fixed-depth.
                        nodes.forEach(function(d) {
                            d.y = d.depth * 300;
                        });

                        // Update the nodes…
                        var node = svg.selectAll("g.node")
                            .data(nodes, function(d) {
                                return d.id || (d.id = ++i);
                            });

                        // Enter any new nodes at the parent's previous position.
                        var nodeEnter = node.enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) {
                                var transX = parseFloat(source.y0) - 10;
                                var transY = parseFloat(source.x0) - imgHeight / 2;
                                return "translate(" + transX + "," + transY + ")";
                            })
                            .attr("width", imgWidth)
                            .attr("height", imgHeight)
                            .on("click", click);

                        nodeEnter.append("image")
                            .attr("xlink:href", function(d) {
                                if (d.depth == 0)
                                    return "assets/img/router.png";
                                else if (d.depth == 1)
                                    return "assets/img/switch1.png";
                                else
                                    return "assets/img/server1.png";
                            })
                            .attr("width", imgWidth)
                            .attr("height", imgHeight);

                        nodeEnter.append("rect")
                            .attr("width", imgWidth)
                            .attr("height", imgHeight)
                            .attr("data-state", function(d) {
                                return d.state
                            })
                            .style("opacity", function(d) {
                                if (d.depth == 0)
                                    return 0;
                                else
                                    return 0.3;
                            })
                            .on("mouseover", function(d) {
                                if (d.depth > 1) {
                                    var foWidth = 300;

                                    var fo = svg.append("foreignObject")
                                        .attr({
                                            "x": d.y - 330,
                                            "y": d.x - 37,
                                            "width": foWidth,
                                            "class": "svg-tooltip"
                                        });
                                    var div = fo.append("xhtml:div")
                                        .append("div")
                                        .attr("class", "tip");

                                    var table = div.append("table")
                                        .style("width", "100%");

                                    var tr_hostname = table.append("tr");
                                    tr_hostname.append("td")
                                        .attr("class", "pull-right")
                                        .style("font-weight", "bold")
                                        .html("Hostname");
                                    tr_hostname.append("td")
                                        .attr("class", "padding-left-15")
                                        .html(d.name.split("@")[0]);

                                    var tr_ip = table.append("tr");
                                    tr_ip.append("td")
                                        .attr("class", "pull-right")
                                        .style("font-weight", "bold")
                                        .html("IP");
                                    tr_ip.append("td")
                                        .attr("class", "padding-left-15")
                                        .html(d.name.split("@")[1]);

                                    var tr_state = table.append("tr");
                                    tr_state.append("td")
                                        .attr("class", "pull-right")
                                        .style("font-weight", "bold")
                                        .html("State");
                                    tr_state.append("td")
                                        .attr("class", "padding-left-15")
                                        .html(d.state);

                                    var foHeight = div[0][0].getBoundingClientRect().height;
                                    fo.attr({
                                        "height": foHeight
                                    });
                                }
                            })
                            .on("mouseout", function() {
                                svg.selectAll(".svg-tooltip").remove();
                            });

                        nodeEnter.append("text")
                            .attr("x", function(d) {
                                if (d.depth == 0)
                                    return -5;
                                else
                                    return d.children || d._children ? -8 : imgWidth + 10;
                            })
                            .attr("y", function(d) {
                                if (d.depth == 0)
                                    return imgHeight / 2;
                                else if (d.depth == 1)
                                    return 6;
                                else
                                    return imgHeight / 2;
                            })
                            .attr("dy", ".25em")
                            .attr("text-anchor", function(d) {
                                return d.children || d._children ? "end" : "start";
                            })
                            .text(function(d) {
                                return d.name.split("@")[0];
                            })
                            .style("font-size", "15px");

                        // Transition nodes to their new position.
                        var nodeUpdate = node.transition()
                            .duration(duration)
                            .attr("transform", function(d) {
                                var transX = parseFloat(d.y) - 10;
                                var transY = parseFloat(d.x) - imgHeight / 2;
                                return "translate(" + transX + "," + transY + ")";
                            });

                        nodeUpdate.select("text")
                            .style("fill-opacity", 1);

                        // Transition exiting nodes to the parent's new position.
                        var nodeExit = node.exit().transition()
                            .duration(duration)
                            .attr("transform", function(d) {
                                var transX = parseFloat(source.y) - 10;
                                var transY = parseFloat(source.x) - imgHeight / 2;
                                return "translate(" + transX + "," + transY + ")";
                            })
                            .remove();

                        nodeExit.select("circle")
                            .attr("r", 1e-6);

                        nodeExit.select("text")
                            .style("fill-opacity", 1e-6);

                        // Update the links…
                        var link = svg.selectAll("path.link")
                            .data(links, function(d) {
                                return d.target.id;
                            });

                        // Enter any new links at the parent's previous position.
                        link.enter().insert("path", "g")
                            .attr("class", "link")
                            .attr("d", function(d) {
                                var o = {
                                    x: source.x0,
                                    y: source.y0
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            });

                        // Transition links to their new position.
                        link.transition()
                            .duration(duration)
                            .attr("d", diagonal);

                        // Transition exiting nodes to the parent's new position.
                        link.exit().transition()
                            .duration(duration)
                            .attr("d", function(d) {
                                var o = {
                                    x: source.x,
                                    y: source.y
                                };
                                return diagonal({
                                    source: o,
                                    target: o
                                });
                            })
                            .remove();

                        // Stash the old positions for transition.
                        nodes.forEach(function(d) {
                            d.x0 = d.x;
                            d.y0 = d.y;
                        });
                    }

                    // Toggle children on click.
                    function click(d) {
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else {
                            d.children = d._children;
                            d._children = null;
                        }
                        update(d);
                    }
                }
            }
        }
    });

    chartsModule.directive('ganttchart', function() {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                dataready: '='
            },
            template: '<div class="pull-right"><button type="button" class="btn btn-xs side-margin-3" ng-click="changeTimeDomain(\'1hr\')">1 HR</button>' + '<button type="button" class="btn btn-xs side-margin-3" ng-click="changeTimeDomain(\'3hr\')">3 HR</button>' + '<button type="button" class="btn btn-xs side-margin-3" ng-click="changeTimeDomain(\'6hr\')">6 HR</button>' + '<button type="button" class="btn btn-xs side-margin-3" ng-click="changeTimeDomain(\'1day\')">1 DAY</button>' + '<button type="button" class="btn btn-xs side-margin-3" ng-click="changeTimeDomain(\'1week\')">1 WEEK</button>' + '</div>' + '<div class="clear-fix"></div>',
            // BUG: svg not appended initially if using templateUrl
            //templateUrl: "src/common/ganttchart.tpl.html",
            link: function(scope, element, attrs) {
                scope.$watch('dataready', function(newVal, oldVal) {
                    if (newVal != oldVal) {
                        if (newVal == "true") {
                            drawChart();
                        }
                    }
                }, true);

                function drawChart() {
                    var tasks = scope.data;
                    var hostnames = [];

                    angular.forEach(tasks, function(task) {
                        if (hostnames.indexOf(task) == -1) {
                            hostnames.push(task.name);
                        }
                    });

                    //var hostnames = scope.hosts;
                    var taskStatus = {
                        "ok": "bar-successful",
                        "critical": "bar-failed",
                        "warning": "bar-warning",
                        "unknown": "bar-unknown"
                    };

                    tasks.sort(function(a, b) {
                        return a.endDate - b.endDate;
                    });
                    var maxDate = tasks[tasks.length - 1].endDate;
                    tasks.sort(function(a, b) {
                        return a.startDate - b.startDate;
                    });
                    var minDate = tasks[0].startDate;

                    var format = "%H:%M";
                    var timeDomainString = "1day";

                    //var gantt = d3.gantt().taskTypes(hostnames).taskStatus(taskStatus).tickFormat(format).height(450).width(800);

                    var gantt = ganttChart().taskTypes(hostnames).taskStatus(taskStatus).tickFormat(format).height(450).width(800);
                    scope.changeTimeDomain = function(timeDomainString) {
                        this.timeDomainString = timeDomainString;
                        switch (timeDomainString) {
                            case "1hr":
                                format = "%H:%M:%S";
                                gantt.timeDomain([d3.time.hour.offset(getEndDate(), -1), getEndDate()]);
                                break;
                            case "3hr":
                                format = "%H:%M";
                                gantt.timeDomain([d3.time.hour.offset(getEndDate(), -3), getEndDate()]);
                                break;

                            case "6hr":
                                format = "%H:%M";
                                gantt.timeDomain([d3.time.hour.offset(getEndDate(), -6), getEndDate()]);
                                break;

                            case "1day":
                                format = "%H:%M";
                                gantt.timeDomain([d3.time.day.offset(getEndDate(), -1), getEndDate()]);
                                break;

                            case "1week":
                                format = "%a %H:%M";
                                gantt.timeDomain([d3.time.day.offset(getEndDate(), -7), getEndDate()]);
                                break;
                            default:
                                format = "%H:%M"

                        }
                        gantt.tickFormat(format);
                        gantt.redraw(tasks);
                    }

                    gantt.timeDomainMode("fixed");
                    scope.changeTimeDomain(timeDomainString);

                    gantt(tasks);



                    function getEndDate() {
                        var lastEndDate = Date.now();
                        if (tasks.length > 0) {
                            lastEndDate = tasks[tasks.length - 1].endDate;
                        }

                        return lastEndDate;
                    }

                }

            }
        }

    });
});
