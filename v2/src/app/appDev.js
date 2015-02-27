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
    $httpBackend.whenPOST(settings.apiUrlBase + '/users/logout').respond(function(method, url, data) {
        console.log(method, url, data);
        var message = {
            "message": "logout successfully"
        }
        return [200, message, {}];
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
                "flavors": [{
                    "roles": [{
                        "display_name": "Ceph Cluster (Firefly)",
                        "description": "Ceph Cluster (Firefly)",
                        "name": "ceph_firefly"
                    }],
                    "display_name": "Ceph Cluster (Firefly)",
                    "id": 1,
                    "template": "cephfirefly.tmpl",
                    "name": "ceph_firefly"
                }],
                "name": "ceph_firefly",
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
                "display_name": "ceph_firefly",
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
                }, {
                    "roles": [],
                    "display_name": "Multi-node Cluster with HA",
                    "id": 3,
                    "template": "ha.tmpl",
                    "name": "HA-multinodes"
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
            "first_name": "",
            "last_name": "",
            "active": false,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login_at": "2014-4-14"
        }, {
            "id": 2,
            "email": "tsinghua@compass.org",
            "first_name": "",
            "last_name": "",
            "active": true,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 3,
            "email": "ann@compass.org",
            "first_name": "Ann",
            "last_name": "",
            "active": true,
            "is_admin": false,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 4,
            "email": "john@compass.org",
            "first_name": "John",
            "last_name": "Smitch",
            "active": true,
            "is_admin": true,
            "created_at": "2014-4-14",
            "last_login": "2014-3-14"
        }, {
            "id": 5,
            "email": "tom@compass.org",
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
            "flavor":{
                "display_name": "Multi-node Cluster with HA",
                "name": "HA-multinodes"
            },
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
            "adapter_id": 6, // 6: ceph_openstack_icehouse, 5: openstack_icehouse, 4: ceph(chef), 2: os_only
            "adapter_name": "openstack_icehouse",
            "os_id": 1,
            "editable": true,
            "create_by": "user@someemail.com",
            "create_at": "2014-3-25 12:00:00",
            "updated_at": "2014-3-26 13:00:00",
            "flavor": {
                "name": "HA-multinodes",
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
                    "username": "root",
                    "password": "huawei"
                },
                "partition": {
                    "/var": {
                        "percentage": 30,
                        "max_size": "10G"
                    },
                    "/usr": {
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
                    "cluster_network": "",
                    "public_network": ""
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
                    "name": "os-controller@10.145.89.15",
                    "state": "warning",
                    "children": []
                }, {
                    "name": "os-db-node@10.145.89.16",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-keystone@10.145.89.17",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-network@10.145.89.18",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-image@10.145.89.19",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-mq@10.145.89.20",
                    "state": "ok",
                    "children": []
                }, {
                    "name": "os-compute1@10.145.89.21",
                    "state": "warning",
                    "children": []
                }, {
                    "name": "os-compute2@10.145.89.22",
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
            "status": "warning"
        }, {
            "startDate": 1406774590378,
            "endDate": 1406750781190,
            "name": "os-db-node",
            "status": "warning"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406840037149,
            "name": "os-db-node",
            "status": "warning"
        }, {
            "startDate": 1406855382748,
            "endDate": 1406857927670,
            "name": "os-controller",
            "status": "warning"
        }, {
            "startDate": 1406925382748,
            "endDate": 1406926927670,
            "name": "os-keystone",
            "status": "warning"
        }, {
            "startDate": 1406931282409,
            "endDate": 1406934037149,
            "name": "os-image",
            "status": "warning"
        }, {
            "startDate": 1406812282409,
            "endDate": 1406813037149,
            "name": "os-image",
            "status": "warning"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406841037149,
            "name": "os-controller",
            "status": "warning"
        }, {
            "startDate": 1406844282409,
            "endDate": 1406848037149,
            "name": "os-db-node",
            "status": "successful"
        }, {
            "startDate": 1406822282409,
            "endDate": 1406826037149,
            "name": "os-keystone",
            "status": "successful"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406838037149,
            "name": "os-mq",
            "status": "successful"
        }, {
            "startDate": 1406866282409,
            "endDate": 1406870037149,
            "name": "os-keystone",
            "status": "critical"
        }, {
            "startDate": 1406831282409,
            "endDate": 1406838037149,
            "name": "os-controller",
            "status": "successful"
        }, {
            "startDate": 1406820282409,
            "endDate": 1406826037149,
            "name": "os-image",
            "status": "successful"
        }, {
            "startDate": 1406890282409,
            "endDate": 1406895037149,
            "name": "os-image",
            "status": "warning"
        }, {
            "startDate": 1406791282409,
            "endDate": 1406800037149,
            "name": "os-compute2",
            "status": "warning"
        }, {
            "startDate": 1406850282409,
            "endDate": 1406857037149,
            "name": "os-compute1",
            "status": "warning"
        }, {
            "startDate": 1406866282409,
            "endDate": 1406867037149,
            "name": "os-controller",
            "status": "warning"
        }, {
            "startDate": 1406835282409,
            "endDate": 1406838037149,
            "name": "os-compute2",
            "status": "successful"
        }, {
            "startDate": 1406844282409,
            "endDate": 1406844937149,
            "name": "os-mq",
            "status": "successful"
        }, {
            "startDate": 1406850282409,
            "endDate": 1406860037149,
            "name": "os-compute2",
            "status": "successful"
        }, {
            "startDate": 1406871282409,
            "endDate": 1406875037149,
            "name": "os-compute1",
            "status": "successful"
        }, {
            "startDate": 1406882282409,
            "endDate": 1406889037149,
            "name": "os-network",
            "status": "critical"
        }, {
            "startDate": 1406883282409,
            "endDate": 1406886037149,
            "name": "os-mq",
            "status": "warning"
        }, {
            "startDate": 1406891282409,
            "endDate": 1406892037149,
            "name": "os-controller",
            "status": "unknown"
        }];
        return [200, alarms, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*\/metrictree$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metricstree = [ { "id": "cpu", "nodes": [ { "id": "cpu.0", "nodes": [ { "id": "cpu.0.cpu", "nodes": [ { "id": "cpu.0.cpu.idle.value", "nodes": [], "title": "idle (value)" }, { "id": "cpu.0.cpu.interrupt.value", "nodes": [], "title": "interrupt (value)" }, { "id": "cpu.0.cpu.nice.value", "nodes": [], "title": "nice (value)" }, { "id": "cpu.0.cpu.softirq.value", "nodes": [], "title": "softirq (value)" }, { "id": "cpu.0.cpu.steal.value", "nodes": [], "title": "steal (value)" }, { "id": "cpu.0.cpu.system.value", "nodes": [], "title": "system (value)" }, { "id": "cpu.0.cpu.user.value", "nodes": [], "title": "user (value)" }, { "id": "cpu.0.cpu.wait.value", "nodes": [], "title": "wait (value)" } ], "title": "cpu" } ], "title": "0" }, { "id": "cpu.all", "nodes": [ { "id": "cpu.all.cpu", "nodes": [ { "id": "cpu.all.cpu.guest.value", "nodes": [], "title": "guest (value)" }, { "id": "cpu.all.cpu.guest_nice.value", "nodes": [], "title": "guest_nice (value)" }, { "id": "cpu.all.cpu.guest_nice_percent.value", "nodes": [], "title": "guest_nice_percent (value)" }, { "id": "cpu.all.cpu.guest_percent.value", "nodes": [], "title": "guest_percent (value)" }, { "id": "cpu.all.cpu.idle.value", "nodes": [], "title": "idle (value)" }, { "id": "cpu.all.cpu.idle_percent.value", "nodes": [], "title": "idle_percent (value)" }, { "id": "cpu.all.cpu.interrupt.value", "nodes": [], "title": "interrupt (value)" }, { "id": "cpu.all.cpu.interrupt_percent.value", "nodes": [], "title": "interrupt_percent (value)" }, { "id": "cpu.all.cpu.nice.value", "nodes": [], "title": "nice (value)" }, { "id": "cpu.all.cpu.nice_percent.value", "nodes": [], "title": "nice_percent (value)" }, { "id": "cpu.all.cpu.softirq.value", "nodes": [], "title": "softirq (value)" }, { "id": "cpu.all.cpu.softirq_percent.value", "nodes": [], "title": "softirq_percent (value)" }, { "id": "cpu.all.cpu.steal.value", "nodes": [], "title": "steal (value)" }, { "id": "cpu.all.cpu.steal_percent.value", "nodes": [], "title": "steal_percent (value)" }, { "id": "cpu.all.cpu.system.value", "nodes": [], "title": "system (value)" }, { "id": "cpu.all.cpu.system_percent.value", "nodes": [], "title": "system_percent (value)" }, { "id": "cpu.all.cpu.wait.value", "nodes": [], "title": "wait (value)" }, { "id": "cpu.all.cpu.wait_percent.value", "nodes": [], "title": "wait_percent (value)" } ], "title": "cpu" } ], "title": "all" } ], "title": "cpu" }, { "id": "disk", "nodes": [ { "id": "disk.sda", "nodes": [ { "id": "disk.sda.disk_merged.read", "nodes": [], "title": "disk_merged (read)" }, { "id": "disk.sda.disk_merged.write", "nodes": [], "title": "disk_merged (write)" }, { "id": "disk.sda.disk_octets.read", "nodes": [], "title": "disk_octets (read)" }, { "id": "disk.sda.disk_octets.write", "nodes": [], "title": "disk_octets (write)" }, { "id": "disk.sda.disk_ops.read", "nodes": [], "title": "disk_ops (read)" }, { "id": "disk.sda.disk_ops.write", "nodes": [], "title": "disk_ops (write)" }, { "id": "disk.sda.disk_time.read", "nodes": [], "title": "disk_time (read)" }, { "id": "disk.sda.disk_time.write", "nodes": [], "title": "disk_time (write)" } ], "title": "sda" }, { "id": "disk.sda1", "nodes": [ { "id": "disk.sda1.disk_merged.read", "nodes": [], "title": "disk_merged (read)" }, { "id": "disk.sda1.disk_merged.write", "nodes": [], "title": "disk_merged (write)" }, { "id": "disk.sda1.disk_octets.read", "nodes": [], "title": "disk_octets (read)" }, { "id": "disk.sda1.disk_octets.write", "nodes": [], "title": "disk_octets (write)" }, { "id": "disk.sda1.disk_ops.read", "nodes": [], "title": "disk_ops (read)" }, { "id": "disk.sda1.disk_ops.write", "nodes": [], "title": "disk_ops (write)" }, { "id": "disk.sda1.disk_time.read", "nodes": [], "title": "disk_time (read)" }, { "id": "disk.sda1.disk_time.write", "nodes": [], "title": "disk_time (write)" } ], "title": "sda1" }, { "id": "disk.sda2", "nodes": [ { "id": "disk.sda2.disk_merged.read", "nodes": [], "title": "disk_merged (read)" }, { "id": "disk.sda2.disk_merged.write", "nodes": [], "title": "disk_merged (write)" }, { "id": "disk.sda2.disk_octets.read", "nodes": [], "title": "disk_octets (read)" }, { "id": "disk.sda2.disk_octets.write", "nodes": [], "title": "disk_octets (write)" }, { "id": "disk.sda2.disk_ops.read", "nodes": [], "title": "disk_ops (read)" }, { "id": "disk.sda2.disk_ops.write", "nodes": [], "title": "disk_ops (write)" }, { "id": "disk.sda2.disk_time.read", "nodes": [], "title": "disk_time (read)" }, { "id": "disk.sda2.disk_time.write", "nodes": [], "title": "disk_time (write)" } ], "title": "sda2" }, { "id": "disk.sda3", "nodes": [ { "id": "disk.sda3.disk_merged.read", "nodes": [], "title": "disk_merged (read)" }, { "id": "disk.sda3.disk_merged.write", "nodes": [], "title": "disk_merged (write)" }, { "id": "disk.sda3.disk_octets.read", "nodes": [], "title": "disk_octets (read)" }, { "id": "disk.sda3.disk_octets.write", "nodes": [], "title": "disk_octets (write)" }, { "id": "disk.sda3.disk_ops.read", "nodes": [], "title": "disk_ops (read)" }, { "id": "disk.sda3.disk_ops.write", "nodes": [], "title": "disk_ops (write)" }, { "id": "disk.sda3.disk_time.read", "nodes": [], "title": "disk_time (read)" }, { "id": "disk.sda3.disk_time.write", "nodes": [], "title": "disk_time (write)" } ], "title": "sda3" }, { "id": "disk.sdb", "nodes": [ { "id": "disk.sdb.disk_merged.read", "nodes": [], "title": "disk_merged (read)" }, { "id": "disk.sdb.disk_merged.write", "nodes": [], "title": "disk_merged (write)" }, { "id": "disk.sdb.disk_octets.read", "nodes": [], "title": "disk_octets (read)" }, { "id": "disk.sdb.disk_octets.write", "nodes": [], "title": "disk_octets (write)" }, { "id": "disk.sdb.disk_ops.read", "nodes": [], "title": "disk_ops (read)" }, { "id": "disk.sdb.disk_ops.write", "nodes": [], "title": "disk_ops (write)" }, { "id": "disk.sdb.disk_time.read", "nodes": [], "title": "disk_time (read)" }, { "id": "disk.sdb.disk_time.write", "nodes": [], "title": "disk_time (write)" } ], "title": "sdb" } ], "title": "disk" }, { "id": "interface", "nodes": [ { "id": "interface.br-ex", "nodes": [ { "id": "interface.br-ex.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.br-ex.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.br-ex.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.br-ex.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.br-ex.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.br-ex.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "br-ex" }, { "id": "interface.br-int", "nodes": [ { "id": "interface.br-int.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.br-int.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.br-int.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.br-int.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.br-int.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.br-int.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "br-int" }, { "id": "interface.br-tun", "nodes": [ { "id": "interface.br-tun.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.br-tun.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.br-tun.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.br-tun.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.br-tun.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.br-tun.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "br-tun" }, { "id": "interface.eth0", "nodes": [ { "id": "interface.eth0.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.eth0.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.eth0.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.eth0.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.eth0.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.eth0.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "eth0" }, { "id": "interface.eth1", "nodes": [ { "id": "interface.eth1.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.eth1.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.eth1.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.eth1.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.eth1.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.eth1.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "eth1" }, { "id": "interface.eth2", "nodes": [ { "id": "interface.eth2.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.eth2.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.eth2.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.eth2.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.eth2.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.eth2.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "eth2" }, { "id": "interface.lo", "nodes": [ { "id": "interface.lo.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.lo.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.lo.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.lo.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.lo.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.lo.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "lo" }, { "id": "interface.ovs-system", "nodes": [ { "id": "interface.ovs-system.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.ovs-system.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.ovs-system.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.ovs-system.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.ovs-system.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.ovs-system.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "ovs-system" }, { "id": "interface.virbr0-nic", "nodes": [ { "id": "interface.virbr0-nic.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.virbr0-nic.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.virbr0-nic.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.virbr0-nic.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.virbr0-nic.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.virbr0-nic.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "virbr0-nic" }, { "id": "interface.virbr0", "nodes": [ { "id": "interface.virbr0.if_errors.rx", "nodes": [], "title": "if_errors (rx)" }, { "id": "interface.virbr0.if_errors.tx", "nodes": [], "title": "if_errors (tx)" }, { "id": "interface.virbr0.if_octets.rx", "nodes": [], "title": "if_octets (rx)" }, { "id": "interface.virbr0.if_octets.tx", "nodes": [], "title": "if_octets (tx)" }, { "id": "interface.virbr0.if_packets.rx", "nodes": [], "title": "if_packets (rx)" }, { "id": "interface.virbr0.if_packets.tx", "nodes": [], "title": "if_packets (tx)" } ], "title": "virbr0" } ], "title": "interface" }, { "id": "kairosdb", "nodes": [ { "id": "kairosdb.datastore", "nodes": [ { "id": "kairosdb.datastore.cassandra", "nodes": [ { "id": "kairosdb.datastore.cassandra.key_query_time", "nodes": [], "title": "key_query_time" } ], "title": "cassandra" }, { "id": "kairosdb.datastore.query_collisions", "nodes": [], "title": "query_collisions" }, { "id": "kairosdb.datastore.query_row_count", "nodes": [], "title": "query_row_count" }, { "id": "kairosdb.datastore.query_sample_size", "nodes": [], "title": "query_sample_size" }, { "id": "kairosdb.datastore.query_time", "nodes": [], "title": "query_time" } ], "title": "datastore" }, { "id": "kairosdb.datastore.write_size", "nodes": [], "title": "datastore (write)_size" }, { "id": "kairosdb.http", "nodes": [ { "id": "kairosdb.http.query_time", "nodes": [], "title": "query_time" }, { "id": "kairosdb.http.request_time", "nodes": [], "title": "request_time" } ], "title": "http" }, { "id": "kairosdb.jvm.free_memory", "nodes": [], "title": "jvm (free)_memory" }, { "id": "kairosdb.jvm", "nodes": [ { "id": "kairosdb.jvm.max_memory", "nodes": [], "title": "max_memory" }, { "id": "kairosdb.jvm.thread_count", "nodes": [], "title": "thread_count" }, { "id": "kairosdb.jvm.total_memory", "nodes": [], "title": "total_memory" } ], "title": "jvm" }, { "id": "kairosdb.metric_counters", "nodes": [], "title": "metric_counters" }, { "id": "kairosdb.protocol", "nodes": [ { "id": "kairosdb.protocol.http_request_count", "nodes": [], "title": "http_request_count" }, { "id": "kairosdb.protocol.telnet_request_count", "nodes": [], "title": "telnet_request_count" } ], "title": "protocol" } ], "title": "kairosdb" }, { "id": "load", "nodes": [ { "id": "load.load", "nodes": [ { "id": "load.load.longterm", "nodes": [], "title": "longterm" }, { "id": "load.load.midterm", "nodes": [], "title": "midterm" }, { "id": "load.load.shortterm", "nodes": [], "title": "shortterm" } ], "title": "load" } ], "title": "load" }, { "id": "memory", "nodes": [ { "id": "memory.memory", "nodes": [ { "id": "memory.memory.buffered.value", "nodes": [], "title": "buffered (value)" }, { "id": "memory.memory.cached.value", "nodes": [], "title": "cached (value)" } ], "title": "memory" }, { "id": "memory.memory.free.value", "nodes": [], "title": "memory (free) (value)" }, { "id": "memory.memory.used.value", "nodes": [], "title": "memory (used) (value)" } ], "title": "memory" }, { "id": "processes", "nodes": [ { "id": "processes.cinder-api", "nodes": [ { "id": "processes.cinder-api.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.cinder-api.ps_count", "nodes": [ { "id": "processes.cinder-api.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.cinder-api.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.cinder-api.ps_cputime", "nodes": [ { "id": "processes.cinder-api.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.cinder-api.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.cinder-api.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.cinder-api.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.cinder-api.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.cinder-api.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.cinder-api.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.cinder-api.ps_pagefaults", "nodes": [ { "id": "processes.cinder-api.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.cinder-api.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.cinder-api.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.cinder-api.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.cinder-api.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "cinder-api" }, { "id": "processes.cinder-scheduler", "nodes": [ { "id": "processes.cinder-scheduler.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.cinder-scheduler.ps_count", "nodes": [ { "id": "processes.cinder-scheduler.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.cinder-scheduler.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.cinder-scheduler.ps_cputime", "nodes": [ { "id": "processes.cinder-scheduler.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.cinder-scheduler.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.cinder-scheduler.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.cinder-scheduler.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.cinder-scheduler.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.cinder-scheduler.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.cinder-scheduler.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.cinder-scheduler.ps_pagefaults", "nodes": [ { "id": "processes.cinder-scheduler.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.cinder-scheduler.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.cinder-scheduler.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.cinder-scheduler.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.cinder-scheduler.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "cinder-scheduler" }, { "id": "processes.cinder-volume", "nodes": [ { "id": "processes.cinder-volume.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.cinder-volume.ps_count", "nodes": [ { "id": "processes.cinder-volume.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.cinder-volume.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.cinder-volume.ps_cputime", "nodes": [ { "id": "processes.cinder-volume.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.cinder-volume.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.cinder-volume.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.cinder-volume.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.cinder-volume.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.cinder-volume.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.cinder-volume.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.cinder-volume.ps_pagefaults", "nodes": [ { "id": "processes.cinder-volume.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.cinder-volume.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.cinder-volume.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.cinder-volume.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.cinder-volume.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "cinder-volume" }, { "id": "processes.fork_rate.value", "nodes": [], "title": "fork_rate (value)" }, { "id": "processes.glance-api", "nodes": [ { "id": "processes.glance-api.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.glance-api.ps_count", "nodes": [ { "id": "processes.glance-api.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.glance-api.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.glance-api.ps_cputime", "nodes": [ { "id": "processes.glance-api.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.glance-api.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.glance-api.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.glance-api.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.glance-api.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.glance-api.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.glance-api.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.glance-api.ps_pagefaults", "nodes": [ { "id": "processes.glance-api.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.glance-api.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.glance-api.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.glance-api.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.glance-api.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "glance-api" }, { "id": "processes.glance-registry", "nodes": [ { "id": "processes.glance-registry.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.glance-registry.ps_count", "nodes": [ { "id": "processes.glance-registry.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.glance-registry.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.glance-registry.ps_cputime", "nodes": [ { "id": "processes.glance-registry.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.glance-registry.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.glance-registry.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.glance-registry.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.glance-registry.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.glance-registry.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.glance-registry.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.glance-registry.ps_pagefaults", "nodes": [ { "id": "processes.glance-registry.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.glance-registry.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.glance-registry.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.glance-registry.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.glance-registry.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "glance-registry" }, { "id": "processes.httpd", "nodes": [ { "id": "processes.httpd.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.httpd.ps_count", "nodes": [ { "id": "processes.httpd.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.httpd.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.httpd.ps_cputime", "nodes": [ { "id": "processes.httpd.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.httpd.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.httpd.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.httpd.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.httpd.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.httpd.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.httpd.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.httpd.ps_pagefaults", "nodes": [ { "id": "processes.httpd.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.httpd.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.httpd.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.httpd.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.httpd.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "httpd" }, { "id": "processes.iscsid", "nodes": [ { "id": "processes.iscsid.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.iscsid.ps_count", "nodes": [ { "id": "processes.iscsid.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.iscsid.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.iscsid.ps_cputime", "nodes": [ { "id": "processes.iscsid.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.iscsid.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.iscsid.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.iscsid.ps_pagefaults", "nodes": [ { "id": "processes.iscsid.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.iscsid.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.iscsid.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.iscsid.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.iscsid.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "iscsid" }, { "id": "processes.keystone", "nodes": [ { "id": "processes.keystone.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.keystone.ps_count", "nodes": [ { "id": "processes.keystone.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.keystone.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.keystone.ps_cputime", "nodes": [ { "id": "processes.keystone.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.keystone.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.keystone.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.keystone.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.keystone.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.keystone.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.keystone.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.keystone.ps_pagefaults", "nodes": [ { "id": "processes.keystone.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.keystone.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.keystone.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.keystone.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.keystone.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "keystone" }, { "id": "processes.multipathd", "nodes": [ { "id": "processes.multipathd.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.multipathd.ps_count", "nodes": [ { "id": "processes.multipathd.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.multipathd.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.multipathd.ps_cputime", "nodes": [ { "id": "processes.multipathd.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.multipathd.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.multipathd.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.multipathd.ps_pagefaults", "nodes": [ { "id": "processes.multipathd.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.multipathd.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.multipathd.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.multipathd.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.multipathd.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "multipathd" }, { "id": "processes.mysqld", "nodes": [ { "id": "processes.mysqld.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.mysqld.ps_count", "nodes": [ { "id": "processes.mysqld.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.mysqld.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.mysqld.ps_cputime", "nodes": [ { "id": "processes.mysqld.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.mysqld.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.mysqld.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.mysqld.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.mysqld.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.mysqld.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.mysqld.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.mysqld.ps_pagefaults", "nodes": [ { "id": "processes.mysqld.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.mysqld.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.mysqld.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.mysqld.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.mysqld.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "mysqld" }, { "id": "processes.neutron-server", "nodes": [ { "id": "processes.neutron-server.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.neutron-server.ps_count", "nodes": [ { "id": "processes.neutron-server.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.neutron-server.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.neutron-server.ps_cputime", "nodes": [ { "id": "processes.neutron-server.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.neutron-server.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.neutron-server.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.neutron-server.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.neutron-server.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.neutron-server.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.neutron-server.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.neutron-server.ps_pagefaults", "nodes": [ { "id": "processes.neutron-server.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.neutron-server.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.neutron-server.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.neutron-server.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.neutron-server.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "neutron-server" }, { "id": "processes.nova-api", "nodes": [ { "id": "processes.nova-api.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-api.ps_count", "nodes": [ { "id": "processes.nova-api.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-api.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-api.ps_cputime", "nodes": [ { "id": "processes.nova-api.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-api.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-api.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-api.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-api.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-api.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-api.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-api.ps_pagefaults", "nodes": [ { "id": "processes.nova-api.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-api.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-api.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-api.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-api.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-api" }, { "id": "processes.nova-cert", "nodes": [ { "id": "processes.nova-cert.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-cert.ps_count", "nodes": [ { "id": "processes.nova-cert.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-cert.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-cert.ps_cputime", "nodes": [ { "id": "processes.nova-cert.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-cert.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-cert.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-cert.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-cert.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-cert.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-cert.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-cert.ps_pagefaults", "nodes": [ { "id": "processes.nova-cert.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-cert.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-cert.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-cert.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-cert.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-cert" }, { "id": "processes.nova-compute", "nodes": [ { "id": "processes.nova-compute.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-compute.ps_count", "nodes": [ { "id": "processes.nova-compute.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-compute.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-compute.ps_cputime", "nodes": [ { "id": "processes.nova-compute.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-compute.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-compute.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-compute.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-compute.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-compute.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-compute.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-compute.ps_pagefaults", "nodes": [ { "id": "processes.nova-compute.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-compute.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-compute.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-compute.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-compute.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-compute" }, { "id": "processes.nova-conductor", "nodes": [ { "id": "processes.nova-conductor.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-conductor.ps_count", "nodes": [ { "id": "processes.nova-conductor.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-conductor.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-conductor.ps_cputime", "nodes": [ { "id": "processes.nova-conductor.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-conductor.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-conductor.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-conductor.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-conductor.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-conductor.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-conductor.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-conductor.ps_pagefaults", "nodes": [ { "id": "processes.nova-conductor.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-conductor.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-conductor.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-conductor.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-conductor.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-conductor" }, { "id": "processes.nova-metadata-api", "nodes": [ { "id": "processes.nova-metadata-api.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-metadata-api.ps_count", "nodes": [ { "id": "processes.nova-metadata-api.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-metadata-api.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-metadata-api.ps_cputime", "nodes": [ { "id": "processes.nova-metadata-api.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-metadata-api.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-metadata-api.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-metadata-api.ps_pagefaults", "nodes": [ { "id": "processes.nova-metadata-api.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-metadata-api.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-metadata-api.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-metadata-api.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-metadata-api.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-metadata-api" }, { "id": "processes.nova-novncproxy", "nodes": [ { "id": "processes.nova-novncproxy.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-novncproxy.ps_count", "nodes": [ { "id": "processes.nova-novncproxy.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-novncproxy.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-novncproxy.ps_cputime", "nodes": [ { "id": "processes.nova-novncproxy.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-novncproxy.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-novncproxy.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-novncproxy.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-novncproxy.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-novncproxy.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-novncproxy.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-novncproxy.ps_pagefaults", "nodes": [ { "id": "processes.nova-novncproxy.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-novncproxy.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-novncproxy.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-novncproxy.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-novncproxy.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-novncproxy" }, { "id": "processes.nova-scheduler", "nodes": [ { "id": "processes.nova-scheduler.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-scheduler.ps_count", "nodes": [ { "id": "processes.nova-scheduler.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-scheduler.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-scheduler.ps_cputime", "nodes": [ { "id": "processes.nova-scheduler.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-scheduler.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-scheduler.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-scheduler.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.nova-scheduler.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.nova-scheduler.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.nova-scheduler.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.nova-scheduler.ps_pagefaults", "nodes": [ { "id": "processes.nova-scheduler.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-scheduler.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-scheduler.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-scheduler.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-scheduler.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-scheduler" }, { "id": "processes.nova-xvpvncproxy", "nodes": [ { "id": "processes.nova-xvpvncproxy.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.nova-xvpvncproxy.ps_count", "nodes": [ { "id": "processes.nova-xvpvncproxy.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.nova-xvpvncproxy.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.nova-xvpvncproxy.ps_cputime", "nodes": [ { "id": "processes.nova-xvpvncproxy.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.nova-xvpvncproxy.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.nova-xvpvncproxy.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.nova-xvpvncproxy.ps_pagefaults", "nodes": [ { "id": "processes.nova-xvpvncproxy.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.nova-xvpvncproxy.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.nova-xvpvncproxy.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.nova-xvpvncproxy.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.nova-xvpvncproxy.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "nova-xvpvncproxy" }, { "id": "processes.ps_state", "nodes": [ { "id": "processes.ps_state.blocked.value", "nodes": [], "title": "blocked (value)" }, { "id": "processes.ps_state.paging.value", "nodes": [], "title": "paging (value)" }, { "id": "processes.ps_state.running.value", "nodes": [], "title": "running (value)" }, { "id": "processes.ps_state.sleeping.value", "nodes": [], "title": "sleeping (value)" }, { "id": "processes.ps_state.stopped.value", "nodes": [], "title": "stopped (value)" }, { "id": "processes.ps_state.zombies.value", "nodes": [], "title": "zombies (value)" } ], "title": "ps_state" }, { "id": "processes.rabbitmq-server", "nodes": [ { "id": "processes.rabbitmq-server.ps_code.value", "nodes": [], "title": "ps_code (value)" }, { "id": "processes.rabbitmq-server.ps_count", "nodes": [ { "id": "processes.rabbitmq-server.ps_count.processes", "nodes": [], "title": "processes" }, { "id": "processes.rabbitmq-server.ps_count.threads", "nodes": [], "title": "threads" } ], "title": "ps_count" }, { "id": "processes.rabbitmq-server.ps_cputime", "nodes": [ { "id": "processes.rabbitmq-server.ps_cputime.syst", "nodes": [], "title": "syst" }, { "id": "processes.rabbitmq-server.ps_cputime.user", "nodes": [], "title": "user" } ], "title": "ps_cputime" }, { "id": "processes.rabbitmq-server.ps_data.value", "nodes": [], "title": "ps_data (value)" }, { "id": "processes.rabbitmq-server.ps_disk_octets.read", "nodes": [], "title": "ps_disk_octets (read)" }, { "id": "processes.rabbitmq-server.ps_disk_octets.write", "nodes": [], "title": "ps_disk_octets (write)" }, { "id": "processes.rabbitmq-server.ps_disk_ops.read", "nodes": [], "title": "ps_disk_ops (read)" }, { "id": "processes.rabbitmq-server.ps_disk_ops.write", "nodes": [], "title": "ps_disk_ops (write)" }, { "id": "processes.rabbitmq-server.ps_pagefaults", "nodes": [ { "id": "processes.rabbitmq-server.ps_pagefaults.majflt", "nodes": [], "title": "majflt" }, { "id": "processes.rabbitmq-server.ps_pagefaults.minflt", "nodes": [], "title": "minflt" } ], "title": "ps_pagefaults" }, { "id": "processes.rabbitmq-server.ps_rss.value", "nodes": [], "title": "ps_rss (value)" }, { "id": "processes.rabbitmq-server.ps_stacksize.value", "nodes": [], "title": "ps_stacksize (value)" }, { "id": "processes.rabbitmq-server.ps_vm.value", "nodes": [], "title": "ps_vm (value)" } ], "title": "rabbitmq-server" } ], "title": "processes" }, { "id": "rabbitmq_info", "nodes": [ { "id": "rabbitmq_info.gauge", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers.value", "nodes": [], "title": "ctl_consumers (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cert.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_consumers_cert" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert.value", "nodes": [], "title": "ctl_consumers_cert (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cert.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_cert" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "nodes": [], "title": "ctl_consumers_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cert_fanout_c5663842094a4d35ac07f7f97486fe90.value", "nodes": [], "title": "ctl_consumers_cert_fanout_c5663842094a4d35ac07f7f97486fe90 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_consumers_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.value", "nodes": [], "title": "ctl_consumers_cinder-scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_25598b80dd744af6b731a8240.value", "nodes": [], "title": "ctl_consumers_cinder-scheduler_fanout_25598b80dd744af6b731a8240 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc.value", "nodes": [], "title": "ctl_consumers_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_f960594b74114a16b622656ef.value", "nodes": [], "title": "ctl_consumers_cinder-scheduler_fanout_f960594b74114a16b622656ef (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_consumers_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume.value", "nodes": [], "title": "ctl_consumers_cinder-volume (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_47bd60c6669041d486d36c2171ab.value", "nodes": [], "title": "ctl_consumers_cinder-volume_fanout_47bd60c6669041d486d36c2171ab (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8.value", "nodes": [], "title": "ctl_consumers_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e.value", "nodes": [], "title": "ctl_consumers_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218.value", "nodes": [], "title": "ctl_consumers_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169.value", "nodes": [], "title": "ctl_consumers_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_compute.host-1.value", "nodes": [], "title": "host-1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_consumers_compute" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.value", "nodes": [], "title": "ctl_consumers_compute (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute1.value", "nodes": [], "title": "ws-compute1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute2.value", "nodes": [], "title": "ws-compute2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute3.value", "nodes": [], "title": "ws-compute3 (value)" } ], "title": "ctl_consumers_compute" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "nodes": [], "title": "ctl_consumers_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "nodes": [], "title": "ctl_consumers_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "nodes": [], "title": "ctl_consumers_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "nodes": [], "title": "ctl_consumers_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "nodes": [], "title": "ctl_consumers_compute_fanout_abbbda28849245fabbedbbb78dfe7752 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "nodes": [], "title": "ctl_consumers_compute_fanout_b4d3efb471db49a589fe686ff47f323a (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "nodes": [], "title": "ctl_consumers_compute_fanout_d23202346a2d4efa8f20186c98b80940 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "nodes": [], "title": "ctl_consumers_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "nodes": [], "title": "ctl_consumers_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_conductor.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_consumers_conductor" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor.value", "nodes": [], "title": "ctl_consumers_conductor (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_conductor.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_conductor" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor_fanout_045a656556544fa4819265a995b14446.value", "nodes": [], "title": "ctl_consumers_conductor_fanout_045a656556544fa4819265a995b14446 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc.value", "nodes": [], "title": "ctl_consumers_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_consumers_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth.value", "nodes": [], "title": "ctl_consumers_consoleauth (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f0.value", "nodes": [], "title": "ctl_consumers_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_consoleauth_fanout_8cb998aa509349a59c8ae6c9347274.value", "nodes": [], "title": "ctl_consumers_consoleauth_fanout_8cb998aa509349a59c8ae6c9347274 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_consumers_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.value", "nodes": [], "title": "ctl_consumers_dhcp_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_consumers_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70.value", "nodes": [], "title": "ctl_consumers_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae02.value", "nodes": [], "title": "ctl_consumers_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae02 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff53.value", "nodes": [], "title": "ctl_consumers_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff53 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_consumers_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent.value", "nodes": [], "title": "ctl_consumers_l3_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_consumers_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "nodes": [], "title": "ctl_consumers_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "nodes": [], "title": "ctl_consumers_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13.value", "nodes": [], "title": "ctl_consumers_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_1099820356.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_1099820356 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_298d8ca930.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_298d8ca930 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_319bf4990a.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_319bf4990a (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_32cbb9c70f.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_32cbb9c70f (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_497c56b5b2.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_497c56b5b2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_5c4993382c.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_5c4993382c (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_773107e524.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_773107e524 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8d60d9e535.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_8d60d9e535 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8e950d973a.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_8e950d973a (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8f89d1af83.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_8f89d1af83 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_944e056c7b.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_944e056c7b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_971ca1bfd4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_971ca1bfd4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_a331429314.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_a331429314 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_b27f55ae22.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_b27f55ae22 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_c2eb1d1c63.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_c2eb1d1c63 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_c5afb6c6a9.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-network-delete_fanout_c5afb6c6a9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_107df82b88f74.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_107df82b88f74 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_25c7a322b65a4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_25c7a322b65a4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_4b696dd45a114.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_4b696dd45a114 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_6447fc7d76a74.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_6447fc7d76a74 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_6728c5fbdc144.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_6728c5fbdc144 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_724841285ffb4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_724841285ffb4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_73159f64b8f64.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_73159f64b8f64 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_7367227aef334.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_7367227aef334 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_7789b52e55824.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_7789b52e55824 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_81c2beb48fc74.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_81c2beb48fc74 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_843b6fe28fb34.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_843b6fe28fb34 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_8c8f3152f5404.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_8c8f3152f5404 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_a57269bc8c814.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_a57269bc8c814 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_c47fbaab748e4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_c47fbaab748e4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_d02223799f7a4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_d02223799f7a4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_e4f310417e5f4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-port-update_fanout_e4f310417e5f4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_09b.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_09b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_0b0.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_0b0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_144.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_144 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_262.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_262 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_2c6.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_2c6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_5d7.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_5d7 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_600.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_600 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_796.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_796 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_9ae.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_9ae (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_a0b.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_a0b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b2c.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_b2c (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b89.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_b89 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b93.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_b93 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_c66.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_c66 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_cd3.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_cd3 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_ce8.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-security_group-update_fanout_ce8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_24a2e9202ff.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_24a2e9202ff (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_31093f6257a.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_31093f6257a (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_6454a664b63.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_6454a664b63 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_790bd8e6598.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_790bd8e6598 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_7e95fe20c28.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_7e95fe20c28 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_80652ce2591.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_80652ce2591 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_87b919cf30a.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_87b919cf30a (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_916ba692a7b.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_916ba692a7b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_99eeb1266b4.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_99eeb1266b4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_ab6c0f38074.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_ab6c0f38074 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_c00ff563bbf.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_c00ff563bbf (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_f0827b82b80.value", "nodes": [], "title": "ctl_consumers_q-agent-notifier-tunnel-update_fanout_f0827b82b80 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-l3-plugin.value", "nodes": [], "title": "ctl_consumers_q-l3-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_q-plugin.value", "nodes": [], "title": "ctl_consumers_q-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_059bfb29183f4cd384437af5fd8d5638.value", "nodes": [], "title": "ctl_consumers_reply_059bfb29183f4cd384437af5fd8d5638 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_068ff2e55101436abcbdb73ba9539518.value", "nodes": [], "title": "ctl_consumers_reply_068ff2e55101436abcbdb73ba9539518 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_11781d964fb147329c231cd769d844a3.value", "nodes": [], "title": "ctl_consumers_reply_11781d964fb147329c231cd769d844a3 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_163e426282104825a5bd9f78de96fa6e.value", "nodes": [], "title": "ctl_consumers_reply_163e426282104825a5bd9f78de96fa6e (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_2adac7387f6f434684d4ae53615ddee6.value", "nodes": [], "title": "ctl_consumers_reply_2adac7387f6f434684d4ae53615ddee6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "nodes": [], "title": "ctl_consumers_reply_2c6a2671a10c4eccb06a289f2527cdc6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_342f32a38d65447199f512dbf1e58d36.value", "nodes": [], "title": "ctl_consumers_reply_342f32a38d65447199f512dbf1e58d36 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_34a6080dab0344ab9683c2054e87c602.value", "nodes": [], "title": "ctl_consumers_reply_34a6080dab0344ab9683c2054e87c602 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "nodes": [], "title": "ctl_consumers_reply_439f0b94dc5f4a6caf38eee72b36b25b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "nodes": [], "title": "ctl_consumers_reply_49d3df8aee1f491d9fa3818e3fa02956 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "nodes": [], "title": "ctl_consumers_reply_4ac92fc3c8024161ad79e0c2dc5aec14 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "nodes": [], "title": "ctl_consumers_reply_4b84d273ba5047acbd9f5edd8f4b9570 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "nodes": [], "title": "ctl_consumers_reply_4f96552f1f07422c8c5d9fe3f81db14d (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_5229cd963f03412587f212a5cce586da.value", "nodes": [], "title": "ctl_consumers_reply_5229cd963f03412587f212a5cce586da (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "nodes": [], "title": "ctl_consumers_reply_5b999f57c15e4a61b9db28fe5e16d689 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_65068a2b97034f01afb9977a102f4216.value", "nodes": [], "title": "ctl_consumers_reply_65068a2b97034f01afb9977a102f4216 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_771a9b1bfc674a698e6ff56242561f83.value", "nodes": [], "title": "ctl_consumers_reply_771a9b1bfc674a698e6ff56242561f83 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_7762f1c557f1497a93c50042ec6f6edb.value", "nodes": [], "title": "ctl_consumers_reply_7762f1c557f1497a93c50042ec6f6edb (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_7f0080ecb6b741c1ae6728a953896c10.value", "nodes": [], "title": "ctl_consumers_reply_7f0080ecb6b741c1ae6728a953896c10 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "nodes": [], "title": "ctl_consumers_reply_84a19f4db62a4ce098f15e2db5dc0f02 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_91e0309c76c34c3198f9a0716621750d.value", "nodes": [], "title": "ctl_consumers_reply_91e0309c76c34c3198f9a0716621750d (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_973be4200d754146807f90d33fc311df.value", "nodes": [], "title": "ctl_consumers_reply_973be4200d754146807f90d33fc311df (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "nodes": [], "title": "ctl_consumers_reply_9aa8cb42adbf43ed83dcf5ce049c4742 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "nodes": [], "title": "ctl_consumers_reply_abce43e4d9b441f999d5cca4e9cdbfa4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_b6aff102b26c48efbf99328a2c7c0884.value", "nodes": [], "title": "ctl_consumers_reply_b6aff102b26c48efbf99328a2c7c0884 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "nodes": [], "title": "ctl_consumers_reply_cfd2a9bfb7f144cfbdece5631a920fb8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_d8013e8161a44966be5b78ea36ea5168.value", "nodes": [], "title": "ctl_consumers_reply_d8013e8161a44966be5b78ea36ea5168 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_ea46f963d0a24754b609ad1476c2c18f.value", "nodes": [], "title": "ctl_consumers_reply_ea46f963d0a24754b609ad1476c2c18f (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_eb623d0615fb40178ff37b21bd86dd03.value", "nodes": [], "title": "ctl_consumers_reply_eb623d0615fb40178ff37b21bd86dd03 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_f0dbf1a492094fea85d1ec974efd3472.value", "nodes": [], "title": "ctl_consumers_reply_f0dbf1a492094fea85d1ec974efd3472 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_f5f9dccda65b4e3788346807f546f32c.value", "nodes": [], "title": "ctl_consumers_reply_f5f9dccda65b4e3788346807f546f32c (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_f89e0feabf714cad810af29e6f34870b.value", "nodes": [], "title": "ctl_consumers_reply_f89e0feabf714cad810af29e6f34870b (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "nodes": [], "title": "ctl_consumers_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "nodes": [], "title": "ctl_consumers_reply_fed9064a054e4d64ba4f0b59932a3ec5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_consumers_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler.value", "nodes": [], "title": "ctl_consumers_scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_consumers_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6.value", "nodes": [], "title": "ctl_consumers_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_consumers_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "nodes": [], "title": "ctl_consumers_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory.value", "nodes": [], "title": "ctl_memory (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cert.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_memory_cert" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert.value", "nodes": [], "title": "ctl_memory_cert (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cert.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_cert" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "nodes": [], "title": "ctl_memory_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cert_fanout_c5663842094a4d35ac07f7f97486fe90.value", "nodes": [], "title": "ctl_memory_cert_fanout_c5663842094a4d35ac07f7f97486fe90 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_memory_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.value", "nodes": [], "title": "ctl_memory_cinder-scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_25598b80dd744af6b731a824005f.value", "nodes": [], "title": "ctl_memory_cinder-scheduler_fanout_25598b80dd744af6b731a824005f (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc12c.value", "nodes": [], "title": "ctl_memory_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc12c (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_f960594b74114a16b622656ef436.value", "nodes": [], "title": "ctl_memory_cinder-scheduler_fanout_f960594b74114a16b622656ef436 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_memory_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume.value", "nodes": [], "title": "ctl_memory_cinder-volume (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_47bd60c6669041d486d36c2171abb2e.value", "nodes": [], "title": "ctl_memory_cinder-volume_fanout_47bd60c6669041d486d36c2171abb2e (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8230.value", "nodes": [], "title": "ctl_memory_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8230 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e235.value", "nodes": [], "title": "ctl_memory_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e235 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218df5.value", "nodes": [], "title": "ctl_memory_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218df5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169ca7.value", "nodes": [], "title": "ctl_memory_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169ca7 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_compute.host-1.value", "nodes": [], "title": "host-1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_memory_compute" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.value", "nodes": [], "title": "ctl_memory_compute (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_compute.ws-compute1.value", "nodes": [], "title": "ws-compute1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.ws-compute2.value", "nodes": [], "title": "ws-compute2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute.ws-compute3.value", "nodes": [], "title": "ws-compute3 (value)" } ], "title": "ctl_memory_compute" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "nodes": [], "title": "ctl_memory_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "nodes": [], "title": "ctl_memory_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "nodes": [], "title": "ctl_memory_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "nodes": [], "title": "ctl_memory_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "nodes": [], "title": "ctl_memory_compute_fanout_abbbda28849245fabbedbbb78dfe7752 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "nodes": [], "title": "ctl_memory_compute_fanout_b4d3efb471db49a589fe686ff47f323a (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "nodes": [], "title": "ctl_memory_compute_fanout_d23202346a2d4efa8f20186c98b80940 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "nodes": [], "title": "ctl_memory_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "nodes": [], "title": "ctl_memory_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_conductor.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_memory_conductor" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor.value", "nodes": [], "title": "ctl_memory_conductor (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_conductor.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_conductor" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor_fanout_045a656556544fa4819265a995b14446.value", "nodes": [], "title": "ctl_memory_conductor_fanout_045a656556544fa4819265a995b14446 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc.value", "nodes": [], "title": "ctl_memory_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_memory_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth.value", "nodes": [], "title": "ctl_memory_consoleauth (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f071.value", "nodes": [], "title": "ctl_memory_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f071 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_consoleauth_fanout_8cb998aa509349a59c8ae6c93472749a.value", "nodes": [], "title": "ctl_memory_consoleauth_fanout_8cb998aa509349a59c8ae6c93472749a (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_memory_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent.value", "nodes": [], "title": "ctl_memory_dhcp_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_memory_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f.value", "nodes": [], "title": "ctl_memory_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022.value", "nodes": [], "title": "ctl_memory_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff532.value", "nodes": [], "title": "ctl_memory_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff532 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_memory_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent.value", "nodes": [], "title": "ctl_memory_l3_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_memory_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "nodes": [], "title": "ctl_memory_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "nodes": [], "title": "ctl_memory_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13.value", "nodes": [], "title": "ctl_memory_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_1099820356be4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_1099820356be4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_298d8ca930ce4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_298d8ca930ce4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_319bf4990ade4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_319bf4990ade4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_32cbb9c70f7c4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_32cbb9c70f7c4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_497c56b5b2a84.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_497c56b5b2a84 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_5c4993382ccd4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_5c4993382ccd4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_773107e524354.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_773107e524354 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8d60d9e535424.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_8d60d9e535424 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8e950d973a4d4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_8e950d973a4d4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8f89d1af83344.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_8f89d1af83344 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_944e056c7b804.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_944e056c7b804 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_971ca1bfd4894.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_971ca1bfd4894 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_a3314293140a4.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_a3314293140a4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_b27f55ae22d34.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_b27f55ae22d34 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_c2eb1d1c63304.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_c2eb1d1c63304 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_c5afb6c6a9554.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-network-delete_fanout_c5afb6c6a9554 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_107df82b88f74616.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_107df82b88f74616 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_25c7a322b65a4d33.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_25c7a322b65a4d33 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_4b696dd45a1149a0.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_4b696dd45a1149a0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_6447fc7d76a741d9.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_6447fc7d76a741d9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_6728c5fbdc144cb0.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_6728c5fbdc144cb0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_724841285ffb49c9.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_724841285ffb49c9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_73159f64b8f64378.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_73159f64b8f64378 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_7367227aef33469d.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_7367227aef33469d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_7789b52e55824548.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_7789b52e55824548 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_81c2beb48fc74f40.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_81c2beb48fc74f40 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_843b6fe28fb34cd2.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_843b6fe28fb34cd2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_8c8f3152f540416f.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_8c8f3152f540416f (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_a57269bc8c814805.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_a57269bc8c814805 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_c47fbaab748e4f9a.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_c47fbaab748e4f9a (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_d02223799f7a4046.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_d02223799f7a4046 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_e4f310417e5f4807.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-port-update_fanout_e4f310417e5f4807 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_09ba06.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_09ba06 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_0b0574.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_0b0574 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_144ca1.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_144ca1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_262eb2.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_262eb2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_2c61fd.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_2c61fd (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_5d7664.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_5d7664 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_6007b7.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_6007b7 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_796ab1.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_796ab1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_9ae67c.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_9ae67c (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_a0b554.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_a0b554 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b2c991.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_b2c991 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b89922.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_b89922 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b938cc.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_b938cc (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_c662b6.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_c662b6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_cd3bbf.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_cd3bbf (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_ce8424.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-security_group-update_fanout_ce8424 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_24a2e9202ff641.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_24a2e9202ff641 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a4a.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a4a (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_31093f6257a143.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_31093f6257a143 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f47.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f47 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_6454a664b63c43.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_6454a664b63c43 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_790bd8e6598e49.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_790bd8e6598e49 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_7e95fe20c28744.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_7e95fe20c28744 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_80652ce2591a4d.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_80652ce2591a4d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_87b919cf30a74f.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_87b919cf30a74f (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_916ba692a7b94e.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_916ba692a7b94e (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b45.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b45 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f49.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f49 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b14b.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b14b (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_c00ff563bbf446.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_c00ff563bbf446 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c144.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c144 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_f0827b82b80040.value", "nodes": [], "title": "ctl_memory_q-agent-notifier-tunnel-update_fanout_f0827b82b80040 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-l3-plugin.value", "nodes": [], "title": "ctl_memory_q-l3-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_q-plugin.value", "nodes": [], "title": "ctl_memory_q-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_059bfb29183f4cd384437af5fd8d5638.value", "nodes": [], "title": "ctl_memory_reply_059bfb29183f4cd384437af5fd8d5638 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_068ff2e55101436abcbdb73ba9539518.value", "nodes": [], "title": "ctl_memory_reply_068ff2e55101436abcbdb73ba9539518 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_11781d964fb147329c231cd769d844a3.value", "nodes": [], "title": "ctl_memory_reply_11781d964fb147329c231cd769d844a3 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_163e426282104825a5bd9f78de96fa6e.value", "nodes": [], "title": "ctl_memory_reply_163e426282104825a5bd9f78de96fa6e (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_2adac7387f6f434684d4ae53615ddee6.value", "nodes": [], "title": "ctl_memory_reply_2adac7387f6f434684d4ae53615ddee6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "nodes": [], "title": "ctl_memory_reply_2c6a2671a10c4eccb06a289f2527cdc6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_342f32a38d65447199f512dbf1e58d36.value", "nodes": [], "title": "ctl_memory_reply_342f32a38d65447199f512dbf1e58d36 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_34a6080dab0344ab9683c2054e87c602.value", "nodes": [], "title": "ctl_memory_reply_34a6080dab0344ab9683c2054e87c602 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "nodes": [], "title": "ctl_memory_reply_439f0b94dc5f4a6caf38eee72b36b25b (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "nodes": [], "title": "ctl_memory_reply_49d3df8aee1f491d9fa3818e3fa02956 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "nodes": [], "title": "ctl_memory_reply_4ac92fc3c8024161ad79e0c2dc5aec14 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "nodes": [], "title": "ctl_memory_reply_4b84d273ba5047acbd9f5edd8f4b9570 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "nodes": [], "title": "ctl_memory_reply_4f96552f1f07422c8c5d9fe3f81db14d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_5229cd963f03412587f212a5cce586da.value", "nodes": [], "title": "ctl_memory_reply_5229cd963f03412587f212a5cce586da (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "nodes": [], "title": "ctl_memory_reply_5b999f57c15e4a61b9db28fe5e16d689 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_65068a2b97034f01afb9977a102f4216.value", "nodes": [], "title": "ctl_memory_reply_65068a2b97034f01afb9977a102f4216 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_771a9b1bfc674a698e6ff56242561f83.value", "nodes": [], "title": "ctl_memory_reply_771a9b1bfc674a698e6ff56242561f83 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_7762f1c557f1497a93c50042ec6f6edb.value", "nodes": [], "title": "ctl_memory_reply_7762f1c557f1497a93c50042ec6f6edb (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_7f0080ecb6b741c1ae6728a953896c10.value", "nodes": [], "title": "ctl_memory_reply_7f0080ecb6b741c1ae6728a953896c10 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "nodes": [], "title": "ctl_memory_reply_84a19f4db62a4ce098f15e2db5dc0f02 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_91e0309c76c34c3198f9a0716621750d.value", "nodes": [], "title": "ctl_memory_reply_91e0309c76c34c3198f9a0716621750d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_973be4200d754146807f90d33fc311df.value", "nodes": [], "title": "ctl_memory_reply_973be4200d754146807f90d33fc311df (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "nodes": [], "title": "ctl_memory_reply_9aa8cb42adbf43ed83dcf5ce049c4742 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "nodes": [], "title": "ctl_memory_reply_abce43e4d9b441f999d5cca4e9cdbfa4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_b6aff102b26c48efbf99328a2c7c0884.value", "nodes": [], "title": "ctl_memory_reply_b6aff102b26c48efbf99328a2c7c0884 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "nodes": [], "title": "ctl_memory_reply_cfd2a9bfb7f144cfbdece5631a920fb8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_d8013e8161a44966be5b78ea36ea5168.value", "nodes": [], "title": "ctl_memory_reply_d8013e8161a44966be5b78ea36ea5168 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_ea46f963d0a24754b609ad1476c2c18f.value", "nodes": [], "title": "ctl_memory_reply_ea46f963d0a24754b609ad1476c2c18f (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_eb623d0615fb40178ff37b21bd86dd03.value", "nodes": [], "title": "ctl_memory_reply_eb623d0615fb40178ff37b21bd86dd03 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_f0dbf1a492094fea85d1ec974efd3472.value", "nodes": [], "title": "ctl_memory_reply_f0dbf1a492094fea85d1ec974efd3472 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_f5f9dccda65b4e3788346807f546f32c.value", "nodes": [], "title": "ctl_memory_reply_f5f9dccda65b4e3788346807f546f32c (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_f89e0feabf714cad810af29e6f34870b.value", "nodes": [], "title": "ctl_memory_reply_f89e0feabf714cad810af29e6f34870b (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "nodes": [], "title": "ctl_memory_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "nodes": [], "title": "ctl_memory_reply_fed9064a054e4d64ba4f0b59932a3ec5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_memory_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler.value", "nodes": [], "title": "ctl_memory_scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_memory_scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_memory_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6.value", "nodes": [], "title": "ctl_memory_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_memory_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "nodes": [], "title": "ctl_memory_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages.value", "nodes": [], "title": "ctl_messages (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cert.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_messages_cert" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert.value", "nodes": [], "title": "ctl_messages_cert (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cert.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_cert" }, { "id": "rabbitmq_info.gauge.ctl_messages_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "nodes": [], "title": "ctl_messages_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_messages_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.value", "nodes": [], "title": "ctl_messages_cinder-scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_cinder-scheduler" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_25598b80dd744af6b731a82400.value", "nodes": [], "title": "ctl_messages_cinder-scheduler_fanout_25598b80dd744af6b731a82400 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc1.value", "nodes": [], "title": "ctl_messages_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_f960594b74114a16b622656ef4.value", "nodes": [], "title": "ctl_messages_cinder-scheduler_fanout_f960594b74114a16b622656ef4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_messages_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume.value", "nodes": [], "title": "ctl_messages_cinder-volume (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_cinder-volume" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_47bd60c6669041d486d36c2171abb.value", "nodes": [], "title": "ctl_messages_cinder-volume_fanout_47bd60c6669041d486d36c2171abb (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c82.value", "nodes": [], "title": "ctl_messages_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c82 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e2.value", "nodes": [], "title": "ctl_messages_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218d.value", "nodes": [], "title": "ctl_messages_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169c.value", "nodes": [], "title": "ctl_messages_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_compute.host-1.value", "nodes": [], "title": "host-1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.host-2.value", "nodes": [], "title": "host-2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.host-5.value", "nodes": [], "title": "host-5 (value)" } ], "title": "ctl_messages_compute" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.value", "nodes": [], "title": "ctl_messages_compute (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_compute.ws-compute1.value", "nodes": [], "title": "ws-compute1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.ws-compute2.value", "nodes": [], "title": "ws-compute2 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute.ws-compute3.value", "nodes": [], "title": "ws-compute3 (value)" } ], "title": "ctl_messages_compute" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "nodes": [], "title": "ctl_messages_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "nodes": [], "title": "ctl_messages_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "nodes": [], "title": "ctl_messages_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "nodes": [], "title": "ctl_messages_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "nodes": [], "title": "ctl_messages_compute_fanout_abbbda28849245fabbedbbb78dfe7752 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "nodes": [], "title": "ctl_messages_compute_fanout_b4d3efb471db49a589fe686ff47f323a (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "nodes": [], "title": "ctl_messages_compute_fanout_d23202346a2d4efa8f20186c98b80940 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "nodes": [], "title": "ctl_messages_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "nodes": [], "title": "ctl_messages_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_conductor.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_messages_conductor" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor.value", "nodes": [], "title": "ctl_messages_conductor (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_conductor.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_conductor" }, { "id": "rabbitmq_info.gauge.ctl_messages_conductor_fanout_045a656556544fa4819265a995b14446.value", "nodes": [], "title": "ctl_messages_conductor_fanout_045a656556544fa4819265a995b14446 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_messages_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth.value", "nodes": [], "title": "ctl_messages_consoleauth (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_consoleauth" }, { "id": "rabbitmq_info.gauge.ctl_messages_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f07.value", "nodes": [], "title": "ctl_messages_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f07 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_messages_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent.value", "nodes": [], "title": "ctl_messages_dhcp_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_messages_dhcp_agent" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f.value", "nodes": [], "title": "ctl_messages_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022.value", "nodes": [], "title": "ctl_messages_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent.network-node.value", "nodes": [], "title": "network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent.test-network-node.value", "nodes": [], "title": "test-network-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent.test-network.value", "nodes": [], "title": "test-network (value)" } ], "title": "ctl_messages_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent.value", "nodes": [], "title": "ctl_messages_l3_agent (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent.ws-network1.value", "nodes": [], "title": "ws-network1 (value)" } ], "title": "ctl_messages_l3_agent" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "nodes": [], "title": "ctl_messages_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "nodes": [], "title": "ctl_messages_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_1099820356b.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_1099820356b (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_298d8ca930c.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_298d8ca930c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_319bf4990ad.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_319bf4990ad (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_32cbb9c70f7.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_32cbb9c70f7 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_497c56b5b2a.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_497c56b5b2a (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_5c4993382cc.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_5c4993382cc (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_773107e5243.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_773107e5243 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8d60d9e5354.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_8d60d9e5354 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8e950d973a4.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_8e950d973a4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8f89d1af833.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_8f89d1af833 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_944e056c7b8.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_944e056c7b8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_971ca1bfd48.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_971ca1bfd48 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_a3314293140.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_a3314293140 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_b27f55ae22d.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_b27f55ae22d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_c2eb1d1c633.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_c2eb1d1c633 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_c5afb6c6a95.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-network-delete_fanout_c5afb6c6a95 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_107df82b88f746.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_107df82b88f746 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_25c7a322b65a4d.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_25c7a322b65a4d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_4b696dd45a1149.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_4b696dd45a1149 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_6447fc7d76a741.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_6447fc7d76a741 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_6728c5fbdc144c.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_6728c5fbdc144c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_724841285ffb49.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_724841285ffb49 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_73159f64b8f643.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_73159f64b8f643 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_7367227aef3346.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_7367227aef3346 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_7789b52e558245.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_7789b52e558245 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_81c2beb48fc74f.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_81c2beb48fc74f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_843b6fe28fb34c.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_843b6fe28fb34c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_8c8f3152f54041.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_8c8f3152f54041 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_a57269bc8c8148.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_a57269bc8c8148 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_c47fbaab748e4f.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_c47fbaab748e4f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_d02223799f7a40.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_d02223799f7a40 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_e4f310417e5f48.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-port-update_fanout_e4f310417e5f48 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_09ba.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_09ba (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_0b05.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_0b05 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_144c.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_144c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_262e.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_262e (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_2c61.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_2c61 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_5d76.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_5d76 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_6007.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_6007 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_796a.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_796a (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_9ae6.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_9ae6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_a0b5.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_a0b5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b2c9.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_b2c9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b899.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_b899 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b938.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_b938 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_c662.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_c662 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_cd3b.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_cd3b (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_ce84.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-security_group-update_fanout_ce84 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_24a2e9202ff6.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_24a2e9202ff6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_31093f6257a1.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_31093f6257a1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_6454a664b63c.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_6454a664b63c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_790bd8e6598e.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_790bd8e6598e (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_7e95fe20c287.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_7e95fe20c287 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_80652ce2591a.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_80652ce2591a (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_87b919cf30a7.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_87b919cf30a7 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_916ba692a7b9.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_916ba692a7b9 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b1.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_c00ff563bbf4.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_c00ff563bbf4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c1.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c1 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_f0827b82b800.value", "nodes": [], "title": "ctl_messages_q-agent-notifier-tunnel-update_fanout_f0827b82b800 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-l3-plugin.value", "nodes": [], "title": "ctl_messages_q-l3-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_q-plugin.value", "nodes": [], "title": "ctl_messages_q-plugin (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_059bfb29183f4cd384437af5fd8d5638.value", "nodes": [], "title": "ctl_messages_reply_059bfb29183f4cd384437af5fd8d5638 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_068ff2e55101436abcbdb73ba9539518.value", "nodes": [], "title": "ctl_messages_reply_068ff2e55101436abcbdb73ba9539518 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_163e426282104825a5bd9f78de96fa6e.value", "nodes": [], "title": "ctl_messages_reply_163e426282104825a5bd9f78de96fa6e (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_2adac7387f6f434684d4ae53615ddee6.value", "nodes": [], "title": "ctl_messages_reply_2adac7387f6f434684d4ae53615ddee6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "nodes": [], "title": "ctl_messages_reply_2c6a2671a10c4eccb06a289f2527cdc6 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_34a6080dab0344ab9683c2054e87c602.value", "nodes": [], "title": "ctl_messages_reply_34a6080dab0344ab9683c2054e87c602 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "nodes": [], "title": "ctl_messages_reply_439f0b94dc5f4a6caf38eee72b36b25b (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "nodes": [], "title": "ctl_messages_reply_49d3df8aee1f491d9fa3818e3fa02956 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "nodes": [], "title": "ctl_messages_reply_4ac92fc3c8024161ad79e0c2dc5aec14 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "nodes": [], "title": "ctl_messages_reply_4b84d273ba5047acbd9f5edd8f4b9570 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "nodes": [], "title": "ctl_messages_reply_4f96552f1f07422c8c5d9fe3f81db14d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_5229cd963f03412587f212a5cce586da.value", "nodes": [], "title": "ctl_messages_reply_5229cd963f03412587f212a5cce586da (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "nodes": [], "title": "ctl_messages_reply_5b999f57c15e4a61b9db28fe5e16d689 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_65068a2b97034f01afb9977a102f4216.value", "nodes": [], "title": "ctl_messages_reply_65068a2b97034f01afb9977a102f4216 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_771a9b1bfc674a698e6ff56242561f83.value", "nodes": [], "title": "ctl_messages_reply_771a9b1bfc674a698e6ff56242561f83 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_7762f1c557f1497a93c50042ec6f6edb.value", "nodes": [], "title": "ctl_messages_reply_7762f1c557f1497a93c50042ec6f6edb (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_7f0080ecb6b741c1ae6728a953896c10.value", "nodes": [], "title": "ctl_messages_reply_7f0080ecb6b741c1ae6728a953896c10 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "nodes": [], "title": "ctl_messages_reply_84a19f4db62a4ce098f15e2db5dc0f02 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_91e0309c76c34c3198f9a0716621750d.value", "nodes": [], "title": "ctl_messages_reply_91e0309c76c34c3198f9a0716621750d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_973be4200d754146807f90d33fc311df.value", "nodes": [], "title": "ctl_messages_reply_973be4200d754146807f90d33fc311df (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "nodes": [], "title": "ctl_messages_reply_9aa8cb42adbf43ed83dcf5ce049c4742 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "nodes": [], "title": "ctl_messages_reply_abce43e4d9b441f999d5cca4e9cdbfa4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_b6aff102b26c48efbf99328a2c7c0884.value", "nodes": [], "title": "ctl_messages_reply_b6aff102b26c48efbf99328a2c7c0884 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "nodes": [], "title": "ctl_messages_reply_cfd2a9bfb7f144cfbdece5631a920fb8 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_d8013e8161a44966be5b78ea36ea5168.value", "nodes": [], "title": "ctl_messages_reply_d8013e8161a44966be5b78ea36ea5168 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_ea46f963d0a24754b609ad1476c2c18f.value", "nodes": [], "title": "ctl_messages_reply_ea46f963d0a24754b609ad1476c2c18f (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_f0dbf1a492094fea85d1ec974efd3472.value", "nodes": [], "title": "ctl_messages_reply_f0dbf1a492094fea85d1ec974efd3472 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_f5f9dccda65b4e3788346807f546f32c.value", "nodes": [], "title": "ctl_messages_reply_f5f9dccda65b4e3788346807f546f32c (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_f89e0feabf714cad810af29e6f34870b.value", "nodes": [], "title": "ctl_messages_reply_f89e0feabf714cad810af29e6f34870b (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "nodes": [], "title": "ctl_messages_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "nodes": [], "title": "ctl_messages_reply_fed9064a054e4d64ba4f0b59932a3ec5 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_scheduler.controller-node.value", "nodes": [], "title": "controller-node (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler.host-4.value", "nodes": [], "title": "host-4 (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler.test-controller-node.value", "nodes": [], "title": "test-controller-node (value)" } ], "title": "ctl_messages_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler.value", "nodes": [], "title": "ctl_messages_scheduler (value)" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler", "nodes": [ { "id": "rabbitmq_info.gauge.ctl_messages_scheduler.ws-controller1.value", "nodes": [], "title": "ws-controller1 (value)" } ], "title": "ctl_messages_scheduler" }, { "id": "rabbitmq_info.gauge.ctl_messages_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "nodes": [], "title": "ctl_messages_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47 (value)" }, { "id": "rabbitmq_info.gauge.pmap_mapped.value", "nodes": [], "title": "pmap_mapped (value)" }, { "id": "rabbitmq_info.gauge.pmap_shared.value", "nodes": [], "title": "pmap_shared (value)" } ], "title": "gauge" } ], "title": "rabbitmq_info" } ];
        return [200, metricstree, {}];
    });

    /*$httpBackend.whenGET(/\.*\/monit.*\/metrics$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metrics = ["kairosdb.datastore.query_collisions","kairosdb.datastore.write_size","kairosdb.jvm.free_memory","kairosdb.jvm.max_memory","kairosdb.jvm.thread_count","kairosdb.jvm.total_memory","kairosdb.protocol.http_request_count","kairosdb.protocol.telnet_request_count"];
        return [200, metrics, {}];
    });*/

    $httpBackend.whenGET(/\.*\/monit.*\/metricnames$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var metricsName = [ "cpu.0.cpu.idle.value", "cpu.0.cpu.interrupt.value", "cpu.0.cpu.nice.value", "cpu.0.cpu.softirq.value", "cpu.0.cpu.steal.value", "cpu.0.cpu.system.value", "cpu.0.cpu.user.value", "cpu.0.cpu.wait.value", "cpu.all.cpu.guest.value", "cpu.all.cpu.guest_nice.value", "cpu.all.cpu.guest_nice_percent.value", "cpu.all.cpu.guest_percent.value", "cpu.all.cpu.idle.value", "cpu.all.cpu.idle_percent.value", "cpu.all.cpu.interrupt.value", "cpu.all.cpu.interrupt_percent.value", "cpu.all.cpu.nice.value", "cpu.all.cpu.nice_percent.value", "cpu.all.cpu.softirq.value", "cpu.all.cpu.softirq_percent.value", "cpu.all.cpu.steal.value", "cpu.all.cpu.steal_percent.value", "cpu.all.cpu.system.value", "cpu.all.cpu.system_percent.value", "cpu.all.cpu.wait.value", "cpu.all.cpu.wait_percent.value", "disk.sda.disk_merged.read", "disk.sda.disk_merged.write", "disk.sda.disk_octets.read", "disk.sda.disk_octets.write", "disk.sda.disk_ops.read", "disk.sda.disk_ops.write", "disk.sda.disk_time.read", "disk.sda.disk_time.write", "disk.sda1.disk_merged.read", "disk.sda1.disk_merged.write", "disk.sda1.disk_octets.read", "disk.sda1.disk_octets.write", "disk.sda1.disk_ops.read", "disk.sda1.disk_ops.write", "disk.sda1.disk_time.read", "disk.sda1.disk_time.write", "disk.sda2.disk_merged.read", "disk.sda2.disk_merged.write", "disk.sda2.disk_octets.read", "disk.sda2.disk_octets.write", "disk.sda2.disk_ops.read", "disk.sda2.disk_ops.write", "disk.sda2.disk_time.read", "disk.sda2.disk_time.write", "disk.sda3.disk_merged.read", "disk.sda3.disk_merged.write", "disk.sda3.disk_octets.read", "disk.sda3.disk_octets.write", "disk.sda3.disk_ops.read", "disk.sda3.disk_ops.write", "disk.sda3.disk_time.read", "disk.sda3.disk_time.write", "disk.sdb.disk_merged.read", "disk.sdb.disk_merged.write", "disk.sdb.disk_octets.read", "disk.sdb.disk_octets.write", "disk.sdb.disk_ops.read", "disk.sdb.disk_ops.write", "disk.sdb.disk_time.read", "disk.sdb.disk_time.write", "interface.br-ex.if_errors.rx", "interface.br-ex.if_errors.tx", "interface.br-ex.if_octets.rx", "interface.br-ex.if_octets.tx", "interface.br-ex.if_packets.rx", "interface.br-ex.if_packets.tx", "interface.br-int.if_errors.rx", "interface.br-int.if_errors.tx", "interface.br-int.if_octets.rx", "interface.br-int.if_octets.tx", "interface.br-int.if_packets.rx", "interface.br-int.if_packets.tx", "interface.br-tun.if_errors.rx", "interface.br-tun.if_errors.tx", "interface.br-tun.if_octets.rx", "interface.br-tun.if_octets.tx", "interface.br-tun.if_packets.rx", "interface.br-tun.if_packets.tx", "interface.eth0.if_errors.rx", "interface.eth0.if_errors.tx", "interface.eth0.if_octets.rx", "interface.eth0.if_octets.tx", "interface.eth0.if_packets.rx", "interface.eth0.if_packets.tx", "interface.eth1.if_errors.rx", "interface.eth1.if_errors.tx", "interface.eth1.if_octets.rx", "interface.eth1.if_octets.tx", "interface.eth1.if_packets.rx", "interface.eth1.if_packets.tx", "interface.eth2.if_errors.rx", "interface.eth2.if_errors.tx", "interface.eth2.if_octets.rx", "interface.eth2.if_octets.tx", "interface.eth2.if_packets.rx", "interface.eth2.if_packets.tx", "interface.lo.if_errors.rx", "interface.lo.if_errors.tx", "interface.lo.if_octets.rx", "interface.lo.if_octets.tx", "interface.lo.if_packets.rx", "interface.lo.if_packets.tx", "interface.ovs-system.if_errors.rx", "interface.ovs-system.if_errors.tx", "interface.ovs-system.if_octets.rx", "interface.ovs-system.if_octets.tx", "interface.ovs-system.if_packets.rx", "interface.ovs-system.if_packets.tx", "interface.virbr0-nic.if_errors.rx", "interface.virbr0-nic.if_errors.tx", "interface.virbr0-nic.if_octets.rx", "interface.virbr0-nic.if_octets.tx", "interface.virbr0-nic.if_packets.rx", "interface.virbr0-nic.if_packets.tx", "interface.virbr0.if_errors.rx", "interface.virbr0.if_errors.tx", "interface.virbr0.if_octets.rx", "interface.virbr0.if_octets.tx", "interface.virbr0.if_packets.rx", "interface.virbr0.if_packets.tx", "kairosdb.datastore.cassandra.key_query_time", "kairosdb.datastore.query_collisions", "kairosdb.datastore.query_row_count", "kairosdb.datastore.query_sample_size", "kairosdb.datastore.query_time", "kairosdb.datastore.write_size", "kairosdb.http.query_time", "kairosdb.http.request_time", "kairosdb.jvm.free_memory", "kairosdb.jvm.max_memory", "kairosdb.jvm.thread_count", "kairosdb.jvm.total_memory", "kairosdb.metric_counters", "kairosdb.protocol.http_request_count", "kairosdb.protocol.telnet_request_count", "load.load.longterm", "load.load.midterm", "load.load.shortterm", "memory.memory.buffered.value", "memory.memory.cached.value", "memory.memory.free.value", "memory.memory.used.value", "processes.cinder-api.ps_code.value", "processes.cinder-api.ps_count.processes", "processes.cinder-api.ps_count.threads", "processes.cinder-api.ps_cputime.syst", "processes.cinder-api.ps_cputime.user", "processes.cinder-api.ps_data.value", "processes.cinder-api.ps_disk_octets.read", "processes.cinder-api.ps_disk_octets.write", "processes.cinder-api.ps_disk_ops.read", "processes.cinder-api.ps_disk_ops.write", "processes.cinder-api.ps_pagefaults.majflt", "processes.cinder-api.ps_pagefaults.minflt", "processes.cinder-api.ps_rss.value", "processes.cinder-api.ps_stacksize.value", "processes.cinder-api.ps_vm.value", "processes.cinder-scheduler.ps_code.value", "processes.cinder-scheduler.ps_count.processes", "processes.cinder-scheduler.ps_count.threads", "processes.cinder-scheduler.ps_cputime.syst", "processes.cinder-scheduler.ps_cputime.user", "processes.cinder-scheduler.ps_data.value", "processes.cinder-scheduler.ps_disk_octets.read", "processes.cinder-scheduler.ps_disk_octets.write", "processes.cinder-scheduler.ps_disk_ops.read", "processes.cinder-scheduler.ps_disk_ops.write", "processes.cinder-scheduler.ps_pagefaults.majflt", "processes.cinder-scheduler.ps_pagefaults.minflt", "processes.cinder-scheduler.ps_rss.value", "processes.cinder-scheduler.ps_stacksize.value", "processes.cinder-scheduler.ps_vm.value", "processes.cinder-volume.ps_code.value", "processes.cinder-volume.ps_count.processes", "processes.cinder-volume.ps_count.threads", "processes.cinder-volume.ps_cputime.syst", "processes.cinder-volume.ps_cputime.user", "processes.cinder-volume.ps_data.value", "processes.cinder-volume.ps_disk_octets.read", "processes.cinder-volume.ps_disk_octets.write", "processes.cinder-volume.ps_disk_ops.read", "processes.cinder-volume.ps_disk_ops.write", "processes.cinder-volume.ps_pagefaults.majflt", "processes.cinder-volume.ps_pagefaults.minflt", "processes.cinder-volume.ps_rss.value", "processes.cinder-volume.ps_stacksize.value", "processes.cinder-volume.ps_vm.value", "processes.fork_rate.value", "processes.glance-api.ps_code.value", "processes.glance-api.ps_count.processes", "processes.glance-api.ps_count.threads", "processes.glance-api.ps_cputime.syst", "processes.glance-api.ps_cputime.user", "processes.glance-api.ps_data.value", "processes.glance-api.ps_disk_octets.read", "processes.glance-api.ps_disk_octets.write", "processes.glance-api.ps_disk_ops.read", "processes.glance-api.ps_disk_ops.write", "processes.glance-api.ps_pagefaults.majflt", "processes.glance-api.ps_pagefaults.minflt", "processes.glance-api.ps_rss.value", "processes.glance-api.ps_stacksize.value", "processes.glance-api.ps_vm.value", "processes.glance-registry.ps_code.value", "processes.glance-registry.ps_count.processes", "processes.glance-registry.ps_count.threads", "processes.glance-registry.ps_cputime.syst", "processes.glance-registry.ps_cputime.user", "processes.glance-registry.ps_data.value", "processes.glance-registry.ps_disk_octets.read", "processes.glance-registry.ps_disk_octets.write", "processes.glance-registry.ps_disk_ops.read", "processes.glance-registry.ps_disk_ops.write", "processes.glance-registry.ps_pagefaults.majflt", "processes.glance-registry.ps_pagefaults.minflt", "processes.glance-registry.ps_rss.value", "processes.glance-registry.ps_stacksize.value", "processes.glance-registry.ps_vm.value", "processes.httpd.ps_code.value", "processes.httpd.ps_count.processes", "processes.httpd.ps_count.threads", "processes.httpd.ps_cputime.syst", "processes.httpd.ps_cputime.user", "processes.httpd.ps_data.value", "processes.httpd.ps_disk_octets.read", "processes.httpd.ps_disk_octets.write", "processes.httpd.ps_disk_ops.read", "processes.httpd.ps_disk_ops.write", "processes.httpd.ps_pagefaults.majflt", "processes.httpd.ps_pagefaults.minflt", "processes.httpd.ps_rss.value", "processes.httpd.ps_stacksize.value", "processes.httpd.ps_vm.value", "processes.iscsid.ps_code.value", "processes.iscsid.ps_count.processes", "processes.iscsid.ps_count.threads", "processes.iscsid.ps_cputime.syst", "processes.iscsid.ps_cputime.user", "processes.iscsid.ps_data.value", "processes.iscsid.ps_pagefaults.majflt", "processes.iscsid.ps_pagefaults.minflt", "processes.iscsid.ps_rss.value", "processes.iscsid.ps_stacksize.value", "processes.iscsid.ps_vm.value", "processes.keystone.ps_code.value", "processes.keystone.ps_count.processes", "processes.keystone.ps_count.threads", "processes.keystone.ps_cputime.syst", "processes.keystone.ps_cputime.user", "processes.keystone.ps_data.value", "processes.keystone.ps_disk_octets.read", "processes.keystone.ps_disk_octets.write", "processes.keystone.ps_disk_ops.read", "processes.keystone.ps_disk_ops.write", "processes.keystone.ps_pagefaults.majflt", "processes.keystone.ps_pagefaults.minflt", "processes.keystone.ps_rss.value", "processes.keystone.ps_stacksize.value", "processes.keystone.ps_vm.value", "processes.multipathd.ps_code.value", "processes.multipathd.ps_count.processes", "processes.multipathd.ps_count.threads", "processes.multipathd.ps_cputime.syst", "processes.multipathd.ps_cputime.user", "processes.multipathd.ps_data.value", "processes.multipathd.ps_pagefaults.majflt", "processes.multipathd.ps_pagefaults.minflt", "processes.multipathd.ps_rss.value", "processes.multipathd.ps_stacksize.value", "processes.multipathd.ps_vm.value", "processes.mysqld.ps_code.value", "processes.mysqld.ps_count.processes", "processes.mysqld.ps_count.threads", "processes.mysqld.ps_cputime.syst", "processes.mysqld.ps_cputime.user", "processes.mysqld.ps_data.value", "processes.mysqld.ps_disk_octets.read", "processes.mysqld.ps_disk_octets.write", "processes.mysqld.ps_disk_ops.read", "processes.mysqld.ps_disk_ops.write", "processes.mysqld.ps_pagefaults.majflt", "processes.mysqld.ps_pagefaults.minflt", "processes.mysqld.ps_rss.value", "processes.mysqld.ps_stacksize.value", "processes.mysqld.ps_vm.value", "processes.neutron-server.ps_code.value", "processes.neutron-server.ps_count.processes", "processes.neutron-server.ps_count.threads", "processes.neutron-server.ps_cputime.syst", "processes.neutron-server.ps_cputime.user", "processes.neutron-server.ps_data.value", "processes.neutron-server.ps_disk_octets.read", "processes.neutron-server.ps_disk_octets.write", "processes.neutron-server.ps_disk_ops.read", "processes.neutron-server.ps_disk_ops.write", "processes.neutron-server.ps_pagefaults.majflt", "processes.neutron-server.ps_pagefaults.minflt", "processes.neutron-server.ps_rss.value", "processes.neutron-server.ps_stacksize.value", "processes.neutron-server.ps_vm.value", "processes.nova-api.ps_code.value", "processes.nova-api.ps_count.processes", "processes.nova-api.ps_count.threads", "processes.nova-api.ps_cputime.syst", "processes.nova-api.ps_cputime.user", "processes.nova-api.ps_data.value", "processes.nova-api.ps_disk_octets.read", "processes.nova-api.ps_disk_octets.write", "processes.nova-api.ps_disk_ops.read", "processes.nova-api.ps_disk_ops.write", "processes.nova-api.ps_pagefaults.majflt", "processes.nova-api.ps_pagefaults.minflt", "processes.nova-api.ps_rss.value", "processes.nova-api.ps_stacksize.value", "processes.nova-api.ps_vm.value", "processes.nova-cert.ps_code.value", "processes.nova-cert.ps_count.processes", "processes.nova-cert.ps_count.threads", "processes.nova-cert.ps_cputime.syst", "processes.nova-cert.ps_cputime.user", "processes.nova-cert.ps_data.value", "processes.nova-cert.ps_disk_octets.read", "processes.nova-cert.ps_disk_octets.write", "processes.nova-cert.ps_disk_ops.read", "processes.nova-cert.ps_disk_ops.write", "processes.nova-cert.ps_pagefaults.majflt", "processes.nova-cert.ps_pagefaults.minflt", "processes.nova-cert.ps_rss.value", "processes.nova-cert.ps_stacksize.value", "processes.nova-cert.ps_vm.value", "processes.nova-compute.ps_code.value", "processes.nova-compute.ps_count.processes", "processes.nova-compute.ps_count.threads", "processes.nova-compute.ps_cputime.syst", "processes.nova-compute.ps_cputime.user", "processes.nova-compute.ps_data.value", "processes.nova-compute.ps_disk_octets.read", "processes.nova-compute.ps_disk_octets.write", "processes.nova-compute.ps_disk_ops.read", "processes.nova-compute.ps_disk_ops.write", "processes.nova-compute.ps_pagefaults.majflt", "processes.nova-compute.ps_pagefaults.minflt", "processes.nova-compute.ps_rss.value", "processes.nova-compute.ps_stacksize.value", "processes.nova-compute.ps_vm.value", "processes.nova-conductor.ps_code.value", "processes.nova-conductor.ps_count.processes", "processes.nova-conductor.ps_count.threads", "processes.nova-conductor.ps_cputime.syst", "processes.nova-conductor.ps_cputime.user", "processes.nova-conductor.ps_data.value", "processes.nova-conductor.ps_disk_octets.read", "processes.nova-conductor.ps_disk_octets.write", "processes.nova-conductor.ps_disk_ops.read", "processes.nova-conductor.ps_disk_ops.write", "processes.nova-conductor.ps_pagefaults.majflt", "processes.nova-conductor.ps_pagefaults.minflt", "processes.nova-conductor.ps_rss.value", "processes.nova-conductor.ps_stacksize.value", "processes.nova-conductor.ps_vm.value", "processes.nova-metadata-api.ps_code.value", "processes.nova-metadata-api.ps_count.processes", "processes.nova-metadata-api.ps_count.threads", "processes.nova-metadata-api.ps_cputime.syst", "processes.nova-metadata-api.ps_cputime.user", "processes.nova-metadata-api.ps_data.value", "processes.nova-metadata-api.ps_pagefaults.majflt", "processes.nova-metadata-api.ps_pagefaults.minflt", "processes.nova-metadata-api.ps_rss.value", "processes.nova-metadata-api.ps_stacksize.value", "processes.nova-metadata-api.ps_vm.value", "processes.nova-novncproxy.ps_code.value", "processes.nova-novncproxy.ps_count.processes", "processes.nova-novncproxy.ps_count.threads", "processes.nova-novncproxy.ps_cputime.syst", "processes.nova-novncproxy.ps_cputime.user", "processes.nova-novncproxy.ps_data.value", "processes.nova-novncproxy.ps_disk_octets.read", "processes.nova-novncproxy.ps_disk_octets.write", "processes.nova-novncproxy.ps_disk_ops.read", "processes.nova-novncproxy.ps_disk_ops.write", "processes.nova-novncproxy.ps_pagefaults.majflt", "processes.nova-novncproxy.ps_pagefaults.minflt", "processes.nova-novncproxy.ps_rss.value", "processes.nova-novncproxy.ps_stacksize.value", "processes.nova-novncproxy.ps_vm.value", "processes.nova-scheduler.ps_code.value", "processes.nova-scheduler.ps_count.processes", "processes.nova-scheduler.ps_count.threads", "processes.nova-scheduler.ps_cputime.syst", "processes.nova-scheduler.ps_cputime.user", "processes.nova-scheduler.ps_data.value", "processes.nova-scheduler.ps_disk_octets.read", "processes.nova-scheduler.ps_disk_octets.write", "processes.nova-scheduler.ps_disk_ops.read", "processes.nova-scheduler.ps_disk_ops.write", "processes.nova-scheduler.ps_pagefaults.majflt", "processes.nova-scheduler.ps_pagefaults.minflt", "processes.nova-scheduler.ps_rss.value", "processes.nova-scheduler.ps_stacksize.value", "processes.nova-scheduler.ps_vm.value", "processes.nova-xvpvncproxy.ps_code.value", "processes.nova-xvpvncproxy.ps_count.processes", "processes.nova-xvpvncproxy.ps_count.threads", "processes.nova-xvpvncproxy.ps_cputime.syst", "processes.nova-xvpvncproxy.ps_cputime.user", "processes.nova-xvpvncproxy.ps_data.value", "processes.nova-xvpvncproxy.ps_pagefaults.majflt", "processes.nova-xvpvncproxy.ps_pagefaults.minflt", "processes.nova-xvpvncproxy.ps_rss.value", "processes.nova-xvpvncproxy.ps_stacksize.value", "processes.nova-xvpvncproxy.ps_vm.value", "processes.ps_state.blocked.value", "processes.ps_state.paging.value", "processes.ps_state.running.value", "processes.ps_state.sleeping.value", "processes.ps_state.stopped.value", "processes.ps_state.zombies.value", "processes.rabbitmq-server.ps_code.value", "processes.rabbitmq-server.ps_count.processes", "processes.rabbitmq-server.ps_count.threads", "processes.rabbitmq-server.ps_cputime.syst", "processes.rabbitmq-server.ps_cputime.user", "processes.rabbitmq-server.ps_data.value", "processes.rabbitmq-server.ps_disk_octets.read", "processes.rabbitmq-server.ps_disk_octets.write", "processes.rabbitmq-server.ps_disk_ops.read", "processes.rabbitmq-server.ps_disk_ops.write", "processes.rabbitmq-server.ps_pagefaults.majflt", "processes.rabbitmq-server.ps_pagefaults.minflt", "processes.rabbitmq-server.ps_rss.value", "processes.rabbitmq-server.ps_stacksize.value", "processes.rabbitmq-server.ps_vm.value", "rabbitmq_info.gauge.ctl_consumers.value", "rabbitmq_info.gauge.ctl_consumers_cert.controller-node.value", "rabbitmq_info.gauge.ctl_consumers_cert.host-4.value", "rabbitmq_info.gauge.ctl_consumers_cert.test-controller-node.value", "rabbitmq_info.gauge.ctl_consumers_cert.value", "rabbitmq_info.gauge.ctl_consumers_cert.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "rabbitmq_info.gauge.ctl_consumers_cert_fanout_c5663842094a4d35ac07f7f97486fe90.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.host-4.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_25598b80dd744af6b731a8240.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc.value", "rabbitmq_info.gauge.ctl_consumers_cinder-scheduler_fanout_f960594b74114a16b622656ef.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-2.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-4.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume.host-5.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_47bd60c6669041d486d36c2171ab.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218.value", "rabbitmq_info.gauge.ctl_consumers_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169.value", "rabbitmq_info.gauge.ctl_consumers_compute.host-1.value", "rabbitmq_info.gauge.ctl_consumers_compute.host-2.value", "rabbitmq_info.gauge.ctl_consumers_compute.host-4.value", "rabbitmq_info.gauge.ctl_consumers_compute.host-5.value", "rabbitmq_info.gauge.ctl_consumers_compute.value", "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute1.value", "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute2.value", "rabbitmq_info.gauge.ctl_consumers_compute.ws-compute3.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "rabbitmq_info.gauge.ctl_consumers_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "rabbitmq_info.gauge.ctl_consumers_conductor.controller-node.value", "rabbitmq_info.gauge.ctl_consumers_conductor.host-4.value", "rabbitmq_info.gauge.ctl_consumers_conductor.test-controller-node.value", "rabbitmq_info.gauge.ctl_consumers_conductor.value", "rabbitmq_info.gauge.ctl_consumers_conductor.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_conductor_fanout_045a656556544fa4819265a995b14446.value", "rabbitmq_info.gauge.ctl_consumers_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth.controller-node.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth.host-4.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth.test-controller-node.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f0.value", "rabbitmq_info.gauge.ctl_consumers_consoleauth_fanout_8cb998aa509349a59c8ae6c9347274.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.network-node.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.test-network.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae02.value", "rabbitmq_info.gauge.ctl_consumers_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff53.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent.network-node.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent.test-network.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "rabbitmq_info.gauge.ctl_consumers_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_1099820356.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_298d8ca930.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_319bf4990a.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_32cbb9c70f.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_497c56b5b2.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_5c4993382c.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_773107e524.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8d60d9e535.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8e950d973a.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_8f89d1af83.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_944e056c7b.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_971ca1bfd4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_a331429314.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_b27f55ae22.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_c2eb1d1c63.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-network-delete_fanout_c5afb6c6a9.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_107df82b88f74.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_25c7a322b65a4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_4b696dd45a114.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_6447fc7d76a74.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_6728c5fbdc144.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_724841285ffb4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_73159f64b8f64.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_7367227aef334.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_7789b52e55824.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_81c2beb48fc74.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_843b6fe28fb34.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_8c8f3152f5404.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_a57269bc8c814.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_c47fbaab748e4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_d02223799f7a4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-port-update_fanout_e4f310417e5f4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_09b.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_0b0.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_144.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_262.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_2c6.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_5d7.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_600.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_796.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_9ae.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_a0b.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b2c.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b89.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_b93.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_c66.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_cd3.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-security_group-update_fanout_ce8.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_24a2e9202ff.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_31093f6257a.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_6454a664b63.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_790bd8e6598.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_7e95fe20c28.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_80652ce2591.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_87b919cf30a.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_916ba692a7b.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_99eeb1266b4.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_ab6c0f38074.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_c00ff563bbf.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c.value", "rabbitmq_info.gauge.ctl_consumers_q-agent-notifier-tunnel-update_fanout_f0827b82b80.value", "rabbitmq_info.gauge.ctl_consumers_q-l3-plugin.value", "rabbitmq_info.gauge.ctl_consumers_q-plugin.value", "rabbitmq_info.gauge.ctl_consumers_reply_059bfb29183f4cd384437af5fd8d5638.value", "rabbitmq_info.gauge.ctl_consumers_reply_068ff2e55101436abcbdb73ba9539518.value", "rabbitmq_info.gauge.ctl_consumers_reply_11781d964fb147329c231cd769d844a3.value", "rabbitmq_info.gauge.ctl_consumers_reply_163e426282104825a5bd9f78de96fa6e.value", "rabbitmq_info.gauge.ctl_consumers_reply_2adac7387f6f434684d4ae53615ddee6.value", "rabbitmq_info.gauge.ctl_consumers_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "rabbitmq_info.gauge.ctl_consumers_reply_342f32a38d65447199f512dbf1e58d36.value", "rabbitmq_info.gauge.ctl_consumers_reply_34a6080dab0344ab9683c2054e87c602.value", "rabbitmq_info.gauge.ctl_consumers_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "rabbitmq_info.gauge.ctl_consumers_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "rabbitmq_info.gauge.ctl_consumers_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "rabbitmq_info.gauge.ctl_consumers_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "rabbitmq_info.gauge.ctl_consumers_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "rabbitmq_info.gauge.ctl_consumers_reply_5229cd963f03412587f212a5cce586da.value", "rabbitmq_info.gauge.ctl_consumers_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "rabbitmq_info.gauge.ctl_consumers_reply_65068a2b97034f01afb9977a102f4216.value", "rabbitmq_info.gauge.ctl_consumers_reply_771a9b1bfc674a698e6ff56242561f83.value", "rabbitmq_info.gauge.ctl_consumers_reply_7762f1c557f1497a93c50042ec6f6edb.value", "rabbitmq_info.gauge.ctl_consumers_reply_7f0080ecb6b741c1ae6728a953896c10.value", "rabbitmq_info.gauge.ctl_consumers_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "rabbitmq_info.gauge.ctl_consumers_reply_91e0309c76c34c3198f9a0716621750d.value", "rabbitmq_info.gauge.ctl_consumers_reply_973be4200d754146807f90d33fc311df.value", "rabbitmq_info.gauge.ctl_consumers_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "rabbitmq_info.gauge.ctl_consumers_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "rabbitmq_info.gauge.ctl_consumers_reply_b6aff102b26c48efbf99328a2c7c0884.value", "rabbitmq_info.gauge.ctl_consumers_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "rabbitmq_info.gauge.ctl_consumers_reply_d8013e8161a44966be5b78ea36ea5168.value", "rabbitmq_info.gauge.ctl_consumers_reply_ea46f963d0a24754b609ad1476c2c18f.value", "rabbitmq_info.gauge.ctl_consumers_reply_eb623d0615fb40178ff37b21bd86dd03.value", "rabbitmq_info.gauge.ctl_consumers_reply_f0dbf1a492094fea85d1ec974efd3472.value", "rabbitmq_info.gauge.ctl_consumers_reply_f5f9dccda65b4e3788346807f546f32c.value", "rabbitmq_info.gauge.ctl_consumers_reply_f89e0feabf714cad810af29e6f34870b.value", "rabbitmq_info.gauge.ctl_consumers_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "rabbitmq_info.gauge.ctl_consumers_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "rabbitmq_info.gauge.ctl_consumers_scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_consumers_scheduler.host-4.value", "rabbitmq_info.gauge.ctl_consumers_scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_consumers_scheduler.value", "rabbitmq_info.gauge.ctl_consumers_scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_consumers_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6.value", "rabbitmq_info.gauge.ctl_consumers_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "rabbitmq_info.gauge.ctl_memory.value", "rabbitmq_info.gauge.ctl_memory_cert.controller-node.value", "rabbitmq_info.gauge.ctl_memory_cert.host-4.value", "rabbitmq_info.gauge.ctl_memory_cert.test-controller-node.value", "rabbitmq_info.gauge.ctl_memory_cert.value", "rabbitmq_info.gauge.ctl_memory_cert.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "rabbitmq_info.gauge.ctl_memory_cert_fanout_c5663842094a4d35ac07f7f97486fe90.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.host-4.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_25598b80dd744af6b731a824005f.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc12c.value", "rabbitmq_info.gauge.ctl_memory_cinder-scheduler_fanout_f960594b74114a16b622656ef436.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-2.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-4.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume.host-5.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_47bd60c6669041d486d36c2171abb2e.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c8230.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e235.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218df5.value", "rabbitmq_info.gauge.ctl_memory_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169ca7.value", "rabbitmq_info.gauge.ctl_memory_compute.host-1.value", "rabbitmq_info.gauge.ctl_memory_compute.host-2.value", "rabbitmq_info.gauge.ctl_memory_compute.host-4.value", "rabbitmq_info.gauge.ctl_memory_compute.host-5.value", "rabbitmq_info.gauge.ctl_memory_compute.value", "rabbitmq_info.gauge.ctl_memory_compute.ws-compute1.value", "rabbitmq_info.gauge.ctl_memory_compute.ws-compute2.value", "rabbitmq_info.gauge.ctl_memory_compute.ws-compute3.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "rabbitmq_info.gauge.ctl_memory_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "rabbitmq_info.gauge.ctl_memory_conductor.controller-node.value", "rabbitmq_info.gauge.ctl_memory_conductor.host-4.value", "rabbitmq_info.gauge.ctl_memory_conductor.test-controller-node.value", "rabbitmq_info.gauge.ctl_memory_conductor.value", "rabbitmq_info.gauge.ctl_memory_conductor.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_conductor_fanout_045a656556544fa4819265a995b14446.value", "rabbitmq_info.gauge.ctl_memory_conductor_fanout_40ce5e5cf1eb4214a890e48a97d6d6dc.value", "rabbitmq_info.gauge.ctl_memory_consoleauth.controller-node.value", "rabbitmq_info.gauge.ctl_memory_consoleauth.host-4.value", "rabbitmq_info.gauge.ctl_memory_consoleauth.test-controller-node.value", "rabbitmq_info.gauge.ctl_memory_consoleauth.value", "rabbitmq_info.gauge.ctl_memory_consoleauth.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f071.value", "rabbitmq_info.gauge.ctl_memory_consoleauth_fanout_8cb998aa509349a59c8ae6c93472749a.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent.network-node.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent.test-network.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022.value", "rabbitmq_info.gauge.ctl_memory_dhcp_agent_fanout_951f6291016d4984aaaffb96ecaff532.value", "rabbitmq_info.gauge.ctl_memory_l3_agent.network-node.value", "rabbitmq_info.gauge.ctl_memory_l3_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_memory_l3_agent.test-network.value", "rabbitmq_info.gauge.ctl_memory_l3_agent.value", "rabbitmq_info.gauge.ctl_memory_l3_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "rabbitmq_info.gauge.ctl_memory_l3_agent_fanout_a40590a2ec6c4758bfed3eba000b3e13.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_1099820356be4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_298d8ca930ce4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_319bf4990ade4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_32cbb9c70f7c4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_497c56b5b2a84.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_5c4993382ccd4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_773107e524354.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8d60d9e535424.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8e950d973a4d4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_8f89d1af83344.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_944e056c7b804.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_971ca1bfd4894.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_a3314293140a4.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_b27f55ae22d34.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_c2eb1d1c63304.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-network-delete_fanout_c5afb6c6a9554.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_107df82b88f74616.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_25c7a322b65a4d33.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_4b696dd45a1149a0.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_6447fc7d76a741d9.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_6728c5fbdc144cb0.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_724841285ffb49c9.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_73159f64b8f64378.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_7367227aef33469d.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_7789b52e55824548.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_81c2beb48fc74f40.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_843b6fe28fb34cd2.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_8c8f3152f540416f.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_a57269bc8c814805.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_c47fbaab748e4f9a.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_d02223799f7a4046.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-port-update_fanout_e4f310417e5f4807.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_09ba06.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_0b0574.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_144ca1.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_262eb2.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_2c61fd.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_5d7664.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_6007b7.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_796ab1.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_9ae67c.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_a0b554.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b2c991.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b89922.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_b938cc.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_c662b6.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_cd3bbf.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-security_group-update_fanout_ce8424.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_24a2e9202ff641.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a4a.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_31093f6257a143.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f47.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_6454a664b63c43.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_790bd8e6598e49.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_7e95fe20c28744.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_80652ce2591a4d.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_87b919cf30a74f.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_916ba692a7b94e.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b45.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f49.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b14b.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_c00ff563bbf446.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c144.value", "rabbitmq_info.gauge.ctl_memory_q-agent-notifier-tunnel-update_fanout_f0827b82b80040.value", "rabbitmq_info.gauge.ctl_memory_q-l3-plugin.value", "rabbitmq_info.gauge.ctl_memory_q-plugin.value", "rabbitmq_info.gauge.ctl_memory_reply_059bfb29183f4cd384437af5fd8d5638.value", "rabbitmq_info.gauge.ctl_memory_reply_068ff2e55101436abcbdb73ba9539518.value", "rabbitmq_info.gauge.ctl_memory_reply_11781d964fb147329c231cd769d844a3.value", "rabbitmq_info.gauge.ctl_memory_reply_163e426282104825a5bd9f78de96fa6e.value", "rabbitmq_info.gauge.ctl_memory_reply_2adac7387f6f434684d4ae53615ddee6.value", "rabbitmq_info.gauge.ctl_memory_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "rabbitmq_info.gauge.ctl_memory_reply_342f32a38d65447199f512dbf1e58d36.value", "rabbitmq_info.gauge.ctl_memory_reply_34a6080dab0344ab9683c2054e87c602.value", "rabbitmq_info.gauge.ctl_memory_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "rabbitmq_info.gauge.ctl_memory_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "rabbitmq_info.gauge.ctl_memory_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "rabbitmq_info.gauge.ctl_memory_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "rabbitmq_info.gauge.ctl_memory_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "rabbitmq_info.gauge.ctl_memory_reply_5229cd963f03412587f212a5cce586da.value", "rabbitmq_info.gauge.ctl_memory_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "rabbitmq_info.gauge.ctl_memory_reply_65068a2b97034f01afb9977a102f4216.value", "rabbitmq_info.gauge.ctl_memory_reply_771a9b1bfc674a698e6ff56242561f83.value", "rabbitmq_info.gauge.ctl_memory_reply_7762f1c557f1497a93c50042ec6f6edb.value", "rabbitmq_info.gauge.ctl_memory_reply_7f0080ecb6b741c1ae6728a953896c10.value", "rabbitmq_info.gauge.ctl_memory_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "rabbitmq_info.gauge.ctl_memory_reply_91e0309c76c34c3198f9a0716621750d.value", "rabbitmq_info.gauge.ctl_memory_reply_973be4200d754146807f90d33fc311df.value", "rabbitmq_info.gauge.ctl_memory_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "rabbitmq_info.gauge.ctl_memory_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "rabbitmq_info.gauge.ctl_memory_reply_b6aff102b26c48efbf99328a2c7c0884.value", "rabbitmq_info.gauge.ctl_memory_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "rabbitmq_info.gauge.ctl_memory_reply_d8013e8161a44966be5b78ea36ea5168.value", "rabbitmq_info.gauge.ctl_memory_reply_ea46f963d0a24754b609ad1476c2c18f.value", "rabbitmq_info.gauge.ctl_memory_reply_eb623d0615fb40178ff37b21bd86dd03.value", "rabbitmq_info.gauge.ctl_memory_reply_f0dbf1a492094fea85d1ec974efd3472.value", "rabbitmq_info.gauge.ctl_memory_reply_f5f9dccda65b4e3788346807f546f32c.value", "rabbitmq_info.gauge.ctl_memory_reply_f89e0feabf714cad810af29e6f34870b.value", "rabbitmq_info.gauge.ctl_memory_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "rabbitmq_info.gauge.ctl_memory_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "rabbitmq_info.gauge.ctl_memory_scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_memory_scheduler.host-4.value", "rabbitmq_info.gauge.ctl_memory_scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_memory_scheduler.value", "rabbitmq_info.gauge.ctl_memory_scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_memory_scheduler_fanout_353098f02c114a14a42ff953ba5c06e6.value", "rabbitmq_info.gauge.ctl_memory_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "rabbitmq_info.gauge.ctl_messages.value", "rabbitmq_info.gauge.ctl_messages_cert.controller-node.value", "rabbitmq_info.gauge.ctl_messages_cert.host-4.value", "rabbitmq_info.gauge.ctl_messages_cert.test-controller-node.value", "rabbitmq_info.gauge.ctl_messages_cert.value", "rabbitmq_info.gauge.ctl_messages_cert.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_cert_fanout_57cadd6cb25d4725b7b91772ab3713c9.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.host-4.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_25598b80dd744af6b731a82400.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_6b30e385b2bc455186bd687fc1.value", "rabbitmq_info.gauge.ctl_messages_cinder-scheduler_fanout_f960594b74114a16b622656ef4.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-2.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-4.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume.host-5.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_47bd60c6669041d486d36c2171abb.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_4e2aa2fb86c04ca9b915de7988c82.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_6056b3dc966b4d93a1c87a70745e2.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_b64bd8af5cc04ac8b78ac8e99218d.value", "rabbitmq_info.gauge.ctl_messages_cinder-volume_fanout_bd8c4bcdf7134a249e1d72109169c.value", "rabbitmq_info.gauge.ctl_messages_compute.host-1.value", "rabbitmq_info.gauge.ctl_messages_compute.host-2.value", "rabbitmq_info.gauge.ctl_messages_compute.host-4.value", "rabbitmq_info.gauge.ctl_messages_compute.host-5.value", "rabbitmq_info.gauge.ctl_messages_compute.value", "rabbitmq_info.gauge.ctl_messages_compute.ws-compute1.value", "rabbitmq_info.gauge.ctl_messages_compute.ws-compute2.value", "rabbitmq_info.gauge.ctl_messages_compute.ws-compute3.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_5bcb886fc6c14fad965c177d9eb0164d.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_7c455a521c99435eb888c2bdb06c5e5d.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_a2ce817c5c9b49c696e3927fad560fc0.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_a30aec7ee4ba4d32b62463835a1c6280.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_abbbda28849245fabbedbbb78dfe7752.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_b4d3efb471db49a589fe686ff47f323a.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_d23202346a2d4efa8f20186c98b80940.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_d5dcb5e1b8c2496b95bc060d02aef3b9.value", "rabbitmq_info.gauge.ctl_messages_compute_fanout_efbb1c724ac44c1dae5e6f49d1d9bae5.value", "rabbitmq_info.gauge.ctl_messages_conductor.controller-node.value", "rabbitmq_info.gauge.ctl_messages_conductor.host-4.value", "rabbitmq_info.gauge.ctl_messages_conductor.test-controller-node.value", "rabbitmq_info.gauge.ctl_messages_conductor.value", "rabbitmq_info.gauge.ctl_messages_conductor.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_conductor_fanout_045a656556544fa4819265a995b14446.value", "rabbitmq_info.gauge.ctl_messages_consoleauth.controller-node.value", "rabbitmq_info.gauge.ctl_messages_consoleauth.host-4.value", "rabbitmq_info.gauge.ctl_messages_consoleauth.test-controller-node.value", "rabbitmq_info.gauge.ctl_messages_consoleauth.value", "rabbitmq_info.gauge.ctl_messages_consoleauth.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_consoleauth_fanout_28c5c09f1b7348a1bef9c2267ce9f07.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent.network-node.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent.test-network.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent_fanout_3ca124941139483094bbe4b67661b70f.value", "rabbitmq_info.gauge.ctl_messages_dhcp_agent_fanout_8ab5a7c9b5bd4dd2b0d8a890b7bae022.value", "rabbitmq_info.gauge.ctl_messages_l3_agent.network-node.value", "rabbitmq_info.gauge.ctl_messages_l3_agent.test-network-node.value", "rabbitmq_info.gauge.ctl_messages_l3_agent.test-network.value", "rabbitmq_info.gauge.ctl_messages_l3_agent.value", "rabbitmq_info.gauge.ctl_messages_l3_agent.ws-network1.value", "rabbitmq_info.gauge.ctl_messages_l3_agent_fanout_19f1c4dead5e4e13a37b24e55c4a1e33.value", "rabbitmq_info.gauge.ctl_messages_l3_agent_fanout_3165213b23094fe3a66feb16d104d5e1.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_1099820356b.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_298d8ca930c.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_319bf4990ad.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_32cbb9c70f7.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_497c56b5b2a.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_5c4993382cc.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_773107e5243.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8d60d9e5354.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8e950d973a4.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_8f89d1af833.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_944e056c7b8.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_971ca1bfd48.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_a3314293140.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_b27f55ae22d.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_c2eb1d1c633.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-network-delete_fanout_c5afb6c6a95.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_107df82b88f746.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_25c7a322b65a4d.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_4b696dd45a1149.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_6447fc7d76a741.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_6728c5fbdc144c.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_724841285ffb49.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_73159f64b8f643.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_7367227aef3346.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_7789b52e558245.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_81c2beb48fc74f.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_843b6fe28fb34c.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_8c8f3152f54041.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_a57269bc8c8148.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_c47fbaab748e4f.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_d02223799f7a40.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-port-update_fanout_e4f310417e5f48.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_09ba.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_0b05.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_144c.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_262e.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_2c61.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_5d76.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_6007.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_796a.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_9ae6.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_a0b5.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b2c9.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b899.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_b938.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_c662.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_cd3b.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-security_group-update_fanout_ce84.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_24a2e9202ff6.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_2c28efbd9d0a.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_31093f6257a1.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_38f5f46c5e5f.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_6454a664b63c.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_790bd8e6598e.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_7e95fe20c287.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_80652ce2591a.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_87b919cf30a7.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_916ba692a7b9.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_99eeb1266b4b.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_ab6c0f38074f.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_b3d3beeba1b1.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_c00ff563bbf4.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_ce4ba704b8c1.value", "rabbitmq_info.gauge.ctl_messages_q-agent-notifier-tunnel-update_fanout_f0827b82b800.value", "rabbitmq_info.gauge.ctl_messages_q-l3-plugin.value", "rabbitmq_info.gauge.ctl_messages_q-plugin.value", "rabbitmq_info.gauge.ctl_messages_reply_059bfb29183f4cd384437af5fd8d5638.value", "rabbitmq_info.gauge.ctl_messages_reply_068ff2e55101436abcbdb73ba9539518.value", "rabbitmq_info.gauge.ctl_messages_reply_163e426282104825a5bd9f78de96fa6e.value", "rabbitmq_info.gauge.ctl_messages_reply_2adac7387f6f434684d4ae53615ddee6.value", "rabbitmq_info.gauge.ctl_messages_reply_2c6a2671a10c4eccb06a289f2527cdc6.value", "rabbitmq_info.gauge.ctl_messages_reply_34a6080dab0344ab9683c2054e87c602.value", "rabbitmq_info.gauge.ctl_messages_reply_439f0b94dc5f4a6caf38eee72b36b25b.value", "rabbitmq_info.gauge.ctl_messages_reply_49d3df8aee1f491d9fa3818e3fa02956.value", "rabbitmq_info.gauge.ctl_messages_reply_4ac92fc3c8024161ad79e0c2dc5aec14.value", "rabbitmq_info.gauge.ctl_messages_reply_4b84d273ba5047acbd9f5edd8f4b9570.value", "rabbitmq_info.gauge.ctl_messages_reply_4f96552f1f07422c8c5d9fe3f81db14d.value", "rabbitmq_info.gauge.ctl_messages_reply_5229cd963f03412587f212a5cce586da.value", "rabbitmq_info.gauge.ctl_messages_reply_5b999f57c15e4a61b9db28fe5e16d689.value", "rabbitmq_info.gauge.ctl_messages_reply_65068a2b97034f01afb9977a102f4216.value", "rabbitmq_info.gauge.ctl_messages_reply_771a9b1bfc674a698e6ff56242561f83.value", "rabbitmq_info.gauge.ctl_messages_reply_7762f1c557f1497a93c50042ec6f6edb.value", "rabbitmq_info.gauge.ctl_messages_reply_7f0080ecb6b741c1ae6728a953896c10.value", "rabbitmq_info.gauge.ctl_messages_reply_84a19f4db62a4ce098f15e2db5dc0f02.value", "rabbitmq_info.gauge.ctl_messages_reply_91e0309c76c34c3198f9a0716621750d.value", "rabbitmq_info.gauge.ctl_messages_reply_973be4200d754146807f90d33fc311df.value", "rabbitmq_info.gauge.ctl_messages_reply_9aa8cb42adbf43ed83dcf5ce049c4742.value", "rabbitmq_info.gauge.ctl_messages_reply_abce43e4d9b441f999d5cca4e9cdbfa4.value", "rabbitmq_info.gauge.ctl_messages_reply_b6aff102b26c48efbf99328a2c7c0884.value", "rabbitmq_info.gauge.ctl_messages_reply_cfd2a9bfb7f144cfbdece5631a920fb8.value", "rabbitmq_info.gauge.ctl_messages_reply_d8013e8161a44966be5b78ea36ea5168.value", "rabbitmq_info.gauge.ctl_messages_reply_ea46f963d0a24754b609ad1476c2c18f.value", "rabbitmq_info.gauge.ctl_messages_reply_f0dbf1a492094fea85d1ec974efd3472.value", "rabbitmq_info.gauge.ctl_messages_reply_f5f9dccda65b4e3788346807f546f32c.value", "rabbitmq_info.gauge.ctl_messages_reply_f89e0feabf714cad810af29e6f34870b.value", "rabbitmq_info.gauge.ctl_messages_reply_f8ce7b3fc82c4ae8b4571ee490a8b74d.value", "rabbitmq_info.gauge.ctl_messages_reply_fed9064a054e4d64ba4f0b59932a3ec5.value", "rabbitmq_info.gauge.ctl_messages_scheduler.controller-node.value", "rabbitmq_info.gauge.ctl_messages_scheduler.host-4.value", "rabbitmq_info.gauge.ctl_messages_scheduler.test-controller-node.value", "rabbitmq_info.gauge.ctl_messages_scheduler.value", "rabbitmq_info.gauge.ctl_messages_scheduler.ws-controller1.value", "rabbitmq_info.gauge.ctl_messages_scheduler_fanout_f383cd5074c54d978a3c005f0134ed47.value", "rabbitmq_info.gauge.pmap_mapped.value", "rabbitmq_info.gauge.pmap_shared.value", "rabbitmq_info.gauge.pmap_used.value" ];
        //var metricsName = ["cpu.0.cpu.idle.value","cpu.0.cpu.interrupt.value"];
        return [200, metricsName, {}];
    });
    $httpBackend.whenPOST(/\.*\/monit.*\/([0-9]|[1-9][0-9])\/datapointtags$/).respond(function(method, url, data) {
        console.log(method, url, data);

        var tag = '{"queries":[{"results":[{"name":"cpu.0.cpu.idle.value","tags":{"cluster":["no_cluster_defined"],"host":["controller-node","host-1","host-2","host-4","host-5","network-node","ws-compute1","ws-compute2","ws-compute3","ws-controller-1","ws-controller1","ws-network-1","ws-network-node1","ws-network1"],"location":["China_Beijing_TsingHua"],"role":["OSROLE"]},"values":[]}]}]}';
        return [200, tag, {}];
    });
    $httpBackend.whenPOST(/\.*\/monit.*\/([0-9]|[1-9][0-9])\/datapoints$/).respond(function(method, url, data) {
        console.log(method, url, data);
        var temp = JSON.parse(data);
        var name = temp.metrics[0].name;
        var returnData = '{"queries":[{"sample_size":70,"results":[{"name":"'+name+'","group_by":[{"name":"type","type":"number"}],"tags":{"host":["compass"],"metric_name":["abc.123","cpu.0.cpu.idle.value","cpu.0.cpu.idle.valued","cpu.0.cpu.interrupt.value","cpu.0.cpu.nice.value","disk.sda1.disk_time.read","disk.sda3.disk_time.read","disk.sdb.disk_ops.read","interface.br-tun.if_packets.tx","interface.eth1.if_octets.tx","interface.ovs-system.if_errors.rx","interface.ovs-system.if_octets.tx","kairosdb.datastore.cassandra.key_query_time","kairosdb.datastore.write_size","kairosdb.http.query_time","kairosdb.jvm.free_memory","kairosdb.metric_counters","kairosdb.protocol.http_request_count","xyz.123"],"query_index":["1","2"],"request":["/datapoints/query"]},"values":[[1415644662297,2],[1415644936452,2],[1415649105761,2],[1415649133036,3],[1415649149375,2],[1415649394291,3],[1415649400565,2],[1415649410542,2],[1415649424551,2],[1415649428733,2],[1415649438466,13],[1415649444112,2],[1415649451616,1],[1415649455418,2],[1415649461539,7],[1415649466140,3],[1415649471111,2],[1415649480943,2],[1415649492421,8],[1415649501825,2],[1415649545118,2],[1415649554317,2],[1415649559818,2],[1415649566444,4],[1415649597100,2],[1415649602176,3],[1415649631102,2],[1415649645477,1],[1415649668532,2],[1415649682906,2],[1415649688626,2],[1415649694573,2],[1415649697620,2],[1415649701637,4],[1415649714586,3],[1415649720301,3],[1415649745416,4],[1415649768064,20],[1415649796993,17],[1415655678192,5],[1415655715682,5],[1415655781993,3],[1415656049377,2],[1415656060996,3],[1415656086790,2],[1415656309450,2],[1415656471533,2],[1415656607109,3],[1415656748677,2],[1415662600041,9],[1415662673534,2],[1415663014707,23],[1415663033765,2],[1415663042641,2],[1415663137052,2],[1415663188992,2],[1415664367333,2],[1415665535212,1],[1415665671592,2],[1415666048027,2],[1415666069368,2],[1415666086166,2],[1415666111794,3],[1415666135228,2],[1415666179974,2],[1415666287690,9],[1415666321824,2],[1415666341186,3],[1415666370086,2]]}]}]}';
        if (temp.end_relative) {
            returnData = '{"queries":[{"sample_size":70,"results":[{"name":"'+name+'","group_by":[{"name":"type","type":"number"}],"tags":{"host":["compass"],"metric_name":["abc.123","cpu.0.cpu.idle.value","cpu.0.cpu.idle.valued","cpu.0.cpu.interrupt.value","cpu.0.cpu.nice.value","disk.sda1.disk_time.read","disk.sda3.disk_time.read","disk.sdb.disk_ops.read","interface.br-tun.if_packets.tx","interface.eth1.if_octets.tx","interface.ovs-system.if_errors.rx","interface.ovs-system.if_octets.tx","kairosdb.datastore.cassandra.key_query_time","kairosdb.datastore.write_size","kairosdb.http.query_time","kairosdb.jvm.free_memory","kairosdb.metric_counters","kairosdb.protocol.http_request_count","xyz.123"],"query_index":["1","2"],"request":["/datapoints/query"]},"values":[[1415644662297,2],[1415644936452,2],[1415649105761,2],[1415649133036,3],[1415649149375,2],[1415649394291,3],[1415649400565,2],[1415649410542,2],[1415649424551,2],[1415649428733,2],[1415649438466,13],[1415649444112,2],[1415649451616,1],[1415649455418,2],[1415649461539,7],[1415649466140,3],[1415649471111,2],[1415649480943,2],[1415649492421,8],[1415649501825,2],[1415649545118,2],[1415649554317,2],[1415649559818,2],[1415649566444,4],[1415649597100,2],[1415649602176,3],[1415649631102,2],[1415649645477,1],[1415649668532,2],[1415649682906,2],[1415649688626,2],[1415649694573,2],[1415649697620,2],[1415649701637,4],[1415649714586,3],[1415649720301,3],[1415649745416,4],[1415649768064,20],[1415649796993,17],[1415655678192,5],[1415655715682,5],[1415655781993,3],[1415656049377,2],[1415656060996,3],[1415656086790,2],[1415656309450,2],[1415656471533,2],[1415656607109,3],[1415656748677,2],[1415662600041,9],[1415662673534,2],[1415663014707,23],[1415663033765,2],[1415663042641,2],[1415663137052,2],[1415663188992,2],[1415664367333,2],[1415665535212,1],[1415665671592,2],[1415666048027,2],[1415666069368,2],[1415666086166,2],[1415666111794,3],[1415666135228,2],[1415666179974,2],[1415666287690,9],[1415666321824,2],[1415666341186,3],[1415666370086,100]]}]}]}';
        }
        return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\.*\/monit.*clusters\/([0-9]|[1-9][0-9])\/metrics\/.*/).respond(function(method, url, data) {
        console.log(method, url, data);
        var name = url.split("metrics")[1].substr(1);
        var metricData;
        if (name == "cpu.0.cpu.idle.value") {

            metricData = {
                "key": "cpu.0.cpu.idle.value",
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
            };
        } else if (name == "cpu.0.cpu.interrupt.value") {
            metricData = {
                "key": "cpu.0.cpu.interrupt.value",
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
            };
        } else if (name == "cpu.0.cpu.nice.value") {
            metricData = {

                "key": "cpu.0.cpu.nice.value",
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
            };
        } else {
            metricData = {
                "key": name,
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
            };
        }
        return [200, metricData, {}];
    });
});
});
