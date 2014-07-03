angular.module('compass.wizard', [
    'ui.router',
    'ui.bootstrap',
    'ngTable',
    'compass.charts'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('wizard', {
            url: '/wizard',
            controller: 'wizardCtrl',
            templateUrl: 'src/app/wizard/wizard.tpl.html'
        });
})

.controller('wizardCtrl', function($scope, dataService, wizardFactory) {
    $scope.clusterInfo = wizardFactory.getClusterInfo();
    console.info("$scope.clusterInfo", $scope.clusterInfo)

    // current step for create-cluster wizard
    $scope.currentStep = 1;

    // get the wizard steps for create-cluster
    dataService.getWizardSteps().success(function(data) {
        // get the wizard steps for os, ts or os_and_ts
        $scope.steps = data["os_and_ts"];
        wizardFactory.setSteps($scope.steps);

        // change ui steps css if currentStep changes
        $scope.$watch('currentStep', function(newStep, oldStep) {
            if (newStep > 0 && newStep <= $scope.steps.length) {
                if (newStep > oldStep) {
                    $scope.steps[newStep - 1].state = "active";
                    for (var i = 0; i < newStep - 1; i++)
                        $scope.steps[i].state = "complete";
                } else if (newStep < oldStep) {
                    $scope.steps[newStep - 1].state = "active";
                    for (var j = newStep; j < $scope.steps.length; j++)
                        $scope.steps[j].state = "";
                }
            }
        });

        // go to next step
        $scope.stepForward = function() {
            // trigger commit for current step
            var commitState = {
                "name": $scope.steps[$scope.currentStep - 1].name,
                "state": "triggered",
                "message": ""
            };
            wizardFactory.setCommitState(commitState);

            // watch commit state change
            $scope.$watch(function() {
                return wizardFactory.getCommitState()
            }, function(newCommitState, oldCommitState) {


                switch (newCommitState.name) {
                    case "sv_selection":
                    case "os_global":
                    case "network":
                    case "partition":
                    case "security":
                    case "role_assign":
                    case "network_mapping":
                        if (newCommitState.name == $scope.steps[$scope.currentStep - 1].name && newCommitState.state == "success") {
                            console.info("### catch success in wizardCtrl ###", newCommitState, oldCommitState);
                            $scope.next();
                        } else if (newCommitState.state == "error") {
                            // TODO: error handling / display error message
                        }
                        break;
                    case "review":
                        // TODO: go to cluster overview page
                        break;
                    default:
                        break;
                }
            })
        };

        $scope.next = function() {
            if ($scope.currentStep < $scope.steps.length)
                $scope.currentStep = $scope.currentStep + 1;
        }

        // go to previous step
        $scope.stepBackward = function() {
            if ($scope.currentStep > 1) {
                $scope.currentStep = $scope.currentStep - 1;
            }
        };

        // go to step by stepId
        $scope.goToStep = function(stepId) {
            $scope.currentStep = stepId;
        };
    });


    dataService.getAllMachineHosts().success(function(data) {
        wizardFactory.setAllMachinesHost(data);
    });

})

.controller('svSelectCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams) {
    $scope.hideunselected = '';
    $scope.search = {};

    $scope.allservers = wizardFactory.getAllMachinesHost();

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

.controller('globalCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();

    //For General Section
    $scope.general = wizardFactory.getGeneralConfig();

    //TODO: bug - should not set dns_servers and search_path to empty
    $scope.general["dns_servers"] = [""];
    $scope.general["search_path"] = [""];

    $scope.addDNSServer = function() {
        $scope.general['dns_servers'].push("");
    };
    $scope.addSearchPath = function() {
        $scope.general['search_path'].push("");
    };
    dataService.getTimezones().success(function(data) {
        $scope.timezones = data;
    });

    //For Subnetworks Section
    $scope.subnetworks = wizardFactory.getSubnetworks();
    $scope.addSubnetwork = function() {
        $scope.subnetworks.push({});
        console.log($scope.subnetworks);
    };
    $scope.removeSubnetwork = function(index) {
        $scope.subnetworks.splice(index, 1)
    };
    $scope.$watch('subnetworks', function() {
        if ($scope.subnetworks.length == 0) {
            $scope.subnetworks.push({});
        }
    }, true);

    //For Routing Table Section
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
        $scope.updateClusterConfig();
        $scope.updateSubnet();
        $scope.updateRoutingTable();

        console.info("$$$$ ", wizardFactory.getSubnetworks(), wizardFactory.getRoutingTable(), wizardFactory.getGeneralConfig())

        //TODO: should have check here to see if each part is updated successfully
        var commitState = {
            "name": "os_global",
            "state": "success",
            "message": ""
        };
        wizardFactory.setCommitState(commitState);
    };

    $scope.updateClusterConfig = function() {
        var os_global_general = {
            "os_config": {
                "general": $scope.general
            }
        };
        // put cluster config
        dataService.updateClusterConfig(cluster.id, os_global_general).success(function(configData) {
            wizardFactory.setGeneralConfig(configData["os_config"]["general"]);
        });
    };

    $scope.updateSubnet = function() {
        var subnetCount = $scope.subnetworks.length;
        var subnetworks = [];
        var i = 0;

        angular.forEach($scope.subnetworks, function(subnet) {
            if (subnet.subnet_id === undefined) {
                // post cluster subnet-config
                dataService.postClusterSubnetConfig(cluster.id, subnet).success(function(subnetData) {
                    subnetworks.push(subnetData);
                    i++;
                    if (i == subnetCount) {
                        $scope.subnetworks = subnetworks;
                        wizardFactory.setSubnetworks($scope.subnetworks);
                    }
                })
            } else {
                // put cluster subnet-config
                dataService.putClusterSubnetConfig(cluster.id, subnet.subnet_id, subnet).success(function(subnetData) {
                    subnetworks.push(subnetData);
                    i++;
                    if (i == subnetCount) {
                        $scope.subnetworks = subnetworks;
                        wizardFactory.setSubnetworks($scope.subnetworks);
                    }
                })
            }
        })
    };

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
})

.controller('networkCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.subnetworks = wizardFactory.getSubnetworks();
    $scope.interfaces = wizardFactory.getInterfaces();
    $scope.servers = wizardFactory.getServers();

    dataService.getServerColumns().success(function(data) {
        $scope.server_columns = data.showless;
    });

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: $scope.servers.length + 1 // count per page
    }, {
        counts: [], // hide count-per-page box
        total: $scope.servers.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                $filter('orderBy')($scope.servers, params.orderBy()) : $scope.servers;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
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
                "subnet_id": newInterface.subnet_id,
                "is_mgmt": false,
            }
        }
        $scope.newInterface = {};
    };

    $scope.deleteInterface = function(delInterface) {
        delete $scope.interfaces[delInterface];
        angular.forEach($scope.servers, function(sv) {
            delete sv.network[delInterface];
        })
    };

    $scope.initHostIpByInterface = function(interfaceName) {
        if ($scope.servers.network[interfaceName] === undefinded) {
            $scope.servers.network[interfaceName] = {};
        }
    };

    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        console.info("### catch commit change in networkCtrl ###", newCommitState);

        if (newCommitState !== undefined) {
            if (newCommitState.name == "network" && newCommitState.state == "triggered") {
                $scope.commitNetwork();
            } else if (newCommitState.name == "network_mapping" && newCommitState.state == "triggered") {
                $scope.commitNetworkMapping();
            }
        }
    });

    $scope.commitNetwork = function() {
        var addHostsAction = {
            "add_hosts": {
                "machines": []
            }
        };
        angular.forEach($scope.servers, function(server) {
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
        });

        var interfaceCount = Object.keys($scope.interfaces).length;
        if (interfaceCount == 0) {
            alert("Please add interface");
        } else {
            // add hosts
            dataService.postClusterActions(cluster.id, addHostsAction).success(function(data) {
                var hosts = data.hosts;
                for (var i = 0; i < $scope.servers.length; i++) {
                    for (var j = 0; j < hosts.length; j++) {
                        if ($scope.servers[i].machine_id == hosts[j].machine_id) {
                            $scope.servers[i].host_id = hosts[j].id;
                            break;
                        }
                    }
                }
                wizardFactory.setServers($scope.servers);

                $scope.serverCount = $scope.servers.length;
                var i = 0;
                // post host network
                angular.forEach($scope.servers, function(server) {
                    $scope.networkCount = Object.keys(server.network).length;
                    angular.forEach(server.network, function(value, key) {
                        var network = {
                            "interface": key,
                            "ip": value.ip,
                            "subnet_id": $scope.interfaces[key].subnet_id,
                            "is_mgmt": $scope.interfaces[key].is_mgmt
                        };

                        dataService.postHostNetwork(server.host_id, network).success(function(data) {
                            i++;
                            if (i == $scope.serverCount * $scope.networkCount) {
                                wizardFactory.setInterfaces($scope.interfaces);
                                wizardFactory.setServers($scope.servers);
                                var commitState = {
                                    "name": "network",
                                    "state": "success",
                                    "message": ""
                                };
                                wizardFactory.setCommitState(commitState);
                            }
                        });
                    })
                });
            });
        }
    };

    $scope.commitNetworkMapping = function() {
        var commitState = {
            "name": "network_mapping",
            "state": "success",
            "message": ""
        };
        wizardFactory.setCommitState(commitState);
    };

    $scope.autofill = function() {
        //TODO: add auto fill
        alert("Autofill coming soon");
    }
})

.controller('partitionCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.partition = wizardFactory.getPartition();

    $scope.addPartition = function() {
        var mount_point = $scope.newPartition.mount_point;
        $scope.partition[mount_point] = {};
        $scope.partition[mount_point].size_percentage = $scope.newPartition.size_percentage;
        $scope.partition[mount_point].max_size = $scope.newPartition.max_size;
        $scope.newPartition = {};
    };

    $scope.deletePartition = function(mount_point) {
        delete $scope.partition[mount_point];
    };

    $scope.$watch('partition', function() {
        console.log("changed")
        $scope.partitionarray = [];
        angular.forEach($scope.partition, function(value, key) {
            $scope.partitionarray.push({
                "name": key,
                "number": value.size_percentage
            });
        });
    }, true);

    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        console.info("### catch commit change in partitionCtrl ###", newCommitState);
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
        });
        //TODO: error handling
    };
})

.controller('securityCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();

    //For Service Credentials Section
    $scope.service_credentials = {
        "rabbitmq": {
            "username": "guest",
            "password": "guest"
        },
        "compute": {
            "username": "nova",
            "password": "nova"
        },
        "dashboard": {
            "username": "dashboard",
            "password": "dashboard"
        },
        "identity": {
            "username": "keystone",
            "password": "keystone"
        },
        "image": {
            "username": "glance",
            "password": "glance"
        },
        "metering": {
            "username": "ceilometer",
            "password": "ceilometer"
        },
        "super": {
            "username": "root",
            "password": "root"
        },
        "volumn": {
            "username": "cinder",
            "password": "cinder"
        }
    };

    //For management console credentials
    $scope.management_credentials = {
        "admin": {
            "username": "admin",
            "password": "admin"
        },
        "compute": {
            "username": "nova",
            "password": "nova"
        },
        "dashboard": {
            "username": "dashboard",
            "password": "dashboard"
        },
        "image": {
            "username": "glance",
            "password": "glance"
        },
        "metering": {
            "username": "ceilometer",
            "password": "ceilometer"
        },
        "network": {
            "username": "quantum",
            "password": "quantum"
        },
        "object-store": {
            "username": "swift",
            "password": "swift"
        },
        "volumn": {
            "username": "cinder",
            "password": "cinder"
        }
    };

    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        console.info("### catch commit change in securityCtrl ###", newCommitState);
        if (newCommitState !== undefined) {
            if (newCommitState.name == "security" && newCommitState.state == "triggered") {
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {
        var partitionData = {};
        dataService.updateClusterConfig(cluster.id, partitionData).success(function(data) {
            var commitState = {
                "name": "security",
                "state": "success",
                "message": ""
            };
            wizardFactory.setCommitState(commitState);
        });
    };
})

.controller('roleAssignCtrl', function($scope, wizardFactory, dataService) {
    var cluster = wizardFactory.getClusterInfo();
    $scope.servers = wizardFactory.getServers();

    $scope.roles = wizardFactory.getAdapter().roles;

    $scope.removeRole = function(server, role) {
        var serverIndex = $scope.servers.indexOf(server);
        var roleIndex = $scope.servers[serverIndex].roles.indexOf(role);
        $scope.servers[serverIndex].roles.splice(roleIndex, 1);
    };

    $scope.assignRole = function(role) {
        // get selected servers and assign role to them
        var roleExist = false;
        for (var i = 0; i < $scope.servers.length; i++) {
            if ($scope.servers[i].checked) {
                for (var j = 0; j < $scope.servers[i].roles.length; j++) {
                    if (role.name == $scope.servers[i].roles[j].name) {
                        roleExist = true;
                    }
                }
            }
            if (!roleExist) {
                $scope.servers[i].roles.push(role);
            } else {
                roleExist = false;
            }
        }
    };

    $scope.$watch(function() {
        return wizardFactory.getCommitState()
    }, function(newCommitState, oldCommitState) {
        console.info("### catch commit change in networkCtrl ###", newCommitState);
        if (newCommitState !== undefined) {
            if (newCommitState.name == "role_assign" && newCommitState.state == "triggered") {
                $scope.commit();
            }
        }
    });

    $scope.commit = function() {

        var commitState = {
            "name": "role_assign",
            "state": "success",
            "message": ""
        };
        wizardFactory.setCommitState(commitState);
    };
})
