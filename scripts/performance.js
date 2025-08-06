/**
 * Performance Optimization Script
 * Handles lazy loading of non-critical CSS and font optimization
 */

(function() {
    'use strict';

    // Performance utilities
    const Performance = {
        // Check if user prefers reduced motion
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        
        // Check connection quality
        getConnectionType: function() {
            if ('connection' in navigator) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                return {
                    effectiveType: connection.effectiveType || '4g',
                    saveData: connection.saveData || false
                };
            }
            return { effectiveType: '4g', saveData: false };
        },

        // Lazy load CSS files
        loadCSS: function(href, media = 'all', onload = null) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print'; // Load as print first to avoid render blocking
            link.onload = function() {
                this.media = media; // Switch to target media once loaded
                if (onload) onload();
            };
            
            // Fallback for browsers that don't support onload on link elements
            if (link.addEventListener) {
                link.addEventListener('load', link.onload);
            }
            
            document.head.appendChild(link);
            return link;
        },

        // Preload important resources
        preloadResource: function(href, as, type = null) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = href;
            link.as = as;
            if (type) link.type = type;
            document.head.appendChild(link);
        },

        // Load fonts with optimization
        loadFonts: function() {
            // Preload critical font weights
            this.preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', 'style');
            
            // Load font CSS
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
            fontLink.media = 'print';
            fontLink.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(fontLink);
        },

        // Initialize performance optimizations
        init: function() {
            const connection = this.getConnectionType();
            const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
            const saveData = connection.saveData;

            // Load fonts immediately for good connections, defer for slow ones
            if (!isSlowConnection && !saveData) {
                this.loadFonts();
            } else {
                // Defer font loading for slow connections
                setTimeout(() => this.loadFonts(), 1000);
            }

            // Load non-critical CSS after initial render
            this.loadNonCriticalCSS(isSlowConnection, saveData);

            // Optimize animations based on connection and preferences
            this.optimizeAnimations(isSlowConnection, saveData);
        },

        // Load non-critical CSS files
        loadNonCriticalCSS: function(isSlowConnection, saveData) {
            const nonCriticalStyles = [
                'css/components/cards.css',
                'css/components/forms.css',
                'css/layouts/responsive.css',
                'css/foundation/utilities.css'
            ];

            const animationStyles = [
                'css/animations/transitions.css',
                'css/animations/micro-interactions.css'
            ];

            // Load essential non-critical styles first
            const loadDelay = isSlowConnection || saveData ? 500 : 100;
            
            setTimeout(() => {
                nonCriticalStyles.forEach((href, index) => {
                    setTimeout(() => {
                        this.loadCSS(href);
                    }, index * 50); // Stagger loading to avoid blocking
                });
            }, loadDelay);

            // Load animation styles only if user doesn't prefer reduced motion
            if (!this.prefersReducedMotion && !saveData) {
                const animationDelay = isSlowConnection ? 1000 : 300;
                setTimeout(() => {
                    animationStyles.forEach((href, index) => {
                        setTimeout(() => {
                            this.loadCSS(href);
                        }, index * 100);
                    });
                }, animationDelay);
            }
        },

        // Optimize animations based on performance constraints
        optimizeAnimations: function(isSlowConnection, saveData) {
            if (this.prefersReducedMotion || isSlowConnection || saveData) {
                // Add class to disable heavy animations
                document.documentElement.classList.add('reduce-animations');
                
                // Add CSS to reduce animations
                const style = document.createElement('style');
                style.textContent = `
                    .reduce-animations * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                    .reduce-animations .hero::after,
                    .reduce-animations .hero-decoration {
                        animation: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    };

    // CSS Bundle Optimization
    const CSSOptimizer = {
        // Remove unused CSS classes (basic implementation)
        removeUnusedCSS: function() {
            // This is a simplified version - in production, you'd use tools like PurgeCSS
            const usedClasses = new Set();
            const elements = document.querySelectorAll('*');
            
            elements.forEach(el => {
                if (el.className && typeof el.className === 'string') {
                    el.className.split(' ').forEach(cls => {
                        if (cls.trim()) usedClasses.add(cls.trim());
                    });
                }
            });

            // Store used classes for potential CSS purging
            window.usedCSSClasses = Array.from(usedClasses);
        },

        // Inline critical CSS if not already done
        inlineCriticalCSS: function() {
            // Check if critical CSS is already inlined
            if (document.querySelector('style[data-critical]')) {
                return;
            }

            // This would typically be done at build time
            // For runtime, we can at least ensure critical styles are prioritized
            const criticalLink = document.querySelector('link[href*="critical.css"]');
            if (criticalLink) {
                criticalLink.setAttribute('data-critical', 'true');
                // Move to top of head for priority
                document.head.insertBefore(criticalLink, document.head.firstChild);
            }
        }
    };

    // Resource Loading Optimization
    const ResourceOptimizer = {
        // Preload important resources based on page
        preloadPageResources: function() {
            const currentPage = window.location.pathname;
            
            // Preload resources based on current page
            switch (true) {
                case currentPage.includes('palbook'):
                    Performance.preloadResource('data/palbook-data.js', 'script');
                    Performance.preloadResource('scripts/palbook.js', 'script');
                    break;
                case currentPage.includes('tierlist'):
                    Performance.preloadResource('css/components/tier-list.css', 'style');
                    break;
                case currentPage.includes('team'):
                    Performance.preloadResource('css/components/team-compositions.css', 'style');
                    break;
            }
        },

        // Lazy load images
        lazyLoadImages: function() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                observer.unobserve(img);
                            }
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    };

    // Initialize all optimizations when DOM is ready
    function initializeOptimizations() {
        Performance.init();
        CSSOptimizer.inlineCriticalCSS();
        CSSOptimizer.removeUnusedCSS();
        ResourceOptimizer.preloadPageResources();
        ResourceOptimizer.lazyLoadImages();

        // Mark performance script as loaded
        document.documentElement.setAttribute('data-perf-loaded', 'true');
    }

    // Initialize based on document ready state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOptimizations);
    } else {
        initializeOptimizations();
    }

    // Expose utilities globally for debugging
    window.PalmonPerformance = {
        Performance,
        CSSOptimizer,
        ResourceOptimizer
    };

})();