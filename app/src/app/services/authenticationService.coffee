define(['./baseService'], -> 
    'use strict';
    class Auth
        constructor: (@dataService) ->

        setCookies: (key, value, exdays, remember) ->
        	if remember
        		d = new Date()
        		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        		expires = "expires=" + d.toUTCString()
        		document.cookie = key + "=" + value + "; " + expires
        	else
        		document.cookie = key + "=" + value 

        getCookie: (key) ->
        	name = key + "="
        	ca = document.cookie.split ';'
        	for temp in ca
        		(temp = temp.substring(1)) while temp.charAt(0) == ' '
        		if temp.indexOf(name) != -1
        			return (temp.substring(name.length, temp.length) == 'true')
        	return ""

        	
        login: (credentials) ->
            @dataService.login(credentials)

        logout: ->
            @dataService.logout()

    angular.module('compass.services').service('authService',['dataService', (dataService) -> new Auth(dataService)])
)