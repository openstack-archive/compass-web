var compassAppDev = angular.module('compassAppDev', ['compass', 'ngMockE2E']);

compassAppDev.run(function($httpBackend, settings, $http) {

    // Allow all calls not to the API to pass through normally
    $httpBackend.whenGET(new RegExp('src\/.*')).passThrough();
    $httpBackend.whenGET(new RegExp('data\/.*')).passThrough();

    $httpBackend.whenGET(settings.apiUrlBase + '/adapters').respond(function(method, url, data) {
        console.log(method, url);
        var adapters = [{
            "id": 1,
            "name": "openstack",
            "display": "OpenStack",
            "os_installer": "cobbler",
            "package_installer": "chef",
            "roles": ["compute", "controller", "metering", "network", "storage"],
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
            "roles": ["compute", "controller", "network", "storage"],
            "compatible_os": [{
                "name": "CentOs",
                "os_id": 1
            }]
        }];
        return [200, adapters, {}];
    });

    $httpBackend.whenGET(settings.apiUrlBase + '/servers').respond(function(method, url, data) {
        console.log(method, url);
        var servers = [{
            "id": 1,
            "Host MAC": "28.e5.ee.47.14.92",
            "Switch IP": "172.29.8.40",
            "Vlan": "1",
            "Port": "1",
            "Hostname": "sv-1",
            "Cluster": ["cluster1", "cluster2"],
            "OS": "CentOS",
            "Target System": ["CentOS", "OpenStack"],
            "State": "Installing"
        }, {
            "id": 2,
            "Host MAC": "28.e5.ee.47.a2.93",
            "Switch IP": "172.29.8.40",
            "Vlan": "2",
            "Port": "2",
            "Hostname": "sv-2",
            "Cluster": ["cluster1"],
            "OS": "CentOS",
            "Target System": ["CentOS"],
            "State": "Successful"
        }];
        return [200, servers, {}];
    });

    $httpBackend.whenPOST(settings.apiUrlBase + '/clusters').respond(function(method, url, data) {
        console.log(method, url, data);
        var mockResponse = {
            "id": 1,
            "name": "cluster_01",
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

    $httpBackend.whenGET(settings.apiUrlBase + '/clusters').respond(function(method, url, data) {
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
            "create_at": "2014-4-25 12:00:00",
            "updated_at": "2014-4-26 13:00:00",
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

    $httpBackend.whenPUT(settings.apiUrlBase + '/clusters/1/config').respond(function(method, url, data) {
        console.log(method, url);

        return [200, {}, {}];
    });
});
