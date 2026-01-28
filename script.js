// Arqon Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Services Tabbed Display
    const serviceTabs = document.querySelectorAll('.service-tab');
    const servicePanels = document.querySelectorAll('.service-panel');
    
    if (serviceTabs.length > 0 && servicePanels.length > 0) {
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                
                // Remove active from all tabs
                serviceTabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                this.classList.add('active');
                
                // Hide all panels
                servicePanels.forEach(panel => panel.classList.remove('active'));
                // Show target panel
                const targetPanel = document.querySelector(`.service-panel[data-service="${target}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }
    
    // Auth Button - Check if user is logged in
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        // Check for auth tokens in localStorage (common patterns across Arqon services)
        const hasAuthToken = 
            localStorage.getItem('arqon_auth_token') ||
            localStorage.getItem('arqon_session_token') ||
            localStorage.getItem('auth_token') ||
            localStorage.getItem('session_token') ||
            localStorage.getItem('user_email');
        
        if (hasAuthToken) {
            authButton.textContent = 'ACCOUNT';
            authButton.href = 'https://account.arqon.ai';
        } else {
            authButton.textContent = 'SIGN UP';
            authButton.href = 'https://account.arqon.ai';
        }
    }
    
    // Services Dropdown Navigation
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking a service link
        const dropdownItems = dropdown.querySelectorAll('.nav-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                dropdown.classList.remove('active');
            });
        });
    }
    
    // Modal Management
    const modals = {
        contact: {
            link: document.getElementById('contact-link'),
            modal: document.getElementById('contact-modal')
        },
        privacy: {
            link: document.getElementById('privacy-link'),
            modal: document.getElementById('privacy-modal')
        },
        terms: {
            link: document.getElementById('terms-link'),
            modal: document.getElementById('terms-modal')
        }
    };
    
    // Set up each modal
    Object.values(modals).forEach(({ link, modal }) => {
        if (link && modal) {
            // Open modal on link click
            link.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.add('active');
            });
            
            // Close modal on X button click
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    modal.classList.remove('active');
                });
            }
            
            // Close modal on backdrop click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
    
    // Close any modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            Object.values(modals).forEach(({ modal }) => {
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            });
        }
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'SENDING...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('https://user.arqon.ai/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        subject: data.subject || 'Website Contact',
                        message: data.message
                    })
                });
                
                if (response.ok) {
                    submitBtn.textContent = 'SENT ✓';
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.opacity = '1';
                        submitBtn.disabled = false;
                        const contactModal = document.getElementById('contact-modal');
                        if (contactModal) {
                            contactModal.classList.remove('active');
                        }
                        contactForm.reset();
                    }, 2000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                submitBtn.textContent = 'ERROR - TRY AGAIN';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip for modal triggers
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards for animation
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Dynamic typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Add subtle glow effect on hover
        heroTitle.addEventListener('mouseenter', () => {
            heroTitle.style.textShadow = '0 0 30px rgba(0, 102, 255, 0.3)';
        });
        
        heroTitle.addEventListener('mouseleave', () => {
            heroTitle.style.textShadow = 'none';
        });
    }

    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle animation to project icon
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Add loading state for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1000);
        });
    });

    // Parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.bg-gradient');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                if (finalValue !== '∞' && !isNaN(finalValue)) {
                    let currentValue = 0;
                    const increment = finalValue / 30;
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue);
                        }
                    }, 50);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Console easter egg
    console.log(`
    ⚡ ARQON - Building the Future
    
    Interested in what we're building?
    Check out our portfolio: https://apotheos.ai
    
    Want to join the team?
    Email: contact@arqon.ai
    `);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Any heavy scroll operations can go here
}, 10);
