define(['angular','angularMocks'],function(){
var compassAppDev = angular.module('compassAppDev', ['ngMockE2E']);

compassAppDev.run(function($httpBackend, settings, $http) {
    var progressPercent = 0;

    // Allow all calls not to the API to pass through normally
    $httpBackend.whenGET(new RegExp('src\/.*')).passThrough();
    $httpBackend.whenGET(new RegExp('data\/.*')).passThrough();
    //$httpBackend.whenGET(new RegExp('.*moni.*')).passThrough();

    $httpBackend.whenPOST(settings.apiUrlBase + '/users/login').respond(function(method, url, data) {
        console.log(method, url, data);
        var user = {
            "name": "huawei"
        }
        return [200, user, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/adapters').respond(function(method, url, data) {
        console.log(method, url);
        var adapters = [{
                "flavors": [],
                "display_name": "os_only",
                "name": "os_only",
                "roles": [],
                "supported_oses": [{
                    "os_id": 3,
                    "id": 3,
                    "name": "CentOS-6.5-x86_64"
                }, {
                    "os_id": 4,
                    "id": 4,
                    "name": "Ubuntu-12.04-x86_64"
                }],
                "id": 2
            }, {
                "flavors": [],
                "name": "ceph(chef)",
                "roles": [],
                "distributed_system_id": 2,
                "supported_oses": [{
                    "os_id": 3,
                    "id": 3,
                    "name": "CentOS-6.5-x86_64"
                }, {
                    "os_id": 4,
                    "id": 4,
                    "name": "Ubuntu-12.04-x86_64"
                }],
                "distributed_system_name": "ceph",
                "display_name": "ceph(chef)",
                "id": 4
            }, {
                "flavors": [{
                    "roles": [{
                        "display_name": "all in one compute",
                        "description": "all in one compute",
                        "name": "allinone-compute"
                    }],
                    "display_name": "All-In-One",
                    "id": 1,
                    "template": "allinone.tmpl",
                    "name": "allinone"
                }, {
                    "roles": [],
                    "display_name": "Single Controller, Multi-compute",
                    "id": 2,
                    "name": "single-contoller-multi-compute"
                }, {
                    "roles": [],
                    "display_name": "Multi-node Cluster",
                    "id": 3,
                    "template": "multinodes.tmpl",
                    "name": "multinodes"
                }],
                "name": "openstack_icehouse",
                "distributed_system_id": 1,
                "supported_oses": [{
                    "os_id": 3,
                    "id": 3,
                    "name": "CentOS-6.5-x86_64"
                }, {
                    "os_id": 4,
                    "id": 4,
                    "name": "Ubuntu-12.04-x86_64"
                }],
                "distributed_system_name": "openstack",
                "display_name": "OpenStack Icehouse",
                "id": 5
            }, {
                "id": 6,
                "name": "ceph_openstack_icehouse",
                "display_name": "OpenStack and Ceph",
                "supported_oses": [{
                    "os_id": 3,
                    "id": 3,
                    "name": "CentOS-6.5-x86_64"
                }, {
                    "os_id": 4,
                    "id": 4,
                    "name": "Ubuntu-12.04-x86_64"
                }],
                "flavors": []

            }];

        return [200, adapters, {}];
    });

    $httpBackend.whenGET(/\.*\/adapters\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url);
        var adapter = {
            "id": 1,
            "display_name": "openstack",
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
            "supported_oses": [{
                "name": "CentOs",
                "id": 1
            }, {
                "name": "Ubuntu",
                "id": 2
            }]
        };
        return [200, adapter, {}];
    });

    $httpBackend.whenGET(/\.*\/switches-machines-hosts/).respond(function(method, url, data) {
        console.log(method, url);
        var servers = [{
            "machine_id": 10,
            "mac": "28.e5.ee.47.14.92",
            "switch_ip": "172.29.8.400",
            "vlan": 1,
            "port": 1,
            "hostname": "sv-1",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }, {
                "id": 2,
                "name": "cluster2"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Installing"
        }, {
            "machine_id": 11,
            "mac": "28.e5.ee.47.a2.93",
            "switch_ip": "172.1.20.100",
            "vlan": 2,
            "port": 2,
            "hostname": "sv-2",
            "clusters": [],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 12,
            "mac": "28.e5.ee.47.ee.32",
            "switch_ip": "172.9.20.8",
            "vlan": 2,
            "port": 3,
            "hostname": "sv-3",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 13,
            "mac": "28.e5.ee.47.33.66",
            "switch_ip": "172.29.8.40",
            "vlan": 2,
            "port": 4,
            "hostname": "sv-4",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 14,
            "mac": "28.e5.ee.47.2c.22",
            "switch_ip": "172.29.8.40",
            "vlan": 2,
            "port": 5,
            "hostname": "sv-5",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 15,
            "mac": "28.e5.ee.47.55.19",
            "switch_ip": "172.29.8.40",
            "vlan": 2,
            "port": 6,
            "hostname": "sv-6",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 16,
            "mac": "28.e5.ee.47.41.b2",
            "switch_ip": "172.29.7.41",
            "vlan": 2,
            "port": 7,
            "hostname": "sv-7",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 17,
            "mac": "28.e5.ee.47.25.33",
            "switch_ip": "172.29.8.41",
            "vlan": 8,
            "port": 8,
            "hostname": "sv-8",
            "clusters": [{
                "id": 1,
                "name": "cluster1"
            }],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 18,
            "mac": "28.e5.ee.47.5a.60",
            "switch_ip": "172.29.8.41",
            "vlan": 9,
            "port": 9,
            "hostname": "sv-9",
            "clusters": [],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }, {
            "machine_id": 19,
            "mac": "28.e5.ee.47.c1.82",
            "switch_ip": "172.29.8.41",
            "vlan": 10,
            "port": 10,
            "hostname": "sv-10",
            "clusters": [],
            "os_name": "CentOS",
            "adapter": "OpenStack",
            "roles": [],
            "network": {},
            "state": "Successful"
        }];
        return [200, servers, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/switches').respond(function(method, url, data) {
        console.log(method, url, data);
        var switches = [{
            "id": 1,
            "ip": "172.29.8.40",
            "filters": "allow ports 1-10,20-51",
            "credentials":{
                "version": "2c",
                "community":"public"
            },
            "state": "under_mointoring"
        }, {
            "id": 2,
            "ip": "172.29.8.41",
            "filters": "deny ports 1-100",
            "credentials":{
                "version": "2c",
                "community":"public"
            },
            "state": "under_mointoring"
        }, {
            "id": 3,
            "ip": "172.29.8.42",
            "filters": "allow ports 1-50",
            "credentials":{
                "version": "2c",
                "community":"public"
            },
            "state": "under_mointoring"
        }];
        return [200, switches, {}];
    });

    $httpBackend.whenGET(/\.*\/switches\/([0-9]|[1-9][0-9])$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var index = url.indexOf("switches/");
        var id = url.substring(index).split("/")[1];
        var state = "repolling"
        if (id == "1" || id == "2") {
            state = "under_monitoring";
        } else {
            state = "repolling";
        }
        var sw = {
            "id": id,
            "ip": "172.29.8.40",
            "filters": "allow ports 1-10,20-51",
            "state": state
        };
        return [200, sw, {}];
    });

    $httpBackend.whenPUT(/\.*\/switches\/([0-9]|[1-9][0-9])$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var sw = JSON.parse(data);
        var id = url.substring(url.lastIndexOf("/") + 1);
        sw.id = parseInt(id);
        return [200, sw, {}];
    });

    $httpBackend.whenPOST(settings.apiUrlBase + '/switches').respond(function(method, url, data) {
        console.log(method, url, data);
        var switchData = JSON.parse(data);
        switchData.id = Math.floor(Math.random() * 100 + 1);
        switchData.state = "initialized";
        return [200, switchData, {}];
    });

    $httpBackend.whenPOST(/\.*\/switches\/([0-9]|[1-9][0-9])\/action$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var switchState = {
            "state": "initialized"
        }
        return [200, switchState, {}];
    });

    $httpBackend.whenGET(/\.*\/switches\/([0-9]|[1-9][0-9])\/machines$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var index = url.indexOf("switches/");
        var switchId = url.substring(index).split("/")[1];
        var machines = [{
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.14.11",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "1",
            "port": "11"
        }, {
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.a2.22",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "2",
            "port": "12"
        }, {
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.ee.33",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "2",
            "port": "13"
        }, {
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.33.44",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "2",
            "port": "14"
        }, {
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.2c.55",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "2",
            "port": "15"
        }, {
            "id": Math.floor(Math.random() * 100 + 1),
            "mac": "28.e5.ee.47.55.19",
            "switch_ip": "172.29.8." + switchId,
            "vlan": "2",
            "port": "16"
        }];
        return [200, machines, {}];
    });

    /*
    $httpBackend.whenPOST(settings.apiUrlBase + '/switch-filters').respond(function(method, url, data) {
        console.log(method, url, data);
        var filterData = JSON.parse(data);
        return [200, filterData, {}];
    });
    */
    $httpBackend.whenPUT(/\.*\/switch-filters\/([0-9]|[1-9][0-9])/).respond(function(method, url, data) {
        console.log(method, url, data);
        var filterData = JSON.parse(data);
        return [200, filterData, {}];
    })

    $httpBackend.whenPOST(settings.apiUrlBase + '/clusters').respond(function(method, url, data) {
        console.log(method, url, data);
        var postData = JSON.parse(data)
        var mockResponse = {
            "id": 6,
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

    $httpBackend.whenPOST(/\.*\/users$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var postData = JSON.parse(data)
        return [201, {}];
    });

    $httpBackend.whenGET(/\.*\/users$/).respond(function(method, url, data) {
        var userSetting = [{
            "id": 1,
            "email": "admin@compass.org",
            "username": "admin",
            "first_name": "",
            "last_name": "",
            "active": false,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login_at": "2014-4-14"
        }, {
            "id": 2,
            "email": "tsinghua@compass.org",
            "username": "tsinghua",
            "first_name": "",
            "last_name": "",
            "active": true,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 3,
            "email": "ann@compass.org",
            "username": "ann",
            "first_name": "Ann",
            "last_name": "",
            "active": true,
            "is_admin": false,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 4,
            "email": "john@compass.org",
            "username": "jsmith",
            "first_name": "John",
            "last_name": "Smitch",
            "active": true,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 5,
            "email": "tom@compass.org",
            "username": "tom",
            "first_name": "Tom",
            "last_name": "Jones",
            "active": true,
            "is_admin": false,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }];
        return [201, userSetting, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/[1-9][0-9]*\/state/).respond(function(method, url, data) {
        console.log(method, url, data);
        var states = ["UNINITIALIZED", "INITIALIZED", "INSTALLING", "SUCCESSFUL", "ERROR"];
        var progressData = {
            "id": 1,
            "state": states[Math.floor((Math.random() * 5))], //states[0],
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

    $httpBackend.whenGET(/\.*\/users\/logs$/).respond(function(method, url, data) {
        var userLog = [{
            "user_id": 1,
            "action": "Created New User",
            "timestamp": "2012-12-30 12:22:00"
        }, {
            "user_id": 1,
            "action": "Modified Admin Priviledges",
            "timestamp": "2013-03-25 09:10:00"
        }, {
            "user_id": 3,
            "action": "Test Cluster",
            "timestamp": "2014-06-19 23:32:00"
        }, {
            "user_id": 3,
            "action": "Deleted User",
            "timestamp": "2014-06-20 09:10:00"
        }, {
            "user_id": 2,
            "action": "Deleted Cluster",
            "timestamp": "2014-07-26 16:22:00"
        }, {
            "user_id": 2,
            "action": "Created New Cluster",
            "timestamp": "2014-08-22 14:22:00"
        }];
        return [200, userLog, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters$/).respond(function(method, url, data) {
        console.log(method, url);
        var clusters = [{
            "id": 1,
            "name": "cluster_01 long string",
            "adapter_id": 1,
            "os_id": 1,
            "os_name": "CentOS",
            "distributed_system_name": "OpenStack",
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            "links": [{
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
            "os_name": "CentOS",
            "distributed_system_name": "OpenStack",
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-28 14:00:00",
            "links": [{
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
            "os_name": "CentOS",
            "distributed_system_name": "OpenStack",
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-5-26 09:00:00",
            "links": [{
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
            "os_name": "CentOS",
            "distributed_system_name": "OpenStack",
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-19 08:00:00",
            "links": [{
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
            "os_name": "CentOS",
            "distributed_system_name": "OpenStack",
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-4-25 12:00:00",
            "updated_at": "2014-2-27 20:00:00",
            "links": [{
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
            "id": parseInt(id),
            "name": "Cluster" + id,
            "adapter_id": 6,
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            "flavor": {
                "roles": [{
                    "display_name": "Compute",
                    "name": "os-compute-worker"
                }, {
                    "display_name": "Controller",
                    "name": "os-controller"
                }, {
                    "display_name": "Storage",
                    "name": "os-block-storage-worker"
                }, {
                    "display_name": "Message Queue",
                    "name": "os-mq"
                }, {
                    "display_name": "Network",
                    "name": "os-network"
                }, {
                    "display_name": "Database",
                    "name": "os-db"
                }]
            },
            "links": [{
                "href": "/clusters/" + id,
                "rel": "self"
            }, {
                "href": "/clusters/" + id + "/hosts",
                "rel": "hosts"
            }]
        };
        return [200, cluster, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])*\/config/).respond(function(method, url, data) {
        console.log(method, url, data);
        var config = {
            "os_config": {
                "server_credentials": {
                    "username": "admin",
                    "password": "admin"
                },
                "partition": {
                    "/var": {
                        "percentage": 30,
                        "max_size": "10G"
                    },
                    "/home": {
                        "percentage": 30,
                        "max_size": "10G"
                    }
                }
            },
            "package_config": {
                "security": {
                    "service_credentials": {
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
                        "mysql": {
                            "username": "root",
                            "password": "root"
                        },
                        "volume": {
                            "username": "cinder",
                            "password": "cinder"
                        }
                    },
                    "console_credentials": {
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
                        "volume": {
                            "username": "cinder",
                            "password": "cinder"
                        }
                    }
                },
                "network_mapping": {
                    "management": "eth0",
                    "tenant": "eth0",
                    "storage": "eth0",
                    "external": "eth1",
                    "cluster_config": "",
                    "public_config": ""
                }
            }
        };
        return [200, config, {}];
    });

    $httpBackend.whenPUT(/\.*\/clusters\/[1-9][0-9]*\/config/).respond(function(method, url, data) {
        console.log(method, url, data);
        var config = JSON.parse(data);

        console.log(config);
        return [200, config, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/subnets').respond(function(method, url, data) {
        console.log(method, url);
        var subnetworks = [{
            "id": 1,
            //"name": "10.172.10.0/24",
            "subnet": "10.172.10.0/24"
        }, {
            "id": 2,
            //"name": "10.172.20.0/24",
            "subnet": "10.172.20.0/24"
        }];
        return [200, subnetworks, {}];
    });

    $httpBackend.whenPOST(settings.apiUrlBase + '/subnets').respond(function(method, url, data) {
        console.log(method, url, data);

        var subnetConfig = JSON.parse(data);
        subnetConfig.id = Math.floor((Math.random() * 100) + 1);

        console.log(subnetConfig);
        return [200, subnetConfig, {}];
    });

    $httpBackend.whenPUT(/\.*\/subnets\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url, data);

        var subnetConfig = JSON.parse(data);

        console.log(subnetConfig);
        return [200, subnetConfig, {}];
    });

    $httpBackend.whenDELETE(/\.*\/subnets\/([0-9]|[1-9][0-9])*/).respond(function(method, url, data) {
        console.log(method, url, data);
        return [200, {}, {}];
    })

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
        } else if (postData["deploy"] !== undefined) {

        } else if (postData["review"] !== undefined) {

        }
        return [200, actionResponse, {}];

    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])\/metadata/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metadata = {
            "os_config": {
                "general": {
                    "domain": {
                        "_self": {
                            "default_value": "ods.com"
                        }
                    },
                    "default_gateway": {
                        "_self": {
                            "default_value": "172.19.100.1"
                        }
                    },
                    "search_path": {
                        "_self": {
                            "default_value": ["ods.com"]
                        }
                    },
                    "ntp_server": {
                        "_self": {
                            "default_value": "10.192.88.40"
                        }
                    },
                    "dns_servers": {
                        "_self": {
                            "default_value": ["10.192.8.1"]
                        }
                    }

                }
            }
        };
        return [200, metadata, {}];

    });

    $httpBackend.whenPUT(/\.*\/hosts\/[1-9][0-9]*/).respond(function(method, url, data) {
        console.log(method, url, data);
        var host_config = JSON.parse(data);
        return [200, host_config, {}];
    });

    $httpBackend.whenPOST(/\.*\/hosts\/[1-9][0-9]*\/networks/).respond(function(method, url, data) {
        console.log(method, url, data);
        var network = JSON.parse(data);
        network.id = Math.floor((Math.random() * 100) + 1);
        return [200, network, {}];
    });

    $httpBackend.whenPUT(/\.*\/hosts\/[1-9][0-9]*\/networks\/[1-9][0-9]/).respond(function(method, url, data) {
        console.log(method, url, data);
        var network = JSON.parse(data);
        return [200, network, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])\/hosts$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var hosts = [];
        var num = 20;
        var test_roles = [{
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
        }, {
            "display_name": "Message Queue",
            "name": "os-mq"
        }, {
            "display_name": "Database",
            "name": "os-db"
        }];

        for (var i = 1; i <= num; i++) {
            var host = {
                "id": i,
                "host_id": i,
                "machine_id": i * 2 + 10,
                "hostname": "host-" + i,
                "mac": "28.e5.ee.47.14." + (i < 10 ? "a" : "") + i,
                "switch_ip": "172.29.8.40",
                "port": i,
                "vlan": i,
                "roles": [test_roles[i%6]],
                "clusters": [{
                    "id": 1,
                    "name": "cluster1"
                }, {
                    "id": 2,
                    "name": "cluster2"
                }]
            };
            hosts.push(host);
        }
        return [200, hosts, {}];
    });

    $httpBackend.whenPUT(/\.*\/clusters\/([0-9]|[1-9][0-9])\/hosts\/([0-9]|[1-9][0-9])$/).respond(function(method, url, data) {
        var updateData = JSON.parse(data);
        return [200, updateData, {}];
    })

    $httpBackend.whenPUT(/\.*\/clusters\/[1-9][0-9]*\/hosts\/[1-9][0-9]*\/config/).respond(function(method, url, data) {
        console.log(method, url, data);
        var config = JSON.parse(data);
        return [200, config, {}];
    });

    $httpBackend.whenGET(/\.*\/clusters\/([0-9]|[1-9][0-9])\/hosts\/([0-9]|[1-9][0-9])\/state/).respond(function(method, url, data) {
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
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/overview/).respond(function(method, url, data) {
        console.log(method, url, data);
        var overviewData = [{
            "name": "cluster_summary",
            "display_name": "Cluster Summary",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Metrics%20Dashboard",
            "state": "ok"
        }, {
            "name": "controller",
            "display_name": "Controller",

            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Controller",
            "state": "error"
        }, {
            "name": "alert",
            "display_name": "Alert",
            "base_url": "/#/cluster/2/monitoring/alerts",
            "dash": "",
            "state": "",
            "alerts": [{
                "type": "critical",
                "name": "os-keystone"
            }, {
                "type": "warning",
                "name": "os-mq"
            }, {
                "type": "warning",
                "name": "os-db-node"
            }, {
                "type": "critical",
                "name": "os-network"
            }, {
                "type": "warning",
                "name": "os-keystone"
            }, {
                "type": "warning",
                "name": "os-compute2"
            }]
        }, {
            "name": "compute",
            "display_name": "Compute",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Compute",
            "state": "ok"
        }, {
            "name": "security",
            "display_name": "Security",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Security",
            "state": "warning"
        }, {
            "name": "database",
            "display_name": "Database",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Database",
            "state": "warning"
        }, {
            "name": "image",
            "display_name": "Image",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Image",
            "state": "warning"
        }, {
            "name": "store",
            "display_name": "Store",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Storage",
            "state": "ok"
        }, {
            "name": "messagebus",
            "display_name": "Message Bus",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Message%20Bus",
            "state": "ok"
        }, {
            "name": "processes",
            "display_name": "Processes",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Processes",
            "state": "ok"
        }, {
            "name": "monitoring",
            "display_name": "Monitoring",
            "base_url": "/#/cluster/2/monitoring/charts",
            "dash": "Metrics%20Dashboard",
            "state": "ok"
        }, {
            "name": "users",
            "display_name": "Users",
            "base_url": "/#/users",
            "dash": "",
            "state": "ok"
        }];
        return [200, overviewData, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/topology$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var topology = {
            "name": "compass-dc1",
            "children": [{
                "name": "172.29.8.40",
                "state": "warning",
                "children": [{
                    "name": "os-controller",
                    "state": "warning",
                    "children": []
                }, {
                    "name": "os-db-node",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-keystone",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-network",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-image",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-mq",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-compute1",
                    "state": "warning",
                    "children": []
                }, {
                    "name": "os-compute2",
                    "state": "ok",
                    "children": []
                }]
            }]
        };
        return [200, topology, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/servicetopology$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var topology = {
            "name": "cluster",
            "children": [{
                "name": "compute",
                "state": "error",
                "children": [{
                    "name": "os-compute1",
                    "state": "error",
                    "children": [{
                        "name": "nova-compute",
                        "state": "ok"
                    }, {
                        "name": "nova-api-metadata",
                        "state": "ok"
                    }, {
                        "name": "nova-consoleauth",
                        "state": "ok"
                    }, {
                        "name": "ceilometer-agent-compute",
                        "state": "ok"
                    }, {
                        "name": "neutron-openvswitch-agent",
                        "state": "ok"
                    }, {
                        "name": "nova-novncproxy",
                        "state": "ok"
                    }]
                }, {
                    "name": "os-compute2",
                    "state": "error",
                    "children": [{
                        "name": "nova-compute",
                        "state": "ok"
                    }, {
                        "name": "nova-api-metadata",
                        "state": "ok"
                    }, {
                        "name": "nova-consoleauth",
                        "state": "ok"
                    }, {
                        "name": "ceilometer-agent-compute",
                        "state": "ok"
                    }, {
                        "name": "neutron-openvswitch-agent",
                        "state": "ok"
                    }, {
                        "name": "nova-novncproxy",
                        "state": "ok"
                    }]
                }]
            }, {
                "name": "controller",
                "state": "ok",
                "children": [{
                    "name": "os-controller",
                    "state": "ok",
                    "children": [{
                        "name": "glance-api",
                        "state": "ok"
                    }, {
                        "name": "glance-registry",
                        "state": "ok"
                    }, {
                        "name": "heat-api",
                        "state": "ok"
                    }, {
                        "name": "heat-api-cfn",
                        "state": "ok"
                    }, {
                        "name": "heat-engine",
                        "state": "ok"
                    }, {
                        "name": "keystone-all",
                        "state": "ok"
                    }, {
                        "name": "neutron-server",
                        "state": "ok"
                    }, {
                        "name": "nova-api",
                        "state": "ok"
                    }, {
                        "name": "nova-cert",
                        "state": "ok"
                    }, {
                        "name": "nova-conductor",
                        "state": "ok"
                    }, {
                        "name": "nova-consoleauth",
                        "state": "ok"
                    }, {
                        "name": "nova-novncproxy",
                        "state": "ok"
                    }, {
                        "name": "nova-objectstore",
                        "state": "ok"
                    }, {
                        "name": "nova-scheduler",
                        "state": "ok"
                    }, {
                        "name": "ceilometer-api",
                        "state": "ok"
                    }, {
                        "name": "ceilometer-agent-central",
                        "state": "ok",
                        "children": [{
                            "name": "cpu"
                        }, {
                            "name": "memory"
                        }]
                    }, {
                        "name": "ceilometer-collector",
                        "state": "ok",
                        "children": [{
                            "name": "process count"
                        }, {
                            "name": "load"
                        }]
                    }]
                }]
            }, {
                "name": "network",
                "state": "warning",
                "children": [{
                    "name": "os-network",
                    "state": "warning",
                    "children": [{
                        "name": "openvswitch",
                        "state": "ok",
                        "children": [{
                            "name": "interface tx"
                        }, {
                            "name": "interface xx"
                        }]
                    }, {
                        "name": "neutron",
                        "state": "ok",
                        "children": [{
                            "name": "process status"
                        }, {
                            "name": "memory"
                        }]
                    }]
                }]
            }, {
                "name": "image",
                "state": "warning",
                "children": [{
                    "name": "os-image",
                    "state": "warning",
                    "children": [{
                        "name": "glance",
                        "state": "ok",
                        "children": [{
                            "name": "image count"
                        }, {
                            "name": "process status"
                        }]
                    }, {
                        "name": "cinder-volume",
                        "state": "ok",
                        "children": [{
                            "name": "storage capacity"
                        }, {
                            "name": "process status"
                        }]
                    }, {
                        "name": "cinder-api",
                        "state": "ok"
                    }, {
                        "name": "cinder-scheduler",
                        "state": "ok"
                    }]
                }]
            }, {
                "name": "database",
                "state": "warning",
                "children": [{
                    "name": "os-db-node",
                    "children": [{
                        "name": "mysql",
                        "state": "ok",
                        "children": [{
                            "name": "queries per second"
                        }, {
                            "name": "response time"
                        }]
                    }, {
                        "name": "redis",
                        "state": "ok",
                        "children": [{
                            "name": "queries per second"
                        }, {
                            "name": "response time"
                        }]
                    }]
                }]
            }, {
                "name": "message queue",
                "state": "ok",
                "children": [{
                    "name": "os-mq",
                    "children": [{
                        "name": "rabbit-mq",
                        "state": "ok",
                        "children": [{
                            "name": "process count"
                        }, {
                            "name": "messages tx"
                        }]
                    }, {
                        "name": "mysql",
                        "state": "ok",
                        "children": [{
                            "name": "status"
                        }, {
                            "name": "connection"
                        }]
                    }]
                }]
            }]
        };
        return [200, topology, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/alarms$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var alarms = [{
            "startDate": 1406873957790,
            "endDate": 1406886655198,
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": 1406774590378,
            "endDate": 1406750781190,
            "name": "os-db-node",
            "status": "WARNING"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406840037149,
            "name": "os-db-node",
            "status": "WARNING"
        }, {
            "startDate": 1406855382748,
            "endDate": 1406857927670,
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": 1406925382748,
            "endDate": 1406926927670,
            "name": "os-keystone",
            "status": "WARNING"
        }, {
            "startDate": 1406931282409,
            "endDate": 1406934037149,
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": 1406812282409,
            "endDate": 1406813037149,
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406841037149,
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": 1406844282409,
            "endDate": 1406848037149,
            "name": "os-db-node",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406822282409,
            "endDate": 1406826037149,
            "name": "os-keystone",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406838037149,
            "name": "os-mq",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406866282409,
            "endDate": 1406870037149,
            "name": "os-keystone",
            "status": "CRITICAL"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406838037149,
            "name": "os-controller",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406820282409,
            "endDate": 1406826037149,
            "name": "os-image",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406890282409,
            "endDate": 1406895037149,
            "name": "os-image",
            "status": "WARNING"
        }, {
            "startDate": 1406791282409,
            "endDate": 1406800037149,
            "name": "os-compute2",
            "status": "WARNING"
        }, {
            "startDate": 1406850282409,
            "endDate": 1406857037149,
            "name": "os-compute1",
            "status": "WARNING"
        }, {
            "startDate": 1406866282409,
            "endDate": 1406867037149,
            "name": "os-controller",
            "status": "WARNING"
        }, {
            "startDate": 1406835282409,
            "endDate": 1406838037149,
            "name": "os-compute2",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406844282409,
            "endDate": 1406844937149,
            "name": "os-mq",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406850282409,
            "endDate": 1406860037149,
            "name": "os-compute2",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406871282409,
            "endDate": 1406875037149,
            "name": "os-compute1",
            "status": "SUCCESSFUL"
        }, {
            "startDate": 1406882282409,
            "endDate": 1406889037149,
            "name": "os-network",
            "status": "CRITICAL"
        }, {
            "startDate": 1406883282409,
            "endDate": 1406886037149,
            "name": "os-mq",
            "status": "WARNING"
        }, {
            "startDate": 1406891282409,
            "endDate": 1406892037149,
            "name": "os-controller",
            "status": "UNKNOWN"
        }];
        return [200, alarms, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*\/metricstree$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metricstree = [{ "nodes": [{ "nodes": [{ "nodes": [{ "nodes": [], "id": "1004", "title": "idle (value)" }, { "nodes": [], "id": "1005", "title": "interrupt (value)" }, { "nodes": [], "id": "1006", "title": "nice (value)" }, { "nodes": [], "id": "1007", "title": "softirq (value)" }, { "nodes": [], "id": "1008", "title": "steal (value)" }, { "nodes": [], "id": "1009", "title": "system (value)" }, { "nodes": [], "id": "10010", "title": "user (value)" }, { "nodes": [], "id": "10011", "title": "wait (value)" }], "id": "8003", "title": "cpu" }], "id": "8002", "title": "0" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10014", "title": "idle (value)" }, { "nodes": [], "id": "10015", "title": "interrupt (value)" }, { "nodes": [], "id": "10016", "title": "nice (value)" }, { "nodes": [], "id": "10017", "title": "softirq (value)" }, { "nodes": [], "id": "10018", "title": "steal (value)" }, { "nodes": [], "id": "10019", "title": "system (value)" }, { "nodes": [], "id": "10020", "title": "user (value)" }, { "nodes": [], "id": "10021", "title": "wait (value)" }], "id": "80013", "title": "cpu" }], "id": "80012", "title": "1" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10024", "title": "idle (value)" }, { "nodes": [], "id": "10025", "title": "interrupt (value)" }, { "nodes": [], "id": "10026", "title": "nice (value)" }, { "nodes": [], "id": "10027", "title": "softirq (value)" }, { "nodes": [], "id": "10028", "title": "steal (value)" }, { "nodes": [], "id": "10029", "title": "system (value)" }, { "nodes": [], "id": "10030", "title": "user (value)" }, { "nodes": [], "id": "10031", "title": "wait (value)" }], "id": "80023", "title": "cpu" }], "id": "80022", "title": "10" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10034", "title": "idle (value)" }, { "nodes": [], "id": "10035", "title": "interrupt (value)" }, { "nodes": [], "id": "10036", "title": "nice (value)" }, { "nodes": [], "id": "10037", "title": "softirq (value)" }, { "nodes": [], "id": "10038", "title": "steal (value)" }, { "nodes": [], "id": "10039", "title": "system (value)" }, { "nodes": [], "id": "10040", "title": "user (value)" }, { "nodes": [], "id": "10041", "title": "wait (value)" }], "id": "80033", "title": "cpu" }], "id": "80032", "title": "11" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10044", "title": "idle (value)" }, { "nodes": [], "id": "10045", "title": "interrupt (value)" }, { "nodes": [], "id": "10046", "title": "nice (value)" }, { "nodes": [], "id": "10047", "title": "softirq (value)" }, { "nodes": [], "id": "10048", "title": "steal (value)" }, { "nodes": [], "id": "10049", "title": "system (value)" }, { "nodes": [], "id": "10050", "title": "user (value)" }, { "nodes": [], "id": "10051", "title": "wait (value)" }], "id": "80043", "title": "cpu" }], "id": "80042", "title": "12" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10054", "title": "idle (value)" }, { "nodes": [], "id": "10055", "title": "interrupt (value)" }, { "nodes": [], "id": "10056", "title": "nice (value)" }, { "nodes": [], "id": "10057", "title": "softirq (value)" }, { "nodes": [], "id": "10058", "title": "steal (value)" }, { "nodes": [], "id": "10059", "title": "system (value)" }, { "nodes": [], "id": "10060", "title": "user (value)" }, { "nodes": [], "id": "10061", "title": "wait (value)" }], "id": "80053", "title": "cpu" }], "id": "80052", "title": "13" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10064", "title": "idle (value)" }, { "nodes": [], "id": "10065", "title": "interrupt (value)" }, { "nodes": [], "id": "10066", "title": "nice (value)" }, { "nodes": [], "id": "10067", "title": "softirq (value)" }, { "nodes": [], "id": "10068", "title": "steal (value)" }, { "nodes": [], "id": "10069", "title": "system (value)" }, { "nodes": [], "id": "10070", "title": "user (value)" }, { "nodes": [], "id": "10071", "title": "wait (value)" }], "id": "80063", "title": "cpu" }], "id": "80062", "title": "14" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10074", "title": "idle (value)" }, { "nodes": [], "id": "10075", "title": "interrupt (value)" }, { "nodes": [], "id": "10076", "title": "nice (value)" }, { "nodes": [], "id": "10077", "title": "softirq (value)" }, { "nodes": [], "id": "10078", "title": "steal (value)" }, { "nodes": [], "id": "10079", "title": "system (value)" }, { "nodes": [], "id": "10080", "title": "user (value)" }, { "nodes": [], "id": "10081", "title": "wait (value)" }], "id": "80073", "title": "cpu" }], "id": "80072", "title": "15" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10084", "title": "idle (value)" }, { "nodes": [], "id": "10085", "title": "interrupt (value)" }, { "nodes": [], "id": "10086", "title": "nice (value)" }, { "nodes": [], "id": "10087", "title": "softirq (value)" }, { "nodes": [], "id": "10088", "title": "steal (value)" }, { "nodes": [], "id": "10089", "title": "system (value)" }, { "nodes": [], "id": "10090", "title": "user (value)" }, { "nodes": [], "id": "10091", "title": "wait (value)" }], "id": "80083", "title": "cpu" }], "id": "80082", "title": "2" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "10094", "title": "idle (value)" }, { "nodes": [], "id": "10095", "title": "interrupt (value)" }, { "nodes": [], "id": "10096", "title": "nice (value)" }, { "nodes": [], "id": "10097", "title": "softirq (value)" }, { "nodes": [], "id": "10098", "title": "steal (value)" }, { "nodes": [], "id": "10099", "title": "system (value)" }, { "nodes": [], "id": "100100", "title": "user (value)" }, { "nodes": [], "id": "100101", "title": "wait (value)" }], "id": "80093", "title": "cpu" }], "id": "80092", "title": "3" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100104", "title": "idle (value)" }, { "nodes": [], "id": "100105", "title": "interrupt (value)" }, { "nodes": [], "id": "100106", "title": "nice (value)" }, { "nodes": [], "id": "100107", "title": "softirq (value)" }, { "nodes": [], "id": "100108", "title": "steal (value)" }, { "nodes": [], "id": "100109", "title": "system (value)" }, { "nodes": [], "id": "100110", "title": "user (value)" }, { "nodes": [], "id": "100111", "title": "wait (value)" }], "id": "800103", "title": "cpu" }], "id": "800102", "title": "4" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100114", "title": "idle (value)" }, { "nodes": [], "id": "100115", "title": "interrupt (value)" }, { "nodes": [], "id": "100116", "title": "nice (value)" }, { "nodes": [], "id": "100117", "title": "softirq (value)" }, { "nodes": [], "id": "100118", "title": "steal (value)" }, { "nodes": [], "id": "100119", "title": "system (value)" }, { "nodes": [], "id": "100120", "title": "user (value)" }, { "nodes": [], "id": "100121", "title": "wait (value)" }], "id": "800113", "title": "cpu" }], "id": "800112", "title": "5" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100124", "title": "idle (value)" }, { "nodes": [], "id": "100125", "title": "interrupt (value)" }, { "nodes": [], "id": "100126", "title": "nice (value)" }, { "nodes": [], "id": "100127", "title": "softirq (value)" }, { "nodes": [], "id": "100128", "title": "steal (value)" }, { "nodes": [], "id": "100129", "title": "system (value)" }, { "nodes": [], "id": "100130", "title": "user (value)" }, { "nodes": [], "id": "100131", "title": "wait (value)" }], "id": "800123", "title": "cpu" }], "id": "800122", "title": "6" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100134", "title": "idle (value)" }, { "nodes": [], "id": "100135", "title": "interrupt (value)" }, { "nodes": [], "id": "100136", "title": "nice (value)" }, { "nodes": [], "id": "100137", "title": "softirq (value)" }, { "nodes": [], "id": "100138", "title": "steal (value)" }, { "nodes": [], "id": "100139", "title": "system (value)" }, { "nodes": [], "id": "100140", "title": "user (value)" }, { "nodes": [], "id": "100141", "title": "wait (value)" }], "id": "800133", "title": "cpu" }], "id": "800132", "title": "7" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100144", "title": "idle (value)" }, { "nodes": [], "id": "100145", "title": "interrupt (value)" }, { "nodes": [], "id": "100146", "title": "nice (value)" }, { "nodes": [], "id": "100147", "title": "softirq (value)" }, { "nodes": [], "id": "100148", "title": "steal (value)" }, { "nodes": [], "id": "100149", "title": "system (value)" }, { "nodes": [], "id": "100150", "title": "user (value)" }, { "nodes": [], "id": "100151", "title": "wait (value)" }], "id": "800143", "title": "cpu" }], "id": "800142", "title": "8" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100154", "title": "idle (value)" }, { "nodes": [], "id": "100155", "title": "interrupt (value)" }, { "nodes": [], "id": "100156", "title": "nice (value)" }, { "nodes": [], "id": "100157", "title": "softirq (value)" }, { "nodes": [], "id": "100158", "title": "steal (value)" }, { "nodes": [], "id": "100159", "title": "system (value)" }, { "nodes": [], "id": "100160", "title": "user (value)" }, { "nodes": [], "id": "100161", "title": "wait (value)" }], "id": "800153", "title": "cpu" }], "id": "800152", "title": "9" }], "id": "128001", "title": "cpu" }, { "nodes": [{ "nodes": [{ "nodes": [{ "nodes": [], "id": "100165", "title": "free" }, { "nodes": [], "id": "100166", "title": "used" }], "id": "200164", "title": "boot" }, { "nodes": [{ "nodes": [], "id": "100168", "title": "free" }, { "nodes": [], "id": "100169", "title": "used" }], "id": "200167", "title": "dev" }, { "nodes": [{ "nodes": [], "id": "100171", "title": "free" }, { "nodes": [], "id": "100172", "title": "used" }], "id": "200170", "title": "root" }, { "nodes": [{ "nodes": [], "id": "100174", "title": "free" }, { "nodes": [], "id": "100175", "title": "used" }], "id": "200173", "title": "run-lock" }, { "nodes": [{ "nodes": [], "id": "100177", "title": "free" }, { "nodes": [], "id": "100178", "title": "used" }], "id": "200176", "title": "run-shm" }, { "nodes": [{ "nodes": [], "id": "100180", "title": "free" }, { "nodes": [], "id": "100181", "title": "used" }], "id": "200179", "title": "run" }, { "nodes": [{ "nodes": [], "id": "100183", "title": "free" }, { "nodes": [], "id": "100184", "title": "used" }], "id": "200182", "title": "sys-fs-cgroup" }], "id": "1400163", "title": "df" }], "id": "1400162", "title": "df" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100187", "title": "disk_merged (read)" }, { "nodes": [], "id": "100188", "title": "disk_merged (write)" }, { "nodes": [], "id": "100189", "title": "disk_octets (read)" }, { "nodes": [], "id": "100190", "title": "disk_octets (write)" }, { "nodes": [], "id": "100191", "title": "disk_ops (read)" }, { "nodes": [], "id": "100192", "title": "disk_ops (write)" }, { "nodes": [], "id": "100193", "title": "disk_time (read)" }, { "nodes": [], "id": "100194", "title": "disk_time (write)" }], "id": "800186", "title": "dm-0" }, { "nodes": [{ "nodes": [], "id": "100196", "title": "disk_merged (read)" }, { "nodes": [], "id": "100197", "title": "disk_merged (write)" }, { "nodes": [], "id": "100198", "title": "disk_octets (read)" }, { "nodes": [], "id": "100199", "title": "disk_octets (write)" }, { "nodes": [], "id": "100200", "title": "disk_ops (read)" }, { "nodes": [], "id": "100201", "title": "disk_ops (write)" }, { "nodes": [], "id": "100202", "title": "disk_time (read)" }, { "nodes": [], "id": "100203", "title": "disk_time (write)" }], "id": "800195", "title": "dm-1" }, { "nodes": [{ "nodes": [], "id": "100205", "title": "disk_merged (read)" }, { "nodes": [], "id": "100206", "title": "disk_merged (write)" }, { "nodes": [], "id": "100207", "title": "disk_octets (read)" }, { "nodes": [], "id": "100208", "title": "disk_octets (write)" }, { "nodes": [], "id": "100209", "title": "disk_ops (read)" }, { "nodes": [], "id": "100210", "title": "disk_ops (write)" }, { "nodes": [], "id": "100211", "title": "disk_time (read)" }, { "nodes": [], "id": "100212", "title": "disk_time (write)" }], "id": "800204", "title": "sda" }, { "nodes": [{ "nodes": [], "id": "100214", "title": "disk_merged (read)" }, { "nodes": [], "id": "100215", "title": "disk_merged (write)" }, { "nodes": [], "id": "100216", "title": "disk_octets (read)" }, { "nodes": [], "id": "100217", "title": "disk_octets (write)" }, { "nodes": [], "id": "100218", "title": "disk_ops (read)" }, { "nodes": [], "id": "100219", "title": "disk_ops (write)" }, { "nodes": [], "id": "100220", "title": "disk_time (read)" }, { "nodes": [], "id": "100221", "title": "disk_time (write)" }], "id": "800213", "title": "sda1" }, { "nodes": [{ "nodes": [], "id": "100223", "title": "disk_merged (read)" }, { "nodes": [], "id": "100224", "title": "disk_merged (write)" }, { "nodes": [], "id": "100225", "title": "disk_octets (read)" }, { "nodes": [], "id": "100226", "title": "disk_octets (write)" }, { "nodes": [], "id": "100227", "title": "disk_ops (read)" }, { "nodes": [], "id": "100228", "title": "disk_ops (write)" }, { "nodes": [], "id": "100229", "title": "disk_time (read)" }, { "nodes": [], "id": "100230", "title": "disk_time (write)" }], "id": "800222", "title": "sda2" }, { "nodes": [{ "nodes": [], "id": "100232", "title": "disk_merged (read)" }, { "nodes": [], "id": "100233", "title": "disk_merged (write)" }, { "nodes": [], "id": "100234", "title": "disk_octets (read)" }, { "nodes": [], "id": "100235", "title": "disk_octets (write)" }, { "nodes": [], "id": "100236", "title": "disk_ops (read)" }, { "nodes": [], "id": "100237", "title": "disk_ops (write)" }, { "nodes": [], "id": "100238", "title": "disk_time (read)" }, { "nodes": [], "id": "100239", "title": "disk_time (write)" }], "id": "800231", "title": "sda5" }, { "nodes": [{ "nodes": [], "id": "100241", "title": "disk_merged (read)" }, { "nodes": [], "id": "100242", "title": "disk_merged (write)" }, { "nodes": [], "id": "100243", "title": "disk_octets (read)" }, { "nodes": [], "id": "100244", "title": "disk_octets (write)" }, { "nodes": [], "id": "100245", "title": "disk_ops (read)" }, { "nodes": [], "id": "100246", "title": "disk_ops (write)" }, { "nodes": [], "id": "100247", "title": "disk_time (read)" }, { "nodes": [], "id": "100248", "title": "disk_time (write)" }], "id": "800240", "title": "vda" }, { "nodes": [{ "nodes": [], "id": "100250", "title": "disk_merged (read)" }, { "nodes": [], "id": "100251", "title": "disk_merged (write)" }, { "nodes": [], "id": "100252", "title": "disk_octets (read)" }, { "nodes": [], "id": "100253", "title": "disk_octets (write)" }, { "nodes": [], "id": "100254", "title": "disk_ops (read)" }, { "nodes": [], "id": "100255", "title": "disk_ops (write)" }, { "nodes": [], "id": "100256", "title": "disk_time (read)" }, { "nodes": [], "id": "100257", "title": "disk_time (write)" }], "id": "800249", "title": "vda1" }, { "nodes": [{ "nodes": [], "id": "100259", "title": "disk_merged (read)" }, { "nodes": [], "id": "100260", "title": "disk_merged (write)" }, { "nodes": [], "id": "100261", "title": "disk_octets (read)" }, { "nodes": [], "id": "100262", "title": "disk_octets (write)" }, { "nodes": [], "id": "100263", "title": "disk_ops (read)" }, { "nodes": [], "id": "100264", "title": "disk_ops (write)" }, { "nodes": [], "id": "100265", "title": "disk_time (read)" }, { "nodes": [], "id": "100266", "title": "disk_time (write)" }], "id": "800258", "title": "vda2" }, { "nodes": [{ "nodes": [], "id": "100268", "title": "disk_merged (read)" }, { "nodes": [], "id": "100269", "title": "disk_merged (write)" }, { "nodes": [], "id": "100270", "title": "disk_octets (read)" }, { "nodes": [], "id": "100271", "title": "disk_octets (write)" }, { "nodes": [], "id": "100272", "title": "disk_ops (read)" }, { "nodes": [], "id": "100273", "title": "disk_ops (write)" }, { "nodes": [], "id": "100274", "title": "disk_time (read)" }, { "nodes": [], "id": "100275", "title": "disk_time (write)" }], "id": "800267", "title": "vda3" }], "id": "8000185", "title": "disk" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100278", "title": "entropy" }], "id": "100277", "title": "entropy" }], "id": "100276", "title": "entropy" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100281", "title": "br-ex (rx)" }, { "nodes": [], "id": "100282", "title": "br-ex (tx)" }, { "nodes": [], "id": "100283", "title": "br-int (rx)" }, { "nodes": [], "id": "100284", "title": "br-int (tx)" }, { "nodes": [], "id": "100285", "title": "br-tun (rx)" }, { "nodes": [], "id": "100286", "title": "br-tun (tx)" }, { "nodes": [], "id": "100287", "title": "eth0 (rx)" }, { "nodes": [], "id": "100288", "title": "eth0 (tx)" }, { "nodes": [], "id": "100289", "title": "eth1 (rx)" }, { "nodes": [], "id": "100290", "title": "eth1 (tx)" }, { "nodes": [], "id": "100291", "title": "eth2 (rx)" }, { "nodes": [], "id": "100292", "title": "eth2 (tx)" }, { "nodes": [], "id": "100293", "title": "eth3 (rx)" }, { "nodes": [], "id": "100294", "title": "eth3 (tx)" }, { "nodes": [], "id": "100295", "title": "eth4 (rx)" }, { "nodes": [], "id": "100296", "title": "eth4 (tx)" }, { "nodes": [], "id": "100297", "title": "eth5 (rx)" }, { "nodes": [], "id": "100298", "title": "eth5 (tx)" }, { "nodes": [], "id": "100299", "title": "installation (rx)" }, { "nodes": [], "id": "100300", "title": "installation (tx)" }, { "nodes": [], "id": "100301", "title": "lo (rx)" }, { "nodes": [], "id": "100302", "title": "lo (tx)" }, { "nodes": [], "id": "100303", "title": "ovs-system (rx)" }, { "nodes": [], "id": "100304", "title": "ovs-system (tx)" }, { "nodes": [], "id": "100305", "title": "virbr0 (rx)" }, { "nodes": [], "id": "100306", "title": "virbr0 (tx)" }, { "nodes": [], "id": "100307", "title": "vnet0 (rx)" }, { "nodes": [], "id": "100308", "title": "vnet0 (tx)" }, { "nodes": [], "id": "100309", "title": "vnet1 (rx)" }, { "nodes": [], "id": "100310", "title": "vnet1 (tx)" }, { "nodes": [], "id": "100311", "title": "vnet2 (rx)" }, { "nodes": [], "id": "100312", "title": "vnet2 (tx)" }, { "nodes": [], "id": "100313", "title": "vnet3 (rx)" }, { "nodes": [], "id": "100314", "title": "vnet3 (tx)" }], "id": "3400280", "title": "if_errors" }, { "nodes": [{ "nodes": [], "id": "100316", "title": "br-ex (rx)" }, { "nodes": [], "id": "100317", "title": "br-ex (tx)" }, { "nodes": [], "id": "100318", "title": "br-int (rx)" }, { "nodes": [], "id": "100319", "title": "br-int (tx)" }, { "nodes": [], "id": "100320", "title": "br-tun (rx)" }, { "nodes": [], "id": "100321", "title": "br-tun (tx)" }, { "nodes": [], "id": "100322", "title": "eth0 (rx)" }, { "nodes": [], "id": "100323", "title": "eth0 (tx)" }, { "nodes": [], "id": "100324", "title": "eth1 (rx)" }, { "nodes": [], "id": "100325", "title": "eth1 (tx)" }, { "nodes": [], "id": "100326", "title": "eth2 (rx)" }, { "nodes": [], "id": "100327", "title": "eth2 (tx)" }, { "nodes": [], "id": "100328", "title": "eth3 (rx)" }, { "nodes": [], "id": "100329", "title": "eth3 (tx)" }, { "nodes": [], "id": "100330", "title": "eth4 (rx)" }, { "nodes": [], "id": "100331", "title": "eth4 (tx)" }, { "nodes": [], "id": "100332", "title": "eth5 (rx)" }, { "nodes": [], "id": "100333", "title": "eth5 (tx)" }, { "nodes": [], "id": "100334", "title": "installation (rx)" }, { "nodes": [], "id": "100335", "title": "installation (tx)" }, { "nodes": [], "id": "100336", "title": "lo (rx)" }, { "nodes": [], "id": "100337", "title": "lo (tx)" }, { "nodes": [], "id": "100338", "title": "ovs-system (rx)" }, { "nodes": [], "id": "100339", "title": "ovs-system (tx)" }, { "nodes": [], "id": "100340", "title": "virbr0 (rx)" }, { "nodes": [], "id": "100341", "title": "virbr0 (tx)" }, { "nodes": [], "id": "100342", "title": "vnet0 (rx)" }, { "nodes": [], "id": "100343", "title": "vnet0 (tx)" }, { "nodes": [], "id": "100344", "title": "vnet1 (rx)" }, { "nodes": [], "id": "100345", "title": "vnet1 (tx)" }, { "nodes": [], "id": "100346", "title": "vnet2 (rx)" }, { "nodes": [], "id": "100347", "title": "vnet2 (tx)" }, { "nodes": [], "id": "100348", "title": "vnet3 (rx)" }, { "nodes": [], "id": "100349", "title": "vnet3 (tx)" }], "id": "3400315", "title": "if_octets" }, { "nodes": [{ "nodes": [], "id": "100351", "title": "br-ex (rx)" }, { "nodes": [], "id": "100352", "title": "br-ex (tx)" }, { "nodes": [], "id": "100353", "title": "br-int (rx)" }, { "nodes": [], "id": "100354", "title": "br-int (tx)" }, { "nodes": [], "id": "100355", "title": "br-tun (rx)" }, { "nodes": [], "id": "100356", "title": "br-tun (tx)" }, { "nodes": [], "id": "100357", "title": "eth0 (rx)" }, { "nodes": [], "id": "100358", "title": "eth0 (tx)" }, { "nodes": [], "id": "100359", "title": "eth1 (rx)" }, { "nodes": [], "id": "100360", "title": "eth1 (tx)" }, { "nodes": [], "id": "100361", "title": "eth2 (rx)" }, { "nodes": [], "id": "100362", "title": "eth2 (tx)" }, { "nodes": [], "id": "100363", "title": "eth3 (rx)" }, { "nodes": [], "id": "100364", "title": "eth3 (tx)" }, { "nodes": [], "id": "100365", "title": "eth4 (rx)" }, { "nodes": [], "id": "100366", "title": "eth4 (tx)" }, { "nodes": [], "id": "100367", "title": "eth5 (rx)" }, { "nodes": [], "id": "100368", "title": "eth5 (tx)" }, { "nodes": [], "id": "100369", "title": "installation (rx)" }, { "nodes": [], "id": "100370", "title": "installation (tx)" }, { "nodes": [], "id": "100371", "title": "lo (rx)" }, { "nodes": [], "id": "100372", "title": "lo (tx)" }, { "nodes": [], "id": "100373", "title": "ovs-system (rx)" }, { "nodes": [], "id": "100374", "title": "ovs-system (tx)" }, { "nodes": [], "id": "100375", "title": "virbr0 (rx)" }, { "nodes": [], "id": "100376", "title": "virbr0 (tx)" }, { "nodes": [], "id": "100377", "title": "vnet0 (rx)" }, { "nodes": [], "id": "100378", "title": "vnet0 (tx)" }, { "nodes": [], "id": "100379", "title": "vnet1 (rx)" }, { "nodes": [], "id": "100380", "title": "vnet1 (tx)" }, { "nodes": [], "id": "100381", "title": "vnet2 (rx)" }, { "nodes": [], "id": "100382", "title": "vnet2 (tx)" }, { "nodes": [], "id": "100383", "title": "vnet3 (rx)" }, { "nodes": [], "id": "100384", "title": "vnet3 (tx)" }], "id": "3400350", "title": "if_packets" }], "id": "10200279", "title": "interface" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100387", "title": "0 (value)" }, { "nodes": [], "id": "100388", "title": "1 (value)" }, { "nodes": [], "id": "100389", "title": "12 (value)" }, { "nodes": [], "id": "100390", "title": "16 (value)" }, { "nodes": [], "id": "100391", "title": "18 (value)" }, { "nodes": [], "id": "100392", "title": "19 (value)" }, { "nodes": [], "id": "100393", "title": "23 (value)" }, { "nodes": [], "id": "100394", "title": "24 (value)" }, { "nodes": [], "id": "100395", "title": "64 (value)" }, { "nodes": [], "id": "100396", "title": "65 (value)" }, { "nodes": [], "id": "100397", "title": "8 (value)" }, { "nodes": [], "id": "100398", "title": "9 (value)" }], "id": "1200386", "title": "irq" }], "id": "1200385", "title": "irq" }, { "nodes": [{ "nodes": [{ "nodes": [{ "nodes": [], "id": "100402", "title": "key_query_time" }], "id": "100401", "title": "cassandra" }], "id": "100400", "title": "datastore" }, { "nodes": [{ "nodes": [], "id": "100404", "title": "query_time" }, { "nodes": [], "id": "100405", "title": "request_time" }], "id": "200403", "title": "http" }, { "nodes": [{ "nodes": [], "id": "100407", "title": "free_memory" }, { "nodes": [], "id": "100408", "title": "max_memory" }, { "nodes": [], "id": "100409", "title": "thread_count" }, { "nodes": [], "id": "100410", "title": "total_memory" }], "id": "400406", "title": "jvm" }, { "nodes": [{ "nodes": [], "id": "100412", "title": "http_request_count" }, { "nodes": [], "id": "100413", "title": "telnet_request_count" }], "id": "200411", "title": "protocol" }], "id": "900399", "title": "kairosdb" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100416", "title": "longterm" }, { "nodes": [], "id": "100417", "title": "midterm" }, { "nodes": [], "id": "100418", "title": "shortterm" }], "id": "300415", "title": "load" }], "id": "300414", "title": "load" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100421", "title": "buffered (value)" }, { "nodes": [], "id": "100422", "title": "cached (value)" }, { "nodes": [], "id": "100423", "title": "free (value)" }, { "nodes": [], "id": "100424", "title": "used (value)" }], "id": "400420", "title": "memory" }], "id": "400419", "title": "memory" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "100427", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100429", "title": "processes" }, { "nodes": [], "id": "100430", "title": "threads" }], "id": "200428", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100432", "title": "syst" }, { "nodes": [], "id": "100433", "title": "user" }], "id": "200431", "title": "ps_cputime" }, { "nodes": [], "id": "100434", "title": "ps_data (value)" }, { "nodes": [], "id": "100435", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100436", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100437", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100438", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100440", "title": "majflt" }, { "nodes": [], "id": "100441", "title": "minflt" }], "id": "200439", "title": "ps_pagefaults" }, { "nodes": [], "id": "100442", "title": "ps_rss (value)" }, { "nodes": [], "id": "100443", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100444", "title": "ps_vm (value)" }], "id": "1500426", "title": "cinder-api" }, { "nodes": [{ "nodes": [], "id": "100446", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100448", "title": "processes" }, { "nodes": [], "id": "100449", "title": "threads" }], "id": "200447", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100451", "title": "syst" }, { "nodes": [], "id": "100452", "title": "user" }], "id": "200450", "title": "ps_cputime" }, { "nodes": [], "id": "100453", "title": "ps_data (value)" }, { "nodes": [], "id": "100454", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100455", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100456", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100457", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100459", "title": "majflt" }, { "nodes": [], "id": "100460", "title": "minflt" }], "id": "200458", "title": "ps_pagefaults" }, { "nodes": [], "id": "100461", "title": "ps_rss (value)" }, { "nodes": [], "id": "100462", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100463", "title": "ps_vm (value)" }], "id": "1500445", "title": "cinder-scheduler" }, { "nodes": [{ "nodes": [], "id": "100465", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100467", "title": "processes" }, { "nodes": [], "id": "100468", "title": "threads" }], "id": "200466", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100470", "title": "syst" }, { "nodes": [], "id": "100471", "title": "user" }], "id": "200469", "title": "ps_cputime" }, { "nodes": [], "id": "100472", "title": "ps_data (value)" }, { "nodes": [], "id": "100473", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100474", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100475", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100476", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100478", "title": "majflt" }, { "nodes": [], "id": "100479", "title": "minflt" }], "id": "200477", "title": "ps_pagefaults" }, { "nodes": [], "id": "100480", "title": "ps_rss (value)" }, { "nodes": [], "id": "100481", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100482", "title": "ps_vm (value)" }], "id": "1500464", "title": "cinder-volume" }, { "nodes": [{ "nodes": [], "id": "100484", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100486", "title": "processes" }, { "nodes": [], "id": "100487", "title": "threads" }], "id": "200485", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100489", "title": "syst" }, { "nodes": [], "id": "100490", "title": "user" }], "id": "200488", "title": "ps_cputime" }, { "nodes": [], "id": "100491", "title": "ps_data (value)" }, { "nodes": [], "id": "100492", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100493", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100494", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100495", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100497", "title": "majflt" }, { "nodes": [], "id": "100498", "title": "minflt" }], "id": "200496", "title": "ps_pagefaults" }, { "nodes": [], "id": "100499", "title": "ps_rss (value)" }, { "nodes": [], "id": "100500", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100501", "title": "ps_vm (value)" }], "id": "1500483", "title": "glance-api" }, { "nodes": [{ "nodes": [], "id": "100503", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100505", "title": "processes" }, { "nodes": [], "id": "100506", "title": "threads" }], "id": "200504", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100508", "title": "syst" }, { "nodes": [], "id": "100509", "title": "user" }], "id": "200507", "title": "ps_cputime" }, { "nodes": [], "id": "100510", "title": "ps_data (value)" }, { "nodes": [], "id": "100511", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100512", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100513", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100514", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100516", "title": "majflt" }, { "nodes": [], "id": "100517", "title": "minflt" }], "id": "200515", "title": "ps_pagefaults" }, { "nodes": [], "id": "100518", "title": "ps_rss (value)" }, { "nodes": [], "id": "100519", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100520", "title": "ps_vm (value)" }], "id": "1500502", "title": "glance-registry" }, { "nodes": [{ "nodes": [], "id": "100522", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100524", "title": "processes" }, { "nodes": [], "id": "100525", "title": "threads" }], "id": "200523", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100527", "title": "syst" }, { "nodes": [], "id": "100528", "title": "user" }], "id": "200526", "title": "ps_cputime" }, { "nodes": [], "id": "100529", "title": "ps_data (value)" }, { "nodes": [], "id": "100530", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100531", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100532", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100533", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100535", "title": "majflt" }, { "nodes": [], "id": "100536", "title": "minflt" }], "id": "200534", "title": "ps_pagefaults" }, { "nodes": [], "id": "100537", "title": "ps_rss (value)" }, { "nodes": [], "id": "100538", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100539", "title": "ps_vm (value)" }], "id": "1500521", "title": "haproxy" }, { "nodes": [{ "nodes": [], "id": "100541", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100543", "title": "processes" }, { "nodes": [], "id": "100544", "title": "threads" }], "id": "200542", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100546", "title": "syst" }, { "nodes": [], "id": "100547", "title": "user" }], "id": "200545", "title": "ps_cputime" }, { "nodes": [], "id": "100548", "title": "ps_data (value)" }, { "nodes": [], "id": "100549", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100550", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100551", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100552", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100554", "title": "majflt" }, { "nodes": [], "id": "100555", "title": "minflt" }], "id": "200553", "title": "ps_pagefaults" }, { "nodes": [], "id": "100556", "title": "ps_rss (value)" }, { "nodes": [], "id": "100557", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100558", "title": "ps_vm (value)" }], "id": "1500540", "title": "httpd" }, { "nodes": [{ "nodes": [], "id": "100560", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100562", "title": "processes" }, { "nodes": [], "id": "100563", "title": "threads" }], "id": "200561", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100565", "title": "syst" }, { "nodes": [], "id": "100566", "title": "user" }], "id": "200564", "title": "ps_cputime" }, { "nodes": [], "id": "100567", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100569", "title": "majflt" }, { "nodes": [], "id": "100570", "title": "minflt" }], "id": "200568", "title": "ps_pagefaults" }, { "nodes": [], "id": "100571", "title": "ps_rss (value)" }, { "nodes": [], "id": "100572", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100573", "title": "ps_vm (value)" }], "id": "1100559", "title": "iscsid" }, { "nodes": [{ "nodes": [], "id": "100575", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100577", "title": "processes" }, { "nodes": [], "id": "100578", "title": "threads" }], "id": "200576", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100580", "title": "syst" }, { "nodes": [], "id": "100581", "title": "user" }], "id": "200579", "title": "ps_cputime" }, { "nodes": [], "id": "100582", "title": "ps_data (value)" }, { "nodes": [], "id": "100583", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100584", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100585", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100586", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100588", "title": "majflt" }, { "nodes": [], "id": "100589", "title": "minflt" }], "id": "200587", "title": "ps_pagefaults" }, { "nodes": [], "id": "100590", "title": "ps_rss (value)" }, { "nodes": [], "id": "100591", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100592", "title": "ps_vm (value)" }], "id": "1500574", "title": "keepalived" }, { "nodes": [{ "nodes": [], "id": "100594", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100596", "title": "processes" }, { "nodes": [], "id": "100597", "title": "threads" }], "id": "200595", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100599", "title": "syst" }, { "nodes": [], "id": "100600", "title": "user" }], "id": "200598", "title": "ps_cputime" }, { "nodes": [], "id": "100601", "title": "ps_data (value)" }, { "nodes": [], "id": "100602", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100603", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100604", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100605", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100607", "title": "majflt" }, { "nodes": [], "id": "100608", "title": "minflt" }], "id": "200606", "title": "ps_pagefaults" }, { "nodes": [], "id": "100609", "title": "ps_rss (value)" }, { "nodes": [], "id": "100610", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100611", "title": "ps_vm (value)" }], "id": "1500593", "title": "keystone" }, { "nodes": [{ "nodes": [], "id": "100613", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100615", "title": "processes" }, { "nodes": [], "id": "100616", "title": "threads" }], "id": "200614", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100618", "title": "syst" }, { "nodes": [], "id": "100619", "title": "user" }], "id": "200617", "title": "ps_cputime" }, { "nodes": [], "id": "100620", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100622", "title": "majflt" }, { "nodes": [], "id": "100623", "title": "minflt" }], "id": "200621", "title": "ps_pagefaults" }, { "nodes": [], "id": "100624", "title": "ps_rss (value)" }, { "nodes": [], "id": "100625", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100626", "title": "ps_vm (value)" }], "id": "1100612", "title": "multipathd" }, { "nodes": [{ "nodes": [], "id": "100628", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100630", "title": "processes" }, { "nodes": [], "id": "100631", "title": "threads" }], "id": "200629", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100633", "title": "syst" }, { "nodes": [], "id": "100634", "title": "user" }], "id": "200632", "title": "ps_cputime" }, { "nodes": [], "id": "100635", "title": "ps_data (value)" }, { "nodes": [], "id": "100636", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100637", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100638", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100639", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100641", "title": "majflt" }, { "nodes": [], "id": "100642", "title": "minflt" }], "id": "200640", "title": "ps_pagefaults" }, { "nodes": [], "id": "100643", "title": "ps_rss (value)" }, { "nodes": [], "id": "100644", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100645", "title": "ps_vm (value)" }], "id": "1500627", "title": "mysqld" }, { "nodes": [{ "nodes": [], "id": "100647", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100649", "title": "processes" }, { "nodes": [], "id": "100650", "title": "threads" }], "id": "200648", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100652", "title": "syst" }, { "nodes": [], "id": "100653", "title": "user" }], "id": "200651", "title": "ps_cputime" }, { "nodes": [], "id": "100654", "title": "ps_data (value)" }, { "nodes": [], "id": "100655", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100656", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100657", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100658", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100660", "title": "majflt" }, { "nodes": [], "id": "100661", "title": "minflt" }], "id": "200659", "title": "ps_pagefaults" }, { "nodes": [], "id": "100662", "title": "ps_rss (value)" }, { "nodes": [], "id": "100663", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100664", "title": "ps_vm (value)" }], "id": "1500646", "title": "nova-api" }, { "nodes": [{ "nodes": [], "id": "100666", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100668", "title": "processes" }, { "nodes": [], "id": "100669", "title": "threads" }], "id": "200667", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100671", "title": "syst" }, { "nodes": [], "id": "100672", "title": "user" }], "id": "200670", "title": "ps_cputime" }, { "nodes": [], "id": "100673", "title": "ps_data (value)" }, { "nodes": [], "id": "100674", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100675", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100676", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100677", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100679", "title": "majflt" }, { "nodes": [], "id": "100680", "title": "minflt" }], "id": "200678", "title": "ps_pagefaults" }, { "nodes": [], "id": "100681", "title": "ps_rss (value)" }, { "nodes": [], "id": "100682", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100683", "title": "ps_vm (value)" }], "id": "1500665", "title": "nova-cert" }, { "nodes": [{ "nodes": [], "id": "100685", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100687", "title": "processes" }, { "nodes": [], "id": "100688", "title": "threads" }], "id": "200686", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100690", "title": "syst" }, { "nodes": [], "id": "100691", "title": "user" }], "id": "200689", "title": "ps_cputime" }, { "nodes": [], "id": "100692", "title": "ps_data (value)" }, { "nodes": [], "id": "100693", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100694", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100695", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100696", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100698", "title": "majflt" }, { "nodes": [], "id": "100699", "title": "minflt" }], "id": "200697", "title": "ps_pagefaults" }, { "nodes": [], "id": "100700", "title": "ps_rss (value)" }, { "nodes": [], "id": "100701", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100702", "title": "ps_vm (value)" }], "id": "1500684", "title": "nova-compute" }, { "nodes": [{ "nodes": [], "id": "100704", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100706", "title": "processes" }, { "nodes": [], "id": "100707", "title": "threads" }], "id": "200705", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100709", "title": "syst" }, { "nodes": [], "id": "100710", "title": "user" }], "id": "200708", "title": "ps_cputime" }, { "nodes": [], "id": "100711", "title": "ps_data (value)" }, { "nodes": [], "id": "100712", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100713", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100714", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100715", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100717", "title": "majflt" }, { "nodes": [], "id": "100718", "title": "minflt" }], "id": "200716", "title": "ps_pagefaults" }, { "nodes": [], "id": "100719", "title": "ps_rss (value)" }, { "nodes": [], "id": "100720", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100721", "title": "ps_vm (value)" }], "id": "1500703", "title": "nova-conductor" }, { "nodes": [{ "nodes": [], "id": "100723", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100725", "title": "processes" }, { "nodes": [], "id": "100726", "title": "threads" }], "id": "200724", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100728", "title": "syst" }, { "nodes": [], "id": "100729", "title": "user" }], "id": "200727", "title": "ps_cputime" }, { "nodes": [], "id": "100730", "title": "ps_data (value)" }, { "nodes": [], "id": "100731", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100732", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100733", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100734", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100736", "title": "majflt" }, { "nodes": [], "id": "100737", "title": "minflt" }], "id": "200735", "title": "ps_pagefaults" }, { "nodes": [], "id": "100738", "title": "ps_rss (value)" }, { "nodes": [], "id": "100739", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100740", "title": "ps_vm (value)" }], "id": "1500722", "title": "nova-novncproxy" }, { "nodes": [{ "nodes": [], "id": "100742", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100744", "title": "processes" }, { "nodes": [], "id": "100745", "title": "threads" }], "id": "200743", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100747", "title": "syst" }, { "nodes": [], "id": "100748", "title": "user" }], "id": "200746", "title": "ps_cputime" }, { "nodes": [], "id": "100749", "title": "ps_data (value)" }, { "nodes": [], "id": "100750", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100751", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100752", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100753", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100755", "title": "majflt" }, { "nodes": [], "id": "100756", "title": "minflt" }], "id": "200754", "title": "ps_pagefaults" }, { "nodes": [], "id": "100757", "title": "ps_rss (value)" }, { "nodes": [], "id": "100758", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100759", "title": "ps_vm (value)" }], "id": "1500741", "title": "nova-scheduler" }, { "nodes": [{ "nodes": [], "id": "100761", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100763", "title": "processes" }, { "nodes": [], "id": "100764", "title": "threads" }], "id": "200762", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100766", "title": "syst" }, { "nodes": [], "id": "100767", "title": "user" }], "id": "200765", "title": "ps_cputime" }, { "nodes": [], "id": "100768", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100770", "title": "majflt" }, { "nodes": [], "id": "100771", "title": "minflt" }], "id": "200769", "title": "ps_pagefaults" }, { "nodes": [], "id": "100772", "title": "ps_rss (value)" }, { "nodes": [], "id": "100773", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100774", "title": "ps_vm (value)" }], "id": "1100760", "title": "nova-xvpvncproxy" }, { "nodes": [{ "nodes": [], "id": "100776", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100778", "title": "processes" }, { "nodes": [], "id": "100779", "title": "threads" }], "id": "200777", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100781", "title": "syst" }, { "nodes": [], "id": "100782", "title": "user" }], "id": "200780", "title": "ps_cputime" }, { "nodes": [], "id": "100783", "title": "ps_data (value)" }, { "nodes": [], "id": "100784", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "100785", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "100786", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "100787", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "100789", "title": "majflt" }, { "nodes": [], "id": "100790", "title": "minflt" }], "id": "200788", "title": "ps_pagefaults" }, { "nodes": [], "id": "100791", "title": "ps_rss (value)" }, { "nodes": [], "id": "100792", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100793", "title": "ps_vm (value)" }], "id": "1500775", "title": "novaapi" }, { "nodes": [{ "nodes": [], "id": "100795", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100797", "title": "processes" }, { "nodes": [], "id": "100798", "title": "threads" }], "id": "200796", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100800", "title": "syst" }, { "nodes": [], "id": "100801", "title": "user" }], "id": "200799", "title": "ps_cputime" }, { "nodes": [], "id": "100802", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100804", "title": "majflt" }, { "nodes": [], "id": "100805", "title": "minflt" }], "id": "200803", "title": "ps_pagefaults" }, { "nodes": [], "id": "100806", "title": "ps_rss (value)" }, { "nodes": [], "id": "100807", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100808", "title": "ps_vm (value)" }], "id": "1100794", "title": "openstack-cinder-api" }, { "nodes": [{ "nodes": [], "id": "100810", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100812", "title": "processes" }, { "nodes": [], "id": "100813", "title": "threads" }], "id": "200811", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100815", "title": "syst" }, { "nodes": [], "id": "100816", "title": "user" }], "id": "200814", "title": "ps_cputime" }, { "nodes": [], "id": "100817", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100819", "title": "majflt" }, { "nodes": [], "id": "100820", "title": "minflt" }], "id": "200818", "title": "ps_pagefaults" }, { "nodes": [], "id": "100821", "title": "ps_rss (value)" }, { "nodes": [], "id": "100822", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100823", "title": "ps_vm (value)" }], "id": "1100809", "title": "openstack-cinder-scheduler" }, { "nodes": [{ "nodes": [], "id": "100825", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100827", "title": "processes" }, { "nodes": [], "id": "100828", "title": "threads" }], "id": "200826", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100830", "title": "syst" }, { "nodes": [], "id": "100831", "title": "user" }], "id": "200829", "title": "ps_cputime" }, { "nodes": [], "id": "100832", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100834", "title": "majflt" }, { "nodes": [], "id": "100835", "title": "minflt" }], "id": "200833", "title": "ps_pagefaults" }, { "nodes": [], "id": "100836", "title": "ps_rss (value)" }, { "nodes": [], "id": "100837", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100838", "title": "ps_vm (value)" }], "id": "1100824", "title": "openstack-cinder-volume" }, { "nodes": [{ "nodes": [], "id": "100840", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100842", "title": "processes" }, { "nodes": [], "id": "100843", "title": "threads" }], "id": "200841", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100845", "title": "syst" }, { "nodes": [], "id": "100846", "title": "user" }], "id": "200844", "title": "ps_cputime" }, { "nodes": [], "id": "100847", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100849", "title": "majflt" }, { "nodes": [], "id": "100850", "title": "minflt" }], "id": "200848", "title": "ps_pagefaults" }, { "nodes": [], "id": "100851", "title": "ps_rss (value)" }, { "nodes": [], "id": "100852", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100853", "title": "ps_vm (value)" }], "id": "1100839", "title": "openstack-glance-api" }, { "nodes": [{ "nodes": [], "id": "100855", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100857", "title": "processes" }, { "nodes": [], "id": "100858", "title": "threads" }], "id": "200856", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100860", "title": "syst" }, { "nodes": [], "id": "100861", "title": "user" }], "id": "200859", "title": "ps_cputime" }, { "nodes": [], "id": "100862", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100864", "title": "majflt" }, { "nodes": [], "id": "100865", "title": "minflt" }], "id": "200863", "title": "ps_pagefaults" }, { "nodes": [], "id": "100866", "title": "ps_rss (value)" }, { "nodes": [], "id": "100867", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100868", "title": "ps_vm (value)" }], "id": "1100854", "title": "openstack-glance-registry" }, { "nodes": [{ "nodes": [], "id": "100870", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100872", "title": "processes" }, { "nodes": [], "id": "100873", "title": "threads" }], "id": "200871", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100875", "title": "syst" }, { "nodes": [], "id": "100876", "title": "user" }], "id": "200874", "title": "ps_cputime" }, { "nodes": [], "id": "100877", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100879", "title": "majflt" }, { "nodes": [], "id": "100880", "title": "minflt" }], "id": "200878", "title": "ps_pagefaults" }, { "nodes": [], "id": "100881", "title": "ps_rss (value)" }, { "nodes": [], "id": "100882", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100883", "title": "ps_vm (value)" }], "id": "1100869", "title": "openstack-keystone" }, { "nodes": [{ "nodes": [], "id": "100885", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100887", "title": "processes" }, { "nodes": [], "id": "100888", "title": "threads" }], "id": "200886", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100890", "title": "syst" }, { "nodes": [], "id": "100891", "title": "user" }], "id": "200889", "title": "ps_cputime" }, { "nodes": [], "id": "100892", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100894", "title": "majflt" }, { "nodes": [], "id": "100895", "title": "minflt" }], "id": "200893", "title": "ps_pagefaults" }, { "nodes": [], "id": "100896", "title": "ps_rss (value)" }, { "nodes": [], "id": "100897", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100898", "title": "ps_vm (value)" }], "id": "1100884", "title": "openstack-nova-api" }, { "nodes": [{ "nodes": [], "id": "100900", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100902", "title": "processes" }, { "nodes": [], "id": "100903", "title": "threads" }], "id": "200901", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100905", "title": "syst" }, { "nodes": [], "id": "100906", "title": "user" }], "id": "200904", "title": "ps_cputime" }, { "nodes": [], "id": "100907", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100909", "title": "majflt" }, { "nodes": [], "id": "100910", "title": "minflt" }], "id": "200908", "title": "ps_pagefaults" }, { "nodes": [], "id": "100911", "title": "ps_rss (value)" }, { "nodes": [], "id": "100912", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100913", "title": "ps_vm (value)" }], "id": "1100899", "title": "openstack-nova-cert" }, { "nodes": [{ "nodes": [], "id": "100915", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100917", "title": "processes" }, { "nodes": [], "id": "100918", "title": "threads" }], "id": "200916", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100920", "title": "syst" }, { "nodes": [], "id": "100921", "title": "user" }], "id": "200919", "title": "ps_cputime" }, { "nodes": [], "id": "100922", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100924", "title": "majflt" }, { "nodes": [], "id": "100925", "title": "minflt" }], "id": "200923", "title": "ps_pagefaults" }, { "nodes": [], "id": "100926", "title": "ps_rss (value)" }, { "nodes": [], "id": "100927", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100928", "title": "ps_vm (value)" }], "id": "1100914", "title": "openstack-nova-compute" }, { "nodes": [{ "nodes": [], "id": "100930", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100932", "title": "processes" }, { "nodes": [], "id": "100933", "title": "threads" }], "id": "200931", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100935", "title": "syst" }, { "nodes": [], "id": "100936", "title": "user" }], "id": "200934", "title": "ps_cputime" }, { "nodes": [], "id": "100937", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100939", "title": "majflt" }, { "nodes": [], "id": "100940", "title": "minflt" }], "id": "200938", "title": "ps_pagefaults" }, { "nodes": [], "id": "100941", "title": "ps_rss (value)" }, { "nodes": [], "id": "100942", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100943", "title": "ps_vm (value)" }], "id": "1100929", "title": "openstack-nova-conductor" }, { "nodes": [{ "nodes": [], "id": "100945", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100947", "title": "processes" }, { "nodes": [], "id": "100948", "title": "threads" }], "id": "200946", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100950", "title": "syst" }, { "nodes": [], "id": "100951", "title": "user" }], "id": "200949", "title": "ps_cputime" }, { "nodes": [], "id": "100952", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100954", "title": "majflt" }, { "nodes": [], "id": "100955", "title": "minflt" }], "id": "200953", "title": "ps_pagefaults" }, { "nodes": [], "id": "100956", "title": "ps_rss (value)" }, { "nodes": [], "id": "100957", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100958", "title": "ps_vm (value)" }], "id": "1100944", "title": "openstack-nova-novncproxy" }, { "nodes": [{ "nodes": [], "id": "100960", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100962", "title": "processes" }, { "nodes": [], "id": "100963", "title": "threads" }], "id": "200961", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100965", "title": "syst" }, { "nodes": [], "id": "100966", "title": "user" }], "id": "200964", "title": "ps_cputime" }, { "nodes": [], "id": "100967", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100969", "title": "majflt" }, { "nodes": [], "id": "100970", "title": "minflt" }], "id": "200968", "title": "ps_pagefaults" }, { "nodes": [], "id": "100971", "title": "ps_rss (value)" }, { "nodes": [], "id": "100972", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100973", "title": "ps_vm (value)" }], "id": "1100959", "title": "openstack-nova-scheduler" }, { "nodes": [{ "nodes": [], "id": "100975", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100977", "title": "processes" }, { "nodes": [], "id": "100978", "title": "threads" }], "id": "200976", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "100980", "title": "syst" }, { "nodes": [], "id": "100981", "title": "user" }], "id": "200979", "title": "ps_cputime" }, { "nodes": [], "id": "100982", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "100984", "title": "majflt" }, { "nodes": [], "id": "100985", "title": "minflt" }], "id": "200983", "title": "ps_pagefaults" }, { "nodes": [], "id": "100986", "title": "ps_rss (value)" }, { "nodes": [], "id": "100987", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "100988", "title": "ps_vm (value)" }], "id": "1100974", "title": "openstack-nova-xvpvncproxy" }, { "nodes": [{ "nodes": [], "id": "100990", "title": "blocked (value)" }, { "nodes": [], "id": "100991", "title": "paging (value)" }, { "nodes": [], "id": "100992", "title": "running (value)" }, { "nodes": [], "id": "100993", "title": "sleeping (value)" }, { "nodes": [], "id": "100994", "title": "stopped (value)" }, { "nodes": [], "id": "100995", "title": "zombies (value)" }], "id": "600989", "title": "ps_state" }, { "nodes": [{ "nodes": [], "id": "100997", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "100999", "title": "processes" }, { "nodes": [], "id": "1001000", "title": "threads" }], "id": "200998", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001002", "title": "syst" }, { "nodes": [], "id": "1001003", "title": "user" }], "id": "2001001", "title": "ps_cputime" }, { "nodes": [], "id": "1001004", "title": "ps_data (value)" }, { "nodes": [], "id": "1001005", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001006", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001007", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001008", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001010", "title": "majflt" }, { "nodes": [], "id": "1001011", "title": "minflt" }], "id": "2001009", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001012", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001013", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001014", "title": "ps_vm (value)" }], "id": "1500996", "title": "quantum-dhcp-agent" }, { "nodes": [{ "nodes": [], "id": "1001016", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001018", "title": "processes" }, { "nodes": [], "id": "1001019", "title": "threads" }], "id": "2001017", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001021", "title": "syst" }, { "nodes": [], "id": "1001022", "title": "user" }], "id": "2001020", "title": "ps_cputime" }, { "nodes": [], "id": "1001023", "title": "ps_data (value)" }, { "nodes": [], "id": "1001024", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001025", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001026", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001027", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001029", "title": "majflt" }, { "nodes": [], "id": "1001030", "title": "minflt" }], "id": "2001028", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001031", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001032", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001033", "title": "ps_vm (value)" }], "id": "15001015", "title": "quantum-l3-agent" }, { "nodes": [{ "nodes": [], "id": "1001035", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001037", "title": "processes" }, { "nodes": [], "id": "1001038", "title": "threads" }], "id": "2001036", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001040", "title": "syst" }, { "nodes": [], "id": "1001041", "title": "user" }], "id": "2001039", "title": "ps_cputime" }, { "nodes": [], "id": "1001042", "title": "ps_data (value)" }, { "nodes": [], "id": "1001043", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001044", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001045", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001046", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001048", "title": "majflt" }, { "nodes": [], "id": "1001049", "title": "minflt" }], "id": "2001047", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001050", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001051", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001052", "title": "ps_vm (value)" }], "id": "15001034", "title": "quantum-metadata-agent" }, { "nodes": [{ "nodes": [], "id": "1001054", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001056", "title": "processes" }, { "nodes": [], "id": "1001057", "title": "threads" }], "id": "2001055", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001059", "title": "syst" }, { "nodes": [], "id": "1001060", "title": "user" }], "id": "2001058", "title": "ps_cputime" }, { "nodes": [], "id": "1001061", "title": "ps_data (value)" }, { "nodes": [], "id": "1001062", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001063", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001064", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001065", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001067", "title": "majflt" }, { "nodes": [], "id": "1001068", "title": "minflt" }], "id": "2001066", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001069", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001070", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001071", "title": "ps_vm (value)" }], "id": "15001053", "title": "quantum-openvswitch-agent" }, { "nodes": [{ "nodes": [], "id": "1001073", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001075", "title": "processes" }, { "nodes": [], "id": "1001076", "title": "threads" }], "id": "2001074", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001078", "title": "syst" }, { "nodes": [], "id": "1001079", "title": "user" }], "id": "2001077", "title": "ps_cputime" }, { "nodes": [], "id": "1001080", "title": "ps_data (value)" }, { "nodes": [], "id": "1001081", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001082", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001083", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001084", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001086", "title": "majflt" }, { "nodes": [], "id": "1001087", "title": "minflt" }], "id": "2001085", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001088", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001089", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001090", "title": "ps_vm (value)" }], "id": "15001072", "title": "quantum-server" }, { "nodes": [{ "nodes": [], "id": "1001092", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001094", "title": "processes" }, { "nodes": [], "id": "1001095", "title": "threads" }], "id": "2001093", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001097", "title": "syst" }, { "nodes": [], "id": "1001098", "title": "user" }], "id": "2001096", "title": "ps_cputime" }, { "nodes": [], "id": "1001099", "title": "ps_data (value)" }, { "nodes": [], "id": "1001100", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001101", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001102", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001103", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001105", "title": "majflt" }, { "nodes": [], "id": "1001106", "title": "minflt" }], "id": "2001104", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001107", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001108", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001109", "title": "ps_vm (value)" }], "id": "15001091", "title": "rabbitmq-server" }, { "nodes": [{ "nodes": [], "id": "1001111", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001113", "title": "processes" }, { "nodes": [], "id": "1001114", "title": "threads" }], "id": "2001112", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001116", "title": "syst" }, { "nodes": [], "id": "1001117", "title": "user" }], "id": "2001115", "title": "ps_cputime" }, { "nodes": [], "id": "1001118", "title": "ps_data (value)" }, { "nodes": [], "id": "1001119", "title": "ps_disk_octets (read)" }, { "nodes": [], "id": "1001120", "title": "ps_disk_octets (write)" }, { "nodes": [], "id": "1001121", "title": "ps_disk_ops (read)" }, { "nodes": [], "id": "1001122", "title": "ps_disk_ops (write)" }, { "nodes": [{ "nodes": [], "id": "1001124", "title": "majflt" }, { "nodes": [], "id": "1001125", "title": "minflt" }], "id": "2001123", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001126", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001127", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001128", "title": "ps_vm (value)" }], "id": "15001110", "title": "rabbitmq" }, { "nodes": [{ "nodes": [], "id": "1001130", "title": "ps_code (value)" }, { "nodes": [{ "nodes": [], "id": "1001132", "title": "processes" }, { "nodes": [], "id": "1001133", "title": "threads" }], "id": "2001131", "title": "ps_count" }, { "nodes": [{ "nodes": [], "id": "1001135", "title": "syst" }, { "nodes": [], "id": "1001136", "title": "user" }], "id": "2001134", "title": "ps_cputime" }, { "nodes": [], "id": "1001137", "title": "ps_data (value)" }, { "nodes": [{ "nodes": [], "id": "1001139", "title": "majflt" }, { "nodes": [], "id": "1001140", "title": "minflt" }], "id": "2001138", "title": "ps_pagefaults" }, { "nodes": [], "id": "1001141", "title": "ps_rss (value)" }, { "nodes": [], "id": "1001142", "title": "ps_stacksize (value)" }, { "nodes": [], "id": "1001143", "title": "ps_vm (value)" }], "id": "11001129", "title": "usr_bin_nova-api" }], "id": "55300425", "title": "processes" }, { "nodes": [{ "nodes": [{ "nodes": [], "id": "1001146", "title": "cached (value)" }, { "nodes": [], "id": "1001147", "title": "free (value)" }, { "nodes": [], "id": "1001148", "title": "used (value)" }], "id": "3001145", "title": "swap" }, { "nodes": [{ "nodes": [], "id": "1001150", "title": "in (value)" }, { "nodes": [], "id": "1001151", "title": "out (value)" }], "id": "2001149", "title": "swap_io" }], "id": "5001144", "title": "swap" }, { "nodes": [], "id": "1001152", "title": "users" }];
        return [200, metricstree, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*\/metrics$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metrics = ["kairosdb.datastore.query_collisions","kairosdb.datastore.write_size","kairosdb.jvm.free_memory","kairosdb.jvm.max_memory","kairosdb.jvm.thread_count","kairosdb.jvm.total_memory","kairosdb.protocol.http_request_count","kairosdb.protocol.telnet_request_count"];
        return [200, metrics, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/metrics\/.*/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metricData = [{
            "key": "Series 1",
            "values": [
                [1136005200000, 1271000.0],
                [1138683600000, 1271000.0],
                [1141102800000, 1271000.0],
                [1159588800000, 3899486.0],
                [1162270800000, 3899486.0],
                [1164862800000, 3899486.0],
                [1167541200000, 3564700.0],
                [1170219600000, 3564700.0],
                [1172638800000, 3564700.0],
                [1191124800000, 2906501.0],
                [1193803200000, 2906501.0],
                [1196398800000, 2906501.0],
                [1199077200000, 2206761.0],
                [1201755600000, 2206761.0],
                [1204261200000, 2206761.0],
                [1206936000000, 2287726.0],
                [1209528000000, 2287726.0],
                [1212206400000, 2287726.0],
                [1214798400000, 2732646.0],
                [1217476800000, 2732646.0],
                [1225425600000, 2599196.0],
                [1228021200000, 2599196.0],
                [1230699600000, 1924387.0],
                [1233378000000, 1924387.0],
                [1235797200000, 1924387.0],
                [1249012800000, 1743470.0],
                [1251691200000, 1743470.0],
                [1254283200000, 1519010.0],
                [1256961600000, 1087726.0],
                [1264914000000, 2087726.0],
                [1267333200000, 2287726.0],
                [1270008000000, 2287726.0],
                [1272600000000, 2287726.0],
                [1275278400000, 2287726.0],
                [1277870400000, 1309915.0],
                [1280548800000, 1309915.0],
                [1283227200000, 1309915.0],
                [1285819200000, 1331875.0],
                [1288497600000, 1331875.0],
                [1291093200000, 1331875.0],
                [1293771600000, 1331875.0],
                [1314763200000, 1244525.0],
                [1317355200000, 475000.0],
                [1320033600000, 475000.0],
                [1322629200000, 475000.0],
                [1325307600000, 690033.0],
                [1327986000000, 690033.0],
                [1330491600000, 690033.0],
                [1333166400000, 514733.0],
                [1335758400000, 514733.0]
            ]
        }, {
            "key": "Series 2",
            "values": [
                [1136005200000, 1271000.0],
                [1138683600000, 1271000.0],
                [1141102800000, 1271000.0],
                [1159588800000, 3899486.0],
                [1162270800000, 3899486.0],
                [1164862800000, 3899486.0],
                [1167541200000, 2287726.0],
                [1170219600000, 2287726.0],
                [1172638800000, 3564700.0],
                [1175313600000, 2648493.0],
                [1177905600000, 2648493.0],
                [1180584000000, 2648493.0],
                [1183176000000, 2522993.0],
                [1185854400000, 2522993.0],
                [1188532800000, 2522993.0],
                [1191124800000, 2906501.0],
                [1193803200000, 2906501.0],
                [1196398800000, 2906501.0],
                [1199077200000, 2206761.0],
                [1201755600000, 2206761.0],
                [1204261200000, 2206761.0],
                [1206936000000, 2287726.0],
                [1209528000000, 2287726.0],
                [1212206400000, 2287726.0],
                [1214798400000, 2732646.0],
                [1217476800000, 2732646.0],
                [1220155200000, 2732646.0],
                [1222747200000, 2599196.0],
                [1225425600000, 2599196.0],
                [1228021200000, 2599196.0],
                [1230699600000, 1924387.0],
                [1233378000000, 1924387.0],
                [1235797200000, 1924387.0],
                [1238472000000, 1756311.0],
                [1241064000000, 1756311.0],
            ]
        }, {
            "key": "Series 3",
            "values": [
                [1136005200000, 1271000.0],
                [1138683600000, 1271000.0],
                [1141102800000, 1271000.0],
                [1159588800000, 3899486.0],
                [1177905600000, 2648493.0],
                [1180584000000, 2648493.0],
                [1183176000000, 2522993.0],
                [1185854400000, 2522993.0],
                [1188532800000, 2522993.0],
                [1191124800000, 2906501.0],
                [1193803200000, 2906501.0],
                [1196398800000, 2906501.0],
                [1199077200000, 2206761.0],
                [1201755600000, 2206761.0],
                [1204261200000, 2206761.0],
                [1206936000000, 2287726.0],
                [1209528000000, 2287726.0],
                [1212206400000, 2287726.0],
                [1214798400000, 2732646.0],
                [1217476800000, 2732646.0],
                [1220155200000, 2732646.0],
                [1222747200000, 2599196.0],
                [1225425600000, 2599196.0],
                [1228021200000, 2599196.0],
                [1230699600000, 1924387.0],
                [1233378000000, 1924387.0],
                [1235797200000, 1924387.0],
                [1238472000000, 1756311.0],
                [1241064000000, 2287726.0],
                [1280548800000, 1309915.0],
                [1283227200000, 1309915.0],
                [1285819200000, 1331875.0],
                [1288497600000, 1331875.0],
                [1291093200000, 1331875.0],
                [1293771600000, 1331875.0],
                [1296450000000, 1154695.0],
                [1298869200000, 2287726.0],
                [1301544000000, 1194025.0],
                [1304136000000, 1194025.0],
                [1306814400000, 1194025.0],
                [1309406400000, 1194025.0],
                [1312084800000, 1194025.0],
                [1314763200000, 1244525.0]
            ]
        }, {
            "key": "Series 4",
            "values": [
                [1136005200000, 1271000.0],
                [1138683600000, 1271000.0],
                [1141102800000, 1271000.0],
                [1170219600000, 3564700.0],
                [1172638800000, 3564700.0],
                [1175313600000, 2648493.0],
                [1177905600000, 2648493.0],
                [1180584000000, 2648493.0],
                [1183176000000, 2522993.0],
                [1185854400000, 2522993.0],
                [1188532800000, 2522993.0],
                [1220155200000, 2732646.0],
                [1222747200000, 2599196.0],
                [1225425600000, 2599196.0],
                [1228021200000, 2599196.0],
                [1230699600000, 1271000.0],
                [1233378000000, 1924387.0],
                [1235797200000, 1924387.0],
                [1251691200000, 1743470.0],
                [1254283200000, 1519010.0],
                [1275278400000, 1543784.0],
                [1277870400000, 1271000.0],
                [1280548800000, 1309915.0],
                [1283227200000, 1309915.0],
                [1285819200000, 1331875.0],
                [1288497600000, 1331875.0],
                [1291093200000, 1331875.0],
                [1293771600000, 1331875.0],
                [1296450000000, 1154695.0],
                [1298869200000, 1154695.0],
                [1301544000000, 1194025.0],
                [1304136000000, 1194025.0],
                [1322629200000, 475000.0],
                [1325307600000, 690033.0],
                [1327986000000, 690033.0],
                [1330491600000, 690033.0],
                [1333166400000, 514733.0],
                [1335758400000, 514733.0]
            ]
        }];
        return [200, metricData, {}];
    });
});
});