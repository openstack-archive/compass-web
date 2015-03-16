define(['./baseController'], ()-> 
  'use strict';

  angular.module('compass.controllers')
    .controller 'clustersListCtrl', ['$scope', 'clusterService', '$state', '$filter', 'ngTableParams', '$modal', 'allClusterData',
        ($scope, clusterService, $state, $filter, ngTableParams, $modal, allClusterData) ->
            $scope.state = $state
            clusterService.getClustersProgress(allClusterData)
            $scope.clusters = allClusterData
            data = $scope.clusters

            $scope.tableParams = new ngTableParams({
                page: 1
                count: 10
                },
                {
                    total: data.length
                    getData: ($defer, params) -> 
                        orderedData = if params.sorting() then $filter('orderBy')(data, params.orderBy()) else data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            )

            $scope.goToCluster = (id, state) -> clusterService.goToCluster(id, state)
    ]

    .controller 'createClusterCtrl', ['$scope','clusterService','$modal', 
        ($scope, clusterService, $modal)->
            clusterService.getAdapters($scope)

            $scope.open = () ->
                $scope.cluster = {}

                modalInstance = $modal.open(
                    templateUrl: 'src/app/partials/modalClusterCreate.tpl.html'
                    controller: 'newClusterModalCtrl'
                    resolve:
                        allAdapters: ->
                            return $scope.allAdapters
                        cluster: ->
                            return $scope.cluster
                )

                modalInstance.result.then( (cluster)->
                    $scope.cluster = cluster
                    postClusterData = 
                        "name": cluster.name
                        "adapter_id": cluster.adapter.id
                        "os_id": cluster.os.id
                    postClusterData.flavor_id = cluster.flavor.id if cluster.flavor
                    clusterService.createCluster($scope, postClusterData)
                ->
                    console.log("dismiss")
                )           
    ]
    .controller 'newClusterModalCtrl', ['$scope', '$log','$modalInstance','allAdapters','cluster',
        ($scope, $log, $modalInstance, allAdapters, cluster)->
            $scope.allAdapters = allAdapters
            $scope.cluster = cluster

            $scope.updateSelectedAdapter = ->
                for adapter in $scope.allAdapters
                    if adapter.id == $scope.cluster.adapter.id
                        $scope.supported_oses = adapter.supported_oses
                        $scope.flavors = adapter.flavors

            $scope.cancel = ->
                $modalInstance.dismiss('cancel')

            $scope.ok = ->
                $scope.result = 'ok'
                $modalInstance.close($scope.cluster)     
    ]
    .controller 'clusterProgressCtrl', ['$scope','clusterService', '$stateParams', 'clusterhostsData',
        ($scope, clusterService, $stateParams, clusterhostsData) ->
            clusterService.clusterProgressInit($scope, clusterhostsData, $stateParams)
            clusterService.displayDataInTable($scope, $scope.hosts)

            $scope.clusterId = $stateParams.id

            request =
            "check_health": null

            $scope.startChecking = ->
                clusterService.startHealthCheck($scope.clusterId, request, $scope)

            $scope.selectAllServers = (flag) ->
                if flag
                    sv.selected = true for sv in $scope.hosts
                else
                    sv.selected = false for sv in $scope.hosts
    ]
    .controller 'configurationCtrl', ['$scope','clusterService','$modal', '$stateParams', 'clusterhostsData', 
        ($scope, clusterService, $modal, $stateParams, clusterhostsData) ->
            clusterService.configurationInit($scope, $stateParams, clusterhostsData)
            clusterService.displayDataInTable($scope, $scope.hosts)
            # clusterService.getClusterConfig(clusterId).success (data) ->
            #     console.log(data)
    ]
    .controller 'clusterReportCtrl', ['$scope', '$state', 'clusterService', '$stateParams', '$timeout', '$modal',
        ($scope, $state, clusterService, $stateParams, $timeout, $modal) ->
            clusterService.getReports($scope, $stateParams.id)
            $scope.openModal = (key, reportname) ->
                # console.log(key)
                # console.log(reportname)
                # console.log($scope.details[reportname][key])
                modalInstance = $modal.open(
                    templateUrl: 'src/app/partials/ErrorInfo.html'
                    controller: 'reportErrorCtrl'
                    resolve:
                        detail: ->
                            return $scope.details[reportname][key]
                )
    ]
    .controller 'navCtrl', ['$scope', 'clusterService', '$stateParams'
    ($scope, clusterService, $stateParams)->
        clusterService.getHealthReportsCheck($scope, $stateParams.id)
    ]
    # .filter 'FilterByCategory', ->
    #     return (items, categoryName) ->
    #         filtered = []
    #         for i in items
    #             item = i
    #             if item.category == categoryName
    #                 filtered.push(item)
    #         return filtered
    # .filter 'nl2br', ['$sce', ($sce)->
    #         return (text)->
    #             return text = if text then $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) else ''
    # ]
)