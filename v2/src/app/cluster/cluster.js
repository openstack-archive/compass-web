angular.module('compass.cluster', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
])

.config(function config($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('clusterList', {
            url: '/clusterlist',
            templateUrl: 'src/app/cluster/cluster-list.tpl.html'
        })
        .state('cluster', {
            url: '/cluster/{id}',
            templateUrl: 'src/app/cluster/cluster.tpl.html'
        })
        .state('cluster.overview', {
            url: '/overview',
            templateUrl: 'src/app/cluster/cluster-overview.tpl.html'
        })
        .state('cluster.config', {
            url: '/config',
            templateUrl: 'src/app/cluster/cluster-config.tpl.html'
        })
        .state('cluster.config.security', {
            url: '/security',
            templateUrl: 'src/app/cluster/cluster-security.tpl.html'
        })
        .state('cluster.config.network', {
            url: '/network',
            templateUrl: 'src/app/cluster/cluster-network.tpl.html'
        })
        .state('cluster.config.partition', {
            url: '/partition',
            templateUrl: 'src/app/cluster/cluster-partition.tpl.html'
        })
        .state('cluster.config.roles', {
            url: '/roles',
            templateUrl: 'src/app/cluster/cluster-roles.tpl.html'
        })
        .state('cluster.log', {
            url: '/log',
            templateUrl: 'src/app/cluster/cluster-log.tpl.html'
        })
        .state('cluster.monitoring', {
            url: '/monitoring'
            //templateUrl: 'src/app/cluster/cluster-monitoring.tpl.html'
        })
        .state('cluster.monitoring.hostgroups', {
            url: '/hostgroups',
            templateUrl: 'src/app/cluster/cluster-monitoring.tpl.html'
        })
        .state('cluster.monitoring.servicegroups', {
            url: '/servicegroups',
            templateUrl: 'src/app/cluster/cluster-monitoring.tpl.html'
        });
})

.controller('clusternavCtrl', function($scope, $http, $state) {
    $scope.state = $state;
}).directive('clusternav', function() {
    return {
        templateUrl: 'src/app/cluster/cluster-nav.tpl.html'
    };
});
