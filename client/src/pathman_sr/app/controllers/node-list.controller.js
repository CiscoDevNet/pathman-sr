(function(app){

	var NodeListCtrl = function($scope, NextTopologyService, SharedDataService) {

		$scope.nodeSearchQuery = "";
		// search field "catcher"
		var wrap = $("#node-list-area");
		var scrollProcessFn = function(e) {
			if (this.scrollTop > 0) {
				wrap.addClass("fix-search");
			} else {
				wrap.removeClass("fix-search");
			}

		};
		wrap.on("scroll", scrollProcessFn);

	};

	NodeListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("NodeListCtrl", NodeListCtrl);

})(app);