/* ========================================
   SO-101 India Build Guide — Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavScroll();
    initBOMTabs();
    initScrollAnimations();
});

/* ----------------------------------------
   Background Particles
   ---------------------------------------- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 40;
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f97316', '#10b981'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 6}s`;
        particle.style.width = `${1 + Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

/* ----------------------------------------
   Navbar Scroll Effect
   ---------------------------------------- */
function initNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id], .bom-category[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ----------------------------------------
   BOM Tab Filtering
   ---------------------------------------- */
function initBOMTabs() {
    const tabs = document.querySelectorAll('.bom-tab');
    const rows = document.querySelectorAll('.table-row');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.tab;

            rows.forEach(row => {
                const arm = row.dataset.arm;
                if (filter === 'both') {
                    row.classList.remove('hidden');
                } else if (filter === 'follower') {
                    if (arm === 'follower' || arm === 'both') {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                } else if (filter === 'leader') {
                    if (arm === 'leader' || arm === 'both') {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                }
            });

            // Update subtotals based on filter
            updateSubtotals(filter);
        });
    });
}

function updateSubtotals(filter) {
    const motorSubtotal = document.querySelector('#motors .cost-subtotal');
    const elecSubtotal = document.querySelector('#electronics .cost-subtotal');

    if (motorSubtotal) {
        const subtotalLabel = motorSubtotal.querySelector('span:first-child');
        const subtotalValue = motorSubtotal.querySelector('.subtotal-value');

        if (filter === 'follower') {
            subtotalLabel.textContent = 'Motors Subtotal (Follower)';
            subtotalValue.textContent = '₹10,104';
        } else if (filter === 'leader') {
            subtotalLabel.textContent = 'Motors Subtotal (Leader)';
            subtotalValue.textContent = '₹9,616';
        } else {
            subtotalLabel.textContent = 'Motors Subtotal (Both Arms)';
            subtotalValue.textContent = '₹19,720';
        }
    }

    if (elecSubtotal) {
        const subtotalLabel = elecSubtotal.querySelector('span:first-child');
        const subtotalValue = elecSubtotal.querySelector('.subtotal-value');

        if (filter === 'follower') {
            subtotalLabel.textContent = 'Electronics Subtotal (Follower)';
            subtotalValue.textContent = '₹1,429';
        } else if (filter === 'leader') {
            subtotalLabel.textContent = 'Electronics Subtotal (Leader)';
            subtotalValue.textContent = '₹1,429';
        } else {
            subtotalLabel.textContent = 'Electronics Subtotal';
            subtotalValue.textContent = '₹2,858';
        }
    }
}

/* ----------------------------------------
   Scroll Animations
   ---------------------------------------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .bom-category, .step-card, .note-card, .cost-total, .section-header'
    );

    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}
