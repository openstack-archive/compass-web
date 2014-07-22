angular.module('compass.login', [
    'compass.services',
    'ui.router',
    'ui.bootstrap'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            controller: 'loginCtrl',
            templateUrl: 'src/app/login/login.tpl.html',
            authenticate: false
        });
})

.controller('loginCtrl', function($scope, authService, $state) {
    $scope.login = function() {
        var credentials = {
            "username": $scope.username,
            "password": $scope.password
        };
        authService.login(credentials).success(function(data) {
            authService.isAuthenticated = true;
            $state.transitionTo("clusterList");
        })
    }
})
