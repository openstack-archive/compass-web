steal(
    'jquery/controller',
    'jquery/view/ejs',
    'jquery/controller/view'
).then(
    './views/init.ejs',
    './install_review.css',
    './views/install.ejs',
    './views/progress_row.ejs',
    'ods/models/cluster.js',
    'lib/jquery-ui-1.10.3.custom.css',
    'lib/jquery.dataTables.js'
).then(
    'lib/jquery-ui-1.10.3.custom.js',
    './install.css'
).then(
    function($) {
        $.Controller('Ods.Ui.install_review', {}, {
            init: function() {
                this.totalProgress = 0;
                this.serverCount = 0;
                if(this.options.installStep == "progress") {
                    this.element.html(this.view('pending_clusters'));
                    Ods.Cluster.get("installing",
                        this.proxy('onGetInstallingCluster'),
                        this.proxy('onGetInstallingClusterErr'));
                    Ods.Cluster.get("successful",
                        this.proxy('onGetInstallingCluster'),
                        this.proxy('onGetInstallingClusterErr'));
                    Ods.Cluster.get("failed",
                        this.proxy('onGetInstallingCluster'),
                        this.proxy('onGetInstallingClusterErr'));
                } else {
                    this.element.html(this.view('init'));
                    this.dataTableIpAddrSort();
                    this.initServerTable();

                    this.onSecurityData(this.options.odsState.security);
                    this.onNetworkingData(this.options.odsState.networking);
                    this.onLogicPartitionData(this.options.odsState.partition);                    
                }
            },

            '.review-back click': function(el, ev) {
                this.options.nav.gobackStep("5");
                return false;
            },

            onLogicPartitionData: function(data) {
                $("#tmp").html(data.tmp + "%");
                $("#var").html(data.slashvar + "%");
                $("#home").html(data.home + "%");
            },

            onSecurityData: function(data) {
                var server_uname = data.server_credentials.username;
                var service_uname = data.service_credentials.username;
                var console_uname = data.console_credentials.username;
                var server_pwd = data.server_credentials.password;
                var service_pwd = data.service_credentials.password;
                var console_pwd = data.console_credentials.password;
                var server_pwd_len = server_pwd.length;
                var service_pwd_len = service_pwd.length;
                var console_pwd_len = console_pwd.length;

                $("#server_uname").html(server_uname);
                $("#service_uname").html(service_uname);
                $("#console_uname").html(console_uname);

                var temp = "";
                for (i = 0; i < server_pwd_len; i++) {
                    temp += "*";
                }
                $("#server_pwd").html(temp);

                temp = "";
                for (i = 0; i < service_pwd_len; i++) {
                    temp += "*";
                }
                $("#service_pwd").html(temp);

                temp = "";
                for (i = 0; i < console_pwd_len; i++) {
                    temp += "*";
                }
                $("#console_pwd").html(temp);
            },

            onNetworkingData: function(data) {
                $("#mgt_start").html(data.interfaces.management.ip_start);
                $("#mgt_end").html(data.interfaces.management.ip_end);
                $("#vnw_start").html(data.interfaces.tenant.ip_start);
                $("#vnw_end").html(data.interfaces.tenant.ip_end);
                $("#float_start").html(data.interfaces.public.ip_start);
                $("#float_end").html(data.interfaces.public.ip_end);
                $("#storage_start").html(data.interfaces.storage.ip_start);
                $("#storage_end").html(data.interfaces.storage.ip_end);
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
                this.dataTable = $('#tb_server_review').dataTable({
                    "sScrollY": "450px",
                    "bPaginate": false,
                    "bScrollCollapse": true,
                    "aoColumns": [{
                        "mData": "hostname"
                    }, {
                        "mData": "mac"
                    }, {
                        "mData": "management_ip",
                        "sType": "ip-address"
                    }, {
                        "mData": "tenant_ip",
                        "sType": "ip-address"
                    }, {
                        "mData": "switch_ip",
                        "sType": "ip-address"
                    }, {
                        "mData": "port"
                    }, {
                        "mData": "roles",
                        "mRender": function(data, type, full) {
                            if (data.length == 0) {
                                return "auto";
                            } else if (data.toString().length <=10) {
                                return data;
                            } else {
                                return data.toString().substring(0, 10) + " ...";
                            }
                        }
                    }],
                    "aoColumnDefs": [{
                        bSortable: false,
                        aTargets: [1, 6]
                    }],
                    "aaSorting": [
                        [4, "asc"],
                        [5, "asc"]
                    ]
                });
                $('.dataTables_info').remove();
                $('.dataTables_filter input').addClass('rounded');

                this.dataTable.fnClearTable();

                var serverData = this.options.odsState.servers_config;
                for (var key in serverData) {
                    var servers = serverData[key];
                    for (var i = 0; i < servers.length; i++) {
                        this.dataTable.fnAddData(servers[i]);
                    }
                }
            },

            '#begin-deploy click': function(el, ev) {
                ev.preventDefault();
                $("#continuing").css("opacity", 1);

                var cluster_id = this.options.odsState.cluster_id;
                Ods.Cluster.action(cluster_id, {"deploy": []},
                                   this.proxy('onTriggerDeploy'),
                                   this.proxy('onTriggerDeployErr'));
            },

            onTriggerDeploy: function(data, textStatus, xhr) {
                steal.dev.log(" *** onTriggerDeploy data *** ", data);
                steal.dev.log(" *** onTriggerDeploy textStatus *** ", textStatus);
                steal.dev.log(" *** onTriggerDeploy xhr *** ", xhr);

                if (xhr.status == 202) { // accepted
                    $("#continuing").css("opacity", 0);
                    this.element.html(this.view('install'));
                    $("#install_tabs").tabs();

                    this.initProgressbars();
                }
            },

            onTriggerDeployErr: function(xhr, status, statusText) {
                steal.dev.log(" *** onTriggerDeployErr xhr *** ", xhr);
                steal.dev.log(" *** onTriggerDeployErr status *** ", status);
                steal.dev.log(" *** onTriggerDeployErr statusText *** ", statusText);
            },

            '#retrieve-progress click': function(el, ev) {
                ev.preventDefault();
                var selectedCluster = $("input[name='clusterRadio']:checked");
                if (!selectedCluster.val()) {
                    alert("Please select a cluster");
                } else {
                    this.options.odsState.cluster_id = selectedCluster.data('hostid');
                    this.element.html(this.view('install'));
                    $("#install_tabs").tabs();

                    //get clusterhosts by clustername
                    Ods.ClusterHost.get(selectedCluster.val(),
                        this.proxy('onGetClusterHosts'),
                        this.proxy('onGetClusterHostsErr'));
                }
            },

            onGetInstallingCluster: function(data, textStatus, xhr) {
                steal.dev.log(" *** onGetInstallingCluster data *** ", data);
                steal.dev.log(" *** onGetInstallingCluster textStatus *** ", textStatus);
                steal.dev.log(" *** onGetInstallingCluster xhr *** ", xhr);
                if (xhr.status == 200) {
                    for (index in data.clusters) {
                        $("table.cluster tbody").append(this.view('cluster_row', data.clusters[index]));
                    }
                }
            },

            onGetInstallingClusterErr: function(xhr, status, statusText) {
                steal.dev.log(" *** onGetInstallingClusterErr xhr *** ", xhr);
                steal.dev.log(" *** onGetInstallingClusterErr status *** ", status);
                steal.dev.log(" *** onGetInstallingClusterErr statusText *** ", statusText);
            },

            onGetClusterHosts: function(data, textStatus, xhr) {
                steal.dev.log(" *** onGetClusterHosts data *** ", data);
                steal.dev.log(" *** onGetClusterHosts textStatus *** ", textStatus);
                steal.dev.log(" *** onGetClusterHosts xhr *** ", xhr);
                if (xhr.status == 200) {
                    var serverConfig = [];
                    for (index in data.cluster_hosts) {
                        var server = {
                            "hostname": data.cluster_hosts[index].hostname,
                            "clusterhost_id": data.cluster_hosts[index].id,
                            "switch_ip": data.cluster_hosts[index].switch_ip
                        };
                        var switchIp = server.switch_ip;
                        if (serverConfig[switchIp] == undefined) {
                            serverConfig[switchIp] = [server];
                        } else {
                            serverConfig[switchIp].push(server);
                        }
                    }
                    this.options.odsState.servers_config = serverConfig;

                    this.initProgressbars();
                }
            },

            onGetClusterHostsErr: function(xhr, status, statusText) {
                steal.dev.log(" *** onGetClusterHostsErr xhr *** ", xhr);
                steal.dev.log(" *** onGetClusterHostsErr status *** ", status);
                steal.dev.log(" *** onGetClusterHostsErr statusText *** ", statusText);
            },

            initProgressbars: function() {
                this.initTotalProgressbar();

                this.serverTreeJson = {
                    "name": "Compass Server",
                    "type": "compass",
                    "children": []
                };

                for (var key in this.options.odsState.servers_config) {
                    var switchjson = {
                        "name": key,
                        "type": "switch",
                        "children": []
                    };
                    var servers = this.options.odsState.servers_config[key];
                    for (var i = 0; i < servers.length; i++) {
                        this.serverCount ++;
                        var serverjson = {
                            "name": servers[i].hostname,
                            "hostid": servers[i].clusterhost_id,
                            "type": "server",
                            "progress": 0,
                            "message": "Waiting..."
                        };
                        switchjson.children.push(serverjson);

                        // initiate list based progress bars
                        this.initListProgressbar(servers[i].clusterhost_id, servers[i].hostname);
                    }
                    this.serverTreeJson.children.push(switchjson);
                }
                // initiate graph based progress bars
                this.initGraphProgressbars();

                setTimeout(this.proxy('getProgressData'), 1000);
            },

            initTotalProgressbar: function() {
                this.totalProgressbar = $('.totalProgressbar');
                this.totalProgressbar.progressbar({
                    value: false
                });
                this.totalProgressLabel = this.totalProgressbar.children(".progress-label");
                this.totalProgressbarValue = this.totalProgressbar.find(".ui-progressbar-value");
            },

            initListProgressbar: function(hostid, hostname) {
                var initPData = {
                    "hostname": hostname,
                    "hostid": hostid,
                    "message": "Waiting..."
                }
                $("#tabs-2 table tbody").append(this.view('progress_row', initPData));

                var pbar = $('div[data-hostid="' + hostid + '"]');
                pbar.progressbar({
                    value: false
                });
            },

            '.refresh-progressbar click': function(el, ev) {
                this.getProgressData();
            },

            getHostList: function() {
                this.pendingHostList = [];
                var serverData = this.options.odsState.servers_config;
                for (var key in serverData) {
                    var servers = serverData[key];
                    for (var i = 0; i < servers.length; i++) {
                        this.pendingHostList.push(servers[i].clusterhost_id);
                    }
                }
            },

            getProgressData: function() {
                this.getHostList();

                var hosts = this.pendingHostList;
                this.pendingHostCount = hosts.length;
                var count = hosts.length;
                this.pendingHostList = [];

                for (var i = 0; i < count; i++) {
                    Ods.ClusterHost.progress(hosts[i], this.proxy('updateProgressBar'), this.proxy('updateProgressBarErr'));
                }
            },


            /********************************************/
            // get clusterhost progress success callback
            /********************************************/
            updateProgressBar: function(data, textStatus, xhr) {
                steal.dev.log(" *** onUpdateProgressBar data *** ", data);
                steal.dev.log(" *** onUpdateProgressBar textStatus *** ", textStatus);
                steal.dev.log(" *** onUpdateProgressBar xhr *** ", xhr);

                this.pendingHostCount--;

                var progressData = data.progress;


                if (progressData.percentage < 1) {
                    this.pendingHostList.push(progressData.id);
                }

                // update graph-based progress bar
                this.updateGraphBar(progressData);

                // update list-based progress bar
                this.updateListBar(progressData);

                // update total progress bar
                this.updateTotalBar(progressData);

            },

            /********************************************/
            // get clusterhost progress error callback
            /********************************************/
            updateProgressBarErr: function(xhr, status, statusText) {
                steal.dev.log(" *** updateProgressBarErr xhr *** ", xhr);
                steal.dev.log(" *** updateProgressBarErr status *** ", status);
                steal.dev.log(" *** updateProgressBarErr statusText *** ", xhr);
                //TODO
            },

            updateGraphBar: function(progressData) {

                // update progress data in serverTreeJson
                for (var sw in this.serverTreeJson.children) {
                    var servers = this.serverTreeJson.children[sw]._children;
                    if (servers == null) {
                        servers = this.serverTreeJson.children[sw].children;
                    }
                    for (var i = 0; i < servers.length; i++) {
                        if (servers[i].hostid == progressData.id) {
                            servers[i].progress = progressData.percentage;
                            servers[i].message = progressData.message;
                        }
                    }
                }

                // update graph-based progress bar
                if ($('rect[data-hostid="' + progressData.id + '"]')) { // check if the node is expanded
                    if (progressData.percentage > 1.0) {
                        progressData.percentage = 1.0;
                    }
                    $('rect[data-hostid="' + progressData.id + '"]').attr("width", imgWidth * progressData.percentage);

                    $('text[data-hostid="' + progressData.id + '"]').text(progressData.message);
                }
            },

            updateListBar: function(progressData) {
                var pbar = $('div[data-hostid="' + progressData.id + '"]');
                var progressLabel = pbar.children(".progress-label");
                var progressbarValue = pbar.find(".ui-progressbar-value");


                // update list-based progress bar
                if (pbar.is(":visible")) {
                    progressbarValue.css({
                        "width": progressData.percentage * pbar.width()
                    });

                    progressLabel.text(progressData.message);
                    progressbarValue.css({
                        "opacity": "0.8"
                    });
                    if (progressData.severity == "WARNING") {
                        progressbarValue.css({
                            "background": "#FAA732"
                        });
                    } else if (progressData.severity == "ERROR") {
                        progressbarValue.css({
                            "background": "#BD362F"
                        });
                    } else {
                        progressbarValue.css({
                            "background": "#49AFCD"
                        });
                    }
                    if (progressData.percentage >= 1.0) {
                        progressLabel.text("Completed!");
                        pbar.progressbar("value", 100);
                        progressbarValue.css({
                            "background": "#5BB75B"
                        });
                    } else {
                        pbar.progressbar("value", progressData.percentage * 100)
                    }
                }
            },

            updateTotalBar: function(data) {
                if (this.pendingHostCount == 0) {
                    Ods.Cluster.progress(this.options.odsState.cluster_id, this.proxy('onTotalProgressData'), this.proxy('onTotalProgressDataErr'));
                }
            },

            /********************************************/
            // get cluster total progress success callback
            /********************************************/
            onTotalProgressData: function(data, textStatus, xhr) {
                steal.dev.log(" *** onTotalProgressData data *** ", data);
                steal.dev.log(" *** onTotalProgressData textStatus *** ", textStatus);
                steal.dev.log(" *** onTotalProgressData xhr *** ", xhr);

                var total = data.progress.percentage;
                this.totalProgressbarValue.css({
                    "background": "#0000ff",
                    "opacity": 0.5
                });
                this.totalProgressLabel.text(Math.round(total * 100) + "%");
                this.totalProgressbarValue.css({
                    "width": total * this.totalProgressbar.width()
                });

                if (total < 1 || this.pendingHostList.length > 0) {
                    setTimeout(this.proxy('getProgressData'), 3000);
                } else {
                    this.totalProgressbar.progressbar("value", 100);
                    Ods.DashboardLink.findOne(this.options.odsState.cluster_id, this.proxy('onFindDashboardLink'));
                }
            },

            /********************************************/
            // get cluster total progress error callback
            /********************************************/
            onTotalProgressDataErr: function(xhr, status, statusText) {
                steal.dev.log(" *** onTotalProgressDataErr xhr *** ", xhr);
                steal.dev.log(" *** onTotalProgressDataErr status *** ", status);
                steal.dev.log(" *** onTotalProgressDataErr statusText *** ", xhr);
                //TODO
            },

            onFindDashboardLink: function(data, textStatus, xhr) {
                steal.dev.log(" *** onFindDashboardLink data *** ", data);
                steal.dev.log(" *** onFindDashboardLink textStatus *** ", textStatus);
                steal.dev.log(" *** onFindDashboardLink xhr *** ", xhr);

                if (data.status == "OK") {
                    $(".dashboard-link").attr("href", data.dashboardlinks["os-controller"]);
                    $(".dashboard-link").attr("target", "_blank");
                    $(".dashboard-link").removeClass("disabled");
                }
            },

            '.ui-tabs-nav click': function(el, ev) {
                if ($("#tabs-2").is(":visible")) {
                    var children = this.serverTreeJson.children;
                    for (var sw in children) {
                        var servers = children[sw]._children;
                        if (servers == null) {
                            servers = children[sw].children;
                        }
                        for (var i = 0; i < servers.length; i++) {
                            var data = {
                                "hostname": servers[i].name,
                                "id": servers[i].hostid,
                                "percentage": servers[i].progress,
                                "message": servers[i].message
                            };
                            this.updateListBar(data);
                        }
                    }
                }
            },

            initGraphProgressbars: function() {
                var margin = {
                    top: 0,
                    right: 120,
                    bottom: 0,
                    left: 130
                };

                var serversHeight = this.serverCount * 68;
                if (serversHeight < 500) {
                    serversHeight = 500;
                }

                var width = 1000 - margin.right - margin.left,
                    height = serversHeight - margin.top - margin.bottom;

                imgWidth = 163;
                imgHeight = 32;

                var i = 0,
                    duration = 750,
                    root;

                var tree = d3.layout.tree()
                    .size([height, width]);

                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.y, d.x];
                    });

                var svg = d3.select("#progress-graph").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                root = this.serverTreeJson;
                root.x0 = height / 2;
                root.y0 = 0;

                update(root);

                d3.select(self.frameElement).style("height", "600px");

                function update(source) {

                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) {
                        d.y = d.depth * 300;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            var transX = parseFloat(source.y0) - 10;
                            var transY = parseFloat(source.x0) - imgHeight / 2;
                            return "translate(" + transX + "," + transY + ")";
                        })
                        .attr("width", imgWidth)
                        .attr("height", imgHeight)
                        .on("click", click);

                    nodeEnter.append("image")
                        .attr("xlink:href", function(d) {
                            if (d.type == "compass")
                                return "../img/router.png";
                            else if (d.type == "switch")
                                return "../img/switch.png";
                            else
                                return "../img/server.png";
                        })
                        .attr("class", function(d) {
                            return d.type;
                        })
                        .attr("width", imgWidth)
                        .attr("height", imgHeight);

                    nodeEnter.append("rect")
                        .attr("width", function(d) {
                            if (d.type == "server") {
                                return imgWidth * d.progress;
                            } else {
                                return 0;
                            }
                        })
                        .attr("height", imgHeight)
                        .attr("data-hostid", function(d) {
                            return d.hostid;
                        })
                        .style("fill", "blue")
                        .style("opacity", function(d) {
                            if (d.type == "server")
                                return 0.4;
                            else
                                return 0;
                        });


                    nodeEnter.append("text")
                        .attr("x", function(d) {
                            if (d.type == "compass")
                                return -5;
                            else
                                return d.children || d._children ? -8 : imgWidth + 10;
                        })
                        .attr("y", function(d) {
                            if (d.type == "compass")
                                return imgHeight / 2;
                            else if (d.type == "switch")
                                return 6;
                            else
                                return imgHeight / 2;
                        })
                        .attr("dy", ".25em")
                        .attr("text-anchor", function(d) {
                            return d.children || d._children ? "end" : "start";
                        })
                        .text(function(d) {
                            return d.name;
                        })
                        .style("font-size", "15px")
                        .style("fill-opacity", 1e-6);

                    nodeEnter.append("text")
                        .attr("x", 0)
                        .attr("y", 45)
                        .attr("dy", ".25em")
                        .attr("data-hostid", function(d) {
                            return d.hostid;
                        })
                        .text(function(d) {
                            if (d.type == "server")
                                return d.message;
                            else
                                return null;
                        })
                        .style("font-size", "12px");

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            var transX = parseFloat(d.y) - 10;
                            var transY = parseFloat(d.x) - imgHeight / 2;
                            return "translate(" + transX + "," + transY + ")";
                        });

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            var transX = parseFloat(source.y) - 10;
                            var transY = parseFloat(source.x) - imgHeight / 2;
                            return "translate(" + transX + "," + transY + ")";
                        })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function(d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                // Toggle children on click.
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }
            },

            show: function() {
                this.element.show();
            },

            hide: function() {
                this.element.hide();
            }
        });
    });
