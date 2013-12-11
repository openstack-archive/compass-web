// map fixtures for this application

steal("jquery/dom/fixture", "jquery/lang/json", function(){
    var self = this;
    self.switchIdIndex = 1;

    self.servers_data = [];

    self.percentage = 0.0;

    self.port = 0;


    $.fixture('POST /api/switches',  function(original, settings, headers) {
        var manage_ip = JSON.parse(original.data).switch.ip;
        var switchId = 1;

        if(manage_ip == "172.29.8.40") {
            switchId = 1;
        }
        else if(manage_ip == "172.29.8.41"){
            switchId = 2;
        }

        var returnData = {
            "status": "accepted",
            "switch": {
                "state": "not_reached",
                "link": {
                    "href": "/switches/"+switchId+"/", 
                    "rel": "self"
                },
                "id": switchId
            }
        };

        var duplicateErr = {
            "status": "duplicate",
            "message": "duplicate IP address",
            "failedSwitch": 2
        };
        //var xhr = {responseText: JSON.stringify(duplicateErr), status: 409};

        if(switchId == 1) {
            return [202, "accepted", returnData, {} ];
            //return [202, returnData ];
        }
        else if(switchId == 2) {
            return [409, duplicateErr];
        }
        
    });

    $.fixture('PUT /api/switches/{id}', function(original, settings, headers) {
        var switchId = settings.url.substring(14,15);

        var returnData = {
            "status": "accepted",
            "switch": {
                "state": "not_reached",
                "link": {
                    "href": "/switches/"+switchId+"/", 
                    "rel": "self"
                },
                "id": switchId
            }
        };

        return [202, "accepted", returnData, {} ];

    });

    $.fixture('GET /api/switches/{id}', function(original, settings, headers) {
        var switchId = settings.url.substring(14,15);

        var returnData = {
            "status": "OK",
            "switch": {
                "state": switchId == 10 ? "not_reached" : "under_monitoring",
                "link": {
                    "href": settings.url, 
                    "rel": "self"
                },
                "id": switchId
            }
        };
        return returnData;
    });

    $.fixture('GET /api/machines', function(original, settings, headers) {
        var switchId = settings.url.substring(23);
        steal.dev.log("get machines switchId", switchId);
        if(switchId == 1) {
            var returnData = {
                "status": "OK",
                "machines": [
                    {
                        "mac": "28:6e:31:47:c8:6c", 
                        "vlan": 1, 
                        "link": {
                            "href": "/api/machines/10", 
                            "rel": "self"
                        }, 
                        "id": 10, 
                        "port": 1,
                        "switch_ip": "172.29.8.40"
                    }, 
                    {
                        "mac": "28:6e:55:47:52:e3", 
                        "vlan": 1, 
                        "link": {
                            "href": "/api/machines/20", 
                            "rel": "self"
                        }, 
                        "id": 20, 
                        "port": 2,
                        "switch_ip": "172.29.8.40"
                    }, 
                    {
                        "mac": "28:6e:d4:47:33:5f", 
                        "vlan": 1, 
                        "link": {
                            "href": "/api/machines/30", 
                            "rel": "self"
                        }, 
                        "id": 30, 
                        "port": 3,
                        "switch_ip": "172.29.8.40"
                    },
                    {
                        "mac": "28:6e:9b:47:51:aa", 
                        "vlan": 1, 
                        "link": {
                            "href": "/api/machines/40", 
                            "rel": "self"
                        }, 
                        "id": 40, 
                        "port": 4,
                        "switch_ip": "172.29.8.40"
                    }                                          
                ]
            };
            return returnData;
        }
        else if(switchId == 2) {
            var returnData = {
                "status": "OK",
                "machines": [
                    {
                        "mac": "28:e5:ee:47:14:92", 
                        "vlan": 2, 
                        "link": {
                            "href": "/api/machines/50", 
                            "rel": "self"
                        }, 
                        "id": 50, 
                        "port": 1,
                        "switch_ip": "172.29.8.41"
                    }, 
                    {
                        "mac": "28:61:15:c2:aa:4a", 
                        "vlan": 2, 
                        "link": {
                            "href": "/api/machines/60", 
                            "rel": "self"
                        }, 
                        "id": 60, 
                        "port": 2,
                        "switch_ip": "172.29.8.41"
                    },
                    {
                        "mac": "28:27:f9:c2:51:4a", 
                        "vlan": 2, 
                        "link": {
                            "href": "/api/machines/70", 
                            "rel": "self"
                        }, 
                        "id": 70, 
                        "port": 3,
                        "switch_ip": "172.29.8.41"
                    }                                           
                ]
            };
            return returnData;            
        }
    });


    $.fixture('POST /api/clusters', function(data) {
        var returnData = {
            "status": "OK",
            "cluster": {
                "id": "123",
                "name": "clustername",
                "link": {
                    "href": "/api/clusters/123",
                    "rel": "self"
                }
            }
        };
        return returnData;
    });


    $.fixture('POST /api/clusters/{id}/action',  function(original, settings, headers) { 
        var hostIds = JSON.parse(original.data).addHosts;
        if(!hostIds) {
            hostIds = JSON.parse(original.data).replaceAllHosts;
        }
        if(hostIds) { // for addHost and replaceAllHost
            steal.dev.log("fixture cluster action hostIds : ", hostIds);
            var returnData = {
                "status": "OK",
                "clusterHosts": []
            };

            for(var i = 0; i<hostIds.length; i++) {
                var tmp = {
                    "machine_id": hostIds[i],
                    "id": hostIds[i]*10
                }

                returnData.clusterHosts.push(tmp);
            }
            return returnData;            
        }

        else { // for deploy
            var returnData = {
                "status": "accepted",
                "deployment": "/api/progress/cluster/123"
            }
            return [202, "accepted", returnData, {} ];

        }

    });


    $.fixture('PUT /api/clusters/{id}/security', function(data) {
        self.security_data = data.data;
        var returnData = {
            "status": "OK"
        };
        return returnData;
    });


    $.fixture('PUT /api/clusters/{id}/networking', function(original, settings, headers) {
        console.log("networking original: ", original);
        var returnData = {
            "status": "OK"
        };
        return returnData;
    });


    $.fixture('PUT /api/clusterhosts/{id}/config',  function(original, settings, headers) {
        console.log(settings);
        var returnData = {
            "status": "OK"
        };
        return returnData;
    });


    $.fixture('PUT /api/clusters/{id}/partition', function(data) {
        self.partition_data = data;
        console.log("new partition api: ", self.partition_data);
        var returnData = {
            "status": "OK"
        };
        return returnData;
    });

/*
    // used on Install Review Page
    $.fixture('GET /api/logicpartition', function() {
        return self.partition_data;
    });

    // used on Install Review Page
    $.fixture('GET /api/security', function() {
        return self.security_data;
    });

    // used on Install Review Page
    $.fixture('GET /api/networking', function(data) {
        //console.log(data);
        return self.networking_data;
    });
*/

    $.fixture('POST /api/triggerinstall/', function(data) {
        console.log(data);
        var returnData = {
            "status": "OK",
            "_data": {},
            "type": "triggerinstall"
        };
        return returnData;
    });  


    $.fixture('GET /api/clusterhosts/{id}/progress', function(original, settings, headers) {
        self.percentage += 0.1;
        if(self.percentage > 1)
            self.percentage = 1;

        var message = "Configuring Net Management";
        if(self.percentage < 0.3) {
            message = "Configuring Net Management";
        }
        else if(self.percentage < 0.45){
            message = "Installing OpenStack";
        }
        else if(self.percentage < 0.65) {
            message = "Configuring Core Virtualization";
        }
        else if(self.percentage < 0.80) {
            message = "Finalizing OpenStack Installation";
        }
        else if(self.percentage < 1.0) {
            message = "Configuring API Database";
        }
        else {
            message = "Completed!";
        }

        var id = original.url.substring(18, 21);
        console.log(id);
        console.log(original);

        var res = {
            "status": "OK",
            "progress": {
                "id": id,
                "state": "",
                "hostname": "hostname",
                "percentage": self.percentage,
                "message": message,
                "severity": "INFO" // INFO, WARNING, ERROR
            },
            "type": "progress"

        };

        return res;
    });

    $.fixture('GET /api/clusters/{id}/progress', function(original, settings, headers) {
        var returnData = {
            "status": "OK",
            "progress": {
                "state": "",
                "percentage": self.percentage,
                "messages": [
                    "Configuring Net Management",
                    "Configuring Core Virtualization"
                ],
                "severity": "INFO" // INFO, WARNING, ERROR
            }
        };
        return returnData;
    });

    $.fixture('GET /api/dashboardlinks', function(original, settings, headers) {
        console.log("original: ", original);
        console.log("settings: ", settings);

        var res = {
            "status": "OK",
            "type": "clusterlinks",
            "clusterlinks": {
                "os-single-controller": "http://10.145.88.232"
            }
        };
        return res;
    });

})
