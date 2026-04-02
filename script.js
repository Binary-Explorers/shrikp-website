// ==========================================
// FORM CONFIGURATION
// ==========================================
const FORM_CONFIG = {
    FORM_MODE: 'netlify', // 'netlify' or 'google'
    RECIPIENT_EMAIL: 'sitexar.team@gmail.com',
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL', // Replace with actual Google Apps Script URL
    WHATSAPP_NUMBER: '+919008667286',
    PHONE_NUMBER: '+919008667286'
};

// ==========================================
// UTILITY FUNCTIONS FOR FORM SUBMISSION
// ==========================================

/**
 * Format form data into a structured email message
 */
function formatEmailMessage(formData) {
    const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return `New Client Inquiry Received

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
-------------------------
${formData.message}
-------------------------

Submitted At: ${timestamp}`;
}

/**
 * Send form data to Google Sheets (future integration)
 */
async function sendToGoogleSheets(formData) {
    try {
        const response = await fetch(FORM_CONFIG.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        return true;
    } catch (error) {
        console.error('Google Sheets submission error:', error);
        return false;
    }
}

/**
 * Display fallback contact UI when submission fails
 */
function showFallbackUI() {
    const formStatus = document.getElementById('formStatus');
    const whatsappLink = `https://wa.me/${FORM_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=Hi%2C%20I%20wanted%20to%20contact%20Shri%20KP%20%26%20Associates`;
    const phoneLink = `tel:${FORM_CONFIG.PHONE_NUMBER}`;

    formStatus.innerHTML = `
        <div class="fallback-container">
            <p class="fallback-message">Unable to submit form. Please contact us directly.</p>
            <div class="fallback-actions">
                <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="fallback-btn whatsapp-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;margin-right:8px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.7 1.12l-.337.197-.35-.055c-1.232-.196-2.444-.477-3.6-.932-.256-.1-.512-.202-.704-.295-.202-.1-.406-.19-.612-.26L3.776 1.08c-.33 0-.603.285-.603.637v3.813c0 .233-.04.505-.14.784C2.457 8.155 1.5 10.4 1.5 12.74c0 3.88 2.318 7.275 5.85 8.963.794.36 1.66.65 2.568.859.91.208 1.84.3 2.744.258.904-.043 1.78-.235 2.63-.566.325-.124.644-.25.957-.39.258-.12.51-.25.758-.398.242-.14.475-.295.697-.465 1.51-1.15 2.675-2.666 3.284-4.384.305-.86.483-1.788.47-2.68 0-1.013-.13-2.023-.382-3l.13-.216c.5-.82.83-1.681.983-2.53.153-.848.15-1.694.001-2.49.002-1.045-.274-1.927-.798-2.597.236-.256.47-.548.697-.877.226-.33.42-.703.576-1.105.15-.38.252-.806.31-1.27.057-.462.048-.948-.02-1.456Z"/></svg>
                    WhatsApp
                </a>
                <a href="${phoneLink}" class="fallback-btn phone-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:8px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Call Now
                </a>
            </div>
        </div>
    `;
    formStatus.className = 'form-status error';
    formStatus.style.display = '';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateCounter = (el) => {
        const text = el.innerText.trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (match) {
            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            const duration = 2000;
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            el.innerText = `0${suffix}`;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const easeOut = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(target * easeOut);

                el.innerText = `${current}${suffix}`;

                if (frame >= totalFrames) {
                    clearInterval(counter);
                    el.innerText = text;
                }
            }, frameRate);
        }
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Specific inner elements triggering
                const divider = entry.target.querySelector('.hero-divider');
                if (divider) divider.classList.add('is-visible');

                // Trigger counter if stat-number exists within the target
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl) animateCounter(numberEl);

                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down');
    animatedElements.forEach(el => observer.observe(el));


    // 2. Scroll Spy and Progress Bar (Performance Optimized)
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress-bar');
    document.body.appendChild(progressBar);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
    backToTopBtn.innerHTML = `
        <svg class="progress-ring" viewBox="0 0 56 56" aria-hidden="true">
            <circle class="progress-track" cx="28" cy="28" r="24"></circle>
            <circle class="progress-indicator" cx="28" cy="28" r="24"></circle>
        </svg>
        <span class="back-to-top-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        </span>
    `;
    document.body.appendChild(backToTopBtn);

    // Parallax Elements cache
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    const progressIndicator = backToTopBtn.querySelector('.progress-indicator');
    const ringRadius = progressIndicator?.r.baseVal.value || 0;
    const ringCircumference = 2 * Math.PI * ringRadius;

    if (progressIndicator) {
        progressIndicator.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`;
        progressIndicator.style.strokeDashoffset = `${ringCircumference}`;
    }

    let sectionTops = [];
    const refreshSectionMetrics = () => {
        sectionTops = Array.from(sections).map(section => (
            section.getBoundingClientRect().top + window.pageYOffset
        ));
    };

    const getSectionProgress = (scrollY) => {
        if (sectionTops.length <= 1) return 0;
        const maxIndex = sectionTops.length - 1;
        let currentIndex = 0;

        for (let i = 0; i < sectionTops.length; i++) {
            if (scrollY + 1 >= sectionTops[i]) {
                currentIndex = i;
            } else {
                break;
            }
        }

        const start = sectionTops[currentIndex];
        const end = sectionTops[Math.min(currentIndex + 1, maxIndex)];
        const span = Math.max(1, end - start);
        const localProgress = Math.min(1, Math.max(0, (scrollY - start) / span));

        return (currentIndex + localProgress) / maxIndex;
    };

    const updateProgressRing = (progress) => {
        if (!progressIndicator) return;
        const clamped = Math.max(0, Math.min(1, progress));
        const offset = ringCircumference * (1 - clamped);
        progressIndicator.style.strokeDashoffset = `${offset}`;
    };

    const updateScrollState = () => {
        const winScroll = window.scrollY;

        // Navbar Scrolled State
        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress Bar
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height);
        progressBar.style.transform = `scaleX(${scrolled})`;

        // Circular progress based on section count
        updateProgressRing(getSectionProgress(winScroll));

        // Back To Top Visibility
        if (winScroll > window.innerHeight * 0.8) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }

        // Parallax Movement Loop
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Only compute transforms if element is currently inside the viewport vertical buffer
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const speed = parseFloat(el.getAttribute('data-parallax'));
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    };

    // Advanced IntersectionObserver Scroll Spy
    // This perfectly toggles active links without forcing browser reflows like offsetTop does
    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Highly tuned margin to detect the 'reading focus' area
        threshold: 0
    });

    sections.forEach(section => {
        activeNavObserver.observe(section);
    });

    // requestAnimationFrame scroll listener for extreme performance
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollState();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    refreshSectionMetrics();
    // Initial call
    updateScrollState();

    window.addEventListener('resize', () => {
        refreshSectionMetrics();
        updateScrollState();
    }, { passive: true });

    // 3. Premium Mobile Menu (Off-Canvas with Backdrop, Focus Trap, Scroll Lock)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navCloseBtn = document.querySelector('.nav-close');

    const toggleMobileMenu = (open) => {
        const isOpen = open !== undefined ? open : !menuToggle.classList.contains('active');
        
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        navLinksContainer.classList.toggle('nav-open', isOpen);
        navLinksContainer.setAttribute('aria-expanded', isOpen);
        
        if (navBackdrop) navBackdrop.classList.toggle('nav-open', isOpen);
        
        if (isOpen) {
            // Body scroll lock
            document.body.style.overflow = 'hidden';
            // Focus first link
            navLinksContainer.querySelector('.nav-link')?.focus();
        } else {
            document.body.style.overflow = '';
        }
    };

    if (menuToggle && navLinksContainer) {
        // Toggle button
        menuToggle.addEventListener('click', () => toggleMobileMenu());
        
        // Backdrop click
        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => toggleMobileMenu(false));
        }
        
        // Close button
        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
        }
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
        
        // Focus trap
        navLinksContainer.addEventListener('keydown', (e) => {
            if (!navLinksContainer.classList.contains('nav-open')) return;
            
            const focusable = navLinksContainer.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        });
        
        // Close on nav link click
        navLinksContainer.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });
    }

    // 4. Premium Custom Smooth Scrolling
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3); // Emulates cubic-bezier(0.25, 1, 0.5, 1)

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();

                // Close mobile menu if open
                if (menuToggle && navLinksContainer) {
                    menuToggle.classList.remove('active');
                    navLinksContainer.classList.remove('nav-open');
                }

                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (navbarHeight - 2); // 2px extra clearance
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // 800ms premium duration
                let startTime = null;

                const animation = (currentTime) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easeOutCubic(progress);

                    window.scrollTo(0, startPosition + distance * ease);

                    if (timeElapsed < duration) {
                        window.requestAnimationFrame(animation);
                    }
                };

                window.requestAnimationFrame(animation);
            }
        });
    });

    // 5. Back To Top Action
    backToTopBtn.addEventListener('click', () => {
        const startPosition = window.pageYOffset;
        const distance = -startPosition;
        const duration = 800; // Premium 800ms scroll back to top
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                window.requestAnimationFrame(animation);
            }
        };

        window.requestAnimationFrame(animation);
    });

    // 6. Contact Form Validation
    const form = document.getElementById('contactForm');
    if (form) {
        const inputs = form.querySelectorAll('.form-input, .form-select');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const formStatus = document.getElementById('formStatus');

        const validateInput = (input) => {
            const wrapper = input.closest('.input-wrapper');
            let isValid = true;

            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                }
            } else if (input.type === 'tel') {
                const phoneRegex = /^[0-9+\s]+$/;
                if (!phoneRegex.test(input.value.trim()) || input.value.trim().length < 8) {
                    isValid = false;
                }
            }

            if (isValid) {
                wrapper.classList.remove('error');
                if (input.value.trim()) wrapper.classList.add('success');
            } else {
                wrapper.classList.remove('success');
                wrapper.classList.add('error');
            }

            return isValid;
        };

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) validateInput(input);
            });
            input.addEventListener('input', () => {
                const wrapper = input.closest('.input-wrapper');
                if (wrapper.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // ===== START SUBMISSION FLOW =====
                submitBtn.classList.add('loading');
                submitBtn.style.pointerEvents = 'none';
                const originalBtnText = btnText.textContent;
                btnText.textContent = 'Sending...';

                // Collect form data
                const formData = {
                    name: form.name.value.trim(),
                    phone: form.phone.value.trim(),
                    email: form.email.value.trim(),
                    subject: form.subject.value.trim(),
                    message: form.message.value.trim()
                };

                try {
                    if (FORM_CONFIG.FORM_MODE === 'netlify') {
                        // Submit to Netlify Forms
                        const netlifyData = new FormData(form);
                        const response = await fetch('/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams(netlifyData)
                        });

                        if (!response.ok) {
                            throw new Error('Netlify submission failed');
                        }
                    } else if (FORM_CONFIG.FORM_MODE === 'google') {
                        // Submit to Google Sheets
                        const success = await sendToGoogleSheets(formData);
                        if (!success) {
                            throw new Error('Google Sheets submission failed');
                        }
                    }

                    // ===== SUCCESS FLOW =====
                    formStatus.innerHTML = '<p style="font-size: 14px; line-height: 1.5;">Thank you for contacting us. We will respond within 24 hours.</p>';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = '';
                    
                    // Reset form
                    form.reset();
                    inputs.forEach(input => {
                        input.closest('.input-wrapper').classList.remove('success', 'error');
                    });

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.style.pointerEvents = 'auto';
                        btnText.textContent = originalBtnText;
                    }, 3000);

                    // Clear success message
                    setTimeout(() => {
                        formStatus.className = 'form-status';
                    }, 5000);

                } catch (error) {
                    // ===== ERROR FLOW: SHOW FALLBACK UI =====
                    console.error('Form submission error:', error);
                    showFallbackUI();
                    
                    // Reset button to allow retry
                    submitBtn.classList.remove('loading');
                    submitBtn.style.pointerEvents = 'auto';
                    btnText.textContent = originalBtnText;
                }
            } else {
                formStatus.textContent = 'Please fix the errors in the form before submitting.';
                formStatus.className = 'form-status error';
            }
        });
    }

    // 7. Services Accordion (Mobile)
    const serviceGroups = document.querySelectorAll('.service-group');
    const accordionMq = window.matchMedia('(max-width: 767px)');

    const syncServiceAccordion = () => {
        if (!serviceGroups.length) return;

        if (accordionMq.matches) {
            const hasOpen = Array.from(serviceGroups).some(group => group.hasAttribute('open'));
            if (!hasOpen && serviceGroups[0]) {
                serviceGroups[0].setAttribute('open', '');
            }
        } else {
            serviceGroups.forEach(group => group.setAttribute('open', ''));
        }
    };

    const handleServiceToggle = (event) => {
        if (!accordionMq.matches) return;
        const current = event.currentTarget;
        if (!current.open) return;

        serviceGroups.forEach(group => {
            if (group !== current) {
                group.removeAttribute('open');
            }
        });
    };

    serviceGroups.forEach(group => group.addEventListener('toggle', handleServiceToggle));
    syncServiceAccordion();
    accordionMq.addEventListener('change', syncServiceAccordion);
});
