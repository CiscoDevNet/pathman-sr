(function(app){

	var ErrorHandlerCtrl = function($scope, errData, $mdToast, $mdDialog, ErrorHandlerService) {


		$scope.errData = errData;


		$scope.closeDialog = function(){
			$mdDialog.hide();
		};

		$scope.showMoreInfoInDialog = function(){
			$scope.closeToast();
			ErrorHandlerService.log($scope.errData, {
				type: "dialog",
				allowTologInConsole: false
			});
		};

		$scope.closeToast = function(){
			$mdToast
				.hide()
				.then(function() {

				});
		};

	};


	ErrorHandlerCtrl.$inject=['$scope', 'errData', '$mdToast', '$mdDialog', 'ErrorHandlerService'];
	app.controller("ErrorHandlerCtrl", ErrorHandlerCtrl);
})(app);