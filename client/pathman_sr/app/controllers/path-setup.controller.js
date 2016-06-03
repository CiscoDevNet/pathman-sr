(function(app){

	var PathSetupCtrl = function($scope, PathListService, NextTopologyService, SharedDataService, ErrorHandlerService) {

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

		$scope.validCostMetrics = ['igp', 'hops'];
		$scope.autoPathFormLoadingStatus = false;
		$scope.computedPaths = [];
		$scope.computedMetrics = [];
		$scope.manualPath = [];

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
		$scope.$on("topo-select-node-manual", function(event, data){

			var node = data.nodeData,
				foundIndex, neighbors, errObj;

			foundIndex = ($scope.manualPath.findIndex(findRouterByName, {"node": node}));

			// remove subpath if the node exists
			if(foundIndex !== -1){
				$scope.manualPath.splice(foundIndex);
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
							$scope.manualPath.push(node);
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
				getNodeNamesOnly($scope.manualPath),
				"pathListSelected"
			);

			// if router with the passed name exists
			function findRouterByName(nodeObj){
				return nodeObj.name === this.node.name;
			}

			function getNodeNamesOnly(manualPath){

				var namesOnly = manualPath.map(function(node){
					return node.name;
				});

				return namesOnly;

			}

		});


		/* Implementation */

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
		function registerPath(topo, pathSet){
			SharedDataService.data.autoPathSetupMode = "register-path";
			SharedDataService.data.pathDeploymentResult = "inprogress";

			NextTopologyService.addPath(topo, pathSet, "pathListSelected");

			$scope.pathSet = pathSet;
			$scope.prForm = {
				"pathName": pathSet[0] + " -> " + pathSet[pathSet.length - 1]
			};

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

			// todo: blinking???
			// remove path for topology
			NextTopologyService.removePathByType(topo, "pathListSelected");

			// make REST call to deploy path on controller
			PathListService.deployPath(pathConfig, deployPathSuccessCbk, deployPathErrorCbk);

			// success: path deployed
			function deployPathSuccessCbk(data){
				NextTopologyService.addPath(topo, $scope.pathSet, "deployed");
				SharedDataService.data.pathDeploymentResult = "success";

				$scope.refreshPathList();

				// todo: something else?
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

		}

	};

	PathSetupCtrl.$inject = ["$scope", "PathListService", "NextTopologyService", "SharedDataService", "ErrorHandlerService"];
	app.controller("PathSetupCtrl", PathSetupCtrl);

})(app);