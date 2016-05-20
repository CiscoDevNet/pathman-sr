/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.CostPath', nx.data.ObservableObject, {
        properties: {
            selected: {
                value: false
            },
            cost: {
                value: null
            },
            path: {
                value: null
            },
            id: {
                value: null
            },
            pathText: {
                value: null
            }
        },
        methods: {
            init: function(inParent, id, cost, path) {
                this.inherited();
                this._parent = inParent;
                this.id(id);
                this.cost(cost);
                this.path(path);
                this.pathText(this._preparePathText(path));
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

                return ret.length === 0 ? 'No nodes selected' : ret.join(' ');
            },
            _mouseEnter: function (sender, event) {
//                console.log('mouse enter path ' + this.id());

                if (this.path().length === 0) return;

                this._parent._pathEnter(this.id(), this.path());
            },
            _click: function (sender, event) {
//                console.log('tr clicked for path ' + this.id());
                event.currentTarget.querySelector('input').checked = 'checked';
                if (!this.selected()) {
                    this.selected(true);
                    this._onSelectionChanged();
                }
            },
            _inputClicked: function (sender, event) {
//                console.log('input clicked for path ' + this.id());
                if (!this.selected()) {
                    this.selected(true);
                    this._onSelectionChanged();
                }
            },
            _onSelectionChanged: function () {
                if (this.selected()) {
                    this._parent._pathSelected(this.id(), this.path());
                }
            },
            pathUpdated: function () {
                this.pathText(this._preparePathText(this.path()));
            }
        }
    });
}(nx, nx.global));
