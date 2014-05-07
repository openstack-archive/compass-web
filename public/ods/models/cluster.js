steal("jquery/model", "jquery/lang/json",
    function() {
        $.Model('Ods.Cluster', {
            create: function(params, success, error) {
                $.ajax({
                    url: '/api/clusters',
                    type: 'post',
                    dataType: 'json',
                    contentType: "application/json",
                    data: $.toJSON(params),
                    success: success,
                    error: error
                });
            },

            action: function(id, params, success, error) {
                $.ajax({
                    url: '/api/clusters/' + id + '/action',
                    type: 'post',
                    dataType: 'json',
                    data: $.toJSON(params),
                    contentType: "application/json",
                    success: success,
                    error: error
                });
            },

            update: function(id, params, resource, success, error) {
                $.ajax({
                    url: '/api/clusters/' + id + '/' + resource,
                    type: 'put',
                    dataType: 'json',
                    data: $.toJSON(params),
                    contentType: "application/json",
                    success: success,
                    error: error
                });
            },

            get: function(state, success, error) {
                $.ajax({
                    url: '/api/clusters?state=' + state,
                    type: 'get',
                    dataType: 'json',
                    contentType: "application/json",
                    success: success,
                    error: error
                });
            },

            progress: function(id, success) {
                $.ajax({
                    url: '/api/clusters/' + id + '/progress',
                    type: 'GET',
                    dataType: 'json',
                    success: success
                });
            }
        }, {});

        $.Model('Ods.ClusterHost', {
            update: function(id, params, success, error) {
                $.ajax({
                    url: '/api/clusterhosts/' + id + '/config',
                    type: 'PUT',
                    dataType: 'json',
                    contentType: "application/json",
                    data: $.toJSON(params),
                    success: success,
                    error: error
                });
            },

            progress: function(id, success, error) {
                $.ajax({
                    url: '/api/clusterhosts/' + id + '/progress',
                    type: 'GET',
                    dataType: 'json',
                    success: success,
                    error: error
                });
            },

            get: function(clustername, success, error) {
                $.ajax({
                    url: '/api/clusterhosts?clustername=' + clustername,
                    type: 'GET',
                    success: success,
                    error: error
                });
            }
        }, {});

        $.Model('Ods.DashboardLink', {
            findOne: function(id, success) {
                $.ajax({
                    url: '/api/dashboardlinks',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        "cluster_id": id
                    },
                    success: success
                });
            }
        }, {});

        $.Model('Ods.Adapter', {
            getRoles: function(id, success, error) {
                $.ajax({
                    url: '/api/adapters/' + id + '/roles',
                    type: 'get',
                    success: success,
                    error: error
                });
            },
            get: function(success, error) {
                $.ajax({
                    url: '/api/adapters',
                    type: 'get',
                    success: success,
                    error: error
                });
            }
        }, {});

    });