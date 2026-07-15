/* ==========================================================================
   Pulse Digital — Digital Marketing Agency
   Vanilla JavaScript
   --------------------------------------------------------------------------
   Modules
   1. Sticky header on scroll
   2. Mobile navigation toggle
   3. Smooth scroll & active nav highlighting
   4. Reveal-on-scroll (IntersectionObserver)
   5. Animated counters
   6. FAQ accordion (native details enhancement)
   7. Contact form validation
   8. Back-to-top button
   9. Auto-update footer year
   ========================================================================== */

(function () {
  "use strict";

  /* =================== 1. STICKY HEADER ON SCROLL =================== */

  function initStickyHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ================== 2. MOBILE NAVIGATION TOGGLE =================== */

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.classList.toggle("nav-toggle--open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("open"));
    });

    // Close menu when a nav link is tapped
    nav.addEventListener("click", (e) => {
      if (e.target.matches(".nav__link")) {
        setOpen(false);
      }
    });

    // Close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setOpen(false);
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains("open")) {
        setOpen(false);
      }
    });
  }

  /* ============ 3. SMOOTH SCROLL & ACTIVE NAV HIGHLIGHTING =========== */

  function initActiveNav() {
    const navLinks = document.querySelectorAll(".nav__link");
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
      .map((link) => {
        const id = link.getAttribute("href");
        return id && id.startsWith("#") ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    const setActive = () => {
      const scrollPos = window.scrollY + 120;
      let currentId = null;

      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentId = "#" + section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === currentId);
      });
    };

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
  }

  /* ================== 4. REVEAL-ON-SCROLL ANIMATIONS ================= */

  function initRevealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ===================== 5. ANIMATED COUNTERS ====================== */

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo for a premium feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll(".stat__number");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || "");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* =================== 6. FAQ ACCORDION ENHANCEMENT ================= */

  function initFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    // Allow only one open at a time for a cleaner accordion feel
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  }

  /* ================== 7. CONTACT FORM VALIDATION =================== */

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");
    if (!form || !feedback) return;

    const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const markInvalid = (field, invalid) => {
      field.classList.toggle("invalid", invalid);
      if (invalid) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.textContent = "";
      feedback.className = "form-feedback";

      const name = form.name;
      const email = form.email;
      const service = form.service;
      const message = form.message;

      let valid = true;

      if (!name.value.trim()) {
        markInvalid(name, true);
        valid = false;
      } else markInvalid(name, false);

      if (!isEmail(email.value.trim())) {
        markInvalid(email, true);
        valid = false;
      } else markInvalid(email, false);

      if (!service.value) {
        markInvalid(service, true);
        valid = false;
      } else markInvalid(service, false);

      if (!message.value.trim()) {
        markInvalid(message, true);
        valid = false;
      } else markInvalid(message, false);

      if (!valid) {
        feedback.textContent = "Please fill in all required fields correctly.";
        feedback.classList.add("error");
        return;
      }

      // Simulated success (no backend wired yet)
      feedback.textContent = "Thank you! Your message has been sent. We'll be in touch within one business day.";
      feedback.classList.add("success");
      form.reset();
    });
  }

  /* ==================== 8. BACK TO TOP BUTTON ===================== */

  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle("show", window.scrollY > 600);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ================ 9. AUTO-UPDATE FOOTER YEAR ==================== */

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* =========================== INIT ALL =========================== */

  function init() {
    initStickyHeader();
    initMobileNav();
    initActiveNav();
    initRevealOnScroll();
    initCounters();
    initFaqAccordion();
    initContactForm();
    initBackToTop();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
