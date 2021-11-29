canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 140;

function Star(x, y, r, c) {
    this.x =x;
    this.y = y;
    this.r = r;
    this.c = c;

    this.delta = 0.015;
}

Star.prototype = {
    constructor: Star,
    render: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'white';
        ctx.fillStyle = this.c;
        ctx.fill();
    },
    update: function() {
        if (this.r > 2 || this.r < .8) {
            this.delta = - this.delta;
        }

        this.r += this.delta;
    }
}

function randomColor() {
    colors = ['#fff', '#f7dfbe', '#9aaeed'];

    return colors[Math.floor((Math.random()*3))];
}

stars = [];

for (i =  0; i < 300; i++) {
    randX = Math.floor((Math.random() * canvas.width) + 1);
    randY = Math.floor((Math.random() * canvas.height) + 1);
    randR = Math.random() * 1.7 + .5;

    var star = new Star(randX, randY, randR, randomColor());
    stars.push(star);
}

function animate() {
    canvas.width = window.innerWidth;

    for (i = 0; i < stars.length; i++) {
        stars[i].update();
    }

    ctx.filStyle = '#black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < stars.length; i++) {
    
        stars[i].render();
    }

    requestAnimationFrame(animate);
}

animate();