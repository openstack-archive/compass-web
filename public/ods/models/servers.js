steal("jquery/model", "jquery/lang/json",
    function() {
        $.Model('Ods.Switch', {
            create: function(params, success, error) {
                $.ajax({
                    url: '/api/switches',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json",
                    data: $.toJSON(params),
                    success: success,
                    error: error
                });
            },

            findOne: function(id, success, error) {
                $.ajax({
                    url: '/api/switches/' + id,
                    type: 'GET',
                    dataType: 'json',
                    success: success,
                    error: error
                });
            },

            update: function(id, params, success, error) {
                $.ajax({
                    url: '/api/switches/' + id,
                    type: 'PUT',
                    data: $.toJSON(params),
                    dataType: 'json',
                    contentType: "application/json",
                    success: success,
                    error: error
                });
            }
        }, {});

        $.Model('Ods.Server', {
            findAll: 'GET /api/machines'
        }, {});

    });