angular.module('compass.services', [])

// stateService is used for dynamically add/edit state
.service('stateService', ['$state',
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

// dataService is used for http calls
.service('dataService', ['$http', 'settings',
    function($http, settings) {

        this.login = function(user) {
            return $http.post(settings.apiUrlBase + '/users/login', angular.toJson(user));
        };

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


        this.getMetricsTreeNodes = function() {
            return $http.get(settings.metadataUrlBase + '/metrics_tree.json');
        };

        this.monitorHosts = function() {
            // /monit/api/hosts
            return $http.get(settings.monitoringUrlBase + '/hosts');
/*
            return $http.jsonp(settings.monitoringUrlBase + '/hosts' + settings.jsonpSuffix);
            var url = settings.monitoringUrlBase + '/hosts' ;
            $http.jsonp(url).success(function (data, status, headers, config) {
                console.log(data);
		return data;
            }).error(function (data, status, headers, config) {
                //this always gets called
                console.log(status);
                deferred.reject(status);
		return 'undefined';
            });
*/
        };

        this.monitorRsHostGroupMetric = function(groupName, metricName) {
            // /monit/api/rshostgroup/<hostgroup>/metric/<metricname>
            return $http.get(settings.monitoringUrlBase + '/rshostgroup/' + groupName + '/metric/' + metricName);
        };

        this.monitorAlerts = function() {
            // /monit/api/alarms
            //return $http.get(settings.monitoringUrlBase + '/alarms');
            var url = settings.monitoringUrlBase + '/alarms' ;
            return $http.get(settings.monitoringUrlBase + '/hosts/');
        };

        this.monitorTest = function() {
            return $http.get(settings.monitoringUrlBase + '/');
        };

        this.monitorProxy = function(px_url) {
            // /monit/api/proxy/<path:url>
            return $http.get(settings.monitoringUrlBase + '/proxy/' + px_url);
        };

        this.monitorMetrics = function() {
            // /monit/api/metrics
            return $http.get(settings.monitoringUrlBase + '/metrics');
        };

        this.monitorMetricsTree = function() {
            // /monit/api/metricstree
            return $http.get(settings.monitoringUrlBase + '/metricstree');
        };

        this.monitorHostMetric = function(hostName, metricName) {
            // /monit/api/host/<hostname>/metric/<metricname>
            return $http.get(settings.monitoringUrlBase + '/host/' + hostName + '/metric/' + metricName);
        };

        this.monitorHostGroupMetric = function(groupName, metricName) {
            // /monit/api/hostgroup/<hostgroup>/metric/<metricname>
            return $http.get(settings.monitoringUrlBase + '/hostgroup/' + groupName + '/metric/' + metricName);
        };

        this.monitorRsHostMetric = function(hostName, metricName) {
            // /monit/api/rshost/<hostname>/metric/<metricname>
            var url = settings.monitoringUrlBase + '/alarms');
        };

        this.monitorRsHostGroupMetric = function(groupName, metricName) {
            // /monit/api/rshostgroup/<hostgroup>/metric/<metricname>
            return $http.get(settings.monitoringUrlBase + '/rshostgroup/' + groupName + '/metric/' + metricName);
        };

        this.monitorAlarms = function() {
            // /monit/api/alarms
            return  $http.get(settings.monitoringUrlBase + '/alarms');
/*
            var url = settings.monitoringUrlBase + '/alarms' ;
            $http.get(url).success(function (data, status, headers, config) {
                console.log(data);
		return data;
            }).error(function (data, status, headers, config) {
                //this always gets called
                console.log(status);
                //deferred.reject(status);
		return 'undefined';
            });
*/

        };

        this.monitorServices = function() {
            // /monit/api/services
            return $http.get(settings.monitoringUrlBase + '/services');
        };

        this.monitorTopology = function() {
            // /monit/api/topologies/1
            return $http.get(settings.monitoringUrlBase + '/topologies/1');
        };

        this.monitorEvents = function() {
            // /monit/api/events
            return $http.get(settings.monitoringUrlBase + '/events');
        };

        this.monitorEvents = function(eventID) {
            // /monit/api/event/<eventId>
            return $http.get(settings.monitoringUrlBase + '/event' + eventID);
        };

        this.monitorOverview = function() {
            // /monit/api/overview
            return $http.get(settings.monitoringUrlBase + '/overview');
        };

        this.monitorUsers = function() {
            // /monit/api/users
            return $http.get(settings.monitoringUrlBase + '/users');
        };

        this.monitorEvents = function(userName) {
            // /monit/api/user/<username>
            return $http.get(settings.monitoringUrlBase + '/user' + userName);
        };

    }
])

.service('sortingService', function() {
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
})


.factory('wizardFactory', [

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

        return wizard;
    }
])

.service('authService', ['$http', 'dataService',
    function($http, dataService) {
        this.isAuthenticated = false;

        this.setLogin = function(isLogin) {
            this.isAuthenticated = isLogin;
        }

        this.login = function(user) {
            return dataService.login(user);
        };

        this.logout = function() {
            this.isAuthenticated = false;
        };
    }
])
