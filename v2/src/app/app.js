var app = angular.module('compass', [
    'compass.services',
    'compass.topnav',
    'compass.wizard',
    'compass.cluster',
    'compass.clusterlist',
    'compass.server',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'compassAppDev'
]);

app.constant('settings', {
    apiUrlBase: '/api/v2.0',
    metadataUrlBase: 'data',
    monitoringUrlBase: ''
});

app.config(function($stateProvider, $urlRouterProvider) {
    app.stateProvider = $stateProvider;
    $urlRouterProvider.otherwise('/clusterlist');
});
