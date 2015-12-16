(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('topnavCtrl', [
      '$scope', '$state', '$http', 'dataService', '$rootScope', 'wizardFactory', function($scope, $state, $http, dataService, $rootScope, wizardFactory) {
        dataService.getClusters().success(function(data) {
          return $scope.clusters = data;
        });
        $rootScope.$on('newClusters', function(event, data) {
          return $scope.clusters = data;
        });
        return $scope.gotoCluster = function(id) {
          return dataService.getClusterProgress(id).success(function(data) {
            if (data.state === "UNINITIALIZED") {
              return $state.go("wizard", {
                "id": id,
                "config": "true"
              });
            } else {
              return $state.go("cluster.overview", {
                "id": id
              });
            }
          });
        };
      }
    ]);
  });

}).call(this);
