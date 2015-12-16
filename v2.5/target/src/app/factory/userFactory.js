(function() {
  define(['./baseFactory'], function() {
    'use strict';
    var UserFactory;
    UserFactory = (function() {
      function UserFactory() {
        this.isAuthenticated = false;
      }

      UserFactory.prototype.login = function() {
        return this.isAuthenticated = true;
      };

      UserFactory.prototype.logout = function() {
        return this.isAuthenticated = false;
      };

      UserFactory.prototype.getAuthenticationStatus = function() {
        return this.isAuthenticated;
      };

      return UserFactory;

    })();
    return angular.module('compass.factories').factory('userFactory', [
      function() {
        return new UserFactory();
      }
    ]);
  });

}).call(this);
