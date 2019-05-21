function make_chart() {
    
    // Define canvas and context variables
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Background fill color, light grey
    ctx.fillStyle = "#8c939a";

    // Fill background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Line / Square fill color, dark grey
    ctx.fillStyle = "#2a2a2e";

    // Edge padding
    const padding = 13;

    // Create framing lines
    if (padding > 8) {

        let border_padding = padding - 6;

        // left line
        ctx.beginPath();
        ctx.moveTo(border_padding - 1, border_padding);
        ctx.lineTo(border_padding, (canvas.width - border_padding));
        ctx.stroke();

        // Right line
        ctx.beginPath();
        ctx.moveTo(canvas.width - border_padding, border_padding);
        ctx.lineTo(canvas.width - border_padding, canvas.width - border_padding);
        ctx.stroke();
        
        // Top line
        ctx.beginPath();
        ctx.moveTo(border_padding - 1, border_padding);
        ctx.lineTo((canvas.width - border_padding), border_padding);
        ctx.stroke();
        
        // Bottom line
        ctx.beginPath();
        ctx.moveTo(border_padding, canvas.width - border_padding);
        ctx.lineTo(canvas.width - border_padding, canvas.width - border_padding);
        ctx.stroke();
    }

    // Get lyrics from text area element
    const lyrics = $('textarea').val();

    // Split lyrics by space char and remove special characters
    const lyrics_list = lyrics.split(/\s+/g).map((a) => { 

        let b = a.replace(/([^\w\s])|([\r?\n|\r?\t|\r])*/gmi, '').toLowerCase();

        if (b != undefined && b.length > 0) {

            return b; 

        }

    });

    // If there is nothing to visualze, return
    if (lyrics_list.length == 1) return;

    // Width of square given padding
    const w = (canvas.width - (padding * 2)) / lyrics_list.length;

    /*
    // Grid lines, doesnt look good and might not work anymore 
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

    // Draw the sqaures
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