/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.viewmodel.CreatePath', nx.data.ObservableObject, {
        statics: {
            SelectPathMode: {
                ENDPOINT: 'end-point',
                MANUAL: 'manual'
            }
        },
        properties: {
            entries: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            selectedPath: null,
            hoverPath: null,
            title: {
                value: {
                    text: 'Create new LSP',
                    'class': 'panel-title'
                }
            },
            panelClass: 'createpanel-hidden',
            endpointSelector: null,
            footer: null,
            manualMode: false,
            selectMode: {
                get: function () {
                    var rtn = this._selectMode === undefined ? this.constructor.SelectPathMode.ENDPOINT : this._selectMode;
                    this.showPath(false);
                    return rtn;
                },
                set: function (value) {
                    this._selectMode = value;
                    //this.notify('endPointSelectorBtnCls');
                    //this.notify('manualPathBtnCls');
                }
            },
            endPointSelectorBtnCls: {
                dependencies:['selectMode'],
                get: function () {
                    return this.selectMode() === this.constructor.SelectPathMode.ENDPOINT?"active":'';
                }
            },
            manualPathBtnCls: {
                dependencies:['selectMode'],
                get: function () {
                    return this.selectMode() === this.constructor.SelectPathMode.MANUAL?"active":'';
                }
            },
            showPath:false,
        },
        methods: {
            init: function (inParent, view) {
                this.inherited();
                this._parent = inParent;
                var endpointSelectorView = view.view('endpointSelector');
                view.model(this);
                this.endpointSelector(new pathman_sr.viewmodel.EndpointSelector(this,endpointSelectorView));
                this._metricSelector = endpointSelectorView.view('metricSelector').model();
                this.footer(new pathman_sr.viewmodel.CreatePathFooter(this, view.view('footer')));
            },
            _reset: function () {
                if (this.selectedPath() !== null) {
                    this._pathExit(this.selectedPath());
                }
                this.selectedPath(null);

                if (this.hoverPath() !== null) {
                    this._pathExit(this.hoverPath());
                }
                this.hoverPath(null);

                this.entries().clear();
                this.endpointSelector().reset();
                this._metricSelector.reset();
                this.footer().reset();
                this._parent._parent.pathTopo().reset();
                this.manualMode(false);
                this.selectMode(this.constructor.SelectPathMode.ENDPOINT);
            },
            loadCreatablePaths: function () {
                var self = this;
                var src = this.endpointSelector().source();
                var dest = this.endpointSelector().dest();
                var metric = this._metricSelector.metric();
                nx.backend.path(src, dest, metric, function (paths, costs) {
                    self.entries().clear();
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var cost = costs[i];
                        self.entries().add(new pathman_sr.viewmodel.CostPath(self, i, cost, path));
                    }
                });
                this.showPath(true);
            },
            endpointChanged: function () {
                if (this.selectedPath() !== null) {
                    this._pathExit(this.selectedPath());
                    this.selectedPath(null);
                }
            },
            _switchToEndPointSelectPath: function () {
                this._parent._parent.pathTopo().endManualMode();
                this.selectMode(this.constructor.SelectPathMode.ENDPOINT);
            },
            _switchToManualSelectPath: function () {
                this.selectMode(this.constructor.SelectPathMode.MANUAL);
            },
            _pathSelected: function (pathID) {
//                console.log('selected path ' + pathID);
                if (this.selectedPath() !== null) {
                    // remove old selected path
                    this._pathExit(this.selectedPath());
                }
                this._pathExit(pathID);
                this.selectedPath(pathID);
                this._parent._parent.pathTopo().addPath(this._getPath(pathID), {
                    color: '#FF7300'
                });

                if (this.hoverPath() === pathID) {
                    this.hoverPath(null);
                }

            },
            _pathEnter: function (pathID) {
                if (this.hoverPath() !== null && this.hoverPath() !== this.selectedPath()) {
                    this._pathExit(this.hoverPath());
                }
//                console.log('mouse enter path ' + pathID);
                if (pathID !== this.selectedPath()) {
                    this._parent._parent.pathTopo().addPath(this._getPath(pathID));
                    this.hoverPath(pathID);
                } else {
                    this.hoverPath(null);
                }
            },
            _pathExit: function (pathID) {
//                console.log('mouse exit path ' + pathID);
                this._parent._parent.pathTopo().removePath(this._getPath(pathID));
            },
            _getPath: function (pathID) {
                return this.entries().getItem(pathID).path();
            },
            _metricChanged: function (metric) {
//                console.log('metric selected: ' + metric);

                if (this.endpointSelector().source() !== null && this.endpointSelector().dest() !== null) {
                    this.loadCreatablePaths();
                }
            },
            _mouseExitTable: function (sender, event) {
//                console.log('mouse left table element');

                // clear all routes except for selected route
                if (this.hoverPath() !== null) {
                    this._pathExit(this.hoverPath());
                    this.hoverPath(null);
                }
            },
            _deployClicked: function (sender, event) {
                if (this.selectedPath() === null) {
                    this._parent._parent.statusBar().infoToast('Must select a path');
                    return;
                }

                if (!this.footer().isNameValid()) {
                    this._parent._parent.statusBar().infoToast('Must give new LSP a valid name');
                    return;
                }

                var self = this;
                var pathTopo = self._parent._parent.pathTopo();
                nx.backend.create(this._getPath(this.selectedPath()), this.footer().text(), function (data) {
//                    console.log('path created');
//                    console.log(data);


                    var pathID = self.selectedPath();
                    var pathTopo = self._parent._parent.pathTopo();
                    var path = self._getPath(pathID);

                    self._pathExit(pathID);

                    if (data.success) {
                        pathTopo.addPath(path, {color: '#00ff00'});
                        self._parent.listPath().load();

                        self.entries().clear();
                        self.endpointSelector().reset();
                        self.footer().reset();

                        setTimeout(function () {
                            pathTopo.removePath.bind(pathTopo, path);
                            self._backClicked();
                        }, 1500);
                        self.selectedPath(null);
                        self._parent._parent.statusBar().goodToast('Path successfully created');
                    } else {
                        pathTopo.addPath(path, {color: '#ff0000'});
                        setTimeout(self._pathSelected.bind(self, pathID), 1500);
                        self._parent._parent.statusBar().badToast('Failed to create path');
                    }
                });

                this.manualMode(false);
                pathTopo.endManualMode();
            },
            _backClicked: function (sender, event) {
                this._parent.showListPathPanel();
                this._reset();
                this._parent._parent.pathTopo().endManualMode();
            },
            _inputChanged: function (text) {
                return this._parent.isValidLSPName(text);
            },
            _manualClicked: function (sender, event) {
                var statusBar = this._parent._parent.statusBar();
                var pathTopo = this._parent._parent.pathTopo();

                this._reset();

                statusBar.infoMessage('Select source node');
                pathTopo.enterManualMode();
                this.manualMode(true);
                pathTopo.nodeClickCallback(this._manualNodeClicked.bind(this));
                var costPath = new pathman_sr.viewmodel.CostPath(this, 0, 0, []);
                this.entries().add(costPath);

                $('td.inputCell > input[type=radio]').attr('checked', 'checked');


            },
            _manualNodeClicked: function (node, isSelected) {
                var statusBar = this._parent._parent.statusBar();
                var pathTopo = this._parent._parent.pathTopo();
                this.entries().count()>0?this.showPath(true):false;

                var path = this.entries().getItem(0);
                var oldPath = path.path(), newPath;
                if (isSelected) {
                    // node is being unselected

                    // exit old path
                    pathTopo.removePath(oldPath);

                    oldPath.splice(oldPath.indexOf(node), 1);
                    newPath = pathTopo.validatePath(oldPath);
                    path.path(newPath);
                    path.pathUpdated();
                    this._pathSelected(0);

                    return false;
                } else {
                    // node is being selected
                    if (this._getPath(0).length === 0) {
                        // source node was selected
                        statusBar.infoMessage('Select adjacent nodes');
                    }

                    oldPath = oldPath.slice();
                    oldPath.push(node);
                    newPath = pathTopo.validatePath(oldPath);

                    if (newPath[newPath.length - 1] === node) {
                        path.path(newPath);
                        path.pathUpdated();
                        this._pathSelected(0);

                        return true;
                    } else {
                        return false;
                    }
                }
            },
            _consultWAEClicked: function (sender, event) {
                //alert('not yet implemented');
                this._parent._parent.statusBar().badToast('Not yet implemented');
            }
        }
    });
}(nx, nx.global));
