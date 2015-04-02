define ['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'compassDataMatch', () ->
        return {
            require: 'ngModel'
            scope:
               compassDataMatch: "="
               response: "="
               currentData: "="
            link: (scope, element, attrs, ngModel) ->
                scope.$watch(()->
                    return scope.compassDataMatch
                ,(newValue, oldValue) ->
                    if scope.compassDataMatch is ngModel.$modelValue
                        scope.response =
                            error: false
                            message: ""
                        ngModel.$setValidity('match', true)
                    else
                        scope.response =
                            error: true
                            message: "Passwords do not match"
                        ngModel.$setValidity('match', false)
                )

                ngModel.$parsers.unshift (value) ->
                    if scope.compassDataMatch is value
                        scope.response =
                            error: false
                            message: ""
                        ngModel.$setValidity('match', true)
                    else
                        scope.response =
                            error: true
                            message: "Passwords do not match"
                        ngModel.$setValidity('match', false)
                    return value
        }
