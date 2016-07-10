var configFn, app;

// module configuration function
configFn = function($mdThemingProvider, RestangularProvider) {

	$mdThemingProvider.theme("default")
		.primaryPalette("blue")
		.accentPalette("light-blue");
	
	RestangularProvider.setBaseUrl(window.location.origin);
};
configFn.$inject = ["$mdThemingProvider", "RestangularProvider"];

// define module
app = angular.module("pathmanApp", ["ngMaterial", "restangular", "md.data.table"]);
// configuration of color themes
app.config(configFn);
