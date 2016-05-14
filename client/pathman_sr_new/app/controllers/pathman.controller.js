(function(app){

	var PathmanAppCtrl = function($scope, $mdSidenav, $mdDialog, NextTopologyService,
								  NetworkService, PathListService, SharedDataService) {


		$scope.sidePanel = false;
		$scope.nxApp = null;
		$scope.nxTopology = null;
		$scope.topologyInitd = false;
		$scope.pathListInitd = false;

		$scope.topologyData = {};
		$scope.pathListData = [];

		$scope.init = init;
		$scope.initTopology = initTopology;
		$scope.initPathList = initPathList;
		$scope.openPanel = openPanel;

		$scope.init();

		/* Implementation */

		function init(){
			$scope.initTopology();
			$scope.initPathList();
		}


		function initTopology(){
			$scope.nxApp = new nx.ui.Application();
			$scope.nxApp.container(document.getElementById("topology-container"));
			$scope.nxTopology = NextTopologyService.createTopoObject();
			$scope.nxTopology.attach($scope.nxApp);

			NetworkService.refreshTopology(
				function(data){
					$scope.topologyData = data;
					$scope.nxTopology.data($scope.topologyData);
					$scope.topologyInitd = true;
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
					$scope.pathListPathData = data;
					$scope.pathListInitd = true;
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

			$scope.sidePanel = true;
			$scope.sidePanelName = panelName;

		}

	};

	PathmanAppCtrl.$inject = ['$scope', '$mdSidenav', '$mdDialog', 'NextTopologyService',
		'NetworkService', 'PathListService'];
	app.controller('PathmanAppCtrl', PathmanAppCtrl);

})(app);