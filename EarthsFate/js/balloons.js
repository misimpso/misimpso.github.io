// popup format used to draw red balloon messages
redBalloonPopupFormat = {
	// minimum and maximum dimensions for the popup
	// leave 0 to disable
	minWidth: 0,
	maxWidth: 300,
	minHeight: 0,
	
	// inside margin
	margin: 3,
	
	// draws popup background
	background: function(x, y, w, h) {
		ctx.lineWidth = 1;
		ctx.fillStyle = "rgb(212, 3, 3)";
		ctx.fillRect(x, y, w, h)
		ctx.strokeStyle = "black";
		ctx.strokeRect(x, y, w, h);
	},
	
	// contains functions to format title text
	titleFormat: function() {
		ctx.fillStyle = "white";
		ctx.font = "16px Geometos Rounded";
		ctx.textAlign = "center";
	},
	
	// contains functions to format text lines
	linesFormat: function() {
		ctx.fillStyle = "white";
		ctx.font = "12px Arial";
		ctx.textAlign = "left";
	}
};

// popup format used to draw balloon messages
greenBalloonPopupFormat = {
	// minimum and maximum dimensions for the popup
	// leave 0 to disable
	minWidth: 0,
	maxWidth: 300,
	minHeight: 0,
	
	// inside margin
	margin: 3,
	
	// draws popup background
	background: function(x, y, w, h) {
		ctx.lineWidth = 1;
		ctx.fillStyle = "rgb(12, 183, 16)";
		ctx.fillRect(x, y, w, h)
		ctx.strokeStyle = "black";
		ctx.strokeRect(x, y, w, h);
	},
	
	// contains functions to format title text
	titleFormat: function() {
		ctx.fillStyle = "white";
		ctx.font = "16px Geometos Rounded";
		ctx.textAlign = "center";
	},
	
	// contains functions to format text lines
	linesFormat: function() {
		ctx.fillStyle = "white";
		ctx.font = "12px Arial";
		ctx.textAlign = "left";
	}
};

// manages the balloons and the data used to create them
const balloons = {
	// balloon dimensions
	balloonWidth: 19,
	balloonHeight: 27,
	
	// balloon duration in years
	balloonTime: 10,
	
	// balloon images
	disasterImage: new Image(),
	conservationImage: new Image(),
	
	// positions in disaster and conservation data
	dataPosition: 0,
	conDataPosition: 0,
	
	// the list of current balloons
	balloonList: [],
	
    numRedBalloons: new Map(),
    numGreenBalloons: new Map(),
	
	// the currently selected balloon
	balloonSelected: undefined,
	
	// the format for balloon popups and the current popup
	balloonPopup: undefined,
	
	// show description if disaster has been called
	description: " ",
	
	start: function() {
		// load balloon image
		this.disasterImage.src = "assets/balloons/balloon_red.png";
		this.conservationImage.src = "assets/balloons/balloon_green.png";
		
		// add input events
		mouse.addMousePressEvent(mb.left, function(e) { balloons.onleftclick(); });
		
		for(var continent of continents) {
			this.numRedBalloons.set(continent.name, {activated: 0, spawns: 0});
			this.numGreenBalloons.set(continent.name, {activated: 0, spawns: 0});
		}
	},
	
	update: function() {
		// add new disaster balloons if their date has been reached
		while(this.dataPosition < data.length && data[this.dataPosition].date <= status.year) {
			//Find continent balloon is over
			var balloonsContinent = worldmap.getContinent(data[this.dataPosition].xscale * gui.worldmap.width, data[this.dataPosition].yscale * gui.worldmap.height);
			if(balloonsContinent !== undefined) {
				//If continent has high production, and over population
				var contNumRedBalloons = this.numRedBalloons.get(balloonsContinent.name);
				if(worldmap.getProduction(balloonsContinent) >= 20 || worldmap.getPopulation(balloonsContinent) >= balloonsContinent.basePopulation(status.year) ||
				contNumRedBalloons.spawns == 0) {
					//If player is causing high descruction, if random number between activated balloons and spawned balloons then spawn more balloons.
					var rand = contNumRedBalloons.activated + (Math.random()* (contNumRedBalloons.spawns - contNumRedBalloons.activated));
					if(rand == 0 || contNumRedBalloons.spawns <= 2 || rand >= contNumRedBalloons.activated) {
						//Create red balloon
						var newRedBalloon = data[this.dataPosition];
						newRedBalloon.balloonType = 0;
						newRedBalloon.resolved = false;
						newRedBalloon.x = newRedBalloon.xscale * gui.worldmap.width;
						newRedBalloon.y = newRedBalloon.yscale * gui.worldmap.height;
						//Push balloon into array
						this.balloonList.push(newRedBalloon);
						//Incriment number keeping track of spawned balloons
						contNumRedBalloons.spawns++;
						this.numRedBalloons.set(balloonsContinent.name, contNumRedBalloons);
						//Play balloon spawn sound
						if(enableSounds == true) popSound.quick_play();
					}
				}
			}
			this.dataPosition++;
		}
		
		// add new conservation balloons if their date has been reached
		while(this.conDataPosition < conData.length && conData[this.conDataPosition].date <= status.year) {
			var balloonsContinent = worldmap.getContinent(data[this.conDataPosition].xscale * gui.worldmap.width, data[this.conDataPosition].yscale * gui.worldmap.height);
			if(balloonsContinent !== undefined) {
				var contNumGreenBalloons = this.numGreenBalloons.get(balloonsContinent.name);
				if(worldmap.getProduction(balloonsContinent) >= 40 || balloonsContinent.baseConsciousness > 30 || contNumGreenBalloons.spawns == 0) {
					var rand = (Math.random()*contNumGreenBalloons.spawns);
					if(rand == 0 || contNumGreenBalloons.spawns <= 2 || rand <= contNumGreenBalloons.activated) {
						var newGreenBalloon = conData[this.conDataPosition];
						newGreenBalloon.balloonType = 1;
						newGreenBalloon.resolved = false;
						newGreenBalloon.x = newGreenBalloon.xscale * gui.worldmap.width;
						newGreenBalloon.y = newGreenBalloon.yscale * gui.worldmap.height;
						this.balloonList.push(newGreenBalloon);
						contNumGreenBalloons.spawns++;
						this.numGreenBalloons.set(balloonsContinent.name, contNumGreenBalloons);
						if(enableSounds == true) popSound.quick_play();
					}
				}
			}
			this.conDataPosition++;
		}
		
		// remove balloons that are out of date
		for(var i = 0; i < this.balloonList.length;) {
			if(this.balloonList[i].date + this.balloonTime <= status.year) {
				// if balloon was selected
				if(this.balloonSelected == i) {
					// deselect balloon and delete popup
					this.balloonSelected = undefined;
					this.balloonPopup = undefined;
				}
				
				// remove from balloon list
				this.balloonList.splice(i, 1);
				
				// play balloon fizzle sound
				if(enableSounds == true) pushSound.quick_play();
			} else i++;
		}
		
		// check for balloon mouse over
		var balloonMouseOver = false;
		if(mouse.x > 0 && mouse.x <= gui.worldmap.width && mouse.y > 0 && mouse.y <= gui.worldmap.height) {
			for(var i = 0; i < this.balloonList.length; i++) {
				// if mouse is on balloon that is not already selected
				if(mouse.x >= this.balloonList[i].x - this.balloonWidth / 2 && mouse.x <= this.balloonList[i].x + this.balloonWidth / 2 &&
				mouse.y >= this.balloonList[i].y - this.balloonHeight / 2 && mouse.y <= this.balloonList[i].y + this.balloonHeight / 2) {
					// select balloon
					this.balloonSelected = i;
					
					// choose popup format based on balloon type
					if(this.balloonList[this.balloonSelected].balloonType == 0) {
						var balloonFormat = redBalloonPopupFormat;
					} else {
						var balloonFormat = greenBalloonPopupFormat;
					}
					
					// only show description if resolved
					if(this.balloonList[this.balloonSelected].resolved == true) {
						this.description = this.balloonList[this.balloonSelected].description;
					} else if(this.balloonList[this.balloonSelected].balloonType == 0) {
						this.description = "Select a disaster then click to cause damage";
					} else if(this.balloonList[this.balloonSelected].balloonType == 1) {
						this.description = "Click to spread environmental consciousness";
					}
					
					// create popup
					this.balloonPopup = new Popup(this.balloonList[this.balloonSelected].x, this.balloonList[this.balloonSelected].y,
					this.balloonList[this.balloonSelected].title, [this.balloonList[this.balloonSelected].location, this.description], balloonFormat);
					
					// break out of loop
					balloonMouseOver = true;
					break;
				}
			}
		}
		// if no balloon has the mouse over it
		if(!balloonMouseOver) {
			// deselect current balloon and delete popup
			this.balloonSelected = undefined;
			this.balloonPopup = undefined;
		}
	},
	
	onleftclick: function() {
		// return if click is off map
		if(mouse.x < 0 || mouse.x > gui.worldmap.width || mouse.y < 0 || mouse.y > gui.worldmap.height)
		return;
		
		// check if click is on an unresolved balloon
		if(this.balloonSelected != undefined && !this.balloonList[this.balloonSelected].resolved) {
			// get balloon continent
			var balloonsContinent = worldmap.getContinent(this.balloonList[this.balloonSelected].x, this.balloonList[this.balloonSelected].y);
			// if balloon is red and a disaster is selected
			if(this.balloonList[this.balloonSelected].balloonType == 0 && disastermenu.disasterSelected != undefined && disastermenu.disasterSelected.level > 0) {
				var contNumRedBalloons = this.numRedBalloons.get(balloonsContinent.name);
				// double disaster strength if correct disaster chosen
				if(disastermenu.disasterSelected.name == this.balloonList[this.balloonSelected].type) {
					var power = 2;
					contNumRedBalloons.activated += 1;
					advisors.add("Anarchy", "Good job picking the " + this.balloonList[this.balloonSelected].type + "! It is sure to cause the most destruction.");
				} else {
					var power = 1;
					contNumRedBalloons.activated += 0.5;
					if(Math.random() < 0.2) advisors.add("Anarchy", "Picking the " + disastermenu.disasterSelected.name + " wasn't the best decision! Pick a disaster better suited for that event.");
				}
				this.numRedBalloons.set(balloonsContinent.name, contNumRedBalloons);
				
				// evoke disaster
				worldmap.evokeDisaster(new Disaster(this.balloonList[this.balloonSelected].x, this.balloonList[this.balloonSelected].y,
				disastermenu.disasterSelected), power);
				
				// increase stats and mark balloon resolved
				status.disastersCaused++;
				this.balloonList[this.balloonSelected].resolved = true;
				
				// play disaster sound, create particle, and record favorite disaster
				var color = "CF2525";
				switch (disastermenu.disasterSelected.name) {
					case "Earthquake":
						if(enableSounds == true) earthquakeSound.quick_play();
						color = "#8A672C";
						status.favDisaster[0]++;
						break;
					case "Volcano":
						if(enableSounds == true) volcanoSound.quick_play();
						color = "#E83333";
						status.favDisaster[1]++;
						break;
					case "Flood":
						if(enableSounds == true) floodSound.quick_play();
						color = "#3085E6";
						status.favDisaster[2]++;
						break;
					case "Tsunami":
						if(enableSounds == true) tsunamiSound.quick_play();
						color = "#215EA3";
						status.favDisaster[3]++;
						break;
					case "Tornado":
						if(enableSounds == true) tornadoSound.quick_play();
						color = "#FFFFFF";
						status.favDisaster[4]++;
						break;
					case "Drought":
						if(enableSounds == true) droughtSound.quick_play();
						color = "#F0F5BA";
						status.favDisaster[5]++;
						break;
					case "Hurricane":
						if(enableSounds == true) hurricaneSound.quick_play();
						color = "#499BAD";
						status.favDisaster[6]++;
						break;
					case "Disease":
						if(enableSounds == true) diseaseSound.quick_play();
						color = "#1F2324";
						status.favDisaster[7]++;
						break;
				}
				particle_system.create(mouse.x, mouse.y, color);
				
				// deselect sisaster
				disastermenu.disasterSelectedIndex = undefined;
				disastermenu.disasterSelected = undefined;
			}
			// balloon is green
			else if(this.balloonList[this.balloonSelected].balloonType == 1) {
				// increase consciousness and health
				worldmap.addConsciousness(worldmap.getContinent(mouse.x, mouse.y));
				status.health = Math.min(status.maxHealth, status.health + 50);
				
				// play sound and create particles
				if(enableSounds == true) healingSound.quick_play();
				particle_system.create(mouse.x, mouse.y, "#36CF25");
				
				var contNumGreenBalloons = this.numGreenBalloons.get(balloonsContinent.name);
				contNumGreenBalloons.activated++;
				this.numGreenBalloons.set(balloonsContinent.name, contNumGreenBalloons);
				
				// increase stat and mark balloon as resolved
				status.conservationCaused++;
				this.balloonList[this.balloonSelected].resolved = true;
			}
		}
	},
	
	draw: function() {
		// draw the balloons
		for(var i = 0; i < this.balloonList.length; i++) {
			if(this.balloonList[i].resolved) {
				ctx.globalAlpha = 0.6;
			}
			
			if(this.balloonList[i].balloonType == 0) {
				ctx.drawImage(this.disasterImage, this.balloonList[i].x - this.balloonWidth / 2, this.balloonList[i].y - this.balloonHeight / 2);
			} else {
				ctx.drawImage(this.conservationImage, this.balloonList[i].x - this.balloonWidth / 2, this.balloonList[i].y - this.balloonHeight / 2);
			}
			ctx.globalAlpha = 1;
		}
		
		// draw popup if defined
		if(this.balloonPopup !== undefined) {
			this.balloonPopup.draw();
		}
	}
};
