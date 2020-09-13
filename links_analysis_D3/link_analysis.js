var ObjectViewer_ID = "ObjectViewer";

var ObjectViewer = function (container) {
	console.log("ObjectViewer: in " + container.className);

	this.ovDiv = document.createElement("div");
	this.ovDiv.id = ObjectViewer_ID;
	this.ovDiv.className = ObjectViewer_ID;
	container.appendChild(this.ovDiv);
	//document.body.appendChild(iDiv);

	//this.container = document.getElementById("ObjectViewer");
	var table_html =
		'<table width="320" border="1"><tr><td colspan="2" rowspan="1">' +
		" wdw" +
		'</td></tr><tr><td width="118">' +
		"sxs" +
		'</td><td width="186">' +
		"xs" +
		"</td></tr></table>";
	var tableDiv = document.createElement("table");
	tableDiv.innerHTML = table_html;
	this.ovDiv.append(tableDiv);

	this.getDiv = function () {
		return this.ovDiv;
	};
};

//class LinkAnalysis {
var LinkAnalysis = function (element) {
	var NODE_GROUP_CLASS = "nodeXXX";
	var nodes = [];
	var links = [];
	var image_width = 35;
	var image_height = image_width;
	var node_width = image_width;
	var node_height = image_width;	

	this.addNode = function (node) {
		nodes.push(node);
		start();
	};


	console.log("LinkAnalysis");
	this.object_currently_selected;

	var defaultWidth = 400,
		defaultHeight = 250;




	this.DEFAULT_MARGIN = {
		top: 20,
		right: 120,
		bottom: 20,
		left: 120,
	};
	this.DEFAULT_NODE = {
		width: 100,
		height: 60,
		textMargin: 8,
	};

	this.svg_container = element;
	var objectViewer = new ObjectViewer(element.parentElement);


	//initilize svg or grab svg
	var compStyles = window.getComputedStyle(svg_container);

	var clientWidth = this.svg_container.clientWidth;
	var clientHeight = this.svg_container.clientHeight;

	var width = clientWidth;
	var height = clientHeight;
	console.log(width);
	console.log(height);

	var svg = d3.select(this.svg_container).append("svg")
		// Responsive SVG needs these 2 attributes and no width and height attr.
		// .attr("preserveAspectRatio", "xMinYMin meet")
		// .attr("viewBox", "0 0 1400 900")
		// Class to make it responsive.
		//.classed("svg-content-responsive", true);

		// Fill with a rectangle for visualization.
		// .append("rect")
		// .classed("rect", true)
		.attr("width", width)
		.attr("height", height);

	var simulation = d3.forceSimulation()
		.nodes(nodes)

		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(this.w / 2, this.h / 2))
		.force("link", d3.forceLink().distance(200).strength(0.6))
		.force("x", d3.forceX(width / 2))
		.force("y", d3.forceY(height / 2))
		.on("tick", ticked);


		function start() {

			hideObjectViewer();
	
			//	addNodeAndCreateLink(case_record, ROOT_NODE_NAME, graph_data);
			//	addNodesAndLinks(family_records, graph_data);
			//	addNodesAndLinks(friends_records, graph_data);
			console.log(nodes);
			/*
			var repelForce = d3
				.forceManyBody()
				.strength(-3000)
				.distanceMax(450)
				.distanceMin(85);
			var collide_force = d3.forceCollide(function (d) {
				return d.name === ROOT_NODE_NAME ? 150 : 50;
			});
			var linkForce = d3.forceLink().distance(getDistance).strength(2);
			linkForce.id(getNodeID);
			var charge_force = d3.forceManyBody().strength(-100);
			var center_force = d3.forceCenter(this.width / 2, this.height / 2);
	
			var simulation = d3
				.forceSimulation()
				.force("linkForce", linkForce)
				.force("charge", charge_force)
				.force("center", center_force)
				//.force("box_force", this.box_force)
	
				.force("repelForce", repelForce)
				.force("collide", collide_force)
				// .force("xAxis", d3.forceX(width / 2).strength(0.4))
				// .force("yAxis", d3.forceY(height / 2).strength(0.6))
				.on("tick", this.ticked());
	*/
			/* Nodes are identified by their name
			 */
			function getNodeID(d) {
				return d.name;
			}
	
			function getDistance(d) {
				return 30; //d.distance+30;
			}
	
	
			var grey_Level_One = "#272727",
				grey_Level_Two = "#565656",
				grey_Level_Thr = "#868686",
				grey_Level_Fou = "#b6b6b6";

				var radius = 16;
				var circleColour = "black";

            var linkElements = svg.selectAll(".link").data(links);
			linkElements = svg
				.selectAll(".link")
				.data(links)
				.enter()
				.append("line")
				.attr("class", "link");


			node = svg.selectAll("g").select("." + NODE_GROUP_CLASS).data(nodes,function (d) { return d.id });

			var nodeEnter = node.enter()
				.append("g")
				.attr("class", NODE_GROUP_CLASS)
				.on("click", this.handle_node_click)
				.on("mouseover", handle_node_mouseover);

			console.log(nodeEnter);
			var drag_handler = d3
			.drag()
			.on("start", this.drag_start)
			.on("drag", this.drag_drag)
			.on("end", this.drag_end);
			drag_handler(nodeEnter);


	
			// Append images
			var images = nodeEnter.append("image")
				.attr("xlink:href", function (d) {
					if (d.photo) {
						return d.photo;
					}
					if (d.type == "person") {
						return d.photo;
					}
					if (d.type == "case") {
						return icon_case_base64;
					}
					if (d.type == "arrest") {
						return icon_arrest_base64;
					}
					if (d.type == "vehicle") {
						return icon_vehicle_base64;
					}
				})
				.attr("x", function (d) {
					return -(image_height / 2);
				})
				.attr("y", function (d) {
					return -(image_width / 2);
				})
				.attr("height", image_height)
				.attr("width", image_width);
	
			var nodeLabel = nodeEnter.append("text")
				// .attr("x", function(d) {       return (image_height / 2);    })
				.attr("y", function (d) {
					return image_height / 2 + 10;
				})
				.attr("text-anchor", "middle")
				.classed("nodeLabel", true)
				.text(function (d) {
					return d.name;
				});
	
				node.exit().remove();
				node = nodeEnter.merge(node);


			//linkElements.exit().remove();
	
			simulation.force("link").links(links);
			simulation.restart();
	
			function handle_node_mouseover(d) {
				console.log("You mouseover", d);
			}
	

	
			function addNodeAndCreateLink(node, target_name, graph_data) {
				var source_name = node.name;
				var link = {
					source: source_name,
					target: target_name,
				};
				graph_data.nodes.push(node);
				graph_data.links.push(link);
			}
	
			/**
			 *
			 *
			 */
			function addNodesAndLinks(records, graph_data) {
				var node_name = records.name;
				var target_name = records.parent;
	
				// RECORD CATEGORY
				// createNodeAndLink ("category", target_name, source_name, graph_data);
				var node = {
					name: node_name,
					type: "category",
				};
				addNodeAndCreateLink(node, target_name, graph_data);
	
				/*var node = { name: source_name  ,"type" : "category"};
		  var link = { source: source_name, target: target_name};
		  graph_data.nodes.push(node);
		  graph_data.links.push(link);
		  */
	
				// CONNECT TO CATEGORY
				target_name = node_name;
	
				// RECORDS
				for (var i = 0; i < records.children.length; i++) {
					var node = records.children[i];
					//console.log(record);
					//source_name = node.name;
					//createNodeAndLink("person", target_name, source_name, graph_data);
					addNodeAndCreateLink(node, target_name, graph_data);
				}
			}
		};



	hideObjectViewer = function () {
		this.svg_container.style.marginRight = "0px";
		objectViewer.getDiv().style.right = "-350px";
		objectViewer.getDiv().display = "none";
	};

	showObjectViewer = function () {
		this.svg_container.style.marginRight = "350px";
		objectViewer.getDiv().style.right = "0px";
		objectViewer.getDiv().display = "block";
	};

	//custom force to put stuff in a box

	box_force = function (alpha) {
		var graph_nodes_count = this.getGraphData().nodes.length;

		for (var i = 0; i < graph_nodes_count; ++i) {
			var curr_node = this.getGraphData().nodes[i];
			curr_node.x = Math.max(
				radius,
				Math.min(this.width - radius, curr_node.x)
			);
			curr_node.y = Math.max(
				radius,
				Math.min(this.height - radius, curr_node.y)
			);
		}
	};

	function ticked() {
		var node = svg.selectAll( "." + NODE_GROUP_CLASS);

		//console.log(node);

		var labels = svg.selectAll(".nodeLabel");
		//console.log(labels);

		var linkElements = svg.selectAll(".link");

		node.attr("transform", function (d) {
			return "translate(" + d.x + ", " + d.y + ")";
		});

		linkElements
			.attr("x1", function (d) {
				return d.source.x;
			})
			.attr("y1", function (d) {
				return d.source.y;
			})
			.attr("x2", function (d) {
				return d.target.x;
			})
			.attr("y2", function (d) {
				return d.target.y;
			});
	};



	handle_node_click = function (d) {
		console.log(" ------- handle_node_click --------- ");
		console.log("current selection = ", this.object_currently_selected);
		console.log("object clicked    = ", d);

		if (d != this.object_currently_selected) {
			showObjectViewer();
			object_currently_selected = d;
		} else {
			hideObjectViewer();
			object_currently_selected = null;
		}
	};

};
