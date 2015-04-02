define ['./baseDirective'], -> 
    'use strict';

    angular.module('compass.directives')
        .directive 'userIndividualValidation', ['userValidationLib', (userValidationLib) ->
            return {
                restrict: 'EAC'
                require: 'ngModel'
                scope:
                    response: "="
                    enable: "@"
                link: (scope, element, attrs, ngModel) ->
                    if  scope.enable == "false"
                        return null
                    if scope.response instanceof Array
                        index = attrs.index
                        scope.response[index] = {}

                    targetFunction = attrs.userIndividualValidation
                    ngModel.$parsers.unshift (value) ->
                        responseMessage = userValidationLib[targetFunction](value)
                        if responseMessage.status is "invalid"
                            if scope.response instanceof Array
                                scope.response = []
                                scope.response[index].error = true
                                scope.response[index].message = responseMessage.message
                            else
                                scope.response = {}
                                scope.response.error = true
                                scope.response.message = responseMessage.message
                            ngModel.$setValidity('userValidation', false)
                        else
                            if scope.response instanceof Array
                                scope.response[index].error = false
                            else
                                scope.response.error = false
                            ngModel.$setValidity('userValidation', true)
                        return value
            }
        ]