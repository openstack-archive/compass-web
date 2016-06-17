(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('hostprogressbar', [
      'dataService', '$timeout', function(dataService, $timeout) {
        return {
          restrict: 'E',
          scope: {
            hostid: '=',
            clusterid: '=',
            clusterstate: '=',
            progressdata: '@'
          },
          templateUrl: "src/app/partials/progressbar.tpl.html",
          link: function(scope, element, attrs) {
            var clusterId, clusterState, fireTimer, getProgress, hostId, num, progress, progressTimer;
            hostId = scope.hostid;
            clusterId = scope.clusterid;
            clusterState = scope.clusterstate;
            progress = 0;
            progressTimer = null;
            fireTimer = true;
            scope.progressdata = 0;
            scope.progressSeverity = "INFO";
            num = 0;
            getProgress = function() {
              return dataService.getClusterHostProgress(clusterId, hostId).success(function(progressData) {
                progress = parseInt(eval(progressData.percentage * 100));
                scope.progressdata = progress;
                if (fireTimer && progress < 100 && num !== 1) {
                  progressTimer = $timeout(getProgress, 5000);
                }
                scope.message = progressData.message;
                return scope.progressSeverity = progressData.severity;
              });
            };
            scope.$watch('clusterstate', function(val) {
              if (clusterState !== "SUCCESSFUL" && clusterState !== "ERROR") {
                return $timeout(getProgress, 1000);
              } else {
                num = 1;
                return getProgress();
              }
            });
            return element.bind('$destroy', function() {
              fireTimer = false;
              return $timeout.cancel(progressTimer);
            });
          }
        };
      }
    ]);
  });

}).call(this);
