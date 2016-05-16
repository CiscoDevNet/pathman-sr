(function(app){

	var PathListCtrl = function($scope, NextTopologyService, SharedDataService) {

		$scope.highlightPath = highlightPath;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		/**
		 * Highlight path by nodes' names
		 * @param topo {Object} NeXt topology object
		 * @param pathList {Array}
		 */
		function highlightPath(topo, pathList){
			NextTopologyService.highlightPath(topo, pathList);
		}

	};

	PathListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);