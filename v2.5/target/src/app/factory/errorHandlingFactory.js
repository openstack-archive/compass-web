(function() {
  define(['./baseFactory'], function($q, $location, $injector) {
    'use strict';
    return angular.module('compass.factories').factory('errorhandlingInterceptor', [
      '$q', '$location', '$injector', function($q, $location, $injector) {
        return {
          response: function(response) {
            return response;
          },
          responseError: function(rejection) {
            var $modal, wizardService;
            if (rejection.status === 401) {
              console.log("Response Error 401", rejection);
              $location.path('/login');
            } else {
              if (rejection.config.url && rejection.config.url !== "/api/users/login") {
                wizardService = $injector.get('wizardService');
                $modal = $injector.get('$modal');
                wizardService.showErrorMessage($modal, "ERROR " + rejection.status, rejection.data);
              }
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  });

}).call(this);
