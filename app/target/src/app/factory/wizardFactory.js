(function() {
  define(['./baseFactory'], function() {
    'use strict';
    var WizardFactory;
    WizardFactory = (function() {
      function WizardFactory() {
        this.cluster = {};
        this.steps = [];
        this.commit = {};
        this.servers = [];
        this.allServers = [];
        this.generalConfig = {};
        this.subnetworks = [];
        this.routingtable = [];
        this.generalConfig = {};
        this.interfaces = {};
        this.partition = {};
        this.server_credentials = {};
        this.service_credentials = {};
        this.console_credentials = {};
        this.network_mapping = {};
        this.ceph_config = {};
        this.os_gloable_config = {};
        this.package_config = {};
      }

      WizardFactory.prototype.clean = function() {
        this.cluster = {};
        this.steps = [];
        this.commit = {};
        this.servers = [];
        this.allServers = [];
        this.generalConfig = {};
        this.subnetworks = [];
        this.routingtable = [];
        this.generalConfig = {};
        this.interfaces = {};
        this.partition = {};
        this.server_credentials = {};
        this.service_credentials = {};
        this.console_credentials = {};
        this.network_mapping = {};
        this.ceph_config = {};
        return this.package_config = {};
      };

      WizardFactory.prototype.preConfig = function(config) {
        this.setInterfaces(config["interface"]);
        this.setGeneralConfig(config.general);
        this.setPartition(config.partition);
        this.setServerCredentials(config.server_credentials);
        this.setServiceCredentials(config.service_credentials);
        this.setConsoleCredentials(config.console_credentials);
        this.setNetworkMapping(config.network_mapping);
        if (config.ceph_config) {
          this.setCephConfig(config.ceph_config);
        }
        if (config.package_config) {
          return this.setPackageConfig(config.package_config);
        }
      };

      WizardFactory.prototype.setClusterInfo = function(cluster) {
        return this.cluster = cluster;
      };

      WizardFactory.prototype.setInterfaces = function(interfaces) {
        return this.interfaces = interfaces;
      };

      WizardFactory.prototype.setGeneralConfig = function(config) {
        return this.generalConfig = config;
      };

      WizardFactory.prototype.getGeneralConfig = function() {
        return this.generalConfig;
      };

      WizardFactory.prototype.setPartition = function(partition) {
        return this.partition = partition;
      };

      WizardFactory.prototype.setOsGlobalConfig = function(os_config) {
        return this.os_gloable_config = os_config;
      };

      WizardFactory.prototype.getOsGlobalConfig = function() {
        return this.os_gloable_config;
      };

      WizardFactory.prototype.setServerCredentials = function(credentials) {
        return this.server_credentials = credentials;
      };

      WizardFactory.prototype.getServerCredentials = function() {
        return this.server_credentials;
      };

      WizardFactory.prototype.setServiceCredentials = function(credentials) {
        return this.service_credentials = credentials;
      };

      WizardFactory.prototype.setConsoleCredentials = function(credentials) {
        return this.console_credentials = credentials;
      };

      WizardFactory.prototype.setNetworkMapping = function(mapping) {
        return this.network_mapping = mapping;
      };

      WizardFactory.prototype.setCephConfig = function(cephConfig) {
        return this.ceph_config = cephConfig;
      };

      WizardFactory.prototype.getClusterInfo = function() {
        return this.cluster;
      };

      WizardFactory.prototype.getAllMachinesHost = function() {
        return this.allServers;
      };

      WizardFactory.prototype.setAllMachinesHost = function(server) {
        return this.allServers = server;
      };

      WizardFactory.prototype.setSubnetworks = function(subnetworks) {
        return this.subnetworks = subnetworks;
      };

      WizardFactory.prototype.getSubnetworks = function() {
        return this.subnetworks;
      };

      WizardFactory.prototype.getInterfaces = function() {
        return this.interfaces;
      };

      WizardFactory.prototype.getPartition = function() {
        return this.partition;
      };

      WizardFactory.prototype.getServiceCredentials = function() {
        return this.service_credentials;
      };

      WizardFactory.prototype.getConsoleCredentials = function() {
        return this.console_credentials;
      };

      WizardFactory.prototype.getServers = function() {
        return this.servers;
      };

      WizardFactory.prototype.getNetworkMapping = function() {
        return this.network_mapping;
      };

      WizardFactory.prototype.getCephConfig = function() {
        return this.ceph_config;
      };

      WizardFactory.prototype.setCommitState = function(commitState) {
        return this.commit = commitState;
      };

      WizardFactory.prototype.getCommitState = function() {
        return this.commit;
      };

      WizardFactory.prototype.setServers = function(servers) {
        return this.servers = servers;
      };

      WizardFactory.prototype.setPackageConfig = function(packageConfig) {
        return this.package_config = packageConfig;
      };

      WizardFactory.prototype.getPackageConfig = function() {
        return this.package_config;
      };

      return WizardFactory;

    })();
    return angular.module('compass.factories').factory('wizardFactory', [
      function() {
        return new WizardFactory();
      }
    ]);
  });

}).call(this);
