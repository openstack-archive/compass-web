steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/json'
).then(
    './servers.css',
    './views/init.ejs',
    'lib/jquery.dataTables.js',
    //'lib/jquery.dataTables.dataSourcePlugins.js',
    'ods/models/servers.js',
    'ods/models/cluster.js',
    'ods/ui/switch_entry'
).then(function($) {
    $.Controller('Ods.Ui.servers', {}, {
        init: function() {
            this.element.html(this.view('init'));

            // we query up to 10 times. Report an error if any of the switches
            // remains in not_reached status.
            this.queryCount = 0;

            this.displayNodes = [];
            this.dataTableIpAddrSort();
            this.initServerTable();

            this.checked_num = 0;

            this.initServerStep = 1;
            this.machines = [];

            var oldAllServersData = this.options.odsState.machines;
            if (oldAllServersData.length > 0) {
                this.initServerStep = 0;
                this.element.find('div.right-side').show();
                this.dataTable.fnClearTable();
                this.dataTable.fnAddData(oldAllServersData);

                for (var i = 0; i < this.options.odsState.adapters.length; i++) {
                    $("#adapter").append("<option value=\"" + this.options.odsState.adapters[i].id + "\">" + this.options.odsState.adapters[i].name + "</option>");
                }
                $('#adapter').val(String(this.options.odsState.adapter_id));

                var oldSelectedServersData = this.options.odsState.servers;

                for (var i = 0; i < oldSelectedServersData.length; i++) {
                    $(".server_check").each(function(index, element) {
                        if (oldSelectedServersData[i].id == element.value) {
                            element.checked = true;
                            $(element).closest("tr").addClass("highlight");
                        }
                    });
                }
                this.countCheckedServers();
            } else {
                // get adapters
                this.adapters = [];
                Ods.Adapter.get(this.proxy('onGetAdapters'), this.proxy('onGetAdaptersErr'));
            }


            var oldSwitchesData = this.options.odsState.switches;
            var tbody = $(".switchtable tbody");
            if (oldSwitchesData.length > 0) {
                if (this.options.odsState.snmp) {
                    $('#useSNMP').prop('checked', true);
                } else {
                    $('#useSSH').prop('checked', true);
                }

                for (var i = 0; i < oldSwitchesData.length; i++) {
                    tbody.append("<tr class=\"switch_row\"></tr>");
                    var tr = tbody.find("tr:last");
                    tr.ods_ui_switch_entry({
                        "odsState": this.options.odsState,
                        "switchData": oldSwitchesData[i].switch,
                        "first": i == 0,
                        "serverControl": this
                    });
                }
            } else {
                tbody.append("<tr class=\"switch_row\"></tr>");
                var tr = tbody.find("tr:last");
                tr.ods_ui_switch_entry({
                    "odsState": this.options.odsState,
                    "switchData": null,
                    "first": true,
                    "serverControl": this
                });
            }
        },

        dataTableIpAddrSort: function() {
            jQuery.extend(jQuery.fn.dataTableExt.oSort, {
                "ip-address-pre": function(a) {
                    var m = a.split("."),
                        x = "";

                    for (var i = 0; i < m.length; i++) {
                        var item = m[i];
                        if (item.length == 1) {
                            x += "00" + item;
                        } else if (item.length == 2) {
                            x += "0" + item;
                        } else {
                            x += item;
                        }
                    }

                    return x;
                },

                "ip-address-asc": function(a, b) {
                    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                },

                "ip-address-desc": function(a, b) {
                    return ((a < b) ? 1 : ((a > b) ? -1 : 0));
                }
            });
        },

        initServerTable: function() {
            var currNode = [];
            var self = this;
            this.dataTable = $('#tb_server_select').dataTable({
                "sScrollY": "200px",
                "bPaginate": false,
                "bScrollCollapse": true,
                "aoColumns": [{
                    "mData": "id",
                    "mRender": function(data, type, full) {
                        return '<input type="checkbox" class="server_check" value="' + data + '"/>';
                    }
                }, {
                    "mData": "mac"
                }, {
                    "mData": "switch_ip",
                    "sType": "ip-address"
                }, {
                    "mData": "vlan"
                }, {
                    "mData": "port"
                }],
                "aoColumnDefs": [{
                    bSortable: false,
                    aTargets: [0, 1, 3]
                }, {
                    bSearchable: false,
                    aTargets: [0]
                }],
                "aaSorting": [
                    [2, "asc"],
                    [4, "asc"]
                ],
                "fnPreDrawCallback": function(oSettings) {
                    /* reset currNode before each draw*/
                    currNode = [];
                },
                "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    /* push this row of data to currNode array*/
                    currNode.push(nRow);
                },
                "fnDrawCallback": function(oSettings) {
                    /* can now access sorted node array*/
                    self.displayNodes = currNode;
                }
            });

            $('.dataTables_info').remove();
            $('.dataTables_filter input').addClass('serverFilter');
            $('.dataTables_filter input').addClass('rounded');
        },

        removeServersBySwitch: function(switchIp) {
            // remove servers from datatable
            var servers = this.dataTable.fnGetData();
            var serversCount = servers.length;
            var i = 0;
            while (i < serversCount) {

                if (servers[i].switch_ip == switchIp) {
                    this.dataTable.fnDeleteRow(i);
                    servers = this.dataTable.fnGetData();
                    serversCount = servers.length;
                } else {
                    i++;
                }
            }
        },

        'input[name="snmp"] click': function(el, ev) {
            this.options.odsState.attr("snmp", el.val() == "snmp");

            if (el.val() == "snmp") {
                $("#snmpTitle").html("SNMP Version");
                $("#communityTitle").html("Community");
            } else {
                $("#snmpTitle").html("Username");
                $("#communityTitle").html("Password");
            }
        },

        '.server-finish click': function(el, ev) {
            ev.preventDefault();

            if (this.checked_num == 0) {
                alert("Please select at least one server");
            } else {
                $("#continuing").css("opacity", 1);
                this.options.odsState.machines = this.dataTable.fnGetData();

                if (this.initServerStep) {
                    this.options.odsState.adapter_id = parseInt($("#adapter").val());
                    // create cluster
                    Ods.Cluster.create({
                        "cluster": {
                            "name": "",
                            "adapter_id": this.options.odsState.adapter_id
                        }
                    }, this.proxy('onClusterCreated'), this.proxy('onClusterCreatedErr'));
                } else {
                    // replace all hosts in current cluster
                    var cluster_id = this.options.odsState.cluster_id;
                    Ods.Cluster.action(cluster_id, {
                        'replaceAllHosts': this.getSelectedServers()
                    }, this.proxy('onServerAdded'), this.proxy('onServerAddedErr'));
                }

            }
        },

        /************************************/
        // get adapters success callback
        /************************************/
        'onGetAdapters': function(data, textStatus, xhr) {
            if (xhr.status == 200) {
                this.adapters = data.adapters;
                this.options.odsState.adapters = data.adapters;
                if (this.adapters.length > 0) {
                    for (var i = 0; i < this.adapters.length; i++) {
                        $("#adapter").append("<option value=\"" + this.adapters[i].id + "\">" + this.adapters[i].name + "</option>");
                    }
                } else {
                    $("#adapter").append("<option value='-1'>Not Available</option>");
                }
            }
        },

        /************************************/
        // get adapters error callback
        /************************************/
        'onGetAdaptersErr': function(xhr, status, statusText) {
            $("#adapter").append("<option value='-1'>Not Available</option>");
        },

        /************************************/
        // create cluster success callback
        /************************************/
        'onClusterCreated': function(data, textStatus, xhr) {
            steal.dev.log(" *** onClusterCreated data *** ", data);
            steal.dev.log(" *** onClusterCreated textStatus *** ", textStatus);
            steal.dev.log(" *** onClusterCreated xhr *** ", xhr);

            $("#server_continue_err").hide();

            var cluster_id = data.cluster.id;
            this.options.odsState.cluster_id = cluster_id;
            Ods.Cluster.action(cluster_id, {
                'addHosts': this.getSelectedServers()
            }, this.proxy('onServerAdded'), this.proxy('onServerAddedErr'));
        },

        /************************************/
        // create cluster error callback
        /************************************/
        'onClusterCreatedErr': function(xhr, status, statusText) {
            var errMessage = JSON.parse(xhr.responseText).message;
            $("#server_continue_err").html("<span class='errhint'>" + errMessage + "</span>");
            $("#server_continue_err").show();
        },

        'getSelectedServers': function() {
            this.dataTable.fnFilter('');
            var selectedServers = [];

            this.options.odsState.servers = [];
            this.options.odsState.servers_config = [];

            // loop through dataTable nodes to find selected servers
            for (var i = 0; i < this.displayNodes.length; i++) {
                var ckboxTd = $('td', this.displayNodes[i])[0];
                var server_ckbox = $('input', ckboxTd)[0];

                if (server_ckbox.checked == true) {
                    var checkTd = $('td', this.displayNodes[i])[1];
                    var macTd = $('td', this.displayNodes[i])[1];
                    var switchIpTd = $('td', this.displayNodes[i])[2];
                    var vlanTd = $('td', this.displayNodes[i])[3];
                    var portTd = $('td', this.displayNodes[i])[4];

                    var mac = macTd.textContent || macTd.innerText;
                    var switch_ip = switchIpTd.textContent || switchIpTd.innerText;
                    var vlan = vlanTd.textContent || vlanTd.innerText;
                    var port = portTd.textContent || portTd.innerText;
                    var server_id = parseInt(server_ckbox.value);

                    this.options.odsState.servers.push({
                        "id": server_id,
                        "mac": mac,
                        "switch_ip": switch_ip,
                        "vlan": vlan,
                        "port": port
                    });

                    selectedServers.push(server_id);
                }
            }
            return selectedServers;
        },

        'div.add click': function(el, ev) {
            var tbody = el.closest('tbody');

            tbody.append("<tr class=\"switch_row\"></tr>");
            var tr = tbody.find("tr:last");
            tr.ods_ui_switch_entry({
                "odsState": this.options.odsState,
                "switchData": null,
                "first": false,
                "serverControl": this
            });
        },

        '.find_server click': function(el, ev) {
            // remove the error class within the el
            $('.switchtable').find('.error').removeClass('error');
            $(".switchesErr").hide();

            this.dataTable.fnClearTable();

            var self = this;
            var hasError = false;

            this.queryCount = 0;

            // return if the switch_ip/community or username/password input is empty
            $('.switchtable').find('.non-empty-value').each(function(index, value) {
                if ($(value).is(":visible") && !self.checkNonEmpty($(value))) {
                    hasError = true;
                }
            });
            // return if the ip format is not correct
            $('.switchtable').find('.switchIp').each(function(index, value) {
                var isValid = self.validateIpFormat($(value).val());
                if (!isValid) {
                    $(value).addClass("error");
                    hasError = true;
                } else {
                    $(value).removeClass("error");
                }
            });
            if (hasError) {
                return;
            }

            $("#finding-servers").css("opacity", 1);
            $('.find_server').attr("disabled", true);
            $('.find_server').html("Finding...");


            this.options.odsState.switches = [];
            $('.switchtable').find('tr.switch_row').each(function(index, value) {
                $(value).controller().findServers();
            });

            setTimeout(this.proxy('checkSwitchesStatus'), 2000);
        },

        checkSwitchesStatus: function() {
            var switchesFinished = true;
            $('.switchtable').find('tr.switch_row').each(function(index, value) {
                var status = $(value).controller().getSwitchStatus();
                if(status.status == 1) {
                    switchesFinished = false;
                }
            })
            if (switchesFinished) {
                $("#finding-servers").css("opacity", 0);
                $('.find_server').attr("disabled", false);
                $('.find_server').html("Find Servers");
            } else {
                setTimeout(this.proxy('checkSwitchesStatus'), 2000);
            }
        },


        onNewMachines: function(machines) {
            this.element.find('div.right-side').show();
            if ( machines.length > 0) {
                this.dataTable.fnAddData(machines);
                this.machines = this.machines.concat(machines);
                //this.machines = this.options.odsState.machines;
                //this.machines = this.machines.concat(machines);
                this.options.odsState.machines = this.machines;
            }
        },

        /************************************/
        // add server to cluster success callback
        /************************************/
        onServerAdded: function(data, textStatus, xhr) {
            $("#server_continue_err").hide();

            if (xhr.status == 200) { // OK
                // Assume the machine orders are same in returned data (data.cluster_hosts) 
                // and cached data (this.options.odsState.servers)
                for (var i = 0; i < data.cluster_hosts.length; i++) {
                    this.options.odsState.servers[i]['clusterhost_id'] = data.cluster_hosts[i].id;
                }
                $("#continuing").css("opacity", 0);
                this.options.nav.gotoStep("3");
            }
        },

        /************************************/
        // add server to cluster error callback
        /************************************/
        onServerAddedErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onServerAddedErr xhr *** ", xhr);
            steal.dev.log(" *** onServerAddedErr status *** ", status);
            steal.dev.log(" *** onServerAddedErr statusText *** ", statusText);

            var errMessage = JSON.parse(xhr.responseText).message;
            $("#server_continue_err").html("<span class='errhint'>" + errMessage + "</span>");
            $("#server_continue_err").show();
        },

        '.server_check click': function(el, ev) {
            el.closest("tr").toggleClass("highlight");
            if (el.is(':checked') == false && $("#select_all").is(':checked') == true) {
                $("#select_all").prop('checked', false);
            }

            this.countCheckedServers();
        },

        '#select_all click': function(el, ev) {
            if (el.is(':checked')) { // if select all servers
                $(".server_check").prop('checked', true);
                $(".server_check").closest("tr").addClass("highlight");
            } else {
                $(".server_check").prop('checked', false);
                $(".server_check").closest("tr").removeClass("highlight");
            }

            this.countCheckedServers();
        },

        'countCheckedServers': function() {
            this.checked_num = 0;

            for (var i = 0; i < this.dataTable.fnGetNodes().length; i++) {
                var firstTdInTr = $('td', this.dataTable.fnGetNodes()[i])[0];
                var inputInTd = $('input', firstTdInTr)[0];

                if (inputInTd.checked == true) {
                    this.checked_num++;
                }
            }

            $("#selected_num").html(this.checked_num);

        },

        '.serverFilter keyup': function(el, ev) {
            this.countCheckedServers();
        },

        'input.switchIp keyup': function(el, ev) {
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
        
        checkNonEmpty: function(el) {
            var value = el.val();
            if (!value) {
                el.addClass('error');
                return false;
            }
            return true;
        },

        show: function() {

            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});