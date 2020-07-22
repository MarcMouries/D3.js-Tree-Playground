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

/*
 *  Calculate the Height of text with the specified font
 *

 *
 *   [font style] [font weight] [font size] [font face]
 *
 *   Example: f
*/
function getLineHeight(txt, font) {
	var el = document.createElement("div");

	el.style.cssText =
		"position:fixed;padding:0;left:-9999px;top:-9999px;" +
		"font: " +
		font +
		";";
	//console.log("cssText= " + el.style.cssText);
	el.textContent = txt;
	document.body.appendChild(el);
	var height = parseInt(getComputedStyle(el).getPropertyValue("height"), 10);
	document.body.removeChild(el);

	return height;
}

function MCanvas({ container }) {
	this.canvas = createHiDPICanvas(1200, 900);
	this.ctx = this.canvas.getContext("2d");
	this.ratio = getCanvasPixelRatio(this.canvas);
	container.appendChild(this.canvas);

	this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
	this.width = this.canvas.width - this.margin.left - this.margin.right;
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

MCanvas.prototype.drawTextBG = function (
	txt,
	x,
	y,
	font,
	padding,
	background_color
) {
	this.ctx.font = font;
	this.ctx.textBaseline = "top";
	this.ctx.fillStyle = background_color;
	this.ctx.opacity = 0.2;

	var width = this.ctx.measureText(txt).width;
	var text_height = 25;

	this.ctx.fillRect(
		x - width / 2,
		y + text_height,
		width + padding,
		parseInt(font, 10) + padding
	);

	//this.ctx.lineWidth = 1;
	//this.ctx.strokeStyle = "#009ddf";
	//this.ctx.strokeRect(x - width /2, y + text_height, width + padding, parseInt(font, 10) + padding);

	this.ctx.fillStyle = "#000";
	//this.ctx.fillText(txt, x - width /2, y + padding / 2);
	this.ctx.fillText(txt, x - width / 2, y + text_height);
};

MCanvas.prototype.drawBorder = function (background_color) {
	this.ctx.rect(this.margin.left, this.margin.top, this.width, this.height);
	this.ctx.fillStyle = "#F5F5F5";
	//this.ctx.shadowColor = "black";
	//this.ctx.shadowBlur = 2;
	//this.ctx.shadowOffsetX = 0;
	//this.ctx.shadowOffsetY = 0;
	this.ctx.fill();
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

MCanvas.prototype.drawRing = function (x, y, radius, color) {
	this.ctx.beginPath();
	this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	//this.ctx.lineWidth = 3;
	this.ctx.strokeStyle = color;
	this.ctx.stroke();
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
	this.ctx.font = "12px sans-serif";
	//this.ctx.textAlign = "center";
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "#384047"; // darkish
	//this.ctx.fillText(text, x , y + radius + 20) ;
};
MCanvas.prototype.drawText = function (x, y, text, font, text_color, maxWidth, optionalSeparator	) {
	var word_separator = " ";
	if (optionalSeparator) {
		word_separator = optionalSeparator;
	}

	this.ctx.font = font;
	this.ctx.textAlign = "center";
	this.ctx.textBaseline = "top";
	this.ctx.fillStyle = text_color;

	//      var alphabet = "M"; //"ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
	var lineHeight = getLineHeight(text, font);
	console.log("lineHeight= " + lineHeight);

	var words = text.split(word_separator);
	var line = "";

	for (var i = 0; i < words.length; i++) {
		var testLine = line + words[i] + " ";
		var metrics = this.ctx.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && i > 0) {
			this.ctx.fillText(line, x, y);
			line = words[i] + " ";
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	this.ctx.fillText(line, x, y);
}

MCanvas.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

MCanvas.prototype.addEventListener = function (type, listener) {
	this.canvas.addEventListener(type, listener);
};
