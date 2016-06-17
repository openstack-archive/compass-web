(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('piechart', function() {
      return {
        restrict: 'E',
        scope: {
          piedata: '='
        },
        link: function(scope, element, attrs) {
          var arc, color, height, piedata, radius, svg, width;
          piedata = scope.piedata;
          width = 300;
          height = 250;
          radius = Math.min(width, height) / 2;
          color = d3.scale.ordinal().range(["#fee188", "#cb6fd7", "#9abc32", "#f79263", "#6fb3e0", "#d53f40", "#1F77B4"]);
          svg = d3.select("piechart").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
          arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);
          return scope.$watch('piedata', function(val) {
            var d, g, pie, _i, _len;
            piedata = val;
            svg.selectAll('g.arc').remove();
            pie = d3.layout.pie().sort(null).value(function(d) {
              return d.number;
            });
            for (_i = 0, _len = piedata.length; _i < _len; _i++) {
              d = piedata[_i];
              d.number = +d.number;
            }
            g = svg.selectAll(".arc").data(pie(piedata)).enter().append("g").attr("class", "arc");
            g.append("path").attr("d", arc).attr('stroke', '#fff').attr('stroke-width', '3').style("fill", function(d) {
              return color(d.data.name);
            });
            return g.append("text").attr("transform", function(d) {
              return "translate(" + arc.centroid(d) + ")";
            }).attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
              return d.data.name;
            });
          }, true);
        }
      };
    });
  });

}).call(this);
