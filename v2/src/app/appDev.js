var compassAppDev = angular.module('compassAppDev', ['compass', 'ngMockE2E']);

compassAppDev.run(function($httpBackend, settings, $http) {
    var progressPercent = 0;

    // Allow all calls not to the API to pass through normally
    $httpBackend.whenGET(new RegExp('src\/.*')).passThrough();
    $httpBackend.whenGET(new RegExp('data\/.*')).passThrough();

    $httpBackend.whenPOST(settings.apiUrlBase + '/login').respond(function(method, url, data) {
        console.log(method, url, data);
        var user = {
            "name": "huawei"
        }
        return [200, user, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/adapters').respond(function(method, url, data) {
        console.log(method, url);
        var adapters = [{
            "id": 1,
            "name": "openstack",
            "display": "OpenStack",
            "os_installer": "cobbler",
            "package_installer": "chef",
            "roles": [{
                "display_name": "Compute",
                "name": "os-compute-worker"
            }, {
                "display_name": "Controller",
                "name": "os-controller"
            }, {
                "display_name": "Network",
                "name": "os-network"
            }, {
                "display_name": "Storage",
                "name": "os-block-storage-worker"
            }],
            "compatible_os": [{
                "name": "CentOs",
                "os_id": 1
            }, {
                "name": "Ubuntu",
                "os_id": 2
            }]
        }, {
            "id": 2,
            "name": "hadoop",
            "display": "Hadoop",
            "os_installer": "cobbler",
            "package_installer": "chef",
            "roles": [{
                "display_name": "Compute",
                "name": "os-compute-worker"
            }, {
                "display_name": "Controller",
                "name": "os-controller"
            }, {
                "display_name": "Network",
                "name": "os-network"
            }],
            "compatible_os": [{
                "name": "CentOs",
                "os_id": 1
            }]
        }];
        return [200, adapters, {}];
    });

    $httpBackend.whenGET(/\.*\/adapters\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url);
        var adapter = {
            "id": 1,
            "name": "openstack",
            "display": "OpenStack",
            "os_installer": "cobbler",
            "package_installer": "chef",
            "roles": [{
                "display_name": "Compute",
                "name": "os-compute-worker"
            }, {
                "display_name": "Controller",
                "name": "os-controller"
            }, {
                "display_name": "Network",
                "name": "os-network"
            }, {
                "display_name": "Storage",
                "name": "os-block-storage-worker"
            }],
            "compatible_os": [{
                "name": "CentOs",
                "os_id": 1
            }, {
                "name": "Ubuntu",
                "os_id": 2
            }]
        };
        return [200, adapter, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/machines-hosts').respond(function(method, url, data) {
        console.log(method, url);
        var servers = [{
            "machine_id": 10,
            "mac": "28.e5.ee.47.14.92",
            "switch_ip": "172.29.8.40",
            "vlan": "1",
            "port": "1",
            "name": "sv-1",
            "clusters": ["cluster1", "cluster2"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Installing"
        }, {
            "machine_id": 11,
            "mac": "28.e5.ee.47.a2.93",
            "switch_ip": "172.29.8.40",
            "vlan": "2",
            "port": "2",
            "name": "sv-2",
            "clusters": [],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 12,
            "mac": "28.e5.ee.47.ee.32",
            "switch_ip": "172.29.8.40",
            "vlan": "2",
            "port": "3",
            "name": "sv-3",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 13,
            "mac": "28.e5.ee.47.33.66",
            "switch_ip": "172.29.8.40",
            "vlan": "2",
            "port": "4",
            "name": "sv-4",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 14,
            "mac": "28.e5.ee.47.2c.22",
            "switch_ip": "172.29.8.40",
            "vlan": "2",
            "port": "5",
            "name": "sv-5",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 15,
            "mac": "28.e5.ee.47.55.19",
            "switch_ip": "172.29.8.40",
            "vlan": "2",
            "port": "6",
            "name": "sv-6",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 16,
            "mac": "28.e5.ee.47.41.b2",
            "switch_ip": "172.29.8.41",
            "vlan": "2",
            "port": "7",
            "name": "sv-7",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 17,
            "mac": "28.e5.ee.47.25.33",
            "switch_ip": "172.29.8.41",
            "vlan": "8",
            "port": "8",
            "name": "sv-8",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 18,
            "mac": "28.e5.ee.47.5a.60",
            "switch_ip": "172.29.8.41",
            "vlan": "9",
            "port": "9",
            "name": "sv-9",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 19,
            "mac": "28.e5.ee.47.c1.82",
            "switch_ip": "172.29.8.41",
            "vlan": "10",
            "port": "10",
            "name": "sv-10",
            "clusters": ["cluster1"],
            "os": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }];
        return [200, servers, {}];
    });

    $httpBackend.whenPOST(settings.apiUrlBase + '/clusters').respond(function(method, url, data) {
        console.log(method, url, data);
        var postData = JSON.parse(data)
        var mockResponse = {
            "id": 1,
            "name": postData.name,
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            "link": {
                "href": "/clusters/1",
                "ref": "self"
            }
        };
        return [201, mockResponse, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/[1-9][0-9]*\/progress/).respond(function(method, url, data) {
        console.log(method, url, data);
        var states = ["DEPLOYING", "SUCCESSFUL", "UNDEPLOYED", "FAILED"];
        var progressData = {
            "id": 1,
            "state": states[Math.floor((Math.random() * 4))], //states[0],
            "config_step": "deploy",
            "status": {
                "total_hosts": 4,
                "installing_hosts": 2,
                "completed_hosts": 1,
                "failed_hosts": 1,
                "message": ""
            }
        };
        return [200, progressData, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters$/).respond(function(method, url, data) {
        console.log(method, url);
        var clusters = [{
            "id": 1,
            "name": "cluster_01",
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            " links": [{
                "href": "/clusters/1",
                "rel": "self"
            }, {
                "href": "/clusters/1/hosts",
                "rel": "hosts"
            }]
        }, {
            "id": 2,
            "name": "cluster_02",
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-28 14:00:00",
            " links": [{
                "href": "/clusters/1",
                "rel": "self"
            }, {
                "href": "/clusters/1/hosts",
                "rel": "hosts"
            }]
        }, {
            "id": 3,
            "name": "cluster_03",
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-5-26 09:00:00",
            " links": [{
                "href": "/clusters/1",
                "rel": "self"
            }, {
                "href": "/clusters/1/hosts",
                "rel": "hosts"
            }]
        }, {
            "id": 4,
            "name": "cluster_04",
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-19 08:00:00",
            " links": [{
                "href": "/clusters/1",
                "rel": "self"
            }, {
                "href": "/clusters/1/hosts",
                "rel": "hosts"
            }]
        }, {
            "id": 5,
            "name": "cluster_05",
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-4-25 12:00:00",
            "updated_at": "2014-2-27 20:00:00",
            " links": [{
                "href": "/clusters/2",
                "rel": "self"
            }, {
                "href": "/clusters/2/hosts",
                "rel": "hosts"
            }]
        }];
        return [200, clusters, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/[1-9][0-9]*$/).respond(function(method, url, data) {
        console.log(method, url);
        var index = url.indexOf("clusters/");
        var id = url.substring(index).split("/")[1];
        var cluster = {
            "id": id,
            "name": "Cluster" + id,
            "adapter_id": 1,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            " links": [{
                "href": "/clusters/" + id,
                "rel": "self"
            }, {
                "href": "/clusters/" + id + "/hosts",
                "rel": "hosts"
            }]
        };
        return [200, cluster, {}];
    });

    $httpBackend.whenPUT(/\.*\/clusters\/[1-9][0-9]*\/config/).respond(function(method, url, data) {
        console.log(method, url, data);
        var config = JSON.parse(data);

        console.log(config);
        return [200, config, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/subnetworks').respond(function(method, url, data) {
        console.log(method, url);
        var subnetworks = [{
            "subnet_id": 1,
            "name": "net1",
            "subnet": "192.168.1.0",
            "netmask": "255.255.255.0",
        }, {
            "subnet_id": 2,
            "name": "net2",
            "subnet": "172.165.1.0",
            "netmask": "255.255.255.0",
        }];
        return [200, subnetworks, {}];
    });

    $httpBackend.whenPOST(settings.apiUrlBase + '/subnetworks').respond(function(method, url, data) {
        console.log(method, url, data);

        var subnetConfig = JSON.parse(data);
        subnetConfig.subnet_id = Math.floor((Math.random() * 100) + 1);

        console.log(subnetConfig);
        return [200, subnetConfig, {}];
    });

    $httpBackend.whenPUT(/\.*\/subnetworks\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url, data);

        var subnetConfig = JSON.parse(data);

        console.log(subnetConfig);
        return [200, subnetConfig, {}];
    });

    // keep routing table for later use
    /*
    $httpBackend.whenPOST(/\.*\/clusters\/[1-9][0-9]*\/routing-table/).respond(function(method, url, data) {
        console.log(method, url, data);

        var routingTable = JSON.parse(data);
        routingTable.id = Math.floor((Math.random() * 100) + 1);

        console.log(routingTable);
        return [200, routingTable, {}];
    });

    $httpBackend.whenPUT(/\.*\/clusters\/[1-9][0-9]*\/routing-table\/[1-9][0-9]/).respond(function(method, url, data) {
        console.log(method, url, data);

        var routingTable = JSON.parse(data);

        console.log(routingTable);
        return [200, routingTable, {}];
    });
    */

    $httpBackend.whenPOST(/\.*\/clusters\/([0-9]|[1-9][0-9])\/action/).respond(function(method, url, data) {
        console.log(method, url, data);
        var postData = JSON.parse(data);
        var actionResponse = {};

        if (postData["add_hosts"] !== undefined) {
            var machines = postData["add_hosts"]["machines"];
            angular.forEach(machines, function(machine) {
                machine.id = Math.floor((Math.random() * 500) + 1);
            })
            actionResponse = {
                "hosts": machines
            };
        } else if (postData["deploy"] !== undefined) {}
        return [200, actionResponse, {}];

    });

    $httpBackend.whenPUT(/\.*\/hosts\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url, data);
        var host_config = JSON.parse(data);
        return [200, host_config, {}];
    });

    $httpBackend.whenPOST(/\.*\/hosts\/[1-9][0-9]*\/network/).respond(function(method, url, data) {
        console.log(method, url, data);
        var network = JSON.parse(data);
        network.id = Math.floor((Math.random() * 100) + 1);
        return [200, network, {}];
    });

    $httpBackend.whenPUT(/\.*\/hosts\/[1-9][0-9]*\/network\/[1-9][0-9]/).respond(function(method, url, data) {
        console.log(method, url, data);
        var network = JSON.parse(data);
        return [200, network, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])\/hosts$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var hosts = [];
        var num = 20;
        for (var i = 1; i <= num; i++) {
            var host = {
                "id": i,
                "machine_id": i * 2 + 10,
                "name": "host-" + i,
                "mac": "28.e5.ee.47.14." + (i < 10 ? "a" : "") + i,
                "switch_ip": "172.29.8.40",
                "port": i,
                "vlan": i,
                "roles": [{
                    "display_name": "Network",
                    "name": "os-network"
                }, {
                    "display_name": "Storage",
                    "name": "os-block-storage-worker"
                }],
                "clusters": ["cluster1", "cluster2"]
            };
            hosts.push(host);
        }
        return [200, hosts, {}];
    });

    $httpBackend.whenPUT(/\.*\/clusters\/[1-9][0-9]*\/hosts\/[1-9][0-9]*\/config/).respond(function(method, url, data) {
        console.log(method, url, data);
        var config = JSON.parse(data);
        return [200, config, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])\/hosts\/([0-9]|[1-9][0-9])\/progress/).respond(function(method, url, data) {
        //console.log(method, url, data);
        var index = url.indexOf("clusters/");
        var hostId = url.substring(index).split("/")[3];
        var messages = ["Setting up kickstart configurations",
            "Downloading installation images from server",
            "Installing bootloaders",
            "Installing packages",
            "Chef run complete"
        ];
        var message = "";
        if (progressPercent < 0.1)
            message = messages[0];
        else if (progressPercent < 0.2)
            message = messages[1];
        else if (progressPercent < 0.5)
            message = messages[2];
        else if (progressPercent < 0.9)
            message = messages[3];
        else
            message = messages[4];


        var progress = {
            "cluster_id": 1,
            "host_id": hostId,
            "state": "INSTALLING",
            "percentage": progressPercent,
            "severity": "INFO",
            "message": message,
            "updated_at": "---timestamp---"
        }
        progressPercent += 0.01;
        if (progressPercent > 1) {
            progressPercent = 1;
        }
        return [200, progress, {}];
    });

    $httpBackend.whenDELETE(/\.*\/hosts\/([0-9]|[1-9][0-9])/).respond(function(method, url, data) {
        console.log(method, url, data);

        var deleteHost = {};
        return [200, deleteHost, {}];
    })
});
