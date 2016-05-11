(function (nx, global) {
    nx.define('pathman_sr.viewmodel.Main', nx.data.ObservableObject, {
        properties: {
            topo: null,
            pathTopo: null,
            pathInfo: null,
            statusBar: null,
            terminalWindows: {
                get: function () {
                    return this._terminalWindows || {};
                }
            },
            terminalService: {
                value: null
            },
            rightpanelClass: "rightbar-item",
            rightpanelColor: null,
            terminalContainerPos: "margin-right:60px"
        },
        methods: {
            init: function (mainView) {
                this.inherited();

                this.topo(mainView.view('topo'));
                this.pathTopo(new pathman_sr.viewmodel.PathTopology(this, this.topo()));
                this.pathInfo(new pathman_sr.viewmodel.PathInfo(this, mainView.view('pathInfo')));
                this.statusBar(new pathman_sr.viewmodel.StatusBar(this, mainView.view('statusBar')));
                this.terminalService(new odl.TerminalService(odl.Config.get('socketUrl')));
                this.terminalWindows(new nx.data.ObservableDictionary());


                var self = this;
                nx.backend.topo(function (data) {
                    var mapDataArray = [];
                    for (var prop in mapData) {
                        mapDataArray.push(mapData[prop]);
                    }

                    if (data.nodes.length <= mapDataArray.length)
                    {
                        nx.each(data.nodes, function (node) {
                            var index = data.nodes.indexOf(node);
                            node.latitude = mapDataArray[index].latitude;
                            node.longitude = mapDataArray[index].longitude;
                        });
                    }
                    self.topo().data(data);
                    self.pathInfo().createPath().endpointSelector().setNodes(data.nodes);
                });
            },
            _openTerminal: function (sender, evt) {
                var model = sender.owner().node().model();
                var address = model.get('ipaddress');
//                var port = model.port;
                var name = model.get('name');
                var terminalWindows = this.terminalWindows();
                var terminalModel = terminalWindows.getItem(name);
                var terminalService = this.terminalService();
                if (!terminalModel) {
                    var terminalModel = new nx.data.ObservableObject({
                        address: address,
                        service: terminalService,
                        title: name
                    });
                    nx.extend(terminalModel, {
                        onClose: function () {
                            terminalWindows.removeItem(name);
                        }
                    })
                    terminalWindows.setItem(name, terminalModel);
                }

                terminalModel.set('opened', true);
                terminalModel.set('maximized', true);
            },
            showTopBar: function () {
                $('div.SRbar').addClass('expandSRbar');
            },
            hideTopBar: function () {
                $('div.SRbar').removeClass('expandSRbar');
            },
            isTopBarVisible: function () {
                return $('div.SRbar').hasClass('expandSRbar');
            },
            showSideBar: function () {
//                console.log('showing list bar');
                this.terminalContainerPos("margin-right:30%");
                $('div.listBar').addClass('expandListBar');
                $('div.ui-main').addClass('contractMain');
                setTimeout(this.topo().adaptToContainer.bind(this.topo()), 100);

            },
            hideSideBar: function () {
//                console.log('hiding list bar');

                $('div.listBar').removeClass('expandListBar');
                $('div.ui-main').removeClass('contractMain');

                setTimeout(this.topo().adaptToContainer.bind(this.topo()), 100);
                this.terminalContainerPos("margin-right:60px");

            },
            isSideBarVisible: function () {
                return $('div.listBar').hasClass('expandListBar');
            },
            openRightPanel: function () {
                //var self = this;
                if (this.rightpanelClass().indexOf('active') >= 0) {
                    this.hideSideBar();
                    var self = this;
                    setTimeout(function () {
                        self.rightpanelClass("rightbar-item");
                        self.rightpanelColor("");
                    }, 300)
                }
                else {
                    this.rightpanelClass("rightbar-item active");
                    
                    //setTimeout(function () {
                    this.showSideBar();
                    this.pathInfo().listPath().load();
                    //}, 50)
                    this.rightpanelColor("background-color:#000;border-left: 1px solid transparent;border-left-color: #6c6c6c;");

                }



            }
        }
    });
}(nx, nx.global));
