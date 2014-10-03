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
    var compassModule = ng.module('app', [
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
    compassModule.constant('settings', {
        apiUrlBase: '/api',
        metadataUrlBase: 'data',
        //monitoringUrlBase: 'http://metrics-api/monit/api/v1'
        monitoringUrlBase: '/monit/api/v1'
    });
    compassModule.config(function($stateProvider, $urlRouterProvider) {
        compassModule.stateProvider = $stateProvider;
        $urlRouterProvider.otherwise('/clusterlist');
    });
    compassModule.config(function($httpProvider){
        $httpProvider.interceptors.push('authenticationInterceptor');
    });
    compassModule.run(function($rootScope, $state, authService, rememberMe) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (authService.isAuthenticated == false) {
                rememberMe.setCookies("isAuthenticated", "false", -365);
            }
            if (toState.authenticate && rememberMe.getCookie('isAuthenticated') != "true") {
                // User isn't authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    });
    compassModule.controller('appController', function($scope, authService, $state) {
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

});