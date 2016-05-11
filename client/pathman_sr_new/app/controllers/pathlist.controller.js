app.controller('PathListCtrl',
	function($scope, $mdSidenav, NextTopologyService) {

		$scope.closeSidePanel = function(fadeTopoLayers){

			$scope.sidePanel = null;
			fadeTopoLayers = fadeTotoLayers ? false : true;
			if (fadeTopoLayers) {
				NextTopologyService.fadeInAllLayers($scope.nxTopology);
				NextTopologyService.clearPathLayer($scope.nxTopology);
			}

		};

	});