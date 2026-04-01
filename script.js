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

    // Parallax Elements cache
    const parallaxElements = document.querySelectorAll('.parallax-bg');

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
    
    // Initial call
    updateScrollState();

    // 3. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if(menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('nav-open');
        });
    }

    // 4. Premium Custom Smooth Scrolling
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3); // Emulates cubic-bezier(0.25, 1, 0.5, 1)

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    // 5. Contact Form Validation
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

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                btnText.textContent = 'Sending...';
                submitBtn.style.pointerEvents = 'none';
                submitBtn.style.opacity = '0.8';

                // Simulate API call
                setTimeout(() => {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    form.reset();
                    inputs.forEach(input => {
                        input.closest('.input-wrapper').classList.remove('success', 'error');
                    });
                    
                    btnText.textContent = 'Send Message';
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.style.opacity = '1';

                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }, 1500);
            } else {
                formStatus.textContent = 'Please fix the errors in the form before submitting.';
                formStatus.className = 'form-status error';
            }
        });
    }
});
