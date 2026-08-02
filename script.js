/* ==========================================================================
   BIRTHDAY WISH INTERACTIVE APPLICATION - JAVASCRIPT LOGIC
   Music: Replace assets/music.mp3 with your own song to customise.
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
    // 3. HTML5 AUDIO MUSIC PLAYER (assets/music.mp3)
    // Replace assets/music.mp3 with any romantic song you love!
    // ----------------------------------------------------------------------
    let isPlayingMusic = false;

    // Create a hidden <audio> element pointing to the user-supplied music file
    const bgMusic = new Audio('assets/music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.6;

    // Gracefully handle missing file — no crash, just silent
    bgMusic.addEventListener('error', () => {
        console.warn('Music file not found: assets/music.mp3 — add your song there to enable music!');
        musicText.textContent = 'No music.mp3';
        musicToggle.disabled = true;
        musicToggle.style.opacity = '0.5';
    });

    function toggleMusic() {
        isPlayingMusic = !isPlayingMusic;

        if (isPlayingMusic) {
            bgMusic.play().catch(() => {
                // Autoplay policy blocked; user gesture required
                isPlayingMusic = false;
            });
            musicToggle.classList.add('playing');
            musicText.textContent = 'Pause Music';
            if (vinylRecord) vinylRecord.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicText.textContent = 'Play Music';
            if (vinylRecord) vinylRecord.classList.add('paused');
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
    // 4. TOGETHER COUNTER & LIVE TIMER
    // ----------------------------------------------------------------------
    // EDIT YOUR TOGETHER START DATE HERE (Format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
    const TOGETHER_START_DATE = '2021-12-10T00:00:00';

    const yearsCount = document.getElementById('yearsCount');
    const daysCount = document.getElementById('daysCount');
    const hoursCount = document.getElementById('hoursCount');
    const minutesCount = document.getElementById('minutesCount');
    const secondsCount = document.getElementById('secondsCount');

    function updateTogetherTimer() {
        const startDate = new Date(TOGETHER_START_DATE);
        const now = new Date();
        let diffMs = now - startDate;

        if (isNaN(startDate.getTime()) || diffMs < 0) {
            diffMs = 0;
        }

        const seconds = Math.floor((diffMs / 1000) % 60);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365.25);
        const days = Math.floor(totalDays % 365.25);

        if (yearsCount) yearsCount.textContent = String(years).padStart(2, '0');
        if (daysCount) daysCount.textContent = String(days).padStart(2, '0');
        if (hoursCount) hoursCount.textContent = String(hours).padStart(2, '0');
        if (minutesCount) minutesCount.textContent = String(minutes).padStart(2, '0');
        if (secondsCount) secondsCount.textContent = String(seconds).padStart(2, '0');
    }

    updateTogetherTimer();
    setInterval(updateTogetherTimer, 1000);

    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            couponTicket.classList.add('claimed');
            createConfettiBurst(120);
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
