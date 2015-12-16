(function() {
  define(['./baseFilter'], function() {
    'use strict';
    return angular.module('compass.filters').filter('FilterByCategory', function() {
      return function(items, categoryName) {
        var filtered, i, item, _i, _len;
        filtered = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          item = i;
          if (item.category === categoryName) {
            filtered.push(item);
          }
        }
        return filtered;
      };
    }).filter('nl2br', [
      '$sce', function($sce) {
        return function(text) {
          return text = text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
        };
      }
    ]);
  });

}).call(this);
