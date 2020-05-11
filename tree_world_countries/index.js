// imports 
import {
    select,
    json,
    tree,
    hierarchy,
    linkHorizontal,
    zoom,
    event
  } from 'd3';
  
  const svg = select('svg');
  //writes the height and width
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  
  //creates the margin
  const margin = { top: 0, right: 50, bottom: 0, left: 75};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  // applies layout
  const treeLayout = tree().size([innerHeight, innerWidth]);
  // defines zoomG
  const zoomG = svg
      .attr('width', width)
      .attr('height', height)
    .append('g');
  
  // defines g
  const g = zoomG.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // directs zoom to zoom in
  svg.call(zoom().on('zoom', () => {
    zoomG.attr('transform', event.transform);
  }));
  
  // defines root, links, and linkPathGenerator and assignes them values
  json('data.json')
    .then(data => {
      const root = hierarchy(data);
      const links = treeLayout(root).links();
      const linkPathGenerator = linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);
    
    // links the lines to the nodes 
        g.selectAll('path')
        .data(links)
        .enter().append('path')
          .attr('d', linkPathGenerator);
    
    // Adds the text to the lines and adjusts them
        g.selectAll('text').data(root.descendants())
        .enter().append('text')
          .attr('x', d => d.y)
          .attr('y', d => d.x)
          .attr('dy', '0.32em')
          .attr('text-anchor', d => d.children ? 'middle' : 'start')
          .attr('font-size', d => 3.25 - d.depth + 'em')
          .text(d => d.data.id);
    });