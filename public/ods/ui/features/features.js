steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs',
    './views/before_begin.ejs'
).then(function($) {
    $.Controller('Ods.Ui.features', {}, {
        init: function() {
            this.element.html(this.view('init'));
        },

        'a.btn_continue click': function(el, ev) {
            ev.preventDefault();
            if (el.data('step') === 'before_begin') {
                this.options.nav.gotoStep("2");
            } else {
                var live_migration = 0;
                var high_availability = 0;
                if ($('#lm').is(':checked')) {
                    live_migration = 1;
                }
                if ($('#ha').is(':checked')) {
                    high_availability = 1;
                }
                this.options.odsState.feature = {
                    "live_migration": live_migration,
                    "high_availability": high_availability
                };
                this.element.html(this.view('before_begin'));
            }
        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});