/**
 * Created by tylevine on 8/6/14.
 */

(function(nx){
    var backendService = nx.define("pathman.service.BackendCommunicationService",{
        events:['send','receive','error'],
        properties:{
            url: backend()
        },
        methods:{
            topo: function (callback, errorCallback) {
                var unwrapper = function (data) {
                    return callback(data.response[0].topology);
                };
                this._makeRequest({
                    request: [{
                        option: 'topo'
                    }]
                }, unwrapper, errorCallback);
            },
            create: function(path, name, callback, errorCallback) {
                var unwrapper = function (data) {
                    return callback(data.response[0]);
                };

                this._makeRequest({
                    request: [{
                        name: name,
                        option: 'create',
                        path: path
                    }]
                }, unwrapper, errorCallback);
            },
            'delete': function(name, node, callback, errorCallback) {
                var unwrapper = function (data) {
                    return callback(data.response[0]);
                };

                this._makeRequest({
                    request: [{
                        name: name,
                        option: 'delete',
                        node: node
                    }]
                }, unwrapper, errorCallback);
            },
            listLSPs: function (callback, errorCallback) {
                var unwrapper = function (data) {
                     return callback(data.response[0].list);
                };

                this._makeRequest({
                    request: [{
                        option: 'list_all'
                    }]
                }, unwrapper, errorCallback)
            },
            path: function (src, dest, metric, callback, errorCallback) {
                var unwrapper = function (data) {
                    return callback(data.response[0].path, data.response[0].metric);
                };

                this._makeRequest({
                    request: [
                        {
                            option: 'path',
                            src: src,
                            dst: dest,
                            metric: metric || 'igp'
                        }
                    ]
                }, unwrapper, errorCallback);
            },
            _makeRequest: function (data, successCallback, errorCallback, url, method) {
                var requestOptions = {
                    url: url || this.url(),
                    type: method || 'POST',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: this._success(successCallback),
                    error: this._error(errorCallback)
                };

                console.log('making ajax request with options:');
                console.log(requestOptions);

                $.ajax(requestOptions);

                this.fire('send', requestOptions);
            },
            _success: function (callback) {
                var self = this;
                return function (data) {
                    callback(data);
                    self.fire('receive', data);
                }
            },
            _error: function (callback) {
                var self = this;
                return function (data) {
                    (callback || self._defaultErrorCallback)(data);
                    self.fire('error', data);
                }
            },
            _defaultErrorCallback: function (error) {
                console.log('error while making AJAX request!');
                console.log(error);
            }
        }
    });
    nx.backend = new backendService();
})(nx);
