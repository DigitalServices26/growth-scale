/* ==========================================================================
   Pulse Digital — Landing Page
   Vanilla JavaScript (modular, well-commented)
   --------------------------------------------------------------------------
   Modules
   1. Sticky header shadow on scroll
   2. Mobile hamburger menu toggle
   3. Active nav link highlighting
   4. Reveal-on-scroll (IntersectionObserver)
   5. Contact form validation
   6. Auto-update footer year
   ========================================================================== */

(function () {
  "use strict";

  /* =================== 1. STICKY HEADER SHADOW ==================== */

  function initStickyHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("shadow-md", window.scrollY > 20);
      header.classList.toggle("border-slate-100", window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ================ 2. MOBILE HAMBURGER MENU ===================== */

  function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    const bars = toggle.querySelectorAll(".menu-bar");
    let open = false;

    const setMenu = (isOpen) => {
      open = isOpen;
      menu.classList.toggle("max-h-0", !isOpen);
      menu.classList.toggle("opacity-0", !isOpen);
      menu.classList.toggle("max-h-96", isOpen);
      menu.classList.toggle("opacity-100", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));

      // Animate bars into an X
      bars[0].classList.toggle("translate-y-2", isOpen);
      bars[0].classList.toggle("rotate-45", isOpen);
      bars[1].classList.toggle("opacity-0", isOpen);
      bars[2].classList.toggle("-translate-y-2", isOpen);
      bars[2].classList.toggle("-rotate-45", isOpen);
    };

    toggle.addEventListener("click", () => setMenu(!open));

    // Close when a mobile link is tapped
    menu.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* =============== 3. ACTIVE NAV LINK HIGHLIGHTING =============== */

  function initActiveNav() {
    const navLinks = document.querySelectorAll(".nav-link");
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
      .map((link) => {
        const id = link.getAttribute("href");
        return id && id.startsWith("#") ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    const setActive = () => {
      const pos = window.scrollY + 130;
      let current = null;

      sections.forEach((section) => {
        if (pos >= section.offsetTop) current = "#" + section.id;
      });

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === current;
        link.classList.toggle("text-royal", isActive);
        link.classList.toggle("font-semibold", isActive);
      });
    };

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
  }

  /* =============== 4. REVEAL-ON-SCROLL ANIMATIONS ================ */

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

  /* =============== 5. CONTACT FORM VALIDATION ==================== */

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");
    if (!form || !feedback) return;

    const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    const mark = (field, invalid) => {
      field.classList.toggle("border-red-500", invalid);
      field.classList.toggle("ring-red-100", invalid);
      if (invalid) field.setAttribute("aria-invalid", "true");
      else field.removeAttribute("aria-invalid");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.textContent = "";
      feedback.className = "mt-4 text-sm font-medium text-center min-h-[24px]";

      const { name, email, service, message } = form;
      let valid = true;

      if (!name.value.trim()) { mark(name, true); valid = false; } else mark(name, false);
      if (!isEmail(email.value.trim())) { mark(email, true); valid = false; } else mark(email, false);
      if (!service.value) { mark(service, true); valid = false; } else mark(service, false);
      if (!message.value.trim()) { mark(message, true); valid = false; } else mark(message, false);

      if (!valid) {
        feedback.textContent = "Please fill in all required fields correctly.";
        feedback.classList.add("text-red-600");
        return;
      }

      feedback.textContent = "Thank you! Your message has been sent. We'll be in touch within one business day.";
      feedback.classList.add("text-green-600");
      form.reset();
    });
  }

  /* =============== 6. AUTO-UPDATE FOOTER YEAR ==================== */

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ========================== INIT ALL =========================== */

  function init() {
    initStickyHeader();
    initMobileMenu();
    initActiveNav();
    initRevealOnScroll();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
