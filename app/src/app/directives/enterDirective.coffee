define ['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'ngEnter', ->
      	return (scope, element, attrs) ->
          element.bind "keydown keypress", (event) ->
            if event.which is 13
              scope.$eval(attrs.ngEnter) if scope.email.trim() != "" and scope.password.trim() != ""
              event.preventDefault()
