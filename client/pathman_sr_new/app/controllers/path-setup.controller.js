(function(app){

	var PathSetupCtrl = function($scope, $log) {

		$scope.validCostMetrics = ['igp', 'hops'];
		$scope.isAutoPathFormInvalid = isAutoPathFormInvalid;

		/* Implementation */
		function isAutoPathFormInvalid(){

			if(!$scope.hasOwnProperty("psForm")){
				return true;
			}
			else if(!$scope.hasOwnProperty("autoPathForm")){
				return true;
			}
			else{

				if($scope.autoPathForm.$invalid){
					return true;
				}

				if($scope.psForm.hasOwnProperty('source') && $scope.psForm.hasOwnProperty('destination')){
					if($scope.psForm.source == $scope.psForm.destination){
						return true;
					}
				}
				else{
					return true;
				}


				if($scope.validCostMetrics.indexOf($scope.psForm.costMetric) === -1){
					return true;
				}
			}

			return false;

		}

	};

	PathSetupCtrl.$inject = ["$scope", "$log"];
	app.controller('PathSetupCtrl', PathSetupCtrl);

})(app);