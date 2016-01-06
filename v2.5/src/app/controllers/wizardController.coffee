define(['./baseController'], ()->
  'use strict';

  angular.module('compass.controllers')
    .controller 'wizardCtrl',['$scope', 'wizardService', '$state', '$stateParams', 'clusterData', 'adaptersData', 'machinesHostsData', 'wizardStepsData', 'clusterConfigData',
        ($scope, wizardService, $state, $stateParams, clusterData, adaptersData, machinesHostsData, wizardStepsData, clusterConfigData) ->

            wizardService.wizardInit($scope, $stateParams.id, clusterData, adaptersData, wizardStepsData, machinesHostsData, clusterConfigData)

            $scope.skipForward = (nextStepId) ->
                if $scope.currentStep != nextStepId
                    $scope.pendingStep = nextStepId
                    wizardService.triggerCommitByStepById($scope,$scope.currentStep ,nextStepId)

            $scope.stepControl = (goToPrevious) ->
                wizardService.stepControl($scope, goToPrevious)

            $scope.stepForward = ->
                $scope.pendingStep = $scope.currentStep + 1
                wizardService.triggerCommitByStepById($scope,$scope.currentStep ,$scope.pendingStep)

            $scope.stepBackward = ->
                $scope.pendingStep = $scope.currentStep - 1
                wizardService.triggerCommitByStepById($scope,$scope.currentStep ,$scope.pendingStep)

            $scope.deploy = ->
                wizardService.deploy($scope)

            $scope.$on 'loading', (event, data) ->
                $scope.loading = data

            wizardService.setSubnetworks()

            wizardService.watchingCommittedStatus($scope)
    ]
    .controller 'svSelectCtrl', ['$scope', 'wizardService', '$filter', 'ngTableParams', '$modal'
        ($scope, wizardService, $filter, ngTableParams, $modal) ->
            $scope.hideunselected = ''
            $scope.search = {}
            $scope.cluster = wizardService.getClusterInfo()
            $scope.allservers = wizardService.getAllMachinesHost()
            $scope.allAddedSwitches = []
            wizardService.getServerColumns().success (data) ->
                $scope.server_columns = data.showall

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
            $scope.selectAllServers = (flag) ->
                if flag
                    sv.selected = true for sv in $scope.allservers  when !sv.disabled
                else
                    sv.selected = false for sv in $scope.allservers

            $scope.uploadFile = ->
                modalInstance = $modal.open(
                    templateUrl: "src/app/partials/modalUploadFiles.html"
                    controller: "uploadFileModalInstanceCtrl"
                    resolve:
                        allSwitches: ->
                            return $scope.allAddedSwitches
                        allMachines: ->
                            return $scope.foundResults
                )
            $scope.addNewMachines = ->
                modalInstance = $modal.open(
                    templateUrl: "src/app/partials/modalAddNewServers.html"
                    controller: "addMachineModalInstanceCtrl"
                    resolve:
                        allSwitches: ->
                            return $scope.allAddedSwitches
                        allMachines: ->
                            return $scope.foundResults
                )

            #watch and add newly found servers to allservers array
            wizardService.watchAndAddNewServers($scope)

            $scope.commit = (sendRequest) ->
                wizardService.svSelectonCommit($scope)
    ]
    .controller 'globalCtrl', ['$scope', 'wizardService', '$q',
        ($scope, wizardService, $q) ->

            wizardService.globalConfigInit($scope)
            wizardService.buildOsGlobalConfigByMetaData($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.addValue = (category, key) ->
                scope.os_global_config[category][key] = [] if !$scope.os_global_config[category][key]
                $scope.os_global_config[category][key].push("")
                # $scope.general[key].push("")

            $scope.commit = (sendRequest) ->
                wizardService.globalCommit($scope,sendRequest)
    ]
    .controller 'networkCtrl', ['$rootScope', '$scope', 'wizardService', 'ngTableParams', '$filter', '$modal', '$timeout', '$cookieStore',
        ($rootScope, $scope, wizardService, ngTableParams, $filter, $modal, $timeout, $cookieStore) ->

            wizardService.networkInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.autoFillManage = ->
                $scope.autoFill = !$scope.autoFill;
                if $scope.autoFill then $scope.autoFillButtonDisplay = "Disable Autofill" else $scope.autoFillButtonDisplay = "Enable Autofill"

            $scope.autofill = (alertFade) ->
                for key, value of $scope.interfaces
                    ip_start = $("#" + key + "-ipstart").val()
                    interval = parseInt($("#" + key + "-increase-num").val())
                    wizardService.fillIPBySequence($scope, ip_start, interval, key)

                hostname_rule = $("#hostname-rule").val()
                wizardService.fillHostname($scope, hostname_rule)
                $scope.networkAlerts = [{
                    msg: 'Autofill Done!'
                }]
                if alertFade
                    $timeout ->
                        $scope.networkAlerts = []
                    , alertFade

            $scope.addInterface = (newInterface) ->
                wizardService.addInterface($scope, newInterface)

            $scope.deleteInterface = (delInterface) ->
                delete $scope.interfaces[delInterface]
                delete sv.networks[delInterface] for sv in $scope.servers

            $scope.selectAsInstallInterface = (evt, name) ->
                checkbox = evt.target
                if !checkbox.checked
                    return

                for n of $scope.interfaces
                    if n != name
                        $scope.interfaces[n].is_mgmt = false
                return

            $scope.openAddSubnetModal = ->
                modalInstance = $modal.open(
                    templateUrl: "src/app/partials/modalAddSubnet.tpl.html"
                    controller: "addSubnetModalInstanceCtrl"
                    resolve:
                        subnets: ->
                            return $scope.subnetworks
                )

                modalInstance.result.then( (subnets) ->
                    $scope.subnetworks = subnets
                    wizardService.setSubnetworks($scope.subnetworks)
                ->
                    console.log("modal dismissed")

                )

            $scope.commit = (sendRequest) ->
                installInterface = {}; # the physical interface to install os
                $rootScope.networkMappingInterfaces = {}; # the interface name are needed to map openstack componets
                for name, value of $scope.interfaces
                    installInterface[name] = value if value.is_mgmt
                    $rootScope.networkMappingInterfaces[name] = subnet for subnet in $scope.subnetworks when  ('' + subnet.id) == ('' + value.subnet_id)
                    $rootScope.networkMappingInterfaces[name].subnet_id = value.subnet_id
                    $rootScope.networkMappingInterfaces[name].is_mgmt = value.is_mgmt
                $scope.interfaces = installInterface # only need to store install interface
                $cookieStore.put('networkMappingInterfaces', $rootScope.networkMappingInterfaces)
                wizardService.networkCommit($scope, sendRequest)

            # display data in the table
            wizardService.getClusterHosts($scope.cluster.id).success (data) ->
                $scope.servers = data
                $scope.interfaces = $cookieStore.get('networkMappingInterfaces')
                wizardService.setInterfaces($scope.interfaces)
                wizardService.displayDataInTable($scope, $scope.servers)
    ]
    .controller 'partitionCtrl', ['$scope', 'wizardService',
        ($scope, wizardService) ->

            wizardService.partitionInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.addPartition = ->
                wizardService.addPartition($scope)

            $scope.deletePartition = (index) ->
                wizardService.deletePartition($scope, index)

            $scope.commit = (sendRequest) ->
                wizardService.partitionCommit($scope, sendRequest)

            $scope.mount_point_change = (index, name) ->
                wizardService.mount_point_change($scope, index, name)


            $scope.$watch('partitionInforArray', ->
                $scope.partitionarray = []
                total = 0
                for partitionInfo in $scope.partitionInforArray
                    total += parseFloat(partitionInfo.percentage)
                    $scope.partitionarray.push(
                        "name": partitionInfo.name
                        "number": partitionInfo.percentage
                    )
                $scope.partitionarray.push(
                    "name": "others"
                    "number": 100 - total
                )
            ,true
            )
    ]
    .controller 'packageConfigCtrl', ['$scope', 'wizardService',
        ($scope, wizardService) ->
            wizardService.targetSystemConfigInit($scope)
            wizardService.watchingTriggeredStep($scope)
            $scope.mSave = ->
                $scope.originalMangementData = angular.copy($scope.console_credentials)
            $scope.sSave = ->
                $scope.originalServiceData = angular.copy($scope.service_credentials)

            $scope.mSave()
            $scope.sSave()

            console.log($scope.console_credentials)
            $scope.mEdit = (index) ->
                for em, i in $scope.editMgntMode
                    if i != index
                        $scope.editMgntMode[i] = false
                    else
                        $scope.editMgntMode[i] = true



                $scope.mReset()
            $scope.mReset = ->
                $scope.console_credentials = angular.copy($scope.originalMangementData)

            $scope.commit = (sendRequest) ->
                wizardService.targetSystemConfigCommit($scope, sendRequest)

            $scope.addValue = (key1,key2,key3) ->
                if !$scope.package_config[key1][key2][key3]
                    $scope.package_config[key1][key2][key3] = []
                $scope.package_config[key1][key2][key3].push ""
    ]
    .controller 'roleAssignCtrl', ['$scope', 'wizardService', '$filter', 'ngTableParams',
        ($scope, wizardService, $filter, ngTableParams) ->
            wizardService.roleAssignInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.selectAllServers = (flag) ->
                if flag
                    sv.checked = true for sv in $scope.servers
                else
                    sv.checked = false for sv in $scope.servers

            $scope.assignRole = (role) ->
                wizardService.assignRole($scope, role)

            $scope.removeRole = (server, role) ->

                serverIndex = $scope.servers.indexOf(server)
                roleIndex = $scope.servers[serverIndex].roles.indexOf(role)
                $scope.servers[serverIndex].roles.splice(roleIndex, 1)
                $scope.existingRoles[serverIndex].splice(role_key, 1, role_key) for role_value, role_key in $scope.roles when role.name == $scope.roles[role_key].name
                $scope.servers[serverIndex].dropChannel = $scope.existingRoles[serverIndex].toString()

            $scope.onDrop = ($event, server) ->
                $scope.dragKey = $scope.servers.indexOf(server)

            $scope.dropSuccessHandler = ($event, role_value, key) ->
                roleExist = wizardService.checkRoleExist($scope.servers[$scope.dragKey].roles, role_value)
                if !roleExist
                    $scope.servers[$scope.dragKey].roles.push(role_value)
                else
                    console.log("role exists")
                wizardService.checkExistRolesDrag($scope)

            $scope.autoAssignRoles = ->
                wizardService.autoAssignRoles($scope)

            $scope.haMultipleNodeAssignRoles = ->
                rolesHash = {}
                rolesHash[role.name] = role for role in $scope.roles
                for i in [0...3]
                    $scope.servers[i].roles = []
                    $scope.servers[i].roles.push(rolesHash['controller'])
                    $scope.servers[i].roles.push(rolesHash['ha'])
                    $scope.servers[i].roles.push(rolesHash['ceph-mon'])
                    if i == 0
                        $scope.servers[i].roles.push(rolesHash['odl'])
                        $scope.servers[i].roles.push(rolesHash['onos'])
                        $scope.servers[i].roles.push(rolesHash['ceph-adm'])
                for i in [3...$scope.servers.length]
                    $scope.servers[i].roles = []
                    $scope.servers[i].roles.push(rolesHash['compute'])
                    $scope.servers[i].roles.push(rolesHash['ceph-osd'])
                return

            $scope.commit = (sendRequest)->
                wizardService.roleAssignCommit($scope, sendRequest)


            wizardService.displayDataInTable($scope, $scope.servers)
    ]
    .controller 'networkMappingCtrl', ['$scope', 'wizardService', '$cookieStore',
        ($scope, wizardService, $cookieStore) ->
            wizardService.networkMappingInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.updateInternalNetwork = (network_name) ->
                if ($scope.ips[network_name].cidr.split('.') < 4)
                    return
                $scope.ips[network_name].start = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                    '.' + $scope.ips[network_name].start.split('.')[3]
                $scope.ips[network_name].end = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                    '.' + $scope.ips[network_name].end.split('.')[3]
                if network_name == 'mgmt'
                    $scope.ips.mgmt.internal_vip = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                        '.' + $scope.ips.mgmt.internal_vip.split('.')[3]
                return

            $scope.updateExternalNetwork = (network_name) ->
                nic = $scope.external[network_name]
                $scope.ips[network_name].cidr = $scope.interfaces[nic].subnet
                $scope.ips[network_name].start = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                    '.' + $scope.ips[network_name].start.split('.')[3]
                $scope.ips[network_name].end = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                    '.' + $scope.ips[network_name].end.split('.')[3]
                if network_name == 'external'
                    $scope.ips.external.public_vip = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                        '.' + $scope.ips.external.public_vip.split('.')[3]
                    $scope.ips.external.gw_ip = $scope.ips[network_name].cidr.split('.').slice(0,3).join('.') +
                        '.' + $scope.ips.external.gw_ip.split('.')[3]
                return

            defaultCfg = ->
                $scope.internal = {
                  mgmt: 'eth1',
                  storage: 'eth1'
                }

                $scope.external = {
                  external: 'eth2'
                }

                $scope.vlanTags = {
                  mgmt: '101',
                  storage: '102'
                }

                $scope.ips = {
                  mgmt: {
                    start: '172.16.1.1',
                    end: '172.16.1.254',
                    cidr: '172.16.1.0/24',
                    internal_vip: '172.16.1.222'
                  },
                  external: {
                    start: '10.145.250.210',
                    end: '10.145.250.220',
                    cidr: '10.145.250.0/24',
                    gw_ip: '10.145.250.1',
                    public_vip: '10.145.250.222'
                  },
                  storage: {
                    start: '172.16.2.1',
                    end: '172.16.2.254',
                    cidr: '172.16.2.0/24'
                  }
                }
                $scope.updateExternalNetwork('external')
                return

            saveCfg = ->
                networkMapping = {
                  internal: $scope.internal,
                  external: $scope.external,
                  vlanTags: $scope.vlanTags,
                  ips: $scope.ips
                }
                $cookieStore.put('networkMapping', networkMapping)
                return

            readCfg = ->
                $scope.interfaces = $cookieStore.get('networkMappingInterfaces')
                networkMapping = $cookieStore.get('networkMapping')
                return defaultCfg() if !networkMapping
                $scope.internal = networkMapping.internal
                $scope.external = networkMapping.external
                $scope.vlanTags = networkMapping.vlanTags
                $scope.ips = networkMapping.ips
                return

            configureNeutronCfg = ->
                neutronCfg = {
                    'openvswitch': {
                        'tenant_network_type': 'vxlan',
                        'network_vlan_ranges': ['physnet:1:4094'],
                        'bridge_mappings': ['physnet:br-prv']
                    }
                }
                return neutronCfg

            configureNetworkCfg = ->
                #configure the packageConfig.network_cfg
                networkCfg = {
                    'bond_mappings': [],
                    'sys_intf_mappings': [{
                        'interface': $scope.internal.mgmt,
                        'role': ['controller', 'compute'],
                        'vlan_tag': $scope.vlanTags.mgmt,
                        'type': 'vlan',
                        'name': 'mgmt'
                    }, {
                        'interface': $scope.internal.storage,
                        'role': ['controller', 'compute'],
                        'vlan_tag': $scope.vlanTags.storage,
                        'type': 'vlan',
                        'name': 'storage'
                    }, {
                        'interface': 'br-prv',
                        'role': ['controller', 'compute'],
                        'type': 'ovs',
                        'name': 'external'
                    }],
                    'nic_mappings': [],
                    'public_net_info': {
                        'no_gateway': 'False',
                        'external_gw': $scope.ips.external.gw_ip,
                        'enable': 'False',
                        'floating_ip_cidr': $scope.ips.external.cidr,
                        'floating_ip_start': $scope.ips.external.start,
                        'floating_ip_end': $scope.ips.external.end,
                        'provider_network': 'physnet',
                        'subnet': 'ext-subnet',
                        'network': 'ext-net',
                        'enable_dhcp': 'False',
                        'segment_id': 1000,
                        'router': 'router-ext',
                        'type': 'vlan'
                    },
                    'internal_vip': {
                        'interface': 'mgmt',
                        'ip': $scope.ips.mgmt.internal_vip,
                        'netmask': wizardService.getNetMaskFromCIDR($scope.ips.mgmt.cidr)
                    },
                    'public_vip': {
                        'interface': 'external',
                        'ip': $scope.ips.external.public_vip,
                        'netmask': wizardService.getNetMaskFromCIDR($scope.ips.external.cidr)
                    },
                    'provider_net_mappings': [{
                        'interface': $scope.internal.mgmt,
                        'role': ['controller', 'compute'],
                        'type': 'ovs',
                        'name': 'br-prv',
                        'network': 'physnet'
                    }],
                    'ip_settings': [{
                        'cidr': $scope.ips.mgmt.cidr,
                        'role': ['controller', 'compute'],
                        'name': 'mgmt',
                        'ip_ranges': [[$scope.ips.mgmt.start, $scope.ips.mgmt.end]]
                    }, {
                        'cidr': $scope.ips.storage.cidr,
                        'role': ['controller', 'compute'],
                        'name': 'storage',
                        'ip_ranges': [[$scope.ips.storage.start, $scope.ips.storage.end]]
                    }, {
                        'gw': $scope.ips.external.gw_ip,
                        'cidr': $scope.ips.external.cidr,
                        'role': ['controller', 'compute'],
                        'name': 'external',
                        'ip_ranges': [[$scope.ips.external.start, $scope.ips.external.end]]
                    }]
                }
                return networkCfg

            configureNetworkMapping = ->
                installNic = {}
                nicName = ''
                # somehow the interfaces are stored from previous step
                # use it to configure the install network for networkMapping
                for nic, value of $scope.interfaces
                    installNic = value if value.is_mgmt
                    nicName = nic if value.is_mgmt
                $scope.networkMapping = {
                    'install': {
                        'interface': nicName,
                        'subnet': installNic.subnet
                    }
                }
                return

            # configureHAProxyCfg = ->
            #     haCfg = {
            #       'vip': $scope.ips.external.public_vip
            #     }
            #     return haCfg

            # locate the install network, it is used to setup networkMapping and HAProxy
            configureNetworkMapping()
            # if there is network mapping configurations stored in cookie
            readCfg()

            # $scope.onDrop = ($event, key) ->
            #     $scope.pendingInterface = key

            # $scope.dropSuccessHandler = ($event, key, dict) ->
            #     dict[key].mapping_interface = $scope.pendingInterface

            $scope.commit = (sendRequest) ->
                networkCfg = configureNetworkCfg()
                neutronCfg = configureNeutronCfg()
                saveCfg() # save changes to cookie
                # haCfg = configureHAProxyCfg()
                wizardService.networkMappingCommit($scope, networkCfg, $scope.networkMapping,
                  neutronCfg, sendRequest)
    ]
    .controller 'reviewCtrl', ['$scope', 'wizardService', 'ngTableParams', '$filter', '$location', '$anchorScroll'
        ($scope, wizardService, ngTableParams, $filter, $location, $anchorScroll) ->
            wizardService.reviewInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.scrollTo = (id) ->
                old = $location.hash();
                $location.hash(id);
                $anchorScroll();
                $location.hash(old);

            $scope.commit = (sendRequest) ->
                wizardService.reviewCommit($scope, sendRequest)

            wizardService.displayDataInTable($scope, $scope.servers)

            $scope.reload = ->
                wizardService.displayDataInTable($scope, $scope.servers)
    ]
    .animation '.fade-animation', [->
        return{
            enter: (element, done) ->
                element.css('display', 'none')
                element.fadeIn(500, done)
                return ->
                    element.stop()
            leave: (element, done) ->
                element.fadeOut(500,done)
                return ->
                    element.stop()
        }
    ]
)
