(function(app){

	var LinkListCtrl = function($scope, NextTopologyService, SharedDataService) {

		$scope.linkSearchQuery = "";
		// search field "catcher"
		var wrap = $("#link-list-area");
		var scrollProcessFn = function(e) {
			if (this.scrollTop > 0) {
				wrap.addClass("fix-search");
			} else {
				wrap.removeClass("fix-search");
			}

		};
		wrap.on("scroll", scrollProcessFn);

	};

	LinkListCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("LinkListCtrl", LinkListCtrl);

})(app);