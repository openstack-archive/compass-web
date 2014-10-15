define(['angular'], function() {
    var servicesModule = angular.module('compass.services', []);
    // stateService is used for dynamically add/edit state
    /*    .service('stateService', ['$state',
        function($state) {
            this.addStates = function(pendingStates) {
                var existingStates = $state.get(); // get all the current existing states       
                var alreadyExist = false; // flag - if the pending state is already in the states       

                angular.forEach(pendingStates, function(pst) {
                    angular.forEach(existingStates, function(est) {
                        if (pst.name == est.name) {
                            alreadyExist = true;
                        }
                    });
                    if (!alreadyExist) {
                        app.stateProvider.state(pst.name, {
                            url: pst.url,
                            //controller: pst.controller,
                            templateUrl: 'src/app/monitoring/' + pst.url.substring(1) + '.tpl.html'
                        });
                    }
                    alreadyExist = false;
                });
            }
        }
    ])
*/
    // dataService is used for http calls
    servicesModule.service('dataService', ['$http', 'settings', //settings is global constant
        function($http, settings) {

            this.login = function(user) {
                return $http.post(settings.apiUrlBase + '/users/login', angular.toJson(user));
            };

            this.logout = function(){
                return $http.post(settings.apiUrlBase + '/users/logout', null);
            }

            this.getWizardPreConfig = function() {
                return $http.get(settings.metadataUrlBase + '/config.json');
            };

            this.getWizardSteps = function() {
                return $http.get(settings.metadataUrlBase + '/wizard_steps.json');
            };

            this.getAdapterConfig = function() {
                return $http.get(settings.metadataUrlBase + '/adapter_config');
            };

            this.getAllMachineHosts = function(os) {
                if (os) {
                    return $http.get(settings.apiUrlBase + '/switches-machines-hosts?os_id=' + os);
                } else {
                    return $http.get(settings.apiUrlBase + '/switches-machines-hosts');
                }
            };

            this.getSwitches = function() {
                return $http.get(settings.apiUrlBase + '/switches');
            };

            this.getSwitchById = function(id) {
                return $http.get(settings.apiUrlBase + '/switches/' + id);
            };

            this.postSwitches = function(sw) {
                return $http.post(settings.apiUrlBase + '/switches', angular.toJson(sw));
            };

            this.putSwitches = function(id, sw) {
                return $http.put(settings.apiUrlBase + '/switches/' + id, angular.toJson(sw));
            };

            /*
        this.postSwitchFilters = function(filters) {
            return $http.post(settings.apiUrlBase + '/switch-filters', angular.toJson(filters));
        };
        */
            this.putSwitchFilters = function(id, filters) {
                return $http.put(settings.apiUrlBase + '/switch-filters/' + id, angular.toJson(filters));
            };

            this.postSwitchAction = function(id, action) {
                return $http.post(settings.apiUrlBase + '/switches/' + id + '/action', angular.toJson(action));
            };

            this.getSwitchMachines = function(id) {
                return $http.get(settings.apiUrlBase + '/switches/' + id + '/machines');
            };

            this.getServerColumns = function() {
                return $http.get(settings.metadataUrlBase + '/machine_host_columns.json');
            };

            this.getMonitoringNav = function() {
                return $http.get(settings.metadataUrlBase + '/monitoring_nav.json');
            };

            this.getAdapters = function() {
                return $http.get(settings.apiUrlBase + '/adapters');
            };

            this.getAdapter = function(id) {
                return $http.get(settings.apiUrlBase + '/adapters/' + id);
            };

            this.createCluster = function(cluster) {
                return $http.post(settings.apiUrlBase + '/clusters', angular.toJson(cluster));
            };

            this.createUser = function(newUser) {
                return $http.post(settings.apiUrlBase + '/users', angular.toJson(newUser));
            };

            this.getUserSetting = function() {
                return $http.get(settings.apiUrlBase + '/users');
            };

            this.getUserLog = function() {
                return $http.get(settings.apiUrlBase + '/users/logs');
            }
            this.getClusters = function() {
                return $http.get(settings.apiUrlBase + '/clusters');
            };

            this.getClusterById = function(id) {
                return $http.get(settings.apiUrlBase + '/clusters/' + id);
            };

            this.getClusterProgress = function(id) {
                return $http.get(settings.apiUrlBase + '/clusters/' + id + '/state');
            };

            this.getClusterConfig = function(id) {
                return $http.get(settings.apiUrlBase + '/clusters/' + id + '/config');
            };

            this.updateClusterConfig = function(id, config) {
                return $http.put(settings.apiUrlBase + '/clusters/' + id + '/config', angular.toJson(config));
            };

            this.getClusterMetadata = function(id) {
                return $http.get(settings.apiUrlBase + '/clusters/' + id + '/metadata');
            };

            this.getSubnetConfig = function() {
                return $http.get(settings.apiUrlBase + '/subnets');
            };

            this.postSubnetConfig = function(subnet_config) {
                return $http.post(settings.apiUrlBase + '/subnets', angular.toJson(subnet_config));
            };

            this.putSubnetConfig = function(id, subnet_config) {
                return $http.put(settings.apiUrlBase + '/subnets/' + id, angular.toJson(subnet_config));
            };

            this.deleteSubnet = function(id) {
                return $http.delete(settings.apiUrlBase + '/subnets/' + id);
            };

            // keep routing table for later use
            /*
        this.postRoutingTable = function(id, routing_table) {
            return $http.post(settings.apiUrlBase + '/clusters/' + id + '/routing-table', angular.toJson(routing_table));
        };

        this.putRoutingTable = function(id, routingId, routing_table) {
            return $http.put(settings.apiUrlBase + '/clusters/' + id + '/routing-table/' + routingId, angular.toJson(routing_table));
        };
        */

            this.getTimezones = function() {
                return $http.get(settings.metadataUrlBase + '/timezone.json');
            };

            this.postClusterActions = function(id, actions) {
                return $http.post(settings.apiUrlBase + '/clusters/' + id + '/action', angular.toJson(actions));
            };

            this.putHost = function(id, config) {
                return $http.put(settings.apiUrlBase + '/hosts/' + id, angular.toJson(config));
            };

            this.postHostNetwork = function(id, network) {
                return $http.post(settings.apiUrlBase + '/hosts/' + id + '/networks', angular.toJson(network));
            };

            this.putHostNetwork = function(id, networkId, network) {
                return $http.put(settings.apiUrlBase + '/hosts/' + id + '/networks/' + networkId, angular.toJson(network));
            };

            this.getClusterHosts = function(clusterId, hostId) {
                return $http.get(settings.apiUrlBase + '/clusters/' + clusterId + '/hosts');
            };

            this.updateClusterHost = function(clusterId, hostId, data) {
                return $http.put(settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId, angular.toJson(data));
            };

            this.updateClusterHostConfig = function(clusterId, hostId, config) {
                return $http.put(settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId + '/config', angular.toJson(config));
            };

            this.getClusterHostProgress = function(clusterId, hostId) {
                return $http.get(settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId + '/state');
            };

            this.deleteHost = function(id) {
                return $http.delete(settings.apiUrlBase + '/hosts/' + id);
            };
            /*
        this.deleteHost = function(clusterId, hostId) {
            return $http.delete(settings.apiUrlBase + '/clusters/' + clusterId + '/hosts/' + hostId);
        };
*/

            this.monitorHosts = function(id) {
                // This differ from the main hosts API because it has status/alert information
                // /monit/api/cluster/<id>/hosts
                return $http.get(settings.monitoringUrlBase + '/clusters/' + id + '/hosts');
            };

            /*      this.monitorProxy = function(px_url) {
            // Leave for now may delete later
            // /monit/api/proxy/<path:url>
            return $http.get(settings.monitoringUrlBase + '/proxy/' + px_url);
        };
*/
            /*this.monitorMetrics = function() {
                // This returns a flat json list of metrics currently or historically have been collected
                // /monit/api/metrics
                return $http.get(settings.monitoringUrlBase + '/metrics');
            };*/

            this.monitorMetricsName = function() {

                return $http.get(settings.monitoringUrlBase + '/metricnames');
            };

            this.monitorMetricsTree = function() {
                // This will also order the metrics in a tree
                // /monit/api/metricstree
                return $http.get(settings.monitoringUrlBase + '/metrictree');
            };

            this.monitorHostMetric = function(clusterId, hostName, metricName) {
                // Returns a single metric for a cluster host
                // /monit/api/cluster/<id>/host/<hostname>/metric/<metricname>
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/hosts/' + hostName + '/metric/' + metricName);
            };

            this.monitorHostGroupMetric = function(clusterId, groupName, metricName) {
                // Returns a single metric for a cluster hostgroup
                // /monit/api/cluster/<id>/hostgroup/<hostgroup>/metric/<metricname>
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/hostgroups/' + groupName + '/metric/' + metricName);
            };

            this.monitorClusterMetric = function(clusterId, metricName) {
                //  Returns a single metric for a cluster hostgroup
                // /monit/api/cluster/<id>/metric/<metricname>
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/metrics/' + metricName);
            };

            this.monitorAlarms = function(clusterId) {
                // Returns all alarm data for a cluster host
                // /monit/api/cluster/<id>/alarms
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/alarms');
            };

            this.monitorEvents = function(id) {
                // Reurns all event data for a cluster host
                // /monit/api/cluster/<id>/events
                return $http.get(settings.monitoringUrlBase + '/clusters/' + id + '/events');
            };

            this.monitorTopology = function(clusterId) {
                // Returns a nested json of networks and servers
                // /monit/api/cluster/<id>/topology
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/topology');
            };

            this.monitorServiceTopology = function(clusterId) {
                // Returns a nested json of servers, roles and metrics
                // /monit/api/cluster/<id>/servicetopology
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/servicetopology');
            };

            this.monitorOverview = function(clusterId) {
                // Returns a nested json  for constructing the overview page
                // /monit/api/cluster/<id>/overview
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/overview');
            };

            this.monitorUsers = function(clusterId) {
                // Returns a flat json list of all cluster users
                // /monit/api/cluster/<id>/users
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/users');
            };

            this.monitorUser = function(clusterId, userName) {
                // Returns json information on a particliar user
                // /monit/api/cluster/<id>/user/<username>
                return $http.get(settings.monitoringUrlBase + '/clusters/' + clusterId + '/user' + userName);
            };
        }
    ]);

    servicesModule.service('sortingService', function() {
        this.ipAddressPre = function(a) {
            var m = a.split("."),
                x = "";

            for (var i = 0; i < m.length; i++) {
                var item = m[i];
                if (item.length == 1) {
                    x += "00" + item;
                } else if (item.length == 2) {
                    x += "0" + item;
                } else {
                    x += item;
                }
            }
            return x;
        };
    });


    servicesModule.factory('wizardFactory', [

        function() {
            var wizard = {};
            wizard.init = function() {
                wizard.cluster = {};
                wizard.steps = [];
                wizard.commit = {};
                wizard.servers = [];
                wizard.allServers = [];
                //wizard.adapter = {}; //
                wizard.generalConfig = {};
                wizard.subnetworks = [];
                wizard.routingtable = [];
                wizard.generalConfig = {};
                wizard.interfaces = {};
                wizard.partition = {};
                wizard.server_credentials = {};
                wizard.service_credentials = {};
                wizard.console_credentials = {};
                wizard.network_mapping = {};
                wizard.ceph_config = {};
            };

            wizard.init();

            wizard.preConfig = function(config) {
                //wizard.setClusterInfo(config.cluster);
                wizard.setInterfaces(config.interface);
                wizard.setGeneralConfig(config.general);
                wizard.setPartition(config.partition);
                wizard.setServerCredentials(config.server_credentials);
                wizard.setServiceCredentials(config.service_credentials);
                wizard.setConsoleCredentials(config.console_credentials);
                wizard.setNetworkMapping(config.network_mapping);
                if (config.ceph_config) {
                    wizard.setCephConfig(config.ceph_config);
                }
            };

            wizard.setClusterInfo = function(cluster) {
                wizard.cluster = cluster;
            };

            wizard.getClusterInfo = function() {
                return angular.copy(wizard.cluster);
            };

            wizard.setSteps = function(steps) {
                wizard.steps = steps;
            };

            wizard.getSteps = function() {
                return angular.copy(wizard.steps);
            };

            wizard.setCommitState = function(commitState) {
                wizard.commit = commitState;
            };

            wizard.getCommitState = function() {
                return wizard.commit;
            };

            wizard.setAllMachinesHost = function(server) {
                wizard.allServers = server;
            };

            wizard.getAllMachinesHost = function() {
                return angular.copy(wizard.allServers);
            };

            wizard.setServers = function(servers) {
                wizard.servers = servers;
            };

            wizard.getServers = function() {
                return angular.copy(wizard.servers);
            };
            /*
            wizard.setAdapter = function(adapter) { ////
                wizard.adapter = adapter;
            };

            wizard.getAdapter = function() { /////
                return angular.copy(wizard.adapter);
            };
            */
            wizard.setGeneralConfig = function(config) {
                wizard.generalConfig = config;
            };

            wizard.getGeneralConfig = function() {
                return angular.copy(wizard.generalConfig);
            };

            wizard.setSubnetworks = function(subnetworks) {
                wizard.subnetworks = subnetworks;
            };

            wizard.getSubnetworks = function() {
                return angular.copy(wizard.subnetworks);
            };

            // keey routing table for later use
            /*
            wizard.setRoutingTable = function(routingTb) {
                wizard.routingtable = routingTb;
            };

            wizard.getRoutingTable = function() {
                return wizard.routingtable;
            };
            */

            wizard.setInterfaces = function(interfaces) {
                wizard.interfaces = interfaces;
            };

            wizard.getInterfaces = function() {
                return angular.copy(wizard.interfaces);
            };

            wizard.setPartition = function(partition) {
                wizard.partition = partition;
            };

            wizard.getPartition = function() {
                return angular.copy(wizard.partition);
            };

            wizard.setServerCredentials = function(credentials) {
                wizard.server_credentials = credentials;
            };

            wizard.getServerCredentials = function() {
                return angular.copy(wizard.server_credentials);
            }
            wizard.setServiceCredentials = function(credentials) {
                wizard.service_credentials = credentials;
            };

            wizard.getServiceCredentials = function() {
                return angular.copy(wizard.service_credentials);
            };

            wizard.setConsoleCredentials = function(credentials) {
                wizard.console_credentials = credentials;
            };

            wizard.getConsoleCredentials = function() {
                return angular.copy(wizard.console_credentials);
            };

            wizard.setNetworkMapping = function(mapping) {
                wizard.network_mapping = mapping;
            };

            wizard.getNetworkMapping = function() {
                return angular.copy(wizard.network_mapping);
            };

            wizard.setCephConfig = function(cephConfig) {
                wizard.ceph_config = cephConfig;
            };

            wizard.getCephConfig = function() {
                return angular.copy(wizard.ceph_config);
            };

            return wizard;
        }
    ]);

    servicesModule.service('authService', ['$http', 'dataService',
        function($http, dataService) {
            this.isAuthenticated = true;

            this.setLogin = function(isLogin) {
                this.isAuthenticated = isLogin;
            }

            this.login = function(user) {
                return dataService.login(user);
            };

            this.logout = function() {
                 //this.isAuthenticated = false;
                 return dataService.logout();
             };
        }
    ]);
    servicesModule.factory('authenticationInterceptor', ['$q', '$location',
        function($q, $location) {
            return {
                response: function(response) {
                    return response;
                },
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        console.log("Response Error 401", rejection);
                        $location.path('/login');
                    }

                    return $q.reject(rejection);
                }
            }
        }
    ]);

    servicesModule.service('rememberMe', function() {
        this.setCookies = function(key, value, exdays, remember) {
            if (remember) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = key + "=" + value + "; " + expires;
            } else {
                document.cookie = key + "=" + value;
            }

        };

        this.getCookie = function(key) {
            var name = key + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);

            }
            return "";
        };
    });
})
