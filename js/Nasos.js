let Nasos = {
	rand: function(min,max) {
		return Math.min(min,max) + Math.random() * (Math.max(min,max) - Math.min(min,max));
	},
	randf: function(min,max) {
		return Math.floor(this.rand(min,max));
	},
	randColor: function(rmin,rmax,gmin,gmax,bmin,bmax,amin,amax) {
		return "rgba(" + this.randf(rmin || 0,rmax || 255) + ", " + 
						 this.randf(gmin || 0,gmax || 255) + ", " + 
						 this.randf(bmin || 0,bmax || 255) + ", " +
						 this.rand (amin || 0,amax || 1.0) + ")";
	},
	toRadians: function(angle) {
		return angle*Math.PI / 180;
	},
	distanceBetween: function(p1,p2) {
		let dx = p1.x - p2.x;
		let dy = p1.y - p2.y;
		return Math.sqrt(dx*dx+dy*dy);
	},
	getAngle: function(p1,p2) {
		return Math.atan2(p1.y-p2.y,p1.x-p2.x);
	},
	collidePR: function(point, rect) {
		return point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height;
	},
	intersects: function(rect1, rect2) {
		return rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height && rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width
	}
}