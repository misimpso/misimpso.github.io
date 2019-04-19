function make_chart() {
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const lyrics = $('textarea').val();

    const lyrics_list = lyrics.split(' ').map((a) => { 

        let b = a.replace(/([\.\,\?\'\"\(\)\-\:\; ])/, '').toLowerCase();

        if (b.length > 0) {

            return b; 

        }

    });

    ctx.fillStyle = "#8c939a";

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#2a2a2e";
    
    if (lyrics_list.length == 1) return;

    const padding = 13;
    
    const w = (canvas.width - (padding * 2)) / lyrics_list.length;

    if (padding > 8) {

        let border_padding = padding - 6;

        ctx.beginPath();
        ctx.moveTo(border_padding - 1, border_padding);
        ctx.lineTo(border_padding, (canvas.width - border_padding));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width - border_padding, border_padding);
        ctx.lineTo(canvas.width - border_padding, canvas.width - border_padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(border_padding - 1, border_padding);
        ctx.lineTo((canvas.width - border_padding), border_padding);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(border_padding, canvas.width - border_padding);
        ctx.lineTo(canvas.width - border_padding, canvas.width - border_padding);
        ctx.stroke();
    }

    /*
    let position = null;
    for (let i = 0; i <= lyrics_list.length; i++) {

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

                ctx.fillRect(w * i + padding, w * j + padding, w, w);

                ctx.fillRect(w * j + padding, w * i + padding, w, w);

            }

        }

    }
    
}