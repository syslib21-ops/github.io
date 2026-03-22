(function () {
  "use strict";

  var THEME_KEY = "intro-page-theme";
  var SECTION_IDS = [
    "motivation",
    "personality",
    "motto",
    "experience",
    "future",
  ];

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = theme === "light" ? "☾" : "☀";
      btn.setAttribute(
        "aria-label",
        theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
      );
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    applyTheme(theme);

    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme");
        var next = current === "light" ? "dark" : "light";
        setStoredTheme(next);
        applyTheme(next);
      });
    }
  }

  function initMobileNav() {
    var navToggle = document.getElementById("navToggle");
    var nav = document.getElementById("sideNav");
    if (!navToggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    navToggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1023px)").matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    });
  }

  function initScrollSpy() {
    var navLinks = document.querySelectorAll(".side-nav .nav-link[data-section]");
    if (!navLinks.length) return;

    function getActiveId() {
      var offset = Math.min(200, window.innerHeight * 0.22);
      var y = window.scrollY + offset;
      var active = SECTION_IDS[0];
      for (var i = 0; i < SECTION_IDS.length; i++) {
        var el = document.getElementById(SECTION_IDS[i]);
        if (!el) continue;
        if (el.offsetTop <= y) {
          active = SECTION_IDS[i];
        }
      }
      var doc = document.documentElement;
      var nearBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      if (nearBottom) {
        active = SECTION_IDS[SECTION_IDS.length - 1];
      }
      return active;
    }

    function update() {
      var activeId = getActiveId();
      navLinks.forEach(function (link) {
        var id = link.getAttribute("data-section");
        link.classList.toggle("is-active", id === activeId);
      });
    }

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  function initReveal() {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll(".reveal");
    if (reduced) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.02 }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initToTop() {
    var btn = document.getElementById("toTop");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function boot() {
    initTheme();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
