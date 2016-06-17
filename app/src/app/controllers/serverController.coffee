define(['./baseController'], ()-> 
  'use strict';

  angular.module('compass.controllers')
    .controller 'serverCtrl', [ '$scope', 'dataService', '$filter', 'machinesHostsData', 'wizardService', 
      ($scope, dataService, $filter, machinesHostsData, wizardService) ->
        $scope.hideunselected = ''
        $scope.search = {}
        $scope.allservers = machinesHostsData
        wizardService.getServerColumns().success (data) ->
            $scope.server_columns = data.machines_hosts

        wizardService.displayDataInTable($scope, $scope.allservers)
        
        wizardService.watchingTriggeredStep($scope)

        $scope.hideUnselected = ->
            if $scope.hideunselected then $scope.search.selected = true else delete $scope.search.selected

        $scope.ifPreSelect = (server) ->
            server.disable = false
            if server.clusters 
                server.disabled = true if server.clusters.length > 0
                for svCluster in server.clusters
                    if svCluster.id == $scope.cluster.id
                        server.selected = true
                        server.disabled = false
        wizardService.watchAndAddNewServers($scope)
    ]
)