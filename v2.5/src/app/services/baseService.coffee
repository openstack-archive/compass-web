define(['angular'
        'angularTable'
        'uiRouter'
   		'uiBootstrap'
], (ng)-> 
    'use strict';

    ng.module('compass.services', ['ngTable','ui.router','ui.bootstrap']).constant('settings',{
            apiUrlBase: '/api'
            metadataUrlBase: 'data'
            monitoringUrlBase: '/monit/api/v1'
        })
);