define(['angular', 'app/app'], (ng) ->
    'use strict';
    ng.element(document).ready(() ->
        ng.bootstrap(document, ['compass'])
    )
)