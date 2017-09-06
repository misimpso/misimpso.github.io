// disaster types
const disasters = [];

// Earthquake
disasters.push({
  name: "Earthquake",
  image: "assets/disaster_icons/earthquake.png",
  namegen: function(year, continent) {
    return "The Great " + continent.adjective + " Quake of " + year;
  },
  level: 0,
  populationDamageFactor: 0.5,
  productionDamageFactor: 2
});

// Volcano
disasters.push({
  name: "Volcano",
  image: "assets/disaster_icons/volcano.png",
  namegen: function(year, continent) {
	  return "The Vile " + continent.adjective + " Eruption of " + year;
  },
  level: 0,
  populationDamageFactor: 1,
  productionDamageFactor: 1
});

// Flood
disasters.push({
  name: "Flood",
  image: "assets/disaster_icons/flood.png",
  namegen: function(year, continent) {
    return "The Foul " + continent.adjective + " Flood of " + year;
  },
  level: 0,
  populationDamageFactor: 0.5,
  productionDamageFactor: 2
});

// Tsunami
disasters.push({
  name: "Tsunami",
  image: "assets/disaster_icons/tsunami.png",
  namegen: function(year, continent) {
    return "The Sickening " + continent.adjective + " Tsunami of " + year;
  },
  level: 0,
  populationDamageFactor: 1,
  productionDamageFactor: 1
});

// Tornado
disasters.push({
  name: "Tornado",
  image: "assets/disaster_icons/tornado.png",
  namegen: function(year, continent) {
    return "The Terrible " + continent.adjective + " Tornado of " + year;
  },
  level: 0,
  populationDamageFactor: 0.5,
  productionDamageFactor: 2
});

// Drought
disasters.push({
  name: "Drought",
  image: "assets/disaster_icons/drought.png",
  namegen: function(year, continent) {
    return "The Dreadful " + continent.adjective + " Drought of " + year;
  },
  level: 0,
  populationDamageFactor: 2,
  productionDamageFactor: 0.5
});

// Hurricane
disasters.push({
  name: "Hurricane",
  image: "assets/disaster_icons/hurricane.png",
  namegen: function(year, continent) {
    return "The Horrendus " + continent.adjective + " Hurricane of " + year;
  },
  level: 0,
  populationDamageFactor: 1,
  productionDamageFactor: 1
});

// Disease
disasters.push({
  name: "Disease",
  image: "assets/disaster_icons/disease.png",
  namegen: function(year, continent) {
    return "The Detestable " + continent.adjective + " Disease of " + year;
  },
  level: 0,
  populationDamageFactor: 2,
  productionDamageFactor: 0.5
});

// load disaster images
for(var disasterType of disasters) {
  var src = disasterType.image;
  disasterType.image = new Image();
  disasterType.image.src = src;
}

// popup format used to draw disaster descriptions
disasterPopupFormat = {
  // minimum and maximum dimensions for the popup
  // leave 0 to disable
  minWidth: 150,
  maxWidth: 0,
  minHeight: 0,

  // inside margin
  margin: 3,

  // draws popup background
  background: function(x, y, w, h) {
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, w, h);
  },

  // contains functions to format title text
  titleFormat: function() {
    ctx.fillStyle = "black";
    ctx.font = "20px Geometos Rounded";
    ctx.textAlign = "center";
  },

  // contains functions to format text lines
  linesFormat: function() {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
  }
};

// generates a disaster popup for the given disaster
function generateDisasterPopup(x, y, disaster) {
  var tempDisaster = new Disaster(0, 0, disaster);
  var deaths = tempDisaster.deaths(100);
  var damage = tempDisaster.destruction(100);
  var deathsString = "Deaths: ";
  var damageString = "Damage: ";

  if(deaths < 10) {
    deathsString += "Low";
  } else if(deaths < 25) {
    deathsString += "Medium";
  } else if(deaths < 40) {
    deathsString += "High";
  } else if(deaths < 55) {
    deathsString += "Very High";
  } else if(deaths < 70) {
    deathsString += "Catastrophic";
  } else {
    deathsString += "Apocalyptic";
  }


  if(damage < 10) {
    damageString += "Low";
  } else if(damage < 25) {
    damageString += "Medium";
  } else if(damage < 40) {
    damageString += "High";
  } else if(damage < 55) {
    damageString += "Very High";
  } else if(damage < 70) {
    damageString += "Catastrophic";
  } else {
    damageString += "Apocalyptic";
  }

  return new Popup(x, y, disaster.name, ["Level: " + disaster.level.toString(), deathsString, damageString], disasterPopupFormat);
}

// represents a disaster created by the player
class Disaster {
  // creates disaster at x, y with type
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  // calculate deaths based on population
  deaths(population) {
    return Math.min(population, population * .2 * this.type.populationDamageFactor * (1 + (this.type.level - 1) * .1));
  }

  // claculate damage to industry based on production
  destruction(production) {
    return Math.min(production, production * .2 * this.type.productionDamageFactor * (1 + (this.type.level - 1) * .1));
  }
}

  // represents a conservation created by the player
class Conservation {
  // creates conservation at x, y with type
  // x, y are given in coordinates from 0 to 1
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // calculate consiousness
  consiousness(consiousness) {
    return consiousness * 1.2;
  }
}
