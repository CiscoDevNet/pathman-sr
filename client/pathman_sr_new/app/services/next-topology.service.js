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
				data: {},
				nodeConfig: {
					label: 'model.name',
					iconType: 'router'
				},
				linkConfig: {
					linkType: 'curve'
				},
				theme: 'blue',
				identityKey: 'name',
				//layoutType: 'USMap',
				/*layoutConfig: {
				 longitude: 'model.longitude',
				 latitude: 'model.latitude'
				 //                            worldTopoJson: '../../lib/world-50m.json'
				 },*/
				dataProcessor: 'force',
				showIcon: true,
				style: 'background:#F5F5F5'
			});
		}
	};

	NextTopologyService.$inject = [];
	app.service('NextTopologyService', NextTopologyService);
})(app);



