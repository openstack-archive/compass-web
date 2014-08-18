angular.module('compass.monitoring', [
    'ui.router',
    'ui.bootstrap',
    'compass.charts',
    'ngAnimate',
    'angular-rickshaw'
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('cluster.monitoring', {
            url: '/monitoring',
            templateUrl: 'src/app/monitoring/cluster-monitoring.tpl.html',
            authenticate: true
        })
})

.controller('monitoringCtrl', ['$scope',
    function($scope) {
        $scope.options = {
            renderer: 'area'
        };
        $scope.features = {
            hover: {
                xFormatter: function(x) {
                    return 't=' + x;
                },
                yFormatter: function(y) {
                    return '$' + y;
                }
            }
        };
        $scope.series = [{
            name: 'Series 1',
            color: 'steelblue',
            data: [{
                x: 0,
                y: 23
            }, {
                x: 1,
                y: 15
            }, {
                x: 2,
                y: 79
            }, {
                x: 3,
                y: 31
            }, {
                x: 4,
                y: 60
            }]
        }, {
            name: 'Series 2',
            color: 'lightblue',
            data: [{
                x: 0,
                y: 30
            }, {
                x: 1,
                y: 20
            }, {
                x: 2,
                y: 64
            }, {
                x: 3,
                y: 50
            }, {
                x: 4,
                y: 15
            }]
        }];

        $scope.options2 = {
            renderer: 'line'
        };
        $scope.features2 = {
            hover: {
                xFormatter: function(x) {
                    return 't=' + x;
                },
                yFormatter: function(y) {
                    return '$' + y;
                }
            }
        };
        $scope.series2 = [{
            name: 'Series 1',
            color: 'steelblue',
            data: [{
                x: 0,
                y: 23
            }, {
                x: 1,
                y: 15
            }, {
                x: 2,
                y: 79
            }, {
                x: 3,
                y: 31
            }, {
                x: 4,
                y: 60
            }]
        }, {
            name: 'Series 2',
            color: 'lightblue',
            data: [{
                x: 0,
                y: 30
            }, {
                x: 1,
                y: 20
            }, {
                x: 2,
                y: 64
            }, {
                x: 3,
                y: 50
            }, {
                x: 4,
                y: 15
            }]
        }];
    }
])
