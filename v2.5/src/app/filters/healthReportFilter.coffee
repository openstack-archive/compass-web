define(['./baseFilter'], -> 
  'use strict';

  angular.module('compass.filters')
    .filter 'FilterByCategory', ->
        return (items, categoryName) ->
            filtered = []
            for i in items
                item = i
                if item.category == categoryName
                    filtered.push(item)
            return filtered
    .filter 'nl2br', ['$sce', ($sce)->
            return (text)->
                return text = if text then $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) else ''
    ]
);