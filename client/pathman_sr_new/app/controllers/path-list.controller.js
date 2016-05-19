(function(app){

	var PathListCtrl = function($scope, NextTopologyService, SharedDataService, PathListService, $mdDialog) {

		$scope.highlightPath = highlightPath;
		$scope.clearPathLayer = clearPathLayer;
		$scope.removePathConfirmDialog = removePathConfirmDialog;

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
		 * @param topo {Object} NeXt topology object
		 */
		function clearPathLayer(topo){
			NextTopologyService.clearPathLayer(topo);
		}

		/**
		 *
		 * @param $event event object
		 * @param topo
		 * @param pathName
		 * @param path
		 */
		function removePathConfirmDialog($event, topo, pathName, path){

			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm()
				.title("Would you like to delete the path?")
				.textContent("You are going to delete the path with ID: " + pathName + ". Are you sure?")
				.ariaLabel("Would you like to delete the path " + pathName)
				.targetEvent($event)
				.ok("Yes, delete it")
				.cancel("No, I changed my mind");
			$mdDialog.show(confirm).then(function() {

				var removePathConfig = {
					"name": pathName,
					"node": path[0]
				};

				SharedDataService.data.pathListInitd = false;
				PathListService.removePath(removePathConfig, removePathSuccessCbk, removePathErrorCbk);

				function removePathSuccessCbk(data){



					PathListService.refreshPathList(
						function(data){
							// record path list data
							SharedDataService.data.pathListData = data;
							// path list initialized = true
							SharedDataService.data.pathListInitd = true;
						},
						function(err){
							// todo: handle errors
							console.error(err);
						}
					);




					SharedDataService.data.pathListData = data;
					SharedDataService.data.pathListInitd = true;
				}

				function removePathErrorCbk(err){
					//SharedDataService.data.pathListInitd = true;
					// todo: handle errors
					console.error(err);
				}


			}, function() {});

		}

	};

	PathListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService", "PathListService", "$mdDialog"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);