(function(nx, app){

	/*
	 NextTopologyService
	 The service encapsulates NeXt-specific logic. It does not perform any REST API calls.
	 */

	var NextTopologyService = function() {

		var self = this;

		this.fadeInAllLayers = fadeInAllLayers;
		this.clearPathLayer = clearPathLayer;
		this.createTopoObject = createTopoObject;
		this.addPath = addPath;
		this.initTopology = initTopology;
		this.extendNodeClass = extendNodeClass;
		this.removePathByType = removePathByType;

		this._getLinksBetweenNodes = _getLinksBetweenNodes;
		this._nodesToLinks = _nodesToLinks;
		this._paths = {};
		this._colorTable = {
			"paths": {
				"pathListHover": "#ffbf00",
				"pathListSelected": "#ff7300",
				"deployed": "#00ff00",
				"deploymentFailed": "#ff0000",
				"_default": "#3333cc"
			}
		};

		function fadeInAllLayers(topo){
			//fade out all layers
			var linksLayerHighlightElements = topo.getLayer('links').highlightedElements(),
				nodeLayerHighlightElements = topo.getLayer('nodes').highlightedElements();

			//Clears previous
			nodeLayerHighlightElements.clear();
			linksLayerHighlightElements.clear();

			nx.each(topo.layers(), function(layer) {
				layer.fadeIn(true);
			}, this);
		}

		function clearPathLayer(topo){
			var pathLayer = topo.getLayer("paths");
			pathLayer.clear();
			self._paths = {};
			return pathLayer;
		}

		function createTopoObject() {

			return new nx.graphic.Topology({
				adaptive: true,
				scalable: true,
				nodeConfig: {
					label: "model.name",
					iconType: "router"
				},
				linkConfig: {
					linkType: "curve"
				},
				theme: "blue",
				identityKey: "name",
				dataProcessor: "force",
				showIcon: true,
				nodeInstanceClass: 'ExtendedNode'
			});
		}

		function extendNodeClass(){

			nx.define("ExtendedNode", nx.graphic.Topology.Node, {
				view: function(view){

					view.content.push({
						name: 'srBadge',
						type: 'nx.graphic.Group',
						content: [
							{
								name: 'srBadgeBg',
								type: 'nx.graphic.Rect',
								props: {
									'class': 'link-set-circle',
									height: 1
								}
							},
							{
								name: 'srBadgeText',
								type: 'nx.graphic.Text',
								props: {
									'class': 'link-set-text',
									y: 1
								}
							}
						]
					});
					return view;
				},
				methods: {
					// inherit properties/parent"s data
					"init": function(args){
						this.inherited(args);
						var stageScale = this.topology().stageScale();
						this.view("label").setStyle("font-size", 14 * stageScale);
					},
					// inherit parent"s model
					"setModel": function(model) {
						this.inherited(model);

						if(this.model().get("sid") !== undefined){
							this._drawSrEnabledBadge();
						}

						if(this.model().get("pcc") !== undefined){
							//this._drawPcepEnabledBadge();
						}
					},
					"_drawSrEnabledBadge": function(){

						var icon, iconSize, iconScale,
							srBadge, srBadgeBg, srBadgeText,
							pcepBadge, pcepBadgeBg, pcepBadgeText,
							srBadgeTransform;

						// get view of device icon
						icon = this.view('icon');
						iconSize = icon.size();
						iconScale = icon.scale();

						// get view of SR badge
						srBadge = this.view('srBadge');
						srBadgeBg = this.view('srBadgeBg');
						srBadgeText = this.view('srBadgeText');

						// SR badge computation
						var bound = srBadge.getBound();
						var boundMax = Math.max(bound.width - 6, 1);
						srBadgeBg.sets({width: boundMax, visible: true});
						srBadgeBg.setTransform(boundMax / -2);

						srBadgeText.sets({
							text: "SR",
							visible: true
						});

						// define position of the badge
						srBadgeTransform = {
							x: iconSize.width * iconScale / 4,
							y: iconSize.height * iconScale / 4
						};

						srBadge.setTransform(srBadgeTransform.x, srBadgeTransform.y);

						srBadge.visible(true);
						srBadgeBg.visible(true);
						srBadgeText.visible(true);
					}

				}
			});

		}

		/**
		 * Highlight path by nodes' names
		 * @param topo {Object}
		 * @param hopListNames {Array} Array of names of hop routers
		 * @param type {String} Type of a path. See color table above
		 */
		function addPath(topo, hopListNames, type){

			var pathLayer = topo.getLayer("paths");
			var hopList = [];
			var pathLinkList;
			var pathColor = self._colorTable["paths"][type] === "undefined" ?
				self._colorTable["paths"]._default : self._colorTable["paths"][type];

			// not using .map, because we need to be able to exclude "bad" nodes
			for(var i = 0; i < hopListNames.length; i++){
				var hopNode = topo.getNode(hopListNames[i]);
				if(hopNode)
					hopList.push(hopNode);
			}

			pathLinkList = self._nodesToLinks(topo, hopList);

			if(pathLinkList !== false){
				// create a new Path entity
				var path = new nx.graphic.Topology.Path({
					"pathWidth": 3,
					"links": pathLinkList,
					"arrow": "cap",
					"pathStyle": {
						"fill": pathColor
					}
				});

				// add the path
				pathLayer.addPath(path);

				self.removePathByType(topo, type);

				self._paths[type] = path;

			}

		}

		function removePathByType(topo, type){
			var pathLayer;

			if(self._paths.hasOwnProperty(type)){
				pathLayer = topo.getLayer("paths");
				pathLayer.removePath(self._paths[type]);
				delete self._paths[type];
			}

		}


		/**
		 * Initialize topology and display within "htmlElementId"
		 * @param htmlElementId
		 */
		function initTopology(htmlElementId){

			var nxApp, nxTopology;

			nxApp = new nx.ui.Application();
			nxApp.container(document.getElementById(htmlElementId));

			self.extendNodeClass();
			nxTopology = self.createTopoObject();

			nxTopology.attach(nxApp);

			return {
				"nxApp": nxApp,
				"nxTopology": nxTopology
			};
		}


		function _getLinksBetweenNodes(topo, src, dest){
			var linkSet = topo.getLinkSet(src.id(), dest.id());
			if (linkSet !== null) {
				return nx.util.values(linkSet.links());
			}
			return false;
		}

		function _nodesToLinks(topo, nodes) {
			var result = [];
			var lastNode;

			nodes.forEach(function (node){
				if (typeof lastNode === 'undefined'){
					lastNode = node;
				}
				else{
					if(node){
						var link = self._getLinksBetweenNodes(topo, lastNode, node);

						if(typeof link === false){
							console.error("ERROR: path must be valid!");
							return false;
						}

						result.push(link[0]);
						lastNode = node;
					}
				}
			});

			return result;
		}

	};

	NextTopologyService.$inject = [];
	app.service("NextTopologyService", NextTopologyService);
})(nx, app);



