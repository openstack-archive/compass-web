(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('loginCtrl', [
      '$scope', '$state', 'authService', 'userFactory', function($scope, $state, authService, userFactory) {
        $scope.alerts = [];
        return $scope.login = function() {
          var credentials;
          credentials = {
            "email": $scope.email,
            "password": $scope.password,
            "remember": Boolean($scope.remember)
          };
          return authService.login(credentials).success(function(data) {
            authService.setCookies("isAuthenticated", true, 0.0833, Boolean($scope.remember));
            userFactory.login();
            return $state.transitionTo("clusterList");
          }).error(function(response) {
            return $scope.alerts.push(response);
          });
        };
      }
    ]);
  });

}).call(this);
