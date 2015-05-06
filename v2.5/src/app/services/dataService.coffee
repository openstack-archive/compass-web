define(['./baseService'], () -> 
    'use strict';
    class DS
        constructor: (@$http, @settings) -> 
        login: (user) ->
            return @$http.post(@settings.apiUrlBase + '/users/login', angular.toJson(user))

        logout: ->
            return @$http.post(@settings.apiUrlBase + '/users/logout', null)

        getClusters: ->
            return @$http.get(@settings.apiUrlBase + '/clusters')

        getClusterProgress: (id)->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id + '/state')

        getClusterById: (id) -> 
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id)

        getAllMachineHosts: (os) ->
            if os then return $http.get(@settings.apiUrlBase + '/switches-machines-hosts?os_id=' + os) else return @$http.get(@settings.apiUrlBase + '/switches-machines-hosts')

        getWizardSteps: -> 
            return @$http.get(@settings.metadataUrlBase + '/wizard_steps.json')

        getClusterConfig: (id) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id + '/config')

        getAdapters: ->
            return @$http.get(@settings.apiUrlBase + '/adapters')

        getWizardPreConfig: -> 
            return @$http.get(@settings.metadataUrlBase + '/config.json')

        getServerColumns: ->
            return @$http.get(@settings.metadataUrlBase + '/machine_host_columns.json')

        getSwitches: ->
            return @$http.get(@settings.apiUrlBase + '/switches')

        postSwitches: (sw) ->
            return @$http.post(@settings.apiUrlBase + '/switches', angular.toJson(sw))

        getTimezones: ->
            return @$http.get(@settings.metadataUrlBase + '/timezone.json')

        getSubnetConfig: ->
            return @$http.get(@settings.apiUrlBase + '/subnets')

        getClusterHosts: (clusterId) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + clusterId + '/hosts')

        postClusterActions: (id, actions) ->
            return @$http.post(@settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(actions))

        updateClusterConfig: (id, config) ->
            return @$http.put(@settings.apiUrlBase + '/clusters/' + id + '/config', angular.toJson(config))

        putHost: (id, config) ->
            return @$http.put(@settings.apiUrlBase + '/hosts/' + id, angular.toJson(config))

        postHostNetwork: (id, network) ->
            return @$http.post(@settings.apiUrlBase + '/hosts/' + id + '/networks', angular.toJson(network))

        putHostNetwork: (id, networkId, network) ->
            return @$http.put(@settings.apiUrlBase + '/hosts/' + id + '/networks/' + networkId, angular.toJson(network))

        updateClusterHost: (clusterId, hostId, data) ->
            return @$http.put(@settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId, angular.toJson(data))

        createCluster: (cluster) ->
            return @$http.post(@settings.apiUrlBase + '/clusters', angular.toJson(cluster))

        deleteSubnet: (id) ->
            return @$http.delete(@settings.apiUrlBase + '/subnets/' + id)

        postSubnetConfig: (subnet_config) ->
            return @$http.post(@settings.apiUrlBase + '/subnets', angular.toJson(subnet_config))

        putSubnetConfig: (id, subnet_config) ->
            return @$http.put(@settings.apiUrlBase + '/subnets/' + id, angular.toJson(subnet_config))

        getSwitchById: (id) ->
            return @$http.get(@settings.apiUrlBase + '/switches/' + id)

        getSwitchMachines: (id) ->
            return @$http.get(@settings.apiUrlBase + '/switches/' + id + '/machines')

        postSwitchAction: (id, action) ->
            return @$http.post(@settings.apiUrlBase + '/switches/' + id + '/action', angular.toJson(action))

        getClusterConfig: (id) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id + '/config')

        getClusterHostProgress: (clusterId, hostId) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId + '/state')

        putSwitches: (id, sw) ->
            return @$http.put(@settings.apiUrlBase + '/switches/' + id, angular.toJson(sw))

        getUserSetting: ->
            return @$http.get(@settings.apiUrlBase + '/users')

        getUserLog: ->
            return @$http.get(@settings.apiUrlBase + '/users/logs')

        getHealthReports: (id) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id + '/healthreports')

        getIndividualReports: (id, name) ->
            return @$http.get(@settings.apiUrlBase + '/clusters/' + id + '/healthreports/' + name)

        postHealthCheck: (id, checkHealth) ->
            return @$http.post(@settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(checkHealth))

        startHealthCheck: (id, request) ->
            return @$http.post(@settings.apiUrlBase + '/clusters/' + id + '/action',angular.toJson(request))

        getOsGlobalConfigMetaData: (id) ->
            return @$http.get(@settings.apiUrlBase + '/oses/'+ id + '/ui_metadata')
        getPackageConfigUiElements: (id) ->
            return @$http.get(@settings.apiUrlBase + '/flavors/' + id + '/ui_metadata')
        uploadSwitches: (data) ->
            return @$http.post(@settings.apiUrlBase + '/switchesbatch', angular.toJson(data))
        uploadMachines: (data) ->
            return @$http.post(@settings.apiUrlBase + '/switches/machines', angular.toJson(data))
    angular.module('compass.services').service('dataService', ['$http', 'settings', ($http,settings) -> new DS($http,settings)])
)