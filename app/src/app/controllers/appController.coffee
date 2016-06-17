define(['./baseController'], ()-> 
    'use strict';

    angular.module('compass.controllers')
        .controller 'appController', ['$scope', '$state', 'authService', 'userFactory',
            ($scope, $state, authService, userFactory) ->
                
                $scope.isAuthenticated = false

                $scope.$watch( ->
                    return userFactory.isAuthenticated
                ,(val) ->
                    $scope.isAuthenticated = userFactory.isAuthenticated
                )

                $scope.logout = ->
                    authService.logout().success (data) ->
                        authService.setCookies("isAuthenticated", false, -30)
                        userFactory.logout()
                        $state.transitionTo("login")

                # $scope.$on "newClusters", (event, data) ->
                #     $scope.$broadcast('newClusters', data)
                
        ]
);