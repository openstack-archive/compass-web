var app = angular.module('compass.userSetting', [
    'ui.router',
    'ui.bootstrap',
    'ngTable'
    //'ngBootstrap' 
])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('userSetting', {
            url: '/userSetting',
            controller: 'userSettingCtrl',
            templateUrl: 'src/app/user/user-setting.html',
            authenticate: true,
            resolve: {
                userSettingData: function($q, dataService) {
                    var deferred = $q.defer();
                    dataService.getUserSetting().success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                userLogData: function($q, dataService) {
                    var deferred = $q.defer();
                    dataService.getUserLog().success(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        });
})

.controller('userSettingCtrl', function($scope, $state, ngTableParams, $filter, dataService, userSettingData, $modal) {
    $scope.userSetting = userSettingData;
    var data = userSettingData;
    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                $filter('orderBy')(data, params.orderBy()) :
                data;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.edit = function() {
        alert("Edit User?")
    }
    $scope.delete = function() {
        alert("Delete User?")
    }

    $scope.newUser = {};
    $scope.open = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'userSettingModal.html',
            controller: UserModalCtrl,
            resolve: {
                newUser: function() {
                    return $scope.newUser;
                }
            }
        });
        modalInstance.result.then(function(newUser) {

            $scope.newUser = newUser;
            dataService.createUser(newUser).success(function(data, status) {
                //console.log(angular.toJson(newUser));
                $scope.userSetting.push(newUser);
                console.log($scope.userSetting)
                $scope.tableParams.reload();
            });

            $scope.newUser = {};
        }, function() {
            // modal cancelled
        });
    };

})

// Custom Filter to filter through objects
app.filter('orderObjectBy', function() {
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function(a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});

app.controller('userLogCtrl', function($scope, $state, ngTableParams, $filter, dataService) {
    $scope.orderByAttribute = '';
    dataService.getUserLog().success(function(data) {

        // Work around since direct scope changes encounter bugs
        // Custom filter example: http://jsfiddle.net/4tkj8/1/
        $scope.orderByUser = function() {
            $scope.orderByAttribute = 'user_id';
        }
        $scope.userLog = data;
        $scope.userParams = new ngTableParams({
            page: 1,
            count: 10,
        }, {
            total: data.length,
            getData: function($defer, params) {
                var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
})

.directive('match', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});

var UserModalCtrl = function($scope, $modalInstance, newUser) {
    $scope.newUser = newUser;

    $scope.ok = function() {
        $scope.result = 'ok';
        $modalInstance.close($scope.newUser);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $scope.result = 'cancel';
    };
};