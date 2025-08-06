document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('pal-grid');
    const searchBar = document.getElementById('search-bar');
    const filters = { type: null, rarity: null, searchTerm: '' };
    
    // Create live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Screen reader announcement function
    function announceToScreenReader(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }

    function getImagePath(heroName) {
        // Handle specific naming inconsistencies between data and filenames
        if (heroName === 'Lucidina') {
            return './images/Profile-Lucindina.png';
        }
        // Default case
        return `./images/Profile-${heroName}.png`;
    }

    function createPalCard(hero) {
        const tierClass = `tier-${hero['Tier'].charAt(0).toLowerCase()}`;
        const imagePath = getImagePath(hero['Hero Name']);
        const cardId = `pal-card-${hero['Hero Name'].toLowerCase().replace(/\s+/g, '-')}`;

        return `
            <article class="pal-card" 
                     id="${cardId}"
                     data-type="${hero.Type}" 
                     data-rarity="${hero.Rarity}"
                     tabindex="0"
                     role="article"
                     aria-labelledby="${cardId}-title"
                     aria-describedby="${cardId}-description">
                <div class="pal-card-image">
                    <img src="${imagePath}" 
                         alt="${hero['Hero Name']} - ${hero.Type} type ${hero.Rarity} rarity Palmon" 
                         loading="lazy">
                </div>
                <div class="pal-card-body">
                    <div class="card-header">
                        <h3 id="${cardId}-title">${hero['Hero Name']}</h3>
                        <span class="tier-badge ${tierClass}" 
                              aria-label="Tier ${hero.Tier}"
                              role="img">${hero.Tier}</span>
                    </div>
                    <div class="pal-info" role="list" aria-label="Palmon statistics">
                        <span role="listitem">Rarity: <strong class="rarity-${hero.Rarity.toLowerCase()}-text" aria-label="${hero.Rarity} rarity">${hero.Rarity}</strong></span>
                        <span role="listitem">Type: <strong class="type-${hero.Type.toLowerCase()}" aria-label="${hero.Type} type">${hero.Type}</strong></span>
                        <span role="listitem">Tier: <strong class="tier-${hero.Tier.toLowerCase()}">${hero.Tier}</strong></span>
                        <span role="listitem">Row: <strong>${hero.Row}</strong></span>
                    </div>
                    <div class="explanation">
                        <div class="quick-explanation">
                            <h4>Quick Overview</h4>
                            <p id="${cardId}-description">${hero['Quick Explanation']}</p>
                        </div>
                        <div class="detailed-explanation">
                            <h4>Detailed Analysis</h4>
                            <p>${hero['Detailed Explanation']}</p>
                        </div>
                    </div>
                    <div class="roles-jobs">
                        <p><strong>Role[s]:</strong> <span aria-label="Roles: ${hero['Role[s]']}">${hero['Role[s]']}</span></p>
                        <p><strong>Job Tag[s]:</strong> <span aria-label="Job tags: ${hero['Job Tag(s)']}">${hero['Job Tag(s)']}</span></p>
                    </div>
                    <div class="skills">
                        <h4>Skills</h4>
                        <ul role="list" aria-label="Palmon skills">
                            <li role="listitem"><strong>${hero['Skill 1 Name']}:</strong> ${hero['Skill 1 Description']}</li>
                            <li role="listitem"><strong>${hero['Skill 2 Name']} (Rage):</strong> ${hero['Skill 2 Description']}</li>
                            <li role="listitem"><strong>${hero['Skill 3 Name']} (Passive):</strong> ${hero['Skill 3 Description']}</li>
                        </ul>
                    </div>
                </div>
            </article>
        `;
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.pal-card');
        const searchTerm = filters.searchTerm.toLowerCase();
        const resultsCounter = document.getElementById('search-results-count');
        let visibleCount = 0;
        let animationDelay = 0;

        // First pass: hide cards that don't match with staggered animation
        cards.forEach((card, index) => {
            const typeMatch = !filters.type || card.dataset.type === filters.type;
            const rarityMatch = !filters.rarity || card.dataset.rarity === filters.rarity;
            const name = card.querySelector('h3').textContent.toLowerCase();
            const nameMatch = name.includes(searchTerm);

            if (typeMatch && rarityMatch && nameMatch) {
                // Card should be visible
                if (card.classList.contains('hidden')) {
                    // Animate in with stagger
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.4s ease-out forwards';
                    }, animationDelay);
                    animationDelay += 50;
                }
                visibleCount++;
            } else {
                // Card should be hidden
                if (!card.classList.contains('hidden')) {
                    card.style.animation = 'fadeOutDown 0.3s ease-in forwards';
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.style.animation = '';
                    }, 300);
                }
            }
        });

        // Update results counter with enhanced feedback and animation
        if (resultsCounter) {
            resultsCounter.style.transform = 'scale(0.8)';
            resultsCounter.style.opacity = '0.5';
            
            setTimeout(() => {
                let message, ariaLabel;
                if (visibleCount === 0) {
                    message = '🔍 No Palmon found - try different filters';
                    ariaLabel = 'No Palmon found. Try different filters to see results.';
                    resultsCounter.classList.add('no-results');
                } else if (visibleCount === cards.length) {
                    message = '✨ Showing all Palmon';
                    ariaLabel = `Showing all ${cards.length} Palmon`;
                    resultsCounter.classList.remove('no-results');
                } else {
                    message = `📊 Showing ${visibleCount} of ${cards.length} Palmon`;
                    ariaLabel = `Showing ${visibleCount} of ${cards.length} Palmon`;
                    resultsCounter.classList.remove('no-results');
                }
                
                resultsCounter.textContent = message;
                resultsCounter.setAttribute('aria-label', ariaLabel);
                resultsCounter.setAttribute('aria-live', 'polite');
                
                resultsCounter.style.transform = 'scale(1)';
                resultsCounter.style.opacity = '1';
                
                // Announce to screen readers
                announceToScreenReader(ariaLabel);
            }, 200);
        }
    }

    // Initial render
    const tierOrderMap = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'F': 5 };
    data.sort((a, b) => tierOrderMap[a.Tier] - tierOrderMap[b.Tier] || a['Hero Name'].localeCompare(b['Hero Name']));
    grid.innerHTML = data.map(createPalCard).join('');
    
    // Setup keyboard navigation for cards
    setupCardKeyboardNavigation();
    
    // Setup accessibility attributes
    setupAccessibilityAttributes();

    // Search logic with enhanced feedback
    let searchTimeout;
    searchBar.addEventListener('input', (e) => {
        const searchValue = e.target.value;
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Show loading state for searches longer than 2 characters
        if (searchValue.length > 2) {
            searchBar.classList.add('loading');
        }
        
        // Debounce search to improve performance
        searchTimeout = setTimeout(() => {
            filters.searchTerm = searchValue;
            applyFilters();
            searchBar.classList.remove('loading');
        }, searchValue.length > 2 ? 300 : 0);
    });

    // Enhanced Filter logic with improved visual feedback
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.id === 'reset-filters') {
            btn.addEventListener('click', () => {
                // Add loading state with enhanced visual feedback
                btn.classList.add('loading');
                btn.style.pointerEvents = 'none';
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    filters.type = null;
                    filters.rarity = null;
                    filters.searchTerm = '';
                    searchBar.value = '';
                    searchBar.classList.remove('loading');
                    
                    // Enhanced active state removal with stagger effect
                    const activeButtons = document.querySelectorAll('.filter-btn.active');
                    activeButtons.forEach((b, index) => {
                        setTimeout(() => {
                            b.classList.remove('active');
                        }, index * 50);
                    });
                    
                    applyFilters();
                    
                    // Show success feedback with enhanced animation
                    btn.classList.remove('loading');
                    btn.classList.add('btn-success-feedback');
                    btn.style.pointerEvents = '';
                    
                    setTimeout(() => {
                        btn.classList.remove('btn-success-feedback');
                        ripple.remove();
                    }, 800);
                }, 250);
            });
        } else {
            btn.addEventListener('click', (e) => {
                const filterType = btn.dataset.filterType;
                const filterValue = btn.dataset.filterValue;

                // Add enhanced loading state with ripple effect
                btn.classList.add('loading');
                btn.style.pointerEvents = 'none';
                
                // Create ripple effect
                const ripple = document.createElement('div');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${rect.width / 2 - size / 2}px;
                    top: ${rect.height / 2 - size / 2}px;
                `;
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    const wasActive = btn.classList.contains('active');
                    
                    // Toggle off if clicking the same active button
                    if (wasActive) {
                        btn.classList.remove('active');
                        filters[filterType] = null;
                    } else {
                        // Enhanced toggle animation for same group buttons
                        const sameGroupButtons = document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`);
                        sameGroupButtons.forEach(b => {
                            if (b !== btn && b.classList.contains('active')) {
                                b.style.transform = 'scale(0.95)';
                                setTimeout(() => {
                                    b.classList.remove('active');
                                    b.style.transform = '';
                                }, 100);
                            }
                        });
                        
                        btn.classList.add('active');
                        filters[filterType] = filterValue;
                    }
                    
                    applyFilters();
                    btn.classList.remove('loading');
                    btn.style.pointerEvents = '';
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }, 180);
            });
        }
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn-success-feedback {
            background: linear-gradient(135deg, #10b981, #059669) !important;
            transform: scale(1.05) !important;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4) !important;
        }
        
        .filter-btn {
            position: relative;
            overflow: hidden;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes fadeOutDown {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(-20px) scale(0.8);
            }
        }
        
        .search-results-count {
            transition: all 0.3s ease-out !important;
        }
        
        .pal-card:focus-visible {
            outline: 3px solid var(--color-secondary-500);
            outline-offset: 3px;
            transform: translateY(-2px);
            box-shadow: 
                var(--shadow-lg),
                0 0 0 5px rgba(233, 69, 96, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Setup keyboard navigation for cards
    function setupCardKeyboardNavigation() {
        const cards = document.querySelectorAll('.pal-card');
        
        cards.forEach((card, index) => {
            card.addEventListener('keydown', (e) => {
                const visibleCards = Array.from(document.querySelectorAll('.pal-card:not(.hidden)'));
                const currentIndex = visibleCards.indexOf(card);
                
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (currentIndex + 1) % visibleCards.length;
                        visibleCards[nextIndex]?.focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
                        visibleCards[prevIndex]?.focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        visibleCards[0]?.focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        visibleCards[visibleCards.length - 1]?.focus();
                        break;
                        
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        // Announce card details to screen reader
                        const heroName = card.querySelector('h3').textContent;
                        const tier = card.querySelector('.tier-badge').textContent;
                        const type = card.dataset.type;
                        const rarity = card.dataset.rarity;
                        const description = card.querySelector('.explanation p').textContent;
                        
                        announceToScreenReader(
                            `${heroName}, tier ${tier}, ${type} type, ${rarity} rarity. ${description}`
                        );
                        break;
                }
            });
        });
    }
    
    // Setup accessibility attributes
    function setupAccessibilityAttributes() {
        // Add proper labels to search input
        const searchInput = document.getElementById('search-bar');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Search Palmon by name');
            searchInput.setAttribute('aria-describedby', 'search-results-count');
        }
        
        // Add proper labels to filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.id === 'reset-filters') {
                btn.setAttribute('aria-label', 'Reset all filters');
            } else {
                const filterType = btn.dataset.filterType;
                const filterValue = btn.dataset.filterValue;
                btn.setAttribute('aria-label', `Filter by ${filterType}: ${filterValue}`);
                btn.setAttribute('aria-pressed', 'false');
            }
        });
        
        // Add proper labels to filter groups
        const filterGroups = document.querySelectorAll('.filter-group');
        filterGroups.forEach(group => {
            const label = group.querySelector('.filter-group-label');
            if (label) {
                const groupId = `filter-group-${label.textContent.toLowerCase().replace(':', '')}`;
                group.setAttribute('role', 'group');
                group.setAttribute('aria-labelledby', groupId);
                label.id = groupId;
            }
        });
        
        // Add proper labels to grid
        const palGrid = document.getElementById('pal-grid');
        if (palGrid) {
            palGrid.setAttribute('role', 'region');
            palGrid.setAttribute('aria-label', 'Palmon cards grid');
            palGrid.setAttribute('aria-describedby', 'search-results-count');
        }
    }
    
    // Update filter button states for screen readers
    function updateFilterButtonStates() {
        const filterButtons = document.querySelectorAll('.filter-btn:not(#reset-filters)');
        filterButtons.forEach(btn => {
            const isActive = btn.classList.contains('active');
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }
    
    // Enhanced search with accessibility
    searchBar.addEventListener('input', (e) => {
        const searchValue = e.target.value;
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Show loading state for searches longer than 2 characters
        if (searchValue.length > 2) {
            searchBar.classList.add('loading');
            searchBar.setAttribute('aria-busy', 'true');
        }
        
        // Debounce search to improve performance
        searchTimeout = setTimeout(() => {
            filters.searchTerm = searchValue;
            applyFilters();
            searchBar.classList.remove('loading');
            searchBar.setAttribute('aria-busy', 'false');
            
            // Re-setup keyboard navigation for visible cards
            setupCardKeyboardNavigation();
        }, searchValue.length > 2 ? 300 : 0);
    });
    
    // Enhanced filter logic with accessibility
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.id === 'reset-filters') {
            btn.addEventListener('click', () => {
                // Add loading state with enhanced visual feedback
                btn.classList.add('loading');
                btn.style.pointerEvents = 'none';
                btn.setAttribute('aria-busy', 'true');
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    filters.type = null;
                    filters.rarity = null;
                    filters.searchTerm = '';
                    searchBar.value = '';
                    searchBar.classList.remove('loading');
                    searchBar.setAttribute('aria-busy', 'false');
                    
                    // Enhanced active state removal with stagger effect
                    const activeButtons = document.querySelectorAll('.filter-btn.active');
                    activeButtons.forEach((b, index) => {
                        setTimeout(() => {
                            b.classList.remove('active');
                            b.setAttribute('aria-pressed', 'false');
                        }, index * 50);
                    });
                    
                    applyFilters();
                    setupCardKeyboardNavigation();
                    
                    // Show success feedback with enhanced animation
                    btn.classList.remove('loading');
                    btn.classList.add('btn-success-feedback');
                    btn.style.pointerEvents = '';
                    btn.setAttribute('aria-busy', 'false');
                    
                    announceToScreenReader('All filters have been reset');
                    
                    setTimeout(() => {
                        btn.classList.remove('btn-success-feedback');
                        ripple.remove();
                    }, 800);
                }, 250);
            });
        } else {
            btn.addEventListener('click', (e) => {
                const filterType = btn.dataset.filterType;
                const filterValue = btn.dataset.filterValue;

                // Add enhanced loading state with ripple effect
                btn.classList.add('loading');
                btn.style.pointerEvents = 'none';
                btn.setAttribute('aria-busy', 'true');
                
                // Create ripple effect
                const ripple = document.createElement('div');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${rect.width / 2 - size / 2}px;
                    top: ${rect.height / 2 - size / 2}px;
                `;
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    const wasActive = btn.classList.contains('active');
                    
                    // Toggle off if clicking the same active button
                    if (wasActive) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                        filters[filterType] = null;
                        announceToScreenReader(`${filterType} filter removed`);
                    } else {
                        // Enhanced toggle animation for same group buttons
                        const sameGroupButtons = document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`);
                        sameGroupButtons.forEach(b => {
                            if (b !== btn && b.classList.contains('active')) {
                                b.style.transform = 'scale(0.95)';
                                setTimeout(() => {
                                    b.classList.remove('active');
                                    b.setAttribute('aria-pressed', 'false');
                                    b.style.transform = '';
                                }, 100);
                            }
                        });
                        
                        btn.classList.add('active');
                        btn.setAttribute('aria-pressed', 'true');
                        filters[filterType] = filterValue;
                        announceToScreenReader(`Filtered by ${filterType}: ${filterValue}`);
                    }
                    
                    applyFilters();
                    setupCardKeyboardNavigation();
                    btn.classList.remove('loading');
                    btn.style.pointerEvents = '';
                    btn.setAttribute('aria-busy', 'false');
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }, 180);
            });
        }
    });
});