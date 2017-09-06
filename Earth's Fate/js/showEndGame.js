function showEndGame() {
	if(status.year >= 2041) {
		ctx.font = "45px Geometos Rounded";
		ctx.fillStyle = "white";
		ctx.textAlign = "left";
		var max = 0;
		var favImageNumber = -1;
		for(var i = 0; i < status.favDisaster.length; ++i) {
			if(status.favDisaster[i] != 0 && status.favDisaster[i] > max) {
				max = status.favDisaster[i];
				favImageNumber = i;
			}
		}
		var favImage = new Image();
        var favDisasterName = "";
		switch(favImageNumber) {
			case 0:
			    favImage.src = "assets/disaster_icons/earthquake.png";
                favDisasterName = "Earthquake";
				break;
			case 1:
			    favImage.src = "assets/disaster_icons/volcano.png";
                favDisasterName = "Volcano";
				break;
			case 2:
			    favImage.src = "assets/disaster_icons/flood.png";
                favDisasterName = "Flood";
				break;
			case 3:
			    favImage.src = "assets/disaster_icons/tsunami.png";
                favDisasterName = "Tsunami";
				break;
			case 4:
			    favImage.src = "assets/disaster_icons/tornado.png";
                favDisasterName = "Tornado";
				break;
			case 5:
			    favImage.src = "assets/disaster_icons/drought.png";
                favDisasterName = "Drought";
				break;
			case 6:
			    favImage.src = "assets/disaster_icons/hurricane.png";
                favDisasterName = "Hurricane";
				break;
			case 7:
			    favImage.src = "assets/disaster_icons/disease.png";
                favDisasterName = "Disease";
				break;
            default:
                favImage.src = "assets/disaster_icons/nodisaster.png";
                favDisasterName = "Nothing"
		}
		if(status.totalKills > 750) {
			var anarchyEnd = new Image();
			anarchyEnd.src = "assets/gui/anarchyendgame.png";
			ctx.drawImage(anarchyEnd, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(favImage, 190, 185);
            ctx.font = "15px Geometos Rounded";
            ctx.textAlign = "middle";
            ctx.fillText(favDisasterName, 200, 288);
            ctx.font = "45px Geometos Rounded";
            ctx.textAlign = "left";
			ctx.fillText(status.conservationCaused, 415, 210);
			ctx.fillText(status.disastersCaused, 415, 270);
			ctx.fillText(Math.floor(status.totalKills), 270, 360);
			ctx.fillText(Math.floor(status.totalDamage), 270, 415);		
		} else {
			var conservEnd = new Image();
			conservEnd.src = "assets/gui/conservationendcard.png";
			ctx.drawImage(conservEnd, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(favImage, 610, 185);
            ctx.font = "15px Geometos Rounded";
            ctx.textAlign = "middle";
            ctx.fillText(favDisasterName, 620, 288);
            ctx.font = "45px Geometos Rounded";
            ctx.textAlign = "left";
			ctx.fillText(status.conservationCaused, 830, 210);
			ctx.fillText(status.disastersCaused, 830, 270);
			ctx.fillText(Math.floor(status.totalKills), 680, 360);
			ctx.fillText(Math.floor(status.totalDamage), 680, 415);
		}
	} else if(status.health <= 0) {
		ctx.fillStyle = "rgb(255, 92, 95)";
		ctx.textAlign = "middle";
        ctx.font = "45px Geometos Rounded";
		ctx.fillText("You have been consumed by humanity", canvas.width/2, 270);
	}
}