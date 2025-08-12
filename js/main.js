// Theme management
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Theme icons
const themeIcons = {
  light: '☀️',
  dark: '🌙',
  auto: '🌗'
};

// Get theme from localStorage or default to auto
function getTheme() {
  const saved = localStorage.getItem('theme');
  if (saved && ['light', 'dark', 'auto'].includes(saved)) {
    return saved;
  }
  return 'auto';
}

// Apply theme to document
function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'auto') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
  
  // Update button icon and aria-label
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = themeIcons[theme];
    }
    
    const currentTheme = theme === 'auto' 
      ? (prefersDark.matches ? 'dark' : 'light') 
      : theme;
    themeToggle.setAttribute('aria-label', `Current theme: ${theme}. Click to cycle themes.`);
  }
}

// Cycle through themes
function cycleTheme() {
  const currentTheme = getTheme();
  const themes = ['light', 'dark', 'auto'];
  const currentIndex = themes.indexOf(currentTheme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
}

// Initialize theme (before DOM paint to prevent flash)
applyTheme(getTheme());

// Listen for theme toggle clicks
if (themeToggle) {
  themeToggle.addEventListener('click', cycleTheme);
}

// Listen for system theme changes
prefersDark.addEventListener('change', () => {
  if (getTheme() === 'auto') {
    applyTheme('auto');
  }
});

// Language switching (existing code preserved)
document.querySelectorAll(".lang-switch .lang").forEach((a) => {
  a.addEventListener("click", () => {
    const code = (a.dataset.lang || "").toLowerCase();
    if (code) localStorage.setItem("lang", code);
  });
});

(function () {
  const htmlLang = (document.documentElement.lang || "sk")
    .slice(0, 2)
    .toLowerCase();
  const current = htmlLang === "cz" ? "cs" : htmlLang;
  document.querySelectorAll(".lang-switch .lang").forEach((a) => {
    const code = (a.dataset.lang || "").toLowerCase();
    if (code === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    }
  });
})();

// Scroll animations (with reduced motion support)
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  // Animate sections on scroll
  document.querySelectorAll('.section, .exp-item, .card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Initialize animations after DOM load
document.addEventListener('DOMContentLoaded', initScrollAnimations);
