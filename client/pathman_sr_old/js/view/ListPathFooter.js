/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.view.ListPathFooter', nx.ui.Component, {
        view: [
            {
                tag: 'div',
                props: {
                    'class': 'panel-footer default-footer'
                },
                content: {
                    tag: 'div',
                    content: [
                        {
                            tag: 'div',
                            content: 'Create new LSP',
                            props: {
                                'class': 'btn btn-success'
                            },
                            events: {
                                click: function (sender, event) {
                                    this.model()._createClicked(sender, event);
                                }
                            }
                        },
                        {
                            tag: 'div',
                            content: 'Delete LSP',
                            props: {
                                'class': 'btn btn-danger'
                            },
                            events: {
                                click: function (sender, event) {
                                    this.model()._deleteClicked(sender, event);
                                }
                            }
                        }
                    ]
                }
            },
            {
                tag: 'div',
                props: {
                    'class': 'panel-footer delete-footer delete-footer-hidden'
                },
                content: {
                    tag: 'div',
                    content: [
                        {
                            tag: 'div',
                            content: 'Delete LSPs',
                            props: {
                                'class': 'btn btn-danger'
                            },
                            events: {
                                click: function (sender, event) {
                                    this.model()._deleteConfirmClicked(sender, event);
                                }
                            }
                        },
                        {
                            tag: 'div',
                            content: 'Cancel',
                            props: {
                                'class': 'btn btn-default'
                            },
                            events: {
                                click: function (sender, event) {
                                    this.model()._cancelClicked(sender, event);
                                }
                            }
                        }
                    ]
                }
            }
        ]
    });
}(nx, nx.global));
