var app = angular.module('compass', [
    'compass.topnav',
    'compass.wizard',
    'compass.cluster',
    'compass.server',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    app.stateProvider = $stateProvider;
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

app.service('dataService', ['$http',
    function($http) {
        var beUrlBase = 'data'; // URL base for backend ajax call
        var feUrlBase = 'data'; // URL base for frontend ajax call

        this.getWizardSteps = function() {
            return $http.get(feUrlBase + '/wizard_steps.json');
        };

        this.getOsGlobalConfig = function(id) {
            return $http.get(feUrlBase + '/os_global_config.json');
        };

        this.getAllServersInfo = function(cust) {
            return $http.get(beUrlBase + '/servers.json');
        };

        this.getMonitoringNav = function(cust) {
            return $http.get(beUrlBase + '/monitoring_nav.json');
        };
    }
])




/*
.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/wizard' );
})

.run( function run () {
})
*/


/*
compassApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.href === '#' || attrs.href === '#clusterwizard' || attrs.href === '#servers') {

            } else {
                elem.on('click', function(e) {
                    e.preventDefault();
                });
            }
        }
    };
});

*/
