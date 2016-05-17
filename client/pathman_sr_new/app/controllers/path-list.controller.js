(function(app){

	var PathListCtrl = function($scope, NextTopologyService, SharedDataService) {

		$scope.highlightPath = highlightPath;
		$scope.clearPathLayer = clearPathLayer;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		/**
		 * Highlight path by nodes' names
		 * @param topo {Object} NeXt topology object
		 * @param pathList {Array}
		 * @param pathType
		 */
		function highlightPath(topo, pathList, pathType){
			NextTopologyService.addPath(topo, pathList, pathType);
		}

		/**
		 * Clear path layer
		 * @param topo
		 */
		function clearPathLayer(topo){
			NextTopologyService.clearPathLayer(topo);
		}

	};

	PathListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);