define(['./baseController'], ()-> 
    'use strict';

    angular.module('compass.controllers')
        .controller 'loginCtrl', ['$scope', '$state', 'authService', 'userFactory',
            ($scope, $state, authService, userFactory) ->
                $scope.alerts = []
                $scope.login = ->
                    credentials = 
                        "email": $scope.email
                        "password": $scope.password
                        "remember": Boolean($scope.remember)
                    authService.login(credentials).success (data) ->
                        authService.setCookies("isAuthenticated", true,0.0833,Boolean($scope.remember))
                        userFactory.login()
                        $state.transitionTo("clusterList")
                    .error (response) ->
                        $scope.alerts.push(response)
        ]
)