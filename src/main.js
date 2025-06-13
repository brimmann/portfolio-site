import "./style.css";

// Theme toggle functionality
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    this.updateToggleIcon();
  }

  applyTheme() {
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", this.theme);
  }

  toggle() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.applyTheme();
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");

    if (this.theme === "dark") {
      sunIcon?.classList.add("hidden");
      moonIcon?.classList.remove("hidden");
    } else {
      sunIcon?.classList.remove("hidden");
      moonIcon?.classList.add("hidden");
    }
  }

  setupToggle() {
    const toggleButton = document.getElementById("theme-toggle");
    toggleButton?.addEventListener("click", () => this.toggle());
  }
}

// Animation on scroll
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.observeElements();
    this.setupParallax();
  }

  observeElements() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe fade-in elements
    document.querySelectorAll(".fade-in-up").forEach((el) => {
      observer.observe(el);
    });

    // Observe cards
    document
      .querySelectorAll(".writing-card, .experience-card, .opensource-card")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  setupParallax() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".geometric-bg");

      parallaxElements.forEach((el) => {
        const rate = scrolled * -0.5;
        el.style.transform = `translateY(${rate}px)`;
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
  }
}

// Smooth scroll for anchor links
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

// Cursor effect for interactive elements
class CursorEffect {
  constructor() {
    this.init();
  }

  init() {
    if (window.innerWidth > 768) {
      // Only on desktop
      this.createCursor();
      this.setupEvents();
    }
  }

  createCursor() {
    this.cursor = document.createElement("div");
    this.cursor.className = "custom-cursor";
    this.cursor.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-outline"></div>
    `;
    document.body.appendChild(this.cursor);
  }

  setupEvents() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      if (this.cursor) {
        this.cursor.style.left = cursorX + "px";
        this.cursor.style.top = cursorY + "px";
      }

      requestAnimationFrame(updateCursor);
    };

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Hover effects
    const hoverElements = document.querySelectorAll(
      "a, button, .writing-card, .experience-card, .opensource-card"
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursor?.classList.add("hover");
      });

      el.addEventListener("mouseleave", () => {
        this.cursor?.classList.remove("hover");
      });
    });

    updateCursor();
  }
}

// Card tilt effect
class CardTiltEffect {
  constructor() {
    this.init();
  }

  init() {
    const cards = document.querySelectorAll(".writing-card, .opensource-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", this.handleMouseMove.bind(this));
      card.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    });
  }

  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  }

  handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }
}

// Progressive loading for better performance
class ProgressiveLoader {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images if intersection observer is supported
    if ("IntersectionObserver" in window) {
      this.lazyLoadImages();
    }
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new ScrollAnimations();
  new SmoothScroll();
  new CursorEffect();
  new CardTiltEffect();
  new ProgressiveLoader();

  // Add loading complete class for any additional animations
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Restart any paused animations
    document
      .querySelectorAll(".animate-float, .animate-float-delayed")
      .forEach((el) => {
        el.style.animationPlayState = "running";
      });
  }
});

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.setProperty("--animation-duration", "0.01ms");
}
