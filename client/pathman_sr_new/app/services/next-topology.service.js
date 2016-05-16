(function(app){

	/*
	 NextTopologyService
	 The service encapsulates NeXt-specific logic. It does not perform any REST API calls.
	 */

	var NextTopologyService = function() {

		var self = this;

		this.fadeInAllLayers = fadeInAllLayers;
		this.clearPathLayer = clearPathLayer;
		this.createTopoObject = createTopoObject;
		this.highlightPath = highlightPath;
		this.initTopology = initTopology;

		this._getLinksBetweenNodes = _getLinksBetweenNodes;
		this._nodesToLinks = _nodesToLinks;

		this._colorTable = {
			"paths": {
				"pathListHover": "#ffd966",
				"pathListSelected": "#ff7300",
				"deployed": "#00ff00",
				"deploymentFailed": "#ff0000",
				"_default": "#3333cc"
			}
		};

		function fadeInAllLayers(){

		}

		function clearPathLayer(topo){
			var pathLayer = topo.getLayer("paths");
			pathLayer.clear();
			return pathLayer;
		}

		function createTopoObject() {

			return new nx.graphic.Topology({
				adaptive: true,
				scalable: true,
				nodeConfig: {
					label: "model.name",
					iconType: "router"
				},
				linkConfig: {
					linkType: "curve"
				},
				theme: "blue",
				identityKey: "name",
				dataProcessor: "force",
				showIcon: true
			});
		}

		/**
		 * Highlight path by nodes' names
		 * @param topo {Object}
		 * @param hopListNames {Array} Array of names of hop routers
		 * @param type {String} Type of a path. See color table above
		 */
		function highlightPath(topo, hopListNames, type){

			var pathLayer = topo.getLayer("paths");
			var hopList = [];
			var pathLinkList = [];
			var pathColor = self._colorTable["paths"][type] === "undefined" ?
				self._colorTable["paths"]._default : self._colorTable["paths"][type];

			// not using .map, because we need to be able to exclude "bad" nodes
			for(var i = 0; i < hopListNames.length; i++){
				var hopNode = topo.getNode(hopListNames[i]);
				if(hopNode)
					hopList.push(hopNode);
			}

			console.log(hopList);

			pathLinkList = self._nodesToLinks(topo, hopList);


			if(pathLinkList !== false){
				// create a new Path entity
				var path = new nx.graphic.Topology.Path({
					"pathWidth": 3,
					"links": pathLinkList,
					"arrow": "cap",
					"pathStyle": {
						"fill": pathColor
					}
				});

				// add the path
				pathLayer.addPath(path);
			}

		}

		/**
		 * Initialize topology and display within "htmlElementId"
		 * @param htmlElementId
		 */
		function initTopology(htmlElementId){

			var nxApp, nxTopology;

			nxApp = new nx.ui.Application();
			nxApp.container(document.getElementById(htmlElementId));
			nxTopology = self.createTopoObject();
			nxTopology.attach(nxApp);

			return {
				"nxApp": nxApp,
				"nxTopology": nxTopology
			};
		}


		function _getLinksBetweenNodes(topo, src, dest){
			var linkSet = topo.getLinkSet(src.id(), dest.id());
			if (linkSet !== null) {
				return nx.util.values(linkSet.links());
			}
			return false;
		}

		function _nodesToLinks(topo, nodes) {
			var result = [];
			var lastNode;

			nodes.forEach(function (node){
				if (typeof lastNode === 'undefined'){
					lastNode = node;
				}
				else{
					if(node){
						var link = self._getLinksBetweenNodes(topo, lastNode, node);

						if(typeof link === false){
							console.error("ERROR: path must be valid!");
							return false;
						}

						result.push(link[0]);
						lastNode = node;
					}
				}
			});

			return result;
		}

	};

	NextTopologyService.$inject = [];
	app.service("NextTopologyService", NextTopologyService);
})(app);



