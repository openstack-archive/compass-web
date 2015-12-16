(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('ngKeypress', [
      function() {
        return function(scope, element, attrs) {
          return element.bind("keydown keypress", function(event) {
            var current, next, result;
            if (event.which === 9) {
              current = attrs.position;
              result = current.split('_');
              next = result[0] + "_" + (parseInt(result[1]) + 1);
              if ($("input[data-position=" + next + "]").length) {
                $("input[data-position=" + next + "]").focus();
              } else {
                $(".btn-next").focus();
              }
              return event.preventDefault();
            }
          });
        };
      }
    ]);
  });

}).call(this);
