(function() {
  define(['./baseService'], function() {
    'use strict';
    var WizardService;
    WizardService = (function() {
      function WizardService(dataService, $state, wizardFactory, $filter, $q, ngTableParams, $modal) {
        this.dataService = dataService;
        this.$state = $state;
        this.wizardFactory = wizardFactory;
        this.$filter = $filter;
        this.$q = $q;
        this.ngTableParams = ngTableParams;
        this.$modal = $modal;
      }

      WizardService.prototype.getClusterById = function(clusterId) {
        return this.dataService.getClusterById(clusterId);
      };

      WizardService.prototype.getAllMachineHosts = function() {
        return this.dataService.getAllMachineHosts();
      };

      WizardService.prototype.getWizardSteps = function() {
        return this.dataService.getWizardSteps();
      };

      WizardService.prototype.getClusterConfig = function(clusterId) {
        return this.dataService.getClusterConfig(clusterId);
      };

      WizardService.prototype.getAdapters = function() {
        return this.dataService.getAdapters();
      };

      WizardService.prototype.getCurrentAdapterName = function(adapters, adapterId) {
        var adapter, currentAdapterName, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = adapters.length; _i < _len; _i++) {
          adapter = adapters[_i];
          if (adapter.id === adapterId) {
            _results.push(currentAdapterName = adapter.name);
          }
        }
        return _results;
      };

      WizardService.prototype.getSteps = function(currentAdapterName, wizardStepsData) {
        switch (currentAdapterName[0]) {
          case "os_only":
            return wizardStepsData["os"];
          default:
            return wizardStepsData["os_and_ts"];
        }
      };

      WizardService.prototype.setWizardPreConfig = function(currentAdapterName, clusterConfigData) {
        switch (currentAdapterName[0]) {
          case "os_only":
            return this.getWizardPreConfig("os_only", clusterConfigData);
          default:
            return this.getWizardPreConfig("openstack", clusterConfigData);
        }
      };

      WizardService.prototype.getWizardPreConfig = function(name, clusterConfigData) {
        var oldConfig, wizardFactory;
        wizardFactory = this.wizardFactory;
        oldConfig = clusterConfigData;
        return this.dataService.getWizardPreConfig().success(function(data) {
          var preConfigData;
          preConfigData = data[name];
          if (preConfigData) {
            wizardFactory.preConfig(data[name]);
            if (oldConfig.os_config) {
              if (oldConfig.os_config.partition) {
                wizardFactory.setPartition(oldConfig.os_config.partition);
              }
              wizardFactory.setOsGlobalConfig(oldConfig.os_config);
            }
            if (oldConfig.package_config) {
              if (oldConfig.package_config.security) {
                if (oldConfig.package_config.security.service_credentials) {
                  wizardFactory.setServiceCredentials(oldConfig.package_config.security.service_credentials);
                }
                if (oldConfig.package_config.security.console_credentials) {
                  wizardFactory.setConsoleCredentials(oldConfig.package_config.security.console_credentials);
                }
              }
              if (oldConfig.package_config.network_mapping) {
                wizardFactory.setNetworkMapping(oldConfig.package_config.network_mapping);
              }
              if (oldConfig.package_config.ceph_config) {
                wizardFactory.setCephConfig(oldConfig.package_config.ceph_config);
              }
              return wizardFactory.setPackageConfig(oldConfig.package_config);
            }
          }
        });
      };

      WizardService.prototype.getClusterInfo = function() {
        return this.wizardFactory.getClusterInfo();
      };

      WizardService.prototype.getAllMachinesHost = function() {
        return this.wizardFactory.getAllMachinesHost();
      };

      WizardService.prototype.setAllMachinesHost = function(server) {
        return this.wizardFactory.setAllMachinesHost(server);
      };

      WizardService.prototype.ipAddressPre = function(ip) {
        var i, ipAddressPreHelper, m, x, _i, _ref;
        m = ip.split(".");
        x = "";
        ipAddressPreHelper = function(i) {
          var item;
          item = m[i];
          if (item.length === 1) {
            return x += "00" + item;
          } else if (item.length === 2) {
            return x += "0" + item;
          } else {
            return x += item;
          }
        };
        for (i = _i = 0, _ref = m.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          ipAddressPreHelper(i);
        }
        return x;
      };

      WizardService.prototype.setSubnetworks = function() {
        var wizardFactory;
        wizardFactory = this.wizardFactory;
        return this.dataService.getSubnetConfig().success(function(data) {
          return wizardFactory.setSubnetworks(data);
        });
      };

      WizardService.prototype.getServerColumns = function() {
        return this.dataService.getServerColumns();
      };

      WizardService.prototype.getSwitches = function() {
        return this.dataService.getSwitches();
      };

      WizardService.prototype.watchAndAddNewServers = function($scope) {
        var $filter;
        $filter = this.$filter;
        return $scope.$watch('foundResults', function(newResults, oldResults) {
          var result, sv, _i, _len;
          if (newResults !== oldResults) {
            for (_i = 0, _len = newResults.length; _i < _len; _i++) {
              result = newResults[_i];
              sv = $filter('filter')($scope.allservers, result.mac, true);
              if (sv.length === 0) {
                result.machine_id = result.id;
                delete result['id'];
                result["new"] = true;
                $scope.allservers.unshift(result);
              }
            }
            if ($scope.tableParams) {
              $scope.tableParams.$params.count = $scope.allservers.length;
              return $scope.tableParams.reload();
            }
          }
        }, true);
      };

      WizardService.prototype.postSwitches = function(newswitch) {
        return this.dataService.postSwitches(newswitch);
      };

      WizardService.prototype.wizardInit = function($scope, clusterId, clusterData, adaptersData, wizardStepsData, machinesHostsData, clusterConfigData) {
        this.wizardFactory.clean();
        $scope.loading = false;
        $scope.clusterId = clusterId;
        $scope.cluster = clusterData;
        $scope.adapters = adaptersData;
        $scope.currentAdapterName = this.getCurrentAdapterName($scope.adapters, $scope.cluster.adapter_id);
        $scope.steps = this.getSteps($scope.currentAdapterName, wizardStepsData);
        this.setWizardPreConfig($scope.currentAdapterName, clusterConfigData);
        this.setClusterInfo($scope.cluster);
        this.setAllMachinesHost(machinesHostsData);
        $scope.currentStep = 1;
        $scope.maxStep = 1;
        return $scope.pendingStep = 1;
      };

      WizardService.prototype.globalConfigInit = function($scope) {
        $scope.os_global_config = {};
        $scope.cluster = this.wizardFactory.getClusterInfo();
        if (this.wizardFactory.getOsGlobalConfig() !== void 0) {
          return $scope.os_global_config = this.wizardFactory.getOsGlobalConfig();
        }
      };

      WizardService.prototype.networkInit = function($scope) {
        $scope.cluster = this.wizardFactory.getClusterInfo();
        $scope.subnetworks = this.wizardFactory.getSubnetworks();
        $scope.interfaces = this.wizardFactory.getInterfaces();
        $scope.autoFill = false;
        $scope.autoFillButtonDisplay = "Enable Autofill";
        return this.dataService.getServerColumns().success(function(data) {
          return $scope.server_columns = data.showless;
        });
      };

      WizardService.prototype.deleteSubnet = function($scope, index, id) {
        return this.dataService.deleteSubnet(id).success(function(data) {
          return $scope.subnetworks.splice(index, 1);
        });
      };

      WizardService.prototype.validateAllSubnets = function($scope) {
        var subnet, _i, _len, _ref, _results;
        $scope.subnetAllValid = true;
        _ref = $scope.subnetworks;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subnet = _ref[_i];
          if (subnet['valid'] === false) {
            _results.push($scope.subnetAllValid = false);
          }
        }
        return _results;
      };

      WizardService.prototype.subnetCommit = function($scope, $modalInstance) {
        var findNewSubnetId, promises, requestData, subnet, updateSubnetConfig, _i, _len, _ref;
        promises = [];
        _ref = $scope.subnetworks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subnet = _ref[_i];
          requestData = {
            "subnet": subnet.subnet
          };
          if (subnet.id === void 0) {
            updateSubnetConfig = this.dataService.postSubnetConfig(requestData);
          } else {
            updateSubnetConfig = this.dataService.putSubnetConfig(subnet.id, requestData);
          }
          promises.push(updateSubnetConfig);
        }
        findNewSubnetId = this.findNewSubnetId;
        this.$q.all(promises).then(function(data) {
          var id, _j, _len1, _ref1;
          _ref1 = $scope.subnetworks;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            subnet = _ref1[_j];
            if (!subnet["id"]) {
              id = findNewSubnetId(subnet.subnet, data);
              subnet["id"] = id;
            }
          }
          return $modalInstance.close($scope.subnetworks);
        });
        return function(response) {
          return console.log("promises error", response);
        };
      };

      WizardService.prototype.findNewSubnetId = function(ip, data) {
        var sub, _i, _len;
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          sub = data[_i];
          if (sub.data.subnet === ip) {
            return sub.data.id;
          }
        }
        return null;
      };

      WizardService.prototype.fillHostname = function($scope, rule) {
        var server, server_index, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        switch (rule) {
          case "host":
            server_index = 1;
            _ref = $scope.servers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              server = _ref[_i];
              server.hostname = "host-" + server_index;
              _results.push(server_index++);
            }
            return _results;
            break;
          case "switch_ip":
            _ref1 = $scope.servers;
            _results1 = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              server = _ref1[_j];
              _results1.push(server.hostname = server.switch_ip.replace(/\./g, "-") + "-p" + server.port);
            }
            return _results1;
        }
      };

      WizardService.prototype.fillIPBySequence = function($scope, ipStart, interval, key) {
        var ip, ipParts, ipStartParts, server, _i, _len, _ref;
        if (ipStart === "") {
          return;
        }
        ipStartParts = ipStart.split(".");
        ipParts = ipStartParts.map(function(x) {
          return parseInt(x);
        });
        _ref = $scope.servers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          server = _ref[_i];
          if (ipParts[3] > 255) {
            ipParts[3] = ipParts[3] - 256;
            ipParts[2]++;
          }
          if (ipParts[2] > 255) {
            ipParts[2] = ipParts[2] - 256;
            ipParts[1]++;
          }
          if (ipParts[1] > 255) {
            ipParts[1] = ipParts[1] - 256;
            ipParts[0]++;
          }
          if (ipParts[0] > 255) {
            server.networks[key].ip = "";
            return;
          } else {
            ip = ipParts[0] + "." + ipParts[1] + "." + ipParts[2] + "." + ipParts[3];
            server.networks[key].ip = ip;
            ipParts[3] = ipParts[3] + interval;
          }
        }
      };

      WizardService.prototype.getNetMaskFromCIDR = function(cidr) {
        var parts;
        parts = cidr.split('/');
        if (parts.length === 2) {
          return parts[1];
        } else {
          return '24';
        }
      };

      WizardService.prototype.getClusterHosts = function(clusterId) {
        return this.dataService.getClusterHosts(clusterId);
      };

      WizardService.prototype.setInterfaces = function(interfaces) {
        return this.wizardFactory.setInterfaces(interfaces);
      };

      WizardService.prototype.setClusterInfo = function(cluster) {
        return this.wizardFactory.setClusterInfo(cluster);
      };

      WizardService.prototype.setPartition = function(partition) {
        return this.wizardFactory.setPartition(partition);
      };

      WizardService.prototype.partitionInit = function($scope) {
        var key, val, _ref, _results;
        $scope.cluster = this.wizardFactory.getClusterInfo();
        $scope.partition = this.wizardFactory.getPartition();
        $scope.partitionInforArray = [];
        $scope.duplicated = false;
        $scope.duplicatedIndexArray = [];
        _ref = $scope.partition;
        _results = [];
        for (key in _ref) {
          val = _ref[key];
          _results.push($scope.partitionInforArray.push({
            "name": key,
            "percentage": val.percentage,
            "max_size": val.max_size
          }));
        }
        return _results;
      };

      WizardService.prototype.targetSystemConfigInit = function($scope) {
        var keyLength_console_credentials, keyLength_service_credentials, typeIsArray;
        $scope.cluster = this.wizardFactory.getClusterInfo();
        $scope.service_credentials = this.wizardFactory.getServiceCredentials();
        $scope.console_credentials = this.wizardFactory.getConsoleCredentials();
        $scope.package_config = this.wizardFactory.getPackageConfig();
        typeIsArray = Array.isArray || function(value) {
          return {}.toString.call(value) === '[object Array]';
        };
        this.dataService.getPackageConfigUiElements($scope.cluster.flavor.id).success(function(data) {
          var content, content_data_serialNum, content_data_value, details_content_data_key, details_content_data_value, details_key, details_value, key, serialNum, value, _ref, _ref1, _ref2, _ref3, _results;
          $scope.metaData = data.flavor_config;
          _ref = $scope.metaData;
          _results = [];
          for (key in _ref) {
            value = _ref[key];
            if (value.category !== "service_credentials" && value.category !== "console_credentials") {
              if (!$scope.package_config[value.category]) {
                $scope.package_config[value.category] = {};
              }
            }
            if (value.data_structure === "form") {
              _ref1 = value.data;
              for (serialNum in _ref1) {
                content = _ref1[serialNum];
                if (!$scope.package_config[value.category][content.name]) {
                  if (!content.content) {
                    if (!content.default_value) {
                      $scope.package_config[value.category][content.name] = "";
                    } else {
                      $scope.package_config[value.category][content.name] = content.default_value;
                    }
                  } else {
                    $scope.package_config[value.category][content.name] = {};
                  }
                }
                if (content.content) {
                  _ref2 = content.content;
                  for (content_data_serialNum in _ref2) {
                    content_data_value = _ref2[content_data_serialNum];
                    if (!$scope.package_config[value.category][content.name][content_data_value.name]) {
                      if (!content_data_value.default_value) {
                        if (!content_data_value.content_data) {
                          $scope.package_config[value.category][content.name][content_data_value.name] = "";
                        } else {
                          $scope.package_config[value.category][content.name][content_data_value.name] = {};
                        }
                      } else {
                        $scope.package_config[value.category][content.name][content_data_value.name] = content_data_value.default_value;
                      }
                    }
                    _ref3 = content_data_value.content_data;
                    for (details_content_data_key in _ref3) {
                      details_content_data_value = _ref3[details_content_data_key];
                      if (details_content_data_key === content_data_value.default_value) {
                        for (details_key in details_content_data_value) {
                          details_value = details_content_data_value[details_key];
                          if (!$scope.package_config[value.category][content.name][details_value.name]) {
                            if (!details_value.hint) {
                              $scope.package_config[value.category][content.name][details_value.name] = [""];
                            } else {
                              $scope.package_config[value.category][content.name][details_value.name] = [details_value.hint];
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (value.category === "service_credentials" || value.category === "console_credentials") {
              if (!$scope.package_config["security"]) {
                $scope.package_config["security"] = {};
              }
              $scope.package_config["security"][value.category] = value.config;
              _results.push($scope.metaData[key].dataSource = $scope.package_config["security"][value.category]);
            } else {
              _results.push($scope.metaData[key].dataSource = $scope.package_config[value.category]);
            }
          }
          return _results;
        });
        $scope.change = function(category, subname, name, value) {
          var content, content_data_key, content_data_value, detail_data_key, detail_data_value, i, metaKey, metaValue, serialNum, _results;
          _results = [];
          for (i in $scope.package_config[category][subname]) {
            if (i !== name) {
              delete $scope.package_config[category][subname][i];
            }
            _results.push((function() {
              var _ref, _results1;
              _ref = $scope.metaData;
              _results1 = [];
              for (metaKey in _ref) {
                metaValue = _ref[metaKey];
                if (metaValue.category === category) {
                  _results1.push((function() {
                    var _ref1, _results2;
                    _ref1 = metaValue.data;
                    _results2 = [];
                    for (serialNum in _ref1) {
                      content = _ref1[serialNum];
                      _results2.push((function() {
                        var _ref2, _results3;
                        _ref2 = content.content;
                        _results3 = [];
                        for (content_data_key in _ref2) {
                          content_data_value = _ref2[content_data_key];
                          _results3.push((function() {
                            var _ref3, _results4;
                            _ref3 = content_data_value.content_data;
                            _results4 = [];
                            for (detail_data_key in _ref3) {
                              detail_data_value = _ref3[detail_data_key];
                              if (detail_data_key === value) {
                                _results4.push((function() {
                                  var _i, _len, _results5;
                                  _results5 = [];
                                  for (_i = 0, _len = detail_data_value.length; _i < _len; _i++) {
                                    i = detail_data_value[_i];
                                    if (!$scope.package_config[category][subname][i.name]) {
                                      if (!i.hint) {
                                        _results5.push($scope.package_config[category][subname][i.name] = [""]);
                                      } else {
                                        _results5.push($scope.package_config[category][subname][i.name] = [i.hint]);
                                      }
                                    } else {
                                      _results5.push(void 0);
                                    }
                                  }
                                  return _results5;
                                })());
                              } else {
                                _results4.push(void 0);
                              }
                            }
                            return _results4;
                          })());
                        }
                        return _results3;
                      })());
                    }
                    return _results2;
                  })());
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          }
          return _results;
        };
        keyLength_service_credentials = Object.keys($scope.service_credentials).length;
        $scope.editServiceMode = [];
        $scope.editServiceMode.length = keyLength_service_credentials;
        keyLength_console_credentials = Object.keys($scope.console_credentials).length;
        $scope.editMgntMode = [];
        $scope.editMgntMode.length = keyLength_console_credentials;
        return $scope.mgmtAccordion = {};
      };

      WizardService.prototype.roleAssignInit = function($scope) {
        var colors;
        $scope.cluster = this.wizardFactory.getClusterInfo();
        colors = ['#a4ebc6', '#cbe375', '#f5d185', '#ee9f97', '#de8ea8', '#8a8ae7', '#85c9fc', '#ffdc4d', '#f2af58', '#f1a3d7', '#e0a9f8', '#88e8db', '#7dc9df', '#bfbfbf', '#bece91', '#84efa7'];
        $scope.servers = this.wizardFactory.getServers();
        $scope.existingRoles = [];
        $scope.realRole = [];
        this.getServerColumns().success(function(data) {
          return $scope.server_columns = data.showless;
        });
        return this.getClusterById($scope.cluster.id).success(function(data) {
          var key, role, role_key, server_role, server_role_key, value, _ref, _ref1, _results;
          $scope.roles = data.flavor.roles;
          _ref = $scope.roles;
          for (role_key in _ref) {
            role = _ref[role_key];
            role.color = colors[role_key];
            $scope.roles[role_key].dragChannel = role_key;
            $scope.realRole.push(role_key);
          }
          _ref1 = $scope.servers;
          _results = [];
          for (key in _ref1) {
            value = _ref1[key];
            $scope.existingRoles.push(angular.copy($scope.realRole));
            $scope.servers[key].dropChannel = $scope.existingRoles[key].toString();
            _results.push((function() {
              var _ref2, _ref3, _results1;
              _ref2 = $scope.servers[key].roles;
              _results1 = [];
              for (server_role_key in _ref2) {
                server_role = _ref2[server_role_key];
                $scope.server_role = "";
                _ref3 = $scope.roles;
                for (role_key in _ref3) {
                  role = _ref3[role_key];
                  if (server_role.name === $scope.roles[role_key].name) {
                    $scope.server_role = role_key;
                  }
                }
                _results1.push(server_role.color = colors[$scope.server_role]);
              }
              return _results1;
            })());
          }
          return _results;
        });
      };

      WizardService.prototype.networkMappingInit = function($scope) {
        var key, value, _ref, _results;
        $scope.cluster = this.wizardFactory.getClusterInfo();
        $scope.interfaces = this.wizardFactory.getInterfaces();
        $scope.original_networking = this.wizardFactory.getNetworkMapping();
        _ref = $scope.interfaces;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push($scope.interfaces[key].dropChannel = "others");
        }
        return _results;

        /* drag options for networks
        $scope.networking = {}
        for key, value of $scope.original_networking
            $scope.networking[key] = {}
            $scope.networking[key].mapping_interface = value
            $scope.networking[key].dragChannel = "others"
             *if key == "external" then $scope.networking[key].dragChannel = "external" else $scope.networking[key].dragChannel = "others"
         * set the interface with promisc mode to be external network  [required]
        for key, value of $scope.interfaces
            if value.is_promiscuous
                $scope.networking["external"].mapping_interface = key
                $scope.interfaces[key].dropChannel = "external"
            if value.is_mgmt
                $scope.networking["mgmt"].mapping_interface = key
         */
      };

      WizardService.prototype.reviewInit = function($scope) {
        $scope.cluster = this.wizardFactory.getClusterInfo();
        $scope.servers = this.wizardFactory.getServers();
        $scope.interfaces = this.wizardFactory.getInterfaces();
        $scope.partition = this.wizardFactory.getPartition();
        $scope.network_mapping = this.wizardFactory.getNetworkMapping();
        $scope.server_credentials = this.wizardFactory.getServerCredentials();
        $scope.service_credentials = this.wizardFactory.getServiceCredentials();
        $scope.console_credentials = this.wizardFactory.getConsoleCredentials();
        $scope.global_config = this.wizardFactory.getGeneralConfig();
        $scope.os_global_config = this.wizardFactory.getOsGlobalConfig();
        $scope.packageConfig = this.wizardFactory.getPackageConfig();
        if ($scope.packageConfig.ceph_config) {
          $scope.cephConfig = $scope.packageConfig.ceph_config;
        }
        if ($scope.packageConfig.neutron_config) {
          $scope.neutronConfig = $scope.packageConfig.neutron_config;
        }
        this.getServerColumns().success(function(data) {
          var index, temp, value, _i, _len, _ref, _results;
          $scope.server_columns = data.review;
          console.log(data.review);
          _ref = data.review;
          _results = [];
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            value = _ref[index];
            if (value.title === "Hostname") {
              temp = $scope.server_columns[0];
              $scope.server_columns[0] = value;
              $scope.server_columns[index] = temp;
            }
            if (value.title === "Host MAC Addr") {
              temp = $scope.server_columns[1];
              $scope.server_columns[1] = value;
              $scope.server_columns[index] = temp;
            }
            if (value.title === "Switch IP") {
              temp = $scope.server_columns[2];
              $scope.server_columns[2] = value;
              $scope.server_columns[index] = temp;
            }
            if (value.title === "Port") {
              temp = $scope.server_columns[3];
              $scope.server_columns[3] = value;
              _results.push($scope.server_columns[index] = temp);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
        $scope.tabs = [
          {
            "title": "Database & Queue",
            "url": "service.tpl.html"
          }, {
            "title": "Keystone User",
            "url": "console.tpl.html"
          }
        ];
        if ($scope.currentAdapterName === "ceph_openstack_icehouse") {
          $scope.tabs.push({
            "title": "Ceph",
            "url": "ceph.tpl.html"
          });
        }
        return $scope.currentTab = $scope.tabs[0].url;
      };

      WizardService.prototype.triggerCommitByStepById = function($scope, stepId, nextStepId) {
        var commitState, sendRequest;
        if (nextStepId > stepId) {
          sendRequest = true;
        } else {
          sendRequest = false;
        }
        commitState = {
          "name": $scope.steps[stepId - 1].name,
          "state": "triggered",
          "sendRequest": sendRequest,
          "message": {}
        };
        return this.wizardFactory.setCommitState(commitState);
      };

      WizardService.prototype.watchingCommittedStatus = function($scope) {
        var $modal, $state, showErrorMessage, wizardFactory;
        wizardFactory = this.wizardFactory;
        $state = this.$state;
        $modal = this.$modal;
        showErrorMessage = this.showErrorMessage;
        return $scope.$watch((function() {
          return wizardFactory.getCommitState();
        }), function(newCommitState, oldCommitState) {
          var goToPreviousStep;
          if (newCommitState.state === "success") {
            console.warn("### catch success in wizardCtrl ###", newCommitState, oldCommitState);
            if (newCommitState.name === "review") {
              console.log("### go to overview ###");
              $state.go("cluster.overview", {
                'id': $scope.cluster.id
              });
            }
            $scope.stepControl(goToPreviousStep = false);
            if ($scope.currentStep > $scope.maxStep) {
              $scope.maxStep = $scope.currentStep;
            }
          } else if (newCommitState.state === "invalid") {
            showErrorMessage($modal, "Error Message", newCommitState.message);
          } else if (newCommitState.state === "error") {
            console.warn("### catch error in wizardCtrl ###", newCommitState, oldCommitState);
          } else if (newCommitState.state === "goToPreviousStep") {
            $scope.stepControl(goToPreviousStep = true);
            if ($scope.currentStep > $scope.maxStep) {
              $scope.maxStep = $scope.currentStep;
            }
          }
          return $scope.loading = false;
        });
      };

      WizardService.prototype.showErrorMessage = function($modal, showTitle, showContent) {
        return $modal.open({
          templateUrl: 'src/app/partials/modalErrorMessage.html',
          controller: 'errorMessageCtrl',
          resolve: {
            title: function() {
              return showTitle;
            },
            content: function() {
              return showContent;
            }
          }
        });
      };

      WizardService.prototype.stepControl = function($scope, goToPreviousStep) {
        var i, previousStepsIncomplete, _i, _len, _ref;
        if ($scope.pendingStep <= $scope.maxStep + 1) {
          previousStepsIncomplete = false;
          _ref = $scope.pendingStep - 1;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if ($scope.steps[i].state === "incomplete") {
              previousStepsIncomplete = true;
            }
          }
          if (previousStepsIncomplete) {
            return alert("Please make sure pre-requisite steps are complete.");
          } else {
            this.updateStepProgress($scope, $scope.pendingStep, $scope.currentStep, goToPreviousStep);
            return $scope.currentStep = $scope.pendingStep;
          }
        } else {
          this.showErrorMessage(this.$modal, "Error", "Please complete previous steps first");
          return $scope.pendingStep = $scope.currentStep;
        }
      };

      WizardService.prototype.updateStepProgress = function($scope, newStep, oldStep, goToPreviousStep) {
        $scope.steps[newStep - 1].state = "active";
        if (goToPreviousStep) {
          $scope.steps[oldStep - 1].state = "";
        } else {
          $scope.steps[oldStep - 1].state = "complete";
        }
        $scope.steps[oldStep - 1].state = "complete";
        if ($scope.steps[newStep - 1].name === 'sv_selection') {
          if ($scope.maxStep > $scope.networkStep) {
            $scope.steps[$scope.networkStep].state = "incomplete";
          }
          if ($scope.maxStep > $scope.roleAssignStep) {
            $scope.steps[$scope.roleAssignStep].state = "incomplete";
          }
          if ($scope.maxStep > $scope.networkMappingStep) {
            $scope.steps[$scope.networkMappingStep].state = "incomplete";
          }
        }
        if (newStep === $scope.networkStep + 1 && $scope.maxStep > $scope.networkMappingStep) {
          $scope.steps[$scope.networkMappingStep].state = "incomplete";
        }
        if (oldStep === $scope.steps.length) {
          return $scope.steps[$scope.steps.length - 1].state = "";
        }
      };

      WizardService.prototype.watchingTriggeredStep = function($scope) {
        var wizardFactory;
        wizardFactory = this.wizardFactory;
        return $scope.$watch((function() {
          return wizardFactory.getCommitState();
        }), function(newCommitState, oldCommitState) {
          if (newCommitState.state === "triggered") {
            return $scope.commit(newCommitState.sendRequest);
          }
        });
      };

      WizardService.prototype.svSelectonCommit = function($scope) {
        var addHostsAction, buildMachineObjectHelper, noSelection, selectedServers, server, sv, wizardFactory, _i, _j, _len, _len1, _ref, _ref1;
        $scope.$emit("loading", true);
        selectedServers = [];
        noSelection = true;
        _ref = $scope.allservers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sv = _ref[_i];
          if (sv.selected) {
            noSelection = false;
            selectedServers.push(sv);
          }
        }
        buildMachineObjectHelper = function(server) {
          if (server.reinstallos === void 0) {
            return {
              "machine_id": server.machine_id
            };
          } else {
            return {
              "machine_id": server.machine_id,
              "reinstall_os": server.reinstallos
            };
          }
        };
        if (noSelection) {
          return this.wizardFactory.setCommitState({
            "name": "sv_selection",
            "state": "invalid",
            "message": "Please select at least one server"
          });
        } else {
          wizardFactory = this.wizardFactory;
          addHostsAction = {
            "add_hosts": {
              "machines": []
            }
          };
          _ref1 = $scope.allservers;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            server = _ref1[_j];
            if (server.selected) {
              addHostsAction.add_hosts.machines.push(buildMachineObjectHelper(server));
            }
          }
          this.dataService.postClusterActions($scope.cluster.id, addHostsAction).success(function(data) {
            return wizardFactory.setCommitState({
              "name": "sv_selection",
              "state": "success",
              "message": ""
            });
          }).error(function(response) {
            return wizardFactory.setCommitState({
              "name": "sv_selection",
              "state": "error",
              "message": response
            });
          });
          return wizardFactory.setServers(selectedServers);
        }
      };

      WizardService.prototype.globalCommit = function($scope, sendRequest) {
        var category, content, mdata, message, submitData, wizardFactory, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
        if (!sendRequest) {
          return this.wizardFactory.setCommitState({
            "name": "os_global",
            "state": "goToPreviousStep",
            "message": ""
          });
        }
        $scope.$emit("loading", true);
        wizardFactory = this.wizardFactory;
        submitData = {
          os_config: {}
        };
        _ref = $scope.metaData;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mdata = _ref[_i];
          submitData.os_config[mdata.name] = $scope.os_global_config[mdata.name];
        }
        _ref1 = $scope.metaData;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          category = _ref1[_j];
          _ref2 = category.data;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            content = _ref2[_k];
            if (content.datamatch) {
              delete submitData.os_config[category.name][content.name];
            }
          }
        }
        if ($scope.generalForm.$valid) {
          return this.dataService.updateClusterConfig($scope.cluster.id, submitData).success(function(configData) {
            return wizardFactory.setCommitState({
              "name": "os_global",
              "state": "success",
              "message": ""
            });
          }).error(function(response) {
            return wizardFactory.setCommitState({
              "name": "os_global",
              "state": "error",
              "message": response
            });
          });
        } else {
          if ($scope.generalForm.$error.required) {
            message = "The required(*) fields can not be empty !";
          } else if ($scope.generalForm.$error.match) {
            message = "The passwords do not match";
          }
          return this.wizardFactory.setCommitState({
            "name": "os_global",
            "state": "invalid",
            "message": message
          });
        }
      };

      WizardService.prototype.addInterface = function($scope, newInterface) {
        var isExist, key, value, _ref;
        isExist = false;
        if (!$scope.interfaces) {
          $scope.interfaces = {};
        }
        if (newInterface) {
          _ref = $scope.interfaces;
          for (key in _ref) {
            value = _ref[key];
            if (key === newInterface.name) {
              isExist = true;
              alert("This interface already exists. Please try another one");
            }
          }
          if (!isExist) {
            $scope.interfaces[newInterface.name] = {
              "subnet_id": parseInt(newInterface.subnet_id),
              "is_mgmt": Object.keys($scope.interfaces).length === 0 ? true : false
            };
          }
          return $scope.newInterface = {};
        }
      };

      WizardService.prototype.networkCommit = function($scope, sendRequest) {
        var hostNetworkPromises, hostname, hostnamePromises, interfaceCount, key, network, server, updateHostnamePromise, updateNetworkPromise, value, wizardFactory, _i, _len, _ref, _ref1;
        wizardFactory = this.wizardFactory;
        if (!sendRequest) {
          return this.wizardFactory.setCommitState({
            "name": "network",
            "state": "goToPreviousStep",
            "message": ""
          });
        }
        $scope.$emit("loading", true);
        interfaceCount = Object.keys($scope.interfaces).length;
        if (interfaceCount === 0) {
          alert("Please add interface");
          return;
        }
        hostnamePromises = [];
        hostNetworkPromises = [];
        _ref = $scope.servers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          server = _ref[_i];
          hostname = {
            "name": server["hostname"]
          };
          updateHostnamePromise = this.dataService.putHost(server.id, hostname);
          hostnamePromises.push(updateHostnamePromise);
          _ref1 = server.networks;
          for (key in _ref1) {
            value = _ref1[key];
            if (!$scope.interfaces[key]) {
              continue;
            }
            network = {
              "interface": key,
              "ip": value.ip,
              "subnet_id": parseInt($scope.interfaces[key].subnet_id),
              "is_mgmt": $scope.interfaces[key].is_mgmt,
              "is_promiscuous": $scope.interfaces[key].is_promiscuous
            };
            if (value.id === void 0) {
              updateNetworkPromise = this.dataService.postHostNetwork(server.id, network).success(function(networkData) {
                return server.networks[networkData["interface"]].id = networkData.id;
              });
            } else {
              updateNetworkPromise = this.dataService.putHostNetwork(server.id, value.id, network);
            }
            hostNetworkPromises.push(updateNetworkPromise);
          }
        }
        return this.$q.all(hostnamePromises.concat(hostNetworkPromises)).then(function() {
          wizardFactory.setServers($scope.servers);
          return wizardFactory.setCommitState({
            "name": "network",
            "state": "success",
            "message": ""
          });
        }, function(response) {
          return wizardFactory.setCommitState({
            "name": "network",
            "state": "error",
            "message": response.data
          });
        });
      };

      WizardService.prototype.partitionCommit = function($scope, sendRequest) {
        var newPartition, os_partition, partitionInfo, wizardFactory, _i, _len, _ref;
        wizardFactory = this.wizardFactory;
        if (!sendRequest) {
          this.wizardFactory.setCommitState({
            "name": "partition",
            "state": "goToPreviousStep",
            "message": ""
          });
          return;
        }
        $scope.$emit("loading", true);
        if ($scope.duplicated) {
          return this.wizardFactory.setCommitState({
            "name": "partition",
            "state": "invalid",
            "message": "Mount Point cannot be the same"
          });
        } else {
          newPartition = {};
          _ref = $scope.partitionInforArray;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            partitionInfo = _ref[_i];
            newPartition[partitionInfo['name']] = {};
            newPartition[partitionInfo['name']]['percentage'] = partitionInfo['percentage'];
            newPartition[partitionInfo['name']]['max_size'] = partitionInfo['max_size'];
          }
          this.wizardFactory.setPartition(newPartition);
          os_partition = {
            "os_config": {
              "partition": newPartition
            }
          };
          return this.dataService.updateClusterConfig($scope.cluster.id, os_partition).success(function(configData) {
            return wizardFactory.setCommitState({
              "name": "partition",
              "state": "success",
              "message": ""
            });
          }).error(function(response) {
            return wizardFactory.setCommitState({
              "name": "partition",
              "state": "error",
              "message": response
            });
          });
        }
      };

      WizardService.prototype.addPartition = function($scope) {
        var newRowExist, partitionInfo, _i, _len, _ref;
        newRowExist = false;
        _ref = $scope.partitionInforArray;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          partitionInfo = _ref[_i];
          if (partitionInfo.name === "") {
            newRowExist = true;
          }
        }
        if (!newRowExist && !$scope.duplicated) {
          return $scope.partitionInforArray.push({
            "name": "",
            "percentage": 0,
            "max_size": 0
          });
        }
      };

      WizardService.prototype.mount_point_change = function($scope, index, name) {
        var count, duplicatedIndexContainer, numberOfNames, partitionInfo, _i, _len, _ref;
        duplicatedIndexContainer = [];
        $scope.duplicatedIndexArray = [];
        count = 0;
        $scope.duplicated = false;
        numberOfNames = 0;
        _ref = $scope.partitionInforArray;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          partitionInfo = _ref[_i];
          if (partitionInfo.name === name) {
            numberOfNames++;
            duplicatedIndexContainer.push(count);
          }
          count++;
        }
        if (numberOfNames > 1) {
          $scope.duplicated = true;
          return $scope.duplicatedIndexArray = duplicatedIndexContainer;
        }
      };

      WizardService.prototype.deletePartition = function($scope, index) {
        var emptyRowIndex;
        emptyRowIndex = -1;
        if ($scope.partitionInforArray.length <= 2) {
          if ($scope.partitionInforArray[0]['name'] === "") {
            emptyRowIndex = 0;
          } else if ($scope.partitionInforArray[1]['name'] === "") {
            emptyRowIndex = 1;
          }
          if (emptyRowIndex === index || emptyRowIndex === -1) {
            $scope.partitionInforArray.splice(index);
          }
        } else {
          $scope.partitionInforArray.splice(index, 1);
        }
        if ($scope.duplicatedIndexArray.indexOf(index) >= 0) {
          return $scope.duplicated = false;
        }
      };

      WizardService.prototype.targetSystemConfigCommit = function($scope, sendRequest) {
        var message, targetSysConfigData, wizardFactory;
        wizardFactory = this.wizardFactory;
        if (!sendRequest) {
          wizardFactory.setCommitState({
            "name": "package_config",
            "state": "goToPreviousStep",
            "message": ""
          });
          return;
        }
        $scope.$emit("loading", true);
        targetSysConfigData = {
          "package_config": $scope.package_config
        };
        console.log($scope.package_config);
        if ($scope.packageConfigForm.$valid) {
          return this.dataService.updateClusterConfig($scope.cluster.id, targetSysConfigData).success(function(configData) {
            return wizardFactory.setCommitState({
              "name": "package_config",
              "state": "success",
              "message": ""
            });
          }).error(function(response) {
            return wizardFactory.setCommitState({
              "name": "package_config",
              "state": "error",
              "message": response
            });
          });
        } else {
          if ($scope.packageConfigForm.$error.required) {
            message = "The required(*) fields can not be empty !";
          } else if ($scope.packageConfigForm.$error.match) {
            message = "The passwords do not match";
          }
          return this.wizardFactory.setCommitState({
            "name": "package_config",
            "state": "invalid",
            "message": message
          });
        }
      };

      WizardService.prototype.assignRole = function($scope, role) {
        var server, serverChecked, _i, _j, _len, _len1, _ref, _ref1, _results;
        serverChecked = false;
        _ref = $scope.servers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          server = _ref[_i];
          if (server.checked) {
            serverChecked = true;
          }
        }
        if (!serverChecked) {
          return alert("Please select at least one server");
        } else {
          _ref1 = $scope.servers;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            server = _ref1[_j];
            if (server.checked && !this.checkRoleExist(server.roles, role)) {
              _results.push(server.roles.push(role));
            }
          }
          return _results;
        }
      };

      WizardService.prototype.checkRoleExist = function(existingRoles, newRole) {
        var existingRole, roleExist, _i, _len;
        roleExist = false;
        for (_i = 0, _len = existingRoles.length; _i < _len; _i++) {
          existingRole = existingRoles[_i];
          if (existingRole.name === newRole.name) {
            roleExist = true;
          }
        }
        return roleExist;
      };

      WizardService.prototype.checkExistRolesDrag = function($scope) {
        var key, role, role_key, server_role, server_role_key, value, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
        _ref = $scope.servers;
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _ref1 = $scope.servers[key].roles;
          for (server_role_key = _i = 0, _len = _ref1.length; _i < _len; server_role_key = ++_i) {
            server_role = _ref1[server_role_key];
            _ref2 = $scope.roles;
            for (role_key = _j = 0, _len1 = _ref2.length; _j < _len1; role_key = ++_j) {
              role = _ref2[role_key];
              if ($scope.servers[key].roles[server_role_key].name === $scope.roles[role_key].name) {
                $scope.existingRoles[key].splice(role_key, 1, "p");
              }
            }
          }
          _results.push($scope.servers[key].dropChannel = $scope.existingRoles[key].toString());
        }
        return _results;
      };

      WizardService.prototype.autoAssignRoles = function($scope) {
        var i, loopStep, newRole, roleExist, svIndex, _i, _len, _ref, _results;
        svIndex = 0;
        _ref = $scope.roles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          newRole = _ref[_i];
          i = 0;
          loopStep = 0;
          _results.push((function() {
            var _results1;
            _results1 = [];
            while (i < newRole.count && loopStep < $scope.servers.length) {
              if (svIndex >= $scope.servers.length) {
                svIndex = 0;
              }
              roleExist = this.checkRoleExist($scope.servers[svIndex].roles, newRole);
              if (!roleExist) {
                $scope.servers[svIndex].roles.push(newRole);
                i++;
                loopStep = 0;
              } else {
                loopStep++;
              }
              _results1.push(svIndex++);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      WizardService.prototype.roleAssignCommit = function($scope, sendRequest) {
        var config, data, promises, role, roles, server, updateHAVIP, updateRoles, wizardFactory, _i, _j, _len, _len1, _ref, _ref1;
        wizardFactory = this.wizardFactory;
        if (!sendRequest) {
          wizardFactory.setCommitState({
            "name": "role_assign",
            "state": "goToPreviousStep",
            "message": ""
          });
        }
        $scope.$emit("loading", true);
        promises = [];
        _ref = $scope.servers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          server = _ref[_i];
          roles = [];
          _ref1 = server.roles;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            role = _ref1[_j];
            roles.push(role.name);
          }
          data = {
            "roles": roles
          };
          updateRoles = this.dataService.updateClusterHost($scope.cluster.id, server.id, data);
          promises.push(updateRoles);
        }
        if ($scope.ha_vip) {
          config = {
            "package_config": {
              "ha_vip": $scope.ha_vip
            }
          };
          updateHAVIP = dataService.updateClusterConfig($scope.cluster.id, config);
          promises.push(updateHAVIP);
        }
        return this.$q.all(promises).then(function() {
          return wizardFactory.setCommitState({
            "name": "role_assign",
            "state": "success",
            "message": ""
          });
        }, function(response) {
          return wizardFactory.setCommitState({
            "name": "role_assign",
            "state": "error",
            "message": response.data
          });
        });
      };

      WizardService.prototype.networkMappingCommit = function($scope, packageCfg, sendRequest) {
        var key, network_mapping, networks, value, wizardFactory, _ref;
        wizardFactory = this.wizardFactory;
        if (!sendRequest) {
          wizardFactory.setCommitState({
            "name": "network_mapping",
            "state": "goToPreviousStep",
            "message": ""
          });
        }
        $scope.$emit("loading", true);
        networks = {};
        _ref = $scope.networking;
        for (key in _ref) {
          value = _ref[key];
          networks[key] = value.mapping_interface;
        }
        network_mapping = {
          "package_config": packageCfg
        };
        return this.dataService.updateClusterConfig($scope.cluster.id, network_mapping).success(function(data) {
          wizardFactory.setNetworkMapping(networks);
          wizardFactory.setPackageConfig(network_mapping.package_config);
          return wizardFactory.setCommitState({
            "name": "network_mapping",
            "state": "success",
            "message": ""
          });
        }).error(function(response) {
          return wizardFactory.setCommitState({
            "name": "network_mapping",
            "state": "error",
            "message": response
          });
        });
      };

      WizardService.prototype.reviewCommit = function($scope, sendRequest) {
        var dataService, deployAction, reviewAction, server, wizardFactory, _i, _len, _ref;
        if (!sendRequest) {
          return this.wizardFactory.setCommitState({
            "name": "review",
            "state": "goToPreviousStep",
            "message": ""
          });
        }
        dataService = this.dataService;
        wizardFactory = this.wizardFactory;
        reviewAction = {
          "review": {
            "hosts": []
          }
        };
        deployAction = {
          "deploy": {
            "hosts": []
          }
        };
        _ref = $scope.servers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          server = _ref[_i];
          reviewAction.review.hosts.push(server.id);
          deployAction.deploy.hosts.push(server.id);
        }
        return dataService.postClusterActions($scope.cluster.id, reviewAction).success(function(data) {
          return dataService.postClusterActions($scope.cluster.id, deployAction).success(function(data) {
            return wizardFactory.setCommitState({
              "name": "review",
              "state": "success",
              "message": ""
            });
          }).error(function(data) {
            return console.warn("Deploy hosts error: ", data);
          });
        }).error(function(data) {
          return console.warn("Review hosts error: ", data);
        });
      };

      WizardService.prototype.deploy = function($scope) {
        var step, wizard_complete, _i, _len, _ref;
        wizard_complete = true;
        _ref = $scope.steps;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          step = _ref[_i];
          if (step.name !== "review" && step.state !== "complete") {
            wizard_complete = false;
          }
        }
        if (wizard_complete) {
          return this.wizardFactory.setCommitState({
            "name": "review",
            "state": "triggered",
            "message": "",
            "sendRequest": true
          });
        }
      };

      WizardService.prototype.displayDataInTable = function($scope, data) {
        var $filter, ipAddressPre;
        ipAddressPre = this.ipAddressPre;
        $filter = this.$filter;
        return $scope.tableParams = new this.ngTableParams({
          page: 1,
          count: data.length + 1,
          sorting: {
            mac: 'desc'
          }
        }, {
          counts: [],
          total: data.length,
          sorting: {
            mac: 'desc'
          },
          getData: function($defer, params) {
            var orderBy, orderByColumn, orderBySort, orderedData, reverse;
            reverse = false;
            orderBy = params.orderBy()[0];
            orderBySort = "";
            orderByColumn = "";
            orderedData = {};
            if (orderBy) {
              orderByColumn = orderBy.substring(1);
              orderBySort = orderBy.substring(0, 1);
              if (orderBySort === "+") {
                reverse = true;
              } else {
                reverse = false;
              }
            }
            if (orderedData = params.sorting()) {
              orderedData = $filter('orderBy')(data, function(item) {
                if (orderByColumn === "switch_ip") {
                  return ipAddressPre(item.switch_ip);
                } else {
                  return item[orderByColumn];
                }
              }, reverse);
            } else {
              orderedData = data;
            }
            $scope.servers = orderedData;
            return $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
      };

      WizardService.prototype.getSwitchById = function(id) {
        return this.dataService.getSwitchById(id);
      };

      WizardService.prototype.getSwitchMachines = function(id) {
        return this.dataService.getSwitchMachines(id);
      };

      WizardService.prototype.postSwitchAction = function(id, action) {
        return this.dataService.postSwitchAction(id, action);
      };

      WizardService.prototype.putSwitches = function(id, sw) {
        return this.dataService.putSwitches(id, sw);
      };

      WizardService.prototype.buildOsGlobalConfigByMetaData = function($scope) {
        return this.dataService.getOsGlobalConfigMetaData($scope.cluster.os_id).success(function(data) {
          var category, content, key, values, _results;
          $scope.metaData = data.os_global_config;
          _results = [];
          for (key in data) {
            values = data[key];
            _results.push((function() {
              var _i, _len, _results1;
              _results1 = [];
              for (_i = 0, _len = values.length; _i < _len; _i++) {
                category = values[_i];
                if ($scope.os_global_config[category.name]) {
                  $scope[key][category.name] = $scope.os_global_config[category.name];
                } else {
                  $scope[key][category.name] = {};
                }
                _results1.push((function() {
                  var _j, _len1, _ref, _results2;
                  _ref = category.data;
                  _results2 = [];
                  for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    content = _ref[_j];
                    if (content.default_value && !$scope.os_global_config[category.name][content.name]) {
                      $scope.os_global_config[category.name][content.name] = content.default_value;
                    }
                    if (content.display_type === "multitext") {
                      if ($scope.os_global_config[category.name][content.name]) {
                        _results2.push($scope[key][category.name][content.name] = $scope.os_global_config[category.name][content.name]);
                      } else {
                        _results2.push($scope[key][category.name][content.name] = [""]);
                      }
                    } else {
                      _results2.push(void 0);
                    }
                  }
                  return _results2;
                })());
              }
              return _results1;
            })());
          }
          return _results;
        });
      };

      WizardService.prototype.copyWithHashKey = function(target, source) {
        var index, s, _i, _len, _results;
        index = 0;
        _results = [];
        for (_i = 0, _len = source.length; _i < _len; _i++) {
          s = source[_i];
          target[index]["$$hashKey"] = source[index]["$$hashKey"];
          _results.push(index++);
        }
        return _results;
      };

      WizardService.prototype.getDataService = function() {
        return this.dataService;
      };

      WizardService.prototype.addUploadSwitches = function($scope, allSwitches, allMachines) {
        var addUploadMachines, componets, dataService, postData, s, switches, temp, _i, _len;
        $scope.switchLoading = true;
        addUploadMachines = this.addUploadMachines;
        dataService = this.dataService;
        switches = $scope.switchFile.split("\n");
        postData = [];
        for (_i = 0, _len = switches.length; _i < _len; _i++) {
          s = switches[_i];
          if (s.indexOf(',') === -1) {
            continue;
          }
          componets = s.split(',');
          temp = {};
          temp.credentials = {};
          if (componets[0]) {
            temp.ip = componets[0];
          }
          if (componets[1]) {
            temp.vendor = componets[1];
          }
          if (componets[2]) {
            temp.credentials.version = componets[2];
          }
          if (componets[3]) {
            temp.credentials.community = componets[3];
          }
          postData.push(temp);
        }
        return dataService.uploadSwitches(postData).success(function(data) {
          var _j, _len1, _ref;
          $scope.uploadSwitchesReturn = data;
          _ref = data.switches;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            s = _ref[_j];
            allSwitches.push(s);
          }
          $scope.switchLoading = false;
          if ($scope.machineFile) {
            return addUploadMachines($scope, allMachines, dataService);
          }
        });
      };

      WizardService.prototype.addUploadMachines = function($scope, allMachines, dataService) {
        var componets, m, machines, postData, temp, _i, _len;
        $scope.machineLoading = true;
        machines = $scope.machineFile.split("\n");
        postData = [];
        for (_i = 0, _len = machines.length; _i < _len; _i++) {
          m = machines[_i];
          if (m.indexOf(',') === -1) {
            continue;
          }
          componets = m.split(',');
          temp = {};
          if (componets[0]) {
            temp.mac = componets[0];
          }
          if (componets[1]) {
            temp.port = componets[1];
          }
          if (componets[2]) {
            temp.switch_ip = componets[2];
          }
          postData.push(temp);
        }
        return dataService.uploadMachines(postData).success(function(data) {
          var _j, _len1, _ref;
          $scope.uploadMachinesReturn = data;
          _ref = data.switches_machines;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            m = _ref[_j];
            temp = {};
            temp.id = m.machine_id;
            temp.mac = m.mac;
            temp.port = m.port;
            temp.switch_ip = m.switch_ip;
            temp.switch_id = m.switch_id;
            temp.vlan = m.vlan;
            allMachines.push(temp);
          }
          return $scope.machineLoading = false;
        });
      };

      WizardService.prototype.readDataFromFile = function($scope, selector, target) {
        var reader, selectedFile;
        selectedFile = $(selector).get(0).files[0];
        if (selectedFile) {
          reader = new FileReader();
          reader.readAsText(selectedFile, "UTF-8");
          return reader.onload = function(e) {
            return $scope[target] = reader.result;
          };
        }
      };

      WizardService.prototype.addSingMachine = function($scope, $modalInstance, allMachines) {
        var request;
        request = {};
        request.mac = $scope.newMac;
        request.port = "0";
        return this.dataService.postSigleMachine($scope.selected_switch.id, request).success(function(data) {
          data.switch_ip = $scope.selected_switch.ip;
          allMachines.push(data);
          return $modalInstance.dismiss('ok');
        });
      };

      return WizardService;

    })();
    return angular.module('compass.services').service('wizardService', [
      'dataService', '$state', 'wizardFactory', '$filter', '$q', 'ngTableParams', '$modal', function(dataService, $state, wizardFactory, $filter, $q, ngTableParams, $modal) {
        return new WizardService(dataService, $state, wizardFactory, $filter, $q, ngTableParams, $modal);
      }
    ]);
  });

}).call(this);
