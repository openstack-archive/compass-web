var compassApp = angular.module('compassApp', [
  'ngRoute',
  'compassControllers'
]);

compassApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/clusters.html',
        controller: 'showClustersCtrl'
    }).
      when('/servers', {
        templateUrl: 'templates/servers.html',
        controller: 'showServersCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);
