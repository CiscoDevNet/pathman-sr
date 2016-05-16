(function(app){

	var PathmanAppCtrl = function($scope, $mdSidenav, $mdDialog, NextTopologyService,
								  NetworkService, PathListService, SharedDataService) {



		// method prototypes

		$scope.init = init;
		$scope.initTopology = initTopology;
		$scope.initPathList = initPathList;
		$scope.openPanel = openPanel;

		// "scopify" shared data
		$scope.shared = SharedDataService.data;

		// initialize the app
		$scope.init();

		/* Implementation */

		function init(){
			$scope.initTopology();
			$scope.initPathList();
		}

		function initTopology(){
			SharedDataService.data.nxApp = new nx.ui.Application();
			SharedDataService.data.nxApp.container(document.getElementById("topology-container"));
			SharedDataService.data.nxTopology = NextTopologyService.createTopoObject();
			SharedDataService.data.nxTopology.attach(SharedDataService.data.nxApp);

			NetworkService.refreshTopology(
				function(data){
					// record the topology data
					SharedDataService.data.topologyData = data;
					// render topology
					SharedDataService.data.nxTopology.data(SharedDataService.data.topologyData);
					// topology initialized = true
					SharedDataService.data.topologyInitd = true;
				},
				function(err){
					//todo: handle errors
				}
			);
		}

		/**
		 * Initialize path list by making REST call
		 */
		function initPathList(){

			PathListService.refreshPathList(
				function(data){
					// record path list data
					SharedDataService.data.pathListData = data;
					// path list initialized = true
					SharedDataService.data.pathListInitd = true;
				},
				function(err){
					// todo: handle errors
				}
			);
		}

		/**
		 * Open side panel by name
		 * @param panelName {String}
		 */
		function openPanel(panelName){

			SharedDataService.data.sidePanel = true;
			SharedDataService.data.sidePanelName = panelName;

		}

	};

	PathmanAppCtrl.$inject = ["$scope", "$mdSidenav", "$mdDialog", "NextTopologyService",
		"NetworkService", "PathListService", "SharedDataService"];
	app.controller("PathmanAppCtrl", PathmanAppCtrl);

})(app);