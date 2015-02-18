define ['./baseService'], -> 
    'use strict'
    class Cluster
        constructor: (@dataService, @$state, @wizardFactory, @$timeout, @ngTableParams, @$filter, @$rootScope) ->

        getClusters: ->
            @dataService.getClusters().success((data) ->
            ).error((response) -> 
                console.log(response)
            )
        getClustersProgress: (clusters) ->
            @getProgressByCluster(cluster) for cluster in clusters

        getProgressByCluster: (cluster) ->
            @dataService.getClusterProgress(cluster.id).success (data) ->
                    cluster.progress = data.status
                    cluster.state = data.state

        goToCluster: (id, status)->
            if status=="UNINITIALIZED" then @goToWizardByClusterId(id) else @goToClusterById(id)

        goToWizardByClusterId: (id) ->
            @$state.go "wizard", {
                "id": id
                "config": "true"
            }

        goToClusterById: (id) ->
            @$state.go("cluster.overview", {
                "id": id
            })

        getAdapters: ($scope) ->
            @dataService.getAdapters().success (data) ->
                $scope.allAdapters = data

        createCluster: ($scope, postClusterData) ->
            wizardFactory = @wizardFactory
            $rootScope = @$rootScope
            $state = @$state
            @dataService.createCluster(postClusterData).success (data) ->
                $scope.clusters.push(data)
                $rootScope.$emit('newClusters', $scope.clusters)
                wizardFactory.setClusterInfo(data)
                wizardFactory.setAdapter(adapter) for adapter in $scope.allAdapters when adapter.id == $scope.cluster.adapter_id
                $state.go('wizard',
                    "id": data.id
                    "config": "true"
                )
                $scope.cluster = {}

        getClusterHosts: (clusterId) ->
            return @dataService.getClusterHosts(clusterId)

        clusterProgressInit: ($scope, clusterhostsData, $stateParams) ->
            $scope.clusterId = $stateParams.id
            $scope.fireTimer = true
            $scope.hosts = clusterhostsData
            $timeout =  @$timeout
            dataService = @dataService

            getClusterProgressRepeatly = ->
                dataService.getClusterProgress($scope.clusterId).success (data) ->
                    $scope.clusterProgress = data
                    $scope.progressTimer = $timeout(getClusterProgressRepeatly, 5000) if $scope.fireTimer

            getClusterProgressRepeatly()
            
            @dataService.getServerColumns().success (data) ->
                $scope.server_columns = data.progress

            $scope.$on '$destroy', ->
                fireTimer = false
                $timeout.cancel($scope.progressTimer)

        displayDataInTable: ($scope, data, tableName) ->
            $filter = @$filter
            temp = null
            if !tableName
                $scope['tableParams'] = new @ngTableParams({
                    page: 1
                    count: data.length + 1
                    },
                    {
                        total: data.length
                        getData: ($defer, params) -> 
                            orderedData = if params.sorting() then $filter('orderBy')(data, params.orderBy()) else data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                )
            else
                $scope[tableName] = new @ngTableParams({
                    page: 1
                    count: data.length + 1
                    },
                    {
                        total: data.length
                        getData: ($defer, params) -> 
                            orderedData = if params.sorting() then $filter('orderBy')(data, params.orderBy()) else data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                )


        configurationInit: ($scope, $stateParams, clusterhostsData) ->
            clusterId = $stateParams.id
            $scope.partitionarray = []
            @dataService.getClusterConfig(clusterId).success (data) ->
                $scope.configuration = data
                for key, value of $scope.configuration.os_config.partition
                    $scope.partitionarray.push(
                        "name": key
                        "number": value.percentage
                    )
            @dataService.getServerColumns().success (data) ->
                $scope.server_columns = data.roles
            $scope.hosts = clusterhostsData





        # logout: ->
        #     console.log("logout")

    angular.module('compass.services').service 'clusterService',
    [ 'dataService'
      '$state'
      'wizardFactory'
      '$timeout'
      'ngTableParams'
      '$filter'
      '$rootScope'
      (dataService, $state, wizardFactory, $timeout, ngTableParams, $filter, $rootScope) -> new Cluster(dataService,$state,wizardFactory, $timeout, ngTableParams, $filter, $rootScope)
    ]