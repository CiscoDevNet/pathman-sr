(function(app){

	/*
	SharedDataService
	The service provides controllers and services access communicate with each other avoiding $scope routine
	 */

	var SharedDataService = function(){

		// shared data
		this.data = {
			topologyData: null,
			pathListData: null,

			// boolean markers
			topologyInitd: false,
			pathListInitd: false,

			// side panel details
			sidePanel: false,
			sidePanelName: null,

			// NeXt library data
			nxApp: null,
			nxTopology: null
		};

	};

	SharedDataService.$inject = [];
	app.service("SharedDataService", SharedDataService);

})(app);