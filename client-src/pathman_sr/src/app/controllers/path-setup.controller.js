(function(app){

	var PathSetupCtrl = function($scope, PathListService, NextTopologyService, SharedDataService, ErrorHandlerService, HelpersService) {

		$scope.isAutoPathFormInvalid = isAutoPathFormInvalid;
		$scope.computePaths = computePaths;
		$scope.highlightPath = highlightPath;
		$scope.clearPathLayer = clearPathLayer;
		$scope.registerPath = registerPath;
		$scope.backToSetup = backToSetup;
		$scope.removePathByType = removePathByType;
		$scope.deployPath = deployPath;
		$scope.refreshPathList = refreshPathList;
		$scope.onTabSelected = onTabSelected;
		$scope.clearCurrentPath = clearCurrentPath;
		$scope.getNodeNamesOnly = getNodeNamesOnly;
		$scope.countTotalByMetrics = countTotalByMetrics;

		$scope.HelpersService = HelpersService;
		$scope.validCostMetrics = ['igp', 'hops', 'te'];
		$scope.autoPathFormLoadingStatus = false;
		$scope.computedPaths = [];
		$scope.computedMetrics = [];
		$scope.manualPath = [];
		$scope.manualPathMetrics = [];
		$scope.manualPathMetricsTotal = {};

		$scope.nodeFilter = {
			"pcepEnabled": {
				"pcep_enabled": true
			},
			"srEnabled": {
				"sr_enabled": "true"
			}
		};

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		SharedDataService.data.autoPathSetupMode = "search";

		// Manual path setup
		$scope.$on("topo-select-node-manual", onManualPathSetup);
		$scope.$on("openPanel", onOpenPanel);

		/* Implementation */

		function onManualPathSetup(event, data){

			var node = data.nodeData,
				foundIndex, neighbors, errObj, lastIndex,
				prevHop, currentLink, currentLinkModel,
				metricName, metricType;

			foundIndex = ($scope.manualPath.findIndex(findRouterByName, {"node": node}));

			// remove subpath if the node exists
			if(foundIndex !== -1){

				lastIndex = $scope.manualPath.length - 1;

				// if it was source
				if(foundIndex == 0){
					$scope.manualPath = [];
					$scope.manualPathMetrics = [];

					for ( metricName in $scope.manualPathMetricsTotal) {
						if( $scope.manualPathMetricsTotal.hasOwnProperty( metricName ) ) {
							$scope.manualPathMetricsTotal[metricName] = 0;
						}
					}

				}
				// if it's the last point (current destination)
				else if(foundIndex == lastIndex){

					for ( metricName in $scope.manualPathMetricsTotal) {
						if( $scope.manualPathMetricsTotal.hasOwnProperty( metricName ) ) {

							metricType = $scope.manualPathMetrics[lastIndex - 1].type;

							$scope.manualPathMetricsTotal[metricName] =
								$scope.manualPathMetricsTotal[metricName] - $scope.manualPathMetrics[lastIndex - 1].metric[metricName][metricType];

						}
					}

					$scope.manualPath.splice(lastIndex, 1);
					$scope.manualPathMetrics.splice(lastIndex - 1);
				}

				// intermediate
				else{
					$scope.manualPath.splice(foundIndex + 1);
					$scope.manualPathMetrics.splice(foundIndex);

					for ( metricName in $scope.manualPathMetricsTotal) {
						if( $scope.manualPathMetricsTotal.hasOwnProperty( metricName ) ) {
							$scope.manualPathMetricsTotal[metricName] = 0;
						}
					}

					$scope.manualPathMetrics.forEach(function(metric){

						for ( metricName in metric.metric) {
							if( metric.metric.hasOwnProperty( metricName ) ) {

								metricType = metric.type;

								$scope.manualPathMetricsTotal[metricName] =
									$scope.manualPathMetricsTotal[metricName] + metric.metric[metricName][metricType];

							}
						}

					});

				}

			}
			// otherwise (if node is new to the path)...
			else{
				// if the current node is a neighbor of the last added node (which must exist)
				if($scope.manualPath.length > 0){
					neighbors = NextTopologyService.findNeighborsByNodeName(
						SharedDataService.data.nxTopology,
						$scope.manualPath[$scope.manualPath.length - 1].name
					);
					if(neighbors.indexOf(node.name) !== -1){
						// add if only node is SR enabled
						if(node.sr_enabled){

							prevHop = $scope.manualPath[$scope.manualPath.length - 1];

							currentLink = NextTopologyService.getLinkBetweenNodesByNames(
								SharedDataService.data.nxTopology,
								prevHop.name,
								node.name
							);

							if(currentLink){

								currentLinkModel = currentLink.model().getData();

								if(currentLinkModel.source == prevHop.name){

									metricType = "tx";

									$scope.manualPathMetrics.push({
										metric: angular.copy(currentLinkModel.metric),
										type: metricType
									});



								}
								else{

									metricType = "rx";

									$scope.manualPathMetrics.push({
										metric: angular.copy(currentLinkModel.metric),
										type: metricType
									});
								}

								// add up to total
								for ( metricName in currentLinkModel.metric) {
									if( currentLinkModel.metric.hasOwnProperty( metricName ) ) {

										if(!$scope.manualPathMetricsTotal.hasOwnProperty(metricName))
											$scope.manualPathMetricsTotal[metricName] = 0;

										$scope.manualPathMetricsTotal[metricName] =
											$scope.manualPathMetricsTotal[metricName] + currentLinkModel.metric[metricName][metricType];

									}
								}

								$scope.manualPath.push(node);

							}
						}
						else{
							errObj = {
								"errCode": "SR_ENABLED_ONLY",
								"errTitle": "Only SR-capable routers can perform this operation.",
								"errMsg": "SR-disabled routers cannot be destinations or intermediate points.",
								"errResolution": "Try it with the SR-capable one.",
								"errObj": node
							};
							ErrorHandlerService.log(errObj, {"type": "toast", "allowToLogInConsole": false});
						}
					}
					else{
						errObj = {
							"errCode": "NEIGHBORS_ONLY",
							"errTitle": "Only neighborhood routers can be added to the path.",
							"errMsg": "You can only add routers to the path, which are \"visible\" (neighbors of) the last added.",
							"errResolution": "Choose a router from the last hop's neighborhood.",
							"errObj": node
						};
						ErrorHandlerService.log(errObj, {"type": "toast", "allowToLogInConsole": false});
					}
				}
				// if the array is empty, add the node
				else{
					// add if only node is PCEP enabled
					if(node.pcep_enabled){
						$scope.manualPath.push(node);
					}
					else{
						errObj = {
							"errCode": "PCEP_ENABLED_ONLY",
							"errTitle": "Only PCEP-capable routers can perform this operation.",
							"errMsg": "PCEP-disabled routers cannot be sources for outgoing traffic.",
							"errResolution": "Try it with the PCEP-capable one.",
							"errObj": node
						};
						ErrorHandlerService.log(errObj, {"type": "toast", "allowToLogInConsole": false});
					}
				}

			}

			// draw the path on topology
			$scope.highlightPath(
				SharedDataService.data.nxTopology,
				$scope.getNodeNamesOnly($scope.manualPath),
				"pathListSelected"
			);

			// if router with the passed name exists
			function findRouterByName(nodeObj){
				return nodeObj.name === this.node.name;
			}

		}

		function onOpenPanel(event, data){
			if(data.panelName == "path-setup"){
				if(SharedDataService.data.pathSetupMode == "manual"){
					// draw the path on topology
					$scope.highlightPath(
						SharedDataService.data.nxTopology,
						$scope.getNodeNamesOnly($scope.manualPath),
						"pathListSelected"
					);
				}

				// when a user is updating the path
				if(SharedDataService.data.pathSetupUpdateData.mode == "update"){

					$scope.psForm = {
						"source": SharedDataService.data.pathSetupUpdateData.pathDetails.source,
						"destination": SharedDataService.data.pathSetupUpdateData.pathDetails.destination
					};

					// reset settings
					SharedDataService.data.autoPathSetupMode = "search";

					$scope.computedPaths = [];
					$scope.computedMetrics = [];
					$scope.manualPath = [];
					$scope.manualPathMetrics = [];

				}

			}
		}

		/**
		 * Test form elements if input is invalid
		 * @returns {boolean} True if invalid, false if valid
		 */
		function isAutoPathFormInvalid(){

			if(!$scope.hasOwnProperty("psForm")){
				return true;
			}
			else if(!$scope.hasOwnProperty("autoPathForm")){
				return true;
			}
			else{

				// if form invalid
				if($scope.autoPathForm.$invalid){
					return true;
				}

				// if source == dest
				if($scope.psForm.hasOwnProperty('source') && $scope.psForm.hasOwnProperty('destination')){
					if($scope.psForm.source == $scope.psForm.destination){
						return true;
					}
				}
				else{
					return true;
				}

				// if cost metrics are not chosen
				if($scope.validCostMetrics.indexOf($scope.psForm.costMetric) === -1){
					return true;
				}
			}

			return false;

		}


		/**
		 * Based on input, compute paths
		 */
		function computePaths(){

			// view settings
			$scope.autoPathFormLoadingStatus = true;
			$scope.computedPaths = [];
			$scope.computedMetrics = [];

			// clear path layer when recomputing paths for selected source/destination
			NextTopologyService.clearPathLayer(SharedDataService.data.nxTopology);

			// form is invalid
			if($scope.isAutoPathFormInvalid()){
				$scope.autoPathFormLoadingStatus = false;
			}

			// form is valid
			else{
				PathListService.computePathListByConfig(

					// config
					{
						source: $scope.psForm.source,
						destination: $scope.psForm.destination,
						costMetric: $scope.psForm.costMetric
					},

					// success
					function(data){
						$scope.autoPathFormLoadingStatus = false;

						// assign computed values
						$scope.computedPaths = data.path;
						$scope.computedMetrics = data.metric;

					},

					// error
					function(err){
						$scope.autoPathFormLoadingStatus = false;

						ErrorHandlerService.log(err, true);

					}
				);
			}
		}

		/**
		 * Highlight path by nodes' names
		 * @param topo {Object} NeXt topology object
		 * @param nodeList {Array}
		 * @param pathType
		 */
		function highlightPath(topo, nodeList, pathType){
			NextTopologyService.clearPathLayer(topo);
			if(Array.isArray(nodeList)){
				if(nodeList.length > 1){
					NextTopologyService.addPath(topo, nodeList, pathType);
				}
			}
		}

		/**
		 * Clear path layer
		 * @param topo
		 */
		function clearPathLayer(topo){
			NextTopologyService.clearPathLayer(topo);
		}


		// Go to step 2: select a name and deploy path
		function registerPath(topo, pathSet, mode){

			SharedDataService.data.autoPathSetupMode = "register-path";
			SharedDataService.data.pathDeploymentResult = "inprogress";

			NextTopologyService.addPath(topo, pathSet, "pathListSelected");

			$scope.pathSet = pathSet;

			switch(SharedDataService.data.pathSetupUpdateData.mode){
				case "default":
					$scope.prForm = {
						"pathName": pathSet[0] + " -> " + pathSet[pathSet.length - 1]
					};
					break;
				case "update":
					$scope.prForm = {
						"pathName": SharedDataService.data.pathSetupUpdateData.pathDetails.name
					};
					break;
			}

		}

		/**
		 * Go back to selection of computed paths
		 * @param topo
		 */
		function backToSetup(topo){
			SharedDataService.data.autoPathSetupMode = "search";
			NextTopologyService.clearPathLayer(topo);
		}

		/**
		 * Delete the path from memory and topology
		 * @param topo
		 * @param type
		 */
		function removePathByType(topo, type){
			NextTopologyService.removePathByType(topo, type);
		}

		/**
		 * Submit the path to controller
		 * @param topo
		 */
		function deployPath(topo){

			// configure path data for deployment
			var pathConfig = {
				"name": $scope.prForm.pathName,
				"path": $scope.pathSet
			};

			// remove path for topology
			NextTopologyService.removePathByType(topo, "pathListSelected");

			if(SharedDataService.data.pathSetupUpdateData.mode == "update"){
				// make REST call to change route of path's intermediate routers
				PathListService.updatePath(pathConfig, deployPathSuccessCbk, deployPathErrorCbk);
			}
			else{
				// make REST call to deploy path on controller
				PathListService.deployPath(pathConfig, deployPathSuccessCbk, deployPathErrorCbk);
			}

			// success: path deployed
			function deployPathSuccessCbk(data){
				NextTopologyService.addPath(topo, $scope.pathSet, "deployed");
				SharedDataService.data.pathDeploymentResult = "success";

				$scope.refreshPathList();
			}

			// error: path refused
			function deployPathErrorCbk(err){
				NextTopologyService.addPath(topo, $scope.pathSet, "deploymentFailed");
				SharedDataService.data.pathDeploymentResult = "error";

				$scope.refreshPathList();

				ErrorHandlerService.log(err, true);
			}
		}

		/**
		 * Wrapper for refreshPathList method in PathListService
		 */
		function refreshPathList(){
			PathListService.refreshPathList(
				function(data){
					// record path list data
					SharedDataService.data.pathListData = data;
					// path list initialized = true
					SharedDataService.data.pathListInitd = true;
				},
				function(err){

					ErrorHandlerService.log(err, true);

				}
			);
		}


		/**
		 * Fired when a tab is selected
		 * @param mode {String} Name of the tab/mode. May be "auto" or "manual"
		 */
		function onTabSelected(mode){

			var allowedModes = ["auto", "manual"];

			SharedDataService.data.pathSetupMode = SharedDataService.data.pathSetupSelectedTab
				= (allowedModes.indexOf(mode) >= 0) ? mode : null;


			if(SharedDataService.data.pathSetupMode == "manual" && $scope.manualPath.length > 0){
				// draw the path on topology
				$scope.highlightPath(
					SharedDataService.data.nxTopology,
					$scope.getNodeNamesOnly($scope.manualPath),
					"pathListSelected"
				);
			}

		}


		/**
		 * Clears the path layer and all path info
		 * @param topo
		 */
		function clearCurrentPath(topo){

			$scope.manualPath = [];
			$scope.manualPathMetrics = [];
			$scope.manualPathMetricsTotal = {};
			NextTopologyService.clearPathLayer(topo);

		}

		/**
		 * Get array of names out
		 * @param manualPath {Array}
		 * @returns {Array}
		 */
		function getNodeNamesOnly(manualPath){

			var namesOnly = manualPath.map(function(node){
				return node.name;
			});

			return namesOnly;
		}

		function countTotalByMetrics(){

		}

	};

	PathSetupCtrl.$inject = ["$scope", "PathListService", "NextTopologyService", "SharedDataService", "ErrorHandlerService", "HelpersService"];
	app.controller("PathSetupCtrl", PathSetupCtrl);

})(app);