(function (nx, global) {
    nx.define('pathman_sr.view.StatusBar', nx.ui.Component, {
        view: {
            props: {
                'class': 'statusBar'
            },
            content: {
                props: {
                    'class': 'alert disabled',
                    'style': 'border-color: #997b19;'
                }
            }
        }
    });
}(nx, nx.global));
