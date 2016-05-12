(function(app){

	var SidePanelCtrl = function($scope, $mdSidenav, NextTopologyService) {

		$scope.closeSidePanel = function(fadeTopoLayers){

			$scope.sidePanel = false;
			$scope.sidePanelName = null;

			fadeTopoLayers = fadeTopoLayers ? false : true;
			if (fadeTopoLayers && $scope.topologyInitd) {
				NextTopologyService.fadeInAllLayers($scope.nxTopology);
				NextTopologyService.clearPathLayer($scope.nxTopology);
			}
		};
	};

	app.controller('SidePanelCtrl', SidePanelCtrl);

})(app);