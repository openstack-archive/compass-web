(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('userSettingCtrl', [
      '$scope', '$state', '$filter', '$modal', 'clusterService', 'userService', 'userSettingData', 'userLogData', function($scope, $state, $filter, $modal, clusterService, userService, userSettingData, userLogData) {
        $scope.userSetting = userSettingData;
        clusterService.displayDataInTable($scope, userSettingData);
        clusterService.displayDataInTable($scope, userLogData, 'userParams');
        $scope.newUser = {};
        $scope.edit = function() {
          return alert("Edit User?");
        };
        $scope["delete"] = function() {
          return alert("Delete User?");
        };
        return $scope.open = function(size) {
          var modalInstance;
          modalInstance = $modal.open({
            templateUrl: 'src/app/partials/modalCreateUserSetting.html',
            controller: 'userModalCtrl',
            resolve: {
              newUser: function() {
                return $scope.newUser;
              }
            }
          });
          return modalInstance.result.then(function(newUser) {
            $scope.newUser = newUser;
            userService.createUser(newUser).success(function(data, status) {
              $scope.userSetting.push(newUser);
              return $scope.tableParams.reload();
            });
            return $scope.newUser = {};
          }, function() {
            return console.log("dismiss");
          });
        };
      }
    ]).filter('timeStampFilter', function() {
      return function(items, dateRange) {
        var endDate, filtered, item, standardTime, startDate, _i, _len;
        if (items !== void 0) {
          filtered = [];
          startDate = dateRange.startDate;
          endDate = dateRange.endDate;
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            standardTime = moment(item.timestamp);
            if (moment(standardTime).isAfter(startDate) && moment(standardTime).isBefore(endDate)) {
              filtered.push(item);
            }
          }
          return filtered;
        }
      };
    });
  });

}).call(this);
