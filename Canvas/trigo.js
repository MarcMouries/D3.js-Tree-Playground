
// =============================================================
//                          TRIGO FUNCTIONS
// =============================================================

//var trigo = {


function getPointOnArc(cx, cy, r, deg) {
    return {
      x: cx + r * Math.cos(deg),
      y: cy + r * Math.sin(deg)
    };
  }
  function to_radians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function to_degrees(radians) {
    return radians * (180 / Math.PI);
  }

  function distanceXY(x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pointInCircle(point, circle) {
    return distanceXY(point.x, point.y, circle.x, circle.y) < circle.radius;
  }

  function pointInCircle(px, py, circle) {
    return distanceXY(px, py, circle.x, circle.y) < circle.radius;
  }


// TRIGO FUNCTIONS
function getPointOnArc(point, r, deg) {
    return {
      x: point.x + r * Math.cos(deg),
      y: point.y + r * Math.sin(deg) };
  
  }
  function to_radians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function to_degrees(radians) {
    return radians * (180 / Math.PI);
  }
  
  // returns angle in degrees
  function findAngle(p1, p2) {
    var angleRAD = Math.atan2(p1.x - p2.x, p1.y - p2.y);
    return to_degrees(angleRAD);
  }
  
  
  //bearing between the compass'center point and the specified point
  function __getBearing(point) {
    var compass_points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    var bearing = findAngle(
    { x: this.cx, y: -this.cy },
    { x: point.x, y: -point.y });
  
    if (bearing < 0) var bearingTT = 360 + bearing;else
    var bearingTT = bearing;
  
    var compass_lookup = Math.round(bearingTT / 45);
    log(bearingTT + " " + compass_lookup + " - " + bearing);
    return compass_points[compass_lookup];
  }