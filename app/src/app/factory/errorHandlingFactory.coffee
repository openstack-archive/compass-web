define(['./baseFactory'], ($q, $location, $injector) -> 
   'use strict'
   angular.module('compass.factories').factory('errorhandlingInterceptor',[ '$q', '$location','$injector', ($q, $location, $injector) -> 
    return {
            response: (response) ->
              return response
            responseError: (rejection) ->
              if rejection.status is 401
                console.log("Response Error 401", rejection)
                $location.path('/login')
              else
                if rejection.config.url and rejection.config.url != "/api/users/login"
                   wizardService = $injector.get('wizardService')
                   $modal = $injector.get('$modal')
                   wizardService.showErrorMessage($modal, "ERROR " + rejection.status, rejection.data)
              return $q.reject(rejection)
          }
   ])
)