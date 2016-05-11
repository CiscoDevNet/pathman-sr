/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.view.MetricSelector', nx.ui.Component, {
        view: {
            tag: 'div',
            props: {
                'class': '{metricClass}'
            },
            content: [
                {
                    tag: 'input',
                    props: {
                        type: 'radio',
                        name: 'metric',
                        'class': 'metric-radio',
                        checked: 'checked'
                    },
                    events: {
                        click: function(sender, event) {
                            // why is binding not working here??
                            this.model()._metricSelected(sender, event);
                        }
                    }
                },
                {
                    tag: 'span',
                    props: {
                        'class': 'metric-name',
                        'style':'color:#000;'
                    },
                    content: 'IGP'
                },
                {
                    tag: 'input',
                    props: {
                        type: 'radio',
                        name: 'metric',
                        'class': 'metric-radio'
                    },
                    events: {
                        click: function(sender, event) {
                            // why is binding not working here??
                            this.model()._metricSelected(sender, event);
                        }
                    }
                },
                {
                    tag: 'span',
                    props: {
                        'class': 'metric-name',
                        'style':'color:#000;'
                    },
                    content: 'Hops'
                }
            ]
        }
    });
}(nx, nx.global));
