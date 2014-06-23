angular.module('compass.clusterlist', [
    'ui.router',
    'ui.bootstrap'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('clusterList', {
            url: '/clusterlist',
            templateUrl: 'src/app/cluster/cluster-list.tpl.html'
        });
})