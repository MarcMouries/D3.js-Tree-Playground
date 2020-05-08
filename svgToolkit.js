/**
 * SVG Helper functions
 */

var svgToolkit = {

    attr: function(elem, attr){
          var prop;
      
          for (prop in attr){
              if (attr.hasOwnProperty(prop)){
                  elem.setAttribute(prop, attr[prop]);
              }
          }
          return elem;
      },
  
  // Create an SVG namespaced element
  createElement: function(name){
          return document.createElementNS("http://www.w3.org/2000/svg", name);
      },
  
  
  // CREATED : <feGaussianBlur stdDeviation="5"></feGaussianBlur>
  // NEED    : <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur"></feGaussianBlur>
  
  // Create an SVG filter element and append a filter primitive, e.g. feGaussianBlur
  createFilter: function(filterPrimitiveName, filterId, attr){
          var filter = this.createElement("filter"),
              filterPrimitive = this.createElement(filterPrimitiveName); // e.g. "feGaussianBlur"
          
          if (filterId){
              filter.id = filterId; // e.g. "svgFilterBlur"
          }
  
          if (attr){
              this.attr(filterPrimitive, attr); // e.g. {stdDeviation: 3}
          }
          
          filter.appendChild(filterPrimitive);
          
          return filter;
      },
  
  // Apply a filter id to a element
  applyFilter: function(elem, filterId){
          elem.style.filter = "url(#" + filterId + ")";
          return elem;
      },
  };