(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('appController', [
      '$scope', '$state', 'authService', 'userFactory', function($scope, $state, authService, userFactory) {
        $scope.isAuthenticated = false;
        $scope.$watch(function() {
          return userFactory.isAuthenticated;
        }, function(val) {
          return $scope.isAuthenticated = userFactory.isAuthenticated;
        });
        return $scope.logout = function() {
          return authService.logout().success(function(data) {
            authService.setCookies("isAuthenticated", false, -30);
            userFactory.logout();
            return $state.transitionTo("login");
          });
        };
      }
    ]);
  });

}).call(this);
