function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
	this.quick_play = function(){
	    this.sound.currentTime = 0.0;
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

var enableSounds = true;

var themeSound = new sound("assets/sounds/themeMusic.mp3");
var backgroundSound1 = new sound("assets/sounds/backMusic1.mp3");
var backgroundSound2 = new sound("assets/sounds/backMusic2.mp3");
var backgroundSound3 = new sound("assets/sounds/backMusic3.mp3");
var popSound = new sound("assets/sounds/popSound.mp3");
var pushSound = new sound("assets/sounds/pushSound.mp3");
var healingSound = new sound("assets/sounds/healingSound.mp3");

var earthquakeSound = new sound("assets/sounds/earthquakeSound.mp3");
var volcanoSound = new sound("assets/sounds/volcanoSound.mp3");
var floodSound = new sound("assets/sounds/floodSound.mp3");
var tsunamiSound = new sound("assets/sounds/tsunamiSound.mp3");
var tornadoSound = new sound("assets/sounds/tornadoSound.mp3");
var droughtSound = new sound("assets/sounds/droughtSound.mp3");
var hurricaneSound = new sound("assets/sounds/hurricaneSound.mp3");
var diseaseSound = new sound("assets/sounds/diseaseSound.mp3");

function stopSounds() {
	themeSound.stop();
	backgroundSound1.stop();
	backgroundSound2.stop();
	backgroundSound3.stop();
	popSound.stop();
	pushSound.stop();
	diseaseSound.stop();
	droughtSound.stop();
	earthquakeSound.stop();
	floodSound.stop();
	hurricaneSound.stop();
	tornadoSound.stop();
	tsunamiSound.stop();
	volcanoSound.stop();
	healingSound.stop();
	enableSounds = false;
}	