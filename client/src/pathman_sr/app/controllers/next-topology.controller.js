(function(app){

	var NextTopologyCtrl = function($scope, $rootScope, NextTopologyService, SharedDataService) {

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

						switch(SharedDataService.data.pathSetupMode){

							case "manual":
								// pass message to "PathSetupCtrl"
								$scope.$apply(function(){
									$scope.$root.$broadcast("topo-select-node-manual", {"nodeData": node.model().getData()});
								});
								break;
							default:
								// open panel
								$scope.$apply(function(){
									$scope.openPanel("node-details", {"nodeData": node.model().getData()});
								});
								break;
						}
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

	NextTopologyCtrl.$inject = ["$scope", "$rootScope", "NextTopologyService", "SharedDataService"];
	app.controller("NextTopologyCtrl", NextTopologyCtrl);

})(app);