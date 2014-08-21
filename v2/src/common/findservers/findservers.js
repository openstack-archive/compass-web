angular.module('compass.findservers', [])


.directive('switchrow', function(dataService, $timeout) {
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
                    } else if(data.state === "initialized" || data.state === "repolling")
                        if (fireTimer && checkSwitchCount < 15) {
                            checkSwitchTimer = $timeout(checkSwitchState, 2000);
                        } else {
                            scope.polling = false;
                            scope.result = "error";
                        }
                    else {
                        scope.polling = false;
                        scope.result = "error";
                    }
                })
            };

            scope.$watch('polling', function(newval, oldval) {
                if(newval != oldval) {
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
})

.directive('findservers', function(dataService, $modal) {
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
            scope.filters = {};

            scope.addSwitch = function() {
                dataService.postSwitches(scope.newswitch).success(function(switchData) {

                    if (scope.filters) {
                        var filters = {
                            "filters": scope.filters
                        };
                        dataService.putSwitchFilters(switchData.id, filters).success(function(filterData) {
                            switchData.filters = filterData.filters;
                            scope.newswitch = {};
                            scope.filters = {};
                            scope.switches.push(switchData);
                        })
                    }
                })
            };
        }
    };
})