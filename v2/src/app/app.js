var app = angular.module('compass', [
    'compass.login',
    'compass.services',
    'compass.topnav',
    'compass.wizard',
    'compass.cluster',
    'compass.clusterlist',
    'compass.monitoring',
    'compass.server',
    'compass.userSetting',
    'compass.userProfile',
    'ui.router',
    'ui.bootstrap',
 //   'compassAppDev',
    'ngAnimate'
]);

app.constant('settings', {
    apiUrlBase: '/api',
    metadataUrlBase: 'data',
    monitoringUrlBase: 'http://metrics-api/monit/api/v1'
});

app.config(function($stateProvider, $urlRouterProvider) {
    app.stateProvider = $stateProvider;
    $urlRouterProvider.otherwise('/clusterlist');
});


app.config(function($httpProvider) {
    $httpProvider.interceptors.push('authenticationInterceptor');
});

app.run(function($rootScope, $state, authService, rememberMe) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (authService.isAuthenticated == false) {
            rememberMe.setCookies("isAuthenticated", "false", -365);
        }
        if (toState.authenticate && rememberMe.getCookie('isAuthenticated') != "true") {
            // User isn't authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
});

app.controller('appController', function($scope, authService, $state) {
    $scope.currentUser = null;
    $scope.isAuthenticated = authService.isAuthenticated;
    $scope.state = $state;

    $scope.$watch(function() {
        return authService.isAuthenticated
    }, function(val) {
        $scope.isAuthenticated = authService.isAuthenticated;
    })

    $scope.logout = function() {
        authService.isAuthenticated = false;
        $state.transitionTo("login");
    }
});
