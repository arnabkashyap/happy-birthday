/* ==========================================================================
   BIRTHDAY WISH INTERACTIVE APPLICATION - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE & DOM ELEMENTS
    // ----------------------------------------------------------------------
    let currentSlide = 1;
    const totalSlides = 5;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideIndicator = document.getElementById('slideIndicator');

    const musicToggle = document.getElementById('musicToggle');
    const musicText = document.getElementById('musicText');
    const vinylRecord = document.getElementById('vinylRecord');
    const unoCard = document.getElementById('unoCard');
    const claimBtn = document.getElementById('claimBtn');
    const couponTicket = document.getElementById('couponTicket');
    const restartBtn = document.getElementById('restartBtn');


    // ----------------------------------------------------------------------
    // 2. SLIDE NAVIGATION CONTROLLER
    // ----------------------------------------------------------------------
    function goToSlide(slideNum) {
        if (slideNum < 1 || slideNum > totalSlides) return;

        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show target slide
        currentSlide = slideNum;
        const targetSlide = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
        }

        // Update Nav Dots & Indicator
        dots.forEach(dot => {
            dot.classList.toggle('active', parseInt(dot.dataset.slide) === currentSlide);
        });

        slideIndicator.textContent = `${currentSlide} / ${totalSlides}`;

        // Update Prev/Next Buttons
        prevBtn.disabled = (currentSlide === 1);
        if (currentSlide === totalSlides) {
            nextBtn.textContent = '< Restart';
        } else {
            nextBtn.textContent = 'Next >>';
        }

        // Trigger slide-specific animations
        if (currentSlide === 3) {
            // Auto start vinyl spin if music is playing
            if (isPlayingMusic) {
                vinylRecord.classList.remove('paused');
            }
        } else if (currentSlide === 5) {
            // Confetti burst on entering slide 5
            createConfettiBurst(60);
        }
    }

    // Event Listeners for Nav Controls
    nextBtn.addEventListener('click', () => {
        if (currentSlide === totalSlides) {
            goToSlide(1);
        } else {
            goToSlide(currentSlide + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 1) {
            goToSlide(currentSlide - 1);
        }
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideNum = parseInt(dot.dataset.slide);
            goToSlide(slideNum);
        });
    });

    // In-slide Next Button Handlers
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = parseInt(e.currentTarget.dataset.target);
            if (target) goToSlide(target);
        });
    });

    // Restart Button
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            goToSlide(1);
        });
    }

    // Keyboard Arrow Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
            else if (currentSlide === totalSlides) goToSlide(1);
        } else if (e.key === 'ArrowLeft') {
            if (currentSlide > 1) goToSlide(currentSlide - 1);
        }
    });

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swipe Left -> Next
            if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
        }
        if (touchEndX > touchStartX + threshold) {
            // Swipe Right -> Prev
            if (currentSlide > 1) goToSlide(currentSlide - 1);
        }
    }


    // ----------------------------------------------------------------------
    // 3. WEB AUDIO API ROMANTIC MELODY SYNTHESIZER
    // ----------------------------------------------------------------------
    let audioCtx = null;
    let isPlayingMusic = false;
    let melodyInterval = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play a gentle romantic acoustic note
    function playNote(freq, duration = 0.8, type = 'sine', volume = 0.12) {
        if (!audioCtx || !isPlayingMusic) return;

        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            // Envelope decay for soft acoustic lullaby effect
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    }

    // Romantic Arpeggio Notes (C Major 7th / F Major / G Major Progression)
    const melodyNotes = [
        261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63, // Cmaj7
        349.23, 440.00, 523.25, 659.25, 698.46, 659.25, 523.25, 440.00, // Fmaj7
        392.00, 493.88, 587.33, 698.46, 783.99, 698.46, 587.33, 493.88  // G7
    ];

    function startMelodyLoop() {
        let noteIndex = 0;
        if (melodyInterval) clearInterval(melodyInterval);

        melodyInterval = setInterval(() => {
            if (!isPlayingMusic) return;
            const freq = melodyNotes[noteIndex % melodyNotes.length];
            playNote(freq, 1.2, 'sine', 0.15);

            // Harmony note
            if (noteIndex % 4 === 0) {
                playNote(freq / 2, 1.8, 'triangle', 0.08);
            }

            noteIndex++;
        }, 400);
    }

    function toggleMusic() {
        initAudioContext();
        isPlayingMusic = !isPlayingMusic;

        if (isPlayingMusic) {
            musicToggle.classList.add('playing');
            musicText.textContent = 'Pause Music';
            if (vinylRecord) vinylRecord.classList.remove('paused');
            startMelodyLoop();
        } else {
            musicToggle.classList.remove('playing');
            musicText.textContent = 'Play Music';
            if (vinylRecord) vinylRecord.classList.add('paused');
            if (melodyInterval) clearInterval(melodyInterval);
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Vinyl Record Click Toggle
    if (vinylRecord) {
        vinylRecord.addEventListener('click', () => {
            toggleMusic();
            createHeartParticle(window.innerWidth / 2, window.innerHeight / 2 + 50);
        });
    }


    // ----------------------------------------------------------------------
    // 4. UNO CARD & COUPON INTERACTION
    // ----------------------------------------------------------------------
    if (unoCard) {
        unoCard.addEventListener('click', (e) => {
            unoCard.style.transform = 'scale(1.15) rotate(0deg)';
            setTimeout(() => {
                unoCard.style.transform = '';
            }, 400);

            // Spawn floating hearts burst around card
            const rect = unoCard.getBoundingClientRect();
            for (let i = 0; i < 15; i++) {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 120;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 120;
                createHeartParticle(x, y);
            }
        });
    }

    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            couponTicket.classList.add('claimed');
            createConfettiBurst(120);

            // Play celebratory chime sound
            if (isPlayingMusic && audioCtx) {
                playNote(523.25, 0.4, 'sine', 0.2);
                setTimeout(() => playNote(659.25, 0.4, 'sine', 0.2), 150);
                setTimeout(() => playNote(783.99, 0.6, 'sine', 0.25), 300);
                setTimeout(() => playNote(1046.50, 1.0, 'sine', 0.3), 450);
            }
        });
    }


    // ----------------------------------------------------------------------
    // 5. CANVAS AMBIENT FLOATING HEARTS SYSTEM
    // ----------------------------------------------------------------------
    const heartCanvas = document.getElementById('heartCanvas');
    const hCtx = heartCanvas.getContext('2d');
    let hearts = [];

    function resizeHeartCanvas() {
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;
    }
    resizeHeartCanvas();
    window.addEventListener('resize', resizeHeartCanvas);

    class HeartParticle {
        constructor(x, y) {
            this.x = x || Math.random() * heartCanvas.width;
            this.y = y || heartCanvas.height + Math.random() * 50;
            this.size = Math.random() * 16 + 8;
            this.speedY = Math.random() * 1.5 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.color = ['#ff0066', '#ff3385', '#ff4da6', '#ff80bf'][Math.floor(Math.random() * 4)];
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.angle) * 0.5 + this.speedX;
            this.angle += 0.03;
            if (this.y < -30) {
                this.y = heartCanvas.height + 20;
                this.x = Math.random() * heartCanvas.width;
            }
        }

        draw() {
            hCtx.save();
            hCtx.globalAlpha = this.opacity;
            hCtx.fillStyle = this.color;
            hCtx.translate(this.x, this.y);

            // Draw Heart Shape
            hCtx.beginPath();
            const topCurveHeight = this.size * 0.3;
            hCtx.moveTo(0, topCurveHeight);
            hCtx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            hCtx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
            hCtx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
            hCtx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            hCtx.closePath();
            hCtx.fill();

            hCtx.restore();
        }
    }

    // Init initial floating hearts pool
    for (let i = 0; i < 25; i++) {
        hearts.push(new HeartParticle());
    }

    function createHeartParticle(x, y) {
        const h = new HeartParticle(x, y);
        h.speedY = Math.random() * 2 + 1.2;
        hearts.push(h);
        if (hearts.length > 50) hearts.shift();
    }

    function animateHearts() {
        hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animateHearts);
    }
    animateHearts();

    // Mousemove interactive sparkles
    window.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.08) {
            createHeartParticle(e.clientX, e.clientY);
        }
    });


    // ----------------------------------------------------------------------
    // 6. CONFETTI CELEBRATION ENGINE
    // ----------------------------------------------------------------------
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.color = ['#ff0066', '#ff3385', '#ffcc00', '#ffffff', '#ff80bf', '#e60073'][Math.floor(Math.random() * 6)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            cCtx.save();
            cCtx.translate(this.x, this.y);
            cCtx.rotate((this.rotation * Math.PI) / 180);
            cCtx.fillStyle = this.color;
            cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
            cCtx.restore();
        }
    }

    function createConfettiBurst(count = 80) {
        confettiParticles = [];
        for (let i = 0; i < count; i++) {
            confettiParticles.push(new ConfettiPiece());
        }
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.y > confettiCanvas.height + 20) {
                confettiParticles.splice(index, 1);
            }
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
});
