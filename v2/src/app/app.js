angular.module('compass', [
    //'compassApp.cluster',
    //'compassApp.server',
    'compass.topnav',
    'compass.wizard',
    'compass.cluster',
    'compass.server',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate'
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
