angular.module('compass.wizard', [
    'ui.router',
    'ui.bootstrap',
    'ngTable'
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
            if ($scope.steps[$scope.currentStep - 1].title == "Server Selection") {
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
                } else {
                    //TODO: api call - add host
                    wizardFactory.setServers(selectedServers);
                    console.info("wizardFactory.getServers", wizardFactory.getServers());
                    $scope.next();
                }

            } else if ($scope.steps[$scope.currentStep - 1].title == "OS Global Config") {
                //var general_config = $('#generalForm').serializeObject();
                //$scope.general = general_config;
                var global_os_config = {
                    "os_config": {
                        "global": $scope.general,
                        "subnetworks": $scope.subnetworks,
                        "route_table": $scope.routingtable
                    }
                };
                console.log(global_os_config);
                //TODO modify api call
                dataService.updateClusterConfig(1, global_os_config).success(function(data) {
                    console.info("success")
                    $scope.next();
                })
            } else if ($scope.steps[$scope.currentStep - 1].title == "Partition") {
                var partitionData = {};
                angular.forEach($scope.partition, function(pa) {
                    console.log(pa);
                    if (partitionData[pa.mount_point] !== undefined) {
                        if (!partitionData[pa.mount_point].push) {
                            partitionData[pa.mount_point] = [partitionData[pa.mount_point]];
                        }
                        partitionData[pa.mount_point].push({
                            "size_percentage": pa.size_percentage,
                            "max_size": pa.max_size
                        } || {});
                    } else {
                        partitionData[pa.mount_point] = {
                            "size_percentage": pa.size_percentage,
                            "max_size": pa.max_size
                        } || {};
                    }
                });
                dataService.updateClusterConfig(1, partitionData).success(function(data) {
                    $scope.next();
                })
            } else {
                $scope.next();
            }
        };

        $scope.next = function() {
            if ($scope.currentStep < $scope.steps.length)
                $scope.currentStep = $scope.currentStep + 1;
        }

        // go to previous step
        $scope.stepBackward = function() {
            if ($scope.currentStep > 1)
                $scope.currentStep = $scope.currentStep - 1;
        };

        // go to step by stepId
        $scope.goToStep = function(stepId) {
            $scope.currentStep = stepId;
        };


    });

    dataService.getServers().success(function(data) {
        $scope.allservers = data;
    });


    //For Server Selection Section
    $scope.selectall = false;
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
    }
    //TODO: show only selected servers



    dataService.getAdapterConfig().success(function(data) {
        $scope.os_global_config = data['os_config']['centos']['global'];
        //console.log("###", $scope.os_global_config);

        var os_security = data['os_config']['centos']['security'];
        var adapter_security = data['adapter_config']['security'];

        $scope.security = {
            'os_security': os_security,
            'adapter_security': adapter_security
        };
        //console.log($scope.security);
    });

    //For General Section
    $scope.general = {
        "dns_servers": [""],
        "search_path": [""]
    };
    $scope.addDNSServer = function() {
        $scope.general['dns_servers'].push("");
    }
    $scope.addSearchPath = function() {
        $scope.general['search_path'].push("");
    }


    //For Subnetworks Section
    $scope.subnetworks = [];
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
    $scope.routingtable = [];
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


    //For Partition Section
    $scope.partition = []
    $scope.addPartition = function() {
        $scope.partition.push({});
        console.log($scope.partition);
    };
    $scope.$watch('partition', function() {
        if ($scope.partition.length == 0) {
            $scope.partition.push({});
        }
    }, true);

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
    }

})

.controller('roleAssignCtrl', function($scope, wizardFactory) {
    $scope.servers = wizardFactory.getServers();
    console.info("~~~~~", wizardFactory.getServers());

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
})

.controller('networkCtrl', function($scope, wizardFactory, dataService, $filter, ngTableParams) {
    var cluster = wizardFactory.getClusterInfo();

    $scope.servers = wizardFactory.getServers();

    dataService.getServerColumns().success(function(data) {
        console.info(data)
        $scope.server_columns = data.showless;
    });

    dataService.getClusterSubnetConfig(cluster.id).success(function(data) {
        $scope.subnetworks = data;
    });

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: $scope.servers.length // count per page       
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


    $scope.interfaces = ["eth0", "eth1", "eth2", "eth3"];

    $scope.addInterface = function(newInterface) {
        var isExist = false;
        angular.forEach($scope.interfaces, function(interface) {
            if (interface == newInterface) {
                isExist = true;
                alert("This interface already exists. Please try another one");
            }
        })
        if (!isExist) {
            $scope.interfaces.push(newInterface);
        }
        $scope.newInterface = "";
    };

    $scope.deleteInterface = function(delInterface) {
        var delIndex = $scope.interfaces.indexOf(delInterface);
        $scope.interfaces.splice(delIndex, 1);
        angular.forEach($scope.servers, function(sv) {
            delete sv.network[delInterface];
        })
    }

    $scope.autofill = function() {
        //TODO: add auto fill
        alert("Autofill coming soon");
    }
})
