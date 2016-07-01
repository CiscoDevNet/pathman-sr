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

		$scope.makeArgsForUpdateReq = makeArgsForUpdateReq;

		// enable a watcher for path data changes
		$scope.$watch("shared.selectedPathData", selectedPathDataWatcher);


		/* Implementation */

		/**
		 * Prepares arguments for panel opener (PathmanCtrl -> openPanel) to be passed if a user wants to alter the route
		 * @param pathData {Object}
		 * @returns {Object}
		 */
		function makeArgsForUpdateReq(pathData){

			console.log(pathData);

			var args = {
				"mode": "update",
				"pathDetails": {
					"source": pathData.path[0],
					"destination": pathData.path[pathData.path.length - 1],
					"name": pathData.name
				}
			};

			return args;
		}

		/**
		 * Watcher callback for selected pathData object (draws a path on topology)
		 * @param pathData {Object}
		 */
		function selectedPathDataWatcher(pathData){
			$scope.pathData = pathData;
			if(pathData !== null && typeof pathData === "object"){
				if(pathData.hasOwnProperty("path")){
					NextTopologyService.addPath($scope.shared.nxTopology, pathData.path, "pathListSelected")
				}
			}
		}

	};

	PathDetailsCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("PathDetailsCtrl", PathDetailsCtrl);

})(app);