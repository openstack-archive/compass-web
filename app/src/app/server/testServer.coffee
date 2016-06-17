define(['angular','angularMocks'
], (ng)-> 
    'use strict';
    # class Server 
    #     constructor: (@httpBackend, @settings, @$http) ->


    ng.module('compass.testServer', ['ngMockE2E'])
       .constant('settings',{
         apiUrlBase: '/api'
         metadataUrlBase: 'data'
         monitoringUrlBase: '/monit/api/v1'
        })
        .run(($httpBackend, settings, $http) ->

            $httpBackend.whenGET(new RegExp('src\/.*')).passThrough()
            $httpBackend.whenGET(new RegExp('data\/.*')).passThrough()


            $httpBackend.whenPOST(settings.apiUrlBase + '/users/login').respond( (method, url, data) ->
                console.log(method, url, data)
                user = "name": "huawei"

                return [200, user, {}]; 
            )

            $httpBackend.whenGET(/\.*\/clusters$/).respond((method, url, data) ->
                console.log(method, url)
                clusters = [{
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
            )
            
            $httpBackend.whenGET(/\.*\/clusters\/[1-9][0-9]*\/state/).respond((method, url, data) ->
                console.log(method, url, data);
                states = ["UNINITIALIZED", "INITIALIZED", "INSTALLING", "SUCCESSFUL", "ERROR"];
                progressData = {
                    "id": 1,
                    "state": states[Math.floor((Math.random() * 5))],
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
            )
        )
)