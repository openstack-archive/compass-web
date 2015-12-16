(function() {
  define(['./baseService'], function() {
    'use strict';
    var Auth;
    Auth = (function() {
      function Auth(dataService) {
        this.dataService = dataService;
      }

      Auth.prototype.setCookies = function(key, value, exdays, remember) {
        var d, expires;
        if (remember) {
          d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          expires = "expires=" + d.toUTCString();
          return document.cookie = key + "=" + value + "; " + expires;
        } else {
          return document.cookie = key + "=" + value;
        }
      };

      Auth.prototype.getCookie = function(key) {
        var ca, name, temp, _i, _len;
        name = key + "=";
        ca = document.cookie.split(';');
        for (_i = 0, _len = ca.length; _i < _len; _i++) {
          temp = ca[_i];
          while (temp.charAt(0) === ' ') {
            temp = temp.substring(1);
          }
          if (temp.indexOf(name) !== -1) {
            return temp.substring(name.length, temp.length) === 'true';
          }
        }
        return "";
      };

      Auth.prototype.login = function(credentials) {
        return this.dataService.login(credentials);
      };

      Auth.prototype.logout = function() {
        return this.dataService.logout();
      };

      return Auth;

    })();
    return angular.module('compass.services').service('authService', [
      'dataService', function(dataService) {
        return new Auth(dataService);
      }
    ]);
  });

}).call(this);
