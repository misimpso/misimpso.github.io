/***********************************
* Game Prototype for CMPM 120
* Zachary Friedrich, Michael Simpson, Jeremy Del Carpio, TJ Dooley
***********************************/

// Global Variables
const canvas = document.getElementById('canvas');
	canvas.width = gui.width;
	canvas.height = gui.height;
const ctx = canvas.getContext('2d');
const guioverlay = new Image();
	guioverlay.src = "assets/gui/guioverlayemptynew.png";

var start = false;
var endGameState = false;

// 0: main menu, 1: game
var gameState = 0;

function gameStart() {
	procedural.generateRedBalloons(50);
	procedural.generateGreenBalloons(40);

	status.start();
	worldmap.start();
	disastermenu.start();
	balloons.start();
    advisors.start();
}

// update game objects
function gameUpdate() {
	switch(gameState) {
		// menus
		case 0:
			if(enableSounds == true) themeSound.play();
		break;

		// in game
		case 1:
			if(!start) {
				gameStart();  //Initialize game
				start = true; //Game is started
			}
			if(enableSounds == true) {
		    themeSound.stop();
		    backgroundSound1.play();
			}
			status.update();
			worldmap.update();
			disastermenu.update();
            particle_system.update();
			balloons.update();
			advisors.update();
			break;
	}
	gameState = updateCurrentMenu();
}

// draw game objects
function gameDraw() {
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	switch(gameState) {
		// menus
		case 0:
		break;

		// in game
		case 1:
			// draw gui overlay
			ctx.drawImage(guioverlay, 0, 0, canvas.width, canvas.height);
			worldmap.draw();
			status.draw();
            particle_system.draw();
			balloons.draw();
			advisors.draw();
			disastermenu.draw();
		break;

	}
	drawCurrentMenu();
  if(endGameState == true) showEndGame();
}

// Run the Game
setInterval(gameUpdate, 10); 	// update 100 times per second
setInterval(gameDraw, 16);  	// draw at roughly 60 FPS
