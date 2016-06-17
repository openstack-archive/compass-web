define(['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'piechart', () ->
      return {
        restrict: 'E'
        scope:
          piedata: '='
        link: (scope, element, attrs) ->
          piedata = scope.piedata
          width = 300
          height = 250
          radius = Math.min(width, height) / 2
          color = d3.scale.ordinal().range ["#fee188", "#cb6fd7", "#9abc32", "#f79263", "#6fb3e0", "#d53f40", "#1F77B4"]
          svg = d3.select("piechart").append("svg")
            .attr("width", width)
            .attr("height",height)
            .append("g")
            .attr("transform","translate(" + width / 2 + "," + height / 2 + ")")
          arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0)

          scope.$watch('piedata', (val) ->
            piedata = val
            svg.selectAll('g.arc').remove()
            pie = d3.layout.pie()
              .sort(null)
              .value (d) ->
                return d.number
            for d in piedata
              d.number = +d.number

            g = svg.selectAll(".arc")
              .data(pie(piedata))
              .enter().append("g")
              .attr("class", "arc")

            g.append("path")
              .attr("d", arc)
              .attr('stroke', '#fff')
              .attr('stroke-width', '3')
              .style("fill", (d) ->
                return color(d.data.name)
              )
            g.append("text")
              .attr("transform", (d) ->
                return "translate(" + arc.centroid(d) + ")"
              )
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text (d) ->
                return d.data.name
          ,true

          )
      }
)