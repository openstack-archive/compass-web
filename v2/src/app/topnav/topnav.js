angular.module('compass.topnav', [
    'ui.router',
    'ui.bootstrap'
])

.controller('topnavCtrl', function($scope, $http, dataService) {
    // get all clusters
    dataService.getClusters().success(function(data) {
        console.log("====", data);
        $scope.clusters = data;
    });
}).directive('topnav', function() {
    return {
        templateUrl: 'src/app/topnav/topnav.tpl.html'
    };
});