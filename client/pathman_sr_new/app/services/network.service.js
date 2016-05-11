(function(app){

	var NetworkService = function(NextTopologyService, Restangular){

		this.refreshTopology = refreshTopology;


		function refreshTopology(){



		}

	};

	NetworkService.$inject = ['NextTopologyService'];
	app.service("NetworkService", NetworkService);

})(app);