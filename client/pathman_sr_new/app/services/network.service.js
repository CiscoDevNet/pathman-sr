(function(app){

	var NetworkService = function(NextTopologyService, Restangular){

		this.refreshTopology = refreshTopology;




		function refreshTopology(){

			// get topo

		}

	};

	NetworkService.$inject = ['NextTopologyService', 'Restangular'];
	app.service("NetworkService", NetworkService);

})(app);