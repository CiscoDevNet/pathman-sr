/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.ListPath', nx.data.ObservableObject, {
        properties: {
            entries: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            hoverPath: null,
            listPanelClass: '',
            footer: null
        },
        methods: {
            init: function(inParent, view) {
                this.inherited();
                this._parent = inParent;
                this.footer(new pathman_sr.viewmodel.ListPathFooter(this, view.view('footer')));
                view.model(this);
                this.load();
            },
            load: function () {
                var self = this;
                nx.backend.listLSPs(function(lsps) {
                    self.entries().clear();
                    for (var i = 0; i < lsps.length; i++) {
                        var path = lsps[i].path;
                        var name = lsps[i].name;
                        self.entries().add(new pathman_sr.viewmodel.NamePath(self, i, name, path));
                    }
                });
            },
            startDelete: function () {
//                console.log('starting deletion');
                this.entries().each(function (entry) {
                    entry._showInput();
                });

                this.footer().enterDeleteMode();
            },
            endDelete: function () {
//                console.log('ending deletion');
                this.entries().each(function (entry) {
                    entry._hideInput();
                    entry.selected(false);
                });
                $('td.inputCell > input[type=checkbox]').prop('checked', false);

                this.footer().exitDeleteMode();
            },
            _pathEnter: function (pathID, sender, event) {
                if (this.hoverPath() !== null) { // && this.hoverPath() !== this.selectedPath()) {
                    this._pathExit(this.hoverPath());
                }
//                console.log('mouse enter path ' + pathID);
                this._parent._parent.pathTopo().addPath(this._getPath(pathID), {
                    color: '#0386D2'
                });
                this.hoverPath(pathID);
            },
            _pathExit: function (pathID) {
//                console.log('mouse exit path ' + pathID);
                this._parent._parent.pathTopo().removePath(this._getPath(pathID));
            },
            _getPath: function(pathID) {
                return this.entries().getItem(pathID).path();
            },
            _mouseExitTable: function (sender, event) {
//                console.log('mouse left table element');

                // clear all routes except for selected route
                if (this.hoverPath() !== null) {
                    this._pathExit(this.hoverPath());
                    this.hoverPath(null);
                }
            },
            deleteSelected: function () {
                var paths = [];
                this.entries().each(function(entry) {
                    if (entry.selected()) {
                        paths.push(entry);
                    }
                });
//                console.log('deleting paths:');
//                console.log(paths);

                var self = this;

                // caution, race condition ahead. Since we are dealing with network transfer latencies however,
                // I doubt that it will ever actually happen #famouslastwords
                var idx = 0;

                paths.forEach(function (path) {
                    nx.backend.delete(path.name(), path.path()[0], function (data) {
                        if (++idx === paths.length) {
                            self.load();
                        }

                        if (!data.success) {
                            console.log('failed to delete LSP!');
                            console.log('cause: ' + data.cause);
                        }

                    });
                });

                this.endDelete();
            },
            isValidLSPName: function (name) {
                var ret = true;
                this.entries().each(function (entry) {
                    if (name === entry.name()) {
                        ret = false;
                    }
                });
                return ret;
            }
        }
    });
}(nx, nx.global));
