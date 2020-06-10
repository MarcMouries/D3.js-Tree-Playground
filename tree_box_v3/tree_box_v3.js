	// COLOR PALETTE 
	var
	    transparent = "transparent",
	    // ServiceNow Colors
	    Green_Acapulco = "#84b8a4",
	    Blue_Hippie = "#68a1af",
	    Red_Orchid = "#db8f8f",
	    Red_Orchid_1 = "#de9a9a",
	    Red_Orchid_2 = "#e2a5a5",

	    /*
	    #e5b0b0
	    #e9bbbb
	    #edc7c7
	    #f0d2d2
	    #f4dddd
	    #f7e8e8
	    #fbf3f3
	    #ffffff
	    */


	    Green_Gable = "#293E40",

	    Green_Gable_1 = "#546566",
	    Green_Gable_2 = "#768485",
	    Green_Gable_3 = "#919D9D",
	    Green_Gable_4 = "#A7B1B1",
	    Green_Gable_5 = "#B9C1C1",
	    Green_Gable_6 = "#C7CDCD",
	    Green_Gable_7 = "#D2D7D7",
	    Green_Gable_8 = "#DBDFDF",
	    Green_Gable_9 = "#E2E5E5",

	    //
	    black = "#1b262c",
	    yellow = "#FFD160",
	    orange = "#fa744f",
	    red = "#ed6663",
	    grey = "#565656",
	    grey_Level_One = "#272727",
	    grey_Level_Two = "#565656",
	    grey_Level_Thr = "#868686",
	    grey_Level_Fou = "#b6b6b6";

	// DIMENSIONS
	var rectNode = {
	    width: 180,
	    height: 90,
	    textMargin: 8
	};

	

	function treeBoxes(container, jsonData) {
	    var margin = {
	            top: 0,
	            right: 0,
	            bottom: 100,
	            left: 0
	        },
	        // Height and width are redefined later in function of the size of the tree
	        // (after that the data are loaded)
	        width = 900 - margin.right - margin.left,
	        height = 500 - margin.top - margin.bottom;

	    var tooltip = {
	        width: 150,
	        height: 60,
	        textMargin: 15
	    };
	    var i = 0,
	        duration = 750,
	        root;

	    var mousedown; // Use to save temporarily 'mousedown.zoom' value
	    var mouseWheel,
	        mouseWheelName,
	        isKeydownZoom = false;

	    var tree;
	    var baseSvg,
	        svgGroup,
	        nodeGroup, // If nodes are not grouped together, after a click the svg node will be set after his corresponding tooltip and will hide it
	        nodeGroupTooltip,
	        linkGroup,
	        linkGroupToolTip,
	        defs;

	    init(jsonData);

	    function init(jsonData) {

	        if (jsonData)
	            drawTree(jsonData);
	        else {
	            console.error(jsonData);
	            alert('Invalid data.');
	        }
	    }

	    function drawTree(jsonData) {
	        tree = d3.layout.tree().size([height, width]);
	        root = jsonData;
	        root.fixed = true;

	        // Dynamically set the height of the main svg container
	        // breadthFirstTraversal returns the max number of node on a same level
	        // and colors the nodes
	        var maxDepth = 0;

	        var maxTreeWidth = breadthFirstTraversal(tree.nodes(root), function (currentLevel) {
	            maxDepth++;
	            currentLevel.forEach(function (node) {
	                node.color = colorByNodeType[node.type];
	            })
	        });


	        height = maxTreeWidth * (rectNode.height + 20) + tooltip.height + 20 - margin.right - margin.left;
	        width = maxDepth * (rectNode.width * 1.5) + tooltip.width / 2 - margin.top - margin.bottom;

	        tree = d3.layout.tree().size([height, width]);
	        root.x0 = height / 2;
	        root.y0 = 0;

	        baseSvg = d3.select(container).append('svg')
	            .attr('width', width + margin.right + margin.left)
	            .attr('height', height + margin.top + margin.bottom)
	            .attr('class', 'svgContainer')
	            .call(d3.behavior.zoom()
	                //.scaleExtent([0.5, 1.5]) // Limit the zoom scale
	                .on('zoom', zoomAndDrag));

	        // Mouse wheel is desactivated, else after a first drag of the tree, wheel event drags the tree (instead of scrolling the window)
	        //getMouseWheelEvent();
	        d3.select('#tree-container').select('svg').on(mouseWheelName, null);
	        d3.select('#tree-container').select('svg').on('dblclick.zoom', null);

	        svgGroup = baseSvg.append('g')
	            .attr('class', 'drawarea')
	            //.append('g')
	            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	        // SVG elements under nodeGroupTooltip could be associated with nodeGroup,
	        // same for linkGroupToolTip and linkGroup,
	        // but this separation allows to manage the order on which elements are drew
	        // and so tooltips are always on top.
	        nodeGroup = svgGroup.append('g').attr('id', 'nodes');
	        linkGroup = svgGroup.append('g').attr('id', 'links');
	        linkGroupToolTip = svgGroup.append('g').attr('id', 'linksTooltips');
	        nodeGroupTooltip = svgGroup.append('g').attr('id', 'nodesTooltips');

	        var
	            nodes = tree.nodes(root),
	            links = tree.links(nodes);

	        /*
	        var link = baseSvg.selectAll(".link")
	        .data(links)
	        .enter()
	        .append("g")
	        .attr("class", "link");
	        */

	        defs = baseSvg.append('defs');
	        initArrowDef();
	        initDropShadow();

	        update(root);
	    }




	    function update(source) {
	        // Compute the new tree layout
	        var nodes = tree.nodes(root).reverse(),
	            links = tree.links(nodes);

	        // Check if two nodes are in collision on the ordinates axe and move them
	        breadthFirstTraversal(tree.nodes(root), collision);
	        // Normalize for fixed-depth
	        nodes.forEach(function (d) {
	            //	d.y = d.depth * (rectNode.width * 1.5);
	        });

	        // 1) ******************* Update the nodes *******************
	        var node = nodeGroup.selectAll('g.node').data(nodes, function (d) {
	            return d.id || (d.id = ++i);
	        });
	        var nodesTooltip = nodeGroupTooltip.selectAll('g').data(nodes, function (d) {
	            return d.id || (d.id = ++i);
	        });

	        // Enter any new nodes at the parent's previous position
	        // We use "insert" rather than "append", so when a new child node is added (after a click)
	        // it is added at the top of the group, so it is drawed first
	        // else the nodes tooltips are drawed before their children nodes and they hide them
	        var nodeEnter = node.enter().insert('g', '__g.node')
	            .attr('class', 'node')
	            .attr('transform', function (d) {
	                return 'translate(' + source.y0 + ',' + source.x0 + ')';
	            })
	            .on('click', function (d) {
	                click(d);
	            });
	        var nodeEnterTooltip = nodesTooltip.enter().append('g')
	            .attr('transform', function (d) {
	                return 'translate(' + source.y0 + ',' + source.x0 + ')';
	            });

	        //**************************************
	        // Node Content
	        //**************************************

	        nodeEnter.append('g').append('rect')
	            //	.attr('rx', 6)
	            //	.attr('ry', 6)
	            .attr('class', 'node-rect')
	            .attr('width', rectNode.width)
	            .attr('height', rectNode.height)
	            .attr('fill', function (d) {
	                return d.color;
	            })
	        //.attr('filter', 'url(#drop-shadow)')
	        ;

	        nodeEnter.append('foreignObject')
	            .attr('width', function () {
	                return rectNode.width;
	                /*		return (rectNode.width - rectNode.textMargin * 2) < 0 ? 0
	                                : (rectNode.width - rectNode.textMargin * 2)*/
	            })
	            .attr('height', function () {
	                return rectNode.height;
	                /*	return (rectNode.height - rectNode.textMargin * 2) < 0 ? 0
	                            : (rectNode.height - rectNode.textMargin * 2)
	                            */
	            })
	            .append('xhtml').html(function (node) {
	                return make_content(node);
	            });


	        nodeEnterTooltip.append("rect")
	            .attr('id', function (d) {
	                return 'nodeInfoID' + d.id;
	            })
	            .attr('x', rectNode.width / 2)
	            .attr('y', rectNode.height / 2)
	            .attr('width', tooltip.width)
	            .attr('height', tooltip.height)
	            .attr('class', 'tooltip-box')
	            .style('fill-opacity', 0.8)
	            .on('mouseover', function (d) {
	                $('#nodeInfoID' + d.id).css('visibility', 'visible');
	                $('#nodeInfoTextID' + d.id).css('visibility', 'visible');
	                removeMouseEvents();
	            })
	            .on('mouseout', function (d) {
	                $('#nodeInfoID' + d.id).css('visibility', 'hidden');
	                $('#nodeInfoTextID' + d.id).css('visibility', 'hidden');
	                reactivateMouseEvents();
	            });

	        nodeEnterTooltip.append("text")
	            .attr('id', function (d) {
	                return 'nodeInfoTextID' + d.id;
	            })
	            .attr('x', rectNode.width / 2 + tooltip.textMargin)
	            .attr('y', rectNode.height / 2 + tooltip.textMargin * 2)
	            .attr('width', tooltip.width)
	            .attr('height', tooltip.height)
	            .attr('class', 'tooltip-text')
	            .style('fill', 'white')
	            .append("tspan")
	            .text(function (d) {
	                return 'Name: ' + d.name;
	            })
	            .append("tspan")
	            .attr('x', rectNode.width / 2 + tooltip.textMargin)
	            .attr('dy', '1.5em')
	            .text(function (d) {
	                return 'Info: ' + d.label;
	            });

	        // Transition nodes to their new position.
	        var nodeUpdate = node.transition().duration(duration)
	            .attr('transform', function (d) {
	                return 'translate(' + d.y + ',' + d.x + ')';
	            });
	        nodesTooltip.transition().duration(duration)
	            .attr('transform', function (d) {
	                return 'translate(' + d.y + ',' + d.x + ')';
	            });

	        nodeUpdate.select('rect')
	            .attr('class', function (d) {
	                return d._children ? 'node-rect-closed' : 'node-rect';
	            });

	        nodeUpdate.select('text').style('fill-opacity', 1);

	        // Transition exiting nodes to the parent's new position
	        var nodeExit = node.exit().transition().duration(duration)
	            .attr('transform', function (d) {
	                return 'translate(' + source.y + ',' + source.x + ')';
	            })
	            .remove();
	        nodesTooltip.exit().transition().duration(duration)
	            .attr('transform', function (d) {
	                return 'translate(' + source.y + ',' + source.x + ')';
	            })
	            .remove();

	        nodeExit.select('text').style('fill-opacity', 1e-6);


	        // 2) ******************* Update the links *******************
	        var link = linkGroup.selectAll('path').data(links, function (d) {
	            return d.target.id;
	        });

	        var linkTooltip = linkGroupToolTip.selectAll('g').data(links, function (d) {
	            return d.target.id;
	        });

	        function linkMarkerStart(direction, isSelected) {
	            if (direction == 'SYNC') {
	                return isSelected ? 'url(#start-arrow-selected)' : 'url(#start-arrow)';
	            }
	            return '';
	        }


	        // LINKS		


	        // Enter any new links at the parent's previous position.
	        //		var linkEnter = link.enter().insert('path', 'g')

	        // Enter any new links at the parent's previous position.
	        var linkEnter = link.enter().insert('g', 'g')
	            .attr("class", "link");

	        linkEnter.append('path')
	            .attr('class', 'link')
	            .attr('id', function (d) {
	                return 'linkID' + d.target.id;
	            })
	            .attr('d', function (d) {
	                return diagonal(d);
	            })
	            .attr('marker-end', 'url(#end-arrow)');

	        linkEnter.append('text')
	            .text(function (d, i) {
	                return "d.target.link";
	            })
	            .attr('dy', "-1em")
	            .attr('class', 'linkLabel')
	            .attr('transform', function (d) {
	                if (d.source) {
	                    return 'translate(' + ((d.source.y + d.y) / 2) + ',' + ((d.source.x + d.x) / 2) + ')'
	                }
	            });


	        // not in v3 : var linkUpdate = linkEnter.merge(link);

	        /*
	        linkTooltip.enter().append('rect')
	        .attr('id', function(d) { return 'tooltipLinkID' + d.target.id; })
	        .attr('class', 'tooltip-box')
	        .style('fill-opacity', 0.8)
	        .attr('x', function(d) { return (d.target.y + rectNode.width - d.source.y) / 2 + d.source.y; })
	        .attr('y', function(d) { return (d.target.x - d.source.x) / 2 + d.source.x; })
	        .attr('width', tooltip.width)
	        .attr('height', tooltip.height)
	        .on('mouseover', function(d) {
	            $('#tooltipLinkID' + d.target.id).css('visibility', 'visible');
	            $('#tooltipLinkTextID' + d.target.id).css('visibility', 'visible');
	            // After selected a link, the cursor can be hover the tooltip, that's why we still need to highlight the link and the arrow
	            $('#linkID' + d.target.id).attr('class', 'linkselected');
	            $('#linkID' + d.target.id).attr('marker-end', 'url(#end-arrow-selected)');
	            $('#linkID' + d.target.id).attr('marker-start', linkMarkerStart(d.target.link.direction, true));

	            removeMouseEvents();
	        })
	        .on('mouseout', function(d) {
	            $('#tooltipLinkID' + d.target.id).css('visibility', 'hidden');
	            $('#tooltipLinkTextID' + d.target.id).css('visibility', 'hidden');
	            $('#linkID' + d.target.id).attr('class', 'link');
	            $('#linkID' + d.target.id).attr('marker-end', 'url(#end-arrow)');
	            $('#linkID' + d.target.id).attr('marker-start', linkMarkerStart(d.target.link.direction, false));

	            reactivateMouseEvents();
	        });
	        */


	        // Transition links to their new position.
	        var linkUpdate = link.transition().duration(duration)
	            .attr('d', function (d) {
	                return diagonal(d);
	            });
	        linkTooltip.transition().duration(duration)
	            .attr('d', function (d) {
	                return diagonal(d);
	            });

	        // Transition exiting nodes to the parent's new position.
	        link.exit().transition().remove();

	        linkTooltip.exit().transition().remove();

	        // Stash the old positions for transition.
	        nodes.forEach(function (d) {
	            d.x0 = d.x;
	            d.y0 = d.y;
	        });
	    }

	    // Zoom functionnality is desactivated (user can use browser Ctrl + mouse wheel shortcut)
	    function zoomAndDrag() {
	        //var scale = d3.event.scale,
	        var scale = 1,
	            translation = d3.event.translate,
	            tbound = -height * scale,
	            bbound = height * scale,
	            lbound = (-width + margin.right) * scale,
	            rbound = (width - margin.left) * scale;
	        // limit translation to thresholds
	        translation = [
	            Math.max(Math.min(translation[0], rbound), lbound),
	            Math.max(Math.min(translation[1], bbound), tbound)
	        ];
	        d3.select('.drawarea')
	            .attr('transform', 'translate(' + translation + ')' +
	                ' scale(' + scale + ')');
	    }

	    // Toggle children on click.
	    function click(d) {
	        if (d.children) {
	            d._children = d.children;
	            d.children = null;
	        } else {
	            d.children = d._children;
	            d._children = null;
	        }
	        update(d);
	    }

	    // Breadth-first traversal of the tree
	    // func function is processed on every node of a same level
	    // return the max level
	    function breadthFirstTraversal(tree, func) {
	        var max = 0;
	        if (tree && tree.length > 0) {
	            var currentDepth = tree[0].depth;
	            var fifo = [];
	            var currentLevel = [];

	            fifo.push(tree[0]);
	            while (fifo.length > 0) {
	                var node = fifo.shift();
	                if (node.depth > currentDepth) {
	                    func(currentLevel);
	                    currentDepth++;
	                    max = Math.max(max, currentLevel.length);
	                    currentLevel = [];
	                }
	                currentLevel.push(node);
	                if (node.children) {
	                    for (var j = 0; j < node.children.length; j++) {
	                        fifo.push(node.children[j]);
	                    }
	                }
	            }
	            func(currentLevel);
	            return Math.max(max, currentLevel.length);
	        }
	        return 0;
	    }

	    // x = ordoninates and y = abscissas
	    function collision(siblings) {
	        var minPadding = 5;
	        if (siblings) {
	            for (var i = 0; i < siblings.length - 1; i++) {
	                if (siblings[i + 1].x - (siblings[i].x + rectNode.height) < minPadding)
	                    siblings[i + 1].x = siblings[i].x + rectNode.height + minPadding;
	            }
	        }
	    }

	    function removeMouseEvents() {
	        // Drag and zoom behaviors are temporarily disabled, so tooltip text can be selected
	        mousedown = d3.select('#tree-container').select('svg').on('mousedown.zoom');
	        d3.select('#tree-container').select('svg').on("mousedown.zoom", null);
	    }

	    function reactivateMouseEvents() {
	        // Reactivate the drag and zoom behaviors
	        d3.select('#tree-container').select('svg').on('mousedown.zoom', mousedown);
	    }

	    // Name of the event depends of the browser
	    function getMouseWheelEvent() {
	        if (d3.select('#tree-container').select('svg').on('wheel.zoom')) {
	            mouseWheelName = 'wheel.zoom';
	            return d3.select('#tree-container').select('svg').on('wheel.zoom');
	        }
	        if (d3.select('#tree-container').select('svg').on('mousewheel.zoom') != null) {
	            mouseWheelName = 'mousewheel.zoom';
	            return d3.select('#tree-container').select('svg').on('mousewheel.zoom');
	        }
	        if (d3.select('#tree-container').select('svg').on('DOMMouseScroll.zoom')) {
	            mouseWheelName = 'DOMMouseScroll.zoom';
	            return d3.select('#tree-container').select('svg').on('DOMMouseScroll.zoom');
	        }
	    }

	    function diagonal(d) {
	        var p0 = {
	                x: d.source.x + rectNode.height / 2,
	                y: (d.source.y + rectNode.width)
	            },
	            p3 = {
	                x: d.target.x + rectNode.height / 2,
	                y: d.target.y - 12 // -12, so the end arrows are just before the rect node
	            },
	            m = (p0.y + p3.y) / 2,
	            p = [p0, {
	                x: p0.x,
	                y: m
	            }, {
	                x: p3.x,
	                y: m
	            }, p3];
	        p = p.map(function (d) {
	            return [d.y, d.x];
	        });
	        return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
	    }

	    function initDropShadow() {
	        var filter = defs.append("filter")
	            .attr("id", "drop-shadow")
	            .attr("color-interpolation-filters", "sRGB");

	        filter.append("feOffset")
	            .attr("result", "offOut")
	            .attr("in", "SourceGraphic")
	            .attr("dx", 0)
	            .attr("dy", 0);

	        filter.append("feGaussianBlur")
	            .attr("stdDeviation", 2);

	        filter.append("feOffset")
	            .attr("dx", 2)
	            .attr("dy", 2)
	            .attr("result", "shadow");

	        filter.append("feComposite")
	            .attr("in", 'offOut')
	            .attr("in2", 'shadow')
	            .attr("operator", "over");
	    }

	    function initArrowDef() {
	        // Build the arrows definitions
	        // End arrow
	        defs.append('marker')
	            .attr('id', 'end-arrow')
	            .attr('viewBox', '0 -5 10 10')
	            .attr('refX', 0)
	            .attr('refY', 0)
	            .attr('markerWidth', 6)
	            .attr('markerHeight', 6)
	            .attr('orient', 'auto')
	            .attr('class', 'arrow')
	            .append('path')
	            .attr('d', 'M0,-5L10,0L0,5');

	        // End arrow selected
	        defs.append('marker')
	            .attr('id', 'end-arrow-selected')
	            .attr('viewBox', '0 -5 10 10')
	            .attr('refX', 0)
	            .attr('refY', 0)
	            .attr('markerWidth', 6)
	            .attr('markerHeight', 6)
	            .attr('orient', 'auto')
	            .attr('class', 'arrowselected')
	            .append('path')
	            .attr('d', 'M0,-5L10,0L0,5');

	        // Start arrow
	        defs.append('marker')
	            .attr('id', 'start-arrow')
	            .attr('viewBox', '0 -5 10 10')
	            .attr('refX', 0)
	            .attr('refY', 0)
	            .attr('markerWidth', 6)
	            .attr('markerHeight', 6)
	            .attr('orient', 'auto')
	            .attr('class', 'arrow')
	            .append('path')
	            .attr('d', 'M10,-5L0,0L10,5');

	        // Start arrow selected
	        defs.append('marker')
	            .attr('id', 'start-arrow-selected')
	            .attr('viewBox', '0 -5 10 10')
	            .attr('refX', 0)
	            .attr('refY', 0)
	            .attr('markerWidth', 6)
	            .attr('markerHeight', 6)
	            .attr('orient', 'auto')
	            .attr('class', 'arrowselected')
	            .append('path')
	            .attr('d', 'M10,-5L0,0L10,5');
	    }
	}



	///	ARRESTS
	///
	//
	//
	//
	function capitalize_word(string) {
	    return string[0].toUpperCase() + string.slice(1);
	}


	function make_header(node, field_name) {
	    var result = "";
	    if (node[field_name]) {
	        result = '<b>' + node[field_name] + '</b><br><br>'
	    }
	    return result;
	}

	function make_field(node, field_name) {
	    var result = "";
	    var field_value = node[field_name];
	    if (node[field_name]) {
	        field_name = field_name.replace("_", " ");
	        field_name = field_name.replace("number", "#");
	        field_name = capitalize_word(field_name);
	        result = '<b>' + field_name + ':</b> ' + field_value + '<br>'
	    }
	    return result;
	}

	function make_label(node, field_name) {
	    var result = "";
	    if (node[field_name]) {
	        result = node[field_name] + '<br>'
	    }
	    return result;
	}

	function make_content(node) {
	    if (node.type == "person" || node.type == "fugitive") {
	        var template_HTML = box_template.innerHTML;
	        var content = template_HTML.replace(/\{(\w+)\}/g,
	            function (_, k) {
	                return node[k];
	            });
	        return content;
	    }


	    // BOX
	    var box_start = '<div class="box">'
	    //		var box_start = '<div class="box" style="width: '+rectNode.width + 'px; height: '+rectNode.height + 'px;" class="node-text wordwrap">';
	    //		(rectNode.width - rectNode.textMargin * 2) + 'px; height: '+
	    //			(rectNode.height - rectNode.textMargin * 2) + 'px;" class="node-text wordwrap">';


	    var box_end = '</div>';
	    // FUGITIVE 
	    if (node.type == "fugitive") {
	        box_content =
	            make_header(node, "name") +
	            make_field(node, "case_number");
	    } else if (node.type == "location") {
	        box_content =
	            make_header(node, "name") +
	            make_label(node, "address");
	    } else if (node.type == "person") {
	        box_content =
	            make_header(node, "name") +
	            '<i class="fa fa-female">&nbsp;</i><br>';
	    } else if (node.type == "field_interview") {
	        box_content =
	            make_header(node, "name");
	    } else if (node.type == "rap_sheet") {
	        box_content =
	            make_header(node, "name");
	    } else if (node.type == "Caution_Info") {
	        box_content =
	            make_label(node, "name");
	    } else if (node.type == "vehicle") {
	        box_content =
	            make_header(node, "name") +
	            make_field(node, "year") +
	            make_field(node, "VIN");
	    } else {
	        box_content =
	            make_header(node, "name");
	    }
	    return box_start + box_content + box_end;
	}

	function createCard(user) {
	    return content;
	}


	var colorByNodeType = {
	    "field_interview": grey,
	    "rap_sheet": Red_Orchid,
	    "Caution_Info": Red_Orchid,
	    "location": Blue_Hippie,
	    "person": transparent,
	    "alias": Green_Gable_2,
	    "vehicle": Green_Acapulco
	};