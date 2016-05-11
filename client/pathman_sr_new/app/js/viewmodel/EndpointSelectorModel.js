/**
 * Created by tylevine on 8/22/14.
 */
(function (nx, global) {
    nx.define('pathman_sr.viewmodel.EndpointSelector', nx.data.ObservableObject, {
        properties: {
            endpoints: null,
            source: null,
            dest: null,
        },
        methods: {
            init: function(inParent, view) {
                this.inherited();
                this._parent = inParent;
                new pathman_sr.viewmodel.MetricSelector(this,view.view('metricSelector'))
                view.model(this);
            },
            reset: function () {
                $('select#sourceDropdown').prop('selectedIndex', 0);
                $('select#destDropdown').prop('selectedIndex', 0);
                this.source(null);
                this.dest(null);
                this._parent._parent._parent.pathTopo().updateSource(null);
                this._parent._parent._parent.pathTopo().updateDest(null);
            },
            setNodes: function (nodes) {
                this.endpoints(nodes);
                var elts = '';
                nodes.forEach(function (node) {
                    elts += '<option>' + node.name + '</option>\n';
                });
                var srcOption = '<option>Source</option>\n';
                var destOption = '<option>Destination</option>';
                $('select#sourceDropdown').html(srcOption + elts);
                $('select#destDropdown').html(destOption + elts);
            },
            _sourceSelected: function (sender, event) {
                var selected = event.target.selectedOptions[0].label;
//                console.log('source: ' + selected);
                this.source(selected);
                this._parent.endpointChanged();
                // this is ugly :(
                this._parent._parent._parent.pathTopo().updateSource(selected);
            },
            _destSelected: function (sender, event) {
                var selected = event.target.selectedOptions[0].label;
//                console.log('destination: ' + selected);
                this.dest(selected);
                this._parent.endpointChanged();
                // this is ugly :(
                this._parent._parent._parent.pathTopo().updateDest(selected);
            },
            _goClicked: function (sender, event) {
//                console.log('go clicked');
                this._parent.loadCreatablePaths();
            }
        }
    });
}(nx, nx.global));
