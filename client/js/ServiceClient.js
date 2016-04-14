(function (nx, util) {
    nx.define('nx.ServiceClient', {
        events: ['start', 'stop','error'],
        methods: {
            init: function (baseUrl, opts) {
                this._baseUrl = baseUrl;
                this._proxyUrl = opts && opts.proxyUrl;
                this._opts = opts||{};

                var self = this;
                $(document).ajaxStart(function () {
                    self.fire('start');
                });
                $(document).ajaxStop(function () {
                    self.fire('stop');
                });
            },
            send: function (opts) {
                var baseUrl = this._baseUrl||"";
                var proxyUrl = this._proxyUrl;
                var actualUrl = baseUrl + opts.url;
                var options = nx.extend({}, this._opts, opts);
                var error = options.error;
                if (proxyUrl && actualUrl.indexOf('http') == 0) {
                    actualUrl = proxyUrl + '?url=' + encodeURIComponent(actualUrl);
                    if (opts.delay) {
                        actualUrl = actualUrl + '&delay=' + opts.delay;
                    }
                }

                options.url = actualUrl;
                var self = this;
                if (error) {
                    options.error = function (response) {
                        if(self.fire('error',response)===false){
                            return;
                        }
                        error({
                            url: actualUrl,
                            type: options.type,
                            data: options.data,
                            response: response
                        });
                    };
                }
                $.ajax(options);
            },
            GET: function (url, data, success, error) {
                this.send({
                    url: url,
                    type: 'GET',
                    data: data,//JSON.stringify(data, null, '\t')
                    success: success,
                    error: error
                });
            },
            POST: function (url, data, success, error) {
                this.send({
                    url: url,
                    type: 'POST',
                    data: data,
                    success: success,
                    error: error
                });
            },
            PUT: function (url, data, success, error) {
                this.send({
                    url: url,
                    type: 'PUT',
                    data: data,
                    success: success,
                    error: error
                });
            },
            DELETE: function (url, data, success, error) {
                this.send({
                    url: url,
                    type: 'DELETE',
                    data: data,
                    success: success,
                    error: error
                });
            }
        }
    });
})(nx, nx.util);