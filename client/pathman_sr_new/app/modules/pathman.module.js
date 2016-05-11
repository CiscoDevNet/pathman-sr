var app = angular.module('pathmanApp', ['ngMaterial', 'restangular'])
	// configuration of color themes
	.config(
		function($mdThemingProvider, RestangularProvider) {

			$mdThemingProvider.theme('default')
				.primaryPalette('blue')
				.accentPalette('light-blue');


			RestangularProvider.setBaseUrl(window.location.protocol + "//" + window.location.hostname + ":8181");
			RestangularProvider.setDefaultHeaders({Authorization: "Basic YWRtaW46YWRtaW4="});

			RestangularProvider.setRequestInterceptor(function (element, operation) {
				if (operation === 'post' && element.hasOwnProperty('id') && element.id === undefined) {
					return null;
				} else {
					return element;
				}
			});



		}
	);
