(function(app){

	var PathmanAppCtrl = function($scope, $mdSidenav, $mdDialog, NextTopologyService, NetworkService) {


		var host = location.host;
		var protocol = location.protocol;
		odl.Config = new nx.Config({
			socketUrl: 'ws://' + host + ':8080/APP/webs/sock/tc'
		});

		$scope.nxApp = new nx.ui.Application();

		$scope.nxTopology = NextTopologyService.createTopoObject();



		NetworkService.refreshTopology();



		$scope.nxTopology.attach($scope.nxApp);

		$scope.nxApp.container(document.getElementById("topology-container"));

		$scope.sidePanel = true;

	};

	PathmanAppCtrl.$inject = ['$scope', '$mdSidenav', '$mdDialog', 'NextTopologyService', 'NetworkService'];
	app.controller('PathmanAppCtrl', PathmanAppCtrl);

})(app);