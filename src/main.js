/* main.js — single entry. Vite bundles the CSS in import order and the JS.
   Order matters: fonts → tokens → base → layout → components. */
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";

import "./scripts/header.js";
import "./scripts/motion.js";

// Keep the footer copyright year current without hardcoding.
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
