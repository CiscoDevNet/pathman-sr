(function(app){

	var NextTopologyCtrl = function($scope, NextTopologyService, SharedDataService) {

		// "scopify" shared data
		$scope.shared = SharedDataService.data;
		$scope.extendEvents = extendEvents;

		$scope.extendEvents();


		/* Implementation below */

		/**
		 * Add new behavior to topology
		 * @private
		 */
		function extendEvents(){
			nx.define('ExtendedEvents', nx.graphic.Topology.DefaultScene, {
				methods: {
					clickNode: function(sender, node){
						$scope.$apply(function(){
							$scope.openPanel("node-details", {"nodeData": node.model().getData()});
						});
					},
					clickLink: function(sender, link){
						$scope.$apply(function(){
							$scope.openPanel("link-details", {"linkData": link.model().getData()});
						});
					}
				}

			});
		}

	};

	NextTopologyCtrl.$inject = ["$scope", "NextTopologyService", "SharedDataService"];
	app.controller("NextTopologyCtrl", NextTopologyCtrl);

})(app);