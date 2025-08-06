/**
 * Global Error Handler for Palmon World
 * Catches and handles JavaScript errors gracefully
 */

(function() {
    'use strict';

    const ErrorHandler = {
        errors: [],
        maxErrors: 50,
        
        init: function() {
            this.setupGlobalErrorHandling();
            this.setupUnhandledRejectionHandling();
            this.setupResourceErrorHandling();
            this.setupConsoleOverrides();
        },

        setupGlobalErrorHandling: function() {
            window.addEventListener('error', (event) => {
                this.logError({
                    type: 'JavaScript Error',
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error ? event.error.stack : null,
                    timestamp: new Date().toISOString()
                });
            });
        },

        setupUnhandledRejectionHandling: function() {
            window.addEventListener('unhandledrejection', (event) => {
                this.logError({
                    type: 'Unhandled Promise Rejection',
                    message: event.reason ? event.reason.toString() : 'Unknown promise rejection',
                    stack: event.reason ? event.reason.stack : null,
                    timestamp: new Date().toISOString()
                });
            });
        },

        setupResourceErrorHandling: function() {
            // Handle image loading errors
            document.addEventListener('error', (event) => {
                if (event.target.tagName === 'IMG') {
                    this.handleImageError(event.target);
                } else if (event.target.tagName === 'LINK') {
                    this.handleCSSError(event.target);
                } else if (event.target.tagName === 'SCRIPT') {
                    this.handleScriptError(event.target);
                }
            }, true);
        },

        handleImageError: function(img) {
            const originalSrc = img.src;
            
            // Try alternative image paths
            if (originalSrc.includes('Profile-Lucidina.png')) {
                img.src = './images/Profile-Lucindina.png';
            } else if (originalSrc.includes('Profile-Lucindina.png')) {
                img.src = './images/Profile-Lucidina.png';
            } else {
                // Fallback to a placeholder
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMGYzNDYwIi8+Cjx0ZXh0IHg9IjYwIiB5PSI2NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZTBlMGUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                img.alt = 'Image not found';
            }
            
            this.logError({
                type: 'Image Load Error',
                message: `Failed to load image: ${originalSrc}`,
                element: img.outerHTML,
                timestamp: new Date().toISOString()
            });
        },

        handleCSSError: function(link) {
            this.logError({
                type: 'CSS Load Error',
                message: `Failed to load CSS: ${link.href}`,
                element: link.outerHTML,
                timestamp: new Date().toISOString()
            });
        },

        handleScriptError: function(script) {
            this.logError({
                type: 'Script Load Error',
                message: `Failed to load script: ${script.src}`,
                element: script.outerHTML,
                timestamp: new Date().toISOString()
            });
        },

        setupConsoleOverrides: function() {
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.error = (...args) => {
                this.logError({
                    type: 'Console Error',
                    message: args.join(' '),
                    timestamp: new Date().toISOString()
                });
                originalError.apply(console, args);
            };
            
            console.warn = (...args) => {
                this.logError({
                    type: 'Console Warning',
                    message: args.join(' '),
                    timestamp: new Date().toISOString()
                });
                originalWarn.apply(console, args);
            };
        },

        logError: function(error) {
            this.errors.push(error);
            
            // Keep only the most recent errors
            if (this.errors.length > this.maxErrors) {
                this.errors.shift();
            }
            
            // Log to console in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.group(`🚨 ${error.type}`);
                console.error(error.message);
                if (error.stack) {
                    console.error(error.stack);
                }
                if (error.element) {
                    console.error('Element:', error.element);
                }
                console.groupEnd();
            }
        },

        getErrorReport: function() {
            return {
                totalErrors: this.errors.length,
                errors: this.errors,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString()
            };
        },

        clearErrors: function() {
            this.errors = [];
        },

        // Utility functions for common fixes
        fixMissingElements: function() {
            // Add missing main content ID if not present
            const container = document.querySelector('.container');
            if (container && !container.id) {
                container.id = 'main-content';
            }
            
            // Add missing skip link
            if (!document.querySelector('.skip-link')) {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'skip-link sr-only';
                skipLink.textContent = 'Skip to main content';
                skipLink.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: var(--color-secondary-500);
                    color: white;
                    padding: 8px;
                    text-decoration: none;
                    border-radius: 4px;
                    z-index: 1000;
                    transition: top 0.3s;
                `;
                skipLink.addEventListener('focus', () => {
                    skipLink.style.top = '6px';
                });
                skipLink.addEventListener('blur', () => {
                    skipLink.style.top = '-40px';
                });
                document.body.insertBefore(skipLink, document.body.firstChild);
            }
        },

        // Performance monitoring
        monitorPerformance: function() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        if (perfData) {
                            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                            
                            if (loadTime > 3000) {
                                this.logError({
                                    type: 'Performance Warning',
                                    message: `Slow page load detected: ${loadTime}ms`,
                                    timestamp: new Date().toISOString()
                                });
                            }
                        }
                    }, 1000);
                });
            }
        }
    };

    // Initialize error handling
    ErrorHandler.init();
    ErrorHandler.fixMissingElements();
    ErrorHandler.monitorPerformance();

    // Expose for debugging
    window.ErrorHandler = ErrorHandler;

    // Auto-report errors in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setInterval(() => {
            if (ErrorHandler.errors.length > 0) {
                console.log('📊 Error Report:', ErrorHandler.getErrorReport());
            }
        }, 30000); // Every 30 seconds
    }

})();