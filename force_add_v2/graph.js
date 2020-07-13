var Graph = function(targetElement, graph) {

    var self = this,
    
        width = targetElement.offsetWidth,
    
        height = width / 2,
    
        svg = d3.select(targetElement).append('svg')
            .attr("width", width)
            .attr("height", height),
    
        simulation = d3.forceSimulation()
                       .force("link", d3.forceLink().id(function(d) { return d.id; }))
                       .force("charge", d3.forceManyBody())
                       .force("center", d3.forceCenter(width / 2, height / 2)),
    
        linkGroup = svg.append("g")
                  .attr("class", "links"),
    
        nodeGroup = svg.append("g")
                  .attr("class", "nodes"),
    
        update = function() {
    
            // Redefine and restart simulation
            simulation.nodes(graph.nodes)
                      .on("tick", ticked);
    
            simulation.force("link")
                      .links(graph.links);
    
            // Update links
            link = linkGroup
                .selectAll("line")
                .data(graph.links);
    
            // Enter links
            linkEnter = link
                .enter().append("line");
    
            link = linkEnter
                .merge(link);
    
            // Exit any old links
            link.exit().remove();
    
            // Update the nodes
            node = nodeGroup.selectAll("circle").data(graph.nodes);
    
            // Enter any new nodes
            nodeEnter = node.enter().append("circle")
                       .attr("r", 5)
                       .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
    
            node = nodeEnter.merge(node);
    
            // Exit any old nodes
            node.exit().remove();
    
    
    
            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
    
                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            }
    
    
        },
    
        dragstarted = function(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        },
    
        dragged = function(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        },
    
        dragended = function(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        },
    
        expandGraph = function(links, nodes) {
    
            for (var i=0; i < nodes.length; i++) {
                console.log('adding node', nodes[i]);
                graph.nodes.push(nodes[i]);
            }
    
            for (var i=0; i < links.length; i++) {
                console.log('adding link', links[i]);
                graph.links.push(links[i]);
            }
    
            update();
    
        };
    
        // Public functions
        this.expandGraph = expandGraph;
    
    update();
    
    };