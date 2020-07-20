function Node(name) {
  this.name = name;
  this.parent = null;
  this.children = [];
  this.x = 0;
  this.y = 0;

  Node.prototype.level = function () {
    if (this.parent == null) {
      return 0;
    }
    return this.parent.level() + 1;
  };
}





function Graph() {
  this.nodes = [];
  this.edges = [];
  this.orbit_radius = 30;
  this.node_radius = 10;


  Graph.prototype.setRootNode = function (node) {
    this.nodes[0] = node;

  }

  Graph.prototype.addNode = function (newNode, parentNodeName) {
    // console.log("addNode '" + newNode.name + "' to parent " + parentNodeName);
    var parentNode = this.findNode(this.nodes[0], parentNodeName);


    if (parentNode == null) {
      // console.log("   NOT FOUND '" + parentNodeName + "'");
    }


    if (parentNode) {
      parentNode.children.push(newNode);
      newNode.parent = parentNode;
      //setCoordinates(this.nodes[0]);
      setCoordinates(parentNode);
    }
  }

  Graph.prototype.getNode = function (i) {
    return this.nodes[i];
  }


  Graph.prototype.findNode = function (node, nodeName) {
    if (node.name == nodeName) {
      return node;
    } else if (node.children && node.children.length) {
      var num_children = node.children.length;
      for (var i = 0; i < num_children; i++) {
        var foundNode = this.findNode(node.children[i], nodeName);
        return foundNode;
      }
    }
    return null;
  }

  Graph.prototype.visit = function (node, callback) {
    if (!node) {
      console.log("no node");
    }
    //
    if (!node.children) {
      console.log("  node " + child_node.name + "no children");
    }

    if (node) {
      console.log(" calling func with node =" + node.name);
      callback(node);
    }


    if (node.children) {

      var num_children = node.children.length;
      for (var i = 0; i < num_children; i++) {
        var child_node = node.children[i];
        this.visit(child_node);
      }
      //
    }

  }

  Graph.prototype.draw = function (node, renderer) {
    renderer.drawCircle(node.x, node.y, node_radius, "lightgrey");
    renderer.drawTextInsideCircle(node.name, node.x, node.y);

    var num_children = node.children.length;
    for (var i = 0; i < num_children; i++) {
      var child_node = node.children[i];
      this.draw(child_node, renderer);
    }
  }



  function setCoordinates(node) {
    console.log("setCoordinates - " + node.name + ". radius =" + node.radius)
    var centerX = node.x;
    var centerY = node.y;
    var num_children = node.children.length;

    var radius = orbit_radius / (node.level() + 1);
    node.radius = radius;


    var start = Math.PI;
    var total = num_children;
    var end = Math.PI / (total);

    // split the circle by the number of nodes
    for (var i = 0; i < num_children; i++) {

      //NEW 

      //* (180 / Math.PI);

      start += Math.PI / 2 / (total / 2);
      //end += Math.PI * 0.4; /// (total /2);
      var x1 = centerX - radius * Math.sin(start);
      var y1 = centerY - radius * Math.cos(start);

      //NEW
      var child_node = node.children[i];

      var angle = (i / (num_children / 2)) * (Math.PI / 2) // Calculate the angle at which the element will be placed.
      // For a semicircle, we would use (i / numNodes) * Math.PI.
      var x = centerX - (radius * Math.cos(angle)); // Calculate the x position of the element.
      var y = centerY - (radius * Math.sin(angle)); // Calculate the y position of the element.
      child_node.x = x1;
      child_node.y = y1;

      console.log("  node " + child_node.name +
        " Level =" + node.level() +
        " x=" + x +
        " y=" + y +
        " x1=" + x1 +
        " y1=" + y1 +
        " radius=" + radius +
        " parent (x=" + centerX + ", y=" + centerY + ")" +
        " angle=" + angle);

      setCoordinates(child_node);
    }
  }
}