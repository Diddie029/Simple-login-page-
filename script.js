// ===== CONFIGURATION =====
const VALID_CREDENTIALS = {
    email: 'trial@gmail.com',
    password: 'trial@1234'
};

// Anime Character Quotes
const CHARACTER_QUOTES = {
    login: [
        '"Believe in yourself!"',
        '"Never give up!"',
        '"Power comes from passion!"',
        '"Friendship is strength!"',
        '"Let\'s go beyond our limits!"'
    ],
    signup: [
        '"Your adventure starts here!"',
        '"Unlock your true potential!"',
        '"Every hero\'s journey begins now!"',
        '"Welcome to the guild!"',
        '"Let\'s become stronger together!"'
    ],
    success: [
        '"You unlocked the premium content!"',
        '"Welcome, warrior!"',
        '"Achievement unlocked! 🏆"',
        '"Welcome to the inner sanctum!"',
        '"Your legend begins!"'
    ]
};

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addParticle(x, y, velocityX, velocityY, color = '#00d4ff', life = 2000) {
        this.particles.push({
            x: x,
            y: y,
            vx: velocityX,
            vy: velocityY,
            color: color,
            life: life,
            maxLife: life,
            radius: Math.random() * 3 + 2
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 16;

            const alpha = p.life / p.maxLife;
            this.ctx.fillStyle = this.hexToRgba(p.color, alpha);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    burst(x, y, count = 30, colors = ['#ff006e', '#00d4ff', '#a000ff']) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 4 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.addParticle(x, y, vx, vy, color, 1500);
        }
    }
}

// ===== CONFETTI SYSTEM =====
class ConfettiSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    create() {
        const colors = ['#ff006e', '#00d4ff', '#a000ff', '#00ff88', '#ffb700'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = `confetti confetti-${['pink', 'cyan', 'purple', 'green', 'gold'][Math.floor(Math.random() * 5)]}`;

            const x = Math.random() * window.innerWidth;
            const y = -10;
            const duration = 3 + Math.random() * 2;
            const delay = Math.random() * 0.5;
            const rotation = Math.random() * 360;

            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.width = (5 + Math.random() * 10) + 'px';
            confetti.style.height = (5 + Math.random() * 10) + 'px';
            confetti.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;

            this.container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }

        this.addConfettiAnimation();
    }

    addConfettiAnimation() {
        if (document.getElementById('confetti-animation')) return;

        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotateZ(0deg) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(${window.innerHeight}px) rotateZ(720deg) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== FORM MANAGER =====
class FormManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.loginFormElement = document.getElementById('loginFormElement');
        this.signupFormElement = document.getElementById('signupFormElement');
        this.toggleButtons = document.querySelectorAll('.toggle-form');
        this.particleSystem = new ParticleSystem('particleCanvas');
        this.confettiSystem = new ConfettiSystem('confettiContainer');
        this.successModal = document.getElementById('successModal');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form toggle
        this.toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = btn.dataset.form;
                this.toggleForm(form);
            });
        });

        // Form submissions
        this.loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupFormElement.addEventListener('submit', (e) => this.handleSignup(e));

        // Input animations
        this.setupInputAnimations();

        // Character avatar interaction
        this.setupCharacterInteraction();

        // Update quotes
        this.updateQuotes();
    }

    setupCharacterInteraction() {
        const avatar = document.getElementById('characterAvatar');
        if (avatar) {
            avatar.addEventListener('click', () => {
                this.characterSpeak();
            });
        }
    }

    characterSpeak() {
        const randomQuote = CHARACTER_QUOTES.login[Math.floor(Math.random() * CHARACTER_QUOTES.login.length)];
        const quoteEl = document.getElementById('loginQuote');
        if (quoteEl) {
            quoteEl.textContent = randomQuote;
            quoteEl.style.animation = 'none';
            setTimeout(() => {
                quoteEl.style.animation = 'quoteFloat 2s ease-in-out infinite';
            }, 10);
        }
    }

    updateQuotes() {
        const loginQuote = document.getElementById('loginQuote');
        const signupQuote = document.getElementById('signupQuote');
        
        if (loginQuote) {
            loginQuote.textContent = CHARACTER_QUOTES.login[Math.floor(Math.random() * CHARACTER_QUOTES.login.length)];
        }
        if (signupQuote) {
            signupQuote.textContent = CHARACTER_QUOTES.signup[Math.floor(Math.random() * CHARACTER_QUOTES.signup.length)];
        }
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    toggleForm(form) {
        if (form === 'login') {
            this.loginForm.classList.add('active');
            this.signupForm.classList.remove('active');
        } else if (form === 'signup') {
            this.signupForm.classList.add('active');
            this.loginForm.classList.remove('active');
        }
        // Clear forms and errors
        this.clearErrors();
        this.loginFormElement.reset();
        this.signupFormElement.reset();
    }

    handleLogin(e) {
        e.preventDefault();
        this.clearErrors();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Validation
        if (!this.validateEmail(email)) {
            this.showError('loginError', 'Please enter a valid email address');
            this.shakeForm(this.loginForm);
            return;
        }

        if (!password) {
            this.showError('loginError', 'Please enter your password');
            this.shakeForm(this.loginForm);
            return;
        }

        // Check credentials
        if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
            this.showLoginSuccess();
        } else {
            this.showError('loginError', 'Invalid email or password');
            this.shakeForm(this.loginForm);
            // Particle burst on error
            this.particleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 20, ['#ff4060']);
        }
    }

    handleSignup(e) {
        e.preventDefault();
        this.clearErrors();

        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value.trim();
        const confirmPassword = document.getElementById('signupConfirm').value.trim();

        // Validation
        if (!username) {
            this.showError('signupError', 'Please enter a username');
            this.shakeForm(this.signupForm);
            return;
        }

        if (username.length < 3) {
            this.showError('signupError', 'Username must be at least 3 characters');
            this.shakeForm(this.signupForm);
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('signupError', 'Please enter a valid email address');
            this.shakeForm(this.signupForm);
            return;
        }

        if (!password || password.length < 6) {
            this.showError('signupError', 'Password must be at least 6 characters');
            this.shakeForm(this.signupForm);
            return;
        }

        if (password !== confirmPassword) {
            this.showError('signupError', 'Passwords do not match');
            this.shakeForm(this.signupForm);
            return;
        }

        // Success
        this.showSignupSuccess();
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearErrors() {
        document.getElementById('loginError').textContent = '';
        document.getElementById('loginError').classList.remove('show');
        document.getElementById('signupError').textContent = '';
        document.getElementById('signupError').classList.remove('show');
    }

    shakeForm(formElement) {
        formElement.classList.add('shake');
        setTimeout(() => {
            formElement.classList.remove('shake');
        }, 500);
    }

    showLoginSuccess() {
        // Confetti and particles
        this.confettiSystem.create();
        this.particleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 50);

        // Update character message
        const charMessage = document.getElementById('characterMessage');
        if (charMessage) {
            charMessage.textContent = CHARACTER_QUOTES.success[Math.floor(Math.random() * CHARACTER_QUOTES.success.length)];
        }

        // Show modal
        this.successModal.classList.add('show');

        // Countdown and redirect
        let countdown = 3;
        const countdownElement = document.getElementById('redirectCount');

        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(interval);
                this.successModal.classList.remove('show');
                this.resetLogin();
            }
        }, 1000);
    }

    showSignupSuccess() {
        // Celebration
        this.confettiSystem.create();
        this.particleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 40, ['#00ff88', '#00d4ff']);

        // Show message
        const errorElement = document.getElementById('signupError');
        errorElement.textContent = '✨ Character Created Successfully! Welcome to the Guild! ✨';
        errorElement.classList.add('show');
        errorElement.style.color = '#00ff88';

        // Reset form
        setTimeout(() => {
            this.signupFormElement.reset();
            this.toggleForm('login');
        }, 2000);
    }

    resetLogin() {
        this.loginFormElement.reset();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const formManager = new FormManager();

    // Add button particle effects on click
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            formManager.particleSystem.burst(x, y, 15, ['#ff006e', '#00d4ff']);
        });
    });

    // Page load fade-in
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== MOUSE MOVEMENT PARALLAX EFFECT =====
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const moveX = (x - 0.5) * (20 + index * 10);
        const moveY = (y - 0.5) * (20 + index * 10);
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ===== RESPONSIVE ADJUSTMENTS =====
window.addEventListener('resize', () => {
    // Handle any responsive adjustments if needed
});
