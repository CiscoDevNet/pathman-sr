(function(app){

	var SidePanelCtrl = function($scope, $mdSidenav, NextTopologyService, SharedDataService) {

		$scope.closeSidePanel = function(fadeTopoLayers){

			SharedDataService.data.sidePanel = false;
			SharedDataService.data.sidePanelName = null;

			fadeTopoLayers = fadeTopoLayers ? false : true;
			if (fadeTopoLayers && SharedDataService.data.topologyInitd) {
				NextTopologyService.fadeInAllLayers(SharedDataService.data.nxTopology);
				NextTopologyService.clearPathLayer(SharedDataService.data.nxTopology);
			}
		};
	};

	SidePanelCtrl.$inject = ['$scope', '$mdSidenav', 'NextTopologyService', 'SharedDataService'];
	app.controller('SidePanelCtrl', SidePanelCtrl);

})(app);