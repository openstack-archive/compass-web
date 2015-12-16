(function() {
  define(['angular', 'app/app'], function(ng) {
    'use strict';
    return ng.element(document).ready(function() {
      return ng.bootstrap(document, ['compass']);
    });
  });

}).call(this);
