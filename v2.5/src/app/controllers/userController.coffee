define(['./baseController'], ()-> 
    'use strict';

    angular.module('compass.controllers')
        .controller 'userSettingCtrl', ['$scope', '$state', '$filter','$modal','clusterService','userService', 'userSettingData', 'userLogData'
            ($scope, $state, $filter, $modal, clusterService, userService, userSettingData, userLogData) ->
                $scope.userSetting = userSettingData
                clusterService.displayDataInTable($scope, userSettingData)
                clusterService.displayDataInTable($scope, userLogData, 'userParams')
                $scope.newUser = {}

                $scope.edit = ->
                    alert("Edit User?")

                $scope.delete = ->
                    alert("Delete User?")

                $scope.open = (size) ->
                    modalInstance = $modal.open(
                        templateUrl: 'src/app/partials/modalCreateUserSetting.html'
                        controller: 'userModalCtrl'
                        resolve:
                            newUser: ->
                                return $scope.newUser
                    )
                    modalInstance.result.then( (newUser) ->
                        $scope.newUser = newUser
                        userService.createUser(newUser).success (data, status) ->
                            $scope.userSetting.push(newUser)
                            $scope.tableParams.reload()

                        $scope.newUser = {}
                    , ->
                        console.log("dismiss")
                    )
        ]
        .filter 'timeStampFilter', ->
            return (items, dateRange) ->
                if items != undefined
                    filtered = []
                    startDate = dateRange.startDate
                    endDate = dateRange.endDate
                    for item in items
                        standardTime = moment(item.timestamp)
                        filtered.push(item) if moment(standardTime).isAfter(startDate) and moment(standardTime).isBefore(endDate)
                    return filtered
)