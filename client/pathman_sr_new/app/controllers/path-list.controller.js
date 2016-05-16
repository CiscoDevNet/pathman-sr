(function(app){

	var PathListCtrl = function($scope, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		/**
		 * Highlight path by nodes' names
		 * @param pathList {Array}
		 */
		function highlightPath(pathList){
			NextTopologyService.highlightPath(pathList);
		}

	};

	PathListCtrl.$inject = ["$scope", "SharedDataService", "SharedDataService"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);