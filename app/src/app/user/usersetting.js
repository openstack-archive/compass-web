define(['ngBsDaterangepicker', 'uiRouter', 'uiBootstrap', 'angularTable'], function() {
    'use strict';

    var userSettingModule = angular.module('compass.userSetting', [
        'ui.router',
        'ui.bootstrap',
        'ngTable',
        'ngBootstrap'
    ]);

    userSettingModule.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('userSetting', {
                url: '/userSetting',
                controller: 'userSettingCtrl',
                templateUrl: 'src/app/user/user-setting.html',
                authenticate: true,
                resolve: {
                    userSettingData: function($q, dataService) {
                        var deferred = $q.defer();
                        dataService.getUserSetting().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    userLogData: function($q, dataService) {
                        var deferred = $q.defer();
                        dataService.getUserLog().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            });

    });

    userSettingModule.controller('userSettingCtrl', function($scope, $state, ngTableParams, $filter, dataService, userSettingData, $modal) {
        $scope.userSetting = userSettingData;
        var data = userSettingData;
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        }, {
            total: data.length,
            getData: function($defer, params) {
                var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.edit = function() {
            alert("Edit User?")
        };
        $scope.delete = function() {
            alert("Delete User?")
        };


        $scope.newUser = {};
        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: 'userSettingModal.html',
                controller: UserModalCtrl,
                resolve: {
                    newUser: function() {
                        return $scope.newUser;
                    }
                }
            });
            modalInstance.result.then(function(newUser) {
                $scope.newUser = newUser;
                dataService.createUser(newUser).success(function(data, status) {
                    $scope.userSetting.push(newUser);
                    $scope.tableParams.reload();
                });

                $scope.newUser = {};
            }, function() {
                // modal cancelled
            });
        };
        dataService.getUserLog().success(function(data) {
            $scope.userParams = new ngTableParams({
                page: 1,
                count: 10,
            }, {
                total: data.length,
                getData: function($defer, params) {
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    });

    userSettingModule.directive('match', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    });

    userSettingModule.filter('timeStampFilter', function() {
        return function(items, dateRange) {
            if (items !== undefined) {
                var filtered = [];
                var startDate = dateRange.startDate;
                var endDate = dateRange.endDate;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var standardTime = moment(item.timestamp);
                    if (moment(standardTime).isAfter(startDate) && moment(standardTime).isBefore(endDate)) {
                        filtered.push(item);
                    }
                }
                return filtered;
            }
        };
    });

    var UserModalCtrl = function($scope, $modalInstance, newUser) {
        $scope.newUser = newUser;

        $scope.ok = function() {
            $scope.result = 'ok';
            $modalInstance.close($scope.newUser);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.result = 'cancel';
        };
    };
});