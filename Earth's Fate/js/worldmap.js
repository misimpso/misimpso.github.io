// represents the map of the earth that is the background for the game
const worldmap = {
	image: new Image(),
	sick1image: new Image(),
	sick2image: new Image(),

	continentDeaths: new Map(),
	continentProduction: new Map(),
	continentConsciousness: new Map(),

	continentSelected: undefined,

	start: function() {
		this.image.src = "assets/earth/earth.jpg";
		this.sick1image.src = "assets/earth/earthsick1.png";
		this.sick2image.src = "assets/earth/earthsick2.png";

		for(var continent of continents) {
			this.continentDeaths.set(continent, []);
			this.continentProduction.set(continent, continent.baseProduction);
			this.continentConsciousness.set(continent, continent.baseConsciousness);
		}
	},

	update: function() {
		this.continentSelected = this.getContinent(mouse.x, mouse.y);
	},

	draw: function() {
		// draw background image
		ctx.drawImage(this.sick2image, 0, 0, gui.worldmap.width, gui.worldmap.height);
		if(status.sick2 == false) ctx.drawImage(this.sick1image, 0, 0, gui.worldmap.width, gui.worldmap.height);
		if(status.sick1 == false) ctx.drawImage(this.image, 0, 0, gui.worldmap.width, gui.worldmap.height);

		// draw tooltip if defined
		if(this.continentTooltip !== undefined) {
			this.continentTooltip.draw();
		}

		// draw continent info if one is selected
		if(this.continentSelected !== undefined) {
			// set text alignment
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			// draw continent name
			ctx.font = gui.worldmap.continentNameFont;
			ctx.fillStyle = gui.worldmap.continentNameFill;
			ctx.fillText(this.continentSelected.name, gui.worldmap.continentNameX, gui.worldmap.continentNameY);

			// draw continent population
			ctx.font = gui.worldmap.continentPopulationFont;
			ctx.fillStyle = gui.worldmap.continentPopulationFill;
			ctx.fillText(Math.floor(this.getPopulation(this.continentSelected)), gui.worldmap.continentPopulationX, gui.worldmap.continentPopulationY);

			// draw consciousness bar
			drawBar(gui.worldmap.continentConsciousnessX, gui.worldmap.continentConsciousnessY,
				gui.worldmap.continentConsciousnessW, gui.worldmap.continentConsciousnessH,
				this.getConsciousness(this.continentSelected) / 100,
				gui.worldmap.continentConsciousnessHighFill, gui.worldmap.continentConsciousnessLowFill);

			// draw production bar
			drawBar(gui.worldmap.continentProductionX, gui.worldmap.continentProductionY,
				gui.worldmap.continentProductionW, gui.worldmap.continentProductionH,
				this.getProduction(this.continentSelected) / 100,
				gui.worldmap.continentProductionHighFill, gui.worldmap.continentProductionLowFill);
		}
	},

	nextYear: function() {
		for(var continent of continents) {
			this.continentProduction.set(continent, Math.min(100, this.continentProduction.get(continent) + continent.growthProduction));
			this.continentConsciousness.set(continent, Math.max(1, this.continentConsciousness.get(continent) - continent.decayConsciousness));
		}
	},

	// returns the continent object at position x, y or undefined if there is none
	getContinent: function(x, y) {
		var pos = Math.floor(x).toString() + "," + Math.floor(y).toString();
		for(var continent of continents) {
			if(continent.positions.has(pos))
				return continent;
		}
	},

	evokeDisaster: function(disaster, power) {
		// get affected continent
		var affectedContinent = this.getContinent(disaster.x, disaster.y);
		if(affectedContinent != undefined) {
			// calculate deaths and damage
			var deaths = power * disaster.deaths(this.getPopulation(affectedContinent));
			var damage = power * disaster.destruction(this.getProduction(affectedContinent));

			// add deaths to list
			this.continentDeaths.get(affectedContinent).push( (status.year, deaths) );

			// subtract damage from production
			var newProduction = this.continentProduction.get(affectedContinent) - damage;
			this.continentProduction.set(affectedContinent, Math.max(0, newProduction));

			// award exp
			status.experience += deaths / 10 + damage;

			// track stats
			status.totalKills += deaths;
			status.totalDamage += damage;
		}
	},

	// get population of continent at year in millions
	getPopulation: function(continent) {
		var totalDeaths = 0;
        if(this.continentDeaths.get(continent) !== undefined) {
            for(var v of this.continentDeaths.get(continent)) {
                totalDeaths += v;
            }
        }
		return Math.max(0, continent.basePopulation(status.year) - totalDeaths);
	},

	// get total world population at year in millions
	getWorldPopulation: function() {
		var total = 0;
		for(var continent of continents) {
			total += this.getPopulation(continent);
		}
		return total;
	},

	// get production of continent
	getProduction: function(continent) {
		return this.continentProduction.get(continent);
	},

	// get consciousness of continent
	getConsciousness: function(continent) {
		return this.continentConsciousness.get(continent);
	},

  //Used when a conservation balloon is clicked
  addConsciousness: function(continent) {
      var currCon = this.continentConsciousness.get(continent);
      currCon += 10;
      if(currCon == 50) {
         advisors.add("Conservation", "You have reached 50% environmental consciousness for " + continent.name + "! Keep it up!");
      } else if(Math.random() < 0.2) {
         advisors.add("Conservation", "You have reached " + currCon + "% environmental consciousness for " + continent.name + "!");
      }
      if(currCon > 100) {
         currCon = 100;
         advisors.add("Conservation", "Congratulations! You have reach 100% environmental consciousness for " + continent.name);
      }
      this.continentConsciousness.set(continent, currCon);
  },

  //Increase production based on consciousness
  increaseProd: function() {
      for(var continent of continents) {
          if(continent.name == "Antarctica") continue;
          if(this.continentConsciousness.get(continent) < 100) {
             var conPercentage = this.continentConsciousness.get(continent)/100;
						 var newProduction = Math.min(100, this.continentProduction.get(continent) + (1.2-conPercentage) * continent.growthProduction);
             this.continentProduction.set(continent, newProduction);
          }
      }
  },

	getDamage: function(continent) {
		// TODO: tweek this formula for balance
		if(this.getPopulation(continent) == 0)
			return 0;
		return -( Math.log2(this.getPopulation(continent)) * this.getProduction(continent) * (1.1 - this.getConsciousness(continent) / 100) * 0.15 );
	},

	getWorldDamage: function() {
		var total = 0;
		for(var continent of continents) {
			total += this.getDamage(continent);
		}
		return total;
	}
};
