var svg = d3.select("svg"),
width = 400
height = 400
color = d3.scaleOrdinal(d3.schemeCategory10);

var a = {id: "a"},
b = {id: "b"},
c = {id: "c"},
nodes = [a, b, c],
l_ab = {source: a, target: b}
l_bc = {source: b, target: c},
l_ca = {source: c, target: a}
links = [l_ab, l_bc, l_ca];

var id = 0;

var simulation = d3.forceSimulation(nodes)
.force('charge', d3.forceManyBody())
.force('link', d3.forceLink())
.force('center', d3.forceCenter(width/2, height/2))
.on("tick", ticked);

var g = svg.append("g")
link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

restart();

function restart() {

// Apply the general update pattern to the nodes.
node = node.data(nodes, function(d) { return d.id;});

node.exit().transition()
  .attr("r", 0)
  .remove();

node = node.enter().append("circle")
  .attr("fill", function(d) { return color(d.id); })
  .call(function(node) { node.transition().attr("r", 8); })
.merge(node);

// Apply the general update pattern to the links.
link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });

// Keep the exiting links connected to the moving remaining nodes.
link.exit().transition()
  .attr("stroke-opacity", 0)
  .attrTween("x1", function(d) { return function() { return d.source.x; }; })
  .attrTween("x2", function(d) { return function() { return d.target.x; }; })
  .attrTween("y1", function(d) { return function() { return d.source.y; }; })
  .attrTween("y2", function(d) { return function() { return d.target.y; }; })
  .remove();

link = link.enter().append("line")
  .call(function(link) { link.transition().attr("stroke-opacity", 1); })
.merge(link);

// Update and restart the simulation.
simulation.nodes(nodes);
simulation.force("link").links(links);
simulation.alpha(1).restart();
}

function ticked() {
node.attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })

link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });
}

