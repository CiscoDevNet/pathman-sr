(function (nx, global) {
    nx.define('pathman_sr.viewmodel.PathTopology', nx.data.ObservableObject, {
        properties: {
            // collection of nodes representing the current path
            source: null,
            dest: null,
            paths: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            manualMode: false,
            nodeClickCallback: null
        },
        methods: {
            init: function (inParent) {
                this.inherited();
                this._parent = inParent;

                var self = this;

                this.paths().on('change', function () {
                    self._renderPaths();
                });
            },
            ready: function (sender) {
                this.inherited(sender);
                sender.showLoading();
//                this._parent.showSideBar();
            },
            generated: function (sender) {
                 sender.hideLoading();
                this.inherited(sender);
//                this._parent.showSideBar();
            },
            reset: function () {
                this.paths().clear();
                this.source(null);
                this.dest(null);
            },
            clickNode: function (sender, node) {
//                console.log(this.manualMode())
                if (!this.manualMode())
                {
                   sender.tooltipManager().openNodeTooltip(node)
                    return;
                }

                this.inherited();
                if (this.nodeClickCallback() !== null) {
                    var ret = this.nodeClickCallback()(node.label(), node.selected());
                    node.selected(ret);
                }
            },
            enterManualMode: function() {
                this.manualMode(true);
            },
            endManualMode: function () {
                this.manualMode(false);
                var statusBar = this._parent.statusBar();
                statusBar.reset();
            },
            clickStage: function(sender, event) {},
            addPath: function(nodes, options) {
                options = this._defaultPathOptions(options);
                var path = {
                    nodeNames: nodes,
                    nodes: [],
                    color: options.color,
                    arrow: options.arrow,
                    padding: options.padding
                };

                // convert node names to actual nodes
                nodes.forEach(function (node) {
                    path.nodes.push(this._getNodeByName(node));
                }, this);
                this.paths().add(path);
            },
            removePath: function(nodes) {
//                var self = this;
                var removePath;
                this.paths().each(function(path) {
                    var match = true;
                    for (var i = 0; i < path.nodeNames.length; i++) {
                        if (path.nodeNames[i] !== nodes[i]) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        // found the correct path, remove it from paths property
                        // but don't do it while we're still iterating through the paths,
                        // otherwise we could throw errors by concurrently modifying the collection
                        removePath = path;
                    }
                }, this);

                if (removePath) {
                    this.paths().remove(removePath);
                }
            },
            updateSource: function (srcName) {
                var node = this._getNodeByName(srcName);
                this.source(node);
                this._parent.topo().selectedNodes().clear();

                if (node) {
                    this._parent.topo().selectedNodes().add(node);
                }

                if (this.dest()) {
                    this._parent.topo().selectedNodes().add(this.dest());
                }
            },
            updateDest: function (destName) {
                var node = this._getNodeByName(destName);
                this.dest(node);
                this._parent.topo().selectedNodes().clear();

                if (node) {
                    this._parent.topo().selectedNodes().add(node);
                }

                if (this.source()) {
                    this._parent.topo().selectedNodes().add(this.source());
                }
            },
            _renderPaths: function() {
                // clear all existing paths
                this._parent.topo().getLayer('paths').clear();

                var self = this;
                this.paths().each(function (path) {
                    self._renderPath(path);
                });
            },
            _defaultPathOptions: function(options) {
                var defaultOptions = {
                    color: '#ff0000',
                    arrow: 'end',
                    padding: 5
                };

                if (!options) return defaultOptions;

                return {
                    color: options.color || defaultOptions.color,
                    arrow: options.arrow || defaultOptions.arrow,
                    padding: options.padding || defaultOptions.padding
                };
            },
            _getNodeByName: function (nodeName) {
                if (nodeName === null) return null;

                var ret = null;
                this._parent.topo().getLayer('nodes').nodes().forEach(function (node) {
                    if (node.label !== undefined && node.label() === nodeName) {
                        ret = node;
                    } else if (node.key !== undefined && node.key() === nodeName) {
                        ret = node.value();
                    }
                });
                return ret;
            },
            beginRoute: function () {
                this._enterPathMode();
            },
            cancelRoute: function () {
                this._exitPathMode();
            },
            _disableTooltips: function () {
//                console.log('tooltips disabled');
                this._parent.topo().tooltipManager().showNodeTooltip(false);
                this._parent.topo().tooltipManager().closeAll();
            },
            _enableTooltips: function () {
//                console.log('tooltips enabled');
                this._parent.topo().tooltipManager().showNodeTooltip(true);
            },
            /**
             * Takes a possibly invalid array of nodes that represent a path and turns it into a valid one.
             * If the given path is valid, it is checked and returned without modification.
             * If it is not valid, it removes nodes from the end of the path until the path becomes
             * valid, or until there is only one node left in the path.
             * @private
             */
            _validatePath: function (nodes) {
                var self = this;
                var lastNode;

                if (nodes.length < 2) {
                    return nodes;
                }

                nodes.forEach(function (node) {
                    if (typeof lastNode === 'undefined') {
                        lastNode = node;
                    } else {
                        if (node)
                        {
                            var link = self._getLinksBetweenNodes(lastNode, node);
                            if (typeof link === 'undefined') {
                                // path is invalid
                                // remove last node and try again
                                var removed = nodes.splice(nodes.length - 1, 1);
                                removed.forEach(function (removedNode) {
                                    removedNode.selected(false);
                                });
                                return self._validatePath(nodes);
                            }
                            lastNode = node;
                        }
                    }
                });

                // path must be valid
                return nodes;
            },
            /**
             * Validate path by node names.
             * @param nodes
             */
            validatePath: function (nodes) {
                var nodeObjects = [];
                var self = this;
                nodes.forEach(function (node) {
                    nodeObjects.push(self._getNodeByName(node));
                });

                nodeObjects = this._validatePath(nodeObjects);

                var ret = [];
                nodeObjects.forEach(function (node) {
                    ret.push(node.label());
                });

                return ret;
            },
            _getLinksBetweenNodes: function (src, dest) {
                var linkset = this._parent.topo().getLinkSet(src.id(), dest.id());
                if (linkset !== null) {
                    return nx.util.values(linkset.links());
                }
            },
            /**
             * Takes an array of nodes representing a path, and then returns an array of links suitable for
             * using as the links property of a nx.graphic.Topology.Path component.
             * @private
             */
            _nodesToLinks: function(nodes) {
                var ret = [];
                var lastNode;
                var self = this;

                if (this._validatePath(nodes) === undefined) {
                    return;
                }

                nodes.forEach(function (node) {
                    if (typeof lastNode === 'undefined') {
                        lastNode = node;
                    } else {
                        if(node)
                        {
                            var link = self._getLinksBetweenNodes(lastNode, node);

                            if (typeof link === 'undefined') {
                                console.log("ERROR: path must be valid!");
                                return;
                            }

                            ret.push(link[0]);
                            lastNode = node;
                        }
                    }
                });

                return ret;
            },
            /**
             * Creates a path on the path layer
             * @private
             */
            _renderPath: function (path) {
                var pathLayer = this._parent.topo().getLayer('paths');
                var self = this;

                var links = self._nodesToLinks(path.nodes);

                if (links === undefined || links.length === 0) {
                    return;
                }

                var topoPath = new nx.graphic.Topology.Path({
                    links: links,
                    pathPadding: path.padding,
                    arrow: path.arrow,
                    pathStyle: {
                        fill: path.color
                    }
                });

                pathLayer.addPath(topoPath);
                path.graphic = topoPath;
            }
        }
    });
}(nx, nx.global));
