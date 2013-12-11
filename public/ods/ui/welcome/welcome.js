steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs'
).then(function($) {
    $.Controller('Ods.Ui.welcome', {}, {
        init: function() {
            this.element.html(this.view('init'));
        },

        'a.btn_continue click': function(el, ev) {
            ev.preventDefault();
            this.options.nav.gotoStep("1");
        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});