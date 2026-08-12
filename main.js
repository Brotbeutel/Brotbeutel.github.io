window.J_KEEBS_I18N_COMMON = {
    de: {
        "nav.home": "Home", "nav.blog": "Blog", "nav.forum": "Forum", "nav.keyboards": "Keyboards",
        "nav.switches": "Switches", "nav.about": "Über uns", "nav.faq": "FAQ",
        "utility.theme.aria": "Farbschema umschalten",
        "footer.tagline": "Custom Mechanical Keyboards, Modding und Upcycling mit Fokus auf deutsches ISO-Layout.",
        "footer.col1.heading": "Entdecken", "footer.col2.heading": "Community", "footer.col3.heading": "Kontakt",
        "footer.mail": "E-Mail schreiben", "footer.contactpage": "Kontaktseite",
        "footer.copyright": "© 2026 J-Keebs. Alle Rechte vorbehalten.",
        "legal.impressum": "Impressum", "legal.datenschutz": "Datenschutz", "legal.cookies": "Cookies", "legal.agb": "AGB",
    },
    en: {
        "nav.home": "Home", "nav.blog": "Blog", "nav.forum": "Forum", "nav.keyboards": "Keyboards",
        "nav.switches": "Switches", "nav.about": "About", "nav.faq": "FAQ",
        "utility.theme.aria": "Toggle color scheme",
        "footer.tagline": "Custom mechanical keyboards, modding and upcycling focused on the German ISO layout.",
        "footer.col1.heading": "Explore", "footer.col2.heading": "Community", "footer.col3.heading": "Contact",
        "footer.mail": "Send an email", "footer.contactpage": "Contact page",
        "footer.copyright": "© 2026 J-Keebs. All rights reserved.",
        "legal.impressum": "Legal notice", "legal.datenschutz": "Privacy", "legal.cookies": "Cookies", "legal.agb": "Terms",
    }
};

(function () {
    "use strict";

    var root = document.documentElement;
    var THEME_KEY = "jkeebs-theme";
    var LANG_KEY = "jkeebs-lang";

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
        document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
            btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
        });
    }

    function applyLang(lang) {
        root.setAttribute("lang", lang);
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
        var common = (window.J_KEEBS_I18N_COMMON && window.J_KEEBS_I18N_COMMON[lang]) || {};
        var page = (window.J_KEEBS_I18N && window.J_KEEBS_I18N[lang]) || {};
        var dict = Object.assign({}, common, page);
        if (Object.keys(dict).length) {
            document.querySelectorAll("[data-i18n]").forEach(function (el) {
                var key = el.getAttribute("data-i18n");
                if (dict[key] !== undefined) el.textContent = dict[key];
            });
            document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
                el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
                    var parts = pair.split(":");
                    var attr = parts[0], key = parts[1];
                    if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
                });
            });
        }
        document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
            btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-toggle") === lang ? "true" : "false");
        });
    }

    function initGallery(frame) {
        var imgs = frame.querySelectorAll(".polaroid-frame__viewport [data-slide]");
        var dots = frame.querySelectorAll(".carousel-dots button");
        var index = 0;

        function show(i) {
            index = (i + imgs.length) % imgs.length;
            imgs.forEach(function (el, idx) { el.classList.toggle("is-active", idx === index); });
            dots.forEach(function (dot, idx) { dot.setAttribute("aria-current", idx === index ? "true" : "false"); });
        }

        var prev = frame.querySelector(".carousel-btn--prev");
        var next = frame.querySelector(".carousel-btn--next");
        if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(index - 1); });
        if (next) next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(index + 1); });
        dots.forEach(function (dot, idx) {
            dot.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(idx); });
        });
        show(0);
    }

    // Spickzettel: per Hover (Maus) ODER per Tap/Enter (Touch, Tastatur) ausfahren.
    function initCheatSheetToggle(stage) {
        var frame = stage.querySelector(".polaroid-frame");
        if (!frame) return;

        function toggle() {
            var open = stage.classList.toggle("is-open");
            frame.setAttribute("aria-expanded", open ? "true" : "false");
        }

        frame.setAttribute("aria-expanded", "false");
        frame.addEventListener("click", function (e) {
            if (e.target.closest(".carousel-btn") || e.target.closest(".carousel-dots")) return;
            toggle();
        });
        frame.addEventListener("keydown", function (e) {
            if (e.target !== frame) return; // Buttons im Inneren regeln ihre eigene Enter/Space-Bedienung.
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        });
    }

    var savedTheme = "dark";
    try { savedTheme = localStorage.getItem(THEME_KEY) || "dark"; } catch (e) {}
    applyTheme(savedTheme);

    document.addEventListener("DOMContentLoaded", function () {
        var savedLang = "de";
        try { savedLang = localStorage.getItem(LANG_KEY) || "de"; } catch (e) {}
        applyLang(savedLang);

        document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
            });
        });

        document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                applyLang(btn.getAttribute("data-lang-toggle"));
            });
        });

        document.querySelectorAll(".polaroid-frame").forEach(initGallery);
        document.querySelectorAll(".gallery-item__stage").forEach(initCheatSheetToggle);
    });
})();