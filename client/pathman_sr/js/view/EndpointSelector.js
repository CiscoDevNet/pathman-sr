/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.view.EndpointSelector', nx.ui.Component, {
        view: {
            props: {
                'class': 'create-panel-item endpoint-selector'
            },
            content: [{
                props:{
                    'class': 'row'
                },
                content: [{
                    props: {
                        'class': 'form-group',
                        content: [{
                            tag: 'label',
                            props: {
                                'class': 'col-sm-3 control-label',
                                'style':'color:#000;'
                            },
                            content: 'Source'
                        }, {
                            props: {
                                'class': 'col-sm-9',
                                content: {
                                    tag: 'select',
                                    props: {
                                        'class': 'form-control input-sm',
                                        id: 'sourceDropdown'
                                    },
                                    events: {
                                        change: function (sender, event) {
                                            this.model()._sourceSelected(sender, event);
                                        }
                                    }
                                }
                            }
                        }]
                    }
                }]
            }, {
                props:{
                    'class': 'row'
                },
                content: [{
                    props: {
                        'class': 'form-group',
                        content: [{
                            tag: 'label',
                            props: {
                                'class': 'col-sm-3 control-label',
                                'style':'color:#000;'
                            },
                            content: 'Destination'
                        }, {
                            props: {
                                'class': 'col-sm-9',
                                content: {
                                    tag: 'select',
                                    props: {
                                        'class': 'form-control input-sm',
                                        id: 'destDropdown'
                                    },
                                    events: {
                                        change: function (sender, event) {
                                            this.model()._destSelected(sender, event);
                                        }
                                    }
                                }
                            }
                        }]
                    }
                }]
            }, {
                props: {
                    'class': 'row'
                },
                content: [{
                    tag: 'label',
                    props: {
                        'class': 'col-sm-3 control-label',
                        style:'color:#000'
                    },
                    content: "Cost Metric"
                }, {
                    props: {
                        'class': 'col-sm-9'
                    },
                    content: {
                        name: 'metricSelector',
                        type: 'pathman_sr.view.MetricSelector'
                    }
                }]
            }, {
                props: {
                    'class': 'row'
                },
                content: [
                    {
                        tag: 'div',
                        props: {
                            style:"margin-right:15px;width:100px",
                            'class': 'btn btn-success pull-right'
                        },
                        content: 'Go',
                        events: {
                            click: function (sender, event) {
                                this.model()._goClicked(sender, event);
                            }
                        }
                    }
                ]
            }]
        }
    });
}(nx, nx.global));
