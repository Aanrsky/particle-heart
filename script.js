const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;

const PARTICLE_COUNT = 3200;
const particles = [];

let heartPoints = [];


// ==========================================
// CANVAS
// ==========================================

function resize() {
    W = window.innerWidth;
    H = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createHeartPoints();
}

window.addEventListener("resize", resize);


// ==========================================
// HEART POINTS
// ==========================================

function createHeartPoints() {

    heartPoints = [];

    const scale = Math.min(W, H) * 0.018;

    const centerX = W / 2;
    const centerY = H / 2 + 20;

    // Banyak titik di dalam hati
    for (let i = 0; i < 18000; i++) {

        const t = Math.random() * Math.PI * 2;

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        // Random radius supaya hati terlihat penuh
        const fill = Math.sqrt(Math.random());

        heartPoints.push({
            x:
                centerX +
                x * scale * fill,

            y:
                centerY -
                y * scale * fill
        });
    }
}


// ==========================================
// PARTICLE
// ==========================================

class Particle {

    constructor() {
        this.reset(true);
    }

    reset(first = false) {

        // Mulai dari area bawah
        this.x =
            W / 2 +
            (Math.random() - 0.5) * W * 1.4;

        this.y =
            first
                ? Math.random() * H
                : H + Math.random() * 150;

        this.size =
            Math.random() < 0.75
                ? Math.random() * 1.5 + 0.4
                : Math.random() * 2.8 + 1;

        this.alpha =
            Math.random() * 0.65 + 0.25;

        this.speed =
            Math.random() * 1.8 + 0.5;

        this.wave =
            Math.random() * Math.PI * 2;

        this.waveSpeed =
            Math.random() * 0.015 + 0.005;

        this.age =
            first
                ? Math.random() * 500
                : 0;

        this.target = null;

        this.state = "flow";
    }


    update(time) {

        this.age++;


        // ==================================
        // FASE 1
        // PARTIKEL MENGALIR
        // ==================================

        if (this.state === "flow") {

            this.y -= this.speed;

            // Gerakan bergelombang
            this.x +=
                Math.sin(
                    this.y * 0.008 +
                    this.wave
                ) * 0.8;

            this.x +=
                Math.cos(
                    time * this.waveSpeed +
                    this.wave
                ) * 0.25;


            // Mulai membentuk hati
            if (
                this.y <
                H * 0.72
            ) {

                this.state = "forming";

                this.target =
                    heartPoints[
                        Math.floor(
                            Math.random() *
                            heartPoints.length
                        )
                    ];
            }


            // Reset kalau lewat atas
            if (this.y < -100) {
                this.reset();
            }

            return;
        }


        // ==================================
        // FASE 2
        // MENUJU HATI
        // ==================================

        if (this.state === "forming") {

            const dx =
                this.target.x -
                this.x;

            const dy =
                this.target.y -
                this.y;

            // Gerakan menuju target
            this.x += dx * 0.018;
            this.y += dy * 0.018;


            // Getaran kecil
            this.x +=
                Math.sin(
                    time * 0.002 +
                    this.wave
                ) * 0.12;

            this.y +=
                Math.cos(
                    time * 0.002 +
                    this.wave
                ) * 0.12;


            // Sudah dekat
            if (
                Math.abs(dx) < 2 &&
                Math.abs(dy) < 2
            ) {

                this.state = "heart";
            }

            return;
        }


        // ==================================
        // FASE 3
        // DI DALAM HATI
        // ==================================

        if (this.state === "heart") {

            this.x +=
                Math.sin(
                    time * 0.0015 +
                    this.wave
                ) * 0.12;

            this.y +=
                Math.cos(
                    time * 0.0015 +
                    this.wave
                ) * 0.12;
        }
    }


    draw() {

        // Cahaya inti
        ctx.fillStyle =
            `rgba(30,170,255,${this.alpha})`;

        ctx.fillRect(
            this.x,
            this.y,
            this.size,
            this.size
        );
    }
}


// ==========================================
// BUAT PARTICLE
// ==========================================

function createParticles() {

    particles.length = 0;

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        particles.push(
            new Particle()
        );
    }
}


// ==========================================
// BACKGROUND
// ==========================================

function drawBackground() {

    ctx.fillStyle =
        "rgba(1, 5, 15, 0.20)";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


// ==========================================
// GLOW BESAR
// ==========================================

function drawGlow() {

    const gradient =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            0,
            W / 2,
            H / 2,
            Math.min(W, H) * 0.5
        );

    gradient.addColorStop(
        0,
        "rgba(0,100,255,0.08)"
    );

    gradient.addColorStop(
        0.5,
        "rgba(0,60,180,0.03)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


// ==========================================
// ANIMATION
// ==========================================

function animate(time) {

    requestAnimationFrame(animate);

    drawBackground();

    drawGlow();


    // Semua particle
    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        particles[i].update(time);

        particles[i].draw();
    }
}


// ==========================================
// START
// ==========================================

resize();

createParticles();

requestAnimationFrame(animate);