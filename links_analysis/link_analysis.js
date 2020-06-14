class LinkAnalysis {
  constructor() {
    console.log("LinkAnalysis: Loading");

    var defaultWidth = 400,
      defaultHeight = 250;

    this.DEFAULT_MARGIN = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120
    };
    this.DEFAULT_NODE = {
      width: 100,
      height: 60,
      textMargin: 8
    };
  }

  attach_to(element) {
    this.svg_container = element;
    return this;
  }

  draw() {


    var object_viewer = document.getElementById("ObjectViewer");

    class ObjectViewer {
      constructor() {

        this.container = document.getElementById("ObjectViewer");
        var table_html = '<table width="320" border="1"><tr><td colspan="2" rowspan="1">' + " wdw" +
          '</td></tr><tr><td width="118">' + "sxs" + '</td><td width="186">' + "xs" + '</td></tr></table>';
        var tableDiv = document.createElement("table");
        tableDiv.innerHTML = table_html;
        this.container.append(tableDiv);
      }
    }
    ObjectViewer = new ObjectViewer();


    // Hide Object Viewer
    function hideObjectViewer() {
      svg_container.style.marginRight = "0px";
      object_viewer.style.right = "-350px";
      object_viewer.style.display = "none";
    }

    // Show Object Viewer
    function showObjectViewer() {
      svg_container.style.marginRight = "350px";
      object_viewer.style.right = "0px";
      object_viewer.style.display = "block";
    }

    hideObjectViewer();

    //initilize svg or grab svg
    var compStyles = window.getComputedStyle(svg_container);

    var clientWidth = svg_container.clientWidth;
    var clientHeight = svg_container.clientHeight;


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




    var person = {
      name: "Eric Fox",
      type: "person",
      photo: "https://randomuser.me/api/portraits/men/22.jpg"
    };

    var family_records = {
      name: "Family",
      parent: "Eric Fox",
      children: [{
          name: "Cindy Fox",
          type: "person",
          relationship: "Daughter"
        },
        {
          name: "Edward Fox",
          type: "person",
          relationship: "Son",
          "photo": "https://image.flaticon.com/icons/svg/1149/1149408.svg"
        },
        {
          name: "Lisa Fox",
          type: "person",
          relationship: "Spouse"
        },
      ]
    };



    var friends_records = {
      name: "Friends",
      parent: "Eric Fox",
      children: [{
          name: "friend_1",
          "type": "",
          "photo": "https://image.flaticon.com/icons/svg/186/186341.svg"
        },
        {
          name: "friend_2",
          "type": "",
          "photo": "https://image.flaticon.com/icons/svg/1149/1149408.svg"
        },
        {
          name: "friend_3",
          "type": "",
          "photo": "https://image.flaticon.com/icons/svg/190/190640.svg"
        },
        {
          name: "friend_4",
          "type": "",
          "photo": "https://image.flaticon.com/icons/svg/924/924874.svg"
        }
      ]
    };

    //----------------------------
    // INIT DATA
    //----------------------------
    var graph_data = {
      nodes: [],
      links: []
    };






    var ROOT_NODE_NAME = "Eric Fox";

    graph_data.nodes.push(person);
    var case_record = {
      name: "case 1234",
      "type": "case"
    };
    addNodeAndCreateLink(case_record, ROOT_NODE_NAME, graph_data);
    addNodesAndLinks(family_records, graph_data);
    addNodesAndLinks(friends_records, graph_data);
    console.log(graph_data);


    var graph_nodes_count = graph_data.nodes.length;




    //custom force to put stuff in a box 
    function box_force(alpha) {
      for (var i = 0; i < graph_nodes_count; ++i) {
        var curr_node = graph_data.nodes[i];
        curr_node.x = Math.max(radius, Math.min(width - radius, curr_node.x));
        curr_node.y = Math.max(radius, Math.min(height - radius, curr_node.y));
      }
    }



    var repelForce = d3.forceManyBody().strength(-3000).distanceMax(450).distanceMin(85);
    var collide_force = d3.forceCollide(function (d) {
      return d.name === ROOT_NODE_NAME ? 150 : 50
    });
    var linkForce = d3.forceLink(graph_data.links);
    linkForce.distance(getDistance).strength(2);
    linkForce.id(getNodeID);
    var charge_force = d3.forceManyBody().strength(-100);
    var center_force = d3.forceCenter(width / 2, height / 2);


    var simulation = d3.forceSimulation(graph_data.nodes)
      .force("linkForce", linkForce)
      .force("charge", charge_force)
      .force("center", center_force)
      .force("box_force", box_force)

      .force("repelForce", repelForce)
      .force('collide', collide_force)
      // .force("xAxis", d3.forceX(width / 2).strength(0.4))
      // .force("yAxis", d3.forceY(height / 2).strength(0.6))
      .on("tick", ticked);

    /* Nodes are identified by their name
     */
    function getNodeID(d) {
      return d.name;
    }

    function getDistance(d) {
      return 30; //d.distance+30;
    }

    var links = svg
      .selectAll("links")
      .data(graph_data.links)
      .enter()
      .append("line")
      .classed("line", true);



    /*
        .filter(function (d) {
           return d.type === "person";
          })
    */
    var radius = 16;
    var circleColour = "black"

    var nodeGroup = svg
      .selectAll("g")
      .data(graph_data.nodes)
      .enter()
      .append("g")
      .on("click", handle_node_click)
      .on("mouseover", handle_node_mouseover);



    var drag_handler = d3.drag()
      .on("start", drag_start)
      .on("drag", drag_drag)
      .on("end", drag_end);

    drag_handler(nodeGroup)


    var
      grey_Level_One = "#272727",
      grey_Level_Two = "#565656",
      grey_Level_Thr = "#868686",
      grey_Level_Fou = "#b6b6b6";

    var node_radius = 10;
    var image_width = 35;
    var image_height = image_width;
    var node_width = image_width;
    var node_height = image_width;


    var circles = nodeGroup
      .append("circle")
      .attr("r", node_radius)
      .attr("fill", "#eeeeee");


    // Append images
    var images = nodeGroup.append("image")
      .attr("xlink:href", function (d) {

        if (d.photo) {
          return d.photo;
        }
        if (d.type == "person")   { return d.photo;       }
        if (d.type == "case")     { return icon_case_base64;        }
        if (d.type == "arrest")   { return icon_arrest_base64;        }
        if (d.type == "vehicle")  { return icon_vehicle_base64;        }
      })
      .attr("x", function (d) {
        return -(image_height / 2);
      })
      .attr("y", function (d) {
        return -(image_width / 2);
      })
      .attr("height", image_height)
      .attr("width", image_width);


    var nodeLabel = nodeGroup
      .append("text")
      // .attr("x", function(d) {       return (image_height / 2);    })
      .attr("y", function (d) {
        return (image_height / 2) + 10;
      })
      .attr("text-anchor", "middle")
      .classed("nodeLabel", true)
      .text(function (d) {
        return d.name;
      });




    function ticked() {

      nodeGroup.attr("transform", function (d) {
        return "translate(" + d.x + ", " + d.y + ")";
      });

      // nodeLabel.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
      //     .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

      links
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
    }

    var object_currently_selected;

    function handle_node_click(d) {
      console.log(" ------- handle_node_click --------- ");
      console.log("current selection = ", object_currently_selected);
      console.log("object clicked    = ", d);

      if (d != object_currently_selected) {
        showObjectViewer();
        object_currently_selected = d;
      } else {
        hideObjectViewer();
        object_currently_selected = null;
      }

    }

    function handle_node_mouseover(d) {
      console.log("You mouseover", d);
    }



    function drag_start(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }


    //make sure you can't drag the circle outside the box
    function drag_drag(d) {
      //TODO: ideally we would calculate the bounding box of the node
      d.fx = Math.max(node_width, Math.min(width - node_width, d3.event.x));
      d.fy = Math.max(node_height, Math.min(height - node_height, d3.event.y));
    }




    function drag_end(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }


    function addNodeAndCreateLink(node, target_name, graph_data) {
      var source_name = node.name;
      var link = {
        source: source_name,
        target: target_name
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
        type: "category"
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

  }

}