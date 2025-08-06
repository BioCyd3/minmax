/**
 * Build Optimization Script
 * This script helps optimize CSS and remove unused styles for production
 */

const fs = require('fs');
const path = require('path');

class CSSOptimizer {
    constructor() {
        this.usedClasses = new Set();
        this.usedIds = new Set();
        this.htmlFiles = [];
        this.cssContent = '';
    }

    // Scan HTML files for used classes and IDs
    scanHTMLFiles(directory = '.') {
        const files = fs.readdirSync(directory);
        
        files.forEach(file => {
            if (file.endsWith('.html')) {
                const filePath = path.join(directory, file);
                const content = fs.readFileSync(filePath, 'utf8');
                this.htmlFiles.push({ file, content });
                this.extractUsedSelectors(content);
            }
        });
    }

    // Extract used CSS classes and IDs from HTML content
    extractUsedSelectors(htmlContent) {
        // Extract classes
        const classMatches = htmlContent.match(/class=["']([^"']+)["']/g);
        if (classMatches) {
            classMatches.forEach(match => {
                const classes = match.replace(/class=["']/, '').replace(/["']/, '').split(' ');
                classes.forEach(cls => {
                    if (cls.trim()) {
                        this.usedClasses.add(cls.trim());
                    }
                });
            });
        }

        // Extract IDs
        const idMatches = htmlContent.match(/id=["']([^"']+)["']/g);
        if (idMatches) {
            idMatches.forEach(match => {
                const id = match.replace(/id=["']/, '').replace(/["']/, '');
                if (id.trim()) {
                    this.usedIds.add(id.trim());
                }
            });
        }
    }

    // Load CSS content
    loadCSS(cssFile) {
        this.cssContent = fs.readFileSync(cssFile, 'utf8');
    }

    // Remove unused CSS rules (basic implementation)
    removeUnusedCSS() {
        const lines = this.cssContent.split('\n');
        const optimizedLines = [];
        let inRule = false;
        let currentRule = '';
        let keepRule = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            // Check if line starts a new CSS rule
            if (trimmedLine.includes('{') && !inRule) {
                inRule = true;
                currentRule = trimmedLine.split('{')[0].trim();
                keepRule = this.shouldKeepRule(currentRule);
                
                if (keepRule) {
                    optimizedLines.push(line);
                }
            } else if (trimmedLine === '}' && inRule) {
                inRule = false;
                if (keepRule) {
                    optimizedLines.push(line);
                }
                currentRule = '';
                keepRule = false;
            } else if (inRule && keepRule) {
                optimizedLines.push(line);
            } else if (!inRule) {
                // Keep comments, imports, and other non-rule content
                if (trimmedLine.startsWith('/*') || 
                    trimmedLine.startsWith('@') || 
                    trimmedLine === '' ||
                    trimmedLine.startsWith(':root')) {
                    optimizedLines.push(line);
                }
            }
        });

        return optimizedLines.join('\n');
    }

    // Determine if a CSS rule should be kept
    shouldKeepRule(selector) {
        // Always keep essential selectors
        const essentialSelectors = [
            '*', 'html', 'body', ':root', '::before', '::after',
            '@media', '@keyframes', '@font-face'
        ];

        if (essentialSelectors.some(essential => selector.includes(essential))) {
            return true;
        }

        // Check if selector uses any of our used classes or IDs
        const selectorParts = selector.split(/[,\s>+~]/);
        
        return selectorParts.some(part => {
            const cleanPart = part.trim().replace(/[:\[\]()]/g, '');
            
            if (cleanPart.startsWith('.')) {
                const className = cleanPart.substring(1);
                return this.usedClasses.has(className);
            } else if (cleanPart.startsWith('#')) {
                const idName = cleanPart.substring(1);
                return this.usedIds.has(idName);
            } else {
                // Keep element selectors
                return /^[a-zA-Z][a-zA-Z0-9]*$/.test(cleanPart);
            }
        });
    }

    // Minify CSS (basic implementation)
    minifyCSS(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around certain characters
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*,\s*/g, ',')
            // Remove trailing semicolons
            .replace(/;}/g, '}')
            .trim();
    }

    // Generate critical CSS for above-the-fold content
    generateCriticalCSS() {
        const criticalSelectors = [
            // Layout
            'html', 'body', '*', '::before', '::after',
            // Header and navigation
            '.header', '.logo', '.nav', '.nav-link', '.mobile-nav-toggle', '.hamburger',
            // Hero section
            '.hero', '.hero-content', '.hero-title', '.hero-subtitle', '.hero-cta',
            // Buttons
            '.btn', '.btn-primary', '.btn-secondary',
            // Utilities
            '.container', '.sr-only'
        ];

        const lines = this.cssContent.split('\n');
        const criticalLines = [];
        let inRule = false;
        let currentRule = '';
        let keepRule = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('{') && !inRule) {
                inRule = true;
                currentRule = trimmedLine.split('{')[0].trim();
                keepRule = criticalSelectors.some(selector => 
                    currentRule.includes(selector) || 
                    currentRule.startsWith(':root') ||
                    currentRule.startsWith('@media')
                );
                
                if (keepRule) {
                    criticalLines.push(line);
                }
            } else if (trimmedLine === '}' && inRule) {
                inRule = false;
                if (keepRule) {
                    criticalLines.push(line);
                }
                currentRule = '';
                keepRule = false;
            } else if (inRule && keepRule) {
                criticalLines.push(line);
            } else if (!inRule && (trimmedLine.startsWith('/*') || trimmedLine.startsWith('@') || trimmedLine === '')) {
                criticalLines.push(line);
            }
        });

        return criticalLines.join('\n');
    }

    // Main optimization process
    optimize() {
        console.log('🚀 Starting CSS optimization...');
        
        // Scan HTML files
        console.log('📄 Scanning HTML files...');
        this.scanHTMLFiles();
        console.log(`Found ${this.usedClasses.size} used classes and ${this.usedIds.size} used IDs`);
        
        // Load CSS
        console.log('📦 Loading CSS...');
        this.loadCSS('css/style.css');
        
        // Generate optimized CSS
        console.log('✂️ Removing unused CSS...');
        const optimizedCSS = this.removeUnusedCSS();
        
        // Generate critical CSS
        console.log('⚡ Generating critical CSS...');
        const criticalCSS = this.generateCriticalCSS();
        
        // Minify CSS
        console.log('🗜️ Minifying CSS...');
        const minifiedCSS = this.minifyCSS(optimizedCSS);
        const minifiedCriticalCSS = this.minifyCSS(criticalCSS);
        
        // Write optimized files
        fs.writeFileSync('css/optimized-bundle.css', minifiedCSS);
        fs.writeFileSync('css/critical-optimized.css', minifiedCriticalCSS);
        
        console.log('✅ Optimization complete!');
        console.log(`📊 Original size: ${this.cssContent.length} bytes`);
        console.log(`📊 Optimized size: ${minifiedCSS.length} bytes`);
        console.log(`📊 Critical size: ${minifiedCriticalCSS.length} bytes`);
        console.log(`📊 Savings: ${((this.cssContent.length - minifiedCSS.length) / this.cssContent.length * 100).toFixed(1)}%`);
    }
}

// Performance analysis
class PerformanceAnalyzer {
    static analyzeCSS(cssFile) {
        const content = fs.readFileSync(cssFile, 'utf8');
        const rules = content.match(/[^{}]+{[^{}]*}/g) || [];
        const selectors = content.match(/[^{}]+(?={)/g) || [];
        
        console.log('\n📈 CSS Performance Analysis:');
        console.log(`Total rules: ${rules.length}`);
        console.log(`Total selectors: ${selectors.length}`);
        console.log(`File size: ${content.length} bytes`);
        console.log(`Estimated gzip size: ~${Math.round(content.length * 0.3)} bytes`);
        
        // Analyze selector complexity
        const complexSelectors = selectors.filter(sel => 
            (sel.match(/\s/g) || []).length > 3
        );
        
        if (complexSelectors.length > 0) {
            console.log(`⚠️ Complex selectors found: ${complexSelectors.length}`);
        }
        
        return {
            rules: rules.length,
            selectors: selectors.length,
            size: content.length,
            complexSelectors: complexSelectors.length
        };
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'optimize':
            const optimizer = new CSSOptimizer();
            optimizer.optimize();
            break;
            
        case 'analyze':
            const cssFile = args[1] || 'css/style.css';
            PerformanceAnalyzer.analyzeCSS(cssFile);
            break;
            
        default:
            console.log('Usage:');
            console.log('  node scripts/build-optimizer.js optimize  - Optimize CSS');
            console.log('  node scripts/build-optimizer.js analyze [file]  - Analyze CSS performance');
    }
}

module.exports = { CSSOptimizer, PerformanceAnalyzer };