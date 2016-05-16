(function(app){

	var SharedDataService = function(){

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