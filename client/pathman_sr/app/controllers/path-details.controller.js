(function(app){

	var PathDetailsCtrl = function($scope, NextTopologyService, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;
		$scope.pathData = null;


		// when path data changes
		$scope.$watch("shared.selectedPathData", function(pathData){
			$scope.pathData = pathData;
			console.log(pathData);
		});

	};

	PathDetailsCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("PathDetailsCtrl", PathDetailsCtrl);

})(app);