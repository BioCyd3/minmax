/**
 * Navigation Component JavaScript
 * Handles mobile navigation, active states, and accessibility
 */

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupActiveStates();
        this.setupScrollEffects();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
    }

    setupMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileClose = document.querySelector('.mobile-nav-close');
        const hamburger = document.querySelector('.hamburger');

        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileNav();
            });

            if (mobileClose) {
                mobileClose.addEventListener('click', () => {
                    this.closeMobileNav();
                });
            }

            // Close mobile nav when clicking on a link
            const mobileLinks = mobileNav.querySelectorAll('.nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileNav();
                });
            });

            // Close mobile nav when clicking outside
            mobileNav.addEventListener('click', (e) => {
                if (e.target === mobileNav) {
                    this.closeMobileNav();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                    this.closeMobileNav();
                }
            });
        }
    }

    toggleMobileNav() {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        const body = document.body;

        if (mobileNav && hamburger) {
            const isOpen = mobileNav.classList.contains('open');
            
            if (isOpen) {
                this.closeMobileNav();
            } else {
                this.openMobileNav();
            }
        }
    }

    openMobileNav() {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        const body = document.body;

        if (mobileNav && hamburger) {
            mobileNav.classList.add('open');
            hamburger.classList.add('open');
            body.style.overflow = 'hidden';

            // Focus management
            const firstLink = mobileNav.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }

    closeMobileNav() {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        const body = document.body;

        if (mobileNav && hamburger) {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
            body.style.overflow = '';

            // Return focus to toggle button
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            if (mobileToggle) {
                mobileToggle.focus();
            }
        }
    }

    setupActiveStates() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            // Handle root path and index.html
            const isCurrentPage = (
                linkPath === currentPath ||
                (currentPath === '/' && linkPath.endsWith('/index.html')) ||
                (currentPath.endsWith('/index.html') && linkPath === '/') ||
                (currentPath.endsWith('/') && linkPath.endsWith('/index.html'))
            );

            if (isCurrentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        if (header) {
            const handleScroll = () => {
                const currentScrollY = window.scrollY;
                
                // Add scrolled class for styling
                if (currentScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                lastScrollY = currentScrollY;
            };

            // Throttle scroll events
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    setupKeyboardNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    navLinks[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                }
            });
        });
    }

    setupAccessibility() {
        // Add skip link if it doesn't exist
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Ensure main content has proper ID
        const container = document.querySelector('.container');
        if (container && !container.id) {
            container.id = 'main-content';
        }

        // Add proper ARIA labels
        const nav = document.querySelector('.nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }

        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-label', 'Toggle mobile navigation');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-controls', 'mobile-nav');
        }

        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.id = 'mobile-nav';
            mobileNav.setAttribute('aria-label', 'Mobile navigation');
        }
    }

    // Public method to refresh active states (useful for SPA-like behavior)
    refreshActiveStates() {
        this.setupActiveStates();
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}