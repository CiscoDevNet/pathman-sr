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
		 * @param hopList {Array}
		 */
		function highlightPath(topo, hopList){console.log(topo, hopList);
			//SharedDataService.data.nxTopology.addPath();
			var pathLayer = topo.getLayer("paths");
			var path = new nx.graphic.Topology.Path({
				'pathWidth': 5,
				'nodeNames': hopList,
				'arrow': 'cap',
				'color': '#ff0000'
			});

			// add the path
			pathLayer.addPath(path);
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
	};

	NextTopologyService.$inject = [];
	app.service("NextTopologyService", NextTopologyService);
})(app);



