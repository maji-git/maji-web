// get #drawCanvas
const canvas = document.getElementById('drawCanvas');
// get #drawCanvas context
const ctx = canvas.getContext('2d');

const penCursor = document.getElementById("penCursor")

let drawActive = false

let mouseX = 0
let mouseY = 0

drawActive = true

init()

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#5D7B6F';

    ctx.strokeStyle = '#5D7B6F';

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    penCursor.style.top = `${mouseY}px`
    penCursor.style.left = `${mouseX - 20}px`
    penCursor.style.transform = `rotate(220deg) scale(1)`
}

let mouseHolding = false;

document.body.onmousemove = function(e) {
    mouseX = e.pageX - this.offsetLeft;
    mouseY = e.pageY - this.offsetTop;

    if (!drawActive) {
        return
    }

    penCursor.style.top = `${mouseY}px`
    penCursor.style.left = `${mouseX - 20}px`
    
    if (!mouseHolding) {
        return;
    }
    
    ctx.lineTo(mouseX, mouseY);

    ctx.stroke();
}

canvas.onmousedown = function(e) {
    mouseHolding = true;

    penCursor.style.transform = `rotate(230deg) scale(0.8)`

    ctx.beginPath();
}

canvas.onmouseup = function(e) {
    mouseHolding = false;

    penCursor.style.transform = `rotate(220deg) scale(1)`
    
    ctx.closePath();
}