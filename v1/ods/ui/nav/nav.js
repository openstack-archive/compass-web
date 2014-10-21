steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    'ods/ui/welcome',
    'ods/ui/features',
    'ods/ui/servers',
    'ods/ui/security',
    'ods/ui/networking',
    'ods/ui/host_config',
    'ods/ui/install_review',
    './views/init.ejs'

).then(function($) {
    $.Controller('Ods.Ui.nav', {}, {
        init: function() {
            this.element.html(this.view('init'));
            this.steps = this.element.find("ul li span");
            this.fixupContentSize();
        },

        gotoStep: function(step) {
            var that = this;
            $.each(this.steps, function(index, value) {
                var el = $(value);
                var s = el.data("step");
                if (step == s) {
                    el.removeClass("inactive");
                    el.addClass("active");
                    return false;
                } else {
                    el.addClass("passed");
                    el.removeClass("active");
                }
            });

            var options = {
                nav: this,
                odsState: this.options.odsState,
                mainBox: this.options.mainBox
            };
            if (step === "1") {
                this.options.mainBox.ods_ui_welcome("destroy");
                this.options.mainBox.ods_ui_features(options);
            } else if (step === "2") {
                this.options.mainBox.ods_ui_features("destroy");
                this.options.mainBox.ods_ui_servers(options);
            } else if (step == "3") {
                this.options.mainBox.ods_ui_servers("destroy");
                this.options.mainBox.ods_ui_security(options);
            } else if (step == "4") {
                this.options.mainBox.ods_ui_security("destroy");
                this.options.mainBox.ods_ui_networking(options);
            } else if (step == "5") {
                this.options.mainBox.ods_ui_networking("destroy");
                this.options.mainBox.ods_ui_host_config(options);
            } else if (step == "6") {
                this.options.mainBox.ods_ui_host_config("destroy");
                this.options.mainBox.ods_ui_install_review(options);
            }
        },

        gobackStep: function(step) {
            var that = this;
            $.each(this.steps, function(index, value) {
                var el = $(value);
                var s = el.data("step");
                if (step == s) {
                    el.removeClass("passed");
                    el.addClass("active");
                } else {
                    if (el.hasClass("active")) {
                        el.removeClass("active");
                        el.addClass("inactive");
                    }
                }
            });

            var options = {
                nav: this,
                odsState: this.options.odsState,
                mainBox: this.options.mainBox
            };
            if (step === "1") {
                this.options.mainBox.ods_ui_servers("destroy");
                this.options.mainBox.ods_ui_features(options);
            } else if (step === "2") {
                this.options.mainBox.ods_ui_security("destroy");
                this.options.mainBox.ods_ui_servers(options);
            } else if (step == "3") {
                this.options.mainBox.ods_ui_networking("destroy");
                this.options.mainBox.ods_ui_security(options);
            } else if (step == "4") {
                this.options.mainBox.ods_ui_host_config("destroy");
                this.options.mainBox.ods_ui_networking(options);
            } else if (step == "5") {
                this.options.mainBox.ods_ui_install_review("destroy");
                this.options.mainBox.ods_ui_host_config(options);
            }
        },

        fixupContentSize: function() {
            var header_height = $('#header').outerHeight();
            var menu_height = $('#menu').outerHeight();
            var footer_height = $('#footer').outerHeight();
            var window_height = $(window).outerHeight();
            var content_height = window_height - header_height - menu_height - footer_height;

            if (content_height > 200) {
                $('#content').height(content_height);
            }
        },

        '{window} resize': function(ev) {
            this.fixupContentSize();
        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});