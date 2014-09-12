angular.module('compass.login', [
    'compass.services',
    'ui.router',
    'ui.bootstrap'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            controller: 'loginCtrl',
            templateUrl: 'src/app/login/login.tpl.html',
            authenticate: false
        });
})


.controller('loginCtrl', function($scope, authService, $state, rememberMe) {
    $scope.login = function() {
        $scope.alerts = [];
        var credentials = {
            "email": $scope.email,
            "password": $scope.password
        };
        authService.login(credentials).success(function(data) {
            rememberMe.setCookies("isAuthenticated","true",365,Boolean($scope.remember));
            authService.isAuthenticated = true;
            
            $state.transitionTo("clusterList");
        }).error(function(response) {
            console.log(response);
            $scope.alerts.push(response);
        })
    };

    $scope.closeAlert = function() {
        $scope.alerts = [];
    };

})

.directive('setFocus', function() {
    return function(scope, element) {
        element[0].focus();
    };
})

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) { // 13 is enter key

                if (scope.email.trim() != "" && scope.password.trim() != "") {
                    scope.$eval(attrs.ngEnter);
                }

                event.preventDefault();
            }
        });
    };
});
