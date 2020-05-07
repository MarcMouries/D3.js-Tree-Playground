/**
 *  
 * 
 */
var mm_d3Toolkit = {


  link_diagonal: function (d) {
    return "M" + d.source.y + "," + d.source.x +
      "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x +
      " " + (d.source.y + d.target.y) / 2 + "," + d.target.x +
      " " + d.target.y + "," + d.target.x;
  },


  calcLeft: function (d) {
    var l = d.y;
    if (d.position === 'left') {
      l = (d.y) - w / 2;
      l = (w / 2) + l;
    }
    return {
      x: d.x,
      y: l
    };
  },


  link_elbow: function (d, i) {
    var source = mm_d3Toolkit.calcLeft(d.source);
    var target = mm_d3Toolkit.calcLeft(d.target);
    var hy = (target.y - source.y) / 2;
    return "M" + source.y + "," + source.x +
      "H" + (source.y + hy) +
      "V" + target.x + "H" + target.y;
  }



}