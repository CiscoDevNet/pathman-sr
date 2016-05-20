/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.CreatePathFooter', nx.data.ObservableObject, {
        properties: {
            text: '',
            inputState: null
        },
        methods: {
            init: function (inParent, view) {
                this.inherited();
                this._parent = inParent;
                view.model(this);
            },
            reset: function () {
                this._inputReset();
                $('div.centerContainer input').val('');
            },
            _backClicked: function (sender, event) {
                this._parent._backClicked();
            },
            _deployClicked: function (sender, event) {
                this._parent._deployClicked();
            },
            _keyDown: function (sender, event) {
                // check for delete (backspace) and 1 char remaining in input
                if (event.keyCode === 8) {
                    this.text(event.currentTarget.value.slice(0, -1));

                    if (this.text() === '') {
                        this._inputReset();
                    } else {
                        var valid = this._parent._inputChanged(this.text());
                        if (valid) {
                            this._inputValid();
                        } else {
                            this._inputInvalid();
                        }
                    }
                }
            },
            _keyPress: function (sender, event) {
                this.text(event.currentTarget.value + String.fromCharCode(event.keyCode));

                var valid = this._parent._inputChanged(this.text());
                if (valid) {
                    this._inputValid();
                } else {
                    this._inputInvalid();
                }
            },
            _inputInvalid: function() {
                if (this.inputState() === 'invalid') return;

                var container = $('div.centerContainer > div.has-feedback');
                container.removeClass('has-success');
                container.addClass('has-error');

                var span = $('div.centerContainer span.glyphicon');
                span.removeClass('glyphicon-ok');
                span.addClass('glyphicon-remove');

                this.inputState('invalid');
            },
            _inputValid: function () {
                if (this.inputState() === 'valid') return;

                var container = $('div.centerContainer > div.has-feedback');
                container.removeClass('has-error');
                container.addClass('has-success');

                var span = $('div.centerContainer span.glyphicon');
                span.removeClass('glyphicon-remove');
                span.addClass('glyphicon-ok');

                this.inputState('valid');
            },
            _inputReset: function () {
                if (this.inputState() === null) return;

                var container = $('div.centerContainer > div.has-feedback');
                container.removeClass('has-error');
                container.removeClass('has-success');

                var span = $('div.centerContainer span.glyphicon');
                span.removeClass('glyphicon-remove');
                span.removeClass('glyphicon-ok');

                this.inputState(null);
            },
            isNameValid: function () {
                return this.inputState() === 'valid';
            }
        }
    });
}(nx, nx.global));
