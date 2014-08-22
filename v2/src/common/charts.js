angular.module('compass.charts', [])

.directive('piechart', function() {
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
})

.directive('hostprogressbar', function(dataService, $timeout) {
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
})

.directive('circlepacking', function() {
    return {
        restrict: 'EAC',
        scope: {
            data: '='
        },
        link: function(scope, elem, attrs) {
            //console.log(scope, elem, attrs)
            var data = scope.data;

            var w = 600,
                h = 600,
                r = 550,
                x = d3.scale.linear().range([0, r]),
                y = d3.scale.linear().range([0, r]),
                node,
                root;

            var pack = d3.layout.pack()
                .size([r, r])
                .value(function(d) {
                    if (d.children === undefined || d.children.length == 0) {
                        return 500;
                    } else {
                        return undefined;
                    }
                })

            var vis = d3.select("circlepacking").append("svg:svg", "h2")
                .attr("width", w)
                .attr("height", h)
                .append("svg:g")
                .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

            node = root = data;

            var nodes = pack.nodes(root);

            vis.selectAll("circle")
                .data(nodes)
                .enter().append("svg:circle")
                .attr("class", function(d) {
                    return d.children ? "parent" : "child";
                })
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .attr("r", function(d) {
                    return d.r;
                })
                .attr("depth", function(d) {
                    return d.depth;
                })
                .on("click", function(d) {
                    return zoom(node == d ? root : d);
                })
                .on("mouseover", function(d) {
                    //console.log("mouseover ", d)
                });

            vis.selectAll("text")
                .data(nodes)
                .enter().append("svg:text")
                .attr("class", function(d) {
                    return d.children ? "parent" : "child";
                })
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.children ? d.y + d.r + 10 : d.y;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .style("opacity", function(d) {
                    return d.r > 20 ? 1 : 0;
                })
                .text(function(d) {
                    return d.name;
                });

            d3.select(window).on("click", function() {
                zoom(root);
            });


            function zoom(d, i) {
                var k = r / d.r / 2;
                x.domain([d.x - d.r, d.x + d.r]);
                y.domain([d.y - d.r, d.y + d.r]);

                var t = vis.transition()
                    .duration(d3.event.altKey ? 7500 : 750);

                t.selectAll("circle")
                    .attr("cx", function(d) {
                        return x(d.x);
                    })
                    .attr("cy", function(d) {
                        return y(d.y);
                    })
                    .attr("r", function(d) {
                        return k * d.r;
                    });

                t.selectAll("text")
                    .attr("x", function(d) {
                        return x(d.x);
                    })
                    .attr("y", function(d) {
                        return d.children ? y(d.y + d.r + 10) : y(d.y);
                    })
                    .style("opacity", function(d) {
                        return k * d.r > 20 ? 1 : 0;
                    });

                node = d;
                d3.event.stopPropagation();
            }

        }
    };
})

.directive('treechart', function() {
    return {
        restrict: 'EAC',
        scope: {
            data: '=',
            count: '=',
            id: '@'
        },
        link: function(scope, elem, attrs) {
            var id = scope.id;

            var margin = {
                top: 0,
                right: 120,
                bottom: 0,
                left: 130
            };

            var serverCount = scope.count;

            var serversHeight = serverCount * 68;
            if (serversHeight < 500) {
                serversHeight = 500;
            }

            var width = 1000 - margin.right - margin.left,
                height = serversHeight - margin.top - margin.bottom;

            imgWidth = 163;
            imgHeight = 32;

            var i = 0,
                duration = 750,
                root;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) {
                    return [d.y, d.x];
                });

            var svg = d3.select("#" + id).append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            root = scope.data;
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
                            return "assets/img/switch.png";
                        else
                            return "assets/img/server.png";
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
                            return 0.4;
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
                        return d.name;
                    })
                    .style("font-size", "15px")
                    .style("fill-opacity", 1e-6);

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
});
