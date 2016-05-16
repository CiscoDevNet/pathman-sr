(function(app){

	var PathListCtrl = function($scope, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		$scope.pathListData = SharedDataService.data.pathListData;

	};

	PathListCtrl.$inject = ["$scope", "SharedDataService", "SharedDataService"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);