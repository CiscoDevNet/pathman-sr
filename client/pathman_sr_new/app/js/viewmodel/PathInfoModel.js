(function (nx, global) {
    nx.define('pathman_sr.viewmodel.PathInfo', nx.data.ObservableObject, {
        properties: {
            'class': 'panel-title',
            title: 'Established LSPs',
            state: 'list',
            //metricSelector: null,
            createPath: null,
            listPath: null
        },
        methods: {
            init: function(inParent, view) {
                this.inherited();
                this._parent = inParent;

                //this.metricSelector(new pathman_sr.viewmodel.MetricSelector(this, view.view('metricSelector')));
                this.createPath(new pathman_sr.viewmodel.CreatePath(this, view.view('createPath')));
                this.listPath(new pathman_sr.viewmodel.ListPath(this, view.view('listPath')));
                view.model(this);
            },
            showCreatePathPanel: function () {
                this.createPath().panelClass('');
                this.listPath().listPanelClass('listpanel-hidden');
                //$('div.listpanel').addClass('listpanel-hidden');
                this._showMetricSelector();
                $('span.panel-title').text('Create new LSP');
                $('.create-lsp-back').show();
                this.state('create');
            },
            showListPathPanel: function () {
                this.createPath().panelClass('createpanel-hidden');
                this.listPath().listPanelClass('');
                //$('div.listpanel').removeClass('listpanel-hidden');
                this._hideMetricSelector();
                $('span.panel-title').text('Established LSPs');
                $('.create-lsp-back').hide();
                this.state('list');
            },
            _showMetricSelector: function () {
                $('div.metric-selector').removeClass('metric-selector-hidden');
            },
            _hideMetricSelector: function () {
                $('div.metric-selector').addClass('metric-selector-hidden');
            },
            endpointChanged: function () {
                if (this.selectedPath() !== null) {
                    this._pathExit(this.selectedPath());
                    this.selectedPath(null);
                }
            },
            isValidLSPName: function (name) {
                return this.listPath().isValidLSPName(name);
            },
            metricChanged: function (metric) {
                this.createPath()._metricChanged(metric);
            }
        }
    });
}(nx, nx.global));
