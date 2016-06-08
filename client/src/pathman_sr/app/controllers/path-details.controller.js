(function(app){

	var PathDetailsCtrl = function($scope, NextTopologyService, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;
		$scope.pathData = null;

		$scope.selected = [];

		$scope.pathDetailsQuery = {
			limit: 10,
			page: 1
		};

		// when path data changes
		$scope.$watch("shared.selectedPathData", function(pathData){
			$scope.pathData = pathData;
			if(pathData !== null && typeof pathData === "object"){
				if(pathData.hasOwnProperty("path")){
					NextTopologyService.addPath($scope.shared.nxTopology, pathData.path, "pathListSelected")
				}
			}
		});

	};

	PathDetailsCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("PathDetailsCtrl", PathDetailsCtrl);

})(app);