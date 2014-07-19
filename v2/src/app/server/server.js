angular.module('compass.server', [
    'ui.router',
    'ui.bootstrap',
    'compass.charts',
    'ngTable',
])

.config(function config($stateProvider) {
    $stateProvider
        .state('serverList', {
            url: '/serverlist',
            controller: 'serverCtrl',
            templateUrl: 'src/app/server/server-list.tpl.html',
            authenticate: true
        });
})

.controller('serverCtrl', function($scope, dataService, $filter, ngTableParams, sortingService) {
    $scope.hideunselected = '';
    $scope.search = {};
    $scope.allservers = [];
    $scope.newFoundServers = [];

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.machines_hosts;
    });

    dataService.getAllMachineHosts().success(function(data) {
        $scope.allservers = data;

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.allservers.length // count per page       
        }, {
            counts: [], // hide count-per-page box
            total: $scope.allservers.length, // length of data
            getData: function($defer, params) {
                var reverse = false;
                var orderBy = params.orderBy()[0];
                var orderBySort = "";
                var orderByColumn = "";

                if (orderBy) {
                    orderByColumn = orderBy.substring(1);
                    orderBySort = orderBy.substring(0, 1);
                    if (orderBySort == "+") {
                        reverse = false;
                    } else {
                        reverse = true;
                    }
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.allservers, function(item) {
                        if (orderByColumn == "switch_ip") {
                            return sortingService.ipAddressPre(item.switch_ip);
                        } else {
                            return item[orderByColumn];
                        }
                    }, reverse) : $scope.allservers;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.selectAllServers = function(flag) {
        if (flag) {
            angular.forEach($scope.allservers, function(sv) {
                sv.selected = true;
            })
        } else {
            angular.forEach($scope.allservers, function(sv) {
                sv.selected = false;
            })
        }
    };

    $scope.hideUnselected = function() {
        if ($scope.hideunselected) {
            $scope.search.selected = true;
        } else {
            delete $scope.search.selected;
        }
    };

    $scope.reloadServers = function() {
        dataService.getAllMachineHosts().success(function(data) {
            $scope.allservers = data;
            $scope.tableParams.$params.count = $scope.allservers.length;
            $scope.tableParams.reload();
        });
    };

    $scope.commit = function() {
        var selectedServers = [];
        var noSelection = true;
        angular.forEach($scope.allservers, function(sv) {
            if (sv.selected) {
                noSelection = false;
                selectedServers.push(sv);
            }
        })
        if (noSelection) {
            alert("Please select at least one server");
            wizardFactory.setCommitState({});
        } else {
            wizardFactory.setServers(selectedServers);
            wizardFactory.setAllMachinesHost($scope.allservers);

            var commitState = {
                "name": "sv_selection",
                "state": "success",
                "message": ""
            };
            wizardFactory.setCommitState(commitState);
        }
    };

})

.controller('findNewServersCtrl', function($scope, dataService, sortingService, $timeout, $modal, $filter, ngTableParams) {
    $scope.switches = [];
    $scope.newFoundServers = [];
    $scope.findingNewServers = false;
    var switchTimer;
    var fireTimer = true;

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.machines;
    });

    var getSwitches = function() {
        dataService.getSwitches().success(function(data) {
            $scope.switches = data;
            //if (fireTimer) {
            //    switchTimer = $timeout(getSwitches, 10000);
            //}
        })
    };

    getSwitches();
    /*
    $scope.$on('$destroy', function() {
        fireTimer = false;
        $timeout.cancel(switchTimer);
    });
    */
    $scope.selectAllSwitches = function(flag) {
        if (flag) {
            angular.forEach($scope.switches, function(sv) {
                sv.selected = true;
            })
        } else {
            angular.forEach($scope.switches, function(sv) {
                sv.selected = false;
            })
        }
    };

    $scope.open = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'addSwitchModal.html',
            controller: addSwitchCtrl
        });
        modalInstance.result.then(function(newswitch) {
            $scope.switches.push(newswitch);
        }, function() {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.findServers = function() {
        var swSelection = false;
        angular.forEach($scope.switches, function(sw) {
            if (sw.selected) {
                swSelection = true;
            }
        });
        if (!swSelection) {
            alert("Please select at least one switch")
        } else {
            $scope.findingNewServers = true;
            $scope.newFoundServers = [];
            angular.forEach($scope.switches, function(sw) {
                if (sw.selected) {
                    sw.result = "";
                    sw.polling = true;
                }
            });
        }
    };

    //var data = clusters;
    $scope.tableParamsNewServer = new ngTableParams({
        page: 1, // show first page
        count: $scope.newFoundServers.length, // count per page
    }, {
        counts: [], // hide count-per-page box
        total: $scope.newFoundServers.length, // length of data
        getData: function($defer, params) {
            var reverse = false;
            var orderBy = params.orderBy()[0];
            var orderBySort = "";
            var orderByColumn = "";

            if (orderBy) {
                orderByColumn = orderBy.substring(1);
                orderBySort = orderBy.substring(0, 1);
                if (orderBySort == "+") {
                    reverse = false;
                } else {
                    reverse = true;
                }
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')($scope.newFoundServers, function(item) {
                    if (orderByColumn == "switch_ip") {
                        return sortingService.ipAddressPre(item.switch_ip);
                    } else {
                        return item[orderByColumn];
                    }
                }, reverse) : $scope.newFoundServers;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });


    $scope.$watch('switches', function(val) {
        var totalResultReady = true;
        if ($scope.findingNewServers) {
            angular.forEach($scope.switches, function(sw) {
                if (sw.selected) {
                    if (sw.result == "success") {
                        $scope.newFoundServers = $scope.newFoundServers.concat(angular.copy(sw.machines));
                        sw.result = "finished";

                        if ($scope.tableParamsNewServer) {
                            $scope.tableParamsNewServer.$params.count = $scope.newFoundServers.length;
                            $scope.tableParamsNewServer.reload();
                        }

                    } else if (sw.result == "finished") {

                    } else {
                        totalResultReady = false;
                    }
                }
            });
            if (totalResultReady) {
                $scope.findingNewServers = false;
            }
        }

    }, true)
})

var addSwitchCtrl = function($scope, $modalInstance, dataService) {
    $scope.newswitch = {}
    $scope.newswitch.credentials = {};
    $scope.filters = {};

    $scope.addSwitch = function() {
        dataService.postSwitches($scope.newswitch).success(function(switchData) {

            if ($scope.filters) {
                var filters = {
                    "filters": $scope.filters
                };
                dataService.putSwitchFilters(switchData.id, filters).success(function(filterData) {
                    switchData.filters = filterData.filters;
                    $scope.newswitch = {};
                    $scope.filters = {};
                    $modalInstance.close(switchData);
                })
            }
        })
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
