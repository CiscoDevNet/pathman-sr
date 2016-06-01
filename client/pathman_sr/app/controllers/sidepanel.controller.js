(function(app){

	var SidePanelCtrl = function($scope, $mdSidenav, NextTopologyService, SharedDataService) {

		$scope.closeSidePanel = closeSidePanel;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		function closeSidePanel(fadeTopoLayers){

			// erase temporary data
			SharedDataService.data.sidePanel = false;
			SharedDataService.data.sidePanelName = null;
			SharedDataService.data.selectedPathData = null;
			SharedDataService.data.pathSetupMode = null;

			// if topology ready
			if(SharedDataService.data.topologyInitd){

				NextTopologyService.clearPathLayer(SharedDataService.data.nxTopology);

				window.setTimeout(function(){
					SharedDataService.data.nxTopology.adaptToContainer();
				}, 100);
			}

		}
	};

	SidePanelCtrl.$inject = ["$scope", "$mdSidenav", "NextTopologyService", "SharedDataService"];
	app.controller("SidePanelCtrl", SidePanelCtrl);

})(app);