(function(nx){
    nx.Binding.converters.emptyDesc = {
        convert: function (value) {
            return value || '[No description]';
        }
    };
    nx.define("odl.BGP.TooltipView",nx.ui.Component,{
        properties:{
            node:null
        },
        view: {
            props: {
                'class':'bgp-tooltip'
//                model:'{#model.nodeTooltipModel}'
            },
            content: [
                {
                    tag: 'h4',
                    content: [
                        {
                            tag: 'span',
                            content: '{#node.model.name}'
                        },
                        {
                            tag: 'a',
                            props: {
                                href: '#',
                                style: "font-size:12px;float:right;line-height:20px;color:#1BAAFD;"
                            },
                            events: {
//                                click: '{#model._openTerminal}'
                            },
                            content: 'Terminal'
                        }
                    ]
                },
                {
                    tag: 'table',
                    props: {
                        style: {
                            'font-size': '12px'
                        }
                    },
                    content: [
                        {
                            tag: 'colgroup',
                            content: [
                                {
                                    tag: 'col',
                                    props: {
                                        style: {
                                            width: '100px'
                                        }
                                    }
                                },
                                {
                                    tag: 'col',
                                    props: {
                                        style: {
                                            width: '250px'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'tbody',
                            content: [
                                {
                                    tag: 'tr',
                                    content: [
                                        {
                                            tag: 'td',
                                            props:{
                                                style:{
                                                    'white-space':'nowrap'
                                                }
                                            },
                                            content: 'IP Address:'
                                        },
                                        {
                                            tag: 'td',
                                            content: {
                                                content: '{#node.model.ipaddress}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        methods: {
            onAttach:function(parent,index){
                this.inherited(parent,index);
               // this.model()._loadInterfaces(this.node());
            }
        }
    });
})(nx);
