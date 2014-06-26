var app = angular.module('compass', [
    'compass.topnav',
    'compass.wizard',
    'compass.cluster',
    'compass.clusterlist',
    'compass.server',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'compassAppDev'
]);

app.constant('settings', {
    apiUrlBase: '/api/v2.0',
    metadataUrlBase: 'data'
});

app.config(function($stateProvider, $urlRouterProvider) {
    app.stateProvider = $stateProvider;
    $urlRouterProvider.otherwise('/clusterlist');
});

// stateService is used for dynamically add/edit state
app.service('stateService', ['$state',
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
                        templateUrl: 'src/app/cluster/cluster-' + pst.url.substring(1) + '.tpl.html'
                    });
                }
                alreadyExist = false;
            });
        }
    }
]);

app.service('dataService', ['$http', 'settings',
    function($http, settings) {

        this.getWizardSteps = function() {
            return $http.get(settings.metadataUrlBase + '/wizard_steps.json');
        };

        this.getAdapterConfig = function() {
            return $http.get(settings.metadataUrlBase + '/adapter_config');
        };

        this.getServers = function() {
            return $http.get(settings.apiUrlBase + '/servers');
        };

        this.getServerColumns = function() {
            return $http.get(settings.metadataUrlBase + '/machine_host_columns.json');
        }

        this.getMonitoringNav = function() {
            return $http.get(settings.metadataUrlBase + '/monitoring_nav.json');
        };

        this.getAdapters = function() {
            return $http.get(settings.apiUrlBase + '/adapters');
        };

        this.createCluster = function(cluster) {
            return $http.post(settings.apiUrlBase + '/clusters', angular.toJson(cluster));
        };

        this.getClusters = function() {
            return $http.get(settings.apiUrlBase + '/clusters');
        };

        this.updateClusterConfig = function(id, config) {
            return $http.put(settings.apiUrlBase + '/clusters/' + id + '/config', angular.toJson(config));
        };

        this.getClusterSubnetConfig = function(id) {
            return $http.get(settings.apiUrlBase + '/clusters/' + id + '/subnet-config');
        };

        this.postClusterSubnetConfig = function(id, subnet_config) {
            return $http.post(settings.apiUrlBase + '/clusters/' + id + '/subnet-config', angular.toJson(subnet_config));
        };

        this.postRoutingTable = function(id, routing_table) {
            return $http.post(settings.apiUrlBase + '/clusters/' + id + '/routing-table', angular.toJson(routing_table));
        };

        this.getTimezones = function() {
            return $http.get(settings.metadataUrlBase + '/timezone.json');
        };
    }
]);


app.factory('wizardFactory', [
    function() {
        var wizard = {};
        wizard.reset = function() {
            wizard.cluster = {};
            wizard.steps = [];
            wizard.commit = {};
            wizard.servers = [];
            wizard.allServers = [];
            wizard.adapter = {}; //
            wizard.generalConfig = {};
            wizard.subnetworks = [];
            wizard.routingtable = [];
            wizard.generalConfig = {};
            wizard.interfaces = [];
        };

        wizard.reset();

        wizard.setClusterInfo = function(cluster) {
            wizard.cluster = cluster;
        };

        wizard.getClusterInfo = function() {
            return wizard.cluster;
        };

        wizard.setSteps = function(steps) {
            wizard.steps = steps;
        };

        wizard.getSteps = function() {
            return wizard.steps;
        };

        wizard.setCommitState = function(commitState) {
            wizard.commit = commitState;
            //console.info("wizard.setCommit  ", wizard.commit);
        };

        wizard.getCommitState = function() {
            //console.info("wizard.getCommit  ", wizard.commit);
            return wizard.commit;
        };

        wizard.setAllMachinesHost = function(server) {
            wizard.allServers = server;
        };

        wizard.getAllMachinesHost = function() {
            return wizard.allServers;
        };

        wizard.setServers = function(servers) {
            wizard.servers = servers;
        };

        wizard.getServers = function() {
            return wizard.servers;
        };

        wizard.setAdapter = function(adapter) { ////
            wizard.adapter = adapter;
        };

        wizard.getAdapter = function() { /////
            return wizard.adapter;
        };

        wizard.setGeneralConfig = function(config) {
            wizard.generalConfig = config;
        };

        wizard.getGeneralConfig = function() {
            return wizard.generalConfig;
        };

        wizard.setSubnetworks = function(subnetworks) {
            wizard.subnetworks = subnetworks;
        };

        wizard.getSubnetworks = function() {
            return wizard.subnetworks;
        };

        wizard.setRoutingTable = function(routingTb) {
            wizard.routingtable = routingTb;
        };

        wizard.getRoutingTable = function() {
            return wizard.routingtable;
        };

        wizard.setInterfaces = function(interfaces) {
            wizard.interfaces = interfaces;
        };

        wizard.getInterfaces = function() {
            return wizard.interfaces;
        };

        return wizard;
    }
]);
