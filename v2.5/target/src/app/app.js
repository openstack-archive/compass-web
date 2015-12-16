(function() {
  define(['angular', 'uiRouter', 'angularTable', 'uiBootstrap', 'angularDragDrop', 'app/controllers/all', 'app/services/all', 'app/factory/all', 'app/directives/all', 'app/filters/all'], function(ng) {
    'use strict';
    return ng.module("compass", ['ui.router', 'ngTable', 'ui.bootstrap', 'ngDragDrop', 'compass.controllers', 'compass.services', 'compass.factories', 'compass.directives', 'compass.filters']).config([
      '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider.state('login', {
          url: '/login',
          controller: 'loginCtrl',
          templateUrl: 'src/app/partials/login.tpl.html',
          requireAuthenticated: false
        }).state('clusterList', {
          url: '/clusterList',
          controller: 'clustersListCtrl',
          templateUrl: 'src/app/partials/cluster-all.tpl.html',
          requireAuthenticated: true,
          resolve: {
            allClusterData: [
              '$q', 'clusterService', function($q, clusterService) {
                var deferred;
                deferred = $q.defer();
                clusterService.getClusters().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ]
          }
        }).state('wizard', {
          url: '/wizard/{id}?config',
          controller: 'wizardCtrl',
          templateUrl: 'src/app/partials/wizard.tpl.html',
          requireAuthenticated: true,
          resolve: {
            clusterData: [
              '$stateParams', '$q', 'wizardService', function($stateParams, $q, wizardService) {
                var clusterId, deferred;
                clusterId = $stateParams.id;
                deferred = $q.defer();
                wizardService.getClusterById(clusterId).success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ],
            machinesHostsData: [
              '$q', 'wizardService', function($q, wizardService) {
                var deferred;
                deferred = $q.defer();
                wizardService.getAllMachineHosts().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ],
            wizardStepsData: [
              '$q', 'wizardService', function($q, wizardService) {
                var deferred;
                deferred = $q.defer();
                wizardService.getWizardSteps().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ],
            clusterConfigData: [
              '$stateParams', '$q', 'wizardService', function($stateParams, $q, wizardService) {
                var clusterId, deferred;
                clusterId = $stateParams.id;
                deferred = $q.defer();
                wizardService.getClusterConfig(clusterId).success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ],
            adaptersData: [
              '$q', 'wizardService', function($q, wizardService) {
                var deferred;
                deferred = $q.defer();
                wizardService.getAdapters().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ]
          }
        }).state('cluster', {
          url: '/cluster/{id}',
          templateUrl: 'src/app/partials/cluster.tpl.html',
          requireAuthenticated: true,
          resolve: {
            clusterhostsData: [
              '$stateParams', '$q', 'clusterService', function($stateParams, $q, clusterService) {
                var clusterId, deferred;
                clusterId = $stateParams.id;
                deferred = $q.defer();
                clusterService.getClusterHosts(clusterId).success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ]
          }
        }).state('cluster.overview', {
          url: '/overview',
          controller: 'clusterProgressCtrl',
          templateUrl: 'src/app/partials/cluster-overview.tpl.html',
          requireAuthenticated: true
        }).state('cluster.config', {
          url: '/config',
          controller: 'configurationCtrl',
          templateUrl: 'src/app/partials/cluster-config.tpl.html',
          requireAuthenticated: true
        }).state('cluster.config.security', {
          url: '/security',
          templateUrl: 'src/app/partials/cluster-security.tpl.html',
          requireAuthenticated: true
        }).state('cluster.config.network', {
          url: '/network',
          templateUrl: 'src/app/partials/cluster-network.tpl.html',
          requireAuthenticated: true
        }).state('cluster.config.partition', {
          url: '/partition',
          templateUrl: 'src/app/partials/cluster-partition.tpl.html',
          requireAuthenticated: true
        }).state('cluster.config.roles', {
          url: '/roles',
          templateUrl: 'src/app/partials/cluster-roles.tpl.html',
          requireAuthenticated: true
        }).state('cluster.report', {
          url: '/report',
          controller: "clusterReportCtrl",
          templateUrl: 'src/app/partials/cluster-report.tpl.html',
          requireAuthenticated: true
        }).state('serverList', {
          url: '/serverlist',
          controller: 'serverCtrl',
          templateUrl: 'src/app/partials/server-list.tpl.html',
          requireAuthenticated: true,
          resolve: {
            machinesHostsData: [
              '$q', 'dataService', function($q, dataService) {
                var deferred;
                deferred = $q.defer();
                dataService.getAllMachineHosts().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ]
          }
        }).state('userSetting', {
          url: '/userSetting',
          controller: 'userSettingCtrl',
          templateUrl: 'src/app/partials/user-setting.html',
          requireAuthenticated: true,
          resolve: {
            userSettingData: [
              '$q', 'userService', function($q, userService) {
                var deferred;
                deferred = $q.defer();
                userService.getUserSetting().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ],
            userLogData: [
              '$q', 'userService', function($q, userService) {
                var deferred;
                deferred = $q.defer();
                userService.getUserLog().success(function(data) {
                  return deferred.resolve(data);
                });
                return deferred.promise;
              }
            ]
          }
        });
        $urlRouterProvider.otherwise('/clusterList');
        return $httpProvider.interceptors.push('errorhandlingInterceptor');
      }
    ]).run([
      '$rootScope', '$state', 'userFactory', 'authService', function($rootScope, $state, userFactory, authService) {
        return $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
          if (toState.requireAuthenticated && !userFactory.getAuthenticationStatus()) {
            if (authService.getCookie("isAuthenticated")) {
              return userFactory.login();
            } else {
              $state.transitionTo("login");
              return event.preventDefault();
            }
          }
        });
      }
    ]);
  });

}).call(this);
