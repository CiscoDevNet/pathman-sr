(function(app){

	var NodeDetailsCtrl = function($scope, NextTopologyService, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;
		$scope.nodeData = null;

		$scope.prefixQuery = {
			limit: 10,
			page: 1
		};

		// when path data changes
		$scope.$watch("shared.selectedNodeData", function(nodeData){
			$scope.nodeData = nodeData;
		});

	};

	NodeDetailsCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("NodeDetailsCtrl", NodeDetailsCtrl);

})(app);