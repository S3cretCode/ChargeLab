/**
 * Project ChargeLab: Main JavaScript Module
 * Core functionality for theme switching, navigation, tooltips, and utilities
 * @version 1.0.0
 */

// ============================================
// Constants & Configuration
// ============================================
const CONFIG = {
    STORAGE_PREFIX: 'chargelab_',
    THEMES: ['dark', 'light', 'high-contrast'],
    TEXT_SIZES: ['normal', 'large'],
    MODES: ['chemistry', 'physics'],
    DEFAULT_THEME: 'dark',
    DEFAULT_MODE: 'chemistry'
};

// ============================================
// State Management
// ============================================
const AppState = {
    theme: CONFIG.DEFAULT_THEME,
    textSize: 'normal',
    mode: CONFIG.DEFAULT_MODE,
    settingsOpen: false,
    navOpen: false,

    /**
     * Initialize state from localStorage and URL params
     */
    init() {
        // Load from localStorage
        this.theme = this.load('theme') || CONFIG.DEFAULT_THEME;
        this.textSize = this.load('text_size') || 'normal';
        this.mode = this.load('mode') || CONFIG.DEFAULT_MODE;

        // Override with URL params if present
        const params = new URLSearchParams(window.location.search);
        if (params.has('mode') && CONFIG.MODES.includes(params.get('mode'))) {
            this.mode = params.get('mode');
        }
        if (params.has('theme') && CONFIG.THEMES.includes(params.get('theme'))) {
            this.theme = params.get('theme');
        }

        // Apply state
        this.applyTheme();
        this.applyTextSize();
        this.applyMode();
    },

    /**
     * Save value to localStorage with prefix
     */
    save(key, value) {
        try {
            localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    },

    /**
     * Load value from localStorage with prefix
     */
    load(key) {
        try {
            const value = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    },

    /**
     * Apply current theme to document
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.save('theme', this.theme);
        this.updateThemeButtons();
    },

    /**
     * Apply text size to document
     */
    applyTextSize() {
        document.documentElement.setAttribute('data-text-size', this.textSize);
        this.save('text_size', this.textSize);
        this.updateTextSizeToggles();
    },

    /**
     * Apply current mode and update URL
     */
    applyMode() {
        document.documentElement.setAttribute('data-mode', this.mode);
        this.save('mode', this.mode);
        this.updateModeButtons();
        this.updateURL();
    },

    /**
     * Update URL with current state (without reload)
     */
    updateURL() {
        const params = new URLSearchParams(window.location.search);
        params.set('mode', this.mode);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newURL);
    },

    /**
     * Update theme toggle button states
     */
    updateThemeButtons() {
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            const theme = btn.getAttribute('data-theme-toggle');
            btn.classList.toggle('active', theme === this.theme);
            btn.setAttribute('aria-pressed', theme === this.theme);
        });
    },

    /**
     * Update text size toggle states
     */
    updateTextSizeToggles() {
        document.querySelectorAll('[data-text-size-toggle]').forEach(el => {
            el.checked = this.textSize === 'large';
        });
    },

    /**
     * Update mode toggle button states
     */
    updateModeButtons() {
        document.querySelectorAll('.mode-toggle__btn').forEach(btn => {
            const mode = btn.getAttribute('data-mode');
            btn.classList.toggle('mode-toggle__btn--active', mode === this.mode);
            btn.setAttribute('aria-pressed', mode === this.mode);
        });
    },

    /**
     * Set theme
     */
    setTheme(theme) {
        if (CONFIG.THEMES.includes(theme)) {
            this.theme = theme;
            this.applyTheme();
        }
    },

    /**
     * Set text size
     */
    setTextSize(size) {
        if (CONFIG.TEXT_SIZES.includes(size)) {
            this.textSize = size;
            this.applyTextSize();
        }
    },

    /**
     * Toggle text size
     */
    toggleTextSize() {
        this.setTextSize(this.textSize === 'normal' ? 'large' : 'normal');
    },

    /**
     * Set mode
     */
    setMode(mode) {
        if (CONFIG.MODES.includes(mode)) {
            this.mode = mode;
            this.applyMode();
        }
    }
};

// ============================================
// Navigation
// ============================================
const Navigation = {
    init() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navList = document.querySelector('.nav__list');

        if (this.navToggle && this.navList) {
            this.navToggle.addEventListener('click', () => this.toggle());

            // Close nav when clicking a link
            this.navList.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close nav on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && AppState.navOpen) {
                    this.close();
                }
            });
        }

        // Mark current page link as active
        this.markActiveLink();
    },

    toggle() {
        AppState.navOpen = !AppState.navOpen;
        this.navToggle.classList.toggle('active', AppState.navOpen);
        this.navList.classList.toggle('active', AppState.navOpen);
        this.navToggle.setAttribute('aria-expanded', AppState.navOpen);
    },

    close() {
        AppState.navOpen = false;
        this.navToggle?.classList.remove('active');
        this.navList?.classList.remove('active');
        this.navToggle?.setAttribute('aria-expanded', 'false');
    },

    markActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav__link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('nav__link--active');
            }
        });
    }
};

// ============================================
// Settings Panel
// ============================================
const SettingsPanel = {
    init() {
        this.panel = document.querySelector('.settings-panel');
        this.trigger = document.querySelector('[data-settings-trigger]');
        this.closeBtn = document.querySelector('[data-settings-close]');

        if (this.trigger) {
            this.trigger.addEventListener('click', () => this.toggle());
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.settingsOpen) {
                this.close();
            }
        });

        // Theme toggles
        document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
            btn.addEventListener('click', () => {
                AppState.setTheme(btn.getAttribute('data-theme-toggle'));
            });
        });

        // Text size toggle
        document.querySelectorAll('[data-text-size-toggle]').forEach(el => {
            el.addEventListener('change', () => {
                AppState.toggleTextSize();
            });
        });
    },

    toggle() {
        AppState.settingsOpen = !AppState.settingsOpen;
        this.panel?.classList.toggle('active', AppState.settingsOpen);
    },

    close() {
        AppState.settingsOpen = false;
        this.panel?.classList.remove('active');
    }
};

// ============================================
// Mode Toggle
// ============================================
const ModeToggle = {
    init() {
        document.querySelectorAll('.mode-toggle__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                AppState.setMode(mode);
            });
        });
    }
};

// ============================================
// Tooltips
// ============================================
const Tooltips = {
    init() {
        // Initialize tooltips with glossary links
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            this.createTooltip(el);
        });

        // Glossary term links
        document.querySelectorAll('[data-glossary-term]').forEach(el => {
            const term = el.getAttribute('data-glossary-term');
            el.setAttribute('href', `glossary.html#${term}`);
            el.classList.add('tooltip-trigger');
        });
    },

    createTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const glossaryTerm = element.getAttribute('data-glossary-term');

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = text;

        if (glossaryTerm) {
            const link = document.createElement('a');
            link.href = `glossary.html#${glossaryTerm}`;
            link.textContent = ' (see glossary)';
            link.style.fontSize = '0.85em';
            tooltip.appendChild(link);
        }

        element.appendChild(tooltip);
        element.setAttribute('aria-describedby', 'tooltip');
    }
};

// ============================================
// Show Work Panels
// ============================================
const ShowWorkPanels = {
    init() {
        document.querySelectorAll('.show-work__header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const isActive = content.classList.contains('active');

                content.classList.toggle('active');
                header.setAttribute('aria-expanded', !isActive);

                // Update toggle icon/text
                const toggle = header.querySelector('.show-work__toggle');
                if (toggle) {
                    toggle.textContent = isActive ? 'Show Work ▼' : 'Hide Work ▲';
                }
            });
        });
    }
};

// ============================================
// Tabs
// ============================================
const Tabs = {
    init() {
        document.querySelectorAll('.tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tabs__tab');
            const panels = tabContainer.querySelectorAll('.tabs__panel');

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Deactivate all
                    tabs.forEach(t => {
                        t.classList.remove('tabs__tab--active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    panels.forEach(p => p.classList.remove('tabs__panel--active'));

                    // Activate clicked
                    tab.classList.add('tabs__tab--active');
                    tab.setAttribute('aria-selected', 'true');
                    panels[index]?.classList.add('tabs__panel--active');
                });
            });
        });
    }
};

// ============================================
// Deep Linking
// ============================================
const DeepLinking = {
    /**
     * Generate shareable URL with current state
     */
    generateURL(params = {}) {
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.set(key, value);
            }
        });
        return url.toString();
    },

    /**
     * Parse URL parameters
     */
    parseParams() {
        return Object.fromEntries(new URLSearchParams(window.location.search));
    },

    /**
     * Copy URL to clipboard
     */
    async copyURL(params = {}) {
        const url = this.generateURL(params);
        try {
            await navigator.clipboard.writeText(url);
            this.showCopyNotification('Link copied to clipboard!');
            return true;
        } catch (e) {
            console.error('Failed to copy:', e);
            return false;
        }
    },

    /**
     * Show copy notification
     */
    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: var(--color-accent-cyan);
      color: var(--color-bg-primary);
      border-radius: var(--radius-md);
      font-weight: 500;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
};

// ============================================
// Export Utilities
// ============================================
const ExportUtils = {
    /**
     * Export data as JSON file download
     */
    exportJSON(data, filename = 'export.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    },

    /**
     * Trigger file download from blob
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Print current page or element
     */
    print(elementSelector = null) {
        if (elementSelector) {
            const element = document.querySelector(elementSelector);
            if (element) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Print</title>
            <link rel="stylesheet" href="styles/style.css">
            <style>
              body { background: white; color: black; padding: 20px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>${element.innerHTML}</body>
          </html>
        `);
                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.close();
                };
            }
        } else {
            window.print();
        }
    },

    /**
     * Generate PDF using jsPDF (if loaded)
     */
    async generatePDF(elementSelector, filename = 'report.pdf') {
        const element = document.querySelector(elementSelector);
        if (!element) return false;

        // Check if jsPDF is available
        if (typeof jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            console.warn('jsPDF not loaded. Using print fallback.');
            this.print(elementSelector);
            return false;
        }

        const { jsPDF } = window.jspdf || window;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Use html2canvas if available for better rendering
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const pageHeight = 277;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        } else {
            // Simple text-based PDF
            const text = element.innerText;
            const lines = doc.splitTextToSize(text, 180);
            doc.setFontSize(11);
            doc.text(lines, 15, 15);
        }

        doc.save(filename);
        return true;
    }
};

// ============================================
// Utility Functions
// ============================================
const Utils = {
    /**
     * Format number with specified decimal places and units
     */
    formatNumber(value, decimals = 4, unit = '') {
        if (typeof value !== 'number' || isNaN(value)) return '—';

        // Use scientific notation for very small or large numbers
        if (Math.abs(value) < 0.0001 || Math.abs(value) >= 1e6) {
            return value.toExponential(decimals) + (unit ? ' ' + unit : '');
        }

        return value.toFixed(decimals) + (unit ? ' ' + unit : '');
    },

    /**
     * Format number with significant figures
     */
    formatSigFigs(value, sigFigs = 4) {
        if (typeof value !== 'number' || isNaN(value)) return '—';
        return Number(value.toPrecision(sigFigs)).toString();
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait = 250) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Animate value change
     */
    animateValue(element, start, end, duration = 500, formatter = null) {
        const startTime = performance.now();
        const diff = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = start + diff * eased;

            element.textContent = formatter ? formatter(current) : current.toFixed(2);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }
};

// ============================================
// Hero Animation
// ============================================
const HeroAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    fieldLines: [],
    animationFrame: null,

    init() {
        this.canvas = document.querySelector('.hero-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.createFieldLines();
        this.animate();

        window.addEventListener('resize', Utils.debounce(() => this.resize(), 200));
    },

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    },

    createParticles() {
        this.particles = [];
        const count = Math.min(50, Math.floor(this.canvas.width / 30));

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    createFieldLines() {
        this.fieldLines = [];
        const lineCount = 8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < lineCount; i++) {
            const angle = (i / lineCount) * Math.PI * 2;
            this.fieldLines.push({
                startX: centerX + Math.cos(angle) * 50,
                startY: centerY + Math.sin(angle) * 50,
                angle: angle,
                length: 150,
                offset: Math.random() * 100
            });
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw field lines
        this.drawFieldLines();

        // Draw and update particles
        this.drawParticles();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    },

    drawParticles() {
        this.particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 209, 255, ${p.alpha})`;
            this.ctx.fill();
        });

        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(62, 241, 198, ${0.2 * (1 - dist / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    },

    drawFieldLines() {
        const time = Date.now() / 1000;

        this.fieldLines.forEach(line => {
            const progress = ((time * 30 + line.offset) % 100) / 100;

            this.ctx.beginPath();
            this.ctx.moveTo(line.startX, line.startY);

            const endX = line.startX + Math.cos(line.angle) * line.length;
            const endY = line.startY + Math.sin(line.angle) * line.length;

            // Draw dashed line with animation
            this.ctx.setLineDash([5, 10]);
            this.ctx.lineDashOffset = -progress * 15;
            this.ctx.lineTo(endX, endY);
            this.ctx.strokeStyle = 'rgba(0, 209, 255, 0.3)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw arrowhead
            const arrowLen = 8;
            const arrowAngle = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(endX, endY);
            this.ctx.lineTo(
                endX - arrowLen * Math.cos(line.angle - arrowAngle),
                endY - arrowLen * Math.sin(line.angle - arrowAngle)
            );
            this.ctx.moveTo(endX, endY);
            this.ctx.lineTo(
                endX - arrowLen * Math.cos(line.angle + arrowAngle),
                endY - arrowLen * Math.sin(line.angle + arrowAngle)
            );
            this.ctx.strokeStyle = 'rgba(62, 241, 198, 0.5)';
            this.ctx.stroke();
        });
    },

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
};

// ============================================
// Glossary Search
// ============================================
const GlossarySearch = {
    init() {
        const searchInput = document.querySelector('#glossary-search');
        const filterTabs = document.querySelectorAll('.glossary-filter__tab');
        const items = document.querySelectorAll('.glossary-item');

        if (!searchInput) return;

        searchInput.addEventListener('input', Utils.debounce(() => {
            this.filter(searchInput.value.toLowerCase(), null);
        }, 150));

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('glossary-filter__tab--active'));
                tab.classList.add('glossary-filter__tab--active');

                const category = tab.getAttribute('data-category');
                this.filter(searchInput.value.toLowerCase(), category);
            });
        });
    },

    filter(query, category) {
        const items = document.querySelectorAll('.glossary-item');

        items.forEach(item => {
            const term = item.querySelector('.glossary-term')?.textContent.toLowerCase() || '';
            const definition = item.querySelector('.glossary-definition')?.textContent.toLowerCase() || '';
            const itemCategory = item.getAttribute('data-category');

            const matchesQuery = !query || term.includes(query) || definition.includes(query);
            const matchesCategory = !category || category === 'all' || itemCategory === category;

            item.style.display = matchesQuery && matchesCategory ? 'block' : 'none';
        });
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core modules
    AppState.init();
    Navigation.init();
    SettingsPanel.init();
    ModeToggle.init();
    Tooltips.init();
    ShowWorkPanels.init();
    Tabs.init();
    GlossarySearch.init();
    HeroAnimation.init();

    // Add fade-in animation to page content
    document.body.classList.add('loaded');

    // Handle anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Export for use in other modules
window.ChargeLab = {
    AppState,
    DeepLinking,
    ExportUtils,
    Utils,
    CONFIG
};
