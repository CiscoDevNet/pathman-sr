/**
 * Created by bob on 14-2-27.
 */
(function(nx){
    var Connection = nx.define("odl.WebSocketConnection",{
        events:['close','message','error'],
        properties:{
            url:null,
            socketConn:{
                get:function(){
                    var socketConn =  this._socketConn;
                    if(!socketConn){
                        socketConn = this._makeWebSocket();
                        this._socketConn = socketConn;
                    }
                    return this._socketConn;
                }
            }
        },
        methods:{
            init:function(url){
                url && this.url(url);
            },
            _makeWebSocket:function(){
                var url  = this.url();
                if(!url){
                    throw new Error("WebSocket's url can not be empty!");
                }
                var webSocket = new WebSocket(url);
                var self = this;
                webSocket.onclose = function (e) {
                    self.fire('close', e);
                };

                webSocket.onmessage = function (e) {
                    self.fire('message', e.data);
                };

                webSocket.onmerror = function (e) {
                    self.fire('error', e);
                };
                return webSocket;
            },
            open:function(){
                var webSocket = this.socketConn();
                return webSocket;
            },
            send:function(msg){
                var webSocket = this.socketConn();
                webSocket.send(msg);
            },
            close:function(){
                var webSocket = this.socketConn();
                webSocket.close();
            }
        }
    });
    nx.define("odl.TerminalService",{
        properties:{
            connections:{
                get:function(){
                    return this._connections || new nx.data.ObservableDictionary();
                }
            }
        },
        events: ['close', 'message', 'error','connect'],
        methods:{
            getConnection:function(address,port){
                var connectId = this._getConnectId(address,port);
                var conn = this.connections().getItem(connectId);
                if(!conn){
                    conn = new Connection(this._getConnectUrl(address,port));
                    this.connections().setItem(connectId,conn);
                }
                var self = this;
                conn.on('close',function(){
                    self.connections().removeItem(connectId);
                });
//                conn.on('message',function(sender,evt){
//                    self.fire('message',evt);
//                });
                return conn;
            },
            init:function(baseUrl){
                this._baseUrl = baseUrl||"ws://10.140.92.77:8080/ODLNext/wstc";
                this._webSockets = {};
            },
            _getConnectId:function(address,port){
                return address+(port?":"+port:'');
            },
            _getConnectUrl:function(address,port){
                return this._baseUrl + "?host="+this._getConnectId(address,port);
            }
        }
    });
})(nx);