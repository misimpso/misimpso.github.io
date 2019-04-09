let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let lyrics = `Yo listen up, here's the story
About a little guy that lives in a blue world
And all day and all night and everything he sees is just blue
Like him, inside and outside
Blue his house with a blue little window
And a blue Corvette
And everything is blue for him
And himself and everybody around
'Cause he ain't got nobody to listen
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
I have a blue house with a blue window
Blue is the color of all that I wear
Blue are the streets and all the trees are too
I have a girlfriend and she is so blue
Blue are the people here that walk around
Blue like my Corvette, it's in and outside
Blue are the words I say and what I think
Blue are the feelings that live inside me
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
I have a blue house with a blue window
Blue is the color of all that I wear
Blue are the streets and all the trees are too
I have a girlfriend and she is so blue
Blue are the people here that walk around
Blue like my Corvette, it's in and outside
Blue are the words I say and what I think
Blue are the feelings that live inside me
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
I'm blue da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa
Da ba dee da ba daa, da ba dee da ba daa, da ba dee da ba daa`;

let lyrics_list = lyrics.split(' ').map((a) => { return a.replace(/([\.\,\?\'\"\(\)])/, '').toLowerCase(); });

let padding = 10;
let position = null;
let w = (canvas.width - (padding * 2)) / lyrics_list.length;

/*for (let i = 0; i <= lyrics_list.length; i++) {
    
    position = (i / (lyrics_list.length)) * (canvas.width - padding * 2);
    
    // vertical
	ctx.beginPath();
	ctx.moveTo(position + padding, padding);
	ctx.lineTo(position + padding, canvas.width - padding);
	ctx.stroke();
    
    // horizontal
	ctx.beginPath();
	ctx.moveTo(padding, position + padding);
	ctx.lineTo(canvas.width - padding, position + padding);
	ctx.stroke();
}*/

for (let i = 0; i < lyrics_list.length; i++) {
    
    position = (i / (lyrics_list.length)) * (canvas.width - padding * 2);
    
    for (let j = i; j >=0; j--) {
        
        if(lyrics_list[i] == lyrics_list[j]) {
            
            // console.log(i + ", " + j)
            
            ctx.fillRect(w * i + padding, w * j + padding, w, w);
            
            ctx.fillRect(w * j + padding, w * i + padding, w, w);
            
        }
        
    }
    
}