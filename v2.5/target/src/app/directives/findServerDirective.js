(function() {
  define(['./baseDirective'], function() {
    'use strict';
    return angular.module('compass.directives').directive('findservers', [
      'wizardService', '$modal', function(wizardService, $modal) {
        return {
          restrict: 'E',
          scope: {
            newFoundServers: '=results',
            switches: '='
          },
          templateUrl: "src/app/partials/find-new-servers.tpl.html",
          link: function(scope, element, attrs) {
            scope.newFoundServers = [];
            scope.isFindingNewServers = false;
            wizardService.getSwitches().success(function(data) {
              return scope.switches = data;
            });
            scope.findServers = function() {
              var sw, swSelection, triggerToFindServers, _i, _j, _len, _len1, _ref, _ref1, _results;
              swSelection = false;
              _ref = scope.switches;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                sw = _ref[_i];
                if (sw.selected) {
                  swSelection = true;
                }
              }
              triggerToFindServers = function(sw) {
                sw.result = "";
                sw.finished = false;
                return sw.polling = true;
              };
              if (!swSelection) {
                if (!swSelection) {
                  return alert("Please select at least one switch");
                }
              } else {
                scope.isFindingNewServers = true;
                scope.newfoundServers = [];
                _ref1 = scope.switches;
                _results = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  sw = _ref1[_j];
                  if (sw.selected) {
                    _results.push(triggerToFindServers(sw));
                  }
                }
                return _results;
              }
            };
            scope.$watch('switches', function(val) {
              var sw, totalResultReady, _i, _len, _ref;
              totalResultReady = true;
              if (scope.isFindingNewServers) {
                _ref = scope.switches;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  sw = _ref[_i];
                  if (sw.selected && !sw.finished) {
                    if (sw.result === "success") {
                      scope.newFoundServers = scope.newFoundServers.concat(angular.copy(sw.machines));
                      sw.finished = true;
                    } else if (sw.result === "error") {
                      sw.finished = true;
                    } else {
                      totalResultReady = false;
                    }
                  }
                }
                if (totalResultReady) {
                  return scope.isFindingNewServers = false;
                }
              }
            }, true);
            scope.newswitch = {};
            scope.newswitch.credentials = {};
            scope.alerts = [];
            scope.addSwitch = function() {
              return wizardService.postSwitches(scope.newswitch).success(function(switchData) {
                return scope.switches.push(switchData);
              });
            };
            return scope.modifySwitchModal = function(index) {
              var modalInstance;
              modalInstance = $modal.open({
                templateUrl: 'src/app/partials/modalModifySwitch.html',
                controller: 'modifySwitchModalCtrl',
                resolve: {
                  targetSwitch: function() {
                    return scope.switches[index];
                  }
                }
              });
              return modalInstance.result.then(function(targetSwitch) {
                return scope.switches[index] = targetSwitch;
              }, function() {
                return console.log("Modal dismissed");
              });
            };
          }
        };
      }
    ]).directive('switchrow', [
      'wizardService', '$timeout', function(wizardService, $timeout) {
        return {
          restrict: 'A',
          scope: {
            polling: '=',
            switchinfo: '=',
            result: '=',
            machines: '='
          },
          link: function(scope, element, attrs) {
            var checkSwitchCount, checkSwitchState, fireTimer, getMachines;
            checkSwitchCount = 0;
            fireTimer = true;
            getMachines = function() {
              return wizardService.getSwitchMachines(scope.switchinfo.id).success(function(data) {
                scope.polling = false;
                scope.result = "success";
                return scope.machines = data;
              }).error(function(data) {
                scope.polling = false;
                return scope.result = "error";
              });
            };
            checkSwitchState = function() {
              checkSwitchCount++;
              return wizardService.getSwitchById(scope.switchinfo.id).success(function(data) {
                var checkSwitchTimer;
                if (data.state === "under_monitoring") {
                  return getMachines();
                } else if (data.state === "initialized" || data.state === "repolling") {
                  if (fireTimer && checkSwitchCount < 15) {
                    return checkSwitchTimer = $timeout(checkSwitchState, 2000);
                  } else {
                    scope.polling = false;
                    return scope.result = "error";
                  }
                }
              });
            };
            return scope.$watch('polling', function(newval, oldval) {
              if (newval === !oldval) {
                if (newval === true) {
                  checkSwitchCount = 0;
                  return wizardService.postSwitchAction(scope.switchinfo.id, {
                    "find_machines": null
                  }).success(function(data) {
                    return checkSwitchState();
                  });
                }
              }
            });
          }
        };
      }
    ]);
  });

}).call(this);
