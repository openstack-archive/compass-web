define(['uiRouter', 'uiBootstrap', 'angularTable'], function() {
    var serverModule = angular.module('compass.server', [
        'ui.router',
        'ui.bootstrap',
        'compass.charts',
        'compass.findservers',
        'ngTable'
    ]);

    serverModule.config(function config($stateProvider) {
        $stateProvider
            .state('serverList', {
                url: '/serverlist',
                controller: 'serverCtrl',
                templateUrl: 'src/app/server/server-list.tpl.html',
                authenticate: true,
                resolve: {
                    machinesHostsData: function($q, dataService) {
                        var deferred = $q.defer();
                        dataService.getAllMachineHosts().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            });
    });

    serverModule.controller('serverCtrl', function($scope, dataService, $filter, ngTableParams, sortingService, machinesHostsData) {
        $scope.hideunselected = '';
        $scope.search = {};
        $scope.allservers = machinesHostsData;
        $scope.foundResults = [];

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.machines_hosts;
        });

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.allservers.length + 1 // count per page
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

        // add newly found servers at the top if allservers array
        $scope.$watch('foundResults', function(newResults, oldResults) {
            if (newResults != oldResults) {
                for (var i = 0; i < newResults.length; i++) {
                    var sv = $filter('filter')($scope.allservers, newResults[i].mac, true);
                    if (sv.length == 0) {
                        newResults[i].machine_id = newResults[i].id;
                        delete newResults[i]['id'];
                        newResults[i].new = true;
                        $scope.allservers.unshift(newResults[i]);
                    }
                }

                if ($scope.tableParams) {
                    $scope.tableParams.$params.count = $scope.allservers.length;
                    $scope.tableParams.reload();
                }
            }
        }, true);

    });
});