// =============================================================
//                          COMPASS
// =============================================================

// if
function Compass({ center, radius, bearing_point }) {
	this.cx = center.x;
	this.cy = center.y;
	this.center = center;
	this.radius = radius;
	this.startDegrees = 0;
	this.endDegrees = 360;
	c = this;

	this.modes = {
		FULL: { start: 0.0, end: 360 },
		N: { start: 180, end: 360 },
		E: { start: 270, end: 90 },
		S: { start: 0.0, end: 180 },
		W: { start: 90, end: 270 },
		//
		SE: { start: 0, end: 90 },
		SW: { start: 90, end: 180 },
		NW: { start: 180, end: 270 },
	};

	this.setBearingPoint(bearing_point);
}

Compass.prototype.setBearingPoint = function (bearing_point) {



//	if (!bearing_point) {
//		log("none: bearing_point");
//		this.startDegrees = 0;
//		this.endDegrees = 360;
//	} else {
		this.bearing_point = bearing_point;
		this.bearing = this.findBearingAngle(bearing_point);
		this.startDegrees = this.bearing + 180;
		this.endDegrees = this.bearing + 360;
//	}
};
Compass.prototype.findBearingAngle = function (bearing_point) {
	var angle = findAngle(
		{ x: this.cx, y: -this.cy },
		{ x: bearing_point.x, y: -bearing_point.y }
	);

	if (angle < 0) var bearingTT = (360 + angle) % 360;
	else var bearingTT = angle;

	log("findBearingAngle: " + bearingTT);
	return bearingTT;
};

Compass.prototype.calculateOrientation = function () {
	var number_of_points = this.object_list.length;
	log("setObjectList: " + number_of_points);

	var slice_angle = (this.endDegrees - this.startDegrees) / number_of_points;
	slice_angle = Math.abs(slice_angle);

	var start_angle = this.startDegrees;
	var end_angle = start_angle + slice_angle;

	log(
		"CALC: bearing = " +
			this.bearing +
			"°. " +
			this.startDegrees +
			"° - " +
			this.endDegrees +
			"°"
	);

	log("CALC: slices: " + number_of_points + " " + slice_angle + "°");

	var distance_from_arc = 0;
	for (var i = 0; i < number_of_points; i++) {
		var object = this.object_list[i];
    var mid_point_angle = start_angle + slice_angle / 2;

	//
	//		var mid_point_angle = start_angle;
		var point = getPointOnArc(
			this.center,
			this.radius + distance_from_arc,
			to_radians(mid_point_angle)
		);

		var msg_mid_point =
			" point:" + mid_point_angle + "° " + point.x + ", " + point.y;
		log(
			this.bearing +
				": " +
				start_angle +
				" - " +
				end_angle +
				msg_mid_point
		);

		object.x = point.x;
		object.y = point.y;
		object.angle_start = start_angle % 360;
		object.angle_end = end_angle % 360;
		object.angle_middle = mid_point_angle % 360;

		//log(object);
		start_angle += slice_angle;
		end_angle = start_angle + slice_angle;
	}
};

Compass.prototype.setObjectList = function ({ object_list }) {
	this.object_list = object_list;
	this.calculateOrientation();
};
