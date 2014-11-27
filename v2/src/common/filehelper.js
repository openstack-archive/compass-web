define(['angular', 'fileHelper'], function(angular, fileHelper) {

    var fileReaderModule = angular.module('compass.filereader', []);

    fileReaderModule.directive('fileReader', function() {
        return {
            scope: {
                fileReader: "="
            },
            link: function(scope, element) {
                $(element).on('change', function(changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            scope.$apply(function() {
                                scope.fileReader = csvJSON(contents);
                            });
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    });

    function csvJSON(csv) {

        var lines = csv.split("\r");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }

        return result; //JavaScript object
        //return JSON.stringify(result); //JSON
    }

});