define([
    'angular',
    'login',
    'services',
    // 'appDev',
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
        $rootScope.Object = Object;  //Object can be used in anywhere. e.g. : Object.key({}).length == 0
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !authService.isAuthenticated) {
                if (rememberMe.getCookie("isAuthenticated")) {
                    authService.isAuthenticated = true
                }
                else {
                    // User isn't authenticated
                    $state.transitionTo("login");
                    event.preventDefault();
                }
            }
        });
    });
    compassModule.controller('appController', function($scope, authService, $state, rememberMe) {
        $scope.currentUser = null;
        $scope.isAuthenticated = authService.isAuthenticated;
        $scope.state = $state;

        $scope.$watch(function() {
            return authService.isAuthenticated
        }, function(val) {
            $scope.isAuthenticated = authService.isAuthenticated;
        })

        $scope.logout = function() {
            authService.logout().success(function(data) {
                authService.setLogout();
                $state.transitionTo("login");
            }).error(function(response) {
                console.log(response);
                $scope.alerts.push(response);
            })
        }
    });
    compassModule.controller('errorHandlingModalController',function($scope,$modalInstance,message){
        $scope.warning = message.data;
        $scope.status = message.status;

        $scope.ok =function(){
            $modalInstance.close();
        }
    });

});