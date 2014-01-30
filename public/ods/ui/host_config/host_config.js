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

            var self = this;

            $("#pattern").change(function() {
                var pattern = $("#pattern").val();
                if (pattern == "Switch IP") {
                    $("#custom-pattern").hide();
                } else if (pattern == "Switch alias") {
                    $("#custom-pattern").hide();
                } else if (pattern == "Host") {
                    $("#custom-pattern").hide();
                } else if (pattern == "Custom") {
                    $("#custom-pattern").show();
                }
            });

            $("#dialog-confirm").dialog({
                autoOpen: false,
                resizable: false,
                height: 200,
                width: 500,
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
                        } else if (pattern == "Custom") {
                            self.fillHostnameByCustomStr();
                        }

                        $(this).dialog("close");
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });

            $("#pattern").bind("default.click", function(ev) {
                alert("change");
            });

            $(".pattern-tip").tooltip({
                items: "[data-geo], [title]",
                content: function() {
                    var element = $(this);
                    if (element.is("[data-geo]")) {
                        return "<div><strong>Switch IP: </strong>"
                        + "Use the IP address and port for the switch to which the host is attached </div>"
                        + "<div><strong>Switch alias: </strong>"
                        + "Use the switch alias for the switch and port to which the host is attached</div>"
                        + "<div><strong>Server: </strong>"
                        + "Auto-increment integer value based on the last generated value</div>"
                        + "<div><strong>Custom: </strong>"
                        + "Pre-defined patterns include {switchIp}, {port}, {d.1}, {d.2}, {d.3}, {d.4}, "
                        + "{mgtIpPart1}, {mgtIpPart2}, {mgtIpPart3}, {mgtIpPart4}, "
                        + "{tntIpPart1}, {tntIpPart2}, {tntIpPart3}, {tntIpPart4}</div>";
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

        '#clear-hostconfig click': function(el, ev) {
            ev.preventDefault();
            $(".server-panels input").val("");
            $(".server-panels select").multipleSelect("uncheckAll");
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
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = key.replace(/\./g, "-") + '-p' + servers[i].port;
                    serverData[key][i]['hostname'] = servers[i]['hostname'];
                }
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        fillHostnameBySwitchAlias: function() {
            var serverData = this.options.odsState.servers_config;
            var key_index = 1;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = "switch" + key_index + '-p' + servers[i].port;
                }
                key_index++;
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        fillHostnameByServer: function() {
            var serverData = this.options.odsState.servers_config;
            var server_index = 1;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    servers[i]['hostname'] = "server" + server_index;
                    server_index++;
                }
            }
            this.options.odsState.servers_config = serverData;
            this.tabSelected($(".tab_nav_active"));
        },

        fillHostnameByCustomStr: function() {
            var preDefinedPatterns = ["{switchIp}", "{port}",
                "{d.1}", "{d.2}", "{d.3}", "{d.4}",
                "{mgtIpPart1}", "{mgtIpPart2}", "{mgtIpPart3}", "{mgtIpPart4}",
                "{tntIpPart1}", "{tntIpPart2}", "{tntIpPart3}", "{tntIpPart4}"
            ];
            var customStr = $("#custom-pattern").val();
            var serverData = this.options.odsState.servers_config;
            var server_index = 1;
            var customHostname = "";

            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    customStr = $("#custom-pattern").val();
                    for (var patternIndex = 0; patternIndex < preDefinedPatterns.length; patternIndex++) {
                        if (customStr.indexOf(preDefinedPatterns[patternIndex]) != -1) {
                            switch (patternIndex) {
                                case 0: //{switchIp}
                                    customHostname = customStr.replace("{switchIp}", key.replace(/\./g, "-"));
                                    break;
                                case 1: //{port}
                                    customHostname = customStr.replace("{port}", servers[i].port);
                                    break;
                                case 2: //{d.1}
                                    customHostname = customStr.replace("{d.1}", server_index);
                                    break;
                                case 3: //{d.2}
                                    if (server_index < 10) {
                                        customHostname = customStr.replace("{d.2}", "0" + server_index);
                                    } else {
                                        customHostname = customStr.replace("{d.2}", server_index);
                                    }
                                    break;
                                case 4: //{d.3}
                                    if (server_index < 10) {
                                        customHostname = customStr.replace("{d.3}", "00" + server_index);
                                    } else if (server_index < 100) {
                                        customHostname = customStr.replace("{d.3}", "0" + server_index);
                                    } else {
                                        customHostname = customStr.replace("{d.3}", server_index);
                                    }
                                    break;
                                case 5: //{d.4}
                                    if (server_index < 10) {
                                        customHostname = customStr.replace("{d.4}", "000" + server_index);
                                    } else if (server_index < 100) {
                                        customHostname = customStr.replace("{d.4}", "00" + server_index);
                                    } else if (server_index < 1000) {
                                        customHostname = customStr.replace("{d.4}", "0" + server_index);
                                    } else {
                                        customHostname = customStr.replace("{d.4}", server_index);
                                    }
                                    break;
                                case 6: //{mgtIpPart1}
                                    var mgtIpPart1 = servers[i].management_ip.split(".")[0];
                                    customHostname = customStr.replace("{mgtIpPart1}", mgtIpPart1);
                                    break;
                                case 7: //{mgtIpPart2}
                                    var mgtIpPart2 = servers[i].management_ip.split(".")[1];
                                    customHostname = customStr.replace("{mgtIpPart2}", mgtIpPart2);
                                    break;
                                case 8: //{mgtIpPart3}
                                    var mgtIpPart3 = servers[i].management_ip.split(".")[2];
                                    customHostname = customStr.replace("{mgtIpPart3}", mgtIpPart3);
                                    break;
                                case 9: //{mgtIpPart4}
                                    var mgtIpPart4 = servers[i].management_ip.split(".")[3];
                                    customHostname = customStr.replace("{mgtIpPart4}", mgtIpPart4);
                                    break;
                                case 10: //{tntIpPart1}
                                    var tntIpPart1 = servers[i].tenant_ip.split(".")[0];
                                    customHostname = customStr.replace("{tntIpPart1}", tntIpPart1);
                                    break;
                                case 11: //{tntIpPart2}
                                    var tntIpPart2 = servers[i].tenant_ip.split(".")[1];
                                    customHostname = customStr.replace("{tntIpPart2}", tntIpPart2);
                                    break;
                                case 12: //{tntIpPart3}
                                    var tntIpPart3 = servers[i].tenant_ip.split(".")[2];
                                    customHostname = customStr.replace("{tntIpPart3}", tntIpPart3);
                                    break;
                                case 13: //{tntIpPart4}
                                    var tntIpPart4 = servers[i].tenant_ip.split(".")[3];
                                    customHostname = customStr.replace("{tntIpPart4}", tntIpPart4);
                                    break;
                                default:
                                    customHostname = "";
                                    break;
                            }
                            customStr = customHostname;
                        } // end of if
                    } //end of preDefinedPatterns for loop
                    servers[i]['hostname'] = customHostname;
                    server_index++;
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
                count++;
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
                this.options.odsState.servers_config[currentSwitch][i].management_ip = $("#hostconfig-table tbody tr").eq(i).find(".managenetIp").val();
                this.options.odsState.servers_config[currentSwitch][i].tenant_ip = $("#hostconfig-table tbody tr").eq(i).find(".tenantIp").val();
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
                    //var server_ip = servers[i]['server_ip'];
                    var management_ip = servers[i]['management_ip'];
                    var tenant_ip = servers[i]['tenant_ip'];
                    var roles = servers[i]['roles'];

                    var clusterhostConfigData = {
                        "hostname": hostname,
                        "networking": {
                            "interfaces": {
                                "management": {
                                    "ip": management_ip
                                },
                                "tenant": {
                                    "ip": tenant_ip
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