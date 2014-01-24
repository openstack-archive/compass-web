steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './host_config.css',
    './views/init.ejs',
    './views/server_row.ejs',
    'ods/models/cluster.js',
    'lib/jquery-ui-1.10.3.custom.css',
    'lib/jquery-ui-1.10.3.custom.js',
    'lib/jquery.numeric.js',
    'lib/jquery.multiple.select.js',
    'lib/multiple-select.css'
).then(function($) {
    $.Controller('Ods.Ui.host_config', {}, {
        init: function() {
            this.element.html(this.view('init'));

            $("#clear").click(function() {
                $(".config_hostname input").val("");
            });

            var self = this;

            $("#dialog-confirm").dialog({
                autoOpen: false,
                resizable: false,
                height: 200,
                width: 400,
                modal: true,
                buttons: {
                    "Fill values": function() {
                        var pattern = $("#pattern").val();
                        if (pattern == "Switch IP") {
                            self.fillHostnameBySwitchIp();
                        } else if (pattern == "Switch alias") {
                            self.fillHostnameBySwitchAlias();
                        } else if (pattern == "Host") {
                            self.fillHostnameByServer();
                        }

                        $(this).dialog("close");
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });

            $(".pattern-tip").tooltip({
                items: "[data-geo], [title]",
                content: function() {
                    var element = $(this);
                    if (element.is("[data-geo]")) {
                        return "<div><strong>Switch IP: </strong>" + "Use the IP address and port for the switch to which the host is attached </div>" + "<div><strong>Switch alias: </strong>Use the switch alias for the switch and port to which the host is attached</div>" + "<div><strong>Server: </strong>Auto-increment integer value based on the last generated value</div>";
                    }
                }
            });

            $(".integer").numeric(false, function() {
                this.value = "";
                this.focus();
            });

            // get adapter roles
            this.adapterRoles = [];
            Ods.Adapter.getRoles(this.options.odsState.adapter_id, this.proxy('onGetRoles'), this.proxy('onGetRolesErr'));

            this.server_count = this.options.odsState.servers.length;
        },

        onGetRoles: function(data, textStatus, xhr) {
            steal.dev.log(" *** onGetRoles data *** ", data);
            steal.dev.log(" *** onGetRoles textStatus *** ", textStatus);
            steal.dev.log(" *** onGetRoles xhr *** ", xhr);
            if (xhr.status == 200) {
                this.adapterRoles = data.roles;
                this.filloutTabs();
            }
        },

        onGetRolesErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onGetRoleErr xhr *** ", xhr);
            steal.dev.log(" *** onGetRoleErr status *** ", status);
            steal.dev.log(" *** onGetRoleErr statusText *** ", xhr);
            this.adapterRoles = [];
            this.filloutTabs();

            $('.roles').multipleSelect({
                placeholder: "No roles available",
                selectAll: false
            });

        },

        fillRolesDropdowns: function(el, selectedRoles) {
            for (var i = 0; i < this.adapterRoles.length; i++) {
                el.append("<option value=" + this.adapterRoles[i].name + ">" + this.adapterRoles[i].description + "</option>");
            }
            el.multipleSelect({
                placeholder: "auto",
                selectAll: false
            });
            el.multipleSelect("setSelects", selectedRoles);
        },

        fillHostnameBySwitchIp: function() {
            var serverData = this.options.odsState.servers_config;
            this.server_count = 0;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = key.replace(/\./g, "-") + '-p' + servers[i].port;
                    serverData[key][i]['hostname'] = servers[i]['hostname'];
                    this.server_count++;
                }
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        fillHostnameBySwitchAlias: function() {
            var serverData = this.options.odsState.servers_config;
            var key_index = 1;
            this.server_count = 0;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = "switch" + key_index + '-p' + servers[i].port;
                }
                key_index++;
                this.server_count++;
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        fillHostnameByServer: function() {
            var serverData = this.options.odsState.servers_config;
            var server_index = 1;
            this.server_count = 0;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = "server" + server_index;
                    server_index++;
                    this.server_count++;
                }
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        filloutTabs: function() {
            var serverData = this.options.odsState.servers_config;
            var count = 0;
            for (var key in serverData) {
                $(".switch-navs").append('<div data-switchIp="' + key + '" class="tab_nav">' + key + '</div><br>');
                count ++;
            }
            var panel_minheight = $(".tab_nav").height() * count + 50;
            $(".tab_panel_active").css("min-height", panel_minheight);
            this.tabSelected($(".switch-navs .tab_nav:first-child"));
        },

        tabSelected: function(el) {
            $('#tab1 table tbody tr').remove();
            $(".tab_nav_active").removeClass("tab_nav_active");
            el.addClass("tab_nav_active");

            var switchIp = el.data('switchip');
            var serverData = this.options.odsState.servers_config;
            var servers = serverData[switchIp];
            for (var i = 0; i < servers.length; i++) {
                $('#hostconfig-table tbody').append(this.view('server_row', servers[i]));
                var roles = servers[i].roles;
                var rolesDropdown = $("#hostconfig-table tbody tr").eq(i).find(".roles");
                if(!roles) {
                    roles = [];
                }
                this.fillRolesDropdowns(rolesDropdown, roles);
            }
        },

        '#auto_fill click': function(el, ev) {
            $("#dialog-confirm").dialog("open");
        },

        'updateServersConfig': function() {
            var currentSwitch = $(".tab_nav_active").data('switchip');
            for (var i = 0; i < this.options.odsState.servers_config[currentSwitch].length; i++) {
                this.options.odsState.servers_config[currentSwitch][i].hostname = $("#hostconfig-table tbody tr").eq(i).find(".hostname").val();
                this.options.odsState.servers_config[currentSwitch][i].server_ip = $("#hostconfig-table tbody tr").eq(i).find(".serverIp").val();
                var roles = $("#hostconfig-table tbody tr").eq(i).find(".roles").val();
                if(!roles) {
                    roles = [];
                }
                this.options.odsState.servers_config[currentSwitch][i].roles = roles;
            }
        },

        'div.tab_nav click': function(el, ev) {
            this.updateServersConfig();
            this.tabSelected(el);
        },

        checkNonEmpty: function(el) {
            var value = el.val();
            if (!value) {
                el.addClass('error');
                return false;
            }
            return true;
        },

        '.hostconfig-finish click': function(el, ev) {
            ev.preventDefault();

            var self = this;
            var hasError = false;

            $('#hostconfig-table').find('.non-empty-value').each(function(index, value) {
                if (!self.checkNonEmpty($(value))) {
                    hasError = true;
                }
            });

            $('.partition-div').find('.non-empty-value').each(function(index, value) {
                if (!self.checkNonEmpty($(value))) {
                    hasError = true;
                }
            });

            if($("#spare").hasClass("error") ) {
                hasError = true;
            }

            if (hasError) {
                return;
            }

            $("#continuing").css("opacity", 1);

            this.updateServersConfig();

            var serverData = this.options.odsState.servers_config;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    //var server_id = servers[i]['server_id'];
                    var clusterhost_id = servers[i]['clusterhost_id'];
                    var hostname = servers[i]['hostname'];
                    var server_ip = servers[i]['server_ip'];
                    var roles = servers[i]['roles'];

                    var clusterhostConfigData = {
                        "hostname": hostname,
                        "networking": {
                            "interfaces": {
                                "management": {
                                    "ip": server_ip
                                }
                            }
                        },
                        "roles": roles
                    };

                    Ods.ClusterHost.update(clusterhost_id, clusterhostConfigData, this.proxy('onHostconfigData'), this.proxy('onHostconfigDataErr'));
                }
            }
        },

        /************************************/
        // cluster host update success callback
        /************************************/
        onHostconfigData: function(data, textStatus, xhr) {
            steal.dev.log(" *** onHostconfigData data *** ", data);
            steal.dev.log(" *** onHostconfigData textStatus *** ", textStatus);
            steal.dev.log(" *** onHostconfigData xhr *** ", xhr);

            $("#hostconfig_continue_err").hide();

            if (xhr.status == 200) {
                this.server_count--;
            }

            if (this.server_count == 0) {
                var partitionData = {
                    "partition": "/home " + $("#home").val() + "%;/tmp " + $("#tmp").val() + "%;/var " + $("#var").val() + "%;"
                };
                this.options.odsState.partition = {
                    "tmp": $("#tmp").val(),
                    "slashvar": $("#var").val(),
                    "home": $("#home").val()
                };
                Ods.Cluster.update(this.options.odsState.cluster_id, partitionData, "partition", this.proxy('onLogicPartitionAdded'), this.proxy('onLogicPartitionAddedErr'));
            }
        },

        /************************************/
        // cluster host update error callback
        /************************************/
        onHostconfigDataErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onHostconfigDataErr xhr *** ", xhr);
            steal.dev.log(" *** onHostconfigDataErr status *** ", status);
            steal.dev.log(" *** onHostconfigDataErr statusText *** ", xhr);

            $("#hostconfig_continue_err").html("<span class='errhint'> Error code: " + xhr.status + " </span>");
            $("#hostconfig_continue_err").show();
        },

        /************************************/
        // cluster update (partition) success callback
        /************************************/
        onLogicPartitionAdded: function(data, textStatus, xhr) {
            steal.dev.log(" *** onHostconfigData data *** ", data);
            steal.dev.log(" *** onHostconfigData textStatus *** ", textStatus);
            steal.dev.log(" *** onHostconfigData xhr *** ", xhr);

            $("#hostconfig_continue_err").hide();
            if (xhr.status == 200) { // OK
                $("#continuing").css("opacity", 0);
                this.options.nav.gotoStep("6");
            }
        },

        onLogicPartitionAddedErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onLogicPartitionAddedErr xhr *** ", xhr);
            steal.dev.log(" *** onLogicPartitionAddedErr status *** ", status);
            steal.dev.log(" *** onLogicPartitionAddedErr statusText *** ", xhr);

            $("#hostconfig_continue_err").html("<span class='errhint'> Error code: " + xhr.status + " </span>");
            $("#hostconfig_continue_err").show();

        },

        check_partition: function() {
            var tmp_percent = parseInt($("#tmp").val());
            var var_percent = parseInt($("#var").val());
            var home_percent = parseInt($("#home").val());
            var total = tmp_percent + var_percent + home_percent;
            var spare_percent = 100 - total;
            $("#spare").val(spare_percent);
            if (spare_percent < 30) {
                $("#spare").addClass("error");
                $(".errhint").show();
            } else {
                $("#spare").removeClass("error");
                $(".errhint").hide();
            }
        },

        '.integer keyup': function(el, ev) {
            if($(el).val()) {
                $(el).removeClass("error");
            } else {
                $(el).addClass("error");
            }
            this.check_partition();
        },

        '.hostconfig-back click': function(el, ev) {
            this.options.nav.gobackStep("4");
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