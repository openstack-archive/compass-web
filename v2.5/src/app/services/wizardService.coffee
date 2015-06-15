define(['./baseService'], ()-> 
    'use strict';
    class WizardService
        constructor: (@dataService, @$state, @wizardFactory, @$filter, @$q, @ngTableParams, @$modal) ->

        getClusterById: (clusterId) ->
            @dataService.getClusterById(clusterId)

        getAllMachineHosts: ->
            @dataService.getAllMachineHosts()

        getWizardSteps: ->
            @dataService.getWizardSteps()

        getClusterConfig: (clusterId)->
            @dataService.getClusterConfig(clusterId)

        getAdapters: ->
            @dataService.getAdapters()

        getCurrentAdapterName: (adapters, adapterId) ->
            currentAdapterName = adapter.name for adapter in  adapters when adapter.id is adapterId

        getSteps: (currentAdapterName, wizardStepsData) ->
            switch currentAdapterName[0]
                when "openstack_icehouse"      then wizardStepsData["os_and_ts"]
                when "os_only"                 then wizardStepsData["os"]
                when "ceph_openstack_icehouse" then wizardStepsData["os_and_ts"] 
                when "ceph_firefly"            then wizardStepsData["os_and_ts"]

        setWizardPreConfig: (currentAdapterName, clusterConfigData) ->
            switch currentAdapterName[0]
                when "openstack_icehouse"      then @getWizardPreConfig("openstack", clusterConfigData)
                when "os_only"                 then @getWizardPreConfig("os_only", clusterConfigData)
                when "ceph_openstack_icehouse" then @getWizardPreConfig("openstack_ceph", clusterConfigData)
                when "ceph_firefly"            then @getWizardPreConfig("ceph_firefly", clusterConfigData)

        getWizardPreConfig: (name, clusterConfigData)->
            wizardFactory = @wizardFactory
            oldConfig = clusterConfigData
            @dataService.getWizardPreConfig().success (data) ->
                preConfigData = data[name]
                if preConfigData 
                    wizardFactory.preConfig(data[name])
                    if oldConfig.os_config
                        # wizardFactory.setGeneralConfig(oldConfig.os_config.general) if oldConfig.os_config.general
                        wizardFactory.setPartition(oldConfig.os_config.partition) if oldConfig.os_config.partition
                        # wizardFactory.setServerCredentials(oldConfig.os_config.server_credentials) if oldConfig.os_config.server_credentials
                        wizardFactory.setOsGlobalConfig(oldConfig.os_config)
                    if oldConfig.package_config
                        if oldConfig.package_config.security
                            wizardFactory.setServiceCredentials(oldConfig.package_config.security.service_credentials) if oldConfig.package_config.security.service_credentials
                            wizardFactory.setConsoleCredentials(oldConfig.package_config.security.console_credentials) if oldConfig.package_config.security.console_credentials
                        wizardFactory.setNetworkMapping(oldConfig.package_config.network_mapping) if oldConfig.package_config.network_mapping
                        wizardFactory.setCephConfig(oldConfig.package_config.ceph_config) if oldConfig.package_config.ceph_config
                        wizardFactory.setPackageConfig(oldConfig.package_config)


        getClusterInfo: ->
            return @wizardFactory.getClusterInfo()

        getAllMachinesHost: ->
            @wizardFactory.getAllMachinesHost()

        setAllMachinesHost: (server)->
            @wizardFactory.setAllMachinesHost server

        ipAddressPre: (ip) ->
            m = ip.split "."
            x = ""

            ipAddressPreHelper = (i) ->
                item = m[i]
                if item.length is 1
                    x += "00" + item
                else if item.length is 2
                    x += "0" + item
                else 
                    x += item
            ipAddressPreHelper i for i in [0..m.length-1]
            return x

        setSubnetworks: ->
            wizardFactory = @wizardFactory
            @dataService.getSubnetConfig().success (data) ->
                wizardFactory.setSubnetworks(data)

        getServerColumns: ->
            @dataService.getServerColumns()

        getSwitches: ->
            @dataService.getSwitches()

        # findServers: (scope) ->
        #     swSelection  = false
        #     swSelection = true for sw in scope.switches when sw.selected
        #     findServersHelper = (sw) ->
        #         sw.result = ""
        #         sw.finished = false
        #         sw.polling = true

        #     if !swSelection
        #         alert("Please select at least one switch") if !swSelection
        #     else
        #         scope.isFindingNewServers = true
        #         scope.newfoundServers = []
        #         findServersHelper sw for sw in scope.switches when sw.selected

        watchAndAddNewServers: ($scope) ->
            $filter = @$filter
            $scope.$watch 'foundResults', (newResults, oldResults) ->
                if newResults != oldResults
                    for result in newResults
                        sv = $filter('filter')($scope.allservers, result.mac, true)
                        if sv.length == 0
                            result.machine_id = result.id
                            delete result['id']
                            result.new = true
                            $scope.allservers.unshift(result)

                    if $scope.tableParams
                        $scope.tableParams.$params.count = $scope.allservers.length
                        $scope.tableParams.reload()
            ,true

        postSwitches: (newswitch) ->
            @dataService.postSwitches newswitch

        wizardInit: ($scope, clusterId, clusterData, adaptersData, wizardStepsData, machinesHostsData, clusterConfigData) ->
            @wizardFactory.clean()
            $scope.loading = false
            $scope.clusterId = clusterId
            $scope.cluster = clusterData
            $scope.adapters = adaptersData
            $scope.currentAdapterName = @getCurrentAdapterName($scope.adapters, $scope.cluster.adapter_id)
            $scope.steps = @getSteps($scope.currentAdapterName, wizardStepsData)
            @setWizardPreConfig($scope.currentAdapterName, clusterConfigData)
            @setClusterInfo($scope.cluster)
            @setAllMachinesHost(machinesHostsData)

            $scope.currentStep = 1
            $scope.maxStep = 1
            $scope.pendingStep = 1

        globalConfigInit: ($scope) ->
            $scope.os_global_config = {}
            $scope.cluster = @wizardFactory.getClusterInfo()
            if @wizardFactory.getOsGlobalConfig() != undefined
                $scope.os_global_config = @wizardFactory.getOsGlobalConfig() 
            # $scope.cluster = @wizardFactory.getClusterInfo()
            # $scope.general = @wizardFactory.getGeneralConfig()
            # $scope.server_credentials = @wizardFactory.getServerCredentials()
            # @dataService.getTimezones().success (data) ->
            #     $scope.timezones = data

        networkInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            $scope.subnetworks = @wizardFactory.getSubnetworks()
            $scope.interfaces = @wizardFactory.getInterfaces()

            $scope.autoFill = false;
            $scope.autoFillButtonDisplay = "Enable Autofill"

            @dataService.getServerColumns().success (data) ->
                $scope.server_columns = data.showless

        deleteSubnet: ($scope, index, id) ->
            @dataService.deleteSubnet(id).success (data) ->
                $scope.subnetworks.splice(index, 1)

        validateAllSubnets: ($scope) ->
            $scope.subnetAllValid = true
            $scope.subnetAllValid = false for subnet in $scope.subnetworks when subnet['valid'] is false

        subnetCommit: ($scope, $modalInstance) ->
            promises = []
            for subnet in $scope.subnetworks
                requestData =
                    "subnet": subnet.subnet
                if subnet.id is undefined
                    updateSubnetConfig = @dataService.postSubnetConfig(requestData)
                else
                    updateSubnetConfig = @dataService.putSubnetConfig(subnet.id, requestData)
                promises.push(updateSubnetConfig)

            findNewSubnetId = @findNewSubnetId

            @$q.all(promises).then (data)->
                for subnet in $scope.subnetworks
                    if !subnet["id"]
                        id = findNewSubnetId(subnet.subnet, data)
                        subnet["id"] = id
                $modalInstance.close($scope.subnetworks)

            (response) ->
                console.log "promises error", response
        findNewSubnetId: (ip, data) ->
            for sub in data
                return sub.data.id if sub.data.subnet is ip
            return null
        fillHostname: ($scope, rule) ->
            switch rule
                when "host"
                    server_index = 1
                    for server in $scope.servers
                        server.hostname = "host-" + server_index
                        server_index++
                when "switch_ip"
                    for server in $scope.servers
                        server.hostname = server.switch_ip.replace(/\./g, "-") + "-p" + server.port

        fillIPBySequence: ($scope, ipStart, interval, key) ->
            if ipStart is ""
                return;
            ipStartParts = ipStart.split(".")
            ipParts = ipStartParts.map (x) ->
                return parseInt(x)
            for server in $scope.servers
                if ipParts[3] > 255
                    ipParts[3] = ipParts[3] - 256
                    ipParts[2]++

                if ipParts[2] > 255
                    ipParts[2] = ipParts[2] - 256
                    ipParts[1]++

                if ipParts[1] > 255
                    ipParts[1] = ipParts[1] - 256
                    ipParts[0]++
                
                if ipParts[0] > 255
                    server.networks[key].ip = ""
                    return;
                else 
                    ip = ipParts[0] + "." + ipParts[1] + "." + ipParts[2] + "." + ipParts[3]
                    server.networks[key].ip = ip
                    ipParts[3] = ipParts[3] + interval
                

        getClusterHosts: (clusterId) ->
            @dataService.getClusterHosts clusterId

        setInterfaces: (interfaces) ->
            @wizardFactory.setInterfaces interfaces

        setClusterInfo: (cluster) ->
            @wizardFactory.setClusterInfo cluster

        setPartition: (partition) ->
            @wizardFactory.setPartition partition

        partitionInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            $scope.partition = @wizardFactory.getPartition()
            $scope.partitionInforArray = []
            $scope.duplicated = false
            $scope.duplicatedIndexArray = []
            for key, val of $scope.partition
                $scope.partitionInforArray.push(
                    "name": key
                    "percentage": val.percentage
                    "max_size": val.max_size
                )

        targetSystemConfigInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            $scope.service_credentials = @wizardFactory.getServiceCredentials()
            $scope.console_credentials = @wizardFactory.getConsoleCredentials()

            $scope.package_config = @wizardFactory.getPackageConfig()

            if $scope.package_config["neutron_config"]
                if $scope.package_config["neutron_config"]["openvswitch"]
                    for key,value of $scope.package_config["neutron_config"]["openvswitch"]
                        $scope.package_config["neutron_config"][key] = value

            typeIsArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'

            @dataService.getPackageConfigUiElements($scope.cluster.flavor.id).success (data) ->
                $scope.metaData = data.flavor_config
                for key,value of $scope.metaData
                    if value.category isnt "service_credentials" and value.category isnt "console_credentials"
                        if !$scope.package_config[value.category]
                            $scope.package_config[value.category] = {}

                    if value.data_structure is "form"
                        for serialNum, content of value.data
                            if !$scope.package_config[value.category][content.name]
                                if !content.content
                                    if !content.default_value
                                        $scope.package_config[value.category][content.name] = ""
                                    else
                                        $scope.package_config[value.category][content.name] = content.default_value
                                else
                                    $scope.package_config[value.category][content.name] = {}
                            if content.content
                                for content_data_serialNum, content_data_value of content.content
                                    if !$scope.package_config[value.category][content.name][content_data_value.name]
                                        if !content_data_value.default_value
                                            if !content_data_value.content_data
                                                $scope.package_config[value.category][content.name][content_data_value.name] = ""
                                            else 
                                                $scope.package_config[value.category][content.name][content_data_value.name] = {}
                                        else
                                            $scope.package_config[value.category][content.name][content_data_value.name] = content_data_value.default_value
                                    for details_content_data_key, details_content_data_value of content_data_value.content_data
                                        if details_content_data_key is content_data_value.default_value
                                            for details_key, details_value of details_content_data_value
                                                if !$scope.package_config[value.category][content.name][details_value.name]
                                                    if !details_value.hint
                                                        $scope.package_config[value.category][content.name][details_value.name] = [""]
                                                    else
                                                        $scope.package_config[value.category][content.name][details_value.name] = [details_value.hint]
                    if value.category is "service_credentials" or value.category is "console_credentials"
                        if !$scope.package_config["security"]
                            $scope.package_config["security"] = {}
                        $scope.package_config["security"][value.category] = value.config
                        $scope.metaData[key].dataSource = $scope.package_config["security"][value.category]
                    else
                        $scope.metaData[key].dataSource = $scope.package_config[value.category]

            $scope.change = (category,subname,name,value) ->
                for i of $scope.package_config[category][subname]
                    if i isnt name
                        delete $scope.package_config[category][subname][i]
                    for metaKey, metaValue of $scope.metaData
                        if metaValue.category is category
                            for serialNum, content of metaValue.data
                                for content_data_key, content_data_value of content.content
                                    for detail_data_key, detail_data_value of content_data_value.content_data
                                        if detail_data_key is value
                                            for i in detail_data_value
                                                if !$scope.package_config[category][subname][i.name]
                                                    if !i.hint
                                                        $scope.package_config[category][subname][i.name] = [""]
                                                    else
                                                        $scope.package_config[category][subname][i.name] = [i.hint]

            keyLength_service_credentials = Object.keys($scope.service_credentials).length;
            $scope.editServiceMode = []
            $scope.editServiceMode.length = keyLength_service_credentials

            keyLength_console_credentials = Object.keys($scope.console_credentials).length
            $scope.editMgntMode = []
            $scope.editMgntMode.length = keyLength_console_credentials

            $scope.mgmtAccordion = {}

        roleAssignInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            colors = ['#a4ebc6', '#cbe375', '#f5d185', '#ee9f97', '#de8ea8', '#8a8ae7', '#85c9fc', '#ffdc4d', '#f2af58', '#f1a3d7', '#e0a9f8', '#88e8db', '#7dc9df', '#bfbfbf', '#bece91', '#84efa7']
            $scope.servers = @wizardFactory.getServers()
            # $scope.servers = @wizardFactory.getAllMachinesHost()
            $scope.existingRoles = []
            $scope.realRole = []

            @getServerColumns().success (data) ->
                $scope.server_columns = data.showless

            @getClusterById($scope.cluster.id).success (data) ->
                $scope.roles = data.flavor.roles
                for role_key, role of $scope.roles
                    role.color = colors[role_key]
                    $scope.roles[role_key].dragChannel = role_key
                    $scope.realRole.push(role_key)

                for key, value of $scope.servers
                    $scope.existingRoles.push(angular.copy($scope.realRole))
                    $scope.servers[key].dropChannel = $scope.existingRoles[key].toString()
                    for server_role_key, server_role of $scope.servers[key].roles
                        $scope.server_role = ""
                        for role_key, role of $scope.roles
                            if server_role.name == $scope.roles[role_key].name
                                $scope.server_role = role_key
                        server_role.color = colors[$scope.server_role]

                # !!!may need $scope.checkExistRolesDrag()
        networkMappingInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            $scope.interfaces = @wizardFactory.getInterfaces()
            $scope.original_networking = @wizardFactory.getNetworkMapping()

            for key, value of $scope.interfaces
                $scope.interfaces[key].dropChannel = "others"

            # drag options for networks
            $scope.networking = {}
            for key, value of $scope.original_networking
                $scope.networking[key] = {}
                $scope.networking[key].mapping_interface = value
                if key == "external" then $scope.networking[key].dragChannel = "external" else $scope.networking[key].dragChannel = "others"
            # set the interface with promisc mode to be external network  [required]
            for key, value of $scope.interfaces
                if value.is_promiscuous
                    $scope.networking["external"].mapping_interface = key
                    $scope.interfaces[key].dropChannel = "external"
                if value.is_mgmt
                    $scope.networking["management"].mapping_interface = key
        reviewInit: ($scope) ->
            $scope.cluster = @wizardFactory.getClusterInfo()
            $scope.servers = @wizardFactory.getServers()
            $scope.interfaces = @wizardFactory.getInterfaces()
            $scope.partition = @wizardFactory.getPartition()
            $scope.network_mapping = @wizardFactory.getNetworkMapping()
            $scope.server_credentials = @wizardFactory.getServerCredentials()
            $scope.service_credentials = @wizardFactory.getServiceCredentials()
            $scope.console_credentials = @wizardFactory.getConsoleCredentials()
            $scope.global_config = @wizardFactory.getGeneralConfig()
            
            $scope.os_global_config = @wizardFactory.getOsGlobalConfig()          
            $scope.packageConfig = @wizardFactory.getPackageConfig()

            if $scope.packageConfig.ceph_config
                $scope.cephConfig = $scope.packageConfig.ceph_config
            if $scope.packageConfig.neutron_config
                $scope.neutronConfig = $scope.packageConfig.neutron_config

            @getServerColumns().success (data) ->
                $scope.server_columns = data.review
                console.log(data.review)
                for value, index in data.review
                    if value.title == "Hostname"
                        temp = $scope.server_columns[0];
                        $scope.server_columns[0] = value;
                        $scope.server_columns[index] = temp;
                    if value.title == "Host MAC Addr"
                        temp = $scope.server_columns[1];
                        $scope.server_columns[1] = value;
                        $scope.server_columns[index] = temp;
                    if value.title == "Switch IP"
                        temp = $scope.server_columns[2];
                        $scope.server_columns[2] = value;
                        $scope.server_columns[index] = temp;
                    if value.title == "Port"
                        temp = $scope.server_columns[3];
                        $scope.server_columns[3] = value;
                        $scope.server_columns[index] = temp;

            $scope.tabs =[{ 
                    "title": "Database & Queue"
                    "url": "service.tpl.html"
                },{
                    "title": "Keystone User"
                    "url": "console.tpl.html"
                }]
            $scope.tabs.push {"title": "Ceph", "url": "ceph.tpl.html"} if $scope.currentAdapterName is "ceph_openstack_icehouse"

            $scope.currentTab = $scope.tabs[0].url


        triggerCommitByStepById: ($scope, stepId, nextStepId) ->
            if nextStepId > stepId then sendRequest = true else sendRequest = false
            commitState = {
                 "name": $scope.steps[stepId - 1].name
                 "state": "triggered"
                 "sendRequest": sendRequest
                 "message": {}
            }
            # $scope.currentStep = $stepId
            @wizardFactory.setCommitState(commitState)

        watchingCommittedStatus: ($scope) ->
            wizardFactory = @wizardFactory
            $state = @$state
            $modal = @$modal
            showErrorMessage = @showErrorMessage
            $scope.$watch((-> return wizardFactory.getCommitState()), (newCommitState, oldCommitState) ->         
                if newCommitState.state is "success"
                    console.warn("### catch success in wizardCtrl ###", newCommitState, oldCommitState)
                    if newCommitState.name == "review"
                        console.log("### go to overview ###")
                        $state.go("cluster.overview",'id': $scope.cluster.id) 

                    $scope.stepControl(goToPreviousStep = false) 
                    $scope.maxStep = $scope.currentStep if $scope.currentStep > $scope.maxStep
                else if newCommitState.state is "invalid"
                    showErrorMessage($modal,"Error Message", newCommitState.message)
                else if newCommitState.state is "error"
                    # showErrorMessage($modal,"Error Message", newCommitState.message)
                    console.warn("### catch error in wizardCtrl ###", newCommitState, oldCommitState)
                else if newCommitState.state is "goToPreviousStep"
                    $scope.stepControl(goToPreviousStep = true)
                    $scope.maxStep = $scope.currentStep if $scope.currentStep > $scope.maxStep

                $scope.loading = false
            )
        showErrorMessage: ($modal, showTitle, showContent) ->
            $modal.open {
                templateUrl: 'src/app/partials/modalErrorMessage.html'
                controller: 'errorMessageCtrl'
                resolve: 
                  title: ->
                    return showTitle
                  content: ->
                    return showContent
            }

        stepControl: ($scope, goToPreviousStep) ->
            if $scope.pendingStep <= $scope.maxStep + 1
                previousStepsIncomplete = false
                previousStepsIncomplete = true for i in $scope.pendingStep - 1 when $scope.steps[i].state is "incomplete"
                if previousStepsIncomplete
                    alert("Please make sure pre-requisite steps are complete.")
                else
                    @updateStepProgress($scope, $scope.pendingStep, $scope.currentStep, goToPreviousStep)
                    $scope.currentStep = $scope.pendingStep
            else
                @showErrorMessage(@$modal, "Error","Please complete previous steps first")
                $scope.pendingStep = $scope.currentStep

        updateStepProgress: ($scope, newStep, oldStep, goToPreviousStep) ->
            $scope.steps[newStep - 1].state = "active"
            if goToPreviousStep then $scope.steps[oldStep - 1].state = "" else $scope.steps[oldStep - 1].state = "complete"
            $scope.steps[oldStep - 1].state = "complete"
            if $scope.steps[newStep - 1].name == 'sv_selection'
                if $scope.maxStep > $scope.networkStep
                    $scope.steps[$scope.networkStep].state = "incomplete"
                if $scope.maxStep > $scope.roleAssignStep
                    $scope.steps[$scope.roleAssignStep].state = "incomplete"
                
                if $scope.maxStep > $scope.networkMappingStep
                    $scope.steps[$scope.networkMappingStep].state = "incomplete"
            $scope.steps[$scope.networkMappingStep].state = "incomplete" if newStep == $scope.networkStep + 1 and $scope.maxStep > $scope.networkMappingStep
            $scope.steps[$scope.steps.length - 1].state = "" if oldStep == $scope.steps.length




        watchingTriggeredStep: ($scope) ->
                
            wizardFactory = @wizardFactory
            $scope.$watch (-> return wizardFactory.getCommitState()), (newCommitState, oldCommitState) ->       
                $scope.commit(newCommitState.sendRequest) if newCommitState.state is "triggered"

        svSelectonCommit: ($scope) ->
            $scope.$emit "loading", true

            selectedServers = []
            noSelection = true
            (noSelection = false; selectedServers.push(sv)) for sv in $scope.allservers when sv.selected

            buildMachineObjectHelper = (server) ->
                if server.reinstallos is undefined
                    return {"machine_id": server.machine_id}
                else
                    return {"machine_id": server.machine_id, "reinstall_os": server.reinstallos}

            if noSelection
                @wizardFactory.setCommitState(
                    "name": "sv_selection"
                    "state": "invalid"
                    "message": "Please select at least one server"
                )
            else
                wizardFactory = @wizardFactory
                addHostsAction = 
                    "add_hosts": 
                        "machines": []
                addHostsAction.add_hosts.machines.push(buildMachineObjectHelper(server)) for server in $scope.allservers when server.selected
                @dataService.postClusterActions($scope.cluster.id, addHostsAction).success (data) ->
                    wizardFactory.setCommitState(
                        "name": "sv_selection"
                        "state": "success"
                        "message": ""
                    )
                .error (response) ->
                     wizardFactory.setCommitState(
                        "name": "sv_selection"
                        "state": "error"
                        "message": response
                    )
                wizardFactory.setServers(selectedServers)
        globalCommit: ($scope, sendRequest) ->
            if !sendRequest
                return @wizardFactory.setCommitState({
                    "name": "os_global"
                    "state": "goToPreviousStep"
                    "message": ""
                })
            $scope.$emit "loading", true
            # osGlobalConfig = 
            #     "os_config": 
            #         "general": $scope.general
            #         "server_credentials": 
            #             "username": $scope.server_credentials.username  
            #             "password": $scope.server_credentials.password
            wizardFactory = @wizardFactory
            submitData =
                os_config: {}
            for mdata in $scope.metaData
                submitData.os_config[mdata.name] = $scope.os_global_config[mdata.name]

            # get rid of redundant field (ex: comfirm password should not be sent back to server)
            for category in $scope.metaData
                # console.log("category", category)
                for content in category.data
                    if content.datamatch
                        delete submitData.os_config[category.name][content.name]

            if $scope.generalForm.$valid
                @dataService.updateClusterConfig($scope.cluster.id, submitData).success (configData) ->
                    wizardFactory.setCommitState({
                        "name": "os_global"
                        "state": "success"
                        "message": ""
                    })
                .error (response) ->
                    wizardFactory.setCommitState({
                        "name": "os_global"
                        "state": "error"
                        "message": response
                    })
            else
                if $scope.generalForm.$error.required
                    message = "The required(*) fields can not be empty !"
                else if $scope.generalForm.$error.match
                    message = "The passwords do not match"

                @wizardFactory.setCommitState(
                    "name": "os_global",
                    "state": "invalid",
                    "message": message
                )
        addInterface: ($scope, newInterface) ->
            isExist = false
            if newInterface
                for key, value of $scope.interfaces
                    if key == newInterface.name
                        isExist = true
                        alert("This interface already exists. Please try another one")
                if !isExist
                    $scope.interfaces[newInterface.name] = 
                        "subnet_id": parseInt(newInterface.subnet_id)
                        "is_mgmt": false
                $scope.newInterface = {}

        networkCommit: ($scope, sendRequest) ->
            wizardFactory = @wizardFactory
            if !sendRequest
                return @wizardFactory.setCommitState(
                            "name": "network",
                            "state": "goToPreviousStep",
                            "message": ""
                        )

            $scope.$emit "loading", true
            # there must be at least one interface
            interfaceCount = Object.keys($scope.interfaces).length
            if interfaceCount == 0
                alert("Please add interface")
                return;

            hostnamePromises = []
            hostNetworkPromises = []

            for server in $scope.servers
                hostname = "name": server["hostname"]
                updateHostnamePromise = @dataService.putHost server.id, hostname
                hostnamePromises.push(updateHostnamePromise)

                for key, value of server.networks
                    network = 
                        "interface": key
                        "ip": value.ip
                        "subnet_id": parseInt($scope.interfaces[key].subnet_id)
                        "is_mgmt": $scope.interfaces[key].is_mgmt
                        "is_promiscuous": $scope.interfaces[key].is_promiscuous
                    if value.id == undefined
                        updateNetworkPromise = @dataService.postHostNetwork(server.id, network).success (networkData) ->
                            server.networks[networkData.interface].id = networkData.id
                    else 

                        updateNetworkPromise = @dataService.putHostNetwork(server.id, value.id, network)

                    hostNetworkPromises.push(updateNetworkPromise)
            @$q.all(hostnamePromises.concat(hostNetworkPromises)).then(() ->
                wizardFactory.setServers($scope.servers)
                wizardFactory.setCommitState(
                    "name": "network"
                    "state": "success"
                    "message": ""
                )
            (response)->
                wizardFactory.setCommitState(
                    "name": "network"
                    "state": "error"
                    "message": response.data
                )
            )
        partitionCommit: ($scope, sendRequest) ->
            wizardFactory = @wizardFactory
            if !sendRequest
                @wizardFactory.setCommitState(
                    "name": "partition"
                    "state": "goToPreviousStep"
                    "message": ""
                )
                return;
            $scope.$emit "loading", true
            if $scope.duplicated
                @wizardFactory.setCommitState(
                    "name": "partition"
                    "state": "invalid"
                    "message": "Mount Point cannot be the same"
                )
            else
                newPartition = {}
                for partitionInfo in $scope.partitionInforArray
                    newPartition[partitionInfo['name']] = {}
                    newPartition[partitionInfo['name']]['percentage'] = partitionInfo['percentage']
                    newPartition[partitionInfo['name']]['max_size'] = partitionInfo['max_size']

                @wizardFactory.setPartition(newPartition)

                os_partition = 
                    "os_config":
                        "partition": newPartition
                @dataService.updateClusterConfig($scope.cluster.id, os_partition).success (configData) ->
                    wizardFactory.setCommitState(
                        "name": "partition"
                        "state": "success"
                        "message": ""
                    )
                .error (response) ->
                    wizardFactory.setCommitState(
                        "name": "partition"
                        "state": "error"
                        "message": response
                    )

        addPartition: ($scope)->
            newRowExist = false
            newRowExist = true for partitionInfo in $scope.partitionInforArray when partitionInfo.name == ""
            if !newRowExist and !$scope.duplicated
                $scope.partitionInforArray.push(
                    "name": ""
                    "percentage": 0
                    "max_size": 0
                )
        mount_point_change: ($scope, index, name) ->
            duplicatedIndexContainer = []
            $scope.duplicatedIndexArray = []
            count = 0
            $scope.duplicated = false
            numberOfNames = 0

            for partitionInfo in $scope.partitionInforArray
                if partitionInfo.name == name
                    numberOfNames++
                    duplicatedIndexContainer.push(count)
                count++
            if numberOfNames > 1
                $scope.duplicated = true
                $scope.duplicatedIndexArray = duplicatedIndexContainer

        deletePartition: ($scope, index) ->
            emptyRowIndex = -1
            if $scope.partitionInforArray.length <= 2
                if $scope.partitionInforArray[0]['name'] == ""
                    emptyRowIndex = 0
                else if $scope.partitionInforArray[1]['name'] == ""
                    emptyRowIndex = 1

                $scope.partitionInforArray.splice index if emptyRowIndex == index or emptyRowIndex == -1
            else
                $scope.partitionInforArray.splice index, 1

            $scope.duplicated = false if $scope.duplicatedIndexArray.indexOf(index) >= 0

        targetSystemConfigCommit: ($scope, sendRequest) ->
            wizardFactory = @wizardFactory
            if !sendRequest
                wizardFactory.setCommitState(
                    "name": "package_config"
                    "state": "goToPreviousStep"
                    "message": ""
                )
                return;

            $scope.$emit "loading", true

            targetSysConfigData =
                "package_config": $scope.package_config

            console.log($scope.package_config)

            if $scope.packageConfigForm.$valid
                @dataService.updateClusterConfig($scope.cluster.id, targetSysConfigData).success (configData) ->
                    wizardFactory.setCommitState({
                        "name": "package_config"
                        "state": "success"
                        "message": ""
                    })
                .error (response) ->
                    wizardFactory.setCommitState({
                        "name": "package_config"
                        "state": "error"
                        "message": response
                    })
            else
                if $scope.packageConfigForm.$error.required
                    message = "The required(*) fields can not be empty !"
                else if $scope.packageConfigForm.$error.match
                    message = "The passwords do not match"

                @wizardFactory.setCommitState(
                    "name": "package_config",
                    "state": "invalid",
                    "message": message
                )
        # manually assign roles
        assignRole: ($scope, role) ->
            serverChecked = false
            serverChecked = true for server in $scope.servers when server.checked
            if !serverChecked
                alert("Please select at least one server")
            else
                server.roles.push(role) for server in $scope.servers when server.checked and !@checkRoleExist(server.roles, role)
             

        #check if the role is already in a server (can the drop area)
        checkRoleExist: (existingRoles, newRole) ->
            roleExist = false
            roleExist = true for existingRole in existingRoles when existingRole.name is newRole.name
            return roleExist
        #Make sure each each role can only appear once in a server(can't see drop area)
        checkExistRolesDrag: ($scope) ->
            for key, value of $scope.servers
                for server_role, server_role_key in $scope.servers[key].roles
                    $scope.existingRoles[key].splice(role_key, 1, "p") for role, role_key in $scope.roles when $scope.servers[key].roles[server_role_key].name == $scope.roles[role_key].name
                $scope.servers[key].dropChannel = $scope.existingRoles[key].toString()

        autoAssignRoles: ($scope)->
            svIndex = 0
            for newRole in $scope.roles
                i = 0
                loopStep = 0
                while i < newRole.count and loopStep < $scope.servers.length
                    svIndex = 0 if svIndex >= $scope.servers.length
                    roleExist = @checkRoleExist($scope.servers[svIndex].roles, newRole)
                    if !roleExist
                        $scope.servers[svIndex].roles.push(newRole)
                        i++
                        loopStep = 0
                    else
                        loopStep++
                    svIndex++

        roleAssignCommit: ($scope, sendRequest) ->
            wizardFactory = @wizardFactory
            if !sendRequest
                wizardFactory.setCommitState(
                    "name": "role_assign"
                    "state": "goToPreviousStep"
                    "message": ""
                )
            $scope.$emit "loading", true
            promises = []
            for server in $scope.servers
                roles = []
                roles.push(role.name) for role in server.roles
                data = "roles": roles
                updateRoles = @dataService.updateClusterHost($scope.cluster.id, server.id, data)
                promises.push(updateRoles)

            if $scope.ha_vip
                config = 
                    "package_config":
                        "ha_vip": $scope.ha_vip
                updateHAVIP = dataService.updateClusterConfig($scope.cluster.id, config)
                promises.push(updateHAVIP)

            @$q.all(promises).then( ->
                wizardFactory.setCommitState(
                    "name": "role_assign"
                    "state": "success"
                    "message": ""
                )
            (response) ->
                wizardFactory.setCommitState(
                    "name": "role_assign"
                    "state": "error"
                    "message": response.data
                )
            )
        networkMappingCommit: ($scope, sendRequest) ->
            wizardFactory = @wizardFactory
            if !sendRequest
                wizardFactory.setCommitState(
                    "name": "network_mapping"
                    "state": "goToPreviousStep"
                    "message": ""
                )
            $scope.$emit "loading", true
            networks = {}
            networks[key] = value.mapping_interface for key, value of $scope.networking
            network_mapping =
                "package_config":
                    "network_mapping": networks

            @dataService.updateClusterConfig($scope.cluster.id, network_mapping).success (data) ->
                wizardFactory.setNetworkMapping(networks)
                wizardFactory.setCommitState(
                    "name": "network_mapping"
                    "state": "success"
                    "message": ""
                )
            .error (response) ->
                wizardFactory.setCommitState(
                    "name": "network_mapping"
                    "state": "error"
                    "message": response
                )  
        reviewCommit: ($scope, sendRequest) ->
            if !sendRequest
                return @wizardFactory.setCommitState(
                    "name": "review"
                    "state": "goToPreviousStep"
                    "message": ""
                )
            dataService = @dataService
            wizardFactory = @wizardFactory
            reviewAction = 
                "review":
                    "hosts": []
            deployAction =
                "deploy": 
                    "hosts": []
            for server in $scope.servers
                reviewAction.review.hosts.push(server.id)
                deployAction.deploy.hosts.push(server.id)

            dataService.postClusterActions($scope.cluster.id, reviewAction).success (data) ->
                dataService.postClusterActions($scope.cluster.id, deployAction).success (data) ->
                    wizardFactory.setCommitState(
                        "name": "review"
                        "state": "success"
                        "message": ""
                    )
                .error (data) ->
                    console.warn("Deploy hosts error: ", data)
            .error (data) ->
                console.warn("Review hosts error: ", data)     

        deploy: ($scope) ->
            wizard_complete = true
            wizard_complete = false for step in $scope.steps when step.name !="review" and step.state != "complete"
            
            if wizard_complete
                @wizardFactory.setCommitState(
                    "name": "review"
                    "state": "triggered"
                    "message": ""
                    "sendRequest": true
                )
        displayDataInTable: ($scope, data) ->
            ipAddressPre = @ipAddressPre
            $filter = @$filter
            $scope.tableParams = new @ngTableParams({
                page: 1
                count: data.length+1
            }, {
                counts: []
                total: data.length
                getData: ($defer, params)-> 
                    reverse = false
                    orderBy = params.orderBy()[0]
                    orderBySort = ""
                    orderByColumn = ""
                    orderedData = {}
                    if orderBy
                        orderByColumn = orderBy.substring(1)
                        orderBySort = orderBy.substring(0, 1)
                        if orderBySort is "+" then reverse = true else reverse = false

                    if orderedData = params.sorting()

                       orderedData = $filter('orderBy')(data, (item) ->
                            if orderByColumn is "switch_ip"
                                return ipAddressPre(item.switch_ip)
                            else
                                return item[orderByColumn]

                        , reverse)
                    else
                        orderedData = data

                    $scope.servers = orderedData
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()))
            })
        getSwitchById: (id)->
            return @dataService.getSwitchById(id)

        getSwitchMachines: (id)->
            return @dataService.getSwitchMachines(id)

        postSwitchAction: (id, action)->
            return @dataService.postSwitchAction(id, action)
        putSwitches: (id, sw) ->
            return @dataService.putSwitches(id, sw)
        buildOsGlobalConfigByMetaData: ($scope) ->
            @dataService.getOsGlobalConfigMetaData($scope.cluster.os_id).success (data) ->
                $scope.metaData = data.os_global_config
                for key, values of data
                    for category in values
                        if $scope.os_global_config[category.name]
                            $scope[key][category.name]= $scope.os_global_config[category.name] 
                        else
                            $scope[key][category.name] = {}
                        for content in category.data
                            if content.default_value and !$scope.os_global_config[category.name][content.name]
                                $scope.os_global_config[category.name][content.name] = content.default_value

                            if content.display_type is "multitext"
                                if $scope.os_global_config[category.name][content.name]
                                    $scope[key][category.name][content.name] = $scope.os_global_config[category.name][content.name]
                                else
                                    $scope[key][category.name][content.name] = [""]
        copyWithHashKey: (target, source) ->
            index = 0
            for s in source
                target[index]["$$hashKey"] = source[index]["$$hashKey"]
                index++
        getDataService: ()->
            @dataService

        addUploadSwitches: ($scope, allSwitches, allMachines) ->
            $scope.switchLoading = true
            addUploadMachines = @addUploadMachines
            dataService = @dataService
            switches =$scope.switchFile.split("\n")
            postData = []
            for s in switches
                componets = s.split(',')
                temp = {}
                temp.credentials = {}
                temp.ip = componets[0] if componets[0]
                temp.vendor = componets[1] if componets[1]
                temp.credentials.version = componets[2] if componets[2]
                temp.credentials.community = componets[3] if componets[3]
                postData.push(temp)
            dataService.uploadSwitches(postData).success (data) ->
                $scope.uploadSwitchesReturn = data #show in the template
                for s in data.switches
                    allSwitches.push(s)
                $scope.switchLoading = false
                if $scope.machineFile
                    addUploadMachines($scope, allMachines, dataService)
        addUploadMachines: ($scope, allMachines, dataService) ->
            $scope.machineLoading = true
            machines = $scope.machineFile.split("\n")
            postData = []
            for m in machines
                componets = m.split(',')
                temp = {}
                temp.mac = componets[0] if componets[0]
                temp.port = componets[1] if componets[1]
                temp.switch_ip = componets[2] if componets[2]
                postData.push(temp)
            dataService.uploadMachines(postData).success (data) ->
                $scope.uploadMachinesReturn = data
                for m in data.switches_machines
                    temp = {}
                    temp.id = m.machine_id
                    temp.mac = m.mac
                    temp.port = m.port
                    temp.switch_ip = m.switch_ip
                    temp.vlan = m.vlan
                    allMachines.push(temp)
                $scope.machineLoading = false
        readDataFromFile: ($scope, selector, target) ->
            selectedFile = $(selector).get(0).files[0]
            if selectedFile
                reader = new FileReader()
                reader.readAsText(selectedFile, "UTF-8")
                reader.onload = (e) ->
                    $scope[target] = reader.result

        addSingMachine: ($scope, $modalInstance, allMachines) ->
            request = {}
            request.mac = $scope.newMac
            request.port = "0"
            @dataService.postSigleMachine($scope.selected_switch.id, request).success (data) ->
                data.switch_ip = $scope.selected_switch.ip
                allMachines.push(data)
                $modalInstance.dismiss('ok')



    angular.module('compass.services').service 'wizardService',[
        'dataService'
        '$state'
        'wizardFactory'
        '$filter'
        '$q'
        'ngTableParams'
        '$modal'
        (dataService, $state, wizardFactory, $filter, $q, ngTableParams, $modal) -> new WizardService(dataService, $state, wizardFactory, $filter, $q, ngTableParams, $modal)
    ]
)
