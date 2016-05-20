/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.view.NamePath', nx.ui.Component, {
        view: {
            tag: 'tr',
            content: [
                {
                    tag: 'td',
                    content: {
                        tag: 'input',
                        props: {
                            type: 'checkbox',
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
                    content: '{name}'
                },
                {
                    tag: 'td',
                    content: '{pathText}'
                }
            ],
            events: {
                mouseenter: '{_mouseEnter}'
            }
        }
    });
}(nx, nx.global));
