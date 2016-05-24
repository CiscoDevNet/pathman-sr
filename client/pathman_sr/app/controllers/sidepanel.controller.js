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

			// todo: do we need it?
			//fadeTopoLayers = fadeTopoLayers ? false : true;
			//if (fadeTopoLayers && SharedDataService.data.topologyInitd) {
			//	NextTopologyService.fadeInAllLayers(SharedDataService.data.nxTopology);
			//	NextTopologyService.clearPathLayer(SharedDataService.data.nxTopology);
			//}

			// if topology ready
			if(SharedDataService.data.topologyInitd){
				window.setTimeout(function(){
					SharedDataService.data.nxTopology.adaptToContainer();
				}, 100);
			}

		}
	};

	SidePanelCtrl.$inject = ["$scope", "$mdSidenav", "NextTopologyService", "SharedDataService"];
	app.controller("SidePanelCtrl", SidePanelCtrl);

})(app);