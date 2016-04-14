/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.view.CreatePathFooter', nx.ui.Component, {
        view: {
            tag: 'div',
            props: {
                'class': 'panel-footer'
            },
            content: {
                tag: 'div',
                props: {
                    'class': 'form-inline centerContainer'
                },
                content: [
                    {
                        tag: 'div',
                        props: {
                            'class': 'form-group',
                            style:'width:70%;margin-right:3px;'
                        },
                        content: [
                            {
                                tag: 'input',
                                props: {
                                    type: 'text',
                                    'class': 'form-control',
                                    placeholder: "LSP Name"
                                },
                                events: {
                                    keypress: function (sender, event) {
                                        this.model()._keyPress(sender, event);
                                    },
                                    keydown: function (sender, event) {
                                        this.model()._keyDown(sender, event);
                                        return true;
                                    }
                                }
                            },
                            //{
                            //    tag: 'span',
                            //    props: {
                            //        'class': 'glyphicon form-control-feedback'
                            //    }
                            //}

                        ]
                    }, {
                        tag: 'div',
                        content: 'Deploy',
                        props: {
                            'class': 'btn btn-danger',
                            style:'width:auto'
                        },
                        events: {
                            click: function (sender, event) {
                                this.model()._deployClicked(sender, event);
                            }
                        }
                    }
                ]
            }
        }
    });
}(nx, nx.global));
