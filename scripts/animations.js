/**
 * Enhanced Animation System for Palmon World
 * Handles micro-interactions, state changes, and performance optimization
 */

class AnimationSystem {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupRippleEffects();
    this.setupButtonFeedback();
    this.setupCardInteractions();
    this.setupNavigationAnimations();
    this.setupFormAnimations();
    this.setupLoadingStates();
    this.setupStaggeredAnimations();
    this.optimizePerformance();
  }

  /**
   * Setup Intersection Observer for scroll-triggered animations
   */
  setupIntersectionObserver() {
    if (this.reducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Add stagger delay for multiple items
          const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 100}ms`;
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards and other animated elements
    document.querySelectorAll('.card, .pal-card, .feature-card, .team-card').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Setup ripple effects for interactive elements
   */
  setupRippleEffects() {
    if (this.reducedMotion) return;

    document.addEventListener('click', (e) => {
      const rippleElement = e.target.closest('.ripple-effect, .btn, .interactive-element');
      if (!rippleElement) return;

      this.createRipple(rippleElement, e);
    });
  }

  createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  /**
   * Setup enhanced button feedback
   */
  setupButtonFeedback() {
    document.querySelectorAll('.btn, button').forEach(button => {
      button.classList.add('btn-feedback');
      
      // Add loading state functionality
      button.addEventListener('click', (e) => {
        if (button.dataset.loading === 'true') return;
        
        // Add pressed state
        button.classList.add('active-scale');
        setTimeout(() => button.classList.remove('active-scale'), 150);
      });
    });
  }

  /**
   * Setup card interaction animations
   */
  setupCardInteractions() {
    document.querySelectorAll('.card, .pal-card, .feature-card, .team-card').forEach(card => {
      card.classList.add('card-interactive-enhanced');
      
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', () => {
        if (this.reducedMotion) return;
        card.style.willChange = 'transform, box-shadow';
      });

      card.addEventListener('mouseleave', () => {
        card.style.willChange = 'auto';
      });

      // Add click feedback
      card.addEventListener('click', (e) => {
        if (this.reducedMotion) return;
        card.style.transform = 'translateY(-2px) scale(1.01)';
        setTimeout(() => {
          card.style.transform = '';
        }, 100);
      });

      // Add keyboard navigation support for feature cards
      if (card.classList.contains('feature-card')) {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Trigger the onclick handler if it exists
            if (card.onclick) {
              card.onclick();
            } else {
              // Fallback: find and click the first link
              const link = card.querySelector('a');
              if (link) {
                link.click();
              }
            }
          }
        });
      }
    });
  }

  /**
   * Setup navigation animations
   */
  setupNavigationAnimations() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.add('nav-item-enhanced');
    });

    // Mobile navigation animations
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburger = document.querySelector('.hamburger');

    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        
        if (isOpen) {
          this.closeMobileNav(mobileNav, hamburger);
        } else {
          this.openMobileNav(mobileNav, hamburger);
        }
      });
    }
  }

  openMobileNav(nav, hamburger) {
    nav.classList.add('open');
    hamburger?.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    
    // Animate nav links with stagger
    const links = nav.querySelectorAll('.nav-link');
    links.forEach((link, index) => {
      link.style.setProperty('--index', index);
    });
  }

  closeMobileNav(nav, hamburger) {
    nav.classList.remove('open');
    hamburger?.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
  }

  /**
   * Setup form input animations
   */
  setupFormAnimations() {
    document.querySelectorAll('input, textarea, select').forEach(input => {
      input.classList.add('input-enhanced');
      
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('focused');
        if (!input.value) {
          input.parentElement?.classList.remove('filled');
        } else {
          input.parentElement?.classList.add('filled');
        }
      });

      // Error state animation
      input.addEventListener('invalid', () => {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 300);
      });
    });
  }

  /**
   * Setup loading states
   */
  setupLoadingStates() {
    // Button loading states
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-loading]');
      if (!button) return;

      this.setLoadingState(button, true);
      
      // Simulate async operation (replace with actual logic)
      setTimeout(() => {
        this.setLoadingState(button, false);
        this.showFeedback(button, 'success');
      }, 2000);
    });
  }

  setLoadingState(element, loading) {
    if (loading) {
      element.classList.add('loading');
      element.disabled = true;
      element.dataset.originalText = element.textContent;
      element.innerHTML = '<span class="loading-dots-enhanced"><span></span><span></span><span></span></span>';
    } else {
      element.classList.remove('loading');
      element.disabled = false;
      element.textContent = element.dataset.originalText;
    }
  }

  showFeedback(element, type) {
    element.classList.add(type);
    setTimeout(() => element.classList.remove(type), 1000);
  }

  /**
   * Setup staggered animations for lists and grids
   */
  setupStaggeredAnimations() {
    if (this.reducedMotion) return;

    document.querySelectorAll('.pal-grid, .features, .team-grid').forEach(container => {
      container.classList.add('stagger-container');
      
      const items = container.children;
      Array.from(items).forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.animationDelay = `${index * 100}ms`;
      });
    });
  }

  /**
   * Performance optimizations
   */
  optimizePerformance() {
    // Add GPU acceleration to animated elements
    document.querySelectorAll('.card, .pal-card, .btn, .nav-link').forEach(el => {
      el.classList.add('gpu-accelerated');
    });

    // Optimize will-change property
    const animatedElements = document.querySelectorAll('[class*="hover"], [class*="transition"]');
    
    animatedElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.willChange = 'transform, opacity, box-shadow';
      });

      el.addEventListener('mouseleave', () => {
        el.style.willChange = 'auto';
      });
    });

    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
        scrollTimeout = null;
      }, 16); // ~60fps
    });
  }

  handleScroll() {
    const scrolled = window.scrollY > 50;
    const header = document.querySelector('.header');
    
    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
  }

  /**
   * Utility methods for external use
   */
  animateElement(element, animation, duration = 300) {
    if (this.reducedMotion) return Promise.resolve();

    return new Promise(resolve => {
      element.style.animation = `${animation} ${duration}ms ease-out`;
      element.addEventListener('animationend', () => {
        element.style.animation = '';
        resolve();
      }, { once: true });
    });
  }

  fadeIn(element, duration = 300) {
    if (this.reducedMotion) {
      element.style.opacity = '1';
      return Promise.resolve();
    }

    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease-out`;
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }

  fadeOut(element, duration = 300) {
    if (this.reducedMotion) {
      element.style.opacity = '0';
      return Promise.resolve();
    }

    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease-out`;
      element.style.opacity = '0';
      setTimeout(resolve, duration);
    });
  }

  slideIn(element, direction = 'up', duration = 300) {
    if (this.reducedMotion) return Promise.resolve();

    const transforms = {
      up: 'translateY(20px)',
      down: 'translateY(-20px)',
      left: 'translateX(20px)',
      right: 'translateX(-20px)'
    };

    return new Promise(resolve => {
      element.style.transform = transforms[direction];
      element.style.opacity = '0';
      element.style.transition = `all ${duration}ms ease-out`;
      
      requestAnimationFrame(() => {
        element.style.transform = 'translate(0)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      });
    });
  }

  /**
   * Initialize tooltips with animations
   */
  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-enhanced';
      tooltip.textContent = element.dataset.tooltip;
      document.body.appendChild(tooltip);

      element.addEventListener('mouseenter', (e) => {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.classList.add('show');
      });

      element.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
      });
    });
  }

  /**
   * Initialize modals with animations
   */
  initModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        
        if (modal) {
          this.openModal(modal);
        }
      });
    });

    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closer => {
      closer.addEventListener('click', (e) => {
        const modal = closer.closest('.modal-enhanced');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });
  }

  openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple-animation {
  to {
    transform: scale(2);
    opacity: 0;
  }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize animation system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.animationSystem = new AnimationSystem();
  });
} else {
  window.animationSystem = new AnimationSystem();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationSystem;
}