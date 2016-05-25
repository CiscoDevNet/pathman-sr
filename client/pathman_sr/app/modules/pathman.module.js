var app = angular.module('pathmanApp', ['ngMaterial', 'restangular', 'md.data.table'])
	// configuration of color themes
	.config(
		function($mdThemingProvider, RestangularProvider) {

			$mdThemingProvider.theme('default')
				.primaryPalette('blue')
				.accentPalette('light-blue');


			// todo: make URL dynamic
			RestangularProvider.setBaseUrl("http://localhost:8020");
			//RestangularProvider.setDefaultHeaders({
			//	//Authorization: "Basic YWRtaW46YWRtaW4="
			//	"Access-Control-Allow-Origin": "*",
			//	"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS"
			//
			//});

			//RestangularProvider.setRequestInterceptor(function (element, operation) {
			//	if (operation === 'post' && element.hasOwnProperty('id') && element.id === undefined) {
			//		return null;
			//	} else {
			//		return element;
			//	}
			//});



		}
	);
