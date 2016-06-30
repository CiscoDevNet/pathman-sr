(function(app){

	var LinkDetailsCtrl = function($scope, NextTopologyService, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;
		$scope.linkData = null;

		//$scope.prefixQuery = {
		//	limit: 10,
		//	page: 1
		//};

		// when link data changes
		$scope.$watch("shared.selectedLinkData", function(linkData){
			$scope.linkData = linkData;
		});

	};

	LinkDetailsCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("LinkDetailsCtrl", LinkDetailsCtrl);

})(app);