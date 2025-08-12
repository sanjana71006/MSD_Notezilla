// Theme management system
class ThemeManager {
    constructor() {
        this.theme = this.loadTheme();
        this.applyTheme(this.theme);
        this.initializeToggle();
    }

    // Load theme from localStorage or system preference
    loadTheme() {
        const saved = localStorage.getItem('notezilla_theme');
        if (saved) {
            return saved;
        }
        
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Save theme to localStorage
    saveTheme(theme) {
        localStorage.setItem('notezilla_theme', theme);
        this.theme = theme;
    }

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleIcon(theme);
    }

    // Update toggle button icon
    updateToggleIcon(theme) {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        const sunIcon = toggle.querySelector('.sun-icon');
        const moonIcon = toggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Toggle theme
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme(newTheme);
        this.applyTheme(newTheme);
        
        // Add transition class for smooth animation
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    // Initialize toggle button
    initializeToggle() {
        document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.getElementById('themeToggle');
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleTheme());
            }
        });
    }

    // Get current theme
    getCurrentTheme() {
        return this.theme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Global theme functions
window.toggleTheme = () => themeManager.toggleTheme();
window.getCurrentTheme = () => themeManager.getCurrentTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('notezilla_theme')) {
        themeManager.applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Add CSS for smooth theme transitions
const style = document.createElement('style');
style.textContent = `
    body.theme-transitioning,
    body.theme-transitioning * {
        transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease !important;
    }
`;
document.head.appendChild(style);