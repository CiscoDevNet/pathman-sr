(function (nx, global) {
    nx.define('pathman_sr.view.Main', nx.ui.Component, {
        view: {
            props: {
                'class': 'ui-main'
            },
            content: [
//                {
//                    name: 'topBar',
//                    type: 'pathman_sr.view.BeginRoute'
//                },
                {
                    name: 'terminalContainer',
                    props: {
                        style:'{#model.terminalContainerPos}',
                        'class': 'terminal-container',
                        template: {
                            type: 'odl.TerminalWindow',
                            props: {
                                maximized: "{value.maximized,direction=<>}",
                                opened: "{value.opened}",
                                address: "{value.address}",
                                port: "{value.port}",
                                title: '{value.title}',
                                service: '{value.service}'

                            },
                            events: {
                                close: "{value.onClose}"
                            }
                        },
                        items: "{#model.terminalWindows}"
                    }
                },
                {
                    name: 'pathInfo',
                    type: 'pathman_sr.view.PathInfo'
                },
                {
                    props: {
                        class: 'rightbar',
                        //style:'{#model.rightpanelColor}'
                        style:'background-color:#F5F5F5'
                    },
                    content:[
                        {
                            props: {
                                class: '{#model.rightpanelClass}'
                            },
                            content:{
                                tag:'button',
                                props: {
                                    class: 'control',
                                    title:'Establish LSP'
                                },
                                events:{
                                    click:'{#model.openRightPanel}'
                                },
                                content:{
                                    props: {
                                        tag:'i',
                                        class: 'fa fa-random'

                                    }
//                                    content:'LSP'

                                }
                            }
                        }
                    ]
                },
                {
                    name: 'topo',
                    type: 'osc.topology.comp',
                    props: {
                        adaptive: true,
                        data: {},
                        nodeConfig: {
                            label: 'model.name',
                            iconType: 'router'
                        },
                        linkConfig: {
                            linkType: 'curve'
                        },
                        theme: 'blue',
                        identityKey: 'name',
                        //layoutType: 'USMap',
                        /*layoutConfig: {
                            longitude: 'model.longitude',
                            latitude: 'model.latitude'
//                            worldTopoJson: '../../lib/world-50m.json'
                        },*/
                        dataProcessor: 'force',
                        showIcon: true,
                        tooltipManagerConfig: {
                            showLinkTooltip: false,
                            nodeTooltipContentClass: 'odl.BGP.TooltipView'
                        },
                        style:'background:#F5F5F5'
                    },
                    events: {
                        'ready':'{pathTopo.ready}',
                        'clickNode': '{pathTopo.clickNode}',
                        'clickStage': '{pathTopo.clickStage}',
                        'topologyGenerated': '{pathTopo.generated}'
                    }
                },
                {
                    name: 'statusBar',
                    type: 'pathman_sr.view.StatusBar'
                }
            ]
        }
    });
    nx.define("osc.topology.comp",nx.graphic.Topology, {
        view: function(view){
            view.content.push({
                name: "loadingImg",
                tag: "img",
                props:{
                    src: "../assets/image/spinner_32_32.gif",
                    style: {
                        "position": "absolute",
                        "left": "50%",
                        "top": "50%",
                        //"width":"100%",
                        //"height": "100%",
                        "display": "none"
                    }
                }
            });
            return view;
        },
        methods:{
            showLoading: function(){
                this.view("loadingImg").dom().setStyle("display", "block");
            },
            hideLoading: function(){
                this.view("loadingImg").dom().setStyle("display", "none");
            }
        }
    });
}(nx, nx.global));
