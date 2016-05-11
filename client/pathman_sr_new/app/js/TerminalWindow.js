(function (nx) {
    nx.define('odl.TerminalWindow', nx.ui.Component, {
        events: ['input', 'close', 'message'],
        view: {
            props: {
                'class': 'terminal-window'
            },
            content: [
                {
                    props: {
                        'class': 'terminal-header'
                    },
                    content: [
                        {
                            props: {
                                'class': 'btn-group btn-group-sm pull-right'
                            },
                            content: [
                                {
                                    tag: 'a',
                                    props: {
                                        'class': 'btn btn-plain btn-minimize'
                                    },
                                    events: {
                                        click: '{#minimize}'
                                    },
                                    content: {
                                        tag: 'i',
                                        props: {
                                            'class': 'fa fa-chevron-down'
                                        }
                                    }
                                },
                                {
                                    tag: 'a',
                                    props: {
                                        'class': 'btn btn-plain btn-maximize'
                                    },
                                    events: {
                                        click: '{#maximize}'
                                    },
                                    content: {
                                        tag: 'i',
                                        props: {
                                            'class': 'fa fa-chevron-up'
                                        }
                                    }
                                },
                                {
                                    tag: 'button',
                                    props: {
                                        'class': 'btn btn-plain'
                                    },
                                    events: {
                                        click: '{#close}'
                                    },
                                    content: {
                                        tag: 'i',
                                        props: {
                                            'class': 'fa fa-times'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'h2',
                            content: '{#title}'
                        }
                    ]
                },
                {
                    props: {
                        'class': 'terminal-body'
                    },
                    content: [
                        {
                            tag: 'pre',
                            name: 'pre',
                            props: {
                                template: {
                                    tag: 'p',
                                    props: {
                                        html: '{html}'
                                    }
                                },
//                                    content:
                                items: "{#lines}"
                            },
                            events: {
                                click: '{#_onPreClick}'
                            }
                        },
                        {
                            tag: 'input',
                            name: 'input',
                            props: {
                                type: 'html'
                            },
                            events: {
                                keydown: '{#_onKeyDown}',
                                input: '{#_onInput}'
                            }
                        }
                    ]
                }
            ]
        },
        properties: {
            service: {
                get:function(){
                    this._service =  this._service;
                    return this._service;
                },
                set:function(value){
                    this._service = value;
                }
            },
            address: null,
            port:null,
            conn:{
                set:function(value){
                    this._conn = value;
                },
                get:function(){
                    var conn = this._conn;
                    if(!conn){
                        this._initConn();
                    }
                    return this._conn;
                }
            },
            title: null,
            maximized: {
                get: function () {
                    return this._maximized;
                },
                set: function (value) {
                    if (!!value) {
                        this.maximize();
                    }
                    this._maximized = value;
                }
            },
            focused: {
                get: function () {
                    return this._focused;
                },
                set: function (value) {
                    if (!!value) {
                        this.focus();
                    }
                    this._focused = value;
                }
            },
            opened:{
                set:function(value){
                    if(value){
                        this.open();
                    }
                }
            },
            lines:null
        },
        methods: {
            init: function (service,address,port) {
                this.inherited();
                this.address(address);
                this.port(port);
                this.service(service);
                this.lines(new nx.data.ObservableCollection());
            },
            _initConn:function(){
                var conn = this.service().getConnection(this.address(),this.port());
                var self = this;
                conn.on('message',function(sender,msg){
                    self.output(msg);
                });
                self.on('input',function(sender,msg){
                    self.conn().send(msg);
                });
                self.on('close',function(){
                    self.conn().close();
                });

                this.conn(conn);
                return conn;
            },
            output: function (text) {
                var lines = this.lines(), line;
                var lineCount = lines.count();
                var cursor, buf, index, output;

                if (lineCount == 0) {
                    line = new nx.data.ObservableObject({
                        text: ''
                    });

                    lines.add(line);
                }
                else {
                    line = lines.getItem(lineCount - 1);
                }

                buf = line.get('text').split('');
                index = this._cursorIndex;

                for (var i = 0, length = text.length; i < length; i++) {
                    var ch = text[i];
                    switch (ch) {
                        case '\n':
                            output = buf.join('');
                            line.set('text', output);
                            line.set('html', output);
                            line = new nx.data.ObservableObject({
                                text: ''
                            });
                            lines.add(line);
                            buf = [];
                            index = 0;
                            break;
                        case '\r':
                            index = 0;
                            break;
                        case '\b':
                            index--;
                            break;
                        case '\007':
                            break;
                        default:
                            buf[index] = ch;
                            index++;
                            break;
                    }
                }

                this._cursorIndex = index;
                cursor = buf[index] || ' ';
                output = buf.join('');
                line.set('text', output);
                buf[index] = cursor.italics();
                output = buf.join('');
                line.set('html', output);

                this.resolve('pre').resolve('@root').$dom.scrollTop = 9999999;
            },
            open:function(){
               return this.conn().open();
            },
            maximize: function () {
                this.resolve("@root").removeClass('minimized');
                this.focus();
            },
            minimize: function () {
                this.maximized(false);
                this.resolve('@root').addClass('minimized');
            },
            close: function () {
                this.fire('close');
                this.destroy();
            },
            focus: function () {
                this.resolve('input').resolve('@root').$dom.focus();
            },
            _onPreClick: function () {
                this.focus();
            },
            _onInput: function (sender, event) {
                var value = sender.get('value');
                if (value) {
                    this.fire('input', value);
                }

                sender.set('value', '');
            },
            _onKeyDown: function (sender, event) {
                switch (event.keyCode) {
                    case 37:
                        this.fire('input', '\033[D');
                        break;
                    case 38:
                        this.fire('input', '\033[A');
                        break;
                    case 39:
                        this.fire('input', '\033[C');
                        break;
                    case 40:
                        this.fire('input', '\033[B');
                        break;
                    case 13:
                        this.fire('input', '\n');
                        break;
                    case 9:
                        this.fire('input', '\t');
                        event.preventDefault();
                        break;
                    case 8:
                        this.fire('input', '\b');
                        break;
                    default:
                        break;
                }
            }
        }
    });
})(nx);