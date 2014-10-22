steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './networking.css',
    './views/init.ejs',
    'ods/models/cluster.js',
    'lib/jquery-ui-1.10.3.custom.css',
    'lib/jquery-ui-1.10.3.custom.js'
).then(function($) {
    $.Controller('Ods.Ui.networking', {}, {
        init: function() {
            this.element.html(this.view('init'));

            this.initAccordion();

            this.nicErr = 0;

            this.prefillNetworking();
        },

        prefillNetworking: function() {
            var oldNetworkingData = this.options.odsState.networking;
            if (oldNetworkingData) {
                $("#global_nameservers").val(oldNetworkingData.global.nameservers);
                $("#global_searchpath").val(oldNetworkingData.global.search_path);
                $("#global_gateway").val(oldNetworkingData.global.gateway);
                $("#global_proxy").val(oldNetworkingData.global.proxy);
                $("#global_ntpserver").val(oldNetworkingData.global.ntp_server);

                $("#mgt_ip_start").val(oldNetworkingData.interfaces.management.ip_start);
                $("#mgt_ip_end").val(oldNetworkingData.interfaces.management.ip_end);
                $("#mgt_netmask").val(oldNetworkingData.interfaces.management.netmask);
                $("#mgt_gateway").val(oldNetworkingData.interfaces.management.gateway);
                $("#mgt_nic").val(oldNetworkingData.interfaces.management.nic);
                $("#mgt_promisc").prop("checked", oldNetworkingData.interfaces.management.promisc ? true : false);

                $("#vnw_ip_start").val(oldNetworkingData.interfaces.tenant.ip_start);
                $("#vnw_ip_end").val(oldNetworkingData.interfaces.tenant.ip_end);
                $("#vnw_netmask").val(oldNetworkingData.interfaces.tenant.netmask);
                $("#vnw_gateway").val(oldNetworkingData.interfaces.tenant.gateway);
                $("#vnw_nic").val(oldNetworkingData.interfaces.tenant.nic);
                $("#vnw_promisc").prop("checked", oldNetworkingData.interfaces.tenant.promisc ? true : false);

                $("#float_ip_start").val(oldNetworkingData.interfaces.public.ip_start);
                $("#float_ip_end").val(oldNetworkingData.interfaces.public.ip_end);
                $("#float_netmask").val(oldNetworkingData.interfaces.public.netmask);
                $("#float_gateway").val(oldNetworkingData.interfaces.public.gateway);
                $("#float_nic").val(oldNetworkingData.interfaces.public.nic);
                $("#float_promisc").prop("checked", oldNetworkingData.interfaces.public.promisc ? true : false);

                $("#storage_ip_start").val(oldNetworkingData.interfaces.storage.ip_start);
                $("#storage_ip_end").val(oldNetworkingData.interfaces.storage.ip_end);
                $("#storage_netmask").val(oldNetworkingData.interfaces.storage.netmask);
                $("#storage_gateway").val(oldNetworkingData.interfaces.storage.gateway);
                $("#storage_nic").val(oldNetworkingData.interfaces.storage.nic);
                $("#storage_promisc").prop("checked", oldNetworkingData.interfaces.storage.promisc ? true : false);
            }
        },

        initAccordion: function() {
            this.accordion = $("#accordion").accordion({
                collapsible: true,
                heightStyle: "content"
            });
            $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
            $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
        },

        checkNonEmpty: function(el) {
            var value = el.val();
            if (!value) {
                el.addClass('error');
                return false;
            }
            return true;
        },

        '.networking-finish click': function(el, ev) {
            ev.preventDefault();

            var self = this;
            var hasError = false;
            // remove the error class within the el
            $('#accordion').find('.error').removeClass('error');

            // return if any required input is empty
            $('#accordion').find('.non-empty-value').each(function(index, value) {
                if (!self.checkNonEmpty($(value))) {
                    hasError = true;
                }
            });
            if (hasError) {
                return;
            }

            //global section
            var global_nameservers = $("#global_nameservers").val();
            var global_searchpath = $("#global_searchpath").val();
            var global_gateway = $("#global_gateway").val();
            var global_proxy = $("#global_proxy").val();
            var global_ntpserver = $("#global_ntpserver").val();
            var global_havip = $("#global_havip").val();

            //management section
            var mgt_ipstart = $("#mgt_ip_start").val();
            var mgt_ipend = $("#mgt_ip_end").val();
            var mgt_netmask = $("#mgt_netmask").val();
            var mgt_gateway = $("#mgt_gateway").val();
            var mgt_nic = $("#mgt_nic").val();
            var mgt_promisc = $("#mgt_promisc").attr("checked") ? 1 : 0;

            //tenant networks section
            var tenant_ipstart = $("#vnw_ip_start").val();
            var tenant_ipend = $("#vnw_ip_end").val();
            var tenant_netmask = $("#vnw_netmask").val();
            var tenant_gateway = $("#vnw_gateway").val();
            var tenant_nic = $("#vnw_nic").val();
            var tenant_promisc = $("#vnw_promisc").attr("checked") ? 1 : 0;

            //public ip range section
            var public_ipstart = $("#float_ip_start").val();
            var public_ipend = $("#float_ip_end").val();
            var public_netmask = $("#float_netmask").val();
            var public_gateway = $("#float_gateway").val();
            var public_nic = $("#float_nic").val();
            var public_promisc = $("#float_promisc").attr("checked") ? 1 : 0;

            //storage ip range section
            var storage_ipstart = $("#storage_ip_start").val();
            var storage_ipend = $("#storage_ip_end").val();
            var storage_netmask = $("#storage_netmask").val();
            var storage_gateway = $("#storage_gateway").val();
            var storage_nic = $("#storage_nic").val();
            var storage_promisc = $("#storage_promisc").attr("checked") ? 1 : 0;


            // verify IP range
            if (!$(".ipaddress").hasClass("error") && this.nicErr == 0) {
                var mgtIpRangeValid = this.verifyIpRange(mgt_ipstart, mgt_ipend, this.options.odsState.servers.length);
                var tenantIpRangeValid = this.verifyIpRange(tenant_ipstart, tenant_ipend, this.options.odsState.servers.length);
/*
                var mindex = mgt_ipstart.lastIndexOf('.') + 1;
                var mgtIpPrefix = mgt_ipstart.substring(0, mindex);
                var mgtIpStartLastDigit = mgt_ipstart.substring(mindex);
                var mgtIpEndLastDigit = mgt_ipend.substring(mindex);

                var tindex = tenant_ipstart.lastIndexOf('.') + 1;
                var tenantIpPrefix = tenant_ipstart.substring(0, tindex);
                var tenantIpStartLastDigit = tenant_ipstart.substring(tindex);
                var tenantIpEndLastDigit = tenant_ipend.substring(tindex);
*/

                if (!mgtIpRangeValid) {
                    alert("The management IP range is not valid.");
                } else if (!tenantIpRangeValid) {
                    alert("The tenant IP range is not valid.");
                } else {
                    // config server ip
                    var server_count = this.options.odsState.servers.length;

                    this.serverData = [];

                    var oldConfigData = this.options.odsState.servers_config;

                    var isConfiged = false;
                    for (var key in oldConfigData) {
                        var servers = oldConfigData[key];
                        for (var i = 0; i < servers.length; i++) {
                            isConfiged = true;
                        }
                    }


                    for (var i = 0; i < server_count; i++) {
                        var server = this.options.odsState.servers[i];

                        if (!isConfiged) {
                            server['hostname'] = '';
                            server['roles'] = [];
                            server['management_ip'] = '';
                            server['tenant_ip'] = '';
                        }

                        //server['server_ip'] = this.startPrefix + (parseInt(this.startLastDigit) + i);

                        var switchIp = server.switch_ip;
                        if (this.serverData[switchIp] == undefined) {
                            this.serverData[switchIp] = [server];
                        } else {
                            this.serverData[switchIp].push(server);
                        }
                    }
                    this.options.odsState.servers_config = this.serverData;
/*
                    var j = 0;
                    var serverData = this.options.odsState.servers_config;
                    for (var key in serverData) {
                        var servers = serverData[key];
                        for (var i = 0; i < servers.length; i++) {
                            serverData[key][i]['management_ip'] = mgtIpPrefix + (parseInt(mgtIpStartLastDigit) + j);
                            serverData[key][i]['tenant_ip'] = tenantIpPrefix + (parseInt(tenantIpStartLastDigit) + j);
                            j++;
                        }
                    }
*/
                    var networkingData = {
                        "networking": {
                            "interfaces": {
                                "management": {
                                    "ip_start": mgt_ipstart,
                                    "ip_end": mgt_ipend,
                                    "netmask": mgt_netmask,
                                    "gateway": mgt_gateway,
                                    "nic": mgt_nic,
                                    "promisc": mgt_promisc
                                },
                                "tenant": {
                                    "ip_start": tenant_ipstart,
                                    "ip_end": tenant_ipend,
                                    "netmask": tenant_netmask,
                                    "gateway": tenant_gateway,
                                    "nic": tenant_nic,
                                    "promisc": tenant_promisc
                                },
                                "public": {
                                    "ip_start": public_ipstart,
                                    "ip_end": public_ipend,
                                    "netmask": public_netmask,
                                    "gateway": public_gateway,
                                    "nic": public_nic,
                                    "promisc": public_promisc
                                },
                                "storage": {
                                    "ip_start": storage_ipstart,
                                    "ip_end": storage_ipend,
                                    "netmask": storage_netmask,
                                    "gateway": storage_gateway,
                                    "nic": storage_nic,
                                    "promisc": storage_promisc
                                }
                            },
                            "global": {
                                "nameservers": global_nameservers,
                                "search_path": global_searchpath,
                                "gateway": global_gateway,
                                "proxy": global_proxy,
                                "ntp_server": global_ntpserver,
                                "ha_vip": global_havip
                            }
                        }
                    };
                    this.options.odsState.networking = networkingData.networking;

                    $("#continuing").css("opacity", 1);
                    Ods.Cluster.update(this.options.odsState.cluster_id, networkingData, "networking", this.proxy('onNetworkingAdded'), this.proxy('onNetworkingAddedErr'));
                }
            }
        },

        /************************************************/
        // cluster update (networking) success callback
        /************************************************/
        onNetworkingAdded: function(data, textStatus, xhr) {
            steal.dev.log(" *** onNetworkingAdded data *** ", data);
            steal.dev.log(" *** onNetworkingAdded textStatus *** ", textStatus);
            steal.dev.log(" *** onNetworkingAdded xhr *** ", xhr);
            $("#networking_continue_err").hide();

            if (xhr.status == 200) {
                $("#continuing").css("opacity", 0);
                this.options.nav.gotoStep("5");
            }
        },

        /************************************************/
        // cluster update (networking) error callback
        /************************************************/
        onNetworkingAddedErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onNetworkingAddedErr xhr *** ", xhr);
            steal.dev.log(" *** onNetworkingAddedErr status *** ", status);
            steal.dev.log(" *** onNetworkingAddedErr statusText *** ", xhr);

            $("#continuing").css("opacity", 0);

            if (xhr.status == 400) { // bad request
                var errMessage = JSON.parse(xhr.responseText).message;
                $("#networking_continue_err").html("<span class='errhint'>" + errMessage + "</span>");
                $("#networking_continue_err").show();
            } else if (xhr.status == 500) {
                $("#networking_continue_err").html("<span class='errhint'>Error code: 500</span>");
                $("#networking_continue_err").show();
            }
        },

        '.nic change': function(el, ev) {
            var management_nic = $("#mgt_nic").val();
            var tenant_nic = $("#vnw_nic").val();
            var public_nic = $("#float_nic").val();
            var storage_nic = $("#storage_nic").val();

            var nicVals = [public_nic, management_nic, tenant_nic, storage_nic];
            var nicConflicts = [0, 0, 0, 0];

            for (var i = 1; i < nicVals.length; i++) {
                if (nicVals[i] == nicVals[0]) {
                    nicConflicts[i] = 1;
                    nicConflicts[0] = 1;
                }
            }

            var okHint = "<img src='../img/green_check_16px.png'></img>";

            this.nicErr = 0;
            if (nicConflicts[0] == 1) {
                this.nicErr = 1;
                $("#float_nic_err").html("<span class='errhint'>Public network cannot share nic with any other network. Please choose another one.</span>");
            } else {
                $("#float_nic_err").html(okHint);
            }

            if (nicConflicts[1] == 1) {
                this.nicErr = 1;
                $("#mgt_nic_err").html("<span class='errhint'>Management network cannot share nic with public network. Please choose another one.</span>");
            } else {
                $("#mgt_nic_err").html(okHint);
            }

            if (nicConflicts[2] == 1) {
                this.nicErr = 1;
                $("#vnw_nic_err").html("<span class='errhint'>Tenant network cannot share nic with any other network. Please choose another one.</span>");
            } else {
                $("#vnw_nic_err").html(okHint);
            }

            if (nicConflicts[3] == 1) {
                this.nicErr = 1;
                $("#storage_nic_err").html("<span class='errhint'>Storage network cannot share nic with public network. Please choose another one.</span>");
            } else {
                $("#storage_nic_err").html(okHint);
            }
        },

        '#mgt_ip_end focus': function(el, ev) {
            ev.preventDefault();
            this.autofillIpRange($("#mgt_ip_start"), $("#mgt_ip_end"));
        },

        '#vnw_ip_end focus': function(el, ev) {
            ev.preventDefault();
            this.autofillIpRange($("#vnw_ip_start"), $("#vnw_ip_end"));
        },

        '#float_ip_end focus': function(el, ev) {
            ev.preventDefault();
            this.autofillIpRange($("#float_ip_start"), $("#float_ip_end"));
        },

        '#storage_ip_end focus': function(el, ev) {
            ev.preventDefault();
            this.autofillIpRange($("#storage_ip_start"), $("#storage_ip_end"));
        },

        autofillIpRange: function(elStart, elEnd) {
            if (elStart.hasClass("error")) {
                return;
            }
            var lastDotIndex = elStart.val().lastIndexOf(".");
            var IpPrefix = elStart.val().substring(0, lastDotIndex + 1);
            var IpEndVal = IpPrefix + "255";
            elEnd.val(IpEndVal);
            var len = IpEndVal.length;
            elEnd[0].setSelectionRange(lastDotIndex + 1, len);
        },

        verifyIpRange: function(start, end, minCount) {
            var rindex = start.lastIndexOf('.') + 1;
            var startPrefix = start.substring(0, rindex);
            var endPrefix = end.substring(0, rindex);
            var startLastDigit = start.substring(rindex);
            var endLastDigit = end.substring(rindex);

            if (startPrefix != endPrefix) {
                return false;
            } else if (parseInt(endLastDigit) - parseInt(startLastDigit) < minCount) {
                return false;
            } else {
                return true;
            }
        },

        'input.ipaddress keyup': function(el, ev) {
            var isValid = this.validateIpFormat(el.val());
            if (!isValid) {
                el.addClass("error");
            } else {
                el.removeClass("error");
            }
        },

        validateIpFormat: function(value) {
            var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (value.match(ipformat)) {
                return true;
            } else {
                return false;
            }
        },

        '.networking-back click': function(el, ev) {
            this.options.nav.gobackStep("3");
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
