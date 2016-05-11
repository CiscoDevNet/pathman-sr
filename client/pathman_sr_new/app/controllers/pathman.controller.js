(function(app){

	var PathmanAppCtrl = function($scope, $mdSidenav, $mdDialog, NextTopologyService,
								  NetworkService, PathListService) {


		$scope.sidePanel = false;
		$scope.nxApp = null;
		$scope.nxTopology = null;
		$scope.topologyInitd = false;

		$scope.topologyData = {};
		$scope.pathListPathData = [];

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

			$scope.nxTopology = NextTopologyService.createTopoObject();

			$scope.nxTopology.attach($scope.nxApp);

			$scope.nxApp.container(document.getElementById("topology-container"));

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

		function initPathList(){

			PathListService.refreshPathList(
				function(data){
					$scope.pathListPathData = data;
				},
				function(err){

					// todo: handle errors

				}
			);

		}

		function openPanel(panelName){

			$scope.sidePanel = true;
			$scope.sidePanelName = panelName;

		}

	};

	PathmanAppCtrl.$inject = ['$scope', '$mdSidenav', '$mdDialog', 'NextTopologyService',
		'NetworkService', 'PathListService'];
	app.controller('PathmanAppCtrl', PathmanAppCtrl);

})(app);