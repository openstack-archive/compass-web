define(['./baseFactory'], () -> 
   'use strict'
   class UserFactory
        constructor: () -> 
            # @username = ""
            # @password = ""
            @isAuthenticated = false

        login: ->
            @isAuthenticated = true

        logout: ->
            @isAuthenticated = false

        getAuthenticationStatus: ->
            return @isAuthenticated

   angular.module('compass.factories').factory('userFactory',[ () -> new UserFactory()])
)