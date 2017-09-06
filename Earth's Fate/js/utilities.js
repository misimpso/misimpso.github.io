// calculate distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt( (x1-x2) * (x1-x2) + (y1-y2) * (y1-y2) );
}

// linear interpolation from s to e with factor f
function interpolate(s, e, f) {
  return s + (e-s) * f;
}

// draw a bar at x, y with width and height filled horizontally to f between 0 and 1
// interpolate between highColor and lowColor based on f
// colors are given as 3 value arrays [r, g, b]
// TODO: maybe add support for a different color background bar
function drawBar(x, y, w, h, f, highColor, lowColor = highColor) {
  // determine color
  ctx.fillStyle = "rgb(" +
    Math.floor( interpolate(lowColor[0], highColor[0], f) ).toString() + "," +
    Math.floor( interpolate(lowColor[1], highColor[1], f) ).toString() + "," +
    Math.floor( interpolate(lowColor[2], highColor[2], f) ).toString() + ")";

  // draw foreground bar
  ctx.fillRect(x, y, w * f, h);
}
