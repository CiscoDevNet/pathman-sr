(function(app){

	/*
	HelpersService
	This service contains functions that help a dev with routine work
	 */

	var HelpersService = function(){

		this.hasOwnPropertiesPath = hasOwnPropertiesPath;

		/**
		 * If an object "a" has a path [b, c, d], it verifies if the object a.b.c.d exists
		 * @param sourceObj {Object}
		 * @param path {Array}
		 */
		function hasOwnPropertiesPath(sourceObj, path){

			var currentObject = sourceObj;

			for(var i = 0; i < path.length; i++){
				if(currentObject.hasOwnProperty(path[i])){
					currentObject = currentObject[path[i]];
				}
				else{
					return false;
				}
			}

			return true;

		}

	};

	HelpersService.$inject = [];
	app.service("HelpersService", HelpersService);

})(app);