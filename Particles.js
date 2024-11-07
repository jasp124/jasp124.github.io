const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let particle_system = new ParticleSystem(100, "whitesmoke", 2, "whitesmoke", 150, canvas);
particle_system.init();

let lastRender = 0;
requestAnimationFrame(mainLoop);

function mainLoop(timestamp) {
	let progress = timestamp - lastRender;
	let ctx = document.getElementById("canvas").getContext("2d");
	draw(ctx);
	update(progress);
	
	lastRender = timestamp;
	
	requestAnimationFrame(mainLoop);
}

function draw(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	particle_system.draw();
}

function update(progress) {
	particle_system.move();
}

function applySettings() {
	let total = parseInt(document.getElementById("total").value)
	let particle_color = document.getElementById("color").value;
	let line_color = document.getElementById("line_color").value;
	let line_width = parseInt(document.getElementById("line_width").value);
	let distance = parseInt(document.getElementById("distance").value);
	let background = document.getElementById("background_color").value;
	
	particle_system.setTotalParticles(total);
	particle_system.setParticleColor(particle_color);
	particle_system.setLineColor(line_color);
	particle_system.setLineWidth(line_width);
	particle_system.setMaxDistance(distance);
	canvas.style.backgroundColor = background;
	
	document.getElementById("line_width_display").textContent = line_width.toString();
	document.getElementById("distance_display").textContent = distance.toString();
	
}

function ParticleSystem(total, particle_color, line_width, line_color, max_distance, canvas) {
	this.total = total;
	this.particle_color = particle_color;
	this.line_width = line_width;
	this.line_color = line_color;
	this.max_distance = max_distance;
	this.canvas = canvas;
	this.particles = [];
	
	this.init = function() {
		
		let radius = Math.floor(Math.random() * 3) + 3;
		let x = Math.floor(Math.random() * (this.canvas.width - radius));
		let y = Math.floor(Math.random() * (this.canvas.height - radius));
		let vel_x = (Math.random() * 2) + 1;
		let vel_y = (Math.random() * 2) + 1;
		
		for(var i = 0; i<this.total; i++) {
			radius = Math.floor(Math.random() * 3) + 5;
			x = Math.floor(Math.random() * (this.canvas.width - radius));
			y = Math.floor(Math.random() * (this.canvas.height - radius));
			vel_x = (Math.random() * 3) + 2;
			vel_y = (Math.random() * 2) + 1;
			
			let particle = new Particle(x, y, radius, this.particle_color, vel_x, vel_y);
			this.particles.push(particle);
		}
	}
	
	this.draw = function() {
		let ctx = this.canvas.getContext("2d");
		for(var i = 0; i<this.particles.length; i++) {
			this.particles[i].draw(ctx);
			ctx.save();
			ctx.strokeStyle = this.line_color;
			ctx.lineWidth = this.line_width;
			// Draw a line to neighbor if they are close enough
			for(var j = i + 1; j<this.particles.length; j++) {
				if ( j != i && this.checkDistance(this.particles[i], this.particles[j]) <= this.max_distance ) {
					ctx.beginPath();
					ctx.moveTo(this.particles[i].getX(), this.particles[i].getY());
					ctx.lineTo(this.particles[j].getX(), this.particles[j].getY());
					ctx.moveTo(this.particles[i].getX(), this.particles[i].getY());
					ctx.stroke();
					ctx.closePath();
				}
			}
			ctx.restore();
		}
	}
	
	this.move = function() {
		let ctx = this.canvas.getContext("2d");
		for(var i = 0; i<this.particles.length; i++) {
			this.particles[i].move(ctx);
		}
	}
	
	this.checkDistance = function(particle_one, particle_two) {
		let x1 = particle_one.getX();
		let y1 = particle_one.getY();
		let x2 = particle_two.getX();
		let y2 = particle_two.getY();
		let dist_x = Math.abs(x2 - x1);
		let dist_y = Math.abs(y2 - y1);
		let dist = dist_x + dist_y;
		return dist;
	}
	
	this.setTotalParticles = function(total) {
		if ( total > this.total ) {
			this.total = total;
			let radius = Math.floor(Math.random() * 3) + 3;
			let x = Math.floor(Math.random() * (this.canvas.width - radius));
			let y = Math.floor(Math.random() * (this.canvas.height - radius));
			let vel_x = Math.floor(Math.random() * 2) + 1;
			let vel_y = Math.floor(Math.random() * 2) + 1;
			
			while( this.particles.length < this.total ) {
				let particle = new Particle(x, y, radius, this.particle_color, vel_x, vel_y);
				this.particles.push(particle);
				
				radius = Math.floor(Math.random() * 3) + 5;
				x = Math.floor(Math.random() * (this.canvas.width - radius));
				y = Math.floor(Math.random() * (this.canvas.height - radius));
				vel_x = Math.floor(Math.random() * 2) + 1;
				vel_y = Math.floor(Math.random() * 2) + 1;
				
			}
		} else {
			this.total = total;
			let removed = "";
			while(this.particles.length > this.total) {
				removed = this.particles.pop();
			}
		}
	}
	
	this.setParticleColor = function(color) {
		this.particle_color = color;
		for(var i = 0; i<this.particles.length; i++) {
			this.particles[i].setColor(this.particle_color);
		}
	}
	
	this.setLineColor = function(color) {
		this.line_color = color;
	}
	
	this.setLineWidth = function(line_width) {
		this.line_width = line_width;
	}
	
	this.setMaxDistance = function(max_distance) {
		this.max_distance = max_distance;
	}
}

function Particle(x, y, radius, color, vel_x, vel_y) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.vel_x = vel_x;
	this.vel_y = vel_y;
	
	this.draw = function(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.moveTo(this.x + this.radius, this.y);
		ctx.closePath();
		ctx.restore();
	}
	
	this.move = function(ctx) {
		if ( this.x + this.radius >= ctx.canvas.width || this.x - this.radius <= 0 ) {
			this.vel_x = -(this.vel_x);
		}
		
		if ( this.y + this.radius >= ctx.canvas.height || this.y - this.radius <= 0 ) {
			this.vel_y = -(this.vel_y);
		}
		
		this.x += this.vel_x;
		this.y += this.vel_y;
	}
	
	this.getX = function() {
		return this.x;
	}
	
	this.getY = function() {
		return this.y;
	}
	
	this.getRadius = function() {
		return this.radius;
	}
	
	this.getColor = function() {
		return this.color;
	}
	
	this.setColor = function(color) {
		this.color = color;
	}
}