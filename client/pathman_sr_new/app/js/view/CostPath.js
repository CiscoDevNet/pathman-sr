/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.view.CostPath', nx.ui.Component, {
        view: {
            tag: 'tr',
            content: [
                {
                    tag: 'td',
                    content: {
                        tag: 'input',
                        props: {
                            type: 'radio',
                            name: 'path',
                            'class': '{inputClass}'
                        },
                        events: {
                            click: '{_inputClicked}'
                        }
                    },
                    props: {
                        'class': 'inputCell'
                    }
                },
                {
                    tag: 'td',
                    content: {
                        tag: 'span',
                        props: {
                            'class': 'badge'
                        },
                        content: '{cost}'
                    }
                },
                {
                    tag: 'td',
                    content: '{pathText}'
                }
            ],
            events: {
                mouseenter: '{_mouseEnter}',
                click: '{_click}'
            }
        }
    });
}(nx, nx.global));
