/* ===================================================================
   app.js — Portfolio Jim Turpin ODJO
   Étape 6 : JavaScript — interactions
   - Menu mobile (ouverture/fermeture, clavier, clic extérieur)
   - Validation du formulaire de contact (front uniquement)
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------------------------------------------
     0. Thème clair / sombre
  ----------------------------------------------------------------- */
  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon = themeToggle ? themeToggle.querySelector(".theme-toggle__icon") : null;
  var themeLabel = themeToggle ? themeToggle.querySelector(".sr-only") : null;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      var isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
      if (themeLabel) themeLabel.textContent = isDark ? "Activer le thème clair" : "Activer le thème sombre";
    }
  }

  var savedTheme = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  /* -----------------------------------------------------------------
     0bis. Bouton "revenir en haut"
  ----------------------------------------------------------------- */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.hidden = false; // le JS gère désormais la visibilité via une classe

    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    });

    backToTop.addEventListener("click", function () {
      var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------------
     1. Menu mobile
  ----------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("nav-mobile");

  function openMobileNav() {
    mobileNav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("is-open");
  }

  function closeMobileNav() {
    mobileNav.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("is-open");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      if (mobileNav.hidden) {
        openMobileNav();
      } else {
        closeMobileNav();
      }
    });

    // Ferme le menu quand on clique un lien (ancre) à l'intérieur
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    // Ferme avec la touche Échap et rend le focus au bouton
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileNav.hidden) {
        closeMobileNav();
        toggle.focus();
      }
    });

    // Ferme si on clique en dehors du menu ouvert
    document.addEventListener("click", function (e) {
      if (mobileNav.hidden) return;
      var clickInsideMenu = mobileNav.contains(e.target);
      var clickOnToggle = toggle.contains(e.target);
      if (!clickInsideMenu && !clickOnToggle) {
        closeMobileNav();
      }
    });
  }

  /* -----------------------------------------------------------------
     2. Formulaire de contact — validation front + confirmation
  ----------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");
  var backHome = document.getElementById("back-home");

  var messages = {
    required: "Ce champ est obligatoire.",
    email: "Adresse email invalide (ex. nom@domaine.com).",
    subject: "Merci de choisir un motif dans la liste."
  };

  function validateField(field) {
    var error = document.getElementById(field.id + "-error");
    var value = field.value.trim();
    var message = "";

    if (!value) {
      message = field.tagName === "SELECT" ? messages.subject : messages.required;
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = messages.email;
    }

    error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  if (form) {
    var fields = ["full-name", "email", "subject", "message"]
      .map(function (id) { return document.getElementById(id); });

    // Valide un champ dès que l'utilisateur le quitte
    fields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      // Efface l'erreur dès qu'il corrige, sans attendre un nouveau blur
      field.addEventListener("input", function () {
        var error = document.getElementById(field.id + "-error");
        if (error.textContent) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var isValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) isValid = false;
      });

      if (!isValid) {
        // Amène le focus au premier champ en erreur (accessibilité)
        var firstInvalid = fields.find(function (f) {
          return f.getAttribute("aria-invalid") === "true";
        });
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    if (backHome) {
      backHome.addEventListener("click", function () {
        success.hidden = true;
        form.reset();
        fields.forEach(function (field) {
          field.setAttribute("aria-invalid", "false");
          document.getElementById(field.id + "-error").textContent = "";
        });
        form.hidden = false;
        window.location.hash = "#accueil";
      });
    }
  }
});
