/*
How to use:

ErrorHandlerService.log(err[, displayErrConfig]);

err is an Object that contains information about the error. It is mandatory to pass the Object into .log() function.

The structure is as follows (with example):

err = {
	"errCode": "REGSTATS_NOT_LOADED", // code of error (must be unique in scope of the project)
	"errTitle": "Registration data is not loaded", // short description of what happened
	"errMsg": "Couldn't load Registration information from controller. Server does not respond.", // moderately detailed description of the error
	"errResolution": "Check if controller is down, otherwise check your connection.", // optional: resolution of the problem
	// Optional: an object that may be processed in different ways, thanks to errCode.
	// Contains details of the problem (may be anything that helps identify and fix the reason without debugging the code)
	"errObj": {
		"testProp": "testValue"
	}
};

displayErrConfig can be boolean (true/false) or an Object. Optional.

If missing or false, user doesn't see the error.
If true, it shows pop-up by default (see this.defaultMethod)
If Object, it must have "type" property, which must be one of the following:
- dialog: depict as a dialog window
- toast: depict as a small pop-up notification in a corner
- default: same as if displayErrConfig === true, that is it choose default method
- hide: same as if displayErrConfig === false, that is it hides the error from user
As the Object it may have a boolean property allowToLogInConsole, which determines if the message needs putting to console (true = put, false = do not)
 */

(function(app){

	var ErrorHandlerService = function($log, $mdDialog, $mdToast) {

		// If true, track errors in the console
		this.debug = true;
		this.defaultMethod = 'toast';

		/**
		 * A tiny pop-up at the top right corner. Can expand to a dialog window
		 * @param err {Object} Error object with the following properties: errCode, errTitle, errMsg, errResolution, errObj
		 */
		this.displayMDToast = function(err){
			$mdToast.show({
				hideDelay   : 10000,
				position    : 'bottom right',
				controller  : 'ErrorHandlerCtrl',
				templateUrl : 'templates/error-views/toast.tpl.html',
				locals: {
					'errData': err
				}
			});
		};

		/**
		 * Open a dialog window for the error
		 * @param err {Object} Error object with the following properties: errCode, errTitle, errMsg, errResolution, errObj
		 */
		this.displayMDDialog = function(err){
			var parentEl = angular.element(document.body);
			$mdDialog.show({
				parent: parentEl,
				controller  : 'ErrorHandlerCtrl',
				templateUrl : 'templates/error-views/dialog.tpl.html',
				clickOutsideToClose: true,
				locals: {
					'errData': err
				}
			});
		};

		/**
		 * Display error to user by default
		 * @param err {Object} Error object with the following properties: errCode, errTitle, errMsg, errResolution, errObj
		 */
		this.displayPopupByDefault = function(err){
			switch(this.defaultMethod){
				case 'toast':
					this.displayMDToast(err);
					break;
				case 'dialog':
					this.displayMDDialog(err);
					break;
			}
		};

		/**
		 * Track error
		 * @param err {Object} Error object with the following properties: errCode, errTitle, errMsg, errResolution, errObj
		 * @param displayErrConfig {Boolean} Do we need to show the error to a user?
		 */
		this.log = function(err, displayErrConfig){

			displayErrConfig = displayErrConfig || false;

			var consoleMessagesAllowed = true;

			// if user needs to see it
			if(displayErrConfig){
				// default settings
				if(displayErrConfig === true){
					this.displayPopupByDefault(err);
				}
				// explicitly defined configuration
				else{
					if(displayErrConfig.hasOwnProperty('type')){
						switch(displayErrConfig.type){
							// display as a dialog
							case 'dialog':
								this.displayMDDialog(err);
								break;
							// display as a toast
							case 'toast':
								this.displayMDToast(err);
								break;
							// pop-up by default
							case 'default':
								this.displayPopupByDefault(err);
								break;
							// show nothing
							case 'hide':
								break;
						}
					}
					else{
						// action by default
						this.displayPopupByDefault(err);
					}

					// allowToLogInConsole implementation
					if(displayErrConfig.hasOwnProperty('allowToLogInConsole')){
						consoleMessagesAllowed = (typeof displayErrConfig.allowToLogInConsole == 'boolean') ?
							displayErrConfig.allowToLogInConsole : false;
					}
				}
			}

			// "debug" mode allows messages appear in console
			if(this.debug && consoleMessagesAllowed)
				$log.error("Error occurred.", err);

		};
	};

	ErrorHandlerService.$inject = ['$log', '$mdDialog', '$mdToast'];
	app.service("ErrorHandlerService", ErrorHandlerService);

})(app);