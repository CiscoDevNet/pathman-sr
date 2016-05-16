(function(app){

	/*
	 NextTopologyService
	 The service encapsulates NeXt-specific logic. It does not perform any REST API calls.
	 */

	var NextTopologyService = function(SharedDataService) {

		var self = this;

		this.fadeInAllLayers = fadeInAllLayers;
		this.clearPathLayer = clearPathLayer;
		this.createTopoObject = createTopoObject;
		this.highlightPath = highlightPath;
		this.initTopology = initTopology;

		function fadeInAllLayers(){

		}

		function clearPathLayer(){

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
		 * @param pathList {Array}
		 */
		function highlightPath(pathList){

		}

		/**
		 * Initialize topology and display within "htmlElementId"
		 * @param htmlElementId
		 */
		function initTopology(htmlElementId){

			SharedDataService.data.nxApp = new nx.ui.Application();
			SharedDataService.data.nxApp.container(document.getElementById(htmlElementId));
			SharedDataService.data.nxTopology = self.createTopoObject();
			SharedDataService.data.nxTopology.attach(SharedDataService.data.nxApp);

		}
	};

	NextTopologyService.$inject = ["SharedDataService"];
	app.service("NextTopologyService", NextTopologyService);
})(app);



