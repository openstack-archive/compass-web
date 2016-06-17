(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('ngEnter', function() {
      return function(scope, element, attrs) {
        return element.bind("keydown keypress", function(event) {
          if (event.which === 13) {
            if (scope.email.trim() !== "" && scope.password.trim() !== "") {
              scope.$eval(attrs.ngEnter);
            }
            return event.preventDefault();
          }
        });
      };
    });
  });

}).call(this);
