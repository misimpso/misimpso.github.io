particle_system = {
	particles: [],
	xpos: undefined,
	ypos: undefined,
	
	particle: function(x, y, type){
		this.x = x;
		this.y = y;
		this.xspeed = randomX = Math.floor((Math.random() * 100) - 50)/100;
        this.yspeed = randomY = Math.floor((Math.random() * 100) - 50)/100;
		this.radius = 1;
		this.lifetime = 100;
		this.color = type;
	},
	
	create: function(x, y, type) {
		for(var iter = 0; iter < 30; ++iter){
			this.particles.push(new this.particle(x, y, type));
			this.xpos = x;
			this.ypos = y;
		}
	},
	
	update: function() {
		for (var iter = 0; iter < this.particles.length; ++iter) {
		    if(this.particles[iter].lifetime > 0) {
			    this.particles[iter].x += this.particles[iter].xspeed;
				this.particles[iter].y += this.particles[iter].yspeed;
				this.particles[iter].lifetime--;
				this.particles[iter].radius += this.particles[iter].radius/300;
			}
		}
	},
	
	draw: function() {
		for (var iter = 0; iter < this.particles.length; ++iter) {			
			ctx.fillStyle = this.particles[iter].color;
			ctx.beginPath();
			if(this.particles[iter].lifetime > 0) {
			    ctx.arc(this.particles[iter].x, this.particles[iter].y, this.particles[iter].radius, 0, Math.PI * 2, false);
			}
			ctx.fill();
		}
	}

}	