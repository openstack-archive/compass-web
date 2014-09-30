define(['angular'], function() {
    var userProfile_module = angular.module('compass.userProfile', [
        'ui.router',
        'ui.bootstrap'
    ])

    userProfile_module.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('userProfile', {
                url: '/userProfile',
                //controller: 'userProfileCtrl',
                templateUrl: 'src/app/user/user-profile.html',
                authenticate: true,
                //resolve: {}
            });
    })
})
//combine usersetting and userprofile into a single file?