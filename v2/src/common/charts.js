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
                $timeout(getProgress, 1000);
                /*
                if (clusterState == "INSTALLING") {
                    $timeout(getProgress, 1000);
                } else {
                    getProgress(1);
                }*/
            });

            element.bind('$destroy', function() {
                fireTimer = false;
                $timeout.cancel(progressTimer);
            });
        },
        templateUrl: "src/common/progressbar.tpl.html"
    }
})
