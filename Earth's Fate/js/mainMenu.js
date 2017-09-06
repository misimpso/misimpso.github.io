var menus = [];
var clicked = false;
var currentMenu = 0;
var mainMenuBG = new Image();
var titleImage = new Image();
var pauseImage = new Image();
var controlsImage = new Image();
var instructionsImage = new Image();
mainMenuBG.src = "assets/gui/menu_background.png";
titleImage.src = "assets/gui/menu_title.png";
pauseImage.src = "assets/gui/menu_pause.png";
controlsImage.src = "assets/gui/controls.png";
instructionsImage.src = "assets/gui/instructions.png";
var oldSpeed = 0;

mouse.addMousePressEvent(0, function() {
	clicked = true;
});

mouse.addMouseReleaseEvent(0, function() {
	clicked = false;
});

function mouseOverButton(menuOption) {
	if(mouse.x > menuOption.x
	&& mouse.x < menuOption.x+menuOption.w
	&& mouse.y > menuOption.y
	&& mouse.y < menuOption.y+menuOption.h) {
		return true;
	}
	return false;
}

//Main title screen
menus.push(new menuScreen(0, [new menuOption(540, 316, 400, 50, "Start Game"),
	                          new menuOption(540, 405, 400, 50, "How to Play"),
                              new menuOption(540, 495, 400, 50, "Settings")]));

//Start menu screen
menus.push(new menuScreen(1, [new menuOption(540, 316, 400, 50, "Normal"),
	                          new menuOption(540, 405, 400, 50, "Extreme"),
                              new menuOption(540, 495, 400, 50, "Back")]));

//How to Play
menus.push(new menuScreen(2, [new menuOption(540, 316, 400, 50, "Instructions"),
                              new menuOption(540, 405, 400, 50, "Controls"),
                              new menuOption(540, 495, 400, 50, "Back")]));

//Instructions
menus.push(new menuScreen(3, [new menuOption(540, 570, 400, 50, "Back")]));

//Controls
menus.push(new menuScreen(4, [new menuOption(540, 495, 400, 50, "Back")]));

//Settings
menus.push(new menuScreen(5, [new menuOption(540, 316, 400, 50, "Sound On"),
	                          new menuOption(540, 405, 400, 50, "Sound Off"),
                              new menuOption(540, 495, 400, 50, "Back")]));

//In-game pause menu
menus.push(new menuScreen(6, [new menuOption(440, 209, 244, 38, "Resume"),
	                          new menuOption(440, 279, 244, 38, "Restart"),
                              new menuOption(440, 349, 244, 38, "Toggle Sound")]));

//End game
menus.push(new menuScreen(7, [new menuOption(540, 550, 400, 50, "Restart")]));


//Constructor for each menu. Populate it with menu options(buttons) to navigate through the menu
function menuScreen(state, menuOptions) {
	this.state = state;
	this.menuOptions = menuOptions;
	this.draw = function() {
		drawMenuOptions(menuOptions);
	}
	this.update = function() {
		for(var i = 0; i != this.menuOptions.length; i++) {
			if(mouseOverButton(menuOptions[i]) && clicked) {
				handleButtonClick(i);
			}
		}
	}
}

//Constructor for each button on the menu
function menuOption(x, y, w, h, title) {
	this.x = x-w/2;
	this.y = y-h/2;
	this.w = w;
	this.h = h;
	this.title = title;
	this.draw = function() {
		if(mouseOverButton(this)) {
			ctx.fillStyle = "rgb(255, 140, 142)";
		} else {
			ctx.fillStyle = "rgb(255, 92, 95)";
		}
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = "white";
		if(currentMenu != 6) {
			ctx.font = "25px Geometos Rounded";
		} else {
			ctx.font = "21px Geometos Rounded";
		}
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(this.title, this.x + this.w/2, this.y + 1*ctx.font.slice(0, 2));
	}
}

//Loops through given menu options and displays them
function drawMenuOptions(menuOptions) {
	for(var i = 0; i != menuOptions.length; i++) {
		menuOptions[i].draw();
	}
}

function setCurrentMenu(menuNum) {
	currentMenu = menuNum;
}

function getCurrentMenu() {
    return currentMenu;
}

//Updates mouse click and button click
function updateCurrentMenu() {
	if(currentMenu == menus.length) {
		return 1;
	} else if(currentMenu == 6){
		menus[currentMenu].update();
		return 1;
	} else {
		menus[currentMenu].update();
		return 0;
	}
}

//Draws current menu
function drawCurrentMenu() {
	if(currentMenu !== menus.length && currentMenu !== 6) {
		ctx.drawImage(mainMenuBG, 0, 0, canvas.width, canvas.height);
		menus[currentMenu].draw();
        if(currentMenu == 0 || currentMenu == 1) ctx.drawImage(titleImage, 0, 0, canvas.width, canvas.height);
        if(currentMenu == 3) ctx.drawImage(instructionsImage, 0, 0, canvas.width, canvas.height);
        if(currentMenu == 4) ctx.drawImage(controlsImage, 0, 0, canvas.width, canvas.height);
	} else if(currentMenu == 6) {
		ctx.drawImage(pauseImage, 0, 0, canvas.width, canvas.height);
		menus[currentMenu].draw();
	}
}

//Handles the functionality of each button depending on the current menu
function handleButtonClick(i) {
	if(currentMenu == 0) { //Main title menu
		if(menus[currentMenu].menuOptions[i].title == "Start Game") {
			currentMenu = 1;
		} else if(menus[currentMenu].menuOptions[i].title == "How to Play") {
			currentMenu = 2;
		} else if(menus[currentMenu].menuOptions[i].title == "Settings") {
			currentMenu = 5;
		}
	} else if(currentMenu == 1) { //Start game menu
		if(menus[currentMenu].menuOptions[i].title == "Normal") {
			currentMenu = menus.length;
		} else if(menus[currentMenu].menuOptions[i].title == "Extreme") {
			status.maxHealth = status.maxHealth / 2;
			currentMenu = menus.length;
		} else if(menus[currentMenu].menuOptions[i].title == "Back") {
			currentMenu = 0;
		}
	} else if(currentMenu == 2) { //How to play menu
        if(menus[currentMenu].menuOptions[i].title == "Instructions") {
            currentMenu = 3;
        } else if(menus[currentMenu].menuOptions[i].title == "Controls") {
            currentMenu = 4;
        } else if(menus[currentMenu].menuOptions[i].title == "Back") {
			currentMenu = 0;
		}
	} else if(currentMenu == 3) { // Instructions
        if(menus[currentMenu].menuOptions[i].title == "Back") {
            currentMenu = 2;
        }
    } else if(currentMenu == 4) { //Controls
        if(menus[currentMenu].menuOptions[i].title == "Back") {
            currentMenu = 2;
        }
    } else if(currentMenu == 5) { //Settings menu
		if(menus[currentMenu].menuOptions[i].title == "Sound On") {
			enableSounds = true;
		} else if(menus[currentMenu].menuOptions[i].title == "Sound Off") {
			stopSounds(); // also disables sound
		} else if(menus[currentMenu].menuOptions[i].title == "Back") {
			currentMenu = 0;
		}
	} else if(currentMenu == 6) { //Pause Menu
		if(menus[currentMenu].menuOptions[i].title == "Resume") {
		    status.speedFactor = 1;
			currentMenu = menus.length;
		} else if(menus[currentMenu].menuOptions[i].title == "Restart") {
			window.location.reload();
		} else if(menus[currentMenu].menuOptions[i].title == "Toggle Sound") {
			enableSounds = (!enableSounds);
			if(enableSounds == false) stopSounds();
		}
	} else if(currentMenu == 7) { //End Game Menu
		if(menus[currentMenu].menuOptions[i].title == "Restart") {
			window.location.reload();
		}
	}
	clicked = false;
}
