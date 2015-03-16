define(['./baseController'], ()-> 
    'use strict';

    angular.module('compass.controllers')
        .controller 'modifySwitchModalCtrl', ['$scope','$modalInstance','wizardService', 'targetSwitch', ($scope, $modalInstance, wizardService, targetSwitch) ->
            $scope.targetSwitch = angular.copy(targetSwitch)
            $scope.ok = ->
                $scope.alerts = []
                updatedSwitch = 
                    ip : $scope.targetSwitch.ip
                    filters: $scope.targetSwitch.filters
                    credentials: $scope.targetSwitch.credentials
                wizardService.putSwitches(targetSwitch.id, updatedSwitch).success (data) ->
                    $modalInstance.close(data)
                .error (response)->
                    $scope.alerts[0] = response

            $scope.cancel = ->
                $modalInstance.dismiss('cancel')
        ]
        .controller 'addSubnetModalInstanceCtrl',['$scope','$modalInstance','wizardService','subnets',
            ($scope, $modalInstance, wizardService, subnets) ->
                $scope.subnetworks = angular.copy(subnets)
                $scope.subnetAllValid = true

                subnet['valid'] = true for subnet in $scope.subnetworks

                if $scope.subnetworks.length is 0
                    $scope.subnetworks.push({valid:false})

                $scope.addSubnetwork = ->
                    $scope.subnetworks.push({valid:false})
                    wizardService.validateAllSubnets($scope)

                $scope.removeSubnetwork = (index) ->
                    wizardService.deleteSubnet($scope, index, $scope.subnetworks[index].id)
                    wizardService.validateAllSubnets($scope)

                $scope.subnet_change = (index, subnet) ->
                    subnetRegExp = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}(\/){1}([0-9]|[0-2][0-9]|3[0-2])$/
                    $scope.subnetworks[index]['valid'] = subnetRegExp.test(subnet)
                    wizardService.validateAllSubnets($scope)

                $scope.ok = ->
                    wizardService.subnetCommit($scope, $modalInstance)

                $scope.cancel = ->
                    $modalInstance.dismiss('cancel')
        ]
        .controller 'errorMessageCtrl', ['$scope','$modalInstance','title', 'content', ($scope, $modalInstance, title, content) ->
            $scope.title = title
            $scope.content = content

            $scope.cancel = ->
                $modalInstance.dismiss('cancel')
        ]
        .controller 'userModalCtrl', ['$scope', '$modalInstance','newUser', ($scope, $modalInstance, newUser) ->
            $scope.newUser = newUser

            $scope.ok = ->
                $scope.result = 'ok'
                $modalInstance.close($scope.newUser)
            
            $scope.cancel = ->
                $modalInstance.dismiss('cancel')
        ]
        .controller 'reportErrorCtrl', ['$scope', '$modalInstance', 'detail', ($scope, $modalInstance, detail)->
            $scope.detail = detail
            $scope.cancel = ->
                $modalInstance.dismiss('cancel')
            console.log($scope.detail)
        ]
);