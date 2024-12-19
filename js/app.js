class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        // Mouvement aléatoire des particules
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
        this.alpha -= 0.02;  // Diminution progressive de l'alpha pour simuler la disparition des particules
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.exploded = false;
        
        // Vitesse de montée réaliste mais rapide, entre 3 et 7 pixels par frame
        this.velocityX = (Math.random() - 0.5) * 2;
        this.velocityY = Math.random() * 4 + 4; // Plus rapide entre 4 et 8 pixels par frame
        this.maxHeight = Math.random() * (canvas.height / 2) + canvas.height / 3;  // Hauteur aléatoire
    }

    draw(context) {
        if (!this.exploded) {
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, 3, 0, Math.PI * 2, false); // Avant explosion
            context.closePath();
            context.fill();
            context.restore();
        } else {
            // Dessiner les particules après l'explosion
            this.particles.forEach(particle => particle.draw(context));
        }
    }

    update() {
        if (!this.exploded) {
            // Le feu d'artifice monte avec une vitesse réaliste
            this.x += this.velocityX;
            this.y -= this.velocityY;  // Déplacement vers le haut
            if (this.y <= this.maxHeight) {
                this.explode();  // Explose quand il atteint la hauteur maximale
            }
        } else {
            // Mettre à jour les particules après l'explosion
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => particle.alpha > 0);  // Garder uniquement les particules visibles
        }
    }

    explode() {
        this.exploded = true;
        // Créer des particules dispersées après l'explosion
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color, Math.random() * 3 + 1));  // Taille aléatoire des particules
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

// Créer un feu d'artifice au centre du canvas avec une position et une couleur aléatoire
function createRandomFirework() {
    const x = canvas.width / 2;  // Position initiale au centre
    const y = canvas.height;    // Le feu d'artifice part du bas du canvas
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Couleur aléatoire
    fireworks.push(new Firework(x, y, color));  // Ajouter un feu d'artifice à la scène
}

// Animation du canvas
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Effacer le canvas à chaque frame
    fireworks.forEach(firework => {
        firework.draw(context);  // Dessiner chaque feu d'artifice
        firework.update();  // Mettre à jour leur position
    });
    // Filtrer les feux d'artifice dont toutes les particules ont disparu
    fireworks = fireworks.filter(firework => firework.particles.length > 0 || !firework.exploded);
    requestAnimationFrame(animate);  // Redemander l'animation pour la frame suivante
}

// Affichage du texte en séquence
function showText() {
    if (textIndex < texts.length) {
        textContainer.style.opacity = 1;
        textContainer.innerHTML = texts[textIndex];
        textIndex++;
        setTimeout(() => {
            textContainer.style.opacity = 0;
            setTimeout(showText, 1000);  // Afficher chaque texte pendant 2 secondes puis attendre 1 seconde
        }, 2000);
    }
}

// Initialisation et démarrage de l'animation
function startAnimation() {
    setTimeout(() => {
        // Créer des feux d'artifice à des intervalles aléatoires
        setInterval(createRandomFirework, Math.random() * 1500 + 500);  // Intervalle aléatoire entre 500ms et 2000ms
        animate();  // Démarrer l'animation
    }, 1000);

    showText();  // Afficher les textes
}

startAnimation();
