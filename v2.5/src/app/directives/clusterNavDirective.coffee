define(['./baseDirective'], -> 
  'use strict';

  angular.module('compass.directives')
    .directive 'clusternav', ['$timeout', 
      ($timeout) ->
      	return {
            restrict: 'EAC'
            templateUrl: "src/app/partials/cluster-nav.tpl.html"
            controller: 'navCtrl'
            # link: (scope, element, attrs) ->
          #           console.log("inside")
          #           $timeout( ->
          #               $('.nav-list ul a').on 'click touchend', (e) ->
          #                   el = $(this)
          #                   link = el.attr('href')
          #                   window.location = link
          #           ,0)

          #           element.bind '$destroy', ->
          #               $('.nav-list ul a').off('click touchend')
        }
    ]
)