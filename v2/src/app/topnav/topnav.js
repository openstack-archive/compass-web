angular.module('compass.topnav', [
    'ui.router',
    'ui.bootstrap'
])

.controller('topnavCtrl', function($scope, $http) {
    // get all clusters
    $http.get('data/clusters').success(function(data) {
        $scope.clusters = data;
    });
}).directive('topnav', function() {
    return {
        templateUrl: 'src/app/topnav/topnav.tpl.html'
    };
});

var createClusterCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    console.log(modalInstance.result);
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
      $log.info($scope)
    });
  };
};


var ModalInstanceCtrl = function ($scope, $modalInstance, items, $state) {

  $scope.items = items;
  $scope.selectedd = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selectedd.item);
    $state.go('wizard');
    $scope.result = 'ok';
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    $scope.result = 'cancel';
  };
};