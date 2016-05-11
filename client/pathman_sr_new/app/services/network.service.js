(function(app){

	var NetworkService = function(NextTopologyService, Restangular){

		this.refreshTopology = refreshTopology;

		function refreshTopology(successCbk, errorCbk){

			var restObj = Restangular.all('pathman_sr');

			restObj.post({
				"request": {
					"option": "topo"
				}
			}).then(
				function(data) {
					console.log(data);
				},
				function(err){
					console.log(err);
				}
			);

		}

	};

	NetworkService.$inject = ['NextTopologyService', 'Restangular'];
	app.service("NetworkService", NetworkService);

})(app);