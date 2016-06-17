(function() {
  define(['angular', 'angularTable', 'uiRouter', 'uiBootstrap'], function(ng) {
    'use strict';
    return ng.module('compass.services', ['ngTable', 'ui.router', 'ui.bootstrap']).constant('settings', {
      apiUrlBase: '/api',
      metadataUrlBase: 'data',
      monitoringUrlBase: '/monit/api/v1'
    });
  });

}).call(this);
