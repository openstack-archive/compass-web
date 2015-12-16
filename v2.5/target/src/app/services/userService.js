(function() {
  define(['./baseService'], function() {
    'use strict';
    var User;
    User = (function() {
      function User(dataService) {
        this.dataService = dataService;
      }

      User.prototype.getUserSetting = function() {
        return this.dataService.getUserSetting();
      };

      User.prototype.getUserLog = function() {
        return this.dataService.getUserLog();
      };

      return User;

    })();
    return angular.module('compass.services').service('userService', [
      'dataService', function(dataService) {
        return new User(dataService);
      }
    ]);
  });

}).call(this);
