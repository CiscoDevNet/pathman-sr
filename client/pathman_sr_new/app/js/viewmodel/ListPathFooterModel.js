/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.ListPathFooter', nx.data.ObservableObject, {
        properties: {
            mode: 'default'
        },
        methods: {
            init: function (inParent, view) {
                this.inherited();
                this._parent = inParent;
                view.model(this);
            },
            reset: function () {
                this.exitDeleteMode();
            },
            _createClicked: function () {
                this._parent._parent.showCreatePathPanel();
            },
            _deleteClicked: function () {
                this._parent.startDelete();
            },
            _deleteConfirmClicked: function () {
                this._parent.deleteSelected();
            },
            _cancelClicked: function () {
                this._parent.endDelete();
            },
            enterDeleteMode: function () {
                $('div.default-footer').addClass('default-footer-hidden');
                $('div.delete-footer').removeClass('delete-footer-hidden');
                this.mode('delete');
            },
            exitDeleteMode: function () {
                $('div.default-footer').removeClass('default-footer-hidden');
                $('div.delete-footer').addClass('delete-footer-hidden');
                this.mode('default');
            }
        }
    });
}(nx, nx.global));
