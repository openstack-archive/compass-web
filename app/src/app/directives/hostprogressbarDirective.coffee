define ['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'hostprogressbar', ['dataService','$timeout', (dataService, $timeout) ->
        return {
            restrict: 'E'
            scope:
               hostid: '='
               clusterid: '='
               clusterstate: '='
               progressdata: '@'
            templateUrl: "src/app/partials/progressbar.tpl.html"
            link: (scope, element, attrs) ->
                hostId = scope.hostid
                clusterId = scope.clusterid
                clusterState = scope.clusterstate
                progress = 0
                progressTimer = null
                fireTimer = true
                scope.progressdata = 0
                scope.progressSeverity = "INFO"
                num = 0

                getProgress = ->
                    dataService.getClusterHostProgress(clusterId, hostId).success (progressData)->
                        progress = parseInt(eval(progressData.percentage * 100))
                        scope.progressdata = progress
                        if fireTimer and progress < 100 and num != 1
                            progressTimer = $timeout(getProgress, 5000)
                        scope.message = progressData.message
                        scope.progressSeverity = progressData.severity

                scope.$watch 'clusterstate', (val) ->
                    if clusterState != "SUCCESSFUL" and clusterState != "ERROR"
                        $timeout(getProgress, 1000)
                    else
                        num = 1
                        getProgress()

                element.bind '$destroy', ->
                        fireTimer = false
                        $timeout.cancel(progressTimer)
         }
    ]
