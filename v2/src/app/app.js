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
        }
    }
]);


app.factory('wizardFactory', [
    function() {
        var wizard = {};

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

        wizard.setStepCommit = function(stepId, commitState, message) {
            angular.forEach(wizard.steps, function(step) {
                if(step.id == stepId) {
                    step.commit = commitState;
                    step.message = message;
                }
            })
        };

        wizard.getStepCommit = function(stepId) {
            angular.forEach(wizard.steps, function(step) {
                if(step.id == stepId) {
                    return step;
                }
            })            
        }

        wizard.setServers = function(servers) {
            wizard.servers = servers;
        };

        wizard.getServers = function() {
            return wizard.servers;
        };

        wizard.setAdapter = function(adapter) {
            wizard.adapter = adapter;
        };

        wizard.getAdapter = function() {
            return wizard.adapter;
        };
/*
        wizard.setSubnetworks = function(subnetworks) {
            wizard.subnetworks = subnetworks;
        };

        wizard.getSubnetworks = function() {
            return wizard.subnetworks;
        };
*/
        return wizard;
    }
]);
