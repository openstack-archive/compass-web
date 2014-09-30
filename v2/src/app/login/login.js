define(['uiRouter'], function() {
    'use strict';
    var login_module = angular.module('compass.login', [
        'ui.router',
        'ui.bootstrap'
    ]);
    login_module.config(function config($stateProvider) {
        console.log("foo")
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'src/app/login/login.tpl.html',
                //authenticate: false
            });
    });

    login_module.controller('loginCtrl', function($scope, authService, $state) {
        $scope.alerts = [];

        $scope.login = function() {
            $scope.alerts = [];
            var credentials = {
                "email": $scope.email,
                "password": $scope.password
            };
            console.log(authService)
            authService.login(credentials).success(function(data) {
                console.log("good");
                authService.isAuthenticated = true;
                $state.transitionTo("clusterList");
            }).error(function(response) {
                console.log("bad");
                console.log(response);
                $scope.alerts.push(response);
            })
        };

        $scope.closeAlert = function() {
            $scope.alerts = [];
        };

    });

    login_module.directive('setFocus', function() {
        return function(scope, element) {
            element[0].focus();
        };
    });

    login_module.directive('ngEnter', function() {
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
    return login_module;

});