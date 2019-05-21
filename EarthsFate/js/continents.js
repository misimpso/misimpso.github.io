// create continents list
const continents = [];

// North America
continents.push({
  name: "N America",
  fullname: "North America",
  adjective: "North American",
  positions: northAmericaPositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return 2;
    } else if(year < 1800) {
      return interpolate(2, 7, (year-1750)/50);
    } else if(year < 1850) {
      return interpolate(7, 26, (year-1800)/50);
    } else if(year < 1900) {
      return interpolate(26, 82, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(82, 172, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(172, 307, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(307, 337, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(337, 345, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(345, 351, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(351, 433, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(433, 398, (year-2050)/100);
    }
  },

  // production
  baseProduction: 10,
  growthProduction: 4,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});


// South America
continents.push({
  name: "S America",
  fullname: "South America",
  adjective: "South American",
  positions: southAmericaPositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return interpolate(10, 16, (year-1700)/50);;
    } else if(year < 1800) {
      return interpolate(16, 24, (year-1750)/50);
    } else if(year < 1850) {
      return interpolate(24, 38, (year-1800)/50);
    } else if(year < 1900) {
      return interpolate(38, 74, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(74, 167, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(167, 511, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(511, 577, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(577, 590, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(590, 603, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(603, 784, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(784, 912, (year-2050)/100);
    }
  },

  // starting production
  baseProduction: 10,
  growthProduction: 2,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});


// Europe
continents.push({
  name: "Europe",
  fullname: "Europe",
  adjective: "European",
  positions: europePositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return interpolate(125, 163, (year-1700)/50);
    } else if(year < 1800) {
      return interpolate(163, 203, (year-1750)/50);
    } else if(year < 1850) {
      return interpolate(203, 276, (year-1800)/50);
    } else if(year < 1900) {
      return interpolate(276, 408, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(408, 547, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(547, 729, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(729, 732, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(732, 738, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(738, 740, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(740, 734, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(734, 517, (year-2050)/100);
    }
  },

  // starting production
  baseProduction: 30,
  growthProduction: 3,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});


// Africa
continents.push({
  name: "Africa",
  fullname: "Africa",
  adjective: "African",
  positions: africaPositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return 106;
    } else if(year < 1800) {
      return interpolate(106, 107, (year-1750)/50);
    } else if(year < 1850) {
      return interpolate(107, 111, (year-1800)/50);
    } else if(year < 1900) {
      return interpolate(111, 133, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(133, 221, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(221, 767, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(767, 973, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(973, 1022, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(1022, 1052, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(1052, 2478, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(2478, 2308, (year-2050)/100);
    }
  },

  // starting production
  baseProduction: 10,
  growthProduction: 2,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});


// Asia
continents.push({
  name: "Asia",
  fullname: "Asia",
  adjective: "Asian",
  positions: asiaPositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return interpolate(436, 502, (year-1750)/50);
    } else if(year < 1800) {
      return interpolate(502, 635, (year-1750)/50);
    } else if(year < 1850) {
      return interpolate(635, 809, (year-1800)/50);
    } else if(year < 1900) {
      return interpolate(809, 947, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(947, 1402, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(1402, 3634, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(3634, 4054, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(4054, 4164, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(4164, 4250, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(4250, 5267, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(5267, 5561, (year-2050)/100);
    }
  },

  // starting production
  baseProduction: 20,
  growthProduction: 3,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});


// Australia
continents.push({
  name: "Australia",
  fullname: "Australia",
  adjective: "Australian",
  positions: australiaPositions,

  // returns rough historical/estimated population in millions
  // works for year between 1700 to 2150
  basePopulation: function(year) {
    if(year < 1750) {
      return interpolate(3, 2, (year-1750)/50);
    } else if(year < 1800) {
      return 2;
    } else if(year < 1850) {
      return 2;
    } else if(year < 1900) {
      return interpolate(2, 6, (year-1850)/50);
    } else if(year < 1950) {
      return interpolate(6, 13, (year-1900)/50);
    } else if(year < 1999) {
      return interpolate(13, 30, (year-1950)/49);
    } else if(year < 2008) {
      return interpolate(30, 34, (year-1999)/9);
    } else if(year < 2010) {
      return interpolate(34, 37, (year-2008)/2);
    } else if(year < 2012) {
      return interpolate(37, 38, (year-2010)/2);
    } else if(year < 2050) {
      return interpolate(38, 57, (year-2012)/38);
    } else if(year < 2150) {
      return interpolate(57, 51, (year-2050)/100);
    }
  },

  // starting production
  baseProduction: 10,
  growthProduction: 2,

  // measurement of environmental consciousness from 1-100
  baseConsciousness: 50,
  decayConsciousness: 1
});

// Antarctica
continents.push({
  name: "Antarctica",
  fullname: "Antarctica",
  adjective: "Antarctican",
  positions: antarcticaPositions,

  basePopulation: function(year) { return 0; },
  baseProduction: 0,
  growthProduction: 0,
  baseConsciousness: 100,
  decayConsciousness: 0
});
