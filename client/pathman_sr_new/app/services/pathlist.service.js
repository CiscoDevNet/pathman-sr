(function(app){

	var PathListService = function(Restangular, HelpersService){

		this.refreshPathList = refreshPathList;

		function refreshPathList(successCbk, errorCbk){

			var restObj = Restangular.all('pathman_sr');

			restObj.customPOST({"request":[{"option":"list_all"}]}).then(
				function(data) {
					if(HelpersService.hasOwnPropertiesPath(data, ['response', '0', 'list'])){
						successCbk(data.response[0].list);
					}
					else{
						var errData = {
							"errCode": "GET_PATH_LIST_INVALID",
							"errTitle": "Couldn't read path list",
							"errMsg": "Path list is invalid.",
							"errResolution": "Make sure that protocols match.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},
				function(err){

					var errData = {
						"errCode": "GET_PATH_LIST",
						"errTitle": "Couldn't get path list data",
						"errMsg": "You tried to read path list from server, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}

	};

	PathListService.$inject = ['Restangular', 'HelpersService'];
	app.service("PathListService", PathListService);

})(app);