/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.view.ListPath', nx.ui.Component, {
        view: {
            tag: 'div',
            props: {
                'class':['panel-body listpanel','{#model.listPanelClass}']
            },
            content: [
                {
                    tag: 'div',
                    props: {
                        'class': 'table-container'
                    },
                    content: {
                        tag: 'table',
                        props: {
                            'class': 'table table-condensed'
                        },
                        events: {
                            mouseleave: function (sender, event) {
                                this.model()._mouseExitTable(sender, event);
                            }
                        },
                        content: [
                            {
                                tag: 'thead',
                                content: {
                                    tag: 'tr',
                                    content: [
                                        {
                                            tag: 'th',
                                            props: {
                                                'class': 'inputCol'
                                            }
                                        },
                                        {
                                            tag: 'th',

                                            props: {
                                                'class': 'nameCol',
                                                style: 'color:#000;'
                                            },
                                            content: 'Name'
                                        },
                                        {
                                            tag: 'th',
                                            props: {
                                                'class': 'pathCol',
                                                 style: 'color:#000;'
                                            },
                                            content: 'Path'
                                        }
                                    ]
                                }
                            },
                            {
                                tag: 'tbody',
                                props: {
                                    items: '{entries}',
                                    template: {
                                        type: 'pathman_sr.view.NamePath'
                                    },
                                    style: 'color:#000;'
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'footer',
                    type: 'pathman_sr.view.ListPathFooter'
                }
            ]
        }
    });
}(nx, nx.global));
