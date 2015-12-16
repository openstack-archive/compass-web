(function() {
  define(['./baseController'], function() {
    'use strict';
    return angular.module('compass.controllers').controller('wizardCtrl', [
      '$scope', 'wizardService', '$state', '$stateParams', 'clusterData', 'adaptersData', 'machinesHostsData', 'wizardStepsData', 'clusterConfigData', function($scope, wizardService, $state, $stateParams, clusterData, adaptersData, machinesHostsData, wizardStepsData, clusterConfigData) {
        wizardService.wizardInit($scope, $stateParams.id, clusterData, adaptersData, wizardStepsData, machinesHostsData, clusterConfigData);
        $scope.skipForward = function(nextStepId) {
          if ($scope.currentStep !== nextStepId) {
            $scope.pendingStep = nextStepId;
            return wizardService.triggerCommitByStepById($scope, $scope.currentStep, nextStepId);
          }
        };
        $scope.stepControl = function(goToPrevious) {
          return wizardService.stepControl($scope, goToPrevious);
        };
        $scope.stepForward = function() {
          $scope.pendingStep = $scope.currentStep + 1;
          return wizardService.triggerCommitByStepById($scope, $scope.currentStep, $scope.pendingStep);
        };
        $scope.stepBackward = function() {
          $scope.pendingStep = $scope.currentStep - 1;
          return wizardService.triggerCommitByStepById($scope, $scope.currentStep, $scope.pendingStep);
        };
        $scope.deploy = function() {
          return wizardService.deploy($scope);
        };
        $scope.$on('loading', function(event, data) {
          return $scope.loading = data;
        });
        wizardService.setSubnetworks();
        return wizardService.watchingCommittedStatus($scope);
      }
    ]).controller('svSelectCtrl', [
      '$scope', 'wizardService', '$filter', 'ngTableParams', '$modal', function($scope, wizardService, $filter, ngTableParams, $modal) {
        $scope.hideunselected = '';
        $scope.search = {};
        $scope.cluster = wizardService.getClusterInfo();
        $scope.allservers = wizardService.getAllMachinesHost();
        $scope.allAddedSwitches = [];
        wizardService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.showall;
        });
        wizardService.displayDataInTable($scope, $scope.allservers);
        wizardService.watchingTriggeredStep($scope);
        $scope.hideUnselected = function() {
          if ($scope.hideunselected) {
            return $scope.search.selected = true;
          } else {
            return delete $scope.search.selected;
          }
        };
        $scope.ifPreSelect = function(server) {
          var svCluster, _i, _len, _ref, _results;
          server.disable = false;
          if (server.clusters) {
            if (server.clusters.length > 0) {
              server.disabled = true;
            }
            _ref = server.clusters;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              svCluster = _ref[_i];
              if (svCluster.id === $scope.cluster.id) {
                server.selected = true;
                _results.push(server.disabled = false);
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
        $scope.selectAllServers = function(flag) {
          var sv, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
          if (flag) {
            _ref = $scope.allservers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sv = _ref[_i];
              if (!sv.disabled) {
                _results.push(sv.selected = true);
              }
            }
            return _results;
          } else {
            _ref1 = $scope.allservers;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              sv = _ref1[_j];
              _results1.push(sv.selected = false);
            }
            return _results1;
          }
        };
        $scope.uploadFile = function() {
          var modalInstance;
          return modalInstance = $modal.open({
            templateUrl: "src/app/partials/modalUploadFiles.html",
            controller: "uploadFileModalInstanceCtrl",
            resolve: {
              allSwitches: function() {
                return $scope.allAddedSwitches;
              },
              allMachines: function() {
                return $scope.foundResults;
              }
            }
          });
        };
        $scope.addNewMachines = function() {
          var modalInstance;
          return modalInstance = $modal.open({
            templateUrl: "src/app/partials/modalAddNewServers.html",
            controller: "addMachineModalInstanceCtrl",
            resolve: {
              allSwitches: function() {
                return $scope.allAddedSwitches;
              },
              allMachines: function() {
                return $scope.foundResults;
              }
            }
          });
        };
        wizardService.watchAndAddNewServers($scope);
        return $scope.commit = function(sendRequest) {
          return wizardService.svSelectonCommit($scope);
        };
      }
    ]).controller('globalCtrl', [
      '$scope', 'wizardService', '$q', function($scope, wizardService, $q) {
        wizardService.globalConfigInit($scope);
        wizardService.buildOsGlobalConfigByMetaData($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.addValue = function(category, key) {
          if (!$scope.os_global_config[category][key]) {
            scope.os_global_config[category][key] = [];
          }
          return $scope.os_global_config[category][key].push("");
        };
        return $scope.commit = function(sendRequest) {
          return wizardService.globalCommit($scope, sendRequest);
        };
      }
    ]).controller('networkCtrl', [
      '$rootScope', '$scope', 'wizardService', 'ngTableParams', '$filter', '$modal', '$timeout', '$cookieStore', function($rootScope, $scope, wizardService, ngTableParams, $filter, $modal, $timeout, $cookieStore) {
        wizardService.networkInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.autoFillManage = function() {
          $scope.autoFill = !$scope.autoFill;
          if ($scope.autoFill) {
            return $scope.autoFillButtonDisplay = "Disable Autofill";
          } else {
            return $scope.autoFillButtonDisplay = "Enable Autofill";
          }
        };
        $scope.autofill = function(alertFade) {
          var hostname_rule, interval, ip_start, key, value, _ref;
          _ref = $scope.interfaces;
          for (key in _ref) {
            value = _ref[key];
            ip_start = $("#" + key + "-ipstart").val();
            interval = parseInt($("#" + key + "-increase-num").val());
            wizardService.fillIPBySequence($scope, ip_start, interval, key);
          }
          hostname_rule = $("#hostname-rule").val();
          wizardService.fillHostname($scope, hostname_rule);
          $scope.networkAlerts = [
            {
              msg: 'Autofill Done!'
            }
          ];
          if (alertFade) {
            return $timeout(function() {
              return $scope.networkAlerts = [];
            }, alertFade);
          }
        };
        $scope.addInterface = function(newInterface) {
          return wizardService.addInterface($scope, newInterface);
        };
        $scope.deleteInterface = function(delInterface) {
          var sv, _i, _len, _ref, _results;
          delete $scope.interfaces[delInterface];
          _ref = $scope.servers;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sv = _ref[_i];
            _results.push(delete sv.networks[delInterface]);
          }
          return _results;
        };
        $scope.selectAsInstallInterface = function(evt, name) {
          var checkbox, n;
          checkbox = evt.target;
          if (!checkbox.checked) {
            return;
          }
          for (n in $scope.interfaces) {
            if (n !== name) {
              $scope.interfaces[n].is_mgmt = false;
            }
          }
        };
        $scope.openAddSubnetModal = function() {
          var modalInstance;
          modalInstance = $modal.open({
            templateUrl: "src/app/partials/modalAddSubnet.tpl.html",
            controller: "addSubnetModalInstanceCtrl",
            resolve: {
              subnets: function() {
                return $scope.subnetworks;
              }
            }
          });
          return modalInstance.result.then(function(subnets) {
            $scope.subnetworks = subnets;
            return wizardService.setSubnetworks($scope.subnetworks);
          }, function() {
            return console.log("modal dismissed");
          });
        };
        $scope.commit = function(sendRequest) {
          var installInterface, name, value, _ref;
          installInterface = {};
          $rootScope.networkMappingInterfaces = {};
          _ref = $scope.interfaces;
          for (name in _ref) {
            value = _ref[name];
            if (value.is_mgmt) {
              installInterface[name] = value;
            } else {
              $rootScope.networkMappingInterfaces[name] = value;
            }
          }
          $scope.interfaces = installInterface;
          $cookieStore.put('networkMappingInterfaces', $rootScope.networkMappingInterfaces);
          return wizardService.networkCommit($scope, sendRequest);
        };
        return wizardService.getClusterHosts($scope.cluster.id).success(function(data) {
          var name, savedNetworkMappingInterfaces, value;
          $scope.servers = data;
          if ($scope.servers[0].networks && Object.keys($scope.servers[0].networks).length !== 0) {
            $scope.interfaces = $scope.servers[0].networks;
            savedNetworkMappingInterfaces = $cookieStore.get('networkMappingInterfaces');
            for (name in savedNetworkMappingInterfaces) {
              value = savedNetworkMappingInterfaces[name];
              $scope.interfaces[name] = value;
            }
            wizardService.setInterfaces($scope.interfaces);
          }
          return wizardService.displayDataInTable($scope, $scope.servers);
        });
      }
    ]).controller('partitionCtrl', [
      '$scope', 'wizardService', function($scope, wizardService) {
        wizardService.partitionInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.addPartition = function() {
          return wizardService.addPartition($scope);
        };
        $scope.deletePartition = function(index) {
          return wizardService.deletePartition($scope, index);
        };
        $scope.commit = function(sendRequest) {
          return wizardService.partitionCommit($scope, sendRequest);
        };
        $scope.mount_point_change = function(index, name) {
          return wizardService.mount_point_change($scope, index, name);
        };
        return $scope.$watch('partitionInforArray', function() {
          var partitionInfo, total, _i, _len, _ref;
          $scope.partitionarray = [];
          total = 0;
          _ref = $scope.partitionInforArray;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            partitionInfo = _ref[_i];
            total += parseFloat(partitionInfo.percentage);
            $scope.partitionarray.push({
              "name": partitionInfo.name,
              "number": partitionInfo.percentage
            });
          }
          return $scope.partitionarray.push({
            "name": "others",
            "number": 100 - total
          });
        }, true);
      }
    ]).controller('packageConfigCtrl', [
      '$scope', 'wizardService', function($scope, wizardService) {
        wizardService.targetSystemConfigInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.mSave = function() {
          return $scope.originalMangementData = angular.copy($scope.console_credentials);
        };
        $scope.sSave = function() {
          return $scope.originalServiceData = angular.copy($scope.service_credentials);
        };
        $scope.mSave();
        $scope.sSave();
        console.log($scope.console_credentials);
        $scope.mEdit = function(index) {
          var em, i, _i, _len, _ref;
          _ref = $scope.editMgntMode;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            em = _ref[i];
            if (i !== index) {
              $scope.editMgntMode[i] = false;
            } else {
              $scope.editMgntMode[i] = true;
            }
          }
          return $scope.mReset();
        };
        $scope.mReset = function() {
          return $scope.console_credentials = angular.copy($scope.originalMangementData);
        };
        $scope.commit = function(sendRequest) {
          return wizardService.targetSystemConfigCommit($scope, sendRequest);
        };
        return $scope.addValue = function(key1, key2, key3) {
          if (!$scope.package_config[key1][key2][key3]) {
            $scope.package_config[key1][key2][key3] = [];
          }
          return $scope.package_config[key1][key2][key3].push("");
        };
      }
    ]).controller('roleAssignCtrl', [
      '$scope', 'wizardService', '$filter', 'ngTableParams', function($scope, wizardService, $filter, ngTableParams) {
        wizardService.roleAssignInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.selectAllServers = function(flag) {
          var sv, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
          if (flag) {
            _ref = $scope.servers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sv = _ref[_i];
              _results.push(sv.checked = true);
            }
            return _results;
          } else {
            _ref1 = $scope.servers;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              sv = _ref1[_j];
              _results1.push(sv.checked = false);
            }
            return _results1;
          }
        };
        $scope.assignRole = function(role) {
          return wizardService.assignRole($scope, role);
        };
        $scope.removeRole = function(server, role) {
          var roleIndex, role_key, role_value, serverIndex, _i, _len, _ref;
          serverIndex = $scope.servers.indexOf(server);
          roleIndex = $scope.servers[serverIndex].roles.indexOf(role);
          $scope.servers[serverIndex].roles.splice(roleIndex, 1);
          _ref = $scope.roles;
          for (role_key = _i = 0, _len = _ref.length; _i < _len; role_key = ++_i) {
            role_value = _ref[role_key];
            if (role.name === $scope.roles[role_key].name) {
              $scope.existingRoles[serverIndex].splice(role_key, 1, role_key);
            }
          }
          return $scope.servers[serverIndex].dropChannel = $scope.existingRoles[serverIndex].toString();
        };
        $scope.onDrop = function($event, server) {
          return $scope.dragKey = $scope.servers.indexOf(server);
        };
        $scope.dropSuccessHandler = function($event, role_value, key) {
          var roleExist;
          roleExist = wizardService.checkRoleExist($scope.servers[$scope.dragKey].roles, role_value);
          if (!roleExist) {
            $scope.servers[$scope.dragKey].roles.push(role_value);
          } else {
            console.log("role exists");
          }
          return wizardService.checkExistRolesDrag($scope);
        };
        $scope.autoAssignRoles = function() {
          return wizardService.autoAssignRoles($scope);
        };
        $scope.commit = function(sendRequest) {
          return wizardService.roleAssignCommit($scope, sendRequest);
        };
        return wizardService.displayDataInTable($scope, $scope.servers);
      }
    ]).controller('networkMappingCtrl', [
      '$scope', 'wizardService', function($scope, wizardService) {
        var configureHAProxyCfg, configureNetworkCfg, configureNetworkMapping, configureNeutronCfg;
        wizardService.networkMappingInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.nics = {
          external: 'eth1',
          mgmt: 'eth1',
          storage: 'eth1'
        };
        $scope.vlanTags = {
          mgmt: '101',
          storage: '102'
        };
        $scope.ips = {
          mgmt: {
            start: '172.16.1.10',
            end: '172.16.1.255',
            cidr: '127.16.1.0/24',
            internal_vip: '172.16.1.222'
          },
          external: {
            start: '10.145.250.10',
            end: '10.145.250.255',
            cidr: '10.145.250.0/24',
            gw_ip: '10.145.250.1',
            public_vip: '10.145.250.221'
          },
          storage: {
            start: '172.16.2.10',
            end: '172.16.2.255',
            cidr: '172.16.2.0/24'
          },
          ha_proxy: {
            vip: '10.1.0.222'
          }
        };
        configureNeutronCfg = function() {
          var neutronCfg;
          neutronCfg = {
            'openvswitch': {
              'tenant_network_type': 'vxlan',
              'network_vlan_ranges': ['physnet:1:4094'],
              'bridge_mappings': ['physnet:br-prv']
            }
          };
          return neutronCfg;
        };
        configureNetworkCfg = function() {
          var networkCfg;
          networkCfg = {
            'bond_mappings': [],
            'sys_intf_mappings': [
              {
                'interface': $scope.nics.mgmt,
                'role': ['controller', 'compute'],
                'vlan_tag': $scope.vlanTags.mgmt,
                'type': 'vlan',
                'name': 'mgmt'
              }, {
                'interface': $scope.nics.storage,
                'role': ['controller', 'compute'],
                'vlan_tag': $scope.vlanTags.storage,
                'type': 'vlan',
                'name': 'storage'
              }, {
                'interface': 'br-prv',
                'role': ['controller', 'compute'],
                'type': 'ovs',
                'name': 'external'
              }
            ],
            'nic_mappings': [],
            'public_net_info': {
              'no_gateway': 'False',
              'external_gw': $scope.ips.external.ip,
              'enable': 'False',
              'floating_ip_cidr': $scope.ips.external.cidr,
              'floating_ip_start': $scope.ips.external.start,
              'floating_ip_end': $scope.ips.external.end,
              'provider_network': 'physnet',
              'subnet': 'ext-subnet',
              'network': 'ext-net',
              'enable_dhcp': 'False',
              'segment_id': 1000,
              'router': 'router-ext',
              'type': 'vlan'
            },
            'internal_vip': {
              'interface': 'mgmt',
              'ip': $scope.ips.mgmt.internal_vip,
              'netmask': wizardService.getNetMaskFromCIDR($scope.ips.mgmt.cidr)
            },
            'public_vip': {
              'interface': 'external',
              'ip': $scope.ips.external.public_vip,
              'netmask': wizardService.getNetMaskFromCIDR($scope.ips.external.cidr)
            },
            'provider_net_mappings': [
              {
                'interface': $scope.interfaces.external,
                'role': ['controller', 'compute'],
                'type': 'ovs',
                'name': 'br-prv',
                'network': 'physnet'
              }
            ],
            'ip_settings': [
              {
                'cidr': $scope.ips.mgmt.cidr,
                'role': ['controller', 'compute'],
                'name': 'mgmt',
                'ip_ranges': [[$scope.ips.mgmt.start, $scope.ips.mgmt.end]]
              }, {
                'cidr': $scope.ips.storage.cidr,
                'role': ['controller', 'compute'],
                'name': 'storage',
                'ip_ranges': [[$scope.ips.storage.start, $scope.ips.storage.end]]
              }, {
                'gw': $scope.ips.external.gw_ip,
                'cidr': $scope.ips.external.cidr,
                'role': ['controller', 'compute'],
                'name': 'external',
                'ip_ranges': [[$scope.ips.external.start, $scope.ips.external.end]]
              }
            ]
          };
          return networkCfg;
        };
        configureNetworkMapping = function() {
          var installNic, nic, nicName, value, _ref;
          installNic = {};
          nicName = '';
          _ref = $scope.interfaces;
          for (nic in _ref) {
            value = _ref[nic];
            if (value.is_mgmt) {
              installNic = value;
            }
            if (value.is_mgmt) {
              nicName = nic;
            }
          }
          $scope.networkMapping = {
            'install': {
              'interface': nicName,
              'subnet': installNic.subnet
            }
          };
        };
        configureHAProxyCfg = function() {
          var haCfg;
          haCfg = {
            'vip': $scope.ips.ha_proxy.vip
          };
          return haCfg;
        };
        configureNetworkMapping();
        $scope.onDrop = function($event, key) {
          return $scope.pendingInterface = key;
        };
        $scope.dropSuccessHandler = function($event, key, dict) {
          return dict[key].mapping_interface = $scope.pendingInterface;
        };
        return $scope.commit = function(sendRequest) {
          var haCfg, networkCfg, neutronCfg;
          networkCfg = configureNetworkCfg();
          neutronCfg = configureNeutronCfg();
          haCfg = configureHAProxyCfg();
          return wizardService.networkMappingCommit($scope, networkCfg, $scope.networkMapping, neutronCfg, haCfg, sendRequest);
        };
      }
    ]).controller('reviewCtrl', [
      '$scope', 'wizardService', 'ngTableParams', '$filter', '$location', '$anchorScroll', function($scope, wizardService, ngTableParams, $filter, $location, $anchorScroll) {
        wizardService.reviewInit($scope);
        wizardService.watchingTriggeredStep($scope);
        $scope.scrollTo = function(id) {
          var old;
          old = $location.hash();
          $location.hash(id);
          $anchorScroll();
          return $location.hash(old);
        };
        $scope.commit = function(sendRequest) {
          return wizardService.reviewCommit($scope, sendRequest);
        };
        return wizardService.displayDataInTable($scope, $scope.servers);
      }
    ]).animation('.fade-animation', [
      function() {
        return {
          enter: function(element, done) {
            element.css('display', 'none');
            element.fadeIn(500, done);
            return function() {
              return element.stop();
            };
          },
          leave: function(element, done) {
            element.fadeOut(500, done);
            return function() {
              return element.stop();
            };
          }
        };
      }
    ]);
  });

}).call(this);
