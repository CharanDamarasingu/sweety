// ==========================================
// 1. GAMIFIED UI LOGIC
// ==========================================
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');
const appOverlay = document.getElementById('app-overlay');

const btnNext1 = document.getElementById('btn-next-1');
const btnNext2 = document.getElementById('btn-next-2');
const btnStartAnim = document.getElementById('btn-start-anim');

// Screen 1 -> Screen 2
btnNext1.addEventListener('click', () => {
    screen1.style.display = 'none';
    screen2.style.display = 'block';
    appOverlay.style.backgroundColor = '#e0f7fa'; // Change background to pastel blue
});

// --- NEW LOGIC FOR SCREEN 2, TERMINAL & POLAROIDS ---
const screenTerminal = document.getElementById('screen-terminal');
const screenPolaroids = document.getElementById('screen-polaroids');
const terminalText = document.getElementById('terminal-text');
const fingerprintScanner = document.getElementById('fingerprint-scanner');
const scanText = document.getElementById('scan-text');

let isScanning = false;

// 1. The Hacker Terminal Logs
const terminalLines = [
    "> Establishing connection...",
    "> Bypassing server security...",
    "> Fetching digital twin parameters...",
    "> Initializing anaerobic digester closed-loop...",
    "> Syncing control system data...",
    "> ACCESS GRANTED. Welcome."
];

fingerprintScanner.addEventListener('click', () => {
    if (isScanning) return;
    isScanning = true;

    scanText.innerText = "SCANNING...";
    fingerprintScanner.style.backgroundColor = "#c8e6c9"; 
    
    setTimeout(() => {
        scanText.innerText = "IDENTITY VERIFIED ✔️";
        
        setTimeout(() => {
            // Hide Agreement, Show Terminal
            screen2.style.display = 'none';
            screenTerminal.style.display = 'block';
            appOverlay.style.backgroundColor = '#000'; // Matrix black
            
            // Start the typing effect
            typeTerminalLines(0);
        }, 1000);
    }, 1500);
});

// 2. The Typing Function
function typeTerminalLines(index) {
    if (index < terminalLines.length) {
        terminalText.innerHTML += terminalLines[index] + "<br><br>";
        
        // Random typing delay between 400ms and 900ms for realism
        let delay = Math.random() * 500 + 400; 
        setTimeout(() => typeTerminalLines(index + 1), delay);
    } else {
        // When terminal finishes, show Polaroids
        setTimeout(() => {
            screenTerminal.style.display = 'none';
            screenPolaroids.style.display = 'flex';
            appOverlay.style.backgroundColor = '#ffccbc'; // Pastel peach for photos
        }, 1200);
    }
}

// 3. The Polaroid Swipe Logic
const polaroids = document.querySelectorAll('.polaroid');
let currentPolaroid = polaroids.length - 1; // Start with the top card (index 2)

polaroids.forEach((p, index) => {
    p.addEventListener('click', () => {
        if (index !== currentPolaroid) return; // Only let them click the top card
        
        // Add the CSS class to fly it off screen
        p.classList.add('swipe-out');
        currentPolaroid--;

        // If all cards are swiped away, go to the final Notepad Letter
        if (currentPolaroid < 0) {
            setTimeout(() => {
                screenPolaroids.style.display = 'none';
                screen3.style.display = 'block';
                appOverlay.style.backgroundColor = '#fff9c4'; // Pastel yellow
            }, 500);
        }
    });
});

// Screen 3 -> Fade into Canvas Animation
btnStartAnim.addEventListener('click', () => {
    // Turn the background black to match the space canvas
    appOverlay.style.backgroundColor = '#050510'; 
    // Fade out the whole UI container
    appOverlay.style.opacity = 0;
    
    setTimeout(() => {
        appOverlay.style.display = 'none'; // Remove it entirely from the screen
        animate(); // Start the stars!
    }, 1500); // Wait for the CSS transition to finish
});


// ==========================================
// 2. CANVAS ANIMATION LOGIC
// ==========================================
const canvas = document.getElementById('animCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Generate Background Stars
const bgStars = [];
for (let i = 0; i < 200; i++) {
    bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        twinkleSpeed: 0.01 + Math.random() * 0.03
    });
}

function drawBackground() {
    ctx.clearRect(0, 0, width, height);
    bgStars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) star.twinkleSpeed *= -1;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fill();
    });
}

// Setup "You" and "Me" Stars
let animationPhase = 0; // 0: converging, 1: exploding, 2: settled
let centerX = width / 2;
let centerY = height / 2;

let starYou = { x: centerX, y: 50, label: "You" };
let starMe = { x: centerX, y: height - 50, label: "Me" };

function drawMainStars() {
    if (animationPhase > 0) return; 

    // Move towards center
    starYou.y += (centerY - starYou.y) * 0.01;
    starMe.y -= (starMe.y - centerY) * 0.01;

    ctx.font = "14px Georgia";
    ctx.fillStyle = "#f4d03f";

    // Draw "You"
    ctx.beginPath();
    ctx.arc(starYou.x, starYou.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "white";
    ctx.fill();
    ctx.fillStyle = "#f4d03f";
    ctx.fillText(starYou.label, starYou.x + 15, starYou.y + 5);

    // Draw "Me"
    ctx.beginPath();
    ctx.arc(starMe.x, starMe.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillStyle = "#f4d03f";
    ctx.fillText(starMe.label, starMe.x + 15, starMe.y + 5);
    ctx.shadowBlur = 0; 

    // Check for collision
    if (Math.abs(starYou.y - starMe.y) < 2) {
        animationPhase = 1;
        createHeartParticles();
    }
}

// Heart Particle Math
const heartParticles = [];

function createHeartParticles() {
    const particleCount = 400;
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        
        const scale = 15;
        const targetX = centerX + scale * (16 * Math.pow(Math.sin(t), 3));
        const targetY = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        heartParticles.push({
            x: centerX, 
            y: centerY,
            targetX: targetX,
            targetY: targetY,
            size: Math.random() * 2 + 1,
            speed: 0.02 + Math.random() * 0.03
        });
    }
}

function drawHeartParticles() {
    let allSettled = true;

    heartParticles.forEach(p => {
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        if (Math.abs(p.targetX - p.x) > 1) allSettled = false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#f4d03f"; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f4d03f";
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    if (allSettled && animationPhase === 1) {
        animationPhase = 2;
        document.getElementById('text-container').style.opacity = 1;
    }
}

// Master Animation Loop (Called when UI finishes)
function animate() {
    drawBackground();

    if (animationPhase === 0) {
        drawMainStars();
    } else {
        drawHeartParticles();
    }

    requestAnimationFrame(animate);
}