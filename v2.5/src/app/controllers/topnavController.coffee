define(['./baseController'], ()-> 
  'use strict';

  angular.module('compass.controllers')
    .controller 'topnavCtrl', [ '$scope', '$state', '$http', 'dataService', '$rootScope', 'wizardFactory'
      ($scope, $state, $http, dataService, $rootScope, wizardFactory) ->
        dataService.getClusters().success (data) ->
            $scope.clusters = data

        $rootScope.$on 'newClusters', (event, data) ->
          $scope.clusters = data

        $scope.gotoCluster = (id) ->
          dataService.getClusterProgress(id).success (data) ->
            if data.state == "UNINITIALIZED" then $state.go("wizard",{"id":id, "config": "true"}) else $state.go("cluster.overview",{"id": id})
    ]
)