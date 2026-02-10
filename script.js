const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const textInput = document.getElementById('textInput');
const btn = document.getElementById('btn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const mouse = { x: null, y: null, radius: 80 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = x;
        this.baseY = y;
        this.size = 1.5;
        this.color = '#ff0000';
        this.density = (Math.random() * 20) + 2;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * this.density;
            this.y -= forceDirectionY * force * this.density;
        } else {
            if (this.x !== this.baseX) {
                this.x -= (this.x - this.baseX) / 12;
            }
            if (this.y !== this.baseY) {
                this.y -= (this.y - this.baseY) / 12;
            }
        }
    }
}

function createSphere() {
    particles = [];
    const particleCount = 1500; 
    const radius = 120;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 50;

    for (let i = 0; i < particleCount; i++) {
        let angle = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random()) * radius;
        let x = centerX + r * Math.cos(angle);
        let y = centerY + r * Math.sin(angle);
        particles.push(new Particle(x, y));
    }
}

function createText(text) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 50);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let newCoords = [];
    for (let y = 0; y < data.height; y += 3) {
        for (let x = 0; x < data.width; x += 3) {
            if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                newCoords.push({x: x, y: y});
            }
        }
    }

    while (particles.length < newCoords.length) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    for (let i = 0; i < particles.length; i++) {
        if (i < newCoords.length) {
            particles[i].baseX = newCoords[i].x;
            particles[i].baseY = newCoords[i].y;
        } else {
            particles[i].baseX = canvas.width / 2;
            particles[i].baseY = canvas.height / 2 - 50;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    requestAnimationFrame(animate);
}

createSphere();
animate();

btn.addEventListener('click', () => {
    if (textInput.value.trim() !== "") createText(textInput.value);
    else createSphere();
});

textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (textInput.value.trim() !== "") createText(textInput.value);
        else createSphere();
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createSphere();
});
