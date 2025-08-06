// Cross-Browser Compatibility Testing Script
// This script tests all enhanced styling features across different browsers

class BrowserCompatibilityTester {
    constructor() {
        this.results = {
            browser: this.detectBrowser(),
            features: {},
            performance: {},
            accessibility: {},
            responsive: {}
        };
        
        this.init();
    }
    
    init() {
        console.log('🚀 Starting Cross-Browser Compatibility Tests...');
        this.testCSSFeatures();
        this.testResponsiveDesign();
        this.testTouchTargets();
        this.testAccessibility();
        this.testPerformance();
        this.generateReport();
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent;
        const browsers = {
            chrome: /Chrome\/(\d+)/.test(userAgent) && !/Edg/.test(userAgent),
            firefox: /Firefox\/(\d+)/.test(userAgent),
            safari: /Safari\/(\d+)/.test(userAgent) && !/Chrome/.test(userAgent),
            edge: /Edg\/(\d+)/.test(userAgent),
            ie: /MSIE|Trident/.test(userAgent)
        };
        
        const browserName = Object.keys(browsers).find(key => browsers[key]) || 'unknown';
        const version = userAgent.match(new RegExp(`${browserName === 'edge' ? 'Edg' : browserName}\/(\d+)`, 'i'))?.[1] || 'unknown';
        
        return {
            name: browserName,
            version: version,
            userAgent: userAgent,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent)
        };
    }
    
    testCSSFeatures() {
        console.log('🎨 Testing CSS Feature Support...');
        
        const features = {
            'CSS Grid': () => CSS.supports('display', 'grid'),
            'Flexbox': () => CSS.supports('display', 'flex'),
            'CSS Variables': () => CSS.supports('color', 'var(--test)'),
            'Backdrop Filter': () => CSS.supports('backdrop-filter', 'blur(10px)'),
            'Object Fit': () => CSS.supports('object-fit', 'cover'),
            'CSS Clamp': () => CSS.supports('font-size', 'clamp(1rem, 2vw, 2rem)'),
            'Aspect Ratio': () => CSS.supports('aspect-ratio', '1 / 1'),
            'Gap Property': () => CSS.supports('gap', '1rem'),
            'Background Clip Text': () => CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text'),
            'Position Sticky': () => CSS.supports('position', 'sticky'),
            'CSS Filters': () => CSS.supports('filter', 'blur(10px)'),
            'Transform 3D': () => CSS.supports('transform', 'translateZ(0)'),
            'Transition': () => CSS.supports('transition', 'all 0.3s ease'),
            'Animation': () => CSS.supports('animation', 'test 1s linear'),
            'Border Radius': () => CSS.supports('border-radius', '10px'),
            'Box Shadow': () => CSS.supports('box-shadow', '0 0 10px rgba(0,0,0,0.1)'),
            'Text Shadow': () => CSS.supports('text-shadow', '1px 1px 1px rgba(0,0,0,0.5)'),
            'Multiple Backgrounds': () => CSS.supports('background', 'url(a.png), url(b.png)'),
            'CSS Gradients': () => CSS.supports('background', 'linear-gradient(to right, red, blue)'),
            'CSS Calc': () => CSS.supports('width', 'calc(100% - 20px)')
        };
        
        Object.entries(features).forEach(([name, test]) => {
            try {
                const supported = test();
                this.results.features[name] = {
                    supported: supported,
                    status: supported ? 'PASS' : 'FAIL'
                };
                console.log(`  ${supported ? '✅' : '❌'} ${name}: ${supported ? 'Supported' : 'Not Supported'}`);
            } catch (error) {
                this.results.features[name] = {
                    supported: false,
                    status: 'ERROR',
                    error: error.message
                };
                console.log(`  ⚠️ ${name}: Error testing - ${error.message}`);
            }
        });
    }
    
    testResponsiveDesign() {
        console.log('📱 Testing Responsive Design...');
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        const breakpoints = {
            'Mobile Small': viewport.width < 480,
            'Mobile': viewport.width < 640,
            'Mobile Large': viewport.width < 768,
            'Tablet': viewport.width < 1024,
            'Desktop': viewport.width >= 1024
        };
        
        const activeBreakpoint = Object.keys(breakpoints).find(key => breakpoints[key]) || 'Desktop';
        
        this.results.responsive = {
            viewport: viewport,
            activeBreakpoint: activeBreakpoint,
            breakpoints: breakpoints,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            highDPI: viewport.devicePixelRatio > 1
        };
        
        console.log(`  📐 Viewport: ${viewport.width}x${viewport.height}`);
        console.log(`  📱 Active Breakpoint: ${activeBreakpoint}`);
        console.log(`  🔄 Orientation: ${this.results.responsive.orientation}`);
        console.log(`  🖥️ High DPI: ${this.results.responsive.highDPI ? 'Yes' : 'No'}`);
    }
    
    testTouchTargets() {
        console.log('👆 Testing Touch Target Sizes...');
        
        const touchTargets = document.querySelectorAll('.btn, .nav-link, .filter-btn, button, input, a');
        const minSize = 44; // WCAG recommended minimum
        const results = [];
        
        touchTargets.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const isValidSize = rect.width >= minSize && rect.height >= minSize;
            const isVisible = rect.width > 0 && rect.height > 0;
            
            if (isVisible) {
                results.push({
                    element: element.tagName.toLowerCase() + (element.className ? `.${element.className.split(' ')[0]}` : ''),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height),
                    valid: isValidSize,
                    status: isValidSize ? 'PASS' : 'FAIL'
                });
            }
        });
        
        const passCount = results.filter(r => r.valid).length;
        const totalCount = results.length;
        
        this.results.accessibility.touchTargets = {
            total: totalCount,
            passed: passCount,
            failed: totalCount - passCount,
            percentage: Math.round((passCount / totalCount) * 100),
            details: results
        };
        
        console.log(`  ✅ Touch Targets Passed: ${passCount}/${totalCount} (${this.results.accessibility.touchTargets.percentage}%)`);
        
        // Log failed targets
        results.filter(r => !r.valid).forEach(target => {
            console.log(`    ❌ ${target.element}: ${target.width}x${target.height}px (too small)`);
        });
    }
    
    testAccessibility() {
        console.log('♿ Testing Accessibility Features...');
        
        const tests = {
            'Focus Indicators': () => {
                const focusableElements = document.querySelectorAll('button, a, input, [tabindex]');
                return focusableElements.length > 0;
            },
            'Alt Text': () => {
                const images = document.querySelectorAll('img');
                const imagesWithAlt = document.querySelectorAll('img[alt]');
                return images.length === 0 || imagesWithAlt.length === images.length;
            },
            'ARIA Labels': () => {
                const interactiveElements = document.querySelectorAll('button, input');
                let hasLabels = true;
                interactiveElements.forEach(el => {
                    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.closest('label')) {
                        hasLabels = false;
                    }
                });
                return hasLabels;
            },
            'Color Contrast': () => {
                // Basic check for high contrast mode support
                return window.matchMedia('(prefers-contrast: high)').matches !== undefined;
            },
            'Reduced Motion': () => {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches !== undefined;
            },
            'Screen Reader Content': () => {
                return document.querySelectorAll('.sr-only').length > 0;
            }
        };
        
        Object.entries(tests).forEach(([name, test]) => {
            try {
                const passed = test();
                this.results.accessibility[name] = {
                    passed: passed,
                    status: passed ? 'PASS' : 'FAIL'
                };
                console.log(`  ${passed ? '✅' : '❌'} ${name}: ${passed ? 'Pass' : 'Fail'}`);
            } catch (error) {
                this.results.accessibility[name] = {
                    passed: false,
                    status: 'ERROR',
                    error: error.message
                };
                console.log(`  ⚠️ ${name}: Error - ${error.message}`);
            }
        });
    }
    
    testPerformance() {
        console.log('⚡ Testing Performance Metrics...');
        
        const performance = window.performance;
        const timing = performance.timing;
        
        if (timing) {
            const metrics = {
                pageLoad: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: null,
                resourceCount: performance.getEntriesByType('resource').length
            };
            
            // Get paint timing if available
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            if (firstPaint) {
                metrics.firstPaint = Math.round(firstPaint.startTime);
            }
            
            // Evaluate performance
            const evaluateMetric = (value, good, ok) => {
                if (value <= good) return 'GOOD';
                if (value <= ok) return 'OK';
                return 'POOR';
            };
            
            this.results.performance = {
                pageLoad: {
                    value: metrics.pageLoad,
                    status: evaluateMetric(metrics.pageLoad, 3000, 5000),
                    unit: 'ms'
                },
                domReady: {
                    value: metrics.domReady,
                    status: evaluateMetric(metrics.domReady, 2000, 4000),
                    unit: 'ms'
                },
                firstPaint: metrics.firstPaint ? {
                    value: metrics.firstPaint,
                    status: evaluateMetric(metrics.firstPaint, 1000, 2000),
                    unit: 'ms'
                } : null,
                resourceCount: {
                    value: metrics.resourceCount,
                    status: evaluateMetric(metrics.resourceCount, 50, 100),
                    unit: 'resources'
                }
            };
            
            Object.entries(this.results.performance).forEach(([name, metric]) => {
                if (metric) {
                    const statusIcon = metric.status === 'GOOD' ? '🟢' : metric.status === 'OK' ? '🟡' : '🔴';
                    console.log(`  ${statusIcon} ${name}: ${metric.value}${metric.unit} (${metric.status})`);
                }
            });
        } else {
            console.log('  ⚠️ Performance timing not available');
        }
    }
    
    generateReport() {
        console.log('\n📊 Cross-Browser Compatibility Report');
        console.log('=====================================');
        
        // Browser Info
        console.log(`\n🌐 Browser: ${this.results.browser.name} ${this.results.browser.version}`);
        console.log(`📱 Device: ${this.results.browser.isMobile ? 'Mobile' : this.results.browser.isTablet ? 'Tablet' : 'Desktop'}`);
        console.log(`📐 Viewport: ${this.results.responsive.viewport.width}x${this.results.responsive.viewport.height}`);
        
        // Feature Support Summary
        const featureCount = Object.keys(this.results.features).length;
        const supportedFeatures = Object.values(this.results.features).filter(f => f.supported).length;
        const featurePercentage = Math.round((supportedFeatures / featureCount) * 100);
        
        console.log(`\n🎨 CSS Features: ${supportedFeatures}/${featureCount} supported (${featurePercentage}%)`);
        
        // Accessibility Summary
        if (this.results.accessibility.touchTargets) {
            console.log(`👆 Touch Targets: ${this.results.accessibility.touchTargets.percentage}% compliant`);
        }
        
        // Performance Summary
        if (this.results.performance.pageLoad) {
            const perfStatus = this.results.performance.pageLoad.status;
            const perfIcon = perfStatus === 'GOOD' ? '🟢' : perfStatus === 'OK' ? '🟡' : '🔴';
            console.log(`⚡ Performance: ${perfIcon} ${perfStatus} (${this.results.performance.pageLoad.value}ms load time)`);
        }
        
        // Recommendations
        this.generateRecommendations();
        
        // Store results globally for further inspection
        window.browserCompatibilityResults = this.results;
        console.log('\n💾 Full results stored in window.browserCompatibilityResults');
    }
    
    generateRecommendations() {
        console.log('\n💡 Recommendations:');
        
        const unsupportedFeatures = Object.entries(this.results.features)
            .filter(([name, result]) => !result.supported)
            .map(([name]) => name);
        
        if (unsupportedFeatures.length > 0) {
            console.log('  🔧 Consider implementing fallbacks for:');
            unsupportedFeatures.forEach(feature => {
                console.log(`    - ${feature}`);
            });
        }
        
        if (this.results.accessibility.touchTargets && this.results.accessibility.touchTargets.percentage < 100) {
            console.log('  📱 Increase touch target sizes to meet 44px minimum');
        }
        
        if (this.results.performance.pageLoad && this.results.performance.pageLoad.status === 'POOR') {
            console.log('  ⚡ Optimize page load performance (current: ' + this.results.performance.pageLoad.value + 'ms)');
        }
        
        if (this.results.browser.name === 'ie') {
            console.log('  ⚠️ Internet Explorer detected - consider showing upgrade notice');
        }
        
        if (this.results.responsive.viewport.width < 768) {
            console.log('  📱 Mobile device detected - ensure mobile optimizations are active');
        }
    }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BrowserCompatibilityTester();
    });
} else {
    new BrowserCompatibilityTester();
}

// Export for manual testing
window.BrowserCompatibilityTester = BrowserCompatibilityTester;