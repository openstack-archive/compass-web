define(['angular'], function() {
    var userProfileModule = angular.module('compass.userProfile', [
        'ui.router',
        'ui.bootstrap'
    ]);

    userProfileModule.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('userProfile', {
                url: '/userProfile',
                //controller: 'userProfileCtrl',
                templateUrl: 'src/app/user/user-profile.html',
                authenticate: true,
                //resolve: {}
            });
    });
})
//combine usersetting and userprofile into a single file?