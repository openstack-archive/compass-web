define(['./baseService'], -> 
    'use strict';
    class User
        constructor: (@dataService) ->
        getUserSetting: ->
            return @dataService.getUserSetting()
        getUserLog: ->
            return @dataService.getUserLog()

    angular.module('compass.services').service('userService',['dataService', (dataService) -> new User(dataService)])
)