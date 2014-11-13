require.config({
    baseUrl: "src",
    paths: {
        'jquery': '../vendor/jquery/jquery-1.11.1.min',
        'twitterBootstrap': '../vendor/bootstrap/js/bootstrap.min',
        'angular': '../vendor/angular/angular.min',
        'uiRouter': '../vendor/angular-ui-router/angular-ui-router.min',
        'angularMocks': '../vendor/angular/angular-mocks',
        'angularTouch': '../vendor/angular/angular-touch',
        'uiBootstrap': '../vendor/angular-bootstrap/ui-bootstrap-tpls-0.11.0.min',
        'angularTable': '../vendor/ng-table/ng-table.min',
        'angularDragDrop': '../vendor/angular-dragdrop/draganddrop',
        'spin': '../vendor/angular-spinner/spin.min',
        'ngSpinner': '../vendor/angular-spinner/angular-spinner.min',
        'angularAnimate': '../vendor/angular/angular-animate.min',
        'd3': '../vendor/d3/d3.min',
        'nvD3': '../vendor/nvd3/nv.d3.min',
        'ganttChart':'common/gantt-chart-d3v2',
        'moment': '../vendor/angular-daterangepicker/moment.min',
        'daterangepicker': '../vendor/angular-daterangepicker/daterangepicker',
        'ngBsDaterangepicker': '../vendor/angular-daterangepicker/ng-bs-daterangepicker',
        'angularUiTree': '../vendor/angular-ui-tree/angular-ui-tree.min',
        'nvd3Directive': '../vendor/angular-nvd3/angularjs-nvd3-directives.min',

        'login': 'app/login/login',
        'services': 'app/services',
        'appDev': 'app/appDev',
        'clusterList': 'app/cluster/clusterlist',
        'cluster': 'app/cluster/cluster',
        'wizard': 'app/wizard/wizard',
        'topnav': 'app/topnav/topnav',
        'server': 'app/server/server',
        'userProfile': 'app/user/userprofile',
        'userSetting': 'app/user/usersetting',
        'monitoring': 'app/monitoring/monitoring',
        'charts': 'common/charts',
        'findservers': 'common/findservers/findservers'
    },
    shim: {
        "jquery": {
            exports: "jquery"
        },
        "twitterBootstrap": {
            deps: ["jquery"],
            exports: "twitterBootstrap"
        },
        "angular": {
            deps: ['jquery'],
            exports: "angular"
        },
        "angularTable": {
            deps: ["angular"],
            exports: "angularTable"
        },
        "angularMocks": {
            deps: ["angular"],
            exports: "angularMocks"
        },
        "angularTouch": {
            deps: ["angular"],
            exports: "angularTouch"
        },
        "uiBootstrap": {
            deps: ["angular"],
            exports: "uiBootstrap"
        },
        "angularDragDrop": {
            deps: ["angular"],
            exports: "angularDragDrop"
        },
        "uiRouter": {
            deps: ["angular"],
            exports: "uiRouter"

        },
        "spin": {
            //deps:["angular"],
            exports: "spin"
        },
        "ngSpinner": {
            deps: ["angular", "spin"], // may depends on angularspin
            exports: "ngSpinner"
        },
        "angularAnimate": {
            deps: ["angular"],
            exports: "angularAnimate"
        },
        "d3": {
            exports: "d3"
        },
        "nvD3": {
            deps: ["d3"],
            exports: "nvD3"
        },
        "nvd3Directive": {
            deps: ["nvD3"],
            exports: "nvd3Directive"
        },
        "angularUiTree": {
            deps: ["angular"],
            exports: "angularUiTree"
        },
        "moment": {
            exports: "moment"
        },
        "daterangepicker": {
            deps: ["twitterBootstrap", "moment"],
            exports: "daterangepicker"
        },
        "ngBsDaterangepicker": {
            deps: ["moment","daterangepicker", "angular"],
            exports: "ngBsDaterangepicker"
        }
    },

    deps: ['./bootstrap']
});
