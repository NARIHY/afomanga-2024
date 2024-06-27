class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.velocityX = (Math.random() - 0.5) * 6;
        this.velocityY = (Math.random() - 0.5) * 6;
        this.alpha = 1;
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
        context.restore();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 0.02;
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.exploded = false;
        this.velocityY = Math.random() * 3 + 3;
    }

    draw(context) {
        if (!this.exploded) {
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
            context.restore();
        } else {
            this.particles.forEach(particle => particle.draw(context));
        }
    }

    update() {
        if (!this.exploded) {
            this.y -= this.velocityY;
            if (this.y <= canvas.height / 2) {
                this.explode();
            }
        } else {
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => particle.alpha > 0);
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color, Math.random() * 3 + 1));
        }
    }
}

const canvas = document.getElementById('fireworksCanvas');
const context = canvas.getContext('2d');
const textContainer = document.getElementById('textContainer');
const texts = [
    "26 JONA 1960",
    "26 JONA 2024",
    "64 Taona",
    "FITIAVANA",
    "TANINDRAZANA",
    "FANDROSOANA",
    "TRATRY NY ASARAMANITRA",
    "DAHOLO",
    "ISIKA REHETRA TSY",
    "ANKANAVAKA",
    "NARIHY.MG"
];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let textIndex = 0;

function createRandomFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    fireworks.push(new Firework(x, y, color));
}

function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach(firework => {
        firework.draw(context);
        firework.update();
    });
    fireworks = fireworks.filter(firework => firework.particles.length > 0 || !firework.exploded);
    requestAnimationFrame(animate);
}

function showText() {
    if (textIndex < texts.length) {
        textContainer.style.opacity = 1;
        textContainer.innerHTML = texts[textIndex];
        textIndex++;
        setTimeout(() => {
            textContainer.style.opacity = 0;
            setTimeout(showText, 1000);
        }, 2000);
    }
}

function drawMadagascarFlag() {
    const flagWidth = 300;
    const flagHeight = 200;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect((canvas.width - flagWidth) / 2, (canvas.height - flagHeight) / 2, flagWidth / 3, flagHeight);
    context.fillStyle = "red";
    context.fillRect((canvas.width - flagWidth) / 2 + flagWidth / 3, (canvas.height - flagHeight) / 2, flagWidth * 2 / 3, flagHeight / 2);
    context.fillStyle = "green";
    context.fillRect((canvas.width - flagWidth) / 2 + flagWidth / 3, (canvas.height - flagHeight) / 2 + flagHeight / 2, flagWidth * 2 / 3, flagHeight / 2);
}

function drawMaki() {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const size = 100;

    // Draw the body
    context.fillStyle = "gray";
    context.beginPath();
    context.ellipse(x, y, size / 2, size * 0.75, 0, 0, Math.PI * 2);
    context.fill();

    // Draw the head
    context.beginPath();
    context.arc(x, y - size / 1.5, size / 2.5, 0, Math.PI * 2);
    context.fill();

    // Draw the eyes
    context.fillStyle = "white";
    context.beginPath();
    context.arc(x - size / 8, y - size / 1.5, size / 10, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(x + size / 8, y - size / 1.5, size / 10, 0, Math.PI * 2);
    context.fill();

    // Draw the pupils
    context.fillStyle = "black";
    context.beginPath();
    context.arc(x - size / 8, y - size / 1.5, size / 20, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(x + size / 8, y - size / 1.5, size / 20, 0, Math.PI * 2);
    context.fill();

    // Draw the nose
    context.beginPath();
    context.arc(x, y - size / 1.8, size / 15, 0, Math.PI * 2);
    context.fill();

    // Draw the tail
    context.strokeStyle = "gray";
    context.lineWidth = size / 10;
    context.beginPath();
    context.moveTo(x + size / 2, y);
    context.quadraticCurveTo(x + size, y - size, x + size / 2, y - size * 1.5);
    context.stroke();
}

function startAnimation() {
    setTimeout(() => {
        drawMadagascarFlag();
        setTimeout(() => {
            drawMaki();
            setTimeout(() => {
                textContainer.style.opacity = 0;
                showText();
            }, 5000);
        }, 5000);
    }, 10000);

    setInterval(createRandomFirework, 800);
    animate();
}

startAnimation();
