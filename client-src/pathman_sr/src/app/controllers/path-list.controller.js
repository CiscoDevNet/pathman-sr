(function(app){

	var PathListCtrl = function($scope, NextTopologyService, SharedDataService, PathListService, $mdDialog) {

		$scope.highlightPath = highlightPath;
		$scope.clearPathLayer = clearPathLayer;
		$scope.removePathConfirmDialog = removePathConfirmDialog;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		$scope.pathSearchQuery = "";
		// search field "catcher"
		var wrap = $("#node-list-area");
		var scrollProcessFn = function(e) {
			if (this.scrollTop > 0) {
				wrap.addClass("fix-search");
			} else {
				wrap.removeClass("fix-search");
			}

		};
		wrap.on("scroll", scrollProcessFn);

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
						function(pathListData){
							// record path list data
							SharedDataService.data.pathListData = pathListData;
							// path list initialized = true
							SharedDataService.data.pathListInitd = true;
						},
						function(err){

							ErrorHandlerService.log(err, true);

						}
					);
				}

				function removePathErrorCbk(err){

					ErrorHandlerService.log(err, true);

				}


			}, function() {});

		}

	};

	PathListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService", "PathListService", "$mdDialog"];
	app.controller("PathListCtrl", PathListCtrl);

})(app);