(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('clusternav', [
      '$timeout', function($timeout) {
        return {
          restrict: 'EAC',
          templateUrl: "src/app/partials/cluster-nav.tpl.html",
          controller: 'navCtrl'
        };
      }
    ]);
  });

}).call(this);
