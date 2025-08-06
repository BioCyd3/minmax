/**
 * Cross-Browser Implementation Validation Script
 * Validates that all enhanced features work across different browsers and devices
 */

(function() {
    'use strict';

    const ValidationSuite = {
        results: {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        },

        log: function(test, status, message) {
            const result = {
                test: test,
                status: status,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            this.results.tests.push(result);
            this.results[status]++;
            
            const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
            console.log(`${emoji} ${test}: ${message}`);
        },

        // Test CSS Custom Properties Support
        testCSSCustomProperties: function() {
            const testElement = document.createElement('div');
            testElement.style.setProperty('--test-prop', 'test-value');
            const supported = testElement.style.getPropertyValue('--test-prop') === 'test-value';
            
            if (supported) {
                this.log('CSS Custom Properties', 'passed', 'CSS Custom Properties are supported');
            } else {
                this.log('CSS Custom Properties', 'failed', 'CSS Custom Properties not supported - fallbacks needed');
            }
        },

        // Test CSS Grid Support
        testCSSGrid: function() {
            const supported = CSS.supports('display', 'grid');
            
            if (supported) {
                this.log('CSS Grid', 'passed', 'CSS Grid is supported');
            } else {
                this.log('CSS Grid', 'warning', 'CSS Grid not supported - using flexbox fallbacks');
            }
        },

        // Test Backdrop Filter Support
        testBackdropFilter: function() {
            const supported = CSS.supports('backdrop-filter', 'blur(10px)') || 
                            CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
            
            if (supported) {
                this.log('Backdrop Filter', 'passed', 'Backdrop filter is supported');
            } else {
                this.log('Backdrop Filter', 'warning', 'Backdrop filter not supported - using solid background fallback');
            }
        },

        // Test Critical CSS Loading
        testCriticalCSS: function() {
            const criticalLink = document.querySelector('link[href*="critical.css"]');
            const bundleLink = document.querySelector('link[href*="optimized-bundle.css"]');
            
            if (criticalLink && bundleLink) {
                this.log('CSS Loading Strategy', 'passed', 'Critical CSS and optimized bundle detected');
            } else {
                this.log('CSS Loading Strategy', 'warning', 'CSS loading strategy may not be optimal');
            }
        },

        // Test Font Loading
        testFontLoading: function() {
            const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
            const hasPreconnect = document.querySelector('link[rel="preconnect"][href*="fonts.googleapis.com"]');
            
            if (fontLinks.length > 0 && hasPreconnect) {
                this.log('Font Loading', 'passed', 'Font loading is optimized with preconnect');
            } else {
                this.log('Font Loading', 'warning', 'Font loading could be optimized');
            }
        },

        // Test Responsive Design
        testResponsiveDesign: function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            const hasMediaQueries = Array.from(document.styleSheets).some(sheet => {
                try {
                    return Array.from(sheet.cssRules || []).some(rule => 
                        rule.type === CSSRule.MEDIA_RULE
                    );
                } catch (e) {
                    return false;
                }
            });
            
            if (viewport && hasMediaQueries) {
                this.log('Responsive Design', 'passed', 'Responsive design implementation detected');
            } else {
                this.log('Responsive Design', 'failed', 'Responsive design may not be properly implemented');
            }
        },

        // Test Accessibility Features
        testAccessibility: function() {
            const hasSkipLink = document.querySelector('a[href="#main-content"]');
            const hasAriaLabels = document.querySelectorAll('[aria-label]').length > 0;
            const hasSemanticHTML = document.querySelector('main, nav, header, footer');
            const hasFocusIndicators = getComputedStyle(document.body).getPropertyValue('--focus-color') !== '';
            
            let score = 0;
            if (hasSkipLink) score++;
            if (hasAriaLabels) score++;
            if (hasSemanticHTML) score++;
            if (hasFocusIndicators) score++;
            
            if (score >= 3) {
                this.log('Accessibility', 'passed', `Accessibility features detected (${score}/4)`);
            } else if (score >= 2) {
                this.log('Accessibility', 'warning', `Some accessibility features missing (${score}/4)`);
            } else {
                this.log('Accessibility', 'failed', `Insufficient accessibility features (${score}/4)`);
            }
        },

        // Test Performance Features
        testPerformance: function() {
            const hasPreload = document.querySelectorAll('link[rel="preload"]').length > 0;
            const hasLazyLoading = document.querySelectorAll('img[loading="lazy"]').length > 0;
            const hasAsyncScripts = document.querySelectorAll('script[async]').length > 0;
            
            let score = 0;
            if (hasPreload) score++;
            if (hasLazyLoading) score++;
            if (hasAsyncScripts) score++;
            
            if (score >= 2) {
                this.log('Performance', 'passed', `Performance optimizations detected (${score}/3)`);
            } else if (score >= 1) {
                this.log('Performance', 'warning', `Some performance optimizations missing (${score}/3)`);
            } else {
                this.log('Performance', 'failed', `No performance optimizations detected (${score}/3)`);
            }
        },

        // Test Navigation Functionality
        testNavigation: function() {
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            const mobileNav = document.querySelector('.mobile-nav');
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (mobileToggle && mobileNav && navLinks.length > 0) {
                this.log('Navigation', 'passed', 'Navigation components are present');
            } else {
                this.log('Navigation', 'failed', 'Navigation components are missing');
            }
        },

        // Test JavaScript Functionality
        testJavaScript: function() {
            const hasNavigationScript = typeof window.navigationManager !== 'undefined';
            const hasPerformanceScript = typeof window.PalmonPerformance !== 'undefined';
            const hasAnimationScript = typeof window.animationSystem !== 'undefined';
            
            let score = 0;
            if (hasNavigationScript) score++;
            if (hasPerformanceScript) score++;
            if (hasAnimationScript) score++;
            
            if (score >= 2) {
                this.log('JavaScript', 'passed', `JavaScript modules loaded (${score}/3)`);
            } else if (score >= 1) {
                this.log('JavaScript', 'warning', `Some JavaScript modules missing (${score}/3)`);
            } else {
                this.log('JavaScript', 'failed', `JavaScript modules not loaded (${score}/3)`);
            }
        },

        // Test Browser Compatibility
        testBrowserCompatibility: function() {
            const isModernBrowser = 
                'fetch' in window &&
                'Promise' in window &&
                'IntersectionObserver' in window &&
                CSS.supports('display', 'flex');
            
            if (isModernBrowser) {
                this.log('Browser Compatibility', 'passed', 'Modern browser features available');
            } else {
                this.log('Browser Compatibility', 'warning', 'Some modern features may not be available');
            }
        },

        // Run all tests
        runAllTests: function() {
            console.log('🚀 Starting Cross-Browser Implementation Validation...\n');
            
            this.testCSSCustomProperties();
            this.testCSSGrid();
            this.testBackdropFilter();
            this.testCriticalCSS();
            this.testFontLoading();
            this.testResponsiveDesign();
            this.testAccessibility();
            this.testPerformance();
            this.testNavigation();
            this.testJavaScript();
            this.testBrowserCompatibility();
            
            this.generateReport();
        },

        // Generate final report
        generateReport: function() {
            console.log('\n📊 Validation Report:');
            console.log('='.repeat(50));
            console.log(`✅ Passed: ${this.results.passed}`);
            console.log(`⚠️  Warnings: ${this.results.warnings}`);
            console.log(`❌ Failed: ${this.results.failed}`);
            console.log(`📝 Total Tests: ${this.results.tests.length}`);
            
            const successRate = Math.round((this.results.passed / this.results.tests.length) * 100);
            console.log(`📈 Success Rate: ${successRate}%`);
            
            if (successRate >= 90) {
                console.log('🎉 Excellent! Implementation is highly compatible.');
            } else if (successRate >= 75) {
                console.log('👍 Good! Minor improvements recommended.');
            } else if (successRate >= 60) {
                console.log('⚠️  Fair. Several issues need attention.');
            } else {
                console.log('🚨 Poor. Significant issues detected.');
            }
            
            // Store results for potential debugging
            window.validationResults = this.results;
        }
    };

    // Auto-run tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => ValidationSuite.runAllTests(), 1000);
        });
    } else {
        setTimeout(() => ValidationSuite.runAllTests(), 1000);
    }

    // Expose for manual testing
    window.ValidationSuite = ValidationSuite;

})();

// Additional utility functions for manual testing
window.testFeature = function(featureName) {
    if (window.ValidationSuite && typeof window.ValidationSuite[`test${featureName}`] === 'function') {
        window.ValidationSuite[`test${featureName}`]();
    } else {
        console.error(`Test for ${featureName} not found`);
    }
};

window.runValidation = function() {
    if (window.ValidationSuite) {
        window.ValidationSuite.runAllTests();
    }
};

console.log('🔧 Cross-Browser Validation Suite loaded. Use runValidation() to test manually.');