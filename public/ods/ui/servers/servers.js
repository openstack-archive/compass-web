steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/json'
).then(
    './servers.css',
    './views/init.ejs',
    'lib/jquery.dataTables.js',
    './views/switch_row.ejs',
    'ods/models/servers.js',
    'ods/models/cluster.js'
).then(function($) {
    $.Controller('Ods.Ui.servers', {}, {
        init: function() {
            this.element.html(this.view('init'));

            this.pendingSwitchList = [];

            // we query up to 10 times. Report an error if any of the switches
            // remains in not_reached status.
            this.queryCount = 0;

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
            }


            var oldSwitchesData = this.options.odsState.switches;

            if (oldSwitchesData.length > 0) {
                var tbody = $(".switchtable tbody");

                if (this.options.odsState.snmp) {
                    $('#useSNMP').prop('checked', true);
                } else {
                    $('#useSNMP').prop('checked', false);
                }

                for (var i = 0; i < oldSwitchesData.length; i++) {
                    if (i > 0) {
                        tbody.append(this.view('switch_row'));
                    }
                    if (this.options.odsState.snmp) {
                        $("#snmpTitle").html("SNMP Version");
                        $("#communityTitle").html("Community");
                        $(".switch_row").find(".snmp").show();
                        $(".switch_row").find(".community").show();
                        $(".switch_row").find(".username").hide();
                        $(".switch_row").find(".password").hide();
                    } else {
                        $("#snmpTitle").html("Username");
                        $("#communityTitle").html("Password");
                        $(".switch_row").find(".snmp").hide();
                        $(".switch_row").find(".community").hide();
                        $(".switch_row").find(".username").show();
                        $(".switch_row").find(".password").show();
                    }

                    if (this.options.odsState.snmp) {
                        $(".switch_row").eq(i).find(".switchIp").val(oldSwitchesData[i].switch.ip);
                        $(".switch_row").eq(i).find(".snmp").val(oldSwitchesData[i].switch.credential.version);
                        $(".switch_row").eq(i).find(".community").val(oldSwitchesData[i].switch.credential.community);
                    } else {
                        $(".switch_row").eq(i).find(".switchIp").val(oldSwitchesData[i].switch.ip);
                        $(".switch_row").eq(i).find(".username").val(oldSwitchesData[i].switch.credential.username);
                        $(".switch_row").eq(i).find(".password").val(oldSwitchesData[i].switch.credential.password);
                    }
                }
            }
        },

        initServerTable: function() {
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
                    "mData": "switch_ip"
                }, {
                    "mData": "vlan"
                }, {
                    "mData": "port"
                }],
                "aoColumnDefs": [{
                    bSortable: false,
                    aTargets: [0, 1, 3]
                }],
                "aaSorting": [
                    [2, "asc"],
                    [4, "asc"]
                ]
            });

            $('.dataTables_info').remove();
            $('.dataTables_filter input').addClass('serverFilter');
            $('.dataTables_filter input').addClass('rounded');
        },

        '#useSNMP click': function(el, ev) {
            if ($("#useSNMP:checked").val()) {
                $("#snmpTitle").html("SNMP Version");
                $("#communityTitle").html("Community");
                $(".snmp").show();
                $(".community").show();
                $(".username").hide();
                $(".password").hide();
            } else {
                $("#snmpTitle").html("Username");
                $("#communityTitle").html("Password");
                $(".snmp").hide();
                $(".community").hide();
                $(".username").show();
                $(".password").show();
            }
        },

        '.server-finish click': function(el, ev) {
            ev.preventDefault();

            if (this.checked_num == 0) {
                alert("Please select at least one server");
            } else {
                $("#continuing").css("opacity", 1);

                if (this.initServerStep) {
                    // create cluster
                    Ods.Cluster.create({
                        "cluster": {
                            "name": "",
                            "adapter_id": 1
                        }
                    }, this.proxy('onClusterCreated'), this.proxy('onClusterCreatedErr'));
                    this.options.odsState.adapter_id = 1;
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
            selectedServers = [];

            this.options.odsState.servers = [];
            this.options.odsState.servers_config = [];

            // loop through dataTable nodes to find selected servers
            for (var i = 0; i < this.dataTable.fnGetNodes().length; i++) {
                var ckboxTd = $('td', this.dataTable.fnGetNodes()[i])[0];
                var server_ckbox = $('input', ckboxTd)[0];

                if (server_ckbox.checked == true) {
                    var checkTd = $('td', this.dataTable.fnGetNodes()[i])[1];
                    var macTd = $('td', this.dataTable.fnGetNodes()[i])[1];
                    var switchIpTd = $('td', this.dataTable.fnGetNodes()[i])[2];
                    var vlanTd = $('td', this.dataTable.fnGetNodes()[i])[3];
                    var portTd = $('td', this.dataTable.fnGetNodes()[i])[4];

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
            tbody.append(this.view('switch_row'));

            if (!$("#useSNMP:checked").val()) {
                $(".switch_row").last().find(".snmp").hide();
                $(".switch_row").last().find(".community").hide();
                $(".switch_row").last().find(".username").show();
                $(".switch_row").last().find(".password").show();
            }
        },

        'div.remove click': function(el, ev) {
            var row = el.closest('tr');
            row.remove();
        },

        'a.find_server click': function(el, ev) {
            // remove the error class within the el
            $('.switchtable').find('.error').removeClass('error');
            $(".switchesErr").hide();

            var self = this;
            var hasError = false;
            this.pendingSwitchList.length = 0;
            this.queryCount = 0;

            // return if the switch_ip/community or username/password input is empty
            $('.switchtable').find('.non-empty-value').each(function(index, value) {
                if ($(value).is(":visible") && !self.checkNonEmpty($(value))) {
                    hasError = true;
                }
            });
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

            var switch_count = $(".switch_row").length;
            this.pendingCount = switch_count;
            this.switches = [];

            // loop through switch rows to create new switches
            for (i = 0; i < switch_count; i++) {
                var switch_ip = $(".switch_row").eq(i).find(".switchIp");
                var snmp_version = null,
                    community = null;
                var username = null,
                    password = null;
                var switchData = {};

                if ($("#useSNMP:checked").val()) {
                    this.options.odsState.snmp = 1;
                    snmp_version = $(".switch_row").eq(i).find(".snmp");
                    community = $(".switch_row").eq(i).find(".community");
                    switchData = {
                        "switch": {
                            "ip": switch_ip.val(),
                            "credential": {
                                'version': snmp_version.val(),
                                'community': community.val()
                            }
                        }
                    };
                } else {
                    this.options.odsState.snmp = 0;
                    username = $(".switch_row").eq(i).find(".username");
                    password = $(".switch_row").eq(i).find(".password");
                    switchData = {
                        "switch": {
                            "ip": switch_ip.val(),
                            "credential": {
                                "username": username.val(),
                                "password": password.val()
                            }
                        }
                    };
                }

                this.switches.push(switchData);

                Ods.Switch.create(switchData, this.proxy('onSwitchCreated', i), this.proxy('onSwitchCreateErr', i));
            }
            this.options.odsState.switches = this.switches;

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

        /************************************/
        // switch create success callback
        /************************************/
        onSwitchCreated: function(switchIndex, data, textStatus, xhr) {
            steal.dev.log(" *** onSwitchCreated data *** ", data);
            steal.dev.log(" *** onSwitchCreated textStatus *** ", textStatus);
            steal.dev.log(" *** onSwitchCreated xhr *** ", xhr);

            this.pendingCount--;
            if (xhr.status == 202) { // accepted
                var switchId = data.
                switch.id;
                this.pendingSwitchList.push(switchId);
            }

            if (this.pendingCount == 0) {
                this.checkSwitchState();
            }
        },

        /************************************/
        // switch create error callback
        /************************************/
        onSwitchCreateErr: function(switchIndex, xhr, status, statusText) {
            steal.dev.log(" *** onSwitchCreatErr xhr *** ", xhr);
            steal.dev.log(" *** onSwitchCreatErr status *** ", status);
            steal.dev.log(" *** onSwitchCreatErr statusText *** ", xhr);

            $("#finding-servers").css("opacity", 0);

            if (xhr.status == 409) { // duplicate
                var failedSwitchId = 0;
                if ($.fixture.on == true) {
                    failedSwitchId = statusText.failedSwitch;
                } else {
                    failedSwitchId = JSON.parse(xhr.responseText).failedSwitch;
                }
                steal.dev.log(" *** failed Switch Id *** ", failedSwitchId);
                // PUT switches
                Ods.Switch.update(failedSwitchId, this.switches[switchIndex],
                    this.proxy('onSwitchUpdated', switchIndex), this.proxy('onSwitchUpdateErr'));

            } else if (xhr.status == 400) { //bad request
                $(".switchesErr").html("Switch post error code: 400");
                $(".switchesErr").show();
            } else if (xhr.status == 500) { // internal server error
                $(".switchesErr").html("Switch post error code: 500");
                $(".switchesErr").show();
            }

        },

        /************************************/
        // switch update success callback
        /************************************/
        onSwitchUpdated: function(switchIndex, data, textStatus, xhr) {
            steal.dev.log(" *** onSwitchUpdated data *** ", data);
            steal.dev.log(" *** onSwitchUpdated textStatus *** ", textStatus);
            steal.dev.log(" *** onSwitchUpdated xhr *** ", xhr);

            this.pendingCount--;

            if (xhr.status == 202 || xhr.status == 200) { // accepted or OK
                var switchId = data.
                switch.id;
                this.pendingSwitchList.push(switchId);
            }

            if (this.pendingCount == 0) {
                this.checkSwitchState();
            }

        },

        /************************************/
        // switch create error callback
        /************************************/
        onSwitchUpdateErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onSwitchUpdateErr xhr *** ", xhr);
            steal.dev.log(" *** onSwitchUpdateErr status *** ", status);
            steal.dev.log(" *** onSwitchUpdateErr statusText *** ", statusText);

            $("#finding-servers").css("opacity", 0);

            if (xhr.status == 404) { // not found
                $(".switchesErr").html("Switch update error code: 404");
                $(".switchesErr").show();
            } else if (xhr.status == 400) { // bad request
                $(".switchesErr").html("Switch update error code: 400");
                $(".switchesErr").show();
            } else if (xhr.status == 500) { // internal server error
                $(".switchesErr").html("Switch update error code: 500");
                $(".switchesErr").show();
            }

        },

        checkSwitchState: function() {
            this.queryCount++;
            this.pendingCount = this.pendingSwitchList.length;

            if (this.queryCount > 10) {
                $(".switchesErr").html("There is(are) " + this.pendingCount + " switch(es) not responding now. Please try again later.")
                $(".switchesErr").show();
                $("#finding-servers").css("opacity", 0);
                return;
            }

            var switches = this.pendingSwitchList;
            this.pendingSwitchList = [];
            var count = this.pendingCount;
            for (var i = 0; i < count; i++) {
                Ods.Switch.findOne(switches[i], this.proxy('onFindOneSwitch'), this.proxy('onFindOneSwitchErr'));
            }
        },

        /************************************/
        // find one switch success callback
        /************************************/
        onFindOneSwitch: function(data, textStatus, xhr) {
            steal.dev.log(" *** onFindOneSwitch data *** ", data);
            steal.dev.log(" *** onFindOneSwitch textStatus *** ", textStatus);
            steal.dev.log(" *** onFindOneSwitch xhr *** ", xhr);

            this.pendingCount--;

            if (xhr.status == 200) { //OK
                if (data.
                    switch.state === "under_monitoring") {
                    this.element.find('div.right-side').show();
                    this.dataTable.fnClearTable();

                    this.getServersBySwitch(data.
                        switch.id);
                } else {
                    this.pendingSwitchList.push(data.
                        switch.id);
                }
            }

            if (this.pendingCount == 0) {
                setTimeout(this.proxy('checkSwitchState'), 2000);
            }
        },

        /************************************/
        // find one switch error callback
        /************************************/
        onFindOneSwitchErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onFindOneSwitchErr xhr *** ", xhr);
            steal.dev.log(" *** onFindOneSwitchErr status *** ", status);
            steal.dev.log(" *** onFindOneSwitchErr statusText *** ", statusText);

            $("#finding-servers").css("opacity", 0);
            if (xhr.status == 404) { // not found
                $(".switchesErr").html("Find switch error code: 404");
                $(".switchesErr").show();
            } else if (xhr.status == 500) {
                $(".switchesErr").html("Find switch error code: 500");
                $(".switchesErr").show();
            }

        },

        getServersBySwitch: function(id) {
            Ods.Server.findAll({
                switchId: id
            }, this.proxy('onFindAllServers'));
        },

        /************************************/
        // find all servers success callback
        /************************************/
        onFindAllServers: function(data, textStatus, xhr) {
            steal.dev.log(" *** onFindAllServers data *** ", data);
            steal.dev.log(" *** onFindAllServers textStatus *** ", textStatus);
            steal.dev.log(" *** onFindAllServers xhr *** ", xhr);

            this.dataTable.fnAddData(data.machines);

            this.machines = this.machines.concat(data.machines);

            if (this.pendingCount == 0 && this.pendingSwitchList.length == 0) {
                steal.dev.log("loading finished");
                $("#finding-servers").css("opacity", 0);
                this.options.odsState.machines = this.machines;
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

        show: function() {

            this.element.show();
        },

        hide: function() {
            this.element.hide();
        }
    });
});