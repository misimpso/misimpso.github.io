// gui constants measured from guioverlayempty.png
const gui = {
	// overall dimensions
	width: 1078,
	height: 600,

	status: {
		// health bar
		healthX: 904,
		healthY: 299,
		healthW: 147,
		healthH: 21,
		healthLowFill: [229, 92, 95],
		healthHighFill: [229, 92, 95],

		// level indicator
		levelX: 910,
		levelY: 414,
		levelFont: "12px Geometos Rounded",
		levelFill: "rgb(181, 195, 255)",

		// experience bar
		expX: 919,
		expY: 411,
		expW: 116,
		expH: 6,
		expFill: [181, 195, 255],

		// year indicator
		yearX: 998,
		yearY: 502,
		yearFont: "32px Geometos Rounded",
		yearFill: "rgb(181, 195, 255)",

		// pause button
		pauseX: 977,
		pauseY: 537,
		pauseFont: "16px Geometos Rounded",
		pauseFill: "rgb(181, 195, 255)",
		pauseW: 142,
		pauseH: 26,

		// speed buttons
		speedRadius: 7,
		speedHalfX: 920,
		speedHalfY: 562,
		speedNormalX: 977,
		speedNormalY: 562,
		speedDoubleX: 1034,
		speedDoubleY: 562,
		speedFill: "rgb(181, 195, 255)"
	},

	// world map
	worldmap: {
		// dimensions
		width: 878,
		height: 493,

		// continent name
		continentNameX: 978,
		continentNameY: 70,
		continentNameFont: "24px Geometos Rounded",
		continentNameFill: "rgb(78, 82, 110)",

		// continent population
		continentPopulationX: 992,
		continentPopulationY: 118,
		continentPopulationFont: "38px Geometos Rounded",
		continentPopulationFill: "rgb(181, 195, 255)",

		// continent consciousness bar
		continentConsciousnessX: 933,
		continentConsciousnessY: 156,
		continentConsciousnessW: 117,
		continentConsciousnessH: 21,
		continentConsciousnessLowFill: [229, 92, 95],
		continentConsciousnessHighFill: [14, 213, 95],

		// continent production bar
		continentProductionX: 933,
		continentProductionY: 196,
		continentProductionW: 117,
		continentProductionH: 21,
		continentProductionLowFill: [14, 213, 95],
		continentProductionHighFill: [229, 92, 95]
	},

	// disaster menu
	disastermenu: {
		// dimensions
		width: 878,
		height: 108,

		// locations for disaster icons
		iconSize: 90,
		iconFirstX: 51,
		iconY: 546,
		iconSpacing: 21,
		iconSelectedFill: "rgb(255, 0, 0)",

		// locations for disaster hotkeys (disabled currently)
		hotkeyOffsetX: -43,
		hotkeyOffsetY: -28,
		hotkeyFont: "16px Geometos Rounded",
		hotkeyFill: "rgb(0, 0, 0)",

		// level up buttons
		levelUpButtonX: 26,
		levelUpButtonY: 6,
		levelUpButtonRadius: 20,

		// level for disaster
		levelOffsetX: 46,
		levelOffsetY: 30,
		levelFont: "14px Geometos Rounded",
		levelFill: "rgb(0, 0, 0)",

		// level up graphic
		levelUpX: 0,
		levelUpY: 0,
		levelUpTextX: 977,
		levelUpTextY: 385,
		levelUpTextFont: "60px Geometos Rounded",
		levelUpTextFill: "rgb(181, 195, 255)",
        levelUpCounter: 250 // Level up graphic will stay up for 2.5 seconds
	},

	advisors: {
		iconSize: 85,
		anarchyX: 10,
		anarchyY: 395,
		motherX: 780,
		motherY: 395
	}
};
