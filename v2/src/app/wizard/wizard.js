define(['uiRouter', 'angularTable', 'angularDragDrop', 'angularTouch', 'ngSpinner', 'angularAnimate'], function() {
    var wizardModule = angular.module('compass.wizard', [
        'ui.router',
        'ui.bootstrap',
        'ngTable',
        //'compass.charts',
        //'compass.findservers',
        'ngDragDrop',
        'ngTouch',
        'angularSpinner',
        'ngAnimate'
    ]);

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    wizardModule.config(function config($stateProvider) {
        $stateProvider
            .state('wizard', {
                url: '/wizard/{id}?config',
                controller: 'wizardCtrl',
                templateUrl: 'src/app/wizard/wizard.tpl.html',
                authenticate: true,
                resolve: {
                    clusterData: function($stateParams, $q, dataService) {
                        var clusterId = $stateParams.id;
                        var deferred = $q.defer();
                        dataService.getClusterById(clusterId).success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    machinesHostsData: function($q, dataService, clusterData) {
                        var deferred = $q.defer();
                        dataService.getAllMachineHosts().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    wizardStepsData: function($q, dataService) { // get the create-cluster-wizard steps
                        var deferred = $q.defer();
                        dataService.getWizardSteps().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    clusterConfigData: function($stateParams, $q, dataService) {
                        var clusterId = $stateParams.id;
                        var deferred = $q.defer();
                        dataService.getClusterConfig(clusterId).success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    },
                    adaptersData: function($q, dataService) {
                        var deferred = $q.defer();
                        dataService.getAdapters().success(function(data) {
                            deferred.resolve(data);
                        });
                        return deferred.promise;
                    }
                }
            });
    });

    wizardModule.controller('wizardCtrl', function($scope, dataService, wizardFactory, $stateParams, $state, $modal, clusterData, adaptersData, machinesHostsData, wizardStepsData, clusterConfigData) {
        $scope.loading = false;
        $scope.clusterId = $stateParams.id;
        $scope.cluster = clusterData;
        wizardFactory.setClusterInfo($scope.cluster);
        wizardFactory.setAllMachinesHost(machinesHostsData);

        $scope.adapters = adaptersData;

        $scope.currentAdapterName = $scope.cluster.adapter_name;
        if($scope.currentAdapterName != "os_only"){
                $scope.currentFlavor = $scope.cluster.flavor.name;
        }
        // angular.forEach($scope.adapters, function(adapter) {
        //     if (adapter.id == $scope.cluster.adapter_id) {
        //         // console.log("hi");
        //         // console.log(adapter);
        //         // console.log($scope.cluster.adapter_name);
        //         $scope.currentAdapterName = adapter.name;
        //         // if(adapter.flavors!=null)
        //         $scope.currentFlavor = adapter.flavors.name;
        //     }
        // });

        // $scope.currentAdapterName = $scope.cluster.adapter_name;
        // $scope.currentFlavor = $scope.cluster.flavor.name;

        // get pre-config data for wizard and set wizard steps based on different adapters
        var oldConfig = clusterConfigData;

        $scope.steps = [];
        if ($stateParams.config == "true") {
            dataService.getWizardPreConfig().success(function(data) {
                var preConfigData = {};
                switch ($scope.currentAdapterName) {
                    case "openstack_icehouse":
                        preConfigData = data["openstack"];
                        $scope.steps = wizardStepsData["os_and_ts"];
                        wizardFactory.setSteps($scope.steps);
                        break;
                    case "os_only":
                        preConfigData = data["os_only"];
                        $scope.steps = wizardStepsData["os"];
                        wizardFactory.setSteps($scope.steps);
                        break;
                    case "ceph_openstack_icehouse":
                        preConfigData = data["openstack_ceph"];
                        $scope.steps = wizardStepsData["os_and_ts"];
                        wizardFactory.setSteps($scope.steps);
                        break;
                    case "ceph_firefly":
                        preConfigData = data["ceph_firefly"];
                        $scope.steps = wizardStepsData["os_and_ts"];
                        wizardFactory.setSteps($scope.steps);
                        break;
                    case "openstack_juno":
                        preConfigData = data["openstack"];
                        $scope.steps = wizardStepsData["os_and_ts"];
                        wizardFactory.setSteps($scope.steps);
                        break;
                    default:
                        break;
                }

                if (preConfigData) {
                    wizardFactory.preConfig(preConfigData);
                    if (oldConfig.os_config) {
                        if (oldConfig.os_config.general) {
                            wizardFactory.setGeneralConfig(oldConfig.os_config.general);
                        }
                        if (oldConfig.os_config.partition) {
                            wizardFactory.setPartition(oldConfig.os_config.partition);
                        }
                        if (oldConfig.os_config.server_credentials) {
                            wizardFactory.setServerCredentials(oldConfig.os_config.server_credentials);
                        }
                    }
                    if (oldConfig.package_config) {
                        if (oldConfig.package_config.security) {
                            if (oldConfig.package_config.security.service_credentials) {
                                wizardFactory.setServiceCredentials(oldConfig.package_config.security.service_credentials);
                            }
                            if (oldConfig.package_config.security.console_credentials) {
                                wizardFactory.setConsoleCredentials(oldConfig.package_config.security.console_credentials);
                            }
                        }
                        if (oldConfig.package_config.network_mapping) {
                            wizardFactory.setNetworkMapping(oldConfig.package_config.network_mapping);
                        }
                        if (oldConfig.package_config.ceph_config) {
                            wizardFactory.setCephConfig(oldConfig.package_config.ceph_config);
                        }
                        if (oldConfig.package_config.neutron_config) {
                            wizardFactory.setNeutronConfig(oldConfig.package_config.neutron_config);
                        }
                        if (oldConfig.package_config.ha_config) {
                            wizardFactory.setNeutronConfig(oldConfig.package_config.ha_config);
                        }
                    }
                }
            });
        }

        $scope.$on('loading', function(event, data) {
            $scope.loading = data;
        });

        $scope.currentStep = 1;
        $scope.maxStep = 1;
        $scope.pendingStep = 1;

        // Watch commit state change
        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState != oldCommitState && newCommitState.name == $scope.steps[$scope.currentStep - 1].name) {
                if (newCommitState.state == "success") {
                    console.warn("### catch success in wizardCtrl ###", newCommitState, oldCommitState);
                    if (newCommitState.name == "review") {
                        $state.go("cluster.overview", {
                            'id': $scope.cluster.id
                        });
                    }
                    $scope.stepControl(goToPreviousStep = false);
                    if ($scope.currentStep > $scope.maxStep) {
                        $scope.maxStep = $scope.currentStep;
                    }
                } else if (newCommitState.state == "invalid") {
                    console.warn("### catch invalid in wizardCtrl ###", newCommitState, oldCommitState);
                    $scope.openErrMessageModal(newCommitState.message);

                } else if (newCommitState.state == "goToPreviousStep") {
                    $scope.stepControl(goToPreviousStep = true);
                    if ($scope.currentStep > $scope.maxStep) {
                        $scope.maxStep = $scope.currentStep;
                    }
                } else if (newCommitState.state == "error") {
                    console.warn("### catch error in wizardCtrl ###", newCommitState, oldCommitState);
                }
            }
            $scope.loading = false;
        });

        $scope.stepControl = function(goToPrevious) {
            if ($scope.pendingStep <= $scope.maxStep + 1) {
                var previousStepsIncomplete = false;
                for (var i = 0; i < $scope.pendingStep - 1; i++) {
                    if ($scope.steps[i].state == "incomplete") {
                        previousStepsIncomplete = true;
                        break;
                    }
                }
                if (previousStepsIncomplete) {
                    var message = {
                        "message": "Please make sure pre-requisite steps are complete."
                    };
                    alert(message.message);
                } else {
                    $scope.updateStepProgress($scope.pendingStep, $scope.currentStep, goToPrevious);
                    $scope.currentStep = $scope.pendingStep;
                }
            } else {
                var message = {
                    "message": "Please complete previous steps first"
                };
                alert(message.message);
                $scope.pendingStep = $scope.currentStep;
            }
        }

        for (var i = 0; i < $scope.steps.length; i++) {
            if ($scope.steps[i].name == 'network') {
                $scope.networkStep = i;
            }
            if ($scope.steps[i].name == 'role_assign') {
                $scope.roleAssignStep = i;
            }
            if ($scope.steps[i].name == 'network_mapping') {
                $scope.networkMappingStep = i;
            }
        }

        // Updates CSS Classes on Step state change
        $scope.updateStepProgress = function(newStep, oldStep, goToPrevious) {
            $scope.steps[newStep - 1].state = "active";

            if (goToPrevious) {
                $scope.steps[oldStep - 1].state = "";
            } else {
                $scope.steps[oldStep - 1].state = "complete";
            }

            $scope.steps[oldStep - 1].state = "complete";
            if ($scope.steps[newStep - 1].name == 'sv_selection') {
                if ($scope.maxStep > $scope.networkStep) {
                    $scope.steps[$scope.networkStep].state = "incomplete";
                }
                if ($scope.maxStep > $scope.roleAssignStep) {
                    $scope.steps[$scope.roleAssignStep].state = "incomplete";
                }
                if ($scope.maxStep > $scope.networkMappingStep) {
                    $scope.steps[$scope.networkMappingStep].state = "incomplete";
                }
            }
            if (newStep == $scope.networkStep + 1) {
                if ($scope.maxStep > $scope.networkMappingStep) {
                    $scope.steps[$scope.networkMappingStep].state = "incomplete";
                }
            }
            if (oldStep == $scope.steps.length) {
                $scope.steps[$scope.steps.length - 1].state = "";
            }
        };

        $scope.triggerCommit = function(stepId, nextStep) {
            var sendRequest = false;
            if (nextStep > stepId) {
                sendRequest = true;
            }
            if ($scope.steps[stepId - 1].name != "review") {
                var commitState = {
                    "name": $scope.steps[stepId - 1].name,
                    "state": "triggered",
                    "sendRequest": sendRequest,
                    "message": {}
                };
                wizardFactory.setCommitState(commitState);
            } else {
                $scope.stepControl();
            }
        };

        $scope.deploy = function() {
            var wizard_complete = true;
            for (var i = 0; i < $scope.steps.length - 1; i++) {
                if ($scope.steps[i].state != "complete") {
                    wizard_complete = false;
                    break;
                }
            }
            if (wizard_complete) {
                var commitState = {
                    "name": "review",
                    "state": "triggered",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
            }
        };

        $scope.stepForward = function() {
            $scope.pendingStep = $scope.currentStep + 1;;
            $scope.triggerCommit($scope.currentStep, $scope.pendingStep);
        };

        // go to previous step
        $scope.stepBackward = function() {
            $scope.pendingStep = $scope.currentStep - 1;
            $scope.triggerCommit($scope.currentStep, $scope.pendingStep);
        };

        // go to step by stepId
        $scope.skipForward = function(stepId) {
            if ($scope.currentStep != stepId) {
                $scope.pendingStep = stepId;
                $scope.triggerCommit($scope.currentStep, stepId);
            }
        };

        $scope.openErrMessageModal = function(message) {
            var modalInstance = $modal.open({
                templateUrl: "messagemodal.html",
                controller: wizardModalInstanceCtrl,
                resolve: {
                    warning: function() {
                        return message;
                    }
                }
            });
            modalInstance.result.then(function() {

            }, function() {
                console.log("modal dismissed")
            })
        };

        dataService.getSubnetConfig().success(function(data) {
            wizardFactory.setSubnetworks(data);
        });
    });

    wizardModule.animation('.fade-animation', function() {
        return {
            enter: function(element, done) {
                element.css('display', 'none');
                element.fadeIn(500, done);
                return function() {
                    element.stop();
                }
            },
            leave: function(element, done) {
                element.fadeOut(500, done)
                return function() {
                    element.stop();
                }
            }
        }
    });

    wizardModule.controller('svSelectCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService) {
        $scope.hideunselected = '';
        $scope.search = {};

        var cluster = wizardFactory.getClusterInfo();

        $scope.allservers = wizardFactory.getAllMachinesHost();

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


        $scope.selectAllServers = function(flag) {
            if (flag) {
                angular.forEach($scope.allservers, function(sv) {
                    if (!sv.disabled) {
                        sv.selected = true;
                    }
                })
            } else {
                angular.forEach($scope.allservers, function(sv) {
                    sv.selected = false;
                })
            }
        };

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.showall;
            //console.log($scope.server_columns);
        });

        $scope.hideUnselected = function() {
            if ($scope.hideunselected) {
                $scope.search.selected = true;
            } else {
                delete $scope.search.selected;
            }
        };

        $scope.ifPreSelect = function(server) {
            server.disabled = false;
            if (server.clusters) {
                if (server.clusters.length > 0) {
                    server.disabled = true;
                }
                angular.forEach(server.clusters, function(svCluster) {
                    if (svCluster.id == cluster.id) {
                        server.selected = true;
                        server.disabled = false;
                    }
                })
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
            $scope.$emit("loading", true);
            var selectedServers = [];
            var noSelection = true;
            angular.forEach($scope.allservers, function(sv) {
                if (sv.selected) {
                    noSelection = false;
                    selectedServers.push(sv);
                }
            })
            if (noSelection) {
                var message = {
                    "message": "Please select at least one server"
                };
                var commitState = {
                    "name": "sv_selection",
                    "state": "invalid",
                    "message": message
                };
                wizardFactory.setCommitState(commitState);
            } else {
                var addHostsAction = {
                    "add_hosts": {
                        "machines": []
                    }
                };
                angular.forEach($scope.allservers, function(server) {
                    if (server.selected) {
                        if (server.reinstallos === undefined) {
                            addHostsAction.add_hosts.machines.push({
                                "machine_id": server.machine_id
                            });
                        } else {
                            addHostsAction.add_hosts.machines.push({
                                "machine_id": server.machine_id,
                                "reinstall_os": server.reinstallos
                            });
                        }
                    }
                });

                // add hosts
                dataService.postClusterActions(cluster.id, addHostsAction).success(function(data) {
                    var commitState = {
                        "name": "sv_selection",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                    wizardFactory.setAllMachinesHost($scope.allservers);

                }).error(function(response) {
                    var commitState = {
                        "name": "sv_selection",
                        "state": "error",
                        "message": response
                    };
                    wizardFactory.setCommitState(commitState);
                });
                wizardFactory.setServers(selectedServers);
            }
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

    wizardModule.controller('globalCtrl', function($scope, wizardFactory, dataService, $q) {


        var cluster = wizardFactory.getClusterInfo();

        $scope.general = wizardFactory.getGeneralConfig();
        $scope.server_credentials = wizardFactory.getServerCredentials();


        if (!$scope.general["dns_servers"]) {
            $scope.general["dns_servers"] = [""];
        }
        if (!$scope.general["search_path"]) {
            $scope.general["search_path"] = [""];
        }
        if (!$scope.general["no_proxy"]) {
            $scope.general["no_proxy"] = [""];
        }

        $scope.addValue = function(key) {
            $scope.general[key].push("");
        };

        dataService.getTimezones().success(function(data) {
            $scope.timezones = data;
        });

        //For Routing Table Section
        //keep routing table for later use
        /*
        $scope.routingtable = wizardFactory.getRoutingTable();
        $scope.addRoute = function() {
            $scope.routingtable.push({});
            console.log($scope.routingtable);
        };
        $scope.removeRoute = function(index) {
            $scope.routingtable.splice(index, 1)
        };
        $scope.$watch('routingtable', function() {
            if ($scope.routingtable.length == 0) {
                $scope.routingtable.push({});
            }
        }, true);
        */

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {

            if (newCommitState !== undefined) {
                if (newCommitState.name == "os_global" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });



        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "os_global",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }
            $scope.$emit("loading", true);
            var osGlobalConfig = {
                "os_config": {
                    "general": $scope.general,
                    "server_credentials": {
                        "username": $scope.server_credentials.username,
                        "password": $scope.server_credentials.password
                    }
                }
            };

            if ($scope.generalForm.$valid) {
                dataService.updateClusterConfig(cluster.id, osGlobalConfig).success(function(configData) {
                    wizardFactory.setGeneralConfig($scope.general);
                    var commitState = {
                        "name": "os_global",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                }).error(function(response) {
                    var commitState = {
                        "name": "os_global",
                        "state": "error",
                        "message": response
                    };
                    wizardFactory.setCommitState(commitState);
                });
            } else {
                var message = {};
                if ($scope.generalForm.$error.required) {
                    message = {
                        "message": "The required(*) fields can not be empty !"
                    };
                } else if ($scope.generalForm.$error.match) {
                    message = {
                        "message": "The passwords do not match"
                    };
                }
                var commitState = {
                    "name": "os_global",
                    "state": "invalid",
                    "message": message
                };
                wizardFactory.setCommitState(commitState);
            }
        };


        // keey routing table for later use
        /*
        $scope.updateRoutingTable = function() {
            var routingCount = $scope.routingtable.length;
            var routingTable = [];
            var i = 0;
            angular.forEach($scope.routingtable, function(rt) {
                if (rt.id === undefined) {
                    // post routing table
                    dataService.postRoutingTable(cluster.id, rt).success(function(routingData) {
                        routingTable.push(routingData);
                        i++;
                        if (i == routingCount) {
                            $scope.routingtable = routingTable;
                            wizardFactory.setRoutingTable(routingTable);
                        }
                    })
                } else {
                    // put routing table
                    dataService.putRoutingTable(cluster.id, rt.id, rt).success(function(routingData) {
                        routingTable.push(routingData);
                        i++;
                        if (i == routingCount) {
                            $scope.routingtable = routingTable;
                            wizardFactory.setRoutingTable(routingTable);
                        }
                    })
                }
            })
        };
        */
    });

    wizardModule.controller('networkCtrl', function($scope, $timeout, wizardFactory, dataService, $filter, ngTableParams, sortingService, $q, $modal) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.subnetworks = wizardFactory.getSubnetworks();
        $scope.interfaces = wizardFactory.getInterfaces();
        //console.log($scope.interfaces);
        $scope.autoFill = false;
        $scope.autoFillButtonDisplay = "Enable Autofill";
        //$scope.servers = wizardFactory.getServers();
        $scope.autoFillMange = function() {
            $scope.autoFill = !$scope.autoFill;
            if ($scope.autoFill) {
                $scope.autoFillButtonDisplay = "Disable Autofill";
            } else {
                $scope.autoFillButtonDisplay = "Enable Autofill";
            }
        };

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.showless;
        });

        dataService.getClusterHosts(cluster.id).success(function(data) {
            $scope.servers = data;
            //console.log($scope.servers);
            // Assume all hosts in the same cluster have same interface settings
            if ($scope.servers[0].networks) {
                if (Object.keys($scope.servers[0].networks).length != 0) {
                    $scope.interfaces = $scope.servers[0].networks;
                    wizardFactory.setInterfaces($scope.interfaces);
                }
            }

            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.servers.length + 1 // count per page
            }, {
                counts: [], // hide count-per-page box
                total: $scope.servers.length, // length of data
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
                        $filter('orderBy')($scope.servers, function(item) {
                            if (orderByColumn == "switch_ip") {
                                return sortingService.ipAddressPre(item.switch_ip);
                            } else {
                                return item[orderByColumn];
                            }
                        }, reverse) : $scope.servers;
                    $scope.servers = orderedData;

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });

        $scope.addInterface = function(newInterface) {
            var isExist = false;
            if (newInterface) {
                angular.forEach($scope.interfaces, function(value, key) {
                    if (key == newInterface.name) {
                        isExist = true;
                        alert("This interface already exists. Please try another one");
                    }
                })
                if (!isExist) {
                    $scope.interfaces[newInterface.name] = {
                        "subnet_id": parseInt(newInterface.subnet_id),
                        "is_mgmt": false
                    }
                }
                $scope.newInterface = {};
            }
        };

        $scope.deleteInterface = function(delInterface) {
            delete $scope.interfaces[delInterface];
            angular.forEach($scope.servers, function(sv) {
                delete sv.networks[delInterface];
            })
        };

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "network" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });

        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "network",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }
            $scope.$emit("loading", true);
            wizardFactory.setInterfaces($scope.interfaces);


            var interfaceCount = Object.keys($scope.interfaces).length;
            if (interfaceCount == 0) {
                alert("Please add interface");
            } else {
                var hostnamePromises = [];
                var hostNetworkPromises = [];

                angular.forEach($scope.servers, function(server) {
                    var hostname = {
                        "name": server["hostname"]
                    };
                    // update hostname
                    var updateHostname = dataService.putHost(server.id, hostname).then(function(hostData) {
                        // success callback
                    }, function(response) {
                        // error callback
                        return $q.reject(response);
                    });
                    hostnamePromises.push(updateHostname);

                    angular.forEach(server.networks, function(value, key) {
                        var network = {
                            "interface": key,
                            "ip": value.ip,
                            "subnet_id": parseInt($scope.interfaces[key].subnet_id),
                            "is_mgmt": $scope.interfaces[key].is_mgmt,
                            "is_promiscuous": $scope.interfaces[key].is_promiscuous
                        };
                        if (value.id === undefined) {
                            // post host network
                            var updateNetwork = dataService.postHostNetwork(server.id, network).then(function(networkData) {
                                // success callback
                                var interface = networkData.data.interface;
                                var networkId = networkData.data.id;
                                server.networks[interface].id = networkId;
                            }, function(response) {
                                // error callback
                                return $q.reject(response);
                                // keep this part for later use
                                /*
                            if(response.status == 409) { // if (host_id, interface) already exists
                                var updateNetwork = dataService.putHostNetwork(server.id, value.id, network).then(function(networkData) {
                                    // success callback
                                }, function(response) {
                                    // error callback
                                    return $q.reject(response);
                                });
                                hostNetworkPromises.push(updateNetwork);
                            }
                            */
                            });
                            hostNetworkPromises.push(updateNetwork);
                        } else {
                            // put host network
                            var updateNetwork = dataService.putHostNetwork(server.id, value.id, network).then(function(networkData) {
                                // success callback
                            }, function(response) {
                                // error callback
                                return $q.reject(response);
                            });
                            hostNetworkPromises.push(updateNetwork);
                        }
                    });
                });

                $q.all(hostnamePromises.concat(hostNetworkPromises)).then(function() {
                    // update hostname and network for all hosts successfully
                    wizardFactory.setServers($scope.servers);
                    var commitState = {
                        "name": "network",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                }, function(response) {
                    wizardFactory.setServers($scope.servers);
                    var commitState = {
                        "name": "network",
                        "state": "error",
                        "message": response.data
                    };
                    console.info(response.data);
                    wizardFactory.setCommitState(commitState);
                });

            }
        };

        $scope.openAddSubnetModal = function() {
            var modalInstance = $modal.open({
                templateUrl: "addSubnetModal.html",
                controller: addSubnetModalInstanceCtrl,
                resolve: {
                    subnets: function() {
                        return $scope.subnetworks;
                    }
                }
            });
            modalInstance.result.then(function(subnets) {
                $scope.subnetworks = [];
                angular.forEach(subnets, function(subnet) {
                    $scope.subnetworks.push(subnet);
                });
                wizardFactory.setSubnetworks($scope.subnetworks);
            }, function() {
                console.log("modal dismissed")
            })
        };


        $scope.autofill = function(alertFade) {
            // Autofill IP for each interface
            angular.forEach($scope.interfaces, function(value, key) {
                var ip_start = $("#" + key + "-ipstart").val();
                var interval = parseInt($("#" + key + "-increase-num").val());
                $scope.fillIPBySequence(ip_start, interval, key);
            });
            // Autofill hostname
            var hostname_rule = $("#hostname-rule").val();
            $scope.fillHostname(hostname_rule);
            $scope.networkAlerts = [{
                msg: 'Autofill Done!'
            }];
            if (alertFade) {
                $timeout(function() {
                    $scope.networkAlerts = [];
                }, alertFade);
            }
        };

        $scope.fillHostname = function(rule) {
            if (rule) {
                switch (rule) {
                    case "host":
                        var server_index = 1;
                        angular.forEach($scope.servers, function(server) {
                            server.hostname = "host-" + server_index;
                            server_index++;
                        })
                        break;
                    case "switch_ip":
                        angular.forEach($scope.servers, function(server) {
                            server.hostname = server.switch_ip.replace(/\./g, "-") + "-p" + server.port;
                        })
                        break;
                }
            }
        };

        $scope.fillIPBySequence = function(ipStart, interval, interface) {
            if (ipStart == "")
                return;
            var ipStartParts = ipStart.split(".");
            var ipParts = ipStartParts.map(function(x) {
                return parseInt(x);
            });

            angular.forEach($scope.servers, function(server) {
                if (ipParts[3] > 255) {
                    ipParts[3] = ipParts[3] - 256;
                    ipParts[2] ++;
                }
                if (ipParts[2] > 255) {
                    ipParts[2] = ipParts[2] - 256;
                    ipParts[1] ++;
                }
                if (ipParts[1] > 255) {
                    ipParts[1] = ipParts[1] - 256;
                    ipParts[0] ++;
                }
                if (ipParts[0] > 255) {
                    server.networks[interface].ip = "";
                    return;
                } else {
                    var ip = ipParts[0] + "." + ipParts[1] + "." + ipParts[2] + "." + ipParts[3]
                    server.networks[interface].ip = ip;
                    ipParts[3] = ipParts[3] + interval;
                }
            })
        }
    });

    wizardModule.controller('partitionCtrl', function($scope, wizardFactory, dataService) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.partition = wizardFactory.getPartition();
        $scope.partitionInforArray = [];
        $scope.duplicated = false;
        $scope.duplicatedIndexArray = [];

        angular.forEach($scope.partition, function(value, key) {
            $scope.partitionInforArray.push({
                "name": key,
                "percentage": value.percentage,
                "max_size": value.max_size
            });
        });


        /*$scope.addPartition = function() {
        var mount_point = $scope.newPartition.mount_point;
        $scope.partition[mount_point] = {};
        $scope.partition[mount_point].percentage = $scope.newPartition.percentage;
        $scope.partition[mount_point].max_size = $scope.newPartition.max_size;
        $scope.newPartition = {};
        };*/

        $scope.addPartition = function() {
            var newRowExist = false;
            angular.forEach($scope.partitionInforArray, function(partitionInfo) {
                if (partitionInfo.name == "") {
                    newRowExist = true;
                }

            });
            if (newRowExist == false && $scope.duplicated == false) {
                $scope.partitionInforArray.push({
                    "name": "",
                    "percentage": 0,
                    "max_size": 0
                })
            }

        }

        $scope.deletePartition = function(index) {
            var emptyRowIndex = -1; // no empty row
            if ($scope.partitionInforArray.length <= 2) {
                if ($scope.partitionInforArray[0]['name'] == "") {
                    emptyRowIndex = 0;
                } else if ($scope.partitionInforArray[1]['name'] == "") {
                    emptyRowIndex = 1;
                }

                if (emptyRowIndex == index || emptyRowIndex == -1) {
                    $scope.partitionInforArray.splice(index, 1);
                }

            } else {
                $scope.partitionInforArray.splice(index, 1);
            }
            if ($scope.duplicatedIndexArray.indexOf(index) >= 0) {
                $scope.duplicated = false;

            }
        };

        $scope.$watch('partitionInforArray', function() {
            $scope.partitionarray = [];
            var total = 0;
            angular.forEach($scope.partitionInforArray, function(partitionInfo) {
                total += parseFloat(partitionInfo.percentage);
                $scope.partitionarray.push({
                    "name": partitionInfo.name,
                    "number": partitionInfo.percentage
                });
            });
            $scope.partitionarray.push({
                "name": "others",
                "number": 100 - total
            })
        }, true);

        $scope.mount_point_change = function(index, name) {
            var duplicatedIndexContainer = [];
            $scope.duplicatedIndexArray = [];
            var count = 0;
            $scope.duplicated = false;
            var numberOfNames = 0;
            angular.forEach($scope.partitionInforArray, function(partitionInfo) {

                if (partitionInfo.name == name) {
                    numberOfNames++;
                    duplicatedIndexContainer.push(count);
                }
                count++;
            });
            if (numberOfNames > 1) {
                $scope.duplicated = true;
                $scope.duplicatedIndexArray = angular.copy(duplicatedIndexContainer);
            }
        }

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "partition" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });

        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "partition",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }
            $scope.$emit("loading", true);
            if ($scope.duplicated == true) {
                var message = {
                    "message": "Mount Point cannot be the same"
                }
                var commitState = {
                    "name": "partition",
                    "state": "invalid",
                    "message": message
                };
                wizardFactory.setCommitState(commitState);

            } else {
                var newPartition = {};
                var data = {};
                angular.forEach($scope.partitionInforArray, function(partitionInfo) {
                    newPartition[partitionInfo['name']] = {};
                    newPartition[partitionInfo['name']]['percentage'] = partitionInfo['percentage'];
                    newPartition[partitionInfo['name']]['max_size'] = partitionInfo['max_size'];
                });
                $scope.partition = angular.copy(newPartition);
                var os_partition = {
                    "os_config": {
                        "partition": $scope.partition
                    }
                };

                dataService.updateClusterConfig(cluster.id, os_partition).success(function(configData) {
                    wizardFactory.setPartition(configData["os_config"]["partition"]);
                    var commitState = {
                        "name": "partition",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                }).error(function(response) {
                    var commitState = {
                        "name": "partition",
                        "state": "error",
                        "message": response
                    };
                    wizardFactory.setCommitState(commitState);
                });
            }
        };
    });

    wizardModule.controller('packageConfigCtrl', function($scope, wizardFactory, dataService) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.service_credentials = wizardFactory.getServiceCredentials();
        $scope.console_credentials = wizardFactory.getConsoleCredentials();

        $scope.mSave = function() {
            $scope.originalMangementData = angular.copy($scope.console_credentials);
        }
        $scope.sSave = function() {
            $scope.originalServiceData = angular.copy($scope.service_credentials);
        }

        $scope.mSave();
        $scope.sSave();

        var keyLength_service_credentials = Object.keys($scope.service_credentials).length;
        $scope.editServiceMode = [];
        $scope.editServiceMode.length = keyLength_service_credentials;

        var keyLength_console_credentials = Object.keys($scope.console_credentials).length;
        $scope.editMgntMode = [];
        $scope.editMgntMode.length = keyLength_console_credentials;

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "package_config" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });

        $scope.mgmtAccordion = {};

        $scope.$watch('mgmtAccordion', function(val) {
            if ($scope.mgmtAccordion.open == true) {
                $scope.mSave();
            } else if ($scope.mgmtAccordion.open == false) {
                $scope.mReset();
                $scope.mcloseAll();
            }
        }, true)

        $scope.mcloseAll = function() {
            for (var i = 0; i < $scope.editMgntMode.length; i++) {
                if ($scope.editMgntMode[i] == true) {
                    $scope.editMgntMode[i] = false;
                } else {}
            }
        }

        $scope.mEdit = function(index) {
            for (var i = 0; i < $scope.editMgntMode.length; i++) {
                if (i != index) {
                    $scope.editMgntMode[i] = false;
                } else {
                    $scope.editMgntMode[i] = true;
                }
            }
            $scope.mReset();
        }

        $scope.mReset = function() {
            $scope.console_credentials = angular.copy($scope.originalMangementData);
        }

        // Service Credentials
        $scope.serviceAccordion = {};

        $scope.$watch('serviceAccordion', function(val) {
            if ($scope.serviceAccordion.open == true) {
                $scope.sSave();
            } else if ($scope.serviceAccordion.open == false) {
                $scope.sReset();
                $scope.scloseAll();
            }
        }, true)

        $scope.scloseAll = function() {
            for (var i = 0; i < $scope.editServiceMode.length; i++) {
                if ($scope.editServiceMode[i] == true) {
                    $scope.editServiceMode[i] = false;
                } else {}
            }
        }

        $scope.sEdit = function(index) {
            for (var i = 0; i < $scope.editServiceMode.length; i++) {
                if (i != index) {
                    $scope.editServiceMode[i] = false;
                } else {
                    $scope.editServiceMode[i] = true;
                }
            }
            $scope.sReset();
        }

        $scope.sReset = function() {
            $scope.service_credentials = angular.copy($scope.originalServiceData);
        }

        //High Availability Config
        $scope.haAccordion = {};
        $scope.ha_config = wizardFactory.getHighAvailabilityConfig();

        if (!$scope.ha_config["ha_proxy"]) {
            $scope.ha_config["ha_proxy"] = {};
            $scope.ha_config["ha_proxy"]["vip"] = [""];
        }

        //Neutron Config
        $scope.neutronAccordion = {};
        $scope.neutron_config = wizardFactory.getNeutronConfig();

        $scope.addValue = function(key) {
            $scope.neutron_config.openvswitch[key].push("");
        };

        if (!$scope.neutron_config["openvswitch"]) {
            $scope.neutron_config["openvswitch"] = {};
            $scope.neutron_config["openvswitch"]["tenant_network_type"] = ["gre"];
            $scope.neutron_config["openvswitch"]["tunnel_id_ranges"] = [""];
            $scope.neutron_config["openvswitch"]["network_vlan_ranges"] = [""];
            $scope.neutron_config["openvswitch"]["bridge_mappings"] = [""];
        }
        // else {
        //     if (!$scope.neutronConfig["openvswitch"]["tunnel_id_ranges"]) $scope.neutronConfig["openvswitch"]["tunnel_id_ranges"] = [""];
        //     if (!$scope.neutronConfig["openvswitch"]["network_vlan_ranges"]) $scope.neutronConfig["openvswitch"]["network_vlan_ranges"] = [""];
        //     if (!$scope.neutronConfig["openvswitch"]["bridge_mapping"]) $scope.neutronConfig["openvswitch"]["bridge_mapping"] = [""];
        //     if (!$scope.neutronConfig["openvswitch"]["tenant_network_type"]) $scope.neutronConfig["openvswitch"]["tenant_network_type"] = [""];
        // }

        // console.log($scope.neutronConfig);

        // Ceph Config
        $scope.cephAccordion = {};
        /*$scope.cephConfig = {
            "global_config": {},
            "osd_config": {},
            "osd_devices": {}
        };*/
        $scope.cephConfig = wizardFactory.getCephConfig();
        //    $scope.$watch(function() {
        //     return wizardFactory.getCommitState()
        // }, function(newCommitState, oldCommitState) {

        //     if (newCommitState !== undefined) {
        //         if (newCommitState.state == "triggered") {
        //             $scope.commit(newCommitState.sendRequest);
        //         }
        //     }
        // });
        $scope.form = {};
        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "package_config",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }
            $scope.$emit("loading", true);
            var targetSysConfigData = {
                "package_config": {
                    "security": {
                        "service_credentials": $scope.service_credentials,
                        "console_credentials": $scope.console_credentials
                    }
                }
            };

            if ($scope.currentAdapterName == "ceph_openstack_icehouse" || $scope.currentAdapterName == "openstack_icehouse") {

                if ($scope.currentAdapterName == "ceph_openstack_icehouse") {
                    targetSysConfigData["package_config"]["ceph_config"] = $scope.cephConfig;
                }

                if ($scope.currentAdapterName == "openstack_icehouse" && $scope.currentFlavor == "HA-multinodes") {
                    //  if ($scope.currentAdapterName == "openstack_icehouse"){
                    targetSysConfigData["package_config"]["ha_proxy"] = {};
                    targetSysConfigData["package_config"]["ha_proxy"]["vip"] = $scope.ha_config.ha_proxy.vip;

                }

                targetSysConfigData["package_config"]["neutron_config"] = {};
                targetSysConfigData["package_config"]["neutron_config"]["openvswitch"] = {};

                if ($scope.neutron_config.openvswitch.tenant_network_type == "gre") {
                    targetSysConfigData["package_config"]["neutron_config"]["openvswitch"]["tenant_network_type"] = "gre";
                    targetSysConfigData["package_config"]["neutron_config"]["openvswitch"]["tunnel_id_ranges"] = $scope.neutron_config.openvswitch.tunnel_id_ranges;
                }
                if ($scope.neutron_config.openvswitch.tenant_network_type == "vlan") {
                    targetSysConfigData["package_config"]["neutron_config"]["openvswitch"]["tenant_network_type"] = "vlan";
                    targetSysConfigData["package_config"]["neutron_config"]["openvswitch"]["network_vlan_ranges"] = $scope.neutron_config.openvswitch.network_vlan_ranges;
                    targetSysConfigData["package_config"]["neutron_config"]["openvswitch"]["bridge_mappings"] = $scope.neutron_config.openvswitch.bridge_mappings;
                }
            }

            if ($scope.currentAdapterName == "ceph_firefly") {
                targetSysConfigData["package_config"] = {};
                targetSysConfigData["package_config"]["ceph_config"] = $scope.cephConfig;
            }

            $scope.areValid = true;
            $scope.notValidformName = "";

            angular.forEach($scope.form, function(formdt, key) {
                if ($scope.form[key].$valid == false) {
                    $scope.areValid = false;
                    $scope.notValidformName = key;
                }
            });


            if ($scope.areValid) {

                dataService.updateClusterConfig(cluster.id, targetSysConfigData).success(function(data) {

                    wizardFactory.setNeutronConfig($scope.neutron_config);
                    wizardFactory.setHighAvailabilityConfig($scope.ha_config);

                    var commitState = {
                        "name": "package_config",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                }).error(function(response) {
                    var commitState = {
                        "name": "package_config",
                        "state": "error",
                        "message": response
                    };
                    wizardFactory.setCommitState(commitState);
                });

            } else {
                var message = {};
                if ($scope.form[$scope.notValidformName].$error.required) {
                    message = {
                        "message": "The required(*) fields are empty!"
                    };
                } else if ($scope.form[$scope.notValidformName].$error.pattern) {
                    message = {
                        "message": "The required(*) fields are not in correct patterns!"
                    };
                }

                var commitState = {
                    "name": "package_config",
                    "state": "invalid",
                    "message": message
                };
                wizardFactory.setCommitState(commitState);
            }


        };
    });

    wizardModule.controller('roleAssignCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService, $q) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.servers = wizardFactory.getServers();
        //var colors = ['#8EA16C', '#C2CF30', '#FEC700', '#FF8900', '#D3432B', '#BB2952', '#8E1E5F', '#DE4AB6', '#9900EC', '#3A1AA8', '#3932FE', '#278BC0', '#35B9F6', '#91E0CB', '#42BC6A', '#5B4141'];
        var colors = ['#a4ebc6', '#cbe375', '#f5d185', '#ee9f97', '#de8ea8', '#8a8ae7', '#85c9fc', '#ffdc4d', '#f2af58', '#f1a3d7', '#e0a9f8', '#88e8db', '#7dc9df', '#bfbfbf', '#bece91', '#84efa7'];

        $scope.existingRoles = [];
        $scope.realRole = [];

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.showless;
        });

        dataService.getClusterById(cluster.id).success(function(data) {
            // wizardFactory.setAdapter(data);
            $scope.roles = data.flavor.roles;
            angular.forEach($scope.roles, function(role, role_key) {
                role.color = colors[role_key];
                $scope.roles[role_key].dragChannel = role_key;
                $scope.realRole.push(role_key);
            });
            angular.forEach($scope.servers, function(value, key) {
                $scope.existingRoles.push(angular.copy($scope.realRole));
                $scope.servers[key].dropChannel = $scope.existingRoles[key].toString();
                angular.forEach($scope.servers[key].roles, function(server_role, server_role_key) {
                    $scope.server_role = "";
                    angular.forEach($scope.roles, function(role, role_key) {
                        if (server_role.name == $scope.roles[role_key].name) {
                            $scope.server_role = role_key;
                        }
                    });
                    server_role.color = colors[$scope.server_role];
                });
            });
            $scope.checkExistRolesDrag();
        });

        $scope.selectAllServers = function(flag) {
            if (flag) {
                angular.forEach($scope.servers, function(sv) {
                    sv.checked = true;
                });
            } else {
                angular.forEach($scope.servers, function(sv) {
                    sv.checked = false;
                });
            }
        };

        $scope.removeRole = function(server, role) {
            var serverIndex = $scope.servers.indexOf(server);
            var roleIndex = $scope.servers[serverIndex].roles.indexOf(role);
            $scope.servers[serverIndex].roles.splice(roleIndex, 1);
            angular.forEach($scope.roles, function(role_value, role_key) {
                if (role.name == $scope.roles[role_key].name) {
                    $scope.existingRoles[serverIndex].splice(role_key, 1, role_key)
                }
            });
            $scope.servers[serverIndex].dropChannel = $scope.existingRoles[serverIndex].toString();
        };

        $scope.assignRole = function(role) {
            var serverChecked = false;
            for (var i = 0; i < $scope.servers.length; i++) {
                if ($scope.servers[i].checked) {
                    serverChecked = true;
                }
            }
            if (!serverChecked) {
                alert("Please select at least one server");
            } else {
                // get selected servers and assign role to them
                for (var i = 0; i < $scope.servers.length; i++) {
                    if ($scope.servers[i].checked) {
                        var roleExist = $scope.checkRoleExist($scope.servers[i].roles, role);
                        if (!roleExist) {
                            $scope.servers[i].roles.push(role);
                        }
                    }
                }
            }
        };

        // Assume all servers have not been assigned any roles before calling this function
        $scope.autoAssignRoles = function() {
            var roles = angular.copy($scope.roles);
            var svIndex = 0;
            angular.forEach(roles, function(newrole) {
                var i = 0;
                var loopStep = 0;
                while (i < newrole.count && loopStep < $scope.servers.length) {
                    if (svIndex >= $scope.servers.length) {
                        svIndex = 0;
                    }
                    var roleExist = $scope.checkRoleExist($scope.servers[svIndex].roles, newrole);
                    if (!roleExist) {
                        $scope.servers[svIndex].roles.push(newrole);
                        i++;
                        loopStep = 0;
                    } else {
                        loopStep++;
                    }
                    svIndex++;
                }
            });
        };

        $scope.checkRoleExist = function(existingRoles, newRole) {
            var roleExist = false;
            angular.forEach(existingRoles, function(existingRole) {
                if (existingRole.name == newRole.name) {
                    roleExist = true;
                }
            })
            return roleExist;
        };

        $scope.$watch('roles', function(roles) {
            var count = 0;
            angular.forEach(roles, function(role) {
                count += role.count;
            })
            $scope.rolesTotalCount = count;
        }, true);
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.servers.length + 1 // count per page
        }, {
            counts: [], // hide count-per-page box
            total: $scope.servers.length, // length of data
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
                    $filter('orderBy')($scope.servers, function(item) {
                        if (orderByColumn == "switch_ip") {
                            return sortingService.ipAddressPre(item.switch_ip);
                        } else {
                            return item[orderByColumn];
                        }
                    }, reverse) : $scope.servers;
                $scope.servers = orderedData;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "role_assign" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });

        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "role_assign",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }
            $scope.$emit("loading", true);
            var promises = [];
            angular.forEach($scope.servers, function(server) {
                var roles = [];
                angular.forEach(server.roles, function(role) {
                    roles.push(role.name);
                });
                var data = {
                    "roles": roles
                };
                var updateRoles = dataService.updateClusterHost(cluster.id, server.id, data).then(function(configData) {
                    // success callback
                }, function(response) {
                    // error callback
                    return $q.reject(response);
                });
                promises.push(updateRoles);
            });

            if ($scope.ha_vip) {
                var config = {
                    "package_config": {
                        "ha_vip": $scope.ha_vip
                    }
                }
                var updateHAVIP = dataService.updateClusterConfig(cluster.id, config).then(function(configData) {
                    // success callback
                }, function(response) {
                    // error callback
                    return $q.reject(response);
                });
                promises.push(updateHAVIP);
            }

            $q.all(promises).then(function() {
                wizardFactory.setServers($scope.servers);
                var commitState = {
                    "name": "role_assign",
                    "state": "success",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
            }, function(response) {
                console.log("promises error", response);
                var commitState = {
                    "name": "role_assign",
                    "state": "error",
                    "message": response.data
                };
                wizardFactory.setCommitState(commitState);
            });
        };

        $scope.onDrop = function($event, server) {
            $scope.dragKey = $scope.servers.indexOf(server);
        };

        $scope.dropSuccessHandler = function($event, role_value, key) {
            var roleExist = $scope.checkRoleExist($scope.servers[$scope.dragKey].roles, role_value);
            if (!roleExist) {
                $scope.servers[$scope.dragKey].roles.push(role_value);
            } else {
                console.log("role exists");
            }
            $scope.checkExistRolesDrag();
        };

        $scope.checkExistRolesDrag = function() {
            angular.forEach($scope.servers, function(value, key) {
                angular.forEach($scope.servers[key].roles, function(server_role, server_role_key) {
                    angular.forEach($scope.roles, function(role, role_key) {
                        if ($scope.servers[key].roles[server_role_key].name == $scope.roles[role_key].name) {
                            $scope.existingRoles[key].splice(role_key, 1, "p");
                        }
                    });
                });
                $scope.servers[key].dropChannel = $scope.existingRoles[key].toString();
            });
        };
    });

    wizardModule.controller('networkMappingCtrl', function($scope, wizardFactory, dataService) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.interfaces = wizardFactory.getInterfaces();
        $scope.original_networking = wizardFactory.getNetworkMapping();
        $scope.pendingInterface = "";

        $scope.onDrop = function($event, key) {
            $scope.pendingInterface = key;
        };

        angular.forEach($scope.interfaces, function(value, key) {
            $scope.interfaces[key].dropChannel = "others";
        });

        $scope.networking = {};
        angular.forEach($scope.original_networking, function(value, key) {
            $scope.networking[key] = {};
            $scope.networking[key].mapping_interface = value;
            if (key == "external") {
                $scope.networking[key].dragChannel = "external";
            } else
                $scope.networking[key].dragChannel = "others";
        });


        $scope.dropSuccessHandler = function($event, key, dict) {
            dict[key].mapping_interface = $scope.pendingInterface;
        };
        if ($scope.currentAdapterName != "ceph_firefly") {
            angular.forEach($scope.interfaces, function(value, key) {
                // The interface with promisc mode is required to be set as External Network
                if (value.is_promiscuous) {
                    $scope.networking["external"].mapping_interface = key;
                    $scope.interfaces[key].dropChannel = "external";
                }
                // The interface marked as management is required to be set as Management Network
                if (value.is_mgmt) {
                    $scope.networking["management"].mapping_interface = key;
                }
            });
        }

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "network_mapping" && newCommitState.state == "triggered") {
                    $scope.commit(newCommitState.sendRequest);
                }
            }
        });

        $scope.commit = function(sendRequest) {
            if (!sendRequest) {
                var commitState = {
                    "name": "network_mapping",
                    "state": "goToPreviousStep",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
                return;
            }

            $scope.$emit("loading", true);
            var networks = {};
            angular.forEach($scope.networking, function(value, key) {
                networks[key] = value.mapping_interface;
            });
            var network_mapping = {
                "package_config": {
                    "network_mapping": networks
                }
            };
            dataService.updateClusterConfig(cluster.id, network_mapping).success(function(data) {
                wizardFactory.setNetworkMapping(networks);
                var commitState = {
                    "name": "network_mapping",
                    "state": "success",
                    "message": ""
                };
                wizardFactory.setCommitState(commitState);
            }).error(function(response) {
                var commitState = {
                    "name": "network_mapping",
                    "state": "error",
                    "message": response
                };
                wizardFactory.setCommitState(commitState);
            });
        };
    });

    wizardModule.controller('reviewCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService, $anchorScroll, $location) {
        var cluster = wizardFactory.getClusterInfo();
        $scope.servers = wizardFactory.getServers();
        $scope.interfaces = wizardFactory.getInterfaces();
        $scope.partition = wizardFactory.getPartition();
        $scope.network_mapping = wizardFactory.getNetworkMapping();
        $scope.server_credentials = wizardFactory.getServerCredentials();
        $scope.service_credentials = wizardFactory.getServiceCredentials();
        $scope.console_credentials = wizardFactory.getConsoleCredentials();
        $scope.global_config = wizardFactory.getGeneralConfig();

        $scope.cephConfig = wizardFactory.getCephConfig();
        $scope.neutronConfig = wizardFactory.getNeutronConfig();
        $scope.haConfig = wizardFactory.getHighAvailabilityConfig();

        dataService.getServerColumns().success(function(data) {
            $scope.server_columns = data.review;

            for (var i = 0; i < data.review.length; i++) {
                if (data.review[i].title == "Hostname") {
                    var temp = $scope.server_columns[0];
                    $scope.server_columns[0] = data.review[i];
                    $scope.server_columns[i] = temp;
                }
                if (data.review[i].title == "Host MAC Addr") {
                    var temp = $scope.server_columns[1];
                    $scope.server_columns[1] = data.review[i];
                    $scope.server_columns[i] = temp;
                }
                if (data.review[i].title == "Switch IP") {
                    var temp = $scope.server_columns[2];
                    $scope.server_columns[2] = data.review[i];
                    $scope.server_columns[i] = temp;
                }
                if (data.review[i].title == "Port") {
                    var temp = $scope.server_columns[3];
                    $scope.server_columns[3] = data.review[i];
                    $scope.server_columns[i] = temp;
                }
            }
        });

        $scope.scrollTo = function(id) {
            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            $location.hash(old);
        };

        $scope.tabs = [{
            "title": "Database & Queue",
            "url": "service.tpl.html"
        }, {
            "title": "Keystone User",
            "url": "console.tpl.html"
        }];

        if ($scope.currentAdapterName == "ceph_openstack_icehouse") {
            $scope.tabs.push({
                "title": "Ceph",
                "url": "ceph.tpl.html"
            });
        }

        $scope.currentTab = $scope.tabs[0].url;

        $scope.onClickTab = function(tab) {
            $scope.currentTab = tab.url;
        }

        $scope.isActiveTab = function(tabUrl) {
            return tabUrl == $scope.currentTab;
        }

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: $scope.servers.length + 1 // count per page
        }, {
            counts: [], // hide count-per-page box
            total: $scope.servers.length, // length of data
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
                    $filter('orderBy')($scope.servers, function(item) {
                        if (orderByColumn == "switch_ip") {
                            return sortingService.ipAddressPre(item.switch_ip);
                        } else {
                            return item[orderByColumn];
                        }
                    }, reverse) : $scope.servers;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.$watch(function() {
            return wizardFactory.getCommitState()
        }, function(newCommitState, oldCommitState) {
            if (newCommitState !== undefined) {
                if (newCommitState.name == "review" && newCommitState.state == "triggered") {
                    $scope.commit();
                }
            }
        });

        $scope.commit = function() {
            var reviewAction = {
                "review": {
                    "hosts": []
                }
            };
            var deployAction = {
                "deploy": {
                    "hosts": []
                }
            };
            angular.forEach($scope.servers, function(server) {
                reviewAction.review.hosts.push(server.id);
                deployAction.deploy.hosts.push(server.id);
            });

            dataService.postClusterActions(cluster.id, reviewAction).success(function(data) {
                dataService.postClusterActions(cluster.id, deployAction).success(function(data) {
                    var commitState = {
                        "name": "review",
                        "state": "success",
                        "message": ""
                    };
                    wizardFactory.setCommitState(commitState);
                }).error(function(data) {
                    console.warn("Deploy hosts error: ", data);
                });
            }).error(function(data) {
                console.warn("Review hosts error: ", data);
            });
            //TODO: error handling
        };

        $scope.returnStep = function(reviewName) {
            for (var i = 0; i < $scope.steps.length; i++) {
                if (reviewName == $scope.steps[i].name) {
                    $scope.skipForward(i + 1);
                }
            }
        };
    });

    wizardModule.directive('ngKeypress', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 9) { // 9 is tab key
                    var current = attrs.position;
                    var result = current.split('_');
                    var next = result[0] + "_" + (parseInt(result[1]) + 1);
                    if ($("input[data-position=" + next + "]").length) {

                        $("input[data-position=" + next + "]").focus();
                    } else {
                        $(".btn-next").focus();
                    }
                    event.preventDefault();
                }
            });
        };
    });


    //Used for roles panel on Role Assignment page
    wizardModule.directive("rolepanelscroll", function($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                var window_top = this.pageYOffset;
                var sticky_anchor_elem = angular.element($('#sticky-anchor'));
                var window_height = $(window).height();
                var scroll_panel_height = $('.role-assign-drag').height();
                if (sticky_anchor_elem.length != 0) {
                    var div_top = sticky_anchor_elem.offset().top;
                    if (window_top > div_top + 10 && window_height > scroll_panel_height + 150) {
                        $('.role-panel').addClass('stick');
                    } else {
                        $('.role-panel').removeClass('stick');
                    }
                    scope.$apply();
                }
            });
        };
    });

    var wizardModalInstanceCtrl = function($scope, $modalInstance, warning) {
        $scope.warning = warning;

        $scope.ok = function() {
            $modalInstance.close();
        };
    };


    var addSubnetModalInstanceCtrl = function($scope, $modalInstance, $q, subnets, dataService, $filter) {
        $scope.subnetworks = angular.copy(subnets);
        $scope.subnetAllValid = true;

        angular.forEach($scope.subnetworks, function(subnet) {
            subnet['valid'] = true;
        });

        var allValid = function() {
            var invalid = 0;
            angular.forEach($scope.subnetworks, function(subnet) {
                if (subnet['valid'] == false) {
                    invalid = 1;
                }
            });
            if (invalid == 0) {
                $scope.subnetAllValid = true;
            } else {

                $scope.subnetAllValid = false;
            }
        }
        $scope.subnet_change = function(index, subnet) {
            var subnetRegExp = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}(\/){1}([0-9]|[0-2][0-9]|3[0-2])$/;
            var valid = subnetRegExp.test(subnet);
            $scope.subnetworks[index]['valid'] = valid;
            allValid();
        };

        $scope.ok = function() {
            var newsubnetworks = [];
            var promises = [];
            angular.forEach($scope.subnetworks, function(subnet) {
                var requestData = {
                    "subnet": subnet.subnet
                }
                if (subnet.id === undefined) {
                    // post subnetworks
                    var updateSubnetConfig = dataService.postSubnetConfig(requestData).then(function(subnetData) {
                        newsubnetworks.push(subnetData.data);
                    }, function(response) {
                        return $q.reject(response);
                    });
                    promises.push(updateSubnetConfig);
                } else {
                    // put subnetworks
                    var updateSubnetConfig = dataService.putSubnetConfig(subnet.id, requestData).then(function(subnetData) {
                        newsubnetworks.push(subnetData.data);
                    }, function(response) {
                        return $q.reject(response);
                    });
                    promises.push(updateSubnetConfig);
                }
            });

            $q.all(promises).then(function() {
                $scope.subnetworks = newsubnetworks;
                for (var i = 0; i < subnets.length && i < $scope.subnetworks.length; i++) {
                    $scope.subnetworks[i].$$hashKey = subnets[i].$$hashKey;
                }
                $modalInstance.close($scope.subnetworks);
            }, function(response) {
                console.log("promises error", response);
                $scope.alerts = [];
                $scope.alerts.push({
                    "message": response
                });
            });
        };

        $scope.cancel = function() {

            $scope.subnetworks = $filter('filter')($scope.subnetworks, {
                valid: true
            }, true);
            $modalInstance.dismiss('cancel');

        };

        $scope.closeAlert = function() {
            $scope.alerts = [];
        };

        $scope.addSubnetwork = function() {
            $scope.subnetworks.push({
                valid: false
            });
            allValid();
        };

        $scope.removeSubnetwork = function(index) {
            dataService.deleteSubnet($scope.subnetworks[index].id).success(function(data) {
                $scope.subnetworks.splice(index, 1);
            }).error(function(response) {
                $scope.alerts = [];
                $scope.alerts.push({
                    "message": response
                });
            });
            allValid();
        };

        $scope.$watch('subnetworks', function() {
            if ($scope.subnetworks.length == 0) {
                $scope.subnetworks.push({});
            }
        }, true);

    };
});
