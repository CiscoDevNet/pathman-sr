/**
 * Created by tylevine on 8/22/14.
 */

(function (nx, global) {
    nx.define('pathman_sr.viewmodel.MetricSelector', nx.data.ObservableObject, {
        properties: {
            metric: {
                value: 'igp'
            },
            metricClass: 'metric-selector metric-selector-hidden',
            titleClass: 'metric-selector-title',
            titleText:  'Cost Metric'
        },
        methods: {
            init: function(inParent, view) {
                this.inherited();
                this._parent = inParent;
                view.model(this);
            },
            reset: function () {
                $('div.metric-selector input:first').prop('checked', 'checked');
                this.metric('igp');
            },
            _metricSelected: function (sender, event) {
                var metric = event.target.nextElementSibling.innerText.toLowerCase();
                if (metric !== this.metric()) {
                    this.metric(metric);
                    this._parent._parent._metricChanged(metric);
                }
            },
            show: function () {
                if (!this.isHidden()) return;

//                var classes = this.metricClass().split(' ');
//                var idx = classes.indexOf('metric-selector-hidden');
//                classes.splice(idx, 1);
//                this.metricClass(classes.join(' '));
                // fuck it, I don't have time to get this binding bullshit working correctly,
                // just use jquery
                $('div.metric-selector').removeClass('metric-selector-hidden');
            },
            hide: function () {
                if (this.isHidden()) return;

//                var classes = this.metricClass().split(' ');
//                classes.push('metric-selector-hidden');
//                this.metricClass(classes.join(' '));
                $('div.metric-selector').addClass('metric-selector-hidden');
            },
            isHidden: function () {
                return $('div.metric-selector').hasClass('metric-selector-hidden');
//                return this.metricClass().search('metric-selector-hidden') !== -1;
            }
        }
    });
}(nx, nx.global));
