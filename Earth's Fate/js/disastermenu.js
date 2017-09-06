// represents the bar of disasters at the bottom of the screen
const disastermenu = {
    disasterSelectedIndex: undefined,
    disasterSelected: undefined,
    disasterMouseoverIndex: undefined,
    disasterPopup: undefined,

    levelUpPoints: 3,
    levelUpBarImage: new Image(),
    levelUpButtonImage: new Image(),

    start: function() {
        // load images
        this.levelUpBarImage.src = "assets/gui/levelupbar.png";
        this.levelUpButtonImage.src = "assets/gui/levelupsmall.png";

        // bind left mouse click for disaster selection
        mouse.addMousePressEvent(mb.left, function(e) { disastermenu.onmousepress(e); });

        // bind left arrow and a key to move disaster selection
        keyboard.addKeyReleaseEvent(keys.left, function(e) { disastermenu.onleftarrowrelease(e); });
        keyboard.addKeyReleaseEvent(keys.a, function(e) { disastermenu.onleftarrowrelease(e); });

        // bind right arrow and d key to move disaster selection
        keyboard.addKeyReleaseEvent(keys.right, function(e) { disastermenu.onrightarrowrelease(e); });
        keyboard.addKeyReleaseEvent(keys.d, function(e) { disastermenu.onrightarrowrelease(e); });

        // bind up arrow and w to level selected disaster
        keyboard.addKeyReleaseEvent(keys.up, function(e) { disastermenu.onuparrowrelease(e); });
        keyboard.addKeyReleaseEvent(keys.w, function(e) { disastermenu.onuparrowrelease(e); });

        // bind number keys for disaster selection
        for(var i = 0; i < disasters.length; i++) {
            var numkey = (i + 1) % 10;
            keyboard.addKeyReleaseEvent(keys.nums[numkey], function(e) { disastermenu.onnumrelease(e); });
        }
    },

    update: function() {
        if(gui.disastermenu.levelUpCounter > 0) {
            gui.disastermenu.levelUpCounter--;
        }
        // loop through disasters
        for(var i = 0; i < disasters.length; i++) {
            // calculate icon location
            var iconX = gui.disastermenu.iconFirstX + (gui.disastermenu.iconSize + gui.disastermenu.iconSpacing) * i;
            var iconY = gui.disastermenu.iconY;

            // check if mouse is over icon
            if(distance(mouse.x, mouse.y, iconX, iconY) <= gui.disastermenu.iconSize / 2) {
                if(this.disasterMouseoverIndex != i) {
                    // create a popup
                    this.disasterPopup = generateDisasterPopup(iconX, iconY, disasters[i]);
                    this.disasterMouseoverIndex = i;
                }
                return;
            }
        }
        // if mouse isnt over any icons remove the popup
        this.disasterMouseoverIndex = undefined;
        this.disasterPopup = undefined;
    },

    onmousepress: function(e) {
        // if mouse is on disaster menu
        if(mouse.x <= gui.disastermenu.width && mouse.y >= gui.height - gui.disastermenu.height) {
            // check if mouse click is on level up buttons
            if(this.levelUpPoints > 0) {
                // loop through disasters
                for(var i = 0; i < disasters.length; i++) {
                    // calculate button location
                    var buttonX = gui.disastermenu.iconFirstX + (gui.disastermenu.iconSize + gui.disastermenu.iconSpacing) * i +
                    gui.disastermenu.levelUpButtonX + gui.disastermenu.levelUpButtonRadius;
                    var buttonY = gui.disastermenu.iconY +
                    gui.disastermenu.levelUpButtonY + gui.disastermenu.levelUpButtonRadius;

                    // check if under mouse
                    if(distance(mouse.x, mouse.y, buttonX, buttonY) <= gui.disastermenu.levelUpButtonRadius) {
                        // level up disaster
                        disasters[i].level++;
                        this.levelUpPoints--;
                        return;
                    }
                }
                } else {
                if(this.disasterMouseoverIndex !== undefined) {
                    // select disaster under mouse
                    this.disasterSelectedIndex = this.disasterMouseoverIndex;
                    this.disasterSelected = disasters[this.disasterMouseoverIndex];
                }
            }
        }
    },

    onleftarrowrelease: function(e) {
        // move disaster selection left
        if(this.disasterSelectedIndex == undefined) {
            this.disasterSelectedIndex = disasters.length - 1;
            this.disasterSelected = disasters[this.disasterSelectedIndex];
            } else {
            this.disasterSelectedIndex--;
            if(this.disasterSelectedIndex < 0)
            this.disasterSelectedIndex = disasters.length - 1;
            this.disasterSelected = disasters[this.disasterSelectedIndex];
        }
    },

    onrightarrowrelease: function(e) {
        // move disaster selection right
        if(this.disasterSelectedIndex == undefined) {
            this.disasterSelectedIndex = 0;
            this.disasterSelected = disasters[this.disasterSelectedIndex];
            } else {
            this.disasterSelectedIndex = (this.disasterSelectedIndex + 1) % disasters.length;
            this.disasterSelected = disasters[this.disasterSelectedIndex];
        }
    },

    onuparrowrelease: function(e) {
        // level up selected disaster
        if(this.disasterSelectedIndex !== undefined && this.levelUpPoints > 0) {
            this.disasterSelected.level++;
            this.levelUpPoints--;
        }
    },

    onnumrelease: function(e) {
        for(var i = 0; i < disasters.length; i++) {
            var numkey = (i + 1) % 10;
            // if num key maps to disaster
            if(keys.nums[numkey] == e.keyCode) {
                // if control is held
                if(keyboard.isKeyDown(keys.shift)) {
                    // level up disaster
                    if(this.levelUpPoints > 0) {
                        disasters[i].level++;
                        this.levelUpPoints--;
                    }
                    } else {
                    // just select or deselect
                    if(this.disasterSelectedIndex == i) {
                        this.disasterSelectedIndex = undefined;
                        this.disasterSelected = undefined;
                        } else {
                        this.disasterSelectedIndex = i;
                        this.disasterSelected = disasters[i];
                    }
                }
            }
        }
    },

    draw: function() {
        // set text alignment
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // draw unspent points
        ctx.font = gui.disastermenu.levelUpTextFont;
        ctx.fillStyle = gui.disastermenu.levelUpTextFill;
        ctx.fillText(this.levelUpPoints.toString(), gui.disastermenu.levelUpTextX, gui.disastermenu.levelUpTextY);

        // draw level up bar
        if(gui.disastermenu.levelUpCounter > 100) {
            ctx.drawImage(this.levelUpBarImage, gui.disastermenu.levelUpX, gui.disastermenu.levelUpY);
            if(gui.disastermenu.levelUpCounter <= 240 && gui.disastermenu.levelUpCounter >= 234) {
                particle_system.create(901 + (Math.random()*153), 335 + (Math.random()*88), "red");
                particle_system.create(901 + (Math.random()*153), 335 + (Math.random()*88), "yellow");
            }
        } else if(gui.disastermenu.levelUpCounter != 0) {
            ctx.globalAlpha = gui.disastermenu.levelUpCounter/100;
            ctx.drawImage(this.levelUpBarImage, gui.disastermenu.levelUpX, gui.disastermenu.levelUpY);
        }
        ctx.globalAlpha = 1;

        // loop through disasters
        for(var i = 0; i < disasters.length; i++) {
            // calculate icon location
            var iconX = gui.disastermenu.iconFirstX + (gui.disastermenu.iconSize + gui.disastermenu.iconSpacing) * i;
            var iconY = gui.disastermenu.iconY;

            // draw selection background if needed
            if(this.disasterSelectedIndex == i) {
                ctx.lineWidth = 0;
                ctx.fillStyle = gui.disastermenu.iconSelectedFill;
                ctx.beginPath();
                ctx.arc(iconX, iconY, gui.disastermenu.iconSize / 2 - 1, 0, 2 * Math.PI);
                ctx.fill();
            }

            // draw icon
            ctx.drawImage(disasters[i].image,
            iconX - gui.disastermenu.iconSize / 2, iconY - gui.disastermenu.iconSize / 2);

            // draw not leveled overlay if necessary
            if(disasters[i].level == 0) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(iconX, iconY, gui.disastermenu.iconSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // set text alignment
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // draw level text
            ctx.font = gui.disastermenu.levelFont;
            ctx.fillStyle = gui.disastermenu.levelFill;
            ctx.fillText(disasters[i].level.toString(), iconX + gui.disastermenu.levelOffsetX, iconY + gui.disastermenu.levelOffsetY);

            // draw level up button
            if(this.levelUpPoints > 0) {
                ctx.drawImage(this.levelUpButtonImage,
                iconX + gui.disastermenu.levelUpButtonX, iconY + gui.disastermenu.levelUpButtonY)
            }
        }

        // draw popup if necessary
        if(this.disasterPopup !== undefined) {
            this.disasterPopup.draw();
        }
    }
};
