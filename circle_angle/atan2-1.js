// SETUP CANVAS
var canvas = document.getElementById('gamearea'),
ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
 
var state = {
    toPoint: {
        x: canvas.width / 2 + 50,
        y: canvas.height / 2 + 50
    },
    fromPoint: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    a: 0,
    findAngle: function () {
        this.a = Math.atan2(this.toPoint.y - this.fromPoint.y, this.toPoint.x - this.fromPoint.x);
    }
};
 
// a findAngle method that takes 2 arguments and returns and angle in degrees
var findAngle = function (source, destination) {
    const dx = destination.x - source.x;
    const dy = destination.y - source.y;


   // return (Math.atan2(y1 - y2, x1 - x2) + Math.PI) / Math.PI * 180;
   var angleRad = Math.atan2(dy, dx);
   var angleDegrees = angleRad * (180 / Math.PI);

   /* 
   if(angleRad < 0) {
    angleDegrees = angleDegrees + 360;
}
*/
//degree: 180 - angle

   return  180 - angleDegrees;
  };

// UPADTE
var update = function () {
    state.findAngle();
};
 
// DRAW
var drawPoint = function (point, style) {
    style = style || 'red';
    ctx.beginPath();
    ctx.strokeStyle = style;
    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
};
 
var draw = function () {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    drawPoint(state.fromPoint, 'white');
    drawPoint(state.toPoint, 'red');
 
    // draw line from state.fromPoint tp state.toPoint
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(state.fromPoint.x, state.fromPoint.y);
    ctx.lineTo(
        state.fromPoint.x + Math.cos(state.a) * 50,
        state.fromPoint.y + Math.sin(state.a) * 50)
    ctx.stroke();
};
 
// INPUT
canvas.addEventListener('mousemove', function (e) {
    var bb = e.target.getBoundingClientRect(),
    x1 = e.clientX - bb.left,
    y1 = e.clientY - bb.top;
 
    state.toPoint.x = x1;
    state.toPoint.y = y1;

    var x2 = state.fromPoint.x;
    var y2 = state.fromPoint.y;

    var info = document.getElementById('angle');


    var angle =  findAngle  (state.toPoint, state.fromPoint);
    info.innerHTML = "angle = " + angle;
 
});
canvas.addEventListener('mousedown', function (e) {
    var bb = e.target.getBoundingClientRect();
    var x1 = e.clientX - bb.left;
    var y1 = e.clientY - bb.top;

    var info = document.getElementById('angle');

    var x2 = state.fromPoint.x;
    var y2 = state.fromPoint.y;

    var angle =  findAngle  (state.fromPoint, state.fromPoint);
    info.innerHTML = "angle = " + angle;

 /* 
    state.fromPoint.x = x;
    state.fromPoint.y = y;
 */
});
 
// LOOP
var loop = function () {
    requestAnimationFrame(loop);
    update();
    draw();
};
 
loop();