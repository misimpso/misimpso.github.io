// format used for status popups (health)
statusPopupFormat = {
    // minimum and maximum dimensions for the popup
    // leave 0 to disable
    minWidth: 0,
    maxWidth: 0,
    minHeight: 0,

    // inside margin
    margin: 3,

    // draws popup background
    background: function(x, y, w, h) {
		ctx.lineWidth = 2;
		ctx.fillStyle = "rgb(229, 92, 95)";
		ctx.fillRect(x, y, w, h)
		ctx.strokeStyle = "white";
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

// represents general gamestate elements like hp, time, and level
const status = {
	maxHealth: 4000,
	health: 0,
	level: 1,
	experience: 0,
	nextLevelCost: 100,

	year: 1900,
	speedDefault: 0.5, // years per 1000 ms
	speedFactor: 1,
	yearDelta: 0,
	lastUpdate: 0,
	sick1: false,
	sick2: false,

	totalKills: 0,
	totalDamage: 0,
	totalConservation: 0,
	disastersCaused: 0,
	conservationCaused: 0,

	popup: undefined,
	checkPause: [false, false], //For advisors, will create advice based off lack of user interface interaction

	start: function() {
		this.restart();

		mouse.addMousePressEvent(mb.left, function(e) { status.onleftclick(e); });
		keyboard.addKeyPressEvent(keys.esc, function(e) { status.onescape(e); });
    keyboard.addKeyPressEvent(keys.space, function(e) { status.onspace(e); });
	},

	restart: function() {
		this.health = this.maxHealth;
		this.level = 1;
		this.experience = 0;
		this.nextLevelCost = 100;

		this.year = 1900;
		this.speedFactor = 1;
		this.oldSpeed = 1;
		this.yearDelta = 0;
		this.lastUpdate = Date.now();

		this.totalKills = 0;
		this.totalDamage = 0;
		this.disastersCaused = 0;
		this.conservationCaused = 0;
		this.favDisaster = [0,0,0,0,0,0,0,0];
	},

	update: function() {
		// level up if enough exp is gained
		if(this.experience >= this.nextLevelCost) {
			this.level++;
            gui.disastermenu.levelUpCounter = 300;
			this.experience -= this.nextLevelCost;
			this.nextLevelCost *= 1.15;

			// award a disaster point
			disastermenu.levelUpPoints += 3;
		}

		// add time since last update to year delta
		this.yearDelta += Date.now() - this.lastUpdate;
		this.lastUpdate = Date.now();

		// update year if not paused
		if(this.speedFactor > 0 && this.yearDelta >= 1000 / this.speedDefault / this.speedFactor) {
			this.year++;
			this.yearDelta = 0;

			// update health
			this.health = Math.max( 0, Math.min( this.maxHealth, this.health + worldmap.getWorldDamage() ) );
			//this.health -= this.health/80;

			// give some exp
			this.experience += 1;

			//Decrease lifetime of current advice
			advisors.decrLifetime();

			//Check various flags for generating advice
			advisors.checkFlags();

			//Increase continent's production based on their consciousness
			worldmap.increaseProd();
		}

		// check player status and change game state if dead or time limit is reached
		if(this.health <= 0 || this.year == 2041) {
		    var enableTheme = enableSounds; //see if player wants theme music to play before clearing the sounds
		    stopSounds();
			if(enableTheme == true) themeSound.play();
			currentMenu = 7;
			endGameState = true;
		}
		if(this.health < this.maxHealth * 0.66) {
			if(enableSounds) {
				backgroundSound1.volume = 0;
				backgroundSound2.play();
			}
			this.sick1 = true;
		}
		if(this.health < this.maxHealth * 0.33) {
			if(enableSounds){
			    backgroundSound2.volume = 0;
				backgroundSound3.play();
			}
			this.sick2 = true;
		}

		// check for mouse over health
		if(mouse.x >= gui.status.healthX && mouse.x <= gui.status.healthX + gui.status.healthW &&
		mouse.y >= gui.status.healthY && mouse.y <= gui.status.healthY + gui.status.healthH) {
			title = "Health: " + (this.health / this.maxHealth * 100).toFixed(2).toString() + "%"; //"%  (" + (worldmap.getWorldDamage() / this.maxHealth * 100).toFixed(2).toString() + " % per Year)";
			lines = []
			for(var continent of continents) {
				if(worldmap.getDamage(continent) !== 0) {
					lines.push(continent.name + ": " + (worldmap.getDamage(continent) / this.maxHealth * 100).toFixed(2).toString() + " % per Year");
				}
			}
			// display health popup
			this.popup = new Popup(mouse.x, mouse.y, title, lines, statusPopupFormat);
			} else {
			this.popup = undefined;
		}
	},

	onleftclick: function(e) {
    //console.log("xscale: " + mouse.x/gui.worldmap.width + ", yscale: " + mouse.y/gui.worldmap.width);
		// check for click on pause button
		if(mouse.x >= gui.status.pauseX - gui.status.pauseW / 2 &&
		mouse.x <= gui.status.pauseX + gui.status.pauseW / 2 &&
		mouse.y >= gui.status.pauseY - gui.status.pauseH / 2 &&
		mouse.y <= gui.status.pauseY + gui.status.pauseH / 2) {
			// pause if unpaused
			if(this.speedFactor > 0) {
				this.speedFactor = 0;
				this.checkPause[0] = true;
			}
			// unpause if pause menu is not open
			else {
				this.speedFactor = 1;
				this.yearDelta = 0;
			}
		}

		// check for click on speed buttons
		if(distance(mouse.x, mouse.y, gui.status.speedHalfX, gui.status.speedHalfY) <= gui.status.speedRadius) {
			this.speedFactor = 0.5;
			this.checkPause[1] = true;
		}
		if(distance(mouse.x, mouse.y, gui.status.speedNormalX, gui.status.speedNormalY) <= gui.status.speedRadius) {
			this.speedFactor = 1;
		}
		if(distance(mouse.x, mouse.y, gui.status.speedDoubleX, gui.status.speedDoubleY) <= gui.status.speedRadius) {
			this.speedFactor = 2;
			this.checkPause[1] = true;
		}
	},

	onescape: function(e) {
		// if not in pause menu, pause game and open menu
		if(currentMenu == menus.length) {
			currentMenu = 6;
			this.speedFactor = this.oldSpeed;
			this.speedFactor = 0;
		}
		// otherwise, close pause menu and resume
		else if(currentMenu == 6) {
			currentMenu = menus.length;
			this.speedFactor = this.oldSpeed;
			this.oldSpeed = 1;
			this.yearDelta = 0;
		}
	},

  onspace: function(e) {
    // pause if unpaused
    if(this.speedFactor > 0) {
      this.speedFactor = 0;
      this.checkPause[0] = true;
    }
    // unpause if pause menu is not open
    else {
      this.speedFactor = 1;
      this.yearDelta = 0;
    }
  },

	draw: function() {
		// set text alignment
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// draw healthbar
		drawBar(gui.status.healthX, gui.status.healthY,
		gui.status.healthW, gui.status.healthH,
		this.health / this.maxHealth,
		gui.status.healthHighFill, gui.status.healthLowFill);

		// draw current level
		ctx.font = gui.status.levelFont;
		ctx.fillStyle = gui.status.levelFill;
		ctx.fillText(this.level.toString(), gui.status.levelX, gui.status.levelY);

        //draw next level
        ctx.font = gui.status.levelFont;
        ctx.fillStyle = gui.status.levelFill;
        ctx.fillText((this.level+1).toString(), gui.status.levelX + 136, gui.status.levelY);

		// draw exp bar
		drawBar(gui.status.expX, gui.status.expY,
		gui.status.expW, gui.status.expH,
		this.experience / this.nextLevelCost,
		gui.status.expFill, gui.status.expFill);

		// draw year
		ctx.font = gui.status.yearFont;
		ctx.fillStyle = gui.status.yearFill;
		ctx.fillText(this.year.toString(), gui.status.yearX, gui.status.yearY);

		// draw pause
		ctx.font = gui.status.pauseFont;
		ctx.fillStyle = gui.status.pauseFill;
		if(this.speedFactor > 0) {
			ctx.fillText("Pause", gui.status.pauseX, gui.status.pauseY);
		} else {
			ctx.fillText("Play", gui.status.pauseX, gui.status.pauseY);
		}

		// draw speed buttons
		ctx.fillStyle = gui.status.speedFill;
		if(this.speedFactor == 0.5) {
			ctx.beginPath();
			ctx.arc(gui.status.speedHalfX, gui.status.speedHalfY, gui.status.speedRadius, 0, 2 * Math.PI);
			ctx.fill();
		} else if(this.speedFactor == 1) {
			ctx.beginPath();
			ctx.arc(gui.status.speedNormalX, gui.status.speedNormalY, gui.status.speedRadius, 0, 2 * Math.PI);
			ctx.fill();
		} else if(this.speedFactor == 2) {
			ctx.beginPath();
			ctx.arc(gui.status.speedDoubleX, gui.status.speedDoubleY, gui.status.speedRadius, 0, 2 * Math.PI);
			ctx.fill();
		}

		// draw popup if necessary
		if(this.popup !== undefined) {
			this.popup.draw();
		}
	}
}
