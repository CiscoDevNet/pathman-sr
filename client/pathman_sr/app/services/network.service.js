(function(app){

	/*
	NetworkService
	The service does REST API work that has to do with topology/network
	 */

	var NetworkService = function(NextTopologyService, Restangular, HelpersService){

		this.refreshTopology = refreshTopology;

		function refreshTopology(successCbk, errorCbk){

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({"request":[{"option":"topo"}]}).then(
				function(data) {
					if(HelpersService.hasOwnPropertiesPath(data, ["response", "0", "topology"])){
						successCbk(data.response[0].topology);
					}
					else{
						var errData = {
							"errCode": "GET_TOPOLOGY_INVALID",
							"errTitle": "Couldn't read topology data",
							"errMsg": "Topology data is invalid.",
							"errResolution": "Make sure that protocols match.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},
				function(err){

					var errData = {
						"errCode": "GET_TOPOLOGY",
						"errTitle": "Couldn't get topology data",
						"errMsg": "You tried to read topology data from server, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}

	};

	NetworkService.$inject = ["NextTopologyService", "Restangular", "HelpersService"];
	app.service("NetworkService", NetworkService);

})(app);