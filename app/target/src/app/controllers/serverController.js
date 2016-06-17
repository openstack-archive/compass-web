(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('serverCtrl', [
      '$scope', 'dataService', '$filter', 'machinesHostsData', 'wizardService', function($scope, dataService, $filter, machinesHostsData, wizardService) {
        $scope.hideunselected = '';
        $scope.search = {};
        $scope.allservers = machinesHostsData;
        wizardService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.machines_hosts;
        });
        wizardService.displayDataInTable($scope, $scope.allservers);
        wizardService.watchingTriggeredStep($scope);
        $scope.hideUnselected = function() {
          if ($scope.hideunselected) {
            return $scope.search.selected = true;
          } else {
            return delete $scope.search.selected;
          }
        };
        $scope.ifPreSelect = function(server) {
          var svCluster, _i, _len, _ref, _results;
          server.disable = false;
          if (server.clusters) {
            if (server.clusters.length > 0) {
              server.disabled = true;
            }
            _ref = server.clusters;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              svCluster = _ref[_i];
              if (svCluster.id === $scope.cluster.id) {
                server.selected = true;
                _results.push(server.disabled = false);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
        return wizardService.watchAndAddNewServers($scope);
      }
    ]);
  });

}).call(this);
