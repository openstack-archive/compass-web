define(['angular'], function() {
    var findserversModule = angular.module('compass.findservers', []);
    findserversModule.directive('switchrow', function(dataService, $timeout) {
        return {
            restrict: 'A',
            scope: {
                polling: '=',
                switchinfo: '=',
                result: '=',
                machines: '='
            },
            link: function(scope, element, attrs) {
                var checkSwitchTimer;
                var checkSwitchCount = 0;
                //var pollingTriggered = scope.polling;
                var fireTimer = true;

                var getMachines = function() {
                    dataService.getSwitchMachines(scope.switchinfo.id).success(function(data) {
                        scope.polling = false;
                        scope.result = "success";
                        scope.machines = data;
                    }).error(function(data) {
                        scope.polling = false;
                        scope.result = "error";
                    })
                };

                // check switch state 15 times with the interval of 2 sec
                var checkSwitchState = function() {
                    checkSwitchCount++;
                    dataService.getSwitchById(scope.switchinfo.id).success(function(data) {
                        if (data.state == "under_monitoring") {
                            getMachines();
                        } else if (data.state === "initialized" || data.state === "repolling")
                            if (fireTimer && checkSwitchCount < 15) {
                                checkSwitchTimer = $timeout(checkSwitchState, 2000);
                            } else {
                                scope.polling = false;
                                scope.result = "error";
                            } else {
                            scope.polling = false;
                            scope.result = "error";
                        }
                    })
                };

                scope.$watch('polling', function(newval, oldval) {
                    if (newval != oldval) {
                        if (newval == true) {
                            checkSwitchCount = 0;
                            fireTimer = true;

                            var findingAction = {
                                "find_machines": null
                            };
                            dataService.postSwitchAction(scope.switchinfo.id, findingAction).success(function(data) {
                                checkSwitchState();
                            })
                        }
                    }
                })

                element.bind('$destroy', function() {
                    fireTimer = false;
                    $timeout.cancel(checkSwitchTimer);
                });
            }
        }
    });

    findserversModule.directive('findservers', function(dataService, $modal, $log) {
        return {
            restrict: 'E',
            scope: {
                newFoundServers: '=results'
            },
            templateUrl: "src/common/findservers/find-new-servers.tpl.html",
            link: function(scope, element, attrs) {
                scope.switches = [];
                scope.newFoundServers = [];
                scope.isFindingNewServers = false;

                dataService.getSwitches().success(function(data) {
                    scope.switches = data;
                });

                scope.modifySwitchModal = function(index) {
                    var modalInstance = $modal.open({
                        templateUrl: 'modifySwitchModal.html',
                        controller: modifySwitchModalInstanceCtrl,
                        resolve: {
                            targetSwitch: function() {
                                return scope.switches[index];
                            }
                        }
                    });

                    modalInstance.result.then(function(targetSwitch) {
                        scope.switches[index] = angular.copy(targetSwitch);
                    }, function() {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                scope.selectAllSwitches = function(flag) {
                    if (flag) {
                        angular.forEach(scope.switches, function(sv) {
                            sv.selected = true;
                        })
                    } else {
                        angular.forEach(scope.switches, function(sv) {
                            sv.selected = false;
                        })
                    }
                };

                scope.findServers = function() {
                    var swSelection = false;
                    angular.forEach(scope.switches, function(sw) {
                        if (sw.selected) {
                            swSelection = true;
                        }
                    });
                    if (!swSelection) {
                        alert("Please select at least one switch");
                    } else {
                        scope.isFindingNewServers = true;
                        scope.newFoundServers = [];
                        angular.forEach(scope.switches, function(sw) {
                            if (sw.selected) {
                                sw.result = "";
                                sw.finished = false;
                                sw.polling = true;
                            }
                        });
                    }
                };

                scope.$watch('switches', function(val) {
                    var totalResultReady = true;
                    if (scope.isFindingNewServers) {
                        angular.forEach(scope.switches, function(sw) {
                            if (sw.selected && !sw.finished) {
                                if (sw.result == "success") {
                                    scope.newFoundServers = scope.newFoundServers.concat(angular.copy(sw.machines));
                                    sw.finished = true;
                                } else if (sw.result == "error") {
                                    sw.finished = true;
                                } else {
                                    totalResultReady = false;
                                }
                            }
                        });
                        if (totalResultReady) {
                            scope.isFindingNewServers = false;
                        }
                    }
                }, true);


                scope.newswitch = {}
                scope.newswitch.credentials = {};
                scope.alerts = [];

                scope.addSwitch = function() {
                    scope.alerts = [];
                    dataService.postSwitches(scope.newswitch).success(function(switchData) {

                        scope.newswitch = {};


                        scope.switches.push(switchData);

                    }).error(function(response) {
                        scope.alerts[0] = response;
                    });
                };

                scope.closeAlert = function() {
                    scope.alerts = [];
                };
            }
        };
    });

    var modifySwitchModalInstanceCtrl = function($scope, $modalInstance, dataService, targetSwitch) {
        $scope.targetSwitch = angular.copy(targetSwitch);

        $scope.ok = function() {
            $scope.alerts = [];
            var updatedSwitch = {
                "ip": $scope.targetSwitch.ip,
                "filters": $scope.targetSwitch.filters,
                "credentials": $scope.targetSwitch.credentials
            };

            dataService.putSwitches(targetSwitch.id, updatedSwitch).success(function(data) {
                $modalInstance.close(data);
            }).error(function(response) {
                $scope.alerts[0] = response;
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
});