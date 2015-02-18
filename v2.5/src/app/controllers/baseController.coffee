define(['angular'
        'uiRouter'
        'angularTable'
        'uiBootstrap'
        'angularDragDrop'
        'ngSpinner'
        'ngBsDaterangepicker'
], (ng)-> 
    'use strict';

    ng.module('compass.controllers', ['ui.router','ngTable','ui.bootstrap','ngDragDrop', 'angularSpinner', 'ngBootstrap']);
);