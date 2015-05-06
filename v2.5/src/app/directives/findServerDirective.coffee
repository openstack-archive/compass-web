define(['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'findservers', ['wizardService','$modal', (wizardService, $modal) ->
        return {
            restrict: 'E'
            scope: {
                newFoundServers: '=results'
                switches: '='
            }
            templateUrl: "src/app/partials/find-new-servers.tpl.html"

            link: (scope, element, attrs) ->
                # scope.switches = []
                scope.newFoundServers = []
                scope.isFindingNewServers = false
                wizardService.getSwitches().success (data) ->
                    scope.switches = data

                scope.findServers = ->
                    swSelection  = false
                    swSelection = true for sw in scope.switches when sw.selected
                    triggerToFindServers = (sw) ->
                        sw.result = ""
                        sw.finished = false
                        sw.polling = true

                    if !swSelection
                        alert("Please select at least one switch") if !swSelection
                    else
                        scope.isFindingNewServers = true
                        scope.newfoundServers = []
                        triggerToFindServers sw for sw in scope.switches when sw.selected

                scope.$watch('switches', (val) ->
                    totalResultReady = true
                    if scope.isFindingNewServers
                        for sw in scope.switches
                            if sw.selected and !sw.finished
                                if sw.result is "success"
                                    scope.newFoundServers = scope.newFoundServers.concat(angular.copy(sw.machines))
                                    sw.finished = true
                                else if sw.result == "error"
                                    sw.finished = true
                                else
                                    totalResultReady = false
                        scope.isFindingNewServers = false if totalResultReady
                ,true)
              
                scope.newswitch = {}
                scope.newswitch.credentials = {}
                scope.alerts = []

                scope.addSwitch = ->
                    wizardService.postSwitches(scope.newswitch).success (switchData) ->
                        scope.switches.push(switchData)

                scope.modifySwitchModal = (index) ->
                    modalInstance = $modal.open(
                        templateUrl: 'src/app/partials/modalModifySwitch.html'
                        controller: 'modifySwitchModalCtrl'
                        resolve:
                            targetSwitch: ->
                                return scope.switches[index]
                    )
                    modalInstance.result.then (targetSwitch) ->
                        scope.switches[index] = targetSwitch
                    , ->
                        console.log("Modal dismissed")
        }
    ]
    .directive 'switchrow', ['wizardService', '$timeout', (wizardService, $timeout) ->
        return {
            restrict: 'A'
            scope:
                polling: '='
                switchinfo: '='
                result: '='
                machines: '='
            link: (scope, element, attrs) ->
                checkSwitchCount = 0
                fireTimer = true
                getMachines = ->
                    wizardService.getSwitchMachines(scope.switchinfo.id).success (data) ->
                        scope.polling = false
                        scope.result = "success"
                        scope.machines = data
                    .error (data)->
                        scope.polling = false
                        scope.result = "error"

                checkSwitchState = ->
                    checkSwitchCount++
                    wizardService.getSwitchById(scope.switchinfo.id).success (data) ->
                        if data.state is "under_monitoring"
                            getMachines()
                        else if data.state is "initialized" or data.state is "repolling"
                            if fireTimer and checkSwitchCount < 15
                                checkSwitchTimer = $timeout(checkSwitchState, 2000)
                            else
                                scope.polling = false
                                scope.result = "error" 


                scope.$watch 'polling', (newval, oldval) ->
                   if newval is not oldval
                        if newval is true
                            checkSwitchCount = 0
                            wizardService.postSwitchAction(scope.switchinfo.id, {"find_machines": null}).success (data) ->
                                checkSwitchState()

        }
    ]
)