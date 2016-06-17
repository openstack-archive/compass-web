(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('clustersListCtrl', [
      '$scope', 'clusterService', '$state', '$filter', 'ngTableParams', '$modal', 'allClusterData', function($scope, clusterService, $state, $filter, ngTableParams, $modal, allClusterData) {
        var data;
        $scope.state = $state;
        clusterService.getClustersProgress(allClusterData);
        $scope.clusters = allClusterData;
        data = $scope.clusters;
        $scope.tableParams = new ngTableParams({
          page: 1,
          count: 10
        }, {
          total: data.length,
          getData: function($defer, params) {
            var orderedData;
            orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            return $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
        return $scope.goToCluster = function(id, state) {
          return clusterService.goToCluster(id, state);
        };
      }
    ]).controller('createClusterCtrl', [
      '$scope', 'clusterService', '$modal', function($scope, clusterService, $modal) {
        clusterService.getAdapters($scope);
        return $scope.open = function() {
          var modalInstance;
          $scope.cluster = {};
          modalInstance = $modal.open({
            templateUrl: 'src/app/partials/modalClusterCreate.tpl.html',
            controller: 'newClusterModalCtrl',
            resolve: {
              allAdapters: function() {
                return $scope.allAdapters;
              },
              cluster: function() {
                return $scope.cluster;
              }
            }
          });
          return modalInstance.result.then(function(cluster) {
            var postClusterData;
            $scope.cluster = cluster;
            postClusterData = {
              "name": cluster.name,
              "adapter_id": cluster.adapter.id,
              "os_id": cluster.os.id
            };
            if (cluster.flavor) {
              postClusterData.flavor_id = cluster.flavor.id;
            }
            return clusterService.createCluster($scope, postClusterData);
          }, function() {
            return console.log("dismiss");
          });
        };
      }
    ]).controller('newClusterModalCtrl', [
      '$scope', '$log', '$modalInstance', 'allAdapters', 'cluster', function($scope, $log, $modalInstance, allAdapters, cluster) {
        $scope.allAdapters = allAdapters;
        $scope.cluster = cluster;
        $scope.updateSelectedAdapter = function() {
          var adapter, _i, _len, _ref, _results;
          _ref = $scope.allAdapters;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            adapter = _ref[_i];
            if (adapter.id === $scope.cluster.adapter.id) {
              $scope.supported_oses = adapter.supported_oses;
              _results.push($scope.flavors = adapter.flavors);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        $scope.cancel = function() {
          return $modalInstance.dismiss('cancel');
        };
        return $scope.ok = function() {
          $scope.result = 'ok';
          return $modalInstance.close($scope.cluster);
        };
      }
    ]).controller('clusterProgressCtrl', [
      '$scope', 'clusterService', '$stateParams', 'clusterhostsData', function($scope, clusterService, $stateParams, clusterhostsData) {
        var request;
        clusterService.clusterProgressInit($scope, clusterhostsData, $stateParams);
        clusterService.displayDataInTable($scope, $scope.hosts);
        $scope.clusterId = $stateParams.id;
        request = {
          "check_health": null
        };
        $scope.startChecking = function() {
          return clusterService.startHealthCheck($scope.clusterId, request, $scope);
        };
        return $scope.selectAllServers = function(flag) {
          var sv, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
          if (flag) {
            _ref = $scope.hosts;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sv = _ref[_i];
              _results.push(sv.selected = true);
            }
            return _results;
          } else {
            _ref1 = $scope.hosts;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              sv = _ref1[_j];
              _results1.push(sv.selected = false);
            }
            return _results1;
          }
        };
      }
    ]).controller('configurationCtrl', [
      '$scope', 'clusterService', '$modal', '$stateParams', 'clusterhostsData', function($scope, clusterService, $modal, $stateParams, clusterhostsData) {
        clusterService.configurationInit($scope, $stateParams, clusterhostsData);
        return clusterService.displayDataInTable($scope, $scope.hosts);
      }
    ]).controller('clusterReportCtrl', [
      '$scope', '$state', 'clusterService', '$stateParams', '$timeout', '$modal', function($scope, $state, clusterService, $stateParams, $timeout, $modal) {
        clusterService.getReports($scope, $stateParams.id);
        return $scope.openModal = function(key, reportname) {
          var modalInstance;
          return modalInstance = $modal.open({
            templateUrl: 'src/app/partials/ErrorInfo.html',
            controller: 'reportErrorCtrl',
            resolve: {
              detail: function() {
                return $scope.details[reportname][key];
              }
            }
          });
        };
      }
    ]).controller('navCtrl', [
      '$scope', 'clusterService', '$stateParams', function($scope, clusterService, $stateParams) {
        return clusterService.getHealthReportsCheck($scope, $stateParams.id);
      }
    ]);
  });

}).call(this);
