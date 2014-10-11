define(['uiRouter'], function() {
    'use strict';
    var loginModule = angular.module('compass.login', [
        'ui.router',
        'ui.bootstrap'
    ]);
    loginModule.config(function config($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'src/app/login/login.tpl.html',
                authenticate: false
            });
    });

    loginModule.controller('loginCtrl', function($scope, authService, $state, rememberMe) {
        $scope.alerts = [];

        $scope.login = function() {
            $scope.alerts = [];
            var credentials = {
                "email": $scope.email,
                "password": $scope.password,
                "remember": Boolean($scope.remember)
            };
            authService.login(credentials).success(function(data) {
                authService.setLogin($scope.remember);
                $state.transitionTo("clusterList");
            }).error(function(response) {
                console.log(response);
                $scope.alerts.push(response);
            })
        };

        $scope.closeAlert = function() {
            $scope.alerts = [];
        };

    });

    loginModule.directive('setFocus', function() {
        return function(scope, element) {
            element[0].focus();
        };
    });

    loginModule.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) { // 13 is enter key

                    if (scope.email.trim() != "" && scope.password.trim() != "") {
                        scope.$eval(attrs.ngEnter);
                    }

                    event.preventDefault();
                }
            });
        };
    });
});