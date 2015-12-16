(function() {
  define(['./baseService'], function() {
    'use strict';
    var Cluster;
    Cluster = (function() {
      var isEmpty;

      function Cluster(dataService, $state, wizardFactory, $timeout, ngTableParams, $filter, $rootScope) {
        this.dataService = dataService;
        this.$state = $state;
        this.wizardFactory = wizardFactory;
        this.$timeout = $timeout;
        this.ngTableParams = ngTableParams;
        this.$filter = $filter;
        this.$rootScope = $rootScope;
      }

      isEmpty = function(obj) {
        var prop;
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      };

      Cluster.prototype.getClusters = function() {
        return this.dataService.getClusters().success(function(data) {}).error(function(response) {
          return console.log(response);
        });
      };

      Cluster.prototype.getClustersProgress = function(clusters) {
        var cluster, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = clusters.length; _i < _len; _i++) {
          cluster = clusters[_i];
          _results.push(this.getProgressByCluster(cluster));
        }
        return _results;
      };

      Cluster.prototype.getProgressByCluster = function(cluster) {
        return this.dataService.getClusterProgress(cluster.id).success(function(data) {
          cluster.progress = data.status;
          return cluster.state = data.state;
        });
      };

      Cluster.prototype.startHealthCheck = function(id, request, $scope) {
        var $state;
        $state = this.$state;
        this.dataService.startHealthCheck(id, request).success(function(data) {
          return $state.go("cluster.report", data);
        });
        return $scope.$emit('activateReportTag', true);
      };

      Cluster.prototype.getHealthReportsCheck = function($scope, id) {
        $scope.activeReport = false;
        this.dataService.getHealthReports(id).success(function(reportsData) {
          if (!isEmpty(reportsData)) {
            return $scope.activeReport = true;
          } else {
            return $scope.activeReport = false;
          }
        });
        return $scope.$on('activateReportTag', function(event, data) {
          return $scope.activeReport = true;
        });
      };

      Cluster.prototype.getReports = function($scope, id) {
        var $timeout, dataService, dtLength, getAllReports, getIndividualDetails, getIndividualReports, progressTimer;
        $scope.reports = "";
        progressTimer = "";
        dataService = this.dataService;
        dtLength = -1;
        $timeout = this.$timeout;
        $scope.isTimeout = false;
        $scope.showData = false;
        $scope.categories = {};
        $scope.details = {};
        $scope.modalId = {};
        $scope.errorMessage = {};
        $scope.reportStates = {};
        $scope.promise = $timeout(function() {
          return $scope.isTimeout = true;
        }, 1200000);
        getIndividualReports = function() {
          var finishedNumbers, individualdt, _i, _len, _ref;
          finishedNumbers = 0;
          _ref = $scope.reports;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            individualdt = _ref[_i];
            if (($scope.reportStates[individualdt.name] === "verifying") || isEmpty($scope.reportStates[individualdt.name])) {
              getIndividualDetails(individualdt);
            } else {
              finishedNumbers = finishedNumbers + 1;
            }
          }
          if (finishedNumbers !== $scope.reports.length) {
            return progressTimer = $timeout(getIndividualReports, 3000);
          } else {
            return $timeout.cancel(progressTimer);
          }
        };
        getIndividualDetails = function(individualdt) {
          var getIndi;
          return (getIndi = function() {
            return dataService.getIndividualReports(individualdt.cluster_id, individualdt.name).success(function(indiDetail) {
              var i, str, _i, _len, _ref;
              if (!isEmpty(indiDetail.report)) {
                $scope.details[individualdt.name] = indiDetail.report.results.actions;
                _ref = indiDetail.report.results.actions;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  i = _ref[_i];
                  str = i + individualdt.name;
                  $scope.modalId[i + individualdt.name] = str.replace(".", "-");
                  $scope.createModalId = function(action, name) {
                    return $scope.modalId[action + name];
                  };
                }
                $scope.reportStates[individualdt.name] = indiDetail.state;
              } else {
                $scope.reportStates[individualdt.name] = indiDetail.state;
                $scope.showDetails = false;
                $timeout(getIndi, 2000);
              }
              if (indiDetail.state === "error") {
                return $scope.errorMessage[individualdt.name] = indiDetail.error_message;
              }
            });
          })();
        };
        getAllReports = function() {
          if (!$scope.isTimeout) {
            return dataService.getHealthReports(id).success(function(data) {
              var reportdt, _i, _len, _ref;
              $scope.$emit('activateReportTag', true);
              if (!isEmpty(data)) {
                if (data.length !== dtLength) {
                  dtLength = data.length;
                  return $timeout(getAllReports, 3000);
                } else {
                  $scope.reports = data;
                  $scope.showData = true;
                  $timeout.cancel($scope.promise);
                  _ref = $scope.reports;
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    reportdt = _ref[_i];
                    $scope.categories[reportdt.category] = reportdt.category;
                  }
                  return getIndividualReports();
                }
              } else {
                $timeout(getAllReports, 2000);
                return $scope.showData = false;
              }
            });
          }
        };
        return getAllReports();
      };

      Cluster.prototype.goToCluster = function(id, status) {
        if (status === "UNINITIALIZED") {
          return this.goToWizardByClusterId(id);
        } else {
          return this.goToClusterById(id);
        }
      };

      Cluster.prototype.goToWizardByClusterId = function(id) {
        return this.$state.go("wizard", {
          "id": id,
          "config": "true"
        });
      };

      Cluster.prototype.goToClusterById = function(id) {
        return this.$state.go("cluster.overview", {
          "id": id
        });
      };

      Cluster.prototype.getAdapters = function($scope) {
        return this.dataService.getAdapters().success(function(data) {
          return $scope.allAdapters = data;
        });
      };

      Cluster.prototype.createCluster = function($scope, postClusterData) {
        var $rootScope, $state, wizardFactory;
        wizardFactory = this.wizardFactory;
        $rootScope = this.$rootScope;
        $state = this.$state;
        return this.dataService.createCluster(postClusterData).success(function(data) {
          var adapter, _i, _len, _ref;
          $scope.clusters.push(data);
          $rootScope.$emit('newClusters', $scope.clusters);
          wizardFactory.setClusterInfo(data);
          _ref = $scope.allAdapters;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            adapter = _ref[_i];
            if (adapter.id === $scope.cluster.adapter_id) {
              wizardFactory.setAdapter(adapter);
            }
          }
          $state.go('wizard', {
            "id": data.id,
            "config": "true"
          });
          return $scope.cluster = {};
        });
      };

      Cluster.prototype.getClusterHosts = function(clusterId) {
        return this.dataService.getClusterHosts(clusterId);
      };

      Cluster.prototype.clusterProgressInit = function($scope, clusterhostsData, $stateParams) {
        var $timeout, dataService, getClusterProgressRepeatly;
        $scope.clusterId = $stateParams.id;
        $scope.fireTimer = true;
        $scope.hosts = clusterhostsData;
        $timeout = this.$timeout;
        dataService = this.dataService;
        getClusterProgressRepeatly = function() {
          return dataService.getClusterProgress($scope.clusterId).success(function(data) {
            $scope.clusterProgress = data;
            if ($scope.fireTimer) {
              return $scope.progressTimer = $timeout(getClusterProgressRepeatly, 5000);
            }
          });
        };
        getClusterProgressRepeatly();
        this.dataService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.progress;
        });
        return $scope.$on('$destroy', function() {
          var fireTimer;
          fireTimer = false;
          return $timeout.cancel($scope.progressTimer);
        });
      };

      Cluster.prototype.displayDataInTable = function($scope, data, tableName) {
        var $filter, temp;
        $filter = this.$filter;
        temp = null;
        if (!tableName) {
          return $scope['tableParams'] = new this.ngTableParams({
            page: 1,
            count: data.length + 1
          }, {
            total: data.length,
            getData: function($defer, params) {
              var orderedData;
              orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
              return $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        } else {
          return $scope[tableName] = new this.ngTableParams({
            page: 1,
            count: data.length + 1
          }, {
            total: data.length,
            getData: function($defer, params) {
              var orderedData;
              orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
              return $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        }
      };

      Cluster.prototype.configurationInit = function($scope, $stateParams, clusterhostsData) {
        var clusterId;
        clusterId = $stateParams.id;
        $scope.partitionarray = [];
        this.dataService.getClusterConfig(clusterId).success(function(data) {
          var key, value, _ref, _results;
          $scope.configuration = data;
          _ref = $scope.configuration.os_config.partition;
          _results = [];
          for (key in _ref) {
            value = _ref[key];
            _results.push($scope.partitionarray.push({
              "name": key,
              "number": value.percentage
            }));
          }
          return _results;
        });
        this.dataService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.roles;
        });
        return $scope.hosts = clusterhostsData;
      };

      return Cluster;

    })();
    return angular.module('compass.services').service('clusterService', [
      'dataService', '$state', 'wizardFactory', '$timeout', 'ngTableParams', '$filter', '$rootScope', function(dataService, $state, wizardFactory, $timeout, ngTableParams, $filter, $rootScope) {
        return new Cluster(dataService, $state, wizardFactory, $timeout, ngTableParams, $filter, $rootScope);
      }
    ]);
  });

}).call(this);
