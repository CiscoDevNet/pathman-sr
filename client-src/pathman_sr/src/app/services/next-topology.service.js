(function(nx, app){

	/*
	 NextTopologyService
	 The service encapsulates NeXt-specific logic. It does not perform any REST API calls.
	 */

	var NextTopologyService = function(SharedDataService) {

		var self = this;

		// public methods
		this.fadeInAllLayers = fadeInAllLayers;
		this.clearPathLayer = clearPathLayer;
		this.createTopoObject = createTopoObject;
		this.addPath = addPath;
		this.removePathByType = removePathByType;
		this.initTopology = initTopology;
		this.findNeighborsByNodeName = findNeighborsByNodeName;
		this.getNodeByParam = getNodeByParam;
		this.getLinkBetweenNodesByNames = getLinkBetweenNodesByNames;

		// private methods
		this._extendNodeClass = _extendNodeClass;
		this._extendTooltipPolicy = _extendTooltipPolicy;
		this._getLinksBetweenNodes = _getLinksBetweenNodes;
		this._nodesToLinks = _nodesToLinks;
		this._extendNodeTooltip = _extendNodeTooltip;

		// private properties
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

		/**
		 * Fade in topology layers
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 */
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


		/**
		 * Remove all paths from topology
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @returns {Object} Path layer object
		 */
		function clearPathLayer(topo){
			var pathLayer = topo.getLayer("paths");
			pathLayer.clear();
			self._paths = {};
			return pathLayer;
		}

		/**
		 *
		 * @returns {nx.graphic.Topology}
		 */
		function createTopoObject() {

			return new nx.graphic.Topology({
				"adaptive": true,
				"scalable": true,
				"nodeConfig": {
					"label": "model.name",
					"iconType": "router"
				},
				"linkConfig": {
					"linkType": "curve",
					"width": 4
				},
				"theme": "blue",
				"identityKey": "name",
				"dataProcessor": "force",
				"showIcon": true,
				"nodeInstanceClass": "ExtendedNode",
				"tooltipManagerConfig": {
					"nodeTooltipContentClass": "ExtendedNodeTooltip",
					"showLinkTooltip": false
				}
			});
		}

		/**
		 * Create a new NeXt class for node instances
		 * @private
		 */
		function _extendNodeClass(){

			nx.define("ExtendedNode", nx.graphic.Topology.Node, {
				view: function(view){

					view.content.push([
						{
							name: 'srBadge',
							type: 'nx.graphic.Group',
							content: [
								{
									name: 'srBadgeBg',
									type: 'nx.graphic.Rect',
									props: {
										'class': 'node-badge-circle',
										height: 1
									}
								},
								{
									name: 'srBadgeText',
									type: 'nx.graphic.Text',
									props: {
										'class': 'node-badge-text',
										y: 1
									}
								}
							],
							props: {
								"class": "node-badge"
							}
						},
						{
							name: 'pcepBadge',
							type: 'nx.graphic.Group',
							content: [
								{
									name: 'pcepBadgeBg',
									type: 'nx.graphic.Rect',
									props: {
										'class': 'node-badge-circle',
										height: 1
									}
								},
								{
									name: 'pcepBadgeText',
									type: 'nx.graphic.Text',
									props: {
										'class': 'node-badge-text',
										y: 1
									}
								}
							],
							props: {
								"class": "node-badge"
							}
						}
					]);
					return view;
				},
				methods: {

					// Initialization of node (first invoked function)
					"init": function(args){
						// inherit methods and properties from base class nx.graphic.Topology.Node
						this.inherited(args);

						// get current stage scaling
						var stageScale = this.topology().stageScale();
						// enlarge default font size based on current stage scaling
						this.view("label").setStyle("font-size", 14 * stageScale);
					},

					// inherit parent's model
					"setModel": function(model) {
						this.inherited(model);

						this._drawBadges(this.model());

					},

					/**
					 * Draw badges over nodes to display additional info
					 * @param model {Object} Node model
					 * @private
					 */
					"_drawBadges": function(model){

						// Initialize used variables
						var icon, iconSize, iconScale,
							srBadge, srBadgeBg, srBadgeText,
							pcepBadge, pcepBadgeBg, pcepBadgeText,
							srBound, srBoundMax, srBadgeTransform,
							pcepBound, pcepBoundMax, pcepBadgeTransform;

						// Get "view" of device icon
						icon = this.view('icon');
						iconSize = icon.size();
						iconScale = icon.scale();


						// *** Configuration of SR badge


						// Get view of SR badge
						srBadge = this.view('srBadge');
						srBadgeBg = this.view('srBadgeBg');
						srBadgeText = this.view('srBadgeText');

						srBadgeText.sets({
							text: "SR",
							visible: true
						});

						// Chunk of computation to draw SR badge
						srBound = srBadge.getBound();
						srBoundMax = Math.max(srBound.width - 6, 1);
						srBadgeBg.sets({
							width: srBoundMax,
							"class": model.get("sr_enabled") ? "node-badge-circle" : "node-badge-circle-inactive",
							visible: true
						});
						srBadgeBg.setTransform(srBoundMax / -2);


						// define position of the badge
						srBadgeTransform = {
							x: iconSize.width * iconScale / 3,
							y: iconSize.height * iconScale / 2.5
						};

						srBadge.setTransform(srBadgeTransform.x, srBadgeTransform.y);

						srBadge.visible(true);
						srBadgeBg.visible(true);
						srBadgeText.visible(true);



						// *** Configuration of PCEP badge



						// Get view of PCEP badge
						pcepBadge = this.view('pcepBadge');
						pcepBadgeBg = this.view('pcepBadgeBg');
						pcepBadgeText = this.view('pcepBadgeText');

						pcepBadgeText.sets({
							text: "PC",
							visible: true
						});

						// Chunk of computation to draw SR badge
						pcepBound = pcepBadge.getBound();
						pcepBoundMax = Math.max(pcepBound.width - 6, 1);
						pcepBadgeBg.sets({
							width: pcepBoundMax,
							"class": model.get("pcep_enabled") ? "node-badge-circle" : "node-badge-circle-inactive",
							visible: true
						});
						pcepBadgeBg.setTransform(pcepBoundMax / -2);


						// define position of the badge
						pcepBadgeTransform = {
							x: iconSize.width * iconScale / -3,
							y: iconSize.height * iconScale / 2.5
						};

						pcepBadge.setTransform(pcepBadgeTransform.x, pcepBadgeTransform.y);

						pcepBadge.visible(true);
						pcepBadgeBg.visible(true);
						pcepBadgeText.visible(true);


					}

				}
			});
		}

		/**
		 * Highlight path by nodes' names
		 * @param topo {nx.graphic.Topology} NeXt topology object
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
					"sourceNode": hopList[0],
					"color": pathColor
				});

				// add the path
				pathLayer.addPath(path);

				self.removePathByType(topo, type);

				self._paths[type] = path;

			}

		}

		/**
		 * Remove path by type from topology and internal path list
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @param type {String} Path type
		 */
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
		 * @param htmlElementId {String} Text identifier of HTML DOM element
		 */
		function initTopology(htmlElementId){

			var nxApp, nxTopology;

			nxApp = new nx.ui.Application();
			nxApp.container(document.getElementById(htmlElementId));

			self._extendNodeClass();
			self._extendTooltipPolicy();
			self._extendNodeTooltip();

			nxTopology = self.createTopoObject();

			nxTopology.tooltipManager().tooltipPolicyClass('ExtendedTooltipPolicy');

			nxTopology.attach(nxApp);

			nxTopology.on("topologyGenerated", function(topo, event){
				topo.registerScene('extended-events', 'ExtendedEvents');
				topo.activateScene('extended-events');
			});

			return {
				"nxApp": nxApp,
				"nxTopology": nxTopology
			};
		}


		/**
		 * Get array of links between the two nodes. Used for path deployment
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @param src {Object} Source node object in NeXt format: nx.graphic.Topology.Node
		 * @param dest {Object} Target/destination node object in NeXt format: nx.graphic.Topology.Node
		 * @returns {*} Array of links if there are links, false otherwise
		 * @private
		 */
		function _getLinksBetweenNodes(topo, src, dest){
			var linkSet = topo.getLinkSet(src.id(), dest.id());
			if (linkSet !== null) {
				return nx.util.values(linkSet.links());
			}
			return false;
		}

		/**
		 *
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @param nodes {Array} Array of node objects (in NeXt format)
		 * @returns {Array} Array of NeXt-like links
		 * @private
		 */
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
							return false;
						}

						result.push(link[0]);
						lastNode = node;
					}
				}
			});

			return result;
		}


		/**
		 * Extends policy/rules for tooltip triggers
		 * @private
		 */
		function _extendTooltipPolicy(){
			nx.define("ExtendedTooltipPolicy",nx.graphic.Topology.TooltipPolicy, {

				"properties": {
					topology: {},
					tooltipManager: {}
				},

				"methods": {

					// inherit methods and properties from base class (nx.graphic.Topology.TooltipPolicy)
					"init": function(args){
						this.inherited(args);
						this.sets(args);
						this._tm = this.tooltipManager();
					},

					// disable default behavior: "click" closes the tooltip
					"clickNode": function(node){
						this._tm.closeAll();
					},

					// overwrite default behavior: entering the node makes tooltip show up
					"enterNode": function(node){
						var topo = node.topology();
						topo.tooltipManager().openNodeTooltip(node);
					},

					// overwrite default behavior: leaving the node makes tooltip hide
					"leaveNode": function(node){
						this._tm.closeAll();
					}

				}
			});
		}


		function _extendNodeTooltip(){
			nx.define('ExtendedNodeTooltip', nx.ui.Component, {
				'properties': {
					"node": {
						set: function (value) {
							var model = value.model();
							var dataCollection = new nx.data.Collection(filterModel(model.getData()));

							this.view('list').set('items', dataCollection);
							this.title(value.label());

							function filterModel(model){

								var newModel = [
									{
										label: "Name",
										value: model.name
									},
									{
										label: "PCEP enabled",
										value: ( model.pcep_enabled !== undefined ) ? "yes" : "no"
									},
									{
										label: "SR enabled",
										value: ( model.sr_enabled !== undefined ) ? "yes" : "no"
									},
									{
										label: "IP",
										value: model.ipaddress
									}

								];

								// display SID if available
								if(model.sr_enabled)
									newModel.push({
										label: "SID",
										value: model.sid
									});

								return newModel;

							}

						}
					},
					"title": "",
					"nodePayload": {},
					"topology": {}
				},
				// 'view' defines the appearance of the tooltip
				view: {
					content: [
						{
							name: 'header',
							props: {
								'class': 'n-topology-tooltip-header'
							},
							content: [
								{
									tag: 'span',
									props: {
										'class': 'n-topology-tooltip-header-text'
									},
									name: 'title',
									content: '{#title}'
								}
							]
						},
						{
							name: 'content',
							props: {
								'class': 'n-topology-tooltip-content n-list'
							},
							content: [
								{
									name: 'list',
									tag: 'ul',
									props: {
										'class': 'n-list-wrap',
										template: {
											tag: 'li',
											props: {
												'class': 'n-list-item-i',
												role: 'listitem'
											},
											content: [
												{
													tag: 'label',
													content: '{label}: '
												},
												{
													tag: 'span',
													content: '{value}'
												}
											]

										}
									}
								}
							]
						}
					]
				},
				"methods": {

					"init": function(args){
						this.inherited(args);
					}

				}
			});
		}


		/**
		 *
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @param paramName
		 * @param paramValue
		 * @returns {*} Object/null
		 */
		function getNodeByParam(topo, paramName, paramValue){

			paramName = paramName || null;
			paramValue = paramValue || null;

			var ret = null;
			topo.getLayer('nodes').nodes().forEach(function (node) {
				var model = node.model().getData();

				if (model[paramName] === paramValue) {
					ret = node;
				}

			});
			return ret;
		}

		/**
		 * Find node's neighbor nodes by its name
		 * @param topo {nx.graphic.Topology} NeXt topology object
		 * @param name {String} Node's name
		 * @return {Array} Neighbors (list of names)
		 */
		function findNeighborsByNodeName(topo, name){

			var neighbors = [],
				nodeInst;

			nodeInst = self.getNodeByParam(topo, "name", name);

			if(nodeInst !== null){
				nodeInst.eachConnectedNode(function(conNode){
					neighbors.push(conNode.model().getData().name);
				});
			}

			return neighbors;

		}


		function getLinkBetweenNodesByNames(topo, srcName, destName){

			var src, dest;

			// get instances of nodes
			src = self.getNodeByParam(topo, "name", srcName);
			dest = self.getNodeByParam(topo, "name", destName);

			// if wrong name of node, return error
			if(!(src && dest))
				return false;

			// return link by node instances
			return self._getLinksBetweenNodes(topo, src, dest)[0];

		}

	};

	NextTopologyService.$inject = ["SharedDataService"];
	app.service("NextTopologyService", NextTopologyService);
})(nx, app);



