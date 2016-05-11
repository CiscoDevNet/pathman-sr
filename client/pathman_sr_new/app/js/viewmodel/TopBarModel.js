(function (nx, global) {
    nx.define('pathman_sr.viewmodel.TopBar', nx.data.ObservableObject, {
        properties: {
            sourceList: null,
            destinationList: null
        },
        methods: {
            init: function(inParent)    {
                this.inherited();
                this._parent = inParent;
                this.reset();
            },
            clickCreate: function () {
//                console.log('create clicked');
            },
            clickList: function () {
//                console.log('list clicked');
            },
            clickDelete: function () {
//                console.log('delete clicked');
            },
            setNodes: function (nodes) {
                var sources = nodes.slice(0);
                sources.unshift({name: 'Source'});
                this.sourceList(sources);

                var dests = nodes.slice(0);
                dests.unshift({name: 'Destination'});
                this.destinationList(dests);
            },
            sourceSelected: function (sender, event) {
                var selected = event.target.selectedOptions[0].label;
//                console.log('source: ' + selected);
                this._parent.pathInfo().source(selected);
                this._parent.pathInfo().endpointChanged();
                this._parent.pathTopo().updateSource();
            },
            destSelected: function (sender, event) {
                var selected = event.target.selectedOptions[0].label;
//                console.log('destination: ' + selected);
                this._parent.pathInfo().dest(selected);
                this._parent.pathInfo().endpointChanged();
                this._parent.pathTopo().updateDest();
            },
            goClicked: function (sender, event) {
//                console.log('go clicked');
                this._parent.pathInfo().loadCreatablePaths();
            },
            reset: function () {
//                this.state('default');
            }
        }
    });
}(nx, nx.global));