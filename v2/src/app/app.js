define([
    'angular',
    'login',
    'services',
    'appDev',
    'clusterList',
    'cluster',
    'monitoring',
    'wizard',
    'topnav',
    'server',
    'userProfile',
    'charts',
    'userSetting',
    'findservers'
], function(ng) {
    'use strict';
    var compass_module = ng.module('app', [
        'compass.login',
        'compass.services',
        // 'compassAppDev',
        'compass.clusterlist',
        'compass.cluster',
        'compass.wizard',
        'compass.topnav',
        'compass.server',
        'compass.userProfile',
        'compass.userSetting',
        'compass.monitoring',
        'compass.charts',
        'compass.findservers'
    ]);
    compass_module.constant('settings', {
        apiUrlBase: '/api',
        metadataUrlBase: 'data',
        //monitoringUrlBase: 'http://metrics-api/monit/api/v1'
        monitoringUrlBase: '/monit/api/v1'
    });
    compass_module.config(function($stateProvider, $urlRouterProvider) {
        compass_module.stateProvider = $stateProvider;
        $urlRouterProvider.otherwise('/login');
    });
    compass_module.run(function($rootScope, $state, authService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !authService.isAuthenticated) {
                // User isn't authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    });
    compass_module.controller('appController', function($scope, authService, $state) {
        $scope.currentUser = null;
        $scope.isAuthenticated = authService.isAuthenticated;
        $scope.state = $state;

        $scope.$watch(function() {
            return authService.isAuthenticated
        }, function(val) {
            $scope.isAuthenticated = authService.isAuthenticated;
        })

        $scope.logout = function() {
            authService.isAuthenticated = false;
            $state.transitionTo("login");
        }
    });
    return compass_module;

});