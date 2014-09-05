angular.module('compass.wizard', [
    'ui.router',
    'ui.bootstrap',
    'ngTable',
    'compass.charts',
    'compass.findservers',
    'ngDragDrop',
    'ngTouch',
    'angularSpinner'
])

.config(function config($stateProvider) {
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
                    dataService.getAllMachineHosts(clusterData.os_id).success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                wizardStepsData: function($q, dataService) {
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
                }
            }
        });
})

.controller('wizardCtrl', function($scope, dataService, wizardFactory, $stateParams, $state, $modal, clusterData, machinesHostsData, wizardStepsData, clusterConfigData, usSpinnerService) {
    $scope.clusterId = $stateParams.id;
    $scope.cluster = clusterData;
    wizardFactory.setClusterInfo($scope.cluster);
    wizardFactory.setAllMachinesHost(machinesHostsData);

    var oldConfig = clusterConfigData;

    // get pre-config data for wizard
    if ($stateParams.config == "true") {
        dataService.getWizardPreConfig().success(function(data) {
            wizardFactory.preConfig(data);

            console.log("@@@", data)
            console.log("~@@~~", wizardFactory.getConsoleCredentials())

            if(oldConfig.os_config) {
                if(oldConfig.os_config.general) {
                    wizardFactory.setGeneralConfig(oldConfig.os_config.general);
                }
                if(oldConfig.os_config.partition) {
                    wizardFactory.setPartition(oldConfig.os_config.partition);
                }
                if(oldConfig.os_config.server_credentials) {
                    wizardFactory.setServerCredentials(oldConfig.os_config.server_credentials);
                }                
            }
            if(oldConfig.package_config) {
                if(oldConfig.package_config.security) {
                    if(oldConfig.package_config.security.service_credentials) {
                        wizardFactory.setServiceCredentials(oldConfig.package_config.security.service_credentials);
                    }
                    if(oldConfig.package_config.security.console_credentials) {
                        console.log("hereeee")
                        wizardFactory.setConsoleCredentials(oldConfig.package_config.security.console_credentials);
                    }
                }
                if(oldConfig.package_config.network_mapping) {
                    wizardFactory.setNetworkMapping(oldConfig.package_config.network_mapping);
                }
            }

        });
    }

    console.log("~~~", wizardFactory.getConsoleCredentials())

    $scope.currentStep = 1;
    $scope.maxStep = 1;
    $scope.pendingStep = 1;

    // get the create-cluster-wizard steps for os, ts or os_and_ts
    $scope.steps = wizardStepsData["os_and_ts"];
    wizardFactory.setSteps($scope.steps);

    // start loading spinner
    $scope.startSpin = function() {
        usSpinnerService.spin('spinner-1');
    };

    // stop loading spinner
    $scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
    };

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

                $scope.stepControl();

                if ($scope.currentStep > $scope.maxStep) {
                    $scope.maxStep = $scope.currentStep;
                }

            } else if (newCommitState.state == "error") {
                console.warn("### catch error in wizardCtrl ###", newCommitState, oldCommitState);
                $scope.openErrMessageModal(newCommitState.message);

            }
        }
    });

    $scope.stepControl = function() {
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
                $scope.updateStepProgress($scope.pendingStep, $scope.currentStep);
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

    // Updates CSS Classes on Step state change
    $scope.updateStepProgress = function(newStep, oldStep) {
        $scope.steps[newStep - 1].state = "active";
        $scope.steps[oldStep - 1].state = "complete";
        if (newStep == 1) {
            if ($scope.maxStep > 2) {
                $scope.steps[2].state = "incomplete";
            }
            if ($scope.maxStep > 5) {
                $scope.steps[5].state = "incomplete";
            }
            if ($scope.maxStep > 6) {
                $scope.steps[6].state = "incomplete";
            }
        }
        if (newStep == 3) {
            if ($scope.maxStep > 5) {
                $scope.steps[5].state = "incomplete";
            }
            if ($scope.maxStep > 6) {
                $scope.steps[6].state = "incomplete";
            }
        }
        if (oldStep == 8) {
            $scope.steps[7].state = "";
        }
    };

    $scope.triggerCommit = function(stepId) {
        if ($scope.steps[stepId - 1].name != "review") {
            var commitState = {
                "name": $scope.steps[stepId - 1].name,
                "state": "triggered",
                "message": {}
            };
            wizardFactory.setCommitState(commitState);
        } else {
            $scope.stepControl();
            $scope.updateStepProgress($scope.pendingStep, 8);
            //$scope.updateStepProgress($scope.pendingStep, stepId);
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
        $scope.triggerCommit($scope.currentStep);
    };

    // go to previous step
    $scope.stepBackward = function() {
        $scope.pendingStep = $scope.currentStep - 1;
        $scope.triggerCommit($scope.currentStep);
    };

    // go to step by stepId
    $scope.skipForward = function(stepId) {
        if ($scope.currentStep != stepId) {
            $scope.pendingStep = stepId;
            $scope.triggerCommit($scope.currentStep);
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
})

.controller('svSelectCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService) {
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
                sv.selected = true;
            })
        } else {
            angular.forEach($scope.allservers, function(sv) {
                sv.selected = false;
            })
        }
    };

    dataService.getServerColumns().success(function(data) {
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
            var message = {
                "message": "Please select at least one server"
            }
            var commitState = {
                "name": "sv_selection",
                "state": "error",
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
                if(server.selected) {
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
                    "state": "success",
                    "message": response
                };
                wizardFactory.setCommitState(commitState);                
            });
            //wizardFactory.setServers(selectedServers);
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

})

.controller('globalCtrl', function($scope, wizardFactory, dataService, $q) {
    var cluster = wizardFactory.getClusterInfo();

    $scope.general = wizardFactory.getGeneralConfig();

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
                $scope.commit();
            }
        }
    });



    $scope.commit = function() {
        var os_global_general = {
            "os_config": {
                "general": $scope.general
            }
        };
        dataService.updateClusterConfig(cluster.id, os_global_general).success(function(configData) {
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
})

.controller('networkCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService, $q, $modal) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.subnetworks = wizardFactory.getSubnetworks();
    $scope.interfaces = wizardFactory.getInterfaces();
    //$scope.servers = wizardFactory.getServers();

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.showless;
    });

    dataService.getClusterHosts(cluster.id).success(function(data) {
        $scope.servers = data;
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
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {
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
            $scope.subnetworks = subnets;
        }, function() {
            console.log("modal dismissed")
        })
    };

    $scope.autofill = function() {
        // Autofill IP for each interface
        angular.forEach($scope.interfaces, function(value, key) {
            var ip_start = $("#" + key + "-ipstart").val();
            var interval = parseInt($("#" + key + "-increase-num").val());
            $scope.fillIPBySequence(ip_start, interval, key);
        })
        // Autofill hostname
        var hostname_rule = $("#hostname-rule").val();
        $scope.fillHostname(hostname_rule);
    };

    $scope.fillHostname = function(rule) {
        if (rule) {
            switch (rule) {
                case "host":
                    var server_index = 1;
                    angular.forEach($scope.servers, function(server) {
                        server.name = "host-" + server_index;
                        server_index++;
                    })
                    break;
                case "switch_ip":
                    angular.forEach($scope.servers, function(server) {
                        server.name = server.switch_ip.replace(/\./g, "-") + "-p" + server.port;
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
                ipParts[2]++;
            }
            if (ipParts[2] > 255) {
                ipParts[2] = ipParts[2] - 256;
                ipParts[1]++;
            }
            if (ipParts[1] > 255) {
                ipParts[1] = ipParts[1] - 256;
                ipParts[0]++;
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
})

.controller('partitionCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.partition = wizardFactory.getPartition();

    $scope.addPartition = function() {
        var mount_point = $scope.newPartition.mount_point;
        $scope.partition[mount_point] = {};
        $scope.partition[mount_point].percentage = $scope.newPartition.percentage;
        $scope.partition[mount_point].max_size = $scope.newPartition.max_size;
        $scope.newPartition = {};
    };

    $scope.deletePartition = function(mount_point) {
        delete $scope.partition[mount_point];
    };

    $scope.$watch('partition', function() {
        $scope.partitionarray = [];
        var total = 0;
        angular.forEach($scope.partition, function(value, key) {
            total += parseFloat(value.percentage);
            $scope.partitionarray.push({
                "name": key,
                "number": value.percentage
            });
        });
        $scope.partitionarray.push({
            "name": "others",
            "number": 100 - total
        })
    }, true);

    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        if (newCommitState !== undefined) {
            if (newCommitState.name == "partition" && newCommitState.state == "triggered") {
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {
        var os_partition = {
            "os_config": {
                "partition": $scope.partition
            }
        };
        dataService.updateClusterConfig(cluster.id, os_partition).success(function(configData) {
            wizardFactory.getPartition(configData["os_config"]["partition"]);
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
    };
})

.controller('securityCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.server_credentials = wizardFactory.getServerCredentials();
    $scope.service_credentials = wizardFactory.getServiceCredentials();
    $scope.console_credentials = wizardFactory.getConsoleCredentials();


    console.log($scope.console_credentials);
    console.log($scope.service_credentials);

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
            if (newCommitState.name == "security" && newCommitState.state == "triggered") {
                $scope.commit();
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

    $scope.commit = function() {
        var securityData = {
            "os_config": {
                "server_credentials": {
                    "username": $scope.server_credentials.username,
                    "password": $scope.server_credentials.password
                }
            },
            "package_config": {
                "security": {
                    "service_credentials": $scope.service_credentials,
                    "console_credentials": $scope.console_credentials
                }
            }
        };
        dataService.updateClusterConfig(cluster.id, securityData).success(function(data) {
            var commitState = {
                "name": "security",
                "state": "success",
                "message": ""
            };
            wizardFactory.setCommitState(commitState);
        }).error(function(response) {
            var commitState = {
                "name": "security",
                "state": "error",
                "message": response
            };
            wizardFactory.setCommitState(commitState);
        });
    };
})

.controller('roleAssignCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService, $q) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.servers = wizardFactory.getServers();

    dataService.getClusterById(cluster.id).success(function(data) {
        // wizardFactory.setAdapter(data);
        $scope.roles = data.flavor.roles;
    });

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.showless;
    });

    $scope.selectAllServers = function(flag) {
        if (flag) {
            angular.forEach($scope.servers, function(sv) {
                sv.checked = true;
            })
        } else {
            angular.forEach($scope.servers, function(sv) {
                sv.checked = false;
            })
        }
    };

    $scope.removeRole = function(server, role) {
        var serverIndex = $scope.servers.indexOf(server);
        var roleIndex = $scope.servers[serverIndex].roles.indexOf(role);
        $scope.servers[serverIndex].roles.splice(roleIndex, 1);
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
        })
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
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {
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
})

.controller('networkMappingCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.interfaces = wizardFactory.getInterfaces();
    $scope.original_networking = wizardFactory.getNetworkMapping();
    $scope.pendingInterface = "";

    $scope.onDrop = function($event, key) {
        $scope.pendingInterface = key;
    };

    angular.forEach($scope.interfaces, function(value, key) {
        $scope.interfaces[key].dropChannel = "E";
    })


    $scope.networking = {};
    angular.forEach($scope.original_networking, function(value, key) {
        $scope.networking[key] = {};
        $scope.networking[key].mapping_interface = value;
        if (key == "public") {
            $scope.networking[key].dragChannel = "P";
        } else
            $scope.networking[key].dragChannel = "E";
    })

    $scope.dropSuccessHandler = function($event, key, dict) {
        dict[key].mapping_interface = $scope.pendingInterface;
        console.log($scope.pendingInterface);
    };

    angular.forEach($scope.interfaces, function(value, key) {
        // The interface with promisc mode is required to be set as Public Network
        if (value.is_promiscuous) {
            $scope.networking["public"].mapping_interface = key;
            $scope.interfaces[key].dropChannel = "P";
        }
    });


    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        if (newCommitState !== undefined) {
            if (newCommitState.name == "network_mapping" && newCommitState.state == "triggered") {
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {
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
            wizardFactory.setNetworkMapping($scope.networking);
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
})

.controller('reviewCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams, sortingService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.servers = wizardFactory.getServers();
    $scope.interfaces = wizardFactory.getInterfaces();
    $scope.partition = wizardFactory.getPartition();
    $scope.network_mapping = wizardFactory.getNetworkMapping();
    $scope.server_credentials = wizardFactory.getServerCredentials();
    $scope.service_credentials = wizardFactory.getServiceCredentials();
    $scope.console_credentials = wizardFactory.getConsoleCredentials();
    $scope.global_config = wizardFactory.getGeneralConfig();

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.review;
    });

    $scope.tabs = [{
        title: 'Database & Queue',
        url: 'service.tpl.html'
    }, {
        title: 'Keystone User',
        url: 'console.tpl.html'
    }, {
        title: 'Server',
        url: 'server.tpl.html'
    }];

    $scope.currentTab = $scope.tabs[0].url;

    $scope.onClickTab = function(tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: $scope.servers.length + 1// count per page
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
        })
        //TODO: error handling
    };
});

var wizardModalInstanceCtrl = function($scope, $modalInstance, warning) {
    $scope.warning = warning;

    $scope.ok = function() {
        $modalInstance.close();
    };
};

var addSubnetModalInstanceCtrl = function($scope, $modalInstance, $q, subnets, dataService) {
    $scope.subnetworks = subnets;

    $scope.ok = function() {
        var subnetworks = [];
        var promises = [];
        angular.forEach($scope.subnetworks, function(subnet) {
            if (subnet.id === undefined) {
                // post subnetworks
                var updateSubnetConfig = dataService.postSubnetConfig(subnet).then(function(subnetData) {
                    subnetworks.push(subnetData.data);
                }, function(response) {
                    return $q.reject(response);
                });
                promises.push(updateSubnetConfig);
            } else {
                // put subnetworks
                var updateSubnetConfig = dataService.putSubnetConfig(subnet.id, subnet).then(function(subnetData) {
                    subnetworks.push(subnetData.data);
                }, function(response) {
                    return $q.reject(response);
                });
                promises.push(updateSubnetConfig);
            }
        });

        $q.all(promises).then(function() {
            $scope.subnetworks = subnetworks;
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
        $modalInstance.dismiss('cancel');
    };

    $scope.closeAlert = function() {
        $scope.alerts = [];
    };

    $scope.addSubnetwork = function() {
        $scope.subnetworks.push({});
    };

    $scope.removeSubnetwork = function(index) {
        $scope.subnetworks.splice(index, 1)
    };

    $scope.$watch('subnetworks', function() {
        if ($scope.subnetworks.length == 0) {
            $scope.subnetworks.push({});
        }
    }, true);

};
