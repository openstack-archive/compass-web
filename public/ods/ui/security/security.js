steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs',
    'ods/models/cluster.js'
).then(function($) {
    $.Controller('Ods.Ui.security', {}, {
        init: function() {
            this.element.html(this.view('init'));

            this.prefillSecurity();
        },

        prefillSecurity: function() {
            var oldSecurityData = this.options.odsState.security;
            if (oldSecurityData) {
                $("#server_uname").val(oldSecurityData.server_credentials.username);
                $("#server_pwd").val(oldSecurityData.server_credentials.password);
                $("#server_confirm").val(oldSecurityData.server_credentials.password);

                $("#service_uname").val(oldSecurityData.service_credentials.username);
                $("#service_pwd").val(oldSecurityData.service_credentials.password);
                $("#service_confirm").val(oldSecurityData.service_credentials.password);

                $("#console_uname").val(oldSecurityData.console_credentials.username);
                $("#console_pwd").val(oldSecurityData.console_credentials.password);
                $("#console_confirm").val(oldSecurityData.console_credentials.password);
            }
        },

        '.security-finish click': function(el, ev) {
            ev.preventDefault();
            $("#continuing").css("opacity", 1);

            this.usernameCheck($("#server_uname"), $("#server_uname_err"));
            this.passwordCheck($("#server_pwd"), $("#server_confirm"), $("#server_pwd_err"));
            this.usernameCheck($("#service_uname"), $("#service_uname_err"));
            this.passwordCheck($("#service_pwd"), $("#service_confirm"), $("#service_pwd_err"));
            this.usernameCheck($("#console_uname"), $("#console_uname_err"));
            this.passwordCheck($("#console_pwd"), $("#console_confirm"), $("#console_pwd_err"));

            if ($("input").hasClass("error") == false) {
                var server_username = $("#server_uname").val();
                var server_password = $("#server_pwd").val();
                var service_username = $("#service_uname").val();
                var service_password = $("#service_pwd").val();
                var console_username = $("#console_uname").val();
                var console_password = $("#console_pwd").val();

                var securityData = {
                    "security": {
                        "server_credentials": {
                            "username": server_username,
                            "password": server_password
                        },
                        "service_credentials": {
                            "username": service_username,
                            "password": service_password
                        },
                        "console_credentials": {
                            "username": console_username,
                            "password": console_password
                        }
                    }
                };
                this.options.odsState.security = securityData.security;
                Ods.Cluster.update(this.options.odsState.cluster_id, securityData, "security", this.proxy('onSecurityAdded'), this.proxy('onSecurityAddedErr'));
            }

        },

        /************************************************/
        // cluster update (security) success callback
        /************************************************/
        onSecurityAdded: function(data, textStatus, xhr) {
            steal.dev.log(" *** onSecurityAdded data *** ", data);
            steal.dev.log(" *** onSecurityAdded textStatus *** ", textStatus);
            steal.dev.log(" *** onSecurityAdded xhr *** ", xhr);

            $("#security_continue_err").hide();

            if (xhr.status == 200) { // OK
                $("#continuing").css("opacity", 0);
                this.options.nav.gotoStep("4");
            }
        },

        /************************************************/
        // cluster update (security) error callback
        /************************************************/
        onSecurityAddedErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onSecurityAddedErr xhr *** ", xhr);
            steal.dev.log(" *** onSecurityAddedErr status *** ", status);
            steal.dev.log(" *** onSecurityAddedErr statusText *** ", xhr);

            $("#security_continue_err").html("<span class='errhint'>Error code: " + xhr.status + "</span>");
            $("#security_continue_err").show();
        },

        usernameCheck: function(unameInput, errhint) {
            var unameVal = unameInput.val();
            var unameErr = false;
            if (unameVal == '') {
                unameInput.addClass("error");
                errhint.html("<span class='errhint'>Please enter a username.</span>");
                unameErr = true;
            } else if (unameVal.length < 4) {
                unameInput.addClass("error");
                errhint.html("<span class='errhint'>Username should have at least 4 characters.</span>");
                unameErr = true;
            }

            if (unameErr == false) {
                unameInput.removeClass("error");
                errhint.html("<img src='../img/green_check_16px.png'></img>");
            }
        },

        '#server_uname keyup': function(el, ev) {
            this.usernameCheck($("#server_uname"), $("#server_uname_err"));
        },

        '#service_uname keyup': function(el, ev) {
            this.usernameCheck($("#service_uname"), $("#service_uname_err"));
        },

        '#console_uname keyup': function(el, ev) {
            this.usernameCheck($("#console_uname"), $("#console_uname_err"));
        },

        passwordCheck: function(pwdInput, confirmInput, errhint) {
            var passwordVal = pwdInput.val();
            var checkVal = confirmInput.val();
            var passwordErr = false;

            if (passwordVal == '') {
                pwdInput.addClass("error");
                errhint.html("<span class='errhint'>Please enter a password.</span>");
                passwordErr = true;
            } else if (passwordVal.length < 4 || passwordVal.length > 10) {
                pwdInput.addClass("error");
                errhint.html("<span class='errhint'>Password should have 4-10 characters.</span>");
                passwordErr = true;
            } else if (checkVal == '') {
                confirmInput.addClass("error");
                pwdInput.removeClass("error");
                errhint.html("<span class='errhint'>Please re-enter your password.</span>");
                passwordErr = true;
            } else if (passwordVal != checkVal) {
                confirmInput.addClass("error");
                pwdInput.removeClass("error");
                errhint.html("<span class='errhint'>Passwords do not match.</span>");
                passwordErr = true;
            }
            if (passwordErr == false) {
                pwdInput.removeClass("error");
                confirmInput.removeClass("error");
                errhint.html("<img src='../img/green_check_16px.png'></img>");
            }
        },

        '#server_pwd keyup': function(el, ev) {
            this.usernameCheck($("#server_uname"), $("#server_uname_err"));
            this.passwordCheck($("#server_pwd"), $("#server_confirm"), $("#server_pwd_err"));
        },

        '#server_confirm keyup': function(el, ev) {
            this.usernameCheck($("#server_uname"), $("#server_uname_err"));
            this.passwordCheck($("#server_pwd"), $("#server_confirm"), $("#server_pwd_err"));
        },

        '#service_pwd keyup': function(el, ev) {
            this.usernameCheck($("#service_uname"), $("#service_uname_err"));
            this.passwordCheck($("#service_pwd"), $("#service_confirm"), $("#service_pwd_err"));
        },

        '#service_confirm keyup': function(el, ev) {
            this.usernameCheck($("#service_uname"), $("#service_uname_err"));
            this.passwordCheck($("#service_pwd"), $("#service_confirm"), $("#service_pwd_err"));
        },

        '#console_pwd keyup': function(el, ev) {
            this.usernameCheck($("#console_uname"), $("#console_uname_err"));
            this.passwordCheck($("#console_pwd"), $("#console_confirm"), $("#console_pwd_err"));
        },

        '#console_confirm keyup': function(el, ev) {
            this.usernameCheck($("#console_uname"), $("#console_uname_err"));
            this.passwordCheck($("#console_pwd"), $("#console_confirm"), $("#console_pwd_err"));
        },

        '.security-back click': function(el, ev) {
            this.options.nav.gobackStep("2");
            return false;
        },

        show: function() {
            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});