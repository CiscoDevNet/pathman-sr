(function (app) {

	/*
	PathListService
	 The service does REST API work that has to do with paths and path lists
	 */

	var PathListService = function (Restangular, HelpersService) {

		this.refreshPathList = refreshPathList;
		this.computePathListByConfig = computePathListByConfig;
		this.deployPath = deployPath;
		this.updatePath = updatePath;
		this.removePath = removePath;

		/**
		 * Refresh list of paths
		 * @param successCbk {Function} Success callback
		 * @param errorCbk {Function} Error callback
		 */
		function refreshPathList (successCbk, errorCbk) {

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({
				"request": [
					{
						"option": "list_all"
					}
				]}).then(
				// success
				function (data) {
					if (HelpersService.hasOwnPropertiesPath(data, ["response", "0", "list"])) {
						successCbk(data.response[0].list);
					}
					else {
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

				// error
				function (err) {
					console.log(err);
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

		/**
		 * Compute path list for configured direction and metric
		 * @param config {Object} Configuration: source, destination, costMetric
		 * @param successCbk {Function} Success callback
		 * @param errorCbk {Function} Error callback
		 */
		function computePathListByConfig (config, successCbk, errorCbk) {

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({
				"request": [
					{
						"option": "path",
						"src": config.source,
						"dst": config.destination,
						"metric": config.costMetric || "igp"
					}
				]
			}).then(

				// success
				function (data) {
					if (HelpersService.hasOwnPropertiesPath(data, ["response", "0", "path"]) &&
						HelpersService.hasOwnPropertiesPath(data, ["response", "0", "metric"])) {
						successCbk(data.response[0]);
					}
					else {
						var errData = {
							"errCode": "COMPUTE_PATH_LIST_INVALID",
							"errTitle": "Couldn't read path list",
							"errMsg": "Path list is invalid.",
							"errResolution": "Make sure that protocols match.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},

				// error
				function (err) {
					var errData = {
						"errCode": "COMPUTE_PATH_LIST",
						"errTitle": "Couldn't compute path list",
						"errMsg": "You tried to compute and read path list from server, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}

		/**
		 * Deploy path
		 * @param config {Object} Configuration: "path" is list of hops, "name" is the name of path
		 * @param successCbk {Function} Success callback
		 * @param errorCbk {Function} Error callback
		 */
		function deployPath(config, successCbk, errorCbk){

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({
				"request": [
					{
						"option": "create",
						"name": config.name,
						"path": config.path
					}
				]
			}).then(

				// success
				function (data) {
					var errData;
					if (HelpersService.hasOwnPropertiesPath(data, ["response", "0", "success"])) {
						if(data.response[0].success == true){
							successCbk(data.response[0]);
						}
						else{
							errData = {
								"errCode": "DEPLOY_PATH_UNSUCCESSFUL",
								"errTitle": "Couldn't deploy path",
								"errMsg": "Response indicated the error in frontend-backend communication.",
								"errResolution": "Review detailed response.",
								"errObj": data
							};
							errorCbk(errData);
						}

					}
					else {
						errData = {
							"errCode": "DEPLOY_PATH_INVALID",
							"errTitle": "Couldn't deploy path",
							"errMsg": "Response was invalid when was trying to deploy path. Path is likely to not be deployed.",
							"errResolution": "Make sure that protocols match.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},

				// error
				function (err) {
					var errData = {
						"errCode": "DEPLOY_PATH",
						"errTitle": "Couldn't deploy path",
						"errMsg": "You tried to deploy path, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}


		/**
		 * Update path
		 * @param config {Object} Configuration: "path" is list of hops, "name" is the name of path
		 * @param successCbk {Function} Success callback
		 * @param errorCbk {Function} Error callback
		 */
		function updatePath(config, successCbk, errorCbk){

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({
				"request": [
					{
						"option": "update",
						"name": config.name,
						"path": config.path
					}
				]
			}).then(

				// success
				function (data) {console.log(data);
					if (HelpersService.hasOwnPropertiesPath(data, ["response", "0", "success"])) {
						successCbk(data.response[0]);
					}
					else{
						errData = {
							"errCode": "UPDATE_PATH_UNSUCCESSFUL",
							"errTitle": "Couldn't update path",
							"errMsg": "Response indicated the error in frontend-backend communication.",
							"errResolution": "Review detailed response.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},

				// error
				function (err) {console.log(err);
					var errData = {
						"errCode": "UPDATE_PATH",
						"errTitle": "Couldn't update path",
						"errMsg": "You tried to update path, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}


		/**
		 * Remove path
		 * @param config {Object} Configuration: "node" is , "name" is the name of path
		 * @param successCbk {Function} Success callback
		 * @param errorCbk {Function} Error callback
		 */
		function removePath(config, successCbk, errorCbk){

			var restObj = Restangular.all("pathman_sr");

			restObj.customPOST({
				"request": [
					{
						"option": "delete",
						"name": config.name,
						"node": config.node
					}
				]
			}).then(

				// success
				function (data) {console.log(data);
					if (HelpersService.hasOwnPropertiesPath(data, ["response", "0"])) {
						successCbk(data.response[0]);
					}
					else {
						var errData = {
							"errCode": "REMOVE_PATH_INVALID",
							"errTitle": "Couldn't remove path",
							"errMsg": "Response was invalid when was trying to remove path. Path is likely to not be removed.",
							"errResolution": "Make sure that protocols match.",
							"errObj": data
						};
						errorCbk(errData);
					}
				},

				// error
				function (err) {console.log(data);
					var errData = {
						"errCode": "REMOVE_PATH",
						"errTitle": "Couldn't remove path",
						"errMsg": "You tried to remove path, but for some reason it is being complicated at this point.",
						"errResolution": "Check your connection, otherwise make sure if controller is up.",
						"errObj": err
					};

					errorCbk(errData);

				}
			);

		}

	};

	PathListService.$inject = ["Restangular", "HelpersService"];
	app.service("PathListService", PathListService);

})(app);