(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('compassDataMatch', function() {
      return {
        require: 'ngModel',
        scope: {
          compassDataMatch: "=",
          response: "=",
          currentData: "="
        },
        link: function(scope, element, attrs, ngModel) {
          scope.$watch(function() {
            return scope.compassDataMatch;
          }, function(newValue, oldValue) {
            if (scope.compassDataMatch === ngModel.$modelValue) {
              scope.response = {
                error: false,
                message: ""
              };
              return ngModel.$setValidity('match', true);
            } else {
              scope.response = {
                error: true,
                message: "Passwords do not match"
              };
              return ngModel.$setValidity('match', false);
            }
          });
          return ngModel.$parsers.unshift(function(value) {
            if (scope.compassDataMatch === value) {
              scope.response = {
                error: false,
                message: ""
              };
              ngModel.$setValidity('match', true);
            } else {
              scope.response = {
                error: true,
                message: "Passwords do not match"
              };
              ngModel.$setValidity('match', false);
            }
            return value;
          });
        }
      };
    });
  });

}).call(this);
