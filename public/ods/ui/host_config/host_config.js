steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './host_config.css',
    './views/init.ejs',
    './views/server_row.ejs',
    './views/pattern_tip.ejs',
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

            $("input:radio[name='fillType']").change(function() {
                var fillType = $("input:radio[name='fillType']:checked").val();
                if(fillType == "autofill") {
                    $("#autofill-panel").show(500);
                    $("#customize-panel").hide(500);
                } else {
                    $("#autofill-panel").hide(500);
                    $("#customize-panel").show(500);
                }
            });

            $("#dialog-confirm").dialog({
                autoOpen: false,
                resizable: false,
                height: 350,
                width: 550,
                modal: true,
                buttons: {
                    "Fill values": function() {
                        var fillType = $("input:radio[name='fillType']:checked").val();
                        
                        if(fillType == "autofill") {
                            var management_auto = $("#management-auto").val();
                            var tenant_auto = $("#tenant-auto").val();
                            var hostname_auto = $("#hostname-auto").val();

                            if (hostname_auto == "Switch IP") {
                                self.fillHostnameBySwitchIp();
                            } else if (hostname_auto == "Switch alias") {
                                self.fillHostnameBySwitchAlias();
                            } else if (hostname_auto == "Host") {
                                self.fillHostnameByServer();
                            }

                            self.fillMgtIpBySequence(parseInt(management_auto));
                            self.fillTntIpBySequence(parseInt(tenant_auto));
                        } else { //customize
                            var management_cust = $("#management-customize").val();
                            var tenant_cust = $("#tenant-customize").val();
                            var hostname_cust = $("#hostname-customize").val();


                            self.fillMgtIpByCustomStr(management_cust);
                            self.fillTntIpByCustomStr(tenant_cust);
                            self.fillHostnameByCustomStr(hostname_cust);
                        }

                        self.tabSelected($(".tab_nav_active"));
                        $(this).dialog("close");
                    },
                    Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });
/*
            $(".pattern-tip").tooltip({
                items: "[data-geo], [title]",
                content: function() {
                    var element = $(this);
                    if (element.is("[data-geo]")) {
                        return self.view('pattern_tip');
                    }
                }
            });
*/
            $( document ).tooltip();

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
        },

        fillHostnameByCustomStr: function(customStr) {
            var preDefinedPatterns = ["{swIpPart1}", "{swIpPart2}", "{swIpPart3}", "{swIpPart4}", "{port}",
                "{mgtIpPart1}", "{mgtIpPart2}", "{mgtIpPart3}", "{mgtIpPart4}",
                "{tntIpPart1}", "{tntIpPart2}", "{tntIpPart3}", "{tntIpPart4}"
            ];
            var swIpPart1 = 0,
                swIpPart2 = 0,
                swIpPart3 = 0,
                swIpPart4 = 0,
                port = 0,
                mgtIpPart1 = 0,
                mgtIpPart2 = 0,
                mgtIpPart3 = 0,
                mgtIpPart4 = 0,
                tntIpPart1 = 0,
                tntIpPart2 = 0,
                tntIpPart3 = 0,
                tntIpPart4 = 0;
                digitNum = 0,
                customCalculation = 0;

            //var regExp = /\[([^)]+\].(\d+))/;
            var regExp = /\[(.*?)\].(\d+)/;
            var originalCustomStr = customStr;
            var replaceStr = "";

            customCalculation = regExp.exec(customStr);
            if (customCalculation) {
                replaceStr = customCalculation[0];
                digitNum = parseInt(customCalculation[2]);
                customCalculation = customCalculation[1].split("].")[0];
            } else {
                regExp = /\[(.*?)\]/;
                customCalculation = regExp.exec(customStr);
                if(customCalculation) {
                    replaceStr = customCalculation[0];
                    customCalculation = customCalculation[1];
                }
            }

            if (!customCalculation) {
                alert("Invalid host name customization");
            } else {
                while (customCalculation.indexOf(preDefinedPatterns[0]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[0], "swIpPart1");
                }
                while (customCalculation.indexOf(preDefinedPatterns[1]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[1], "swIpPart2");
                }
                while (customCalculation.indexOf(preDefinedPatterns[2]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[2], "swIpPart3");
                }
                while (customCalculation.indexOf(preDefinedPatterns[3]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[3], "swIpPart4");
                }
                while (customCalculation.indexOf(preDefinedPatterns[4]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[4], "port");
                }
                while (customCalculation.indexOf(preDefinedPatterns[5]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[5], "mgtIpPart1");
                }
                while (customCalculation.indexOf(preDefinedPatterns[6]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[6], "mgtIpPart2");
                }
                while (customCalculation.indexOf(preDefinedPatterns[7]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[7], "mgtIpPart3");
                }
                while (customCalculation.indexOf(preDefinedPatterns[8]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[8], "mgtIpPart4");
                }
                while (customCalculation.indexOf(preDefinedPatterns[9]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[9], "tntIpPart1");
                }
                while (customCalculation.indexOf(preDefinedPatterns[10]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[10], "tntIpPart2");
                }
                while (customCalculation.indexOf(preDefinedPatterns[11]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[11], "tntIpPartt3");
                }
                while (customCalculation.indexOf(preDefinedPatterns[12]) != -1) {
                    customCalculation = customCalculation.replace(preDefinedPatterns[12], "tntIpPart4");
                }

                var serverData = this.options.odsState.servers_config;
                var originalCustomCalculation = customCalculation;
                for (var key in serverData) {
                    var swIpParts = key.split(".");
                    swIpPart1 = parseInt(swIpParts[0]);
                    swIpPart2 = parseInt(swIpParts[1]);
                    swIpPart3 = parseInt(swIpParts[2]);
                    swIpPart4 = parseInt(swIpParts[3]);

                    var servers = serverData[key];
                    for (var i = 0; i < servers.length; i++) {
                        port = parseInt(servers[i].port);
                        var mgtIpParts = servers[i].management_ip.split(".");
                        mgtIpPart1 = parseInt(mgtIpParts[0]);
                        mgtIpPart2 = parseInt(mgtIpParts[1]);
                        mgtIpPart3 = parseInt(mgtIpParts[2]);
                        mgtIpPart4 = parseInt(mgtIpParts[3]);
                        var tntIpParts = servers[i].tenant_ip.split(".");
                        tntIpPart1 = parseInt(tntIpParts[0]);
                        tntIpPart2 = parseInt(tntIpParts[1]);
                        tntIpPart3 = parseInt(tntIpParts[2]);
                        tntIpPart4 = parseInt(tntIpParts[3]);

                        try {
                            customCalculation = eval(customCalculation);
                            if(digitNum > 1) {
                                customCalculation = this.leftPad(customCalculation, digitNum);
                            }
                            serverData[key][i]['hostname'] = originalCustomStr.replace(replaceStr, customCalculation);
                        } catch (err) {
                            serverData[key][i]['hostname'] = "";
                        }
                        customCalculation = originalCustomCalculation;
                    }
                }
                this.options.odsState.servers_config = serverData;
            }
        },

        leftPad: function(number, targetLength) {
            var output = number + '';
            while (output.length < targetLength) {
                output = '0' + output;
            }
            return output;
        },

        fillMgtIpBySequence: function(interval) {
            var mgtIpStart = this.options.odsState.networking.interfaces.management.ip_start;
            var mgtIpEnd = this.options.odsState.networking.interfaces.management.ip_end;

            var mgtIpStartParts = mgtIpStart.split(".");
            var mgtIpEndParts = mgtIpEnd.split(".");

            var mgtIpParts = [parseInt(mgtIpStartParts[0]), parseInt(mgtIpStartParts[1]), parseInt(mgtIpStartParts[2]), parseInt(mgtIpStartParts[3])];

            var serverData = this.options.odsState.servers_config;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    if (mgtIpParts[3] > 255) {
                        mgtIpParts[3] = mgtIpParts[3] - 256;
                        mgtIpParts[2]++;
                    }
                    if (mgtIpParts[2] > 255) {
                        mgtIpParts[2] = mgtIpParts[2] - 256;
                        mgtIpParts[1]++;
                    }
                    if (mgtIpParts[1] > 255) {
                        mgtIpParts[1] = mgtIpParts[1] - 256;
                        mgtIpParts[0]++;
                    }
                    if (mgtIpParts[0] > 255) {
                        alert("Management IP range is not enough. Please update management IP start and end on Networking page.");
                        serverData[key][i]['management_ip'] = "";
                        return;
                    }
                    serverData[key][i]['management_ip'] = mgtIpParts[0] + "." + mgtIpParts[1] + "." + mgtIpParts[2] + "." + mgtIpParts[3];
                    mgtIpParts[3] = mgtIpParts[3] + interval;
                }
            }
            this.options.odsState.servers_config = serverData;
        },

        fillTntIpBySequence: function(interval) {
            var tntIpStart = this.options.odsState.networking.interfaces.tenant.ip_start;
            var tntIpEnd = this.options.odsState.networking.interfaces.tenant.ip_end;

            var tntIpStartParts = tntIpStart.split(".");
            var tntIpEndParts = tntIpEnd.split(".");

            var tntIpParts = [parseInt(tntIpStartParts[0]), parseInt(tntIpStartParts[1]), parseInt(tntIpStartParts[2]), parseInt(tntIpStartParts[3])];

            var serverData = this.options.odsState.servers_config;
            for (var key in serverData) {
                var servers = serverData[key];
                for (var i = 0; i < servers.length; i++) {
                    if (tntIpParts[3] > 255) {
                        tntIpParts[3] = tntIpParts[3] - 256;
                        tntIpParts[2]++;
                    }
                    if (tntIpParts[2] > 255) {
                        tntIpParts[2] = tntIpParts[2] - 256;
                        tntIpParts[1]++;
                    }
                    if (tntIpParts[1] > 255) {
                        tntIpParts[1] = tntIpParts[1] - 256;
                        tntIpParts[0]++;
                    }
                    if (tntIpParts[0] > 255) {
                        alert("Tenent IP range is not enough. Please update tenant IP start and end on Networking page.");
                        serverData[key][i]['management_ip'] = "";
                        return;
                    }
                    serverData[key][i]['tenant_ip'] = tntIpParts[0] + "." + tntIpParts[1] + "." + tntIpParts[2] + "." + tntIpParts[3];
                    tntIpParts[3] = tntIpParts[3] + interval;
                }
            }
            this.options.odsState.servers_config = serverData;
        },

        fillMgtIpByCustomStr: function(customStr) {
            var preDefinedPatterns = ["{swIpPart1}", "{swIpPart2}", "{swIpPart3}", "{swIpPart4}", "{port}"];
            var swIpPart1 = 0,
                swIpPart2 = 0,
                swIpPart3 = 0,
                swIpPart4 = 0,
                port = 0;
            var regExp = /\[(.*?)\]/;
            customStr = regExp.exec(customStr);
            if (!customStr) {
                alert("Invalid management IP customization");
            } else {
                customStr = customStr[1];
                while (customStr.indexOf(preDefinedPatterns[0]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[0], "swIpPart1");
                }
                while (customStr.indexOf(preDefinedPatterns[1]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[1], "swIpPart2");
                }
                while (customStr.indexOf(preDefinedPatterns[2]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[2], "swIpPart3");
                }
                while (customStr.indexOf(preDefinedPatterns[3]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[3], "swIpPart4");
                }
                while (customStr.indexOf(preDefinedPatterns[4]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[4], "port");
                }
                var mgtIpStart = this.options.odsState.networking.interfaces.management.ip_start;
                var mgtIpEnd = this.options.odsState.networking.interfaces.management.ip_end;
                var mgtIpStartParts = mgtIpStart.split(".");
                var mgtIpEndParts = mgtIpEnd.split(".");
                var mgtIpParts = [parseInt(mgtIpStartParts[0]), parseInt(mgtIpStartParts[1]), parseInt(mgtIpStartParts[2]), parseInt(mgtIpStartParts[3])];

                var serverData = this.options.odsState.servers_config;
                for (var key in serverData) {
                    var swIpParts = key.split(".");
                    swIpPart1 = parseInt(swIpParts[0]);
                    swIpPart2 = parseInt(swIpParts[1]);
                    swIpPart3 = parseInt(swIpParts[2]);
                    swIpPart4 = parseInt(swIpParts[3]);

                    var servers = serverData[key];
                    for (var i = 0; i < servers.length; i++) {
                        port = parseInt(servers[i].port);
                        try {
                            mgtIpParts[3] = eval(customStr);
                            serverData[key][i]['management_ip'] = mgtIpParts[0] + "." + mgtIpParts[1] + "." + mgtIpParts[2] + "." + mgtIpParts[3];
                        } catch (err) {
                            serverData[key][i]['management_ip'] = "";
                        }
                    }
                }
                this.options.odsState.servers_config = serverData;
            }
        },

        fillTntIpByCustomStr: function(customStr) {
            var preDefinedPatterns = ["{swIpPart1}", "{swIpPart2}", "{swIpPart3}", "{swIpPart4}", "{port}"];
            var swIpPart1 = 0,
                swIpPart2 = 0,
                swIpPart3 = 0,
                swIpPart4 = 0,
                port = 0;
            var regExp = /\[(.*?)\]/;
            customStr = regExp.exec(customStr);
            if (!customStr) {
                alert("Invalid tenant IP customization");
            } else {
                customStr = customStr[1];
                while (customStr.indexOf(preDefinedPatterns[0]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[0], "swIpPart1");
                }
                while (customStr.indexOf(preDefinedPatterns[1]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[1], "swIpPart2");
                }
                while (customStr.indexOf(preDefinedPatterns[2]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[2], "swIpPart3");
                }
                while (customStr.indexOf(preDefinedPatterns[3]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[3], "swIpPart4");
                }
                while (customStr.indexOf(preDefinedPatterns[4]) != -1) {
                    customStr = customStr.replace(preDefinedPatterns[4], "port");
                }

                var tntIpStart = this.options.odsState.networking.interfaces.tenant.ip_start;
                var tntIpEnd = this.options.odsState.networking.interfaces.tenant.ip_end;
                var tntIpStartParts = tntIpStart.split(".");
                var tntIpEndParts = tntIpEnd.split(".");
                var tntIpParts = [parseInt(tntIpStartParts[0]), parseInt(tntIpStartParts[1]), parseInt(tntIpStartParts[2]), parseInt(tntIpStartParts[3])];

                var serverData = this.options.odsState.servers_config;
                for (var key in serverData) {
                    var swIpParts = key.split(".");
                    swIpPart1 = parseInt(swIpParts[0]);
                    swIpPart2 = parseInt(swIpParts[1]);
                    swIpPart3 = parseInt(swIpParts[2]);
                    swIpPart4 = parseInt(swIpParts[3]);

                    var servers = serverData[key];
                    for (var i = 0; i < servers.length; i++) {
                        port = parseInt(servers[i].port);
                        try {
                            tntIpParts[3] = eval(customStr);
                            serverData[key][i]['tenant_ip'] = tntIpParts[0] + "." + tntIpParts[1] + "." + tntIpParts[2] + "." + tntIpParts[3];
                        } catch (err) {
                            serverData[key][i]['tenant_ip'] = "";
                        }
                    }
                }
                this.options.odsState.servers_config = serverData;
            }
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