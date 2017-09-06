// Keyboard

// keycodes for different keys
const keys = {
	enter:	13,
	shift:	16,
	cntrl:	17,
	alt:	18,
	esc:	27,
	space:	32,
	left: 	37,
	up:		38,
	right:	39,
	down:	40,
	nums: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
	a: 65,
	d: 68,
	s: 83,
	w: 87
	// TODO: add other key codes here
};

// represents the keyboard
class Keyboard {
	constructor() {
		// keys being held down
		this.keysHeld = new Set();

		// handle key down event
		addEventListener("keydown", function(e) {
			keyboard.keysHeld.add(e.keyCode);
		}, false);

		// handle key up event
		addEventListener("keyup", function(e) {
			keyboard.keysHeld.delete(e.keyCode);
		}, false);
	}

	// returns if key with keyCode is currently held down
	isKeyDown(keyCode) {
		return this.keysHeld.has(keyCode);
	}

	// adds a key press event for a certain keyCode
	// returns an id that can be used to remove the event
	addKeyPressEvent(keyCode, func) {
		var listener = function(e) {
			if(e.keyCode == keyCode)
				func(e);
		};
		addEventListener("keydown", listener, false);
		return listener;
	}

	// removes a key press event using the provided id
	removeKeyPressEvent(id) {
		removeEventListener("keydown", id);
	}

	// adds a key release event for a certain keyCode
	// returns an id that can be used to remove the event
	addKeyReleaseEvent(keyCode, func) {
		var listener = function(e) {
			if(e.keyCode == keyCode)
				func(e);
		};
		addEventListener("keyup", listener, false);
		return listener;
	}

	// removes a key release event using the provided id
	removeKeyReleaseEvent(id) {
		removeEventListener("keyup", id);
	}

	// TODO: add functions for text input
}
const keyboard = new Keyboard();

// Mouse

// codes for the mouse buttons
const mb = {
	left:	0,
	middle:	1,
	right:	2
};

// represents the mouse
class Mouse {
	constructor() {
		// mouse's current position on canvas
		this.x = 0;
		this.y = 0;

		// currently held mouse buttons
		this.buttonsHeld = [ false, false, false ];

		// mouse drag listeners
		this.mouseDragListeners = [ [], [], [] ];

		// mouse drag release listeners
		this.mouseDragReleaseListeners = [ [], [], [] ];

		// mouse drag trackers
		this.mouseDragTrackers = [ {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0} ];

		// handle mouse move event
		addEventListener("mousemove", function(e) {
			// get new mouse position
			mouse.x = e.pageX - e.target.offsetLeft;
			mouse.y = e.pageY - e.target.offsetTop;

			// handle mouse drag listeners
			for(var i = 0; i < 3; i++) if(mouse.buttonsHeld[i]) {
					for(var listener of mouse.mouseDragListeners[i]) {
						e2 = {
							startx: mouse.mouseDragTrackers[i].x,
							starty: mouse.mouseDragTrackers[i].y,
							x: mouse.x, y: mouse.y, button: i
						};
						listener(e2);
					}
			}
		}, false);

		// handle mouse down event
		addEventListener("mousedown", function(e) {
			mouse.buttonsHeld[e.button] = true;

			// track drag starting point
			mouse.mouseDragTrackers[e.button].x = mouse.x;
			mouse.mouseDragTrackers[e.button].y = mouse.y;
		}, false);

		// handle mouse up event
		addEventListener("mouseup", function(e) {
			mouse.buttonsHeld[e.button] = false;

			// handle mouse drag release listeners
			if(mouse.mouseDragTrackers[e.button].x != mouse.x ||
				 mouse.mouseDragTrackers[e.button].y != mouse.y) {
				for(var listener of mouse.mouseDragReleaseListeners[e.button]) {
					e2 = {
						startx: mouse.mouseDragTrackers[i].x,
						starty: mouse.mouseDragTrackers[i].y,
						x: mouse.x, y: mouse.y, button: e.button
					};
					listener(e2);
				}
			}
		}, false);
	}

	// returns whether the provided mouse button is being held down
	isButtonDown(mb) {
		return this.buttonsHeld[mb];
	}

	// adds a mouse press event for a certain mouse button
	// returns an id that can be used to remove the event
	addMousePressEvent(mb, func) {
		var listener = function(e) {
			if(e.button == mb)
				func(e);
		};
		addEventListener("mousedown", listener, false);
		return listener;
	}

	// removes a mouse press event using the provided id
	removeMousePressEvent(id) {
		removeEventListener("mousedown", id);
	}

	// adds a mouse release event for a certain mouse button
	// returns an id that can be used to remove the event
	addMouseReleaseEvent(mb, func) {
		var listener = function(e) {
			if(e.button == mb)
				func(e);
		};
		addEventListener("mouseup", listener, false);
		return listener;
	}

	// removes a mouse release event using the provided id
	removeMouseReleaseEvent(id) {
		removeEventListener("mouseup", id);
	}

	// adds a mouse drag event for a certain mouse button
	// returns an id that can be used to remove the event
	addMouseDragListener(mb, func) {
		return { button: mb, i: this.mouseDragListeners[mb].push(func) - 1 };
	}

	// removes a mouse dragging event using the provided id
	removeMouseDragEvent(id) {
		this.mouseDragListeners[id.button].splice(id.i, 1);
	}

	// adds a mouse drag release event for a certain mouse button
	// returns an id that can be used to remove the event
	addMouseDragReleaseListener(mb, func) {
		return { button: mb, i: this.mouseDragReleaseListeners[mb].push(func) - 1 };
	}

	// removes a mouse drag release event using the provided id
	removeMouseDragReleaseEvent(id) {
		this.mouseDragReleaseListeners[id.button].splice(id.i, 1);
	}
}
const mouse = new Mouse();