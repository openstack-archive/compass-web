define(['./baseController'], ()-> 
  'use strict';

  angular.module('compass.controllers')
    .controller 'wizardCtrl',['$scope', 'wizardService', '$state', '$stateParams', 'clusterData', 'adaptersData', 'machinesHostsData', 'wizardStepsData', 'clusterConfigData',
        ($scope, wizardService, $state, $stateParams, clusterData, adaptersData, machinesHostsData, wizardStepsData, clusterConfigData) ->

            wizardService.wizardInit($scope, $stateParams.id, clusterData, adaptersData, wizardStepsData, machinesHostsData, clusterConfigData)

            $scope.skipForward = (nextStepId) ->
                console.log("next", nextStepId)
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
    .controller 'svSelectCtrl', ['$scope', 'wizardService', '$filter', 'ngTableParams'
        ($scope, wizardService, $filter, ngTableParams) ->
            $scope.hideunselected = ''
            $scope.search = {}
            $scope.cluster = wizardService.getClusterInfo()
            $scope.allservers = wizardService.getAllMachinesHost()
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

            #watch and add newly found servers to allservers array
            wizardService.watchAndAddNewServers($scope)

            $scope.commit = (sendRequest) ->
                wizardService.svSelectonCommit($scope)       
    ]
    .controller 'globalCtrl', ['$scope', 'wizardService', '$q',
        ($scope, wizardService, $q) ->

            wizardService.globalConfigInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.addValue = (key) ->
                $scope.general[key].push("")

            $scope.commit = (sendRequest) ->
                wizardService.globalCommit($scope,sendRequest)
    ]
    .controller 'networkCtrl', ['$scope', 'wizardService', 'ngTableParams', '$filter', '$modal', '$timeout'
        ($scope, wizardService, ngTableParams, $filter, $modal, $timeout) ->

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
                wizardService.networkCommit($scope, sendRequest)

            # display data in the table
            wizardService.getClusterHosts($scope.cluster.id).success (data) ->
                $scope.servers = data
                if $scope.servers[0].networks and Object.keys($scope.servers[0].networks).length != 0
                    $scope.interfaces = $scope.servers[0].networks
                    wizardService.setInterfaces($scope.interfaces)

                wizardService.displayDataInTable($scope, $scope.servers)
    ]
    .directive 'ngKeypress', [->
        return (scope, element, attrs) ->
            element.bind "keydown keypress", (event)->
                if event.which is 9
                    current = attrs.position
                    result = current.split('_')
                    next = result[0]+"_"+(parseInt(result[1])+1)
                    if $("input[data-position=" + next + "]").length
                        $("input[data-position=" + next + "]").focus()
                    else
                        $(".btn-next").focus()
                   event.preventDefault();
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

            $scope.commit = (sendRequest)->
                wizardService.roleAssignCommit($scope, sendRequest)


            wizardService.displayDataInTable($scope, $scope.servers)
    ]
    .controller 'networkMappingCtrl', ['$scope', 'wizardService',
        ($scope, wizardService) ->
            wizardService.networkMappingInit($scope)
            wizardService.watchingTriggeredStep($scope)

            $scope.onDrop = ($event, key) ->
                $scope.pendingInterface = key

            $scope.dropSuccessHandler = ($event, key, dict) ->
                dict[key].mapping_interface = $scope.pendingInterface

            $scope.commit = (sendRequest) ->
                wizardService.networkMappingCommit($scope, sendRequest)
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
                wizardService.reviewCommit(sendRequest)

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
