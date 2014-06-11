angular.module('compass.server', [
    'ui.router',
    'ui.bootstrap'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('serverList', {
            url: '/serverlist',
            templateUrl: 'src/app/server/server-list.tpl.html'
        });
})