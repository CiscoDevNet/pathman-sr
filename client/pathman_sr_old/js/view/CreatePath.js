/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.view.CreatePath', nx.ui.Component, {
        view: {
            tag: 'div',
            props: {
                'class': ['panel-body createpanel ','{#model.panelClass}','{#model.selectMode}']
            },
            content: [
                {
                    props:{
                        'class':'btn-group',
                        style:{
                            'margin':'0 auto 20px'
                        }
                    },
                    content:[{
                        tag:'button',
                        props:{
                            type:'button',
                            'class':['btn btn-default','{#model.endPointSelectorBtnCls}']
                        },
                        content:"Auto Path",
                        events:{
                            click: function (sender,evt) {
                                this.model()._switchToEndPointSelectPath(sender,evt);
                            }
                        }
                    },{
                        tag:'button',
                        props:{
                            type:'button',
                            'class':['btn btn-default',"{#model.manualPathBtnCls}"]
                        },
                        content:"Manual Path",
                        events:{
                            click: function (sender,evt) {
                                this.model()._manualClicked(sender, event);
                                this.model()._switchToManualSelectPath(sender,evt);
                            }
                        }
                    }
//                        ,{
//                        tag:'button',
//                        props:{
//                            type:'button',
//                            'class':'btn btn-default disabled'
//                        },
//                        content:"Consult WAE",
//                        events: {
//                            click: function (sender, event) {
//                                this.model()._consultWAEClicked(sender, event);
//                            }
//                        }
//                    }
                    ]
                },
                {
                    name: 'endpointSelector',
                    type: 'pathman_sr.view.EndpointSelector'
                },
                {
                    props:{
                        'class':['create-panel-item manual-selector']
                    },
                    content:[{
                        props:{
                            'class':['manual-selector-tip','{#model.showPath}'],
                            style:'border:none'
                        },
                        content:'Select the source/target on the topology'
                    }]
                },
                //{
                //    name: 'ExtraButtons',
                //    tag: 'div',
                //    props: {
                //        'class': 'extra-buttons create-panel-item'
                //    },
                //    content: [
                //        {
                //            tag: 'div',
                //            props: {
                //                'class': 'btn btn-danger'
                //            },
                //            content: 'Manual Path',
                //            events: {
                //                click: function (sender, event) {
                //                    this.model()._manualClicked(sender, event);
                //                }
                //            }
                //        },
                //        {
                //            tag: 'div',
                //            props: {
                //                'class': 'btn btn-danger'
                //            },
                //            content: 'Consult WAE',
                //            events: {
                //                click: function (sender, event) {
                //                    this.model()._consultWAEClicked(sender, event);
                //                }
                //            }
                //        }
                //    ]
                //},
                {
                    tag: 'div',
                    props: {
                        'class': ['table-container',"{#model.showPath}"]
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
                                                'class': 'costCol ',
                                                style: 'color:#000;'
                                            },
                                            content: 'Cost'
                                            
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
                                        type: 'pathman_sr.view.CostPath'
                                    },
                                    style: 'color:#000;'
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'footer',
                    type: 'pathman_sr.view.CreatePathFooter',
                    props:{
                        'class':['panel-footer','{#model.showPath}']
                    }
                }
            ]
        }
    });
}(nx, nx.global));
