define(['angular'], (ng)-> 
    'use strict';
    class Validation
        constructor: () ->
        # individual validation
        isValidConfirmPassword: (input) ->
            pass = $("input[name=password]").val()
            if input is pass
                return {
                    status: "valid"
                    message: ""
                }
            else
                return {
                    status: "invalid"
                    message: "Passwords do not match"
                }

        # isNumber: (input) ->
        #     if !isNaN(input)
        #         return {
        #             status: "valid"
        #             message: ""
        #         }
        #     else
        #         return {
        #             status: "invalid"
        #             message: "input is not a number"
        #         }
        # maxLength: (input) ->
        #     if input.length > 2
        #         return {
        #             status: "invalid"
        #             message: "max length is 2"
        #         }
                
        #     else
        #         return {
        #             status: "valid"
        #             message: ""
        #         }
        # Group Validation 
        # test: (groupData) ->
        #     console.log("group validate data: ", groupData)
        #     if !groupData.https_proxy && !groupData.http_proxy
        #         return {
        #             status: "invalid"
        #             message: "https proxy and http_proxy can not be both empty!!"
        #         }
        #     else
        #         return {
        #             status: "valid"
        #             message: "example"
        #         }

    ng.module('compass.userLib',[]).service('userValidationLib', ()-> new Validation())
)