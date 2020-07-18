COLORS = [
	"#4e79a7",
	"#f28e2c",
	"#e15759",
	"#76b7b2",
	"#59a14f",
	"#edc949",
	"#af7aa1",
	"#ff9da7",
	"#9c755f",
	"#bab0ab",
];

// =============================================================
//                          CANVAS
// =============================================================

function getCanvasPixelRatio(canvas) {
	var ctx = canvas.getContext("2d"),
		dpr = window.devicePixelRatio || 1,
		bsr =
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio ||
			1;
	return dpr / bsr;
}
function createHiDPICanvas(w, h) {
	var canvas = document.createElement("canvas");
	var ratio = getCanvasPixelRatio(canvas);
	canvas.width = w * ratio;
	canvas.height = h * ratio;
	canvas.style.width = w + "px";
	canvas.style.height = h + "px";

	var ctx = canvas.getContext("2d");
	ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
	return canvas;
}

function MCanvas({ container }) {
	this.canvas = createHiDPICanvas(500, 500);
	this.ctx = this.canvas.getContext("2d");
	this.ratio = getCanvasPixelRatio(this.canvas);
	container.appendChild(this.canvas);

	this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
	this.width = this.canvas.width  - this.margin.left - this.margin.right;
	this.height = this.canvas.height - this.margin.top - this.margin.bottom;
}

MCanvas.prototype.getContext = function () {
	return this.ctx;
};

MCanvas.prototype.getHeight = function () {
	return this.canvas.height / this.ratio;
};
MCanvas.prototype.getWidth = function () {
	return this.canvas.width / this.ratio;
};

MCanvas.prototype.getCenter = function () {
	var cx = this.getWidth() / 2;
	var cy = this.getHeight() / 2;
	return { x: cx, y: cy };
};

MCanvas.prototype.drawLine = function (
	startX,
	startY,
	endX,
	endY,
	strokeStyle,
	lineWidth
) {
	if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
	if (lineWidth != null) this.ctx.lineWidth = lineWidth;
	this.ctx.beginPath();
	this.ctx.moveTo(startX, startY);
	this.ctx.lineTo(endX, endY);
	this.ctx.stroke();
	this.ctx.closePath();
};

MCanvas.prototype.drawBorder = function () {
	console.log("MCanvas .drawBorder");
	this.ctx.rect(this.margin.left, this.margin.top, this.width, this.height);
	this.ctx.fillStyle = "#F5F5F5";
	this.ctx.shadowColor = "black";
	this.ctx.shadowBlur = 2;
	this.ctx.shadowOffsetX = 0;
	this.ctx.shadowOffsetY = 0;
	this.ctx.fill();
	console.log("MCanvas .drawBorder - END");
};

MCanvas.prototype.drawArc = function (
	center,
	radius,
	start_angle,
	end_angle,
	color_stroke,
	color_fill
) {
	this.ctx.beginPath();
	this.ctx.moveTo(center.x, center.y);
	this.ctx.arc(center.x, center.y, radius, start_angle, end_angle, false);
	//draw the circle
	this.ctx.lineWidth = 3;
	// if (color_stroke) {
	this.ctx.strokeStyle = color_stroke;
	this.ctx.fillStyle = color_fill;
	this.ctx.stroke();
	this.ctx.fill();
	//   }
};

// draw point with text and circle around it.
MCanvas.prototype.drawPoint = function (x, y, radius, text) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = "grey";
	this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

	//draw the circle
	this.ctx.lineWidth = 3;
	this.ctx.strokeStyle = null; //"red";
	this.ctx.stroke();
	this.ctx.fillStyle = "darkgrey";
	this.ctx.fill();
	// text
	this.ctx.font = "14px sans-serif";
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "#384047"; // darkish
	this.ctx.fillText(text, x, y);
};

MCanvas.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

MCanvas.prototype.drawBorder = function () {
	this.ctx.rect(this.margin.left, this.margin.top, this.width, this.height);
	this.ctx.fillStyle = "#F5F5F5";
	this.ctx.shadowColor = "black";
	this.ctx.shadowBlur = 2;
	this.ctx.shadowOffsetX = 0;
	this.ctx.shadowOffsetY = 0;
	this.ctx.fill();
};

MCanvas.prototype.addEventListener = function (type, listener) {
	this.canvas.addEventListener(type, listener);
};