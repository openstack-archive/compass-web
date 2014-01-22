steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view',
    'jquery/lang/json'
).then(
    './switch_entry.css',
    './views/init.ejs',
    './views/switch_row.ejs',
    'ods/models/servers.js',
    'ods/models/cluster.js',
    'lib/jquery-ui-1.10.3.custom.js'
).then(function($) {
    $.Controller('Ods.Ui.SwitchEntry', {}, {
        init: function() {
            this.element.html(this.view('init', {
                "first": this.options.first
            }));
            this.switchId = 0;
            this.switchStatus = {
                "status": 0,
                "message": ""
            };
            this.queryCount = 0;
            this.displaySnmp(this.options.odsState.snmp);
            var switchData = this.options.switchData;

            if (switchData) {
                if (this.options.odsState.snmp) {
                    this.find(".switchIp").val(switchData.ip);
                    this.find(".snmp").val(switchData.credential.version);
                    this.find(".community").val(switchData.credential.community);
                } else {
                    this.find(".switchIp").val(switchData.ip);
                    this.find(".username").val(switchData.credential.username);
                    this.find(".password").val(switchData.credential.password);
                }
            }
        },

        findServers: function() {
            this.setSwitchStatus(1, "waiting");
            var switchData = this.getSwitchData();
            Ods.Switch.create(switchData, this.proxy('onSwitchCreated'), this.proxy('onSwitchCreateErr'));
        },

        getSwitchData: function() {
            var snmp_version = null,
                community = null;
            var username = null,
                password = null;
            var switchData = {};

            var ip = this.find('.switchIp').val();

            if ($("#useSNMP:checked").val()) {
                snmp_version = $(".switch_row").eq(i).find(".snmp");
                community = $(".switch_row").eq(i).find(".community");
                switchData = {
                    "switch": {
                        "ip": ip,
                        "credential": {
                            'version': snmp_version.val(),
                            'community': community.val()
                        }
                    }
                };
            } else {
                username = this.find(".username");
                password = this.find(".password");
                switchData = {
                    "switch": {
                        "ip": ip,
                        "credential": {
                            "username": username.val(),
                            "password": password.val()
                        }
                    }
                };
            }
            return switchData;
        },

        'div.switch-refresh img click': function(el, ev) {
            //remove previously found servers in the data table
            var oldSwitchStatus = this.getSwitchStatus().status;
            if(oldSwitchStatus == 2) {
                var switchIp = this.getSwitchData().switch.ip;
                this.options.serverControl.removeServersBySwitch(switchIp);
            }

            this.setSwitchStatus(1, "waiting");
            this.queryCount = 0;
            this.checkSwitchState();
        },

        /************************************/
        // switch create success callback
        /************************************/
        onSwitchCreated: function(data, textStatus, xhr) {
            steal.dev.log(" *** onSwitchCreated data *** ", data);
            steal.dev.log(" *** onSwitchCreated textStatus *** ", textStatus);
            steal.dev.log(" *** onSwitchCreated xhr *** ", xhr);


            if (xhr.status == 202) { // accepted
                this.switchId = data.switch.id;
                this.checkSwitchState();
            }
        },

        /************************************/
        // switch create error callback
        /************************************/
        onSwitchCreateErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onSwitchCreatErr xhr *** ", xhr);
            steal.dev.log(" *** onSwitchCreatErr status *** ", status);
            steal.dev.log(" *** onSwitchCreatErr statusText *** ", xhr);

            if (xhr.status == 409) { // duplicate
                var failedSwitchId = 0;
                if ($.fixture.on == true) {
                    failedSwitchId = statusText.failedSwitch;
                } else {
                    failedSwitchId = JSON.parse(xhr.responseText).failedSwitch;
                }
                steal.dev.log(" *** failed Switch Id *** ", failedSwitchId);
                // PUT switches
                var switchData = this.getSwitchData();
                Ods.Switch.update(failedSwitchId, switchData,
                    this.proxy('onSwitchUpdated'),
                    this.proxy('onSwitchUpdateErr'));
            } else {
                this.setSwitchStatus(3, "POST switch API error");
                //TODO
                /*
                if (xhr.status == 400) { //bad request
                    $(".switchesErr").html("Switch post error code: 400");
                    $(".switchesErr").show();
                } else if (xhr.status == 500) { // internal server error
                    $(".switchesErr").html("Switch post error code: 500");
                    $(".switchesErr").show();
                }
                */
            }
        },

        /************************************/
        // switch update success callback
        /************************************/
        onSwitchUpdated: function(data, textStatus, xhr) {
            steal.dev.log(" *** onSwitchUpdated data *** ", data);
            steal.dev.log(" *** onSwitchUpdated textStatus *** ", textStatus);
            steal.dev.log(" *** onSwitchUpdated xhr *** ", xhr);

            if (xhr.status == 202 || xhr.status == 200) { // accepted or OK
                this.switchId = data.switch.id;
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

            this.setSwitchStatus(3, "PUT switch API error");

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
            if (this.queryCount > 5) {
                this.setSwitchStatus(3, "Timed out in connecting to switch");
                return;
            }
            Ods.Switch.findOne(this.switchId, this.proxy('onFindOneSwitch'), this.proxy('onFindOneSwitchErr'));
        },

        /************************************/
        // find one switch success callback
        /************************************/
        onFindOneSwitch: function(data, textStatus, xhr) {
            steal.dev.log(" *** onFindOneSwitch data *** ", data);
            steal.dev.log(" *** onFindOneSwitch textStatus *** ", textStatus);
            steal.dev.log(" *** onFindOneSwitch xhr *** ", xhr);

            if (xhr.status == 200) { //OK
                if (data.switch.state === "under_monitoring") {
                    this.element.find('div.right-side').show();
                    this.getServersBySwitch(data.switch.id);
                    this.setSwitchStatus(2, "The switch is under monitoring");
                } else if (data.switch.state === "unreachable"){
                    this.element.find('div.right-side').show();
                    this.getServersBySwitch(data.switch.id);
                    this.setSwitchStatus(3, data.switch.err_msg);
                } else if (data.switch.state === "initialized" || data.switch.state === "repulling") {
                    setTimeout(this.proxy('checkSwitchState'), 2000);
                } else if (data.switch.state === "notsupported") {
                    this.setSwitchStatus(3, data.switch.err_msg);
                }
            }
        },

        /************************************/
        // find one switch error callback
        /************************************/
        onFindOneSwitchErr: function(xhr, status, statusText) {
            steal.dev.log(" *** onFindOneSwitchErr xhr *** ", xhr);
            steal.dev.log(" *** onFindOneSwitchErr status *** ", status);
            steal.dev.log(" *** onFindOneSwitchErr statusText *** ", statusText);

            this.setSwitchStatus(3, "GET switch API error");

            /*
            if (xhr.status == 404) { // not found
                $(".switchesErr").html("Find switch error code: 404");
                $(".switchesErr").show();
            } else if (xhr.status == 500) {
                $(".switchesErr").html("Find switch error code: 500");
                $(".switchesErr").show();
            }*/
        },

        getServersBySwitch: function(id) {
            Ods.Server.findAll({
                switchId: id
            }, this.proxy('onFindAllServers'));
        },

        /************************************/
        // find machines success callback
        /************************************/
        onFindAllServers: function(data, textStatus, xhr) {
            steal.dev.log(" *** onFindAllServers data *** ", data);
            steal.dev.log(" *** onFindAllServers textStatus *** ", textStatus);
            steal.dev.log(" *** onFindAllServers xhr *** ", xhr);

            this.setSwitchStatus(2, "The switch is under monitoring");
            this.options.serverControl.onNewMachines(data.machines);
        },

        "{odsState} snmp change": function(Observe, ev, attr, action, newVal, oldVal) {
            console.log(Observe, ev, attr, action, newVal, oldVal);

            if (attr == "snmp" && action == "set") {
                this.displaySnmp(newVal);
            }
        },

        displaySnmp: function(snmp) {
            if (snmp) {
                $(".username").hide();
                $(".password").hide();
                $(".snmp").show();
                $(".community").show();
            } else {
                $(".snmp").hide();
                $(".community").hide();
                $(".username").show();
                $(".password").show();
            }
        },

        getSwitchStatus: function() {
            return this.switchStatus;
        },

        setSwitchStatus: function(status, message) {
            this.switchStatus.status = status;
            this.switchStatus.message = message;
            this.displaySwitchStatus(this.switchStatus);

        },

        displaySwitchStatus: function(swStatus) {
            switch(swStatus.status) {
                case 0: //none
                    this.find(".waiting").hide();
                    this.find(".ok").hide();
                    this.find(".err").hide();
                    this.find(".refresh").hide();
                    break;                
                case 1: //waiting
                    this.find(".waiting").show();
                    this.find(".ok").hide();
                    this.find(".err").hide();
                    this.find(".refresh").hide();
                    break;
                case 2: //ok
                    this.find(".ok").show();
                    this.find(".waiting").hide();
                    this.find(".err").hide();
                    this.find(".refresh").show();
                    break;
                case 3: //error
                    this.find(".err").show();
                    this.find(".ok").hide();
                    this.find(".waiting").hide();
                    this.find(".refresh").show();
                    this.find(".err").attr("title", swStatus.message);
                    this.find(".err").tooltip();
                    break;
            }
        },

        // remove switch row in switch table
        'div.remove click': function(el, ev) {
            var row = el.closest('tr');
            row.remove();
        },

    });
});