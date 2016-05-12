(function(app){

	var NextTopologyService = function() {

		this.fadeInAllLayers = fadeInAllLayers;
		this.clearPathLayer = clearPathLayer;
		this.createTopoObject = createTopoObject;


		function fadeInAllLayers(){

		}

		function clearPathLayer(){

		}

		function createTopoObject() {

			return new nx.graphic.Topology({
				adaptive: true,
				scalable: true,
				nodeConfig: {
					label: 'model.name',
					iconType: 'router'
				},
				linkConfig: {
					linkType: 'curve'
				},
				theme: 'blue',
				identityKey: 'name',
				dataProcessor: 'force',
				showIcon: true
			});
		}
	};

	NextTopologyService.$inject = [];
	app.service('NextTopologyService', NextTopologyService);
})(app);



