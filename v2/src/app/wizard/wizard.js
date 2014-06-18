angular.module('compass.wizard', [
    'ui.router',
    'ui.bootstrap'
])

.config(function config($stateProvider) {
    $stateProvider
        .state('wizard', {
            url: '/wizard',
            controller: 'wizardCtrl',
            templateUrl: 'src/app/wizard/wizard.tpl.html'
        });
})

.controller('wizardCtrl', function($scope, dataService) {
    // current step for create-cluster wizard
    $scope.currentStep = 1;

    // get the wizard steps for create-cluster
    dataService.getWizardSteps().success(function(data) {
        // get the wizard steps for os, ts or os_and_ts
        $scope.steps = data["os_and_ts"];

        // change ui steps css if currentStep changes
        $scope.$watch('currentStep', function(newStep, oldStep) {
            if (newStep > 0 && newStep <= $scope.steps.length) {
                if (newStep > oldStep) {
                    $scope.steps[newStep - 1].state = "active";
                    for (var i = 0; i < newStep - 1; i++)
                        $scope.steps[i].state = "complete";
                } else if (newStep < oldStep) {
                    $scope.steps[newStep - 1].state = "active";
                    for (var j = newStep; j < $scope.steps.length; j++)
                        $scope.steps[j].state = "";
                }
            }
        });

        // go to next step
        $scope.stepForward = function() {
            if ($scope.currentStep < $scope.steps.length)
                $scope.currentStep = $scope.currentStep + 1;
        };

        // go to previous step
        $scope.stepBackward = function() {
            if ($scope.currentStep > 1)
                $scope.currentStep = $scope.currentStep - 1;
        };

        // go to step by stepId
        $scope.goToStep = function(stepId) {
            $scope.currentStep = stepId;
        };

    });

    dataService.getAllServersInfo().success(function(data) {
        $scope.servers = data;
        console.log(data);
    });

    dataService.getOsGlobalConfig().success(function(data) {
        $scope.os_global_config = data;
    });
});
