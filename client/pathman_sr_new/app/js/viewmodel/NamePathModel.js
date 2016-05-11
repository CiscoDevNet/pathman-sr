/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.NamePath', nx.data.ObservableObject, {
        properties: {
            selected: {
                value: false
            },
            name: {
                value: null
            },
            path: {
                value: null
            },
            inputClass: {
                value: 'input-hidden'
            },
            id: {
                value: null
            },
            pathText: {
                value: null
            }
        },
        methods: {
            init: function(inParent, id, name, path) {
                this.inherited();
                this._parent = inParent;
                this.id(id);
                this.name(name);
                this.path(path);
                this.pathText(this._preparePathText(path));
            },
            _mouseEnter: function (sender, event) {
                this._parent._pathEnter(this.id());
            },
//            _mouseExit: function (sender, event) {
//                console.log('mouse exit path ' + this.id());
//            },
            _selectionChanged: function () {
                this.selected(!this.selected());
                if (this.selected()){
//                    console.log('selected path ' + this.id());
                } else {
//                    console.log('unselected path ' + this.id());
                }
            },
            _preparePathText: function (path) {
                var ret = [];
                var first = true;
                path.forEach(function(item) {
                    if (first) {
                        first = false;
                        ret.push(item);
                    }
                    else
                    {
                        ret.push('->');
                        ret.push(item);
                    }
                });

                return ret.join(' ');
            },
            _inputClicked: function (sender, event) {
//                console.log('input clicked for path ' + this.id());
                this._selectionChanged();
            },
//            _click: function (sender, event) {
//                console.log('clicked path ' + this.id());
//                this.inputClass('');
//            },
            toggleInputHidden: function () {
                if (this.isInputHidden()) {
                    this._showInput();
                } else {
                    this._hideInput();
                }
            },
            _hideInput: function () {
                if (this.isInputHidden()) return;

                var classes = this.inputClass().split(' ');
                classes.push('input-hidden');
                this.inputClass(classes.join(' '));
            },
            _showInput: function () {
                if (!this.isInputHidden()) return;

                var classes = this.inputClass().split(' ');
                var idx = classes.indexOf('input-hidden');
                classes.splice(idx, 1);
                this.inputClass(classes.join(' '));
            },
            isInputHidden: function () {
                return this.inputClass().search('input-hidden') !== -1;
            }
        }
    });
}(nx, nx.global));
