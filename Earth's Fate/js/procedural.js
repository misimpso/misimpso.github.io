// contains methods for procedurally generating balloons at startup
procedural = {
  // tracery rules used to generate red balloon text
  // the first layer is disaster type, second is title, third is description
  redBalloonSpellbooks: {
    "Flood": {
      "Dam Construction": tracery.createGrammar({
        "origin": ["A #problem# in a #adjective1# dam in continent_name led to #adjective2# flooding downstream."],
        "problem": ["failure", "breach"],
        "adjective1": ["important", "vital", "critical"],
        "adjective2": ["massive", "destructive"]
      }),
      "Soil Erosion": tracery.createGrammar({
        "origin": ["#adjective1.capitalize# soil erosion led to a #adjective2# flood in continent_name."],
        "adjective1": ["high", "excessive", "problematic", "extreme", "precarious"],
        "adjective2": ["damaging", "destructive", "harmful"]
      })
    },
    "Disease": {
      "Pollution": tracery.createGrammar({
        "origin": ["Pollutants released by continent_adjective #noun1# into #noun2# made #noun3# #adjective#."],
        "noun1": ["industry", "companies", "factories"],
        "noun2": ["the air", "the water", "food supplies", "drinking water"],
        "noun3": ["citizens", "workers", "people"],
        "adjective": ["very ill", "sick"]
      }),
      "Overcrowding": tracery.createGrammar({
        "origin": ["Overcrowding in #adjective1.a# city in continent_name led to the outbreak of #adjective2.a# disease."],
        "adjective1": ["large", "crowded", "huge", "massive", "populous", "teeming", "jam-packed"],
        "adjective2": ["deadly", "infectious", "lethal", "violent", "dangerous", "virulent"]
      })
    },
    "Drought": {
      "Unsustainable Agriculture": tracery.createGrammar({
        "origin": ["The #action# in continent_adjective areas with #noun# led to a drought."],
        "action": ["growth of #adjective# plants", "raising of #adjective# livestock"],
        "adjective": ["thirsty", "water-hungry"],
        "noun": ["little rain", "low water reservoirs", "little water", "desert-like climates"]
      }),
      "Water Depletion": tracery.createGrammar({
        "origin": ["#adjective1.capitalize# water use by #noun1# in continent_name left #noun2# depleted, leading to a #adjective2# drought."],
        "adjective1": ["excessive", "extreme", "exorbitant", "unnecessary"],
        "noun1": ["cities", "farms", "factories"],
        "noun2": ["water reservoirs", "water sources", "the groundwater", "water supplies"],
        "adjective2": ["horrible", "devastating"]
      })
    },
    "Earthquake": {
      "Urban Development": tracery.createGrammar({
        "origin": ["#adjective.capitalize# buildings in a continent_adjective city were #verb# by a #class# earthquake."],
        "adjective": ["tall", "large", "important", "vital"],
        "verb": ["destroyed", "toppled", "badly damaged", "crippled"],
        "class": ["magnitude 6", "magnitude 7", "magnitude 8", "magnitude 9"]
      })
    },
    "Tornado": {
      "Rural Development": tracery.createGrammar({
        "origin": ["#noun.capitalize# built in tornado-prone areas of continent_name were #verb# by a #class# tornado."],
        "noun": ["homes", "towns", "farms", "factories"],
        "verb": ["destroyed", "damaged", "crippled"],
        "class": ["F-2", "F-3", "F-4", "F-5"]
      })
    },
    "Tsunami": {
      "Coastal Development": tracery.createGrammar({
        "origin": ["Coastal #noun# were #verb# as a #class# tsunami hit continent_name."],
        "noun": ["towns", "cities", "homes", "developments", "industries"],
        "verb": ["washed away", "crushed", "flooded", "torn apart"],
        "class": ["magnitude 2", "magnitude 3", "magnitude 4"]
      })
    },
    "Hurricane": {
      "Wetland Destruction": tracery.createGrammar({
        "origin": ["The #action# of #thing# in continent_name for #reason# left it vulnerable to a #adjective# hurricane."],
        "action": ["destruction", "ravaging", "elimination", "devastation"],
        "thing": ["wetlands", "coastal wetlands"],
        "reason": ["urban develepment", "agriculture", "industry"],
        "adjective": ["category three", "category four", "category five"]
      })
    }
  },

  // tracery rules used to generate green balloon text
  // first layer is title, second is description
  greenBalloonSpellbooks: {
    "Sustainable Technology": tracery.createGrammar({
      "origin": ["#profession.capitalize# in continent_name have made #adjective# #noun# in the field of #technology#."],
      "profession": ["scientists", "engineers"],
      "adjective": ["ground-breaking", "revolutionary", "exciting", "innovative", "radical new", "cutting edge"],
      "noun": ["discoveries", "advancements", "refinements", "breakthroughs"],
      "technology": ["solar energy", "geothermal energy", "wind energy", "hydropower", "biomass energy", "electric vehicles", "pollution control", "recycling",
        "waste treatment", "sustainable agriculture", "mass transportation", "clean fuels", "habitat restoration", "reforestation", "composting", "sustainable construction",
        "water reclamation", "groundwater renewal", "sustainable heating", "carbon emission reduction", "factory logistics", "urban farming", "city planning", "energy storage",
        "energy transportation"]
    }),
    "Environmental Policy": tracery.createGrammar({
      "origin": ["#organization.capitalizeAll# in continent_name have #verb# #noun.a# to #purpose#."],
      "organization": ["governments", "agencies", "committees"],
      "verb": ["signed", "written", "passed", "created"],
      "noun": ["proposal", "agreement", "bill", "law"],
      "purpose": ["reduce carbon emissions", "increase clean energy", "reduce traffic", "slow habitat destruction", "incentivize electric vehicles", "encourage recycling",
        "reduce air pollution", "better regulate factories"]
    }),
    "Environmental Group": tracery.createGrammar({
      "origin": ["A new environmental group called the #groupname# has been #verb#."],
      "groupname": ["continent_adjective #goodthing.capitalizeAll##goodaction.capitalizeAll# #type.capitalizeAll#",
        "continent_adjective Nations Against #badthing.capitalizeAll# #type.capitalizeAll#"],
      "goodthing": ["forest", "clean air", "environment", "clean energy", "recycling"],
      "goodaction": ["", " protection", " promotion"],
      "badthing": ["air pollution", "deforestation", "carbon emissions", "waste", "water pollution", "fossil fuels"],
      "type": ["committee", "agency", "society", "institute"],
      "verb": ["formed", "founded", "created"]
    })
  },

  // fills in continent_name and continent_adjective tags in str with data from continent
  fillInContinent(str, continent) {
    var step1 = str.replace("continent_name", continent.fullname);
    var step2 = step1.replace("continent_adjective", continent.adjective);
    return step2;
  },

  // generates count red balloons and adds them to data
  // tries to fill gaps in data by prioritizing years and continents with fewer balloons
  // should be run at startup
  generateRedBalloons(count) {
    // used to record balloon count at each year
    var redYearCounts = new Map();
    for(var i = 1900; i <= 2050; i++) {
      redYearCounts.set(i, 0);
    }

    // used to record balloon count on each continent
    var redContinentCounts = new Map();
    for(var i = 0; i < continents.length; i++) {
      if(continents[i].name != "Antarctica") {
        redContinentCounts.set(continents[i], 0);
      }
    }

    // loop through existing disasters
    for(var i = 0; i < data.length; i++) {
      // get existing red balloon
      red = data[i];

      // update year counts
      if(redYearCounts.has(red.date)) {
        redYearCounts.set(red.date, redYearCounts.get(red.date) + 1);
      }

      // update continent counts
      var continent = worldmap.getContinent(red.xscale * gui.worldmap.width, red.yscale * gui.worldmap.height);
      if(continent != undefined && redContinentCounts.has(continent)) {
        redContinentCounts.set(continent, redContinentCounts.get(continent) + 1);
      }
    }

    // sort by count
    sortFunction = function(a, b) {
      return a[1] - b[1];
    };

    // turn year map into sorted list
    redYearList = []
    for(var [k, v] of redYearCounts) {
      redYearList.push( [k, v] );
    }
    redYearList.sort(sortFunction);

    // turn continent map into sorted list
    redContinentList = []
    for(var [k, v] of redContinentCounts) {
      redContinentList.push( [k, v] );
    }
    redContinentList.sort(sortFunction);

    // get list of red balloon types
    var types = Object.keys(this.redBalloonSpellbooks);

    // generate count new balloons
    generated = []
    while(generated.length < count) {
      // pick year randomly from first 50% of list and update year sorted list
      var yearIndex = Math.floor(Math.random() * redYearList.length * 0.5);
      var year = redYearList[yearIndex][0];
      redYearList[yearIndex][1]++;
      redYearList.sort(sortFunction);

      // pick continent randomly from first 5 and update continent sorted list
      var continentIndex = Math.floor(Math.random() * 5);
      var continent = redContinentList[continentIndex][0];
      redContinentList[continentIndex][1]++;
      redContinentList.sort(sortFunction);

      // get random position from continent
      var i = Math.floor(Math.random() * continent.positions.size);
      var position;
      for(let p of continent.positions) {
        if(i > 0) i--;
        else {
          position = p;
          break;
        }
      }

      // extract relative coordinates from position string
      position = position.split(",");
      var x = parseInt(position[0], 10) / gui.worldmap.width;
      var y = parseInt(position[1], 10) / gui.worldmap.height;

      // choose type, title and generate description
      var type = types[Math.floor(Math.random() * types.length)];
      var titles = Object.keys(this.redBalloonSpellbooks[type]);
      var title = titles[Math.floor(Math.random() * titles.length)];
      var description = this.redBalloonSpellbooks[type][title].createFlattened();
      description = this.fillInContinent(description, continent);

      // create new balloon
      generated.push( { "date": year, "location": continent.fullname, "xscale": x, "yscale": y, "type": type, "title": title, "description": description} );
    }

    // sort data by year
    dataSortFunction = function(a, b) {
      return a.date - b.date;
    };

    // add new balloons and sort
    Array.prototype.push.apply(data, generated);
    data.sort(dataSortFunction);
  },

  // generates count green balloons and adds them to data
  // tries to fill gaps in data by prioritizing years and continents with fewer balloons
  // should be run at startup
  generateGreenBalloons(count) {
    // used to record balloon count at each year
    var greenYearCounts = new Map();
    for(var i = 1900; i <= 2050; i++) {
      greenYearCounts.set(i, 0);
    }

    // used to record balloon count on each continent
    var greenContinentCounts = new Map();
    for(var i = 0; i < continents.length; i++) {
      if(continents[i].name != "Antarctica") {
        greenContinentCounts.set(continents[i], 0);
      }
    }

    // loop through existing disasters
    for(var i = 0; i < conData.length; i++) {
      // get existing green balloon
      green = conData[i];

      // update year counts
      if(greenYearCounts.has(green.date)) {
        greenYearCounts.set(green.date, greenYearCounts.get(green.date) + 1);
      }

      // update continent counts
      var continent = worldmap.getContinent(green.xscale * gui.worldmap.width, green.yscale * gui.worldmap.height);
      if(continent != undefined && greenContinentCounts.has(continent)) {
        greenContinentCounts.set(continent, greenContinentCounts.get(continent) + 1);
      }
    }

    // sort by count
    sortFunction = function(a, b) {
      return a[1] - b[1];
    };

    // turn year map into sorted list
    greenYearList = []
    for(var [k, v] of greenYearCounts) {
      greenYearList.push( [k, v] );
    }
    greenYearList.sort(sortFunction);

    // turn continent map into sorted list
    greenContinentList = []
    for(var [k, v] of greenContinentCounts) {
      greenContinentList.push( [k, v] );
    }
    greenContinentList.sort(sortFunction);

    // get list of possible titles
    var titles = Object.keys(this.greenBalloonSpellbooks);

    // generate count new balloons
    generated = []
    while(generated.length < count) {
      // pick year randomly from first 50% of list and update year sorted list
      var yearIndex = Math.floor(Math.random() * greenYearList.length * 0.5);
      var year = greenYearList[yearIndex][0];
      greenYearList[yearIndex][1]++;
      greenYearList.sort(sortFunction);

      // pick continent randomly from first 5 and update continent sorted list
      var continentIndex = Math.floor(Math.random() * 5);
      var continent = greenContinentList[continentIndex][0];
      greenContinentList[continentIndex][1]++;
      greenContinentList.sort(sortFunction);

      // get random position from continent
      var i = Math.floor(Math.random() * continent.positions.size);
      var position;
      for(let p of continent.positions) {
        if(i > 0) i--;
        else {
          position = p;
          break;
        }
      }

      // extract relative coordinates from position string
      position = position.split(",");
      var x = parseInt(position[0], 10) / gui.worldmap.width;
      var y = parseInt(position[1], 10) / gui.worldmap.height;

      // pick title from list and generate description using tracery
      var title = titles[Math.floor(Math.random() * titles.length)];
      var description = this.greenBalloonSpellbooks[title].createFlattened();
      description = this.fillInContinent(description, continent);

      // create new balloon
      generated.push( { "date": year, "location": continent.fullname, "xscale": x, "yscale": y, "title": title, "description": description} );
    }

    // sort data by year
    dataSortFunction = function(a, b) {
      return a.date - b.date;
    };

    // add new balloons and sort
    Array.prototype.push.apply(conData, generated);
    conData.sort(dataSortFunction);
  }
}
