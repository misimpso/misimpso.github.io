// default format for popups (used for tooltips)
defaultPopupFormat = {
    // minimum and maximum dimensions for the popup
    // leave 0 to disable
    minWidth: 0,
    maxWidth: 0,
    minHeight: 0,

    // inside margin
    margin: 2,

    // draws popup background
    background: function(x, y, w, h) {
        ctx.lineWidth = 2;
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, w, h)
    },

    // contains functions to format title text
    titleFormat: function() {
        ctx.fillStyle = "white";
        ctx.font = "14px Geometos Rounded";
        ctx.textAlign = "left";
    },

    // contains functions to format text lines
    linesFormat: function() {}
};

// represents a non-interactive popup textbox
// used for tooltips and other popups
class Popup {
    constructor(x, y, title, lines, format = defaultPopupFormat) {
        this.x = x;
        this.y = y;
        this.title = title;
        this.lines = lines;
        this.format = format;
        this.recalculate();
    }

    // recalculate popup dimensions and adjust lines to match
    // call after changing text or format
    recalculate() {
        // width equals the max of minWidth and calculated width
        this.width = Math.max(this.format.minWidth, this.calculateWidth());

        // one or more lines are longer than max width
        if(this.format.maxWidth > 0 && this.width > this.format.maxWidth) {
            this.format.linesFormat();
            var newLines = [];
            for(var i = 0; i < this.lines.length; i++) {
                // line is too long
                if(ctx.measureText(this.lines[i]).width > this.format.maxWidth) {
                    // split into multiple lines
                    var splitLine = this.lines[i].split(" ");
                    var nextWord = splitLine.shift();
                    while(splitLine.length > 0 || nextWord !== undefined) {
                        var newLine = nextWord;
                        nextWord = splitLine.shift();
                        while(nextWord !== undefined && ctx.measureText(newLine + " " + nextWord).width <= this.format.maxWidth) {
                            newLine += " " + nextWord;
                            nextWord = splitLine.shift();
                        }
                        newLines.push(newLine);
                    }
                } else { // line is fine
                    newLines.push(this.lines[i]);
                }
            }
            // replace lines and recalculate width
            this.lines = newLines;
            this.width = Math.max(this.format.minWidth, this.calculateWidth());
        }
        this.height = Math.max(this.format.minHeight, this.calculateHeight());
    }
    // calculate popup width
    calculateWidth() {
        this.format.titleFormat();
        var maxWidth = ctx.measureText(this.title).width;
        this.format.linesFormat();
        for(var i = 0; i < this.lines.length; i++) {
            maxWidth = Math.max(maxWidth, ctx.measureText(this.lines[i]).width);
        }
        return maxWidth + this.format.margin * 2;
    }

    // calculate popup width
    calculateHeight() {
        this.format.titleFormat();
        if(this.lines.length == 0) return parseInt(ctx.font) + this.format.margin * 2;
        var totalheight = parseInt(ctx.font) * 1.5;
        this.format.linesFormat();
        totalheight += parseInt(ctx.font) * 1.5 * this.lines.length;
        return totalheight + this.format.margin * 2;
    }

    // draw the popup
    draw() {
        // default to top left anchor
        var drawX = this.x;
        var drawY = this.y - this.height;

        // switch to right anchor if it will avoid going off screen
        if(drawX + this.width > canvas.width && drawX - this.width >= 0) {
            drawX -= this.width;
        }

        // switch to top ancor if it will avoid going off screen
        if(drawY + this.height <= canvas.height && drawY - this.height < 0) {
            drawY += this.height;
        }

        // draw popup background
        this.format.background(drawX, drawY, this.width, this.height, this.type);

        // adjust for text margin
        drawX += this.format.margin;
        drawY += this.format.margin;

        // draw title text
        this.format.titleFormat();
        ctx.textBaseline = "top";
        switch(ctx.textAlign) {
            // draw text on left side
            case "start":
            case "left":
                ctx.fillText(this.title, drawX, drawY);
            break;

                // draw text in center
                case "center":
                    ctx.fillText(this.title, drawX - this.format.margin + this.width / 2, drawY);
                break;

                // draw text on right side
                case "end":
                case "right":
                    ctx.fillText(this.title, drawX - this.format.margin * 2 + this.width, drawY);
                break;
            }
            drawY += parseInt(ctx.font) * 1.5;

            // draw lines
            this.format.linesFormat();
            ctx.textBaseline = "top";
            for(var i = 0; i < this.lines.length; i++) {
                switch(ctx.textAlign) {
                    // draw text on left side
                    case "start":
                    case "left":
                        ctx.fillText(this.lines[i], drawX, drawY);
                    break;

                    // draw text in center
                    case "center":
                        ctx.fillText(this.lines[i], drawX - this.format.margin + this.width / 2, drawY);
                    break;

                    // draw text on right side
                    case "end":
                    case "right":
                        ctx.fillText(this.lines[i], drawX - this.format.margin * 2 + this.width, drawY);
                    break;
                }
                drawY += parseInt(ctx.font) * 1.5;
            }
        }
    }
