




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

  var colorByNodeType = {
    "field_interview": grey,
    "rap_sheet": Red_Orchid,
    "Caution_Info": Red_Orchid,
    "location": Blue_Hippie,
    "person": transparent,
    "alias": Green_Gable_4,
    "fugitive": Green_Gable_2,
    "vehicle": Green_Acapulco
  };

  function treeBoxes(container, jsonData) {

    // DIMENSIONS
    var rectNode = {
      width: 180,
      height: 90,
      textMargin: 8
    };

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };


  

var clientWidth = document.body.clientWidth;
var clientHeight = document.body.clientHeight;
var width = clientWidth - margin.right - margin.left;
var height = clientHeight - margin.top - margin.bottom;

height = 900;



var svg = d3.select(container).append('svg');
svg
  .attr("width", width)
  .attr("height", height);
var draggable_group = svg.append("g");
svg.call(d3.zoom().on('zoom', function () {
  draggable_group.attr('transform', d3.event.transform);
}));



var i = 0,
  duration = 750,
  hierarchy;

var json_tree_data;

console.log("before...");

d3.json("./tree_box_v5.json")
  .then(function (json) {
    console.log("loading...");

    json_tree_data = json;
    console.log("loading...DONE");

    // Assigns parent, children, height, depth
    hierarchy = d3.hierarchy(json_tree_data, function (d) {
      return d.children;
    });
    hierarchy.x0 = height / 2;
    hierarchy.y0 = 0;
    console.log(hierarchy);
    update(hierarchy);
  })
  /*
  .catch(function (error) {
    // Do some error handling.
    console.log("Error loading JSON: " + error);

  })*/;


// Collapse after the second level
//hierarchy.children.forEach(collapse);



// Collapse the node and all it's children
function collapse(d) {
  if (d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

// declares a tree layout and assigns the size
var tree = d3.tree().size([height, width]);

  // Assigns the x and y position for the nodes
  var treeData = tree(hierarchy);

  // Compute the new tree layout.
  var nodes = treeData.descendants();
  var links = treeData.descendants().slice(1);

          // Check if two nodes are in collision on the ordinates axe and move them
  breadthFirstTraversal(nodes, collision);
  
      // Normalize for fixed-depth - distance
      nodes.forEach(function(d) {
          d.y = d.depth * (rectNode.width * 1.5);
      });

      // Dynamically set the height of the main svg container
      // breadthFirstTraversal returns the max number of node on a same level
      // and colors the nodes
      var maxDepth = 0;
  
      var maxTreeWidth = breadthFirstTraversal(nodes, function(currentLevel) {
          maxDepth++;
          currentLevel.forEach(function(node) {
              //node.color = colorByNodeType[node.data.type];
          })
      });


      height = maxTreeWidth * (rectNode.height + 20) + 20 - margin.right - margin.left;
      width = maxDepth * (rectNode.width * 1.5)  - margin.top - margin.bottom;
  
      tree = d3.tree().size([ height, width ]);


  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = draggable_group.selectAll('g.node')
    .data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  //**************************************
  // Node Content
  //**************************************

  nodeEnter.filter(function (d) {
      return (d.data.type);
    }).append('rect')
    .attr('class', 'node-rect')
    .attr('width', rectNode.width)
    .attr('height', rectNode.height)
    .attr('rx', 6)
    .attr('ry', 6)
    .attr('fill', function (d) {
      //console.log(d);
      return colorByNodeType[d.data.type];
    });

    /*
  // Add labels for the nodes
  nodeEnter.append('text')
    .attr("dy", "2em")
    .attr("x", function (d) {
      return d.children || d._children ? 13 : 13;
    })
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "start" : "start";
    })
    .text(function (d) {
      return d.data.name;
    });
*/
nodeEnter.append('foreignObject')
      //.attr('x', rectNode.textMargin)
      //.attr('y', rectNode.textMargin)
      .attr('width', function() {
              return rectNode.width;
          /*		return (rectNode.width - rectNode.textMargin * 2) < 0 ? 0
                          : (rectNode.width - rectNode.textMargin * 2)*/
              })
      .attr('height', function() {
                          return rectNode.height;
              /*	return (rectNode.height - rectNode.textMargin * 2) < 0 ? 0
                          : (rectNode.height - rectNode.textMargin * 2)
                          */
              })
      .append('xhtml').html(function(node) {
              return make_content(node);
      });



  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = draggable_group.selectAll('g.link')
    .data(links, function (d) {
      return d.id;
    });





  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('g', 'g')
    .attr("class", "link");

    /* ORIGINAL */

    
  linkEnter.append('path')
    .attr('d', function (d) {
      return diagonal(d, rectNode.width);
    });
    

/*
   linkEnter.append('path')
          //.attr('class', 'link')
      //	.attr('id', function(d) { return 'linkID' + d.target.id; })
          .attr('d', function(d) { return diagonal(d); })
   // .attr('marker-end', 'url(#end-arrow)')
    ;		
*/


  linkEnter.append('text')
    .attr("text-anchor", "middle")
    .text(function (d, i) {
      return d.data.link_type;
    })
/*
  .attr('dy', "-1em")
  .attr("transform", function(d) {
      return "translate(" +
          ((d.y + d.parent.y)/2) + "," + 
          ((d.x + d.parent.x)/2) + ")"
  })         
*/
  ;


  // UPDATE

  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.select('path').transition()
    .duration(duration)
    .attr('d', function (d) {
      //return diagonal(d, d.parent)
      return diagonal(d, rectNode.width);

    });

  linkUpdate.select('text').transition()
    .duration(duration)
    .attr('transform', function (d) {
      if (d.parent) {
        //return 'translate(' + ((d.parent.y + d.y) / 2) + ',' + ((d.parent.x + d.x) / 2) + ')'
/*          return "translate(" + 
          (d.y - ( rectNode.width/2) +10) + "," +  //80 
          (d.x + ( rectNode.height/2) - 10) + ")"  // 40
*/
          var mid_x = (d.x + d.parent.x) / 2;
          var mid_y = (d.y + d.parent.y) / 2;

          mid_x += ( rectNode.height/2) // horizontal
          mid_y += ( rectNode.width/2)
          return "translate(" +
                  (mid_y) + "," +
                  (mid_x) + ")";
      }
    })



  // Remove any exiting links
  link.exit().each(function (d) {
    d.parent.index = 0;
  })

  var linkExit = link.exit()
    .transition()
    .duration(duration);

  linkExit.select('path')
    .attr('d', function (d) {
      var o = {
        x: source.x,
        y: source.y
      }
      //return diagonal(o, o) OLD OLD
//        return diagonal(d)
      return diagonal(d, rectNode.width);

    })

  linkExit.select('text')
    .style('opacity', 0);

  linkExit.remove();

  // Store the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });



  // Breadth-first traversal of the tree
  // func function is processed on every node of a same level
  // return the max level
function breadthFirstTraversal(tree, func)
    {
        var max = 0;
        if (tree && tree.length > 0)
        {
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
        for (var i = 0; i < siblings.length - 1; i++)
        {
            if (siblings[i + 1].x - (siblings[i].x + rectNode.height) < minPadding)
                siblings[i + 1].x = siblings[i].x + rectNode.height + minPadding;
        }
    }
  }

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal__CURVEDs(s, d) {
    path = 
    `M ${s.y} ${s.x}
     C ${(s.y + d.y) / 2} ${s.x},
       ${(s.y + d.y) / 2} ${d.x},
       ${d.y} ${d.x}`
    return path
  }

  function diagonal_from_Netowrk(d, node_width) {
var orig_x = d.x; // + NODE.height / 2;
var orig_y = d.y - (node_width / 2);


var dest_x = d.parent.x;
var dest_y = d.parent.y + (node_width / 2);


var path = `M ${orig_y} ${orig_x}
          C ${(orig_y + dest_y) / 2} ${orig_x},
            ${(orig_y + dest_y) / 2} ${dest_x},
            ${dest_y} ${dest_x}`;

return path;
}
  
  function diagonal(d, node_width) {
      var p0 = {
          x : d.x + rectNode.height / 2,
          y : (d.y + rectNode.width)
      }, p3 = {
          x : d.parent.x + rectNode.height / 2,
          y : d.parent.y  - 0 // -12, so the end arrows are just before the rect node
      }, m = (p0.y + p3.y) / 2, p = [ p0, {
          x : p0.x,
          y : m
      }, {
          x : p3.x,
          y : m
      }, p3 ];
      p = p.map(function(d) {
          return [ d.y, d.x ];
      });
      return 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3];
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


  function capitalize_word(string) { 
       return string[0].toUpperCase() + string.slice(1); 
      } 
  
  
              function make_header(node, field_name) {
              var result = "";
              if (node.data[field_name]) {
                  result = 	'<b>'+  node.data[field_name] + '</b><br><br>'
              }
              return result;
          }
      
          function make_field(node, field_name) {
              var result = "";
              var field_value = node.data[field_name];
              if (node.data[field_name]) {
                  field_name = field_name.replace("_", " ");
                  field_name = field_name.replace("number", "#");
                  field_name = capitalize_word(field_name);
                  result = '<b>'+ field_name + ':</b> ' + field_value + '<br>'
              }
              return result;
          }
          function make_label(node, field_name) {
              var result = "";
              if (node.data[field_name]) {
                  result = 	node.data[field_name] + '<br>'
              }
              return result;
          }

      function make_content(node) {
          if (node.data.type == "person" || node.data.type == "fugitive") {
              var template_HTML = box_template.innerHTML;
      var content = template_HTML.replace(/\{(\w+)\}/g, 
                          function(_,k){
                              return node.data[k];
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
          if (node.data.type == "fugitive") {
              box_content =
                  make_header(node, "name") + 
                  make_field(node, "case_number");
          }
          else if (node.data.type == "location") {
              box_content =
                  make_header(node, "name") +
                  make_label(node, "address");
          }
          else if (node.data.type == "person") {
              box_content =
                  make_header(node, "name") +
                  '<i class="fa fa-female">&nbsp;</i><br>';
          }
          else if (node.data.type == "field_interview") {
              box_content =
                  make_header(node, "name");
          }			
          else if (node.data.type == "rap_sheet") {
              box_content =
                  make_header(node, "name");
          }		
                      else if (node.data.type == "Caution_Info") {
              box_content =
                  make_label(node, "name");
                      }
          
          else if (node.data.type == "vehicle") {
              box_content =
                  make_header(node, "name") +
                  make_field(node, "year") +
                  make_field(node, "VIN");
          }		
          else {
              box_content =
                  make_header(node, "name");
          }
          return box_start + box_content + box_end;
      }
    }
}
