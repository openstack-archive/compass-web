define ['./baseDirective'], ->
  'use strict';

  angular.module('compass.directives')
    .directive 'ngKeypress', [->
        return (scope, element, attrs) ->
            element.bind "keydown keypress", (event)->
                if event.which is 9
                    current = attrs.position
                    result = current.split('_')
                    next = result[0]+"_"+(parseInt(result[1])+1)
                    if $("input[data-position=" + next + "]").length
                        $("input[data-position=" + next + "]").focus()
                    else
                        $(".btn-next").focus()
                    event.preventDefault();
    ]