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
            templateUrl: 'src/app/server/server-list.tpl.html'
        });
})

.controller('serverCtrl', function($scope, ngTableParams, wizardFactory, dataService, $filter, ngTableParams) {
    $scope.hideunselected = '';
    $scope.search = {};

    dataService.getAllMachineHosts().success(function(data) {
        $scope.allservers = data;
        //wizardFactory.setAllMachinesHost(data);

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.allservers.length // count per page       
        }, {
            counts: [], // hide count-per-page box
            total: $scope.allservers.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.allservers, params.orderBy()) : $scope.allservers;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });


    });

    //$scope.allservers = wizardFactory.getAllMachinesHost();

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

    //servers = []
    dataService.getServerColumns().success(function(data) {
        //clusters = data;
        $scope.server_columns = data.showall;
    });

    $scope.hideUnselected = function() {
        if ($scope.hideunselected) {
            $scope.search.selected = true;
        } else {
            delete $scope.search.selected;
        }
    };



    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        if (newCommitState !== undefined) {
            if (newCommitState.name == "sv_selection" && newCommitState.state == "triggered") {
                $scope.commit();
            }
        }
    });

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
