var compassControllers = angular.module('compassControllers', []);

compassControllers.controller('topnavCtrl', function($scope, $http) {
  $http.get('data/clusters.json').success(function(data) {
    $scope.clusters = data;
  });
})
  .directive('topnav', function() {
    return {
      templateUrl: 'templates/topnav.html'
    };
  });

compassControllers.controller('showClustersCtrl', function($scope) {
  $scope.message = 'This is cluster list';
});


compassControllers.controller('showServersCtrl', function($scope) {
  $scope.message = 'This is server list';
});