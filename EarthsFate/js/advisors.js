function getLines(desc, maxWidth) {
    var words = desc.split(" ");
    var lines = [];
    var currentLine = words[0];
    for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
			} else {
			lines.push(currentLine);
			currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function mouseOverAdvisor(x, y, w) {
	if(Math.abs(mouse.x - (x + w/2)) <= w/2  && Math.abs(mouse.y - (y+w/2)) <= w/2) {
        return true;
    }
	return false;
}

const advisors = {
    //Data structure for storing advisors
    advisorList: [],
    pauseFlag: false,
    disasterFlag: false,
    
    //Images for each advisor
    motherImage: new Image(),
    anarchyImage: new Image(),
    
    //Constants for drawing each advisor
    advisorImageSize: gui.advisors.iconSize,
    anarchyPos:         {x: gui.advisors.anarchyX,   y: gui.advisors.anarchyY},
    motherNaturePos: {x: gui.advisors.motherX, y: gui.advisors.motherY},
    
    //Initializes each advisor, sets their image, and initial advice.
    start: function() {
        this.motherImage.src = "assets/advisors/mothernature85.png";
        this.anarchyImage.src = "assets/advisors/dragon85.png";
        
        this.advisorList.push({
            name: "Conservation",
            advice: []
        });
        
        this.advisorList.push({
            name: "Anarchy",
            advice: []
        });
        
        advisors.add("Anarchy", "Enact your revenge against this global pestilence.")
        advisors.add("Anarchy", "Select a natural disaster and click on a red balloon to unleash its power on the mortal world.")
        advisors.add("Conservation", "Help guide the people to a more environmentally conscious future.");
        advisors.add("Conservation", "Click on the green balloons to regain some health, and raise environmental consciousness.")
    },
    
    //Add advice to each advisor
    add: function(name, desc) {
        if(name == "Conservation") {
            this.advisorList[0].advice.push({
                words: desc,
                lifetime: 5,
                seen: false
            });
            } else if(name == "Anarchy") {
            this.advisorList[1].advice.push({
                words: desc,
                lifetime: 5,
                seen: false
            });
        }
    },
    
    //Checks various flags to determine if more advice needs to be generated.
    checkFlags: function() {
        if(!this.pauseFlag && status.year == 1950 && (!status.checkPause[0] || !status.checkPause[1]) ) {
            if(!status.checkPause[0]) {
                advisors.add("Conservation", "Remember, the game is still playable when it is paused.");
                this.pauseFlag = true;
            }
            if(!status.checkPause[1]) {
                advisors.add("Conservation", "Slow down time if you get overwhelmed.");
                this.pauseFlag = true;
            }
        }
        if(!this.disasterFlag) {
            for(disaster of disasters) {
                if(disaster.level >= 10) {
                    advisors.add("Anarchy", "Level up your disasters evenly for the most widespread damage. They won't see it coming!");
                    this.disasterFlag = true;
                    break;
                }
            }
        }
    },
    
    //Cleans up outdated advice
    update: function() {
        if(this.advisorList[0].advice.length != 0) {
            if(this.advisorList[0].advice[0].lifetime < 0) {
                this.advisorList[0].advice.splice(0, 1);
            }
        }
        if(this.advisorList[1].advice.length != 0) {
            if(this.advisorList[1].advice[0].lifetime < 0) {
                this.advisorList[1].advice.splice(0, 1);
            }
        }
    },
    
    //If the advice has been seen, decrement the lifetime
    decrLifetime: function() {
        if(this.advisorList[0].advice.length) {
            if(this.advisorList[0].advice[0].seen) {
                this.advisorList[0].advice[0].lifetime--;
            }
        }
        if(this.advisorList[1].advice.length) {
            if(this.advisorList[1].advice[0].seen) {
                this.advisorList[1].advice[0].lifetime--;
            }
        }
    },
    
    //Draw each advisor and, if hovered over, draw their respective advice
    draw: function() {
        ctx.lineWidth = 2;
        //Draw conservation advice box
        if(mouseOverAdvisor(this.motherNaturePos.x, this.motherNaturePos.y, this.advisorImageSize)) {
            if(this.advisorList[0].advice.length) {
                if(this.advisorList[0].advice[0].seen == false) this.advisorList[0].advice[0].seen = true;
                ctx.fillStyle = "rgb(33, 34, 46)";
                ctx.strokeStyle = "rgb(181, 195, 255)";
                ctx.rect(this.motherNaturePos.x - 250, this.motherNaturePos.y - 3, 250 + this.advisorImageSize / 2, this.advisorImageSize + 13);
                ctx.fill();
                ctx.stroke();
                ctx.font = "15px Geometos Rounded";
                ctx.fillStyle = "rgb(181, 195, 255)";
                ctx.fillText("Conservation Advisor", this.motherNaturePos.x - 125, this.motherNaturePos.y + 15);
                var wordage = getLines(this.advisorList[0].advice[0].words, 320);
                ctx.font = "15px Arial";
                ctx.fillStyle = "white";
                for(var i = 0; i != wordage.length; i++) {
                    ctx.textAlign = "start";
                    ctx.fillText(wordage[i], this.motherNaturePos.x - 230, this.advisorImageSize/2 + this.anarchyPos.y + 15*i - 5);
                }
            }
        }
        //Draw anarchist advice box
        if(mouseOverAdvisor(this.anarchyPos.x, this.anarchyPos.y, this.advisorImageSize)) {
            if(this.advisorList[1].advice.length) {
                if(this.advisorList[1].advice[0].seen == false) this.advisorList[1].advice[0].seen = true;
                ctx.fillStyle = "rgb(33, 34, 46)";
                ctx.strokeStyle = "rgb(181, 195, 255)";
                ctx.rect(this.anarchyPos.x + this.advisorImageSize/2, this.anarchyPos.y - 3, 250 + this.advisorImageSize / 2, this.advisorImageSize + 13);
                ctx.fill();
                ctx.stroke();
                ctx.font = "15px Geometos Rounded";
                ctx.fillStyle = "rgb(181, 195, 255)";
                ctx.fillText("Anarchist Advisor", this.anarchyPos.x + 205, this.anarchyPos.y + 15);
                var wordage = getLines(this.advisorList[1].advice[0].words, 320);
                ctx.font = "15px Arial";
                ctx.fillStyle = "white";
                for(var i = 0; i != wordage.length; i++) {
                    ctx.textAlign = "start";
                    ctx.fillText(wordage[i], this.anarchyPos.x + this.advisorImageSize + 15, this.advisorImageSize/2 + this.anarchyPos.y + 15*i - 5);
                }
            }
        }
        //Draw conservation advisor frame
        ctx.beginPath();
        ctx.fillStyle = "rgb(33, 34, 46)";
        if(this.advisorList[0].advice.length && this.advisorList[0].advice[0].seen == false) {
            ctx.strokeStyle = "rgb(239, 213, 95)";
            } else {
            ctx.strokeStyle = "rgb(181, 195, 255)";
        }
        ctx.lineWidth = 4;
        ctx.arc(this.motherNaturePos.x + this.advisorImageSize / 2, this.motherNaturePos.y + this.advisorImageSize / 2 + 3, this.advisorImageSize / 2 + 5, 0 , 2*Math.PI, false);
        ctx.stroke();
        ctx.fill();
        
        //Draw anarchist advisor frame
        ctx.beginPath();
        ctx.fillStyle = "rgb(33, 34, 46)";
        if(this.advisorList[1].advice.length && this.advisorList[1].advice[0].seen == false) {
            ctx.strokeStyle = "rgb(239, 213, 95)";
            } else {
            ctx.strokeStyle = "rgb(181, 195, 255)";
        }
        ctx.lineWidth = 4;
        ctx.arc(this.anarchyPos.x + this.advisorImageSize / 2, this.anarchyPos.y + this.advisorImageSize / 2 + 3, this.advisorImageSize / 2 + 5, 0 , 2*Math.PI, false);
        ctx.stroke();
        ctx.fill();
        
        //Draw their images
        ctx.drawImage(this.anarchyImage, this.anarchyPos.x, this.anarchyPos.y);
        ctx.drawImage(this.motherImage, this.motherNaturePos.x, this.motherNaturePos.y + 3);
    }
}                