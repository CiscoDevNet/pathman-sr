(function (nx, global) {
    nx.define('pathman_sr.viewmodel.StatusBar', nx.data.ObservableObject, {
        properties: {
            visible: null,
            state: null,
            lingerTime: 2500,
            timeoutID: null
        },
        methods: {
            init: function(inParent, view) {
                this.inherited();
                this._parent = inParent;
                this.reset();
                view.model(this);
            },
            _show: function () {
                if (!this.visible()) {
                    $('div.statusBar').addClass('expandStatusBar');
                    this.visible(true);
                }

                if (this.timeoutID() !== null) {
                    clearTimeout(this.timeoutID())
                }
            },
            _hide: function () {
                if (this.visible()) {
                    $('div.statusBar').removeClass('expandStatusBar');
                    this.visible(false);
                }
            },
            _text: function (text) {
                $('div.statusBar > div.alert').text(text);
            },
            reset: function () {
                this._hide();
                this.visible(false);
                this.state(null);
                var self = this;
                var id = setTimeout(function () {
                    self._removeClasses();
                    self.timeoutID(null);
                }, 500);
                this.timeoutID(id);
                this._text('');
            },
            _removeClasses: function () {
                $('div.statusBar > div.alert').removeClass('btn-danger btn-success btn-info');
            },
            goodMessage: function (text) {
                if (this.state() !== 'success') {
                    var elt = $('div.statusBar > div.alert');
//                    elt.text('Route Successfully Created!');
                    this._removeClasses();
                    elt.addClass('btn-success');
                    this.state('success');
                }
                this._show();
            },
            badMessage: function (text) {
                this._text(text);
                if (this.state() !== 'failure') {
                    var elt = $('div.statusBar > div.alert');
//                    elt.text('Failed To Create Route!');
                    this._removeClasses();
                    elt.addClass('btn-danger');
                    this.state('failure');
                }
                this._show();
            },
            infoMessage: function (text) {
                this._text(text);
                if (this.state() !== 'info') {
                    var elt = $('div.statusBar > div.alert');
                    this._removeClasses();
                    elt.addClass('btn-info');
                    this.state('info');
                }
                this._show();
            },
            goodToast: function (text) {
                this._text(text);
                if (this.state() !== 'success') {
                    var elt = $('div.statusBar > div.alert');
//                    elt.text('Route Successfully Created!');
                    this._removeClasses();
                    elt.addClass('btn-success');
                    this.state('success');
                }
                this._show();

                var self = this;
                var id = setTimeout(function () {
                    self.reset();
                }, this.lingerTime());
                this.timeoutID(id);
            },
            badToast: function (text) {
                this._text(text);
                if (this.state() !== 'failure') {
                    var elt = $('div.statusBar > div.alert');
//                    elt.text('Failed To Create Route!');
                    this._removeClasses();
                    elt.addClass('btn-danger');
                    this.state('failure');
                }
                this._show();

                var self = this;
                var id = setTimeout(function () {
                    self.reset();
                }, this.lingerTime());
                this.timeoutID(id);
            },
            infoToast: function (text) {
                this._text(text);
                if (this.state() !== 'info') {
                    var elt = $('div.statusBar > div.alert');
                    this._removeClasses();
                    elt.addClass('btn-info');
                    this.state('info');
                }
                this._show();

                var self = this;
                var id = setTimeout(function () {
                    self.reset();
                }, this.lingerTime());
                this.timeoutID(id);
            }
        }
    });
}(nx, nx.global));