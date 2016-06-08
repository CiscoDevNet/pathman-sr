var configFn, app;

// module configuration function
configFn = function($mdThemingProvider, RestangularProvider) {

	$mdThemingProvider.theme("default")
		.primaryPalette("blue")
		.accentPalette("light-blue");


	// todo: make URL dynamic
	RestangularProvider.setBaseUrl("http://localhost:8020");
};
configFn.$inject = ["$mdThemingProvider", "RestangularProvider"];

// define module
app = angular.module("pathmanApp", ["ngMaterial", "restangular", "md.data.table"]);
// configuration of color themes
app.config(configFn);
