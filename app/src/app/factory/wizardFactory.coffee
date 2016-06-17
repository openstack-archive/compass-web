define(['./baseFactory'], () -> 
   'use strict'
   class WizardFactory
        constructor: () -> 
            @cluster = {}
            @steps = []
            @commit = {}
            @servers = []
            @allServers = []
            @generalConfig = {}
            @subnetworks = []
            @routingtable = []
            @generalConfig = {}
            @interfaces = {}
            @partition = {}
            @server_credentials = {}
            @service_credentials = {}
            @console_credentials = {}
            @network_mapping = {}
            @ceph_config = {}
            @os_gloable_config = {}
            @package_config = {}
        clean: ->
            @cluster = {}
            @steps = []
            @commit = {}
            @servers = []
            @allServers = []
            @generalConfig = {}
            @subnetworks = []
            @routingtable = []
            @generalConfig = {}
            @interfaces = {}
            @partition = {}
            @server_credentials = {}
            @service_credentials = {}
            @console_credentials = {}
            @network_mapping = {}
            @ceph_config = {}
            @package_config = {}

        preConfig: (config) ->
            @setInterfaces(config.interface)
            @setGeneralConfig(config.general)
            @setPartition(config.partition)
            @setServerCredentials(config.server_credentials)
            @setServiceCredentials(config.service_credentials)
            @setConsoleCredentials(config.console_credentials)
            @setNetworkMapping(config.network_mapping)
            @setCephConfig(config.ceph_config) if config.ceph_config
            @setPackageConfig(config.package_config) if config.package_config

        setClusterInfo: (cluster) ->
            @cluster = cluster

        setInterfaces: (interfaces) ->
            @interfaces = interfaces

        setGeneralConfig: (config) ->
            @generalConfig = config

        getGeneralConfig: ->
            return @generalConfig

        setPartition: (partition) ->
            @partition = partition

        setOsGlobalConfig: (os_config) ->
            @os_gloable_config = os_config

        getOsGlobalConfig: ->
            return @os_gloable_config

        setServerCredentials: (credentials) ->
            @server_credentials = credentials

        getServerCredentials: ->
            return @server_credentials

        setServiceCredentials: (credentials) ->
            @service_credentials = credentials

        setConsoleCredentials: (credentials) ->
            @console_credentials = credentials

        setNetworkMapping: (mapping) ->
            @network_mapping = mapping

        setCephConfig: (cephConfig) ->
            @ceph_config = cephConfig

        getClusterInfo: ->
            return @cluster

        getAllMachinesHost: ->
            return @allServers

        setAllMachinesHost: (server) ->
            @allServers = server

        setSubnetworks: (subnetworks) ->
            @subnetworks = subnetworks

        getSubnetworks: ->
            return @subnetworks

        getInterfaces: ->
            return @interfaces

        getPartition: ->
            return @partition

        getServiceCredentials: ->
            return @service_credentials

        getConsoleCredentials: ->
            return @console_credentials

        getServers: -> 
            return @servers

        getNetworkMapping: ->
            return @network_mapping

        getCephConfig: ->
            return @ceph_config

        setCommitState: (commitState) ->
            @commit = commitState

        getCommitState: ->
            return @commit
        setServers: (servers) ->
            return @servers = servers

        setPackageConfig: (packageConfig) ->
            @package_config = packageConfig

        getPackageConfig: ->
            return @package_config

   angular.module('compass.factories').factory('wizardFactory',[ () -> new WizardFactory()])
)