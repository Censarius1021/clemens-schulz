/* motion.js — progressive enhancement only.
   Adds a soft fade-up to elements with .reveal as they enter the viewport.
   Honors prefers-reduced-motion. If JS fails, CSS keeps content visible. */

// Mark that JS is active (lets CSS adjust no-js fallbacks if ever needed).
document.documentElement.classList.remove("no-js");

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const targets = document.querySelectorAll(".reveal");

if (prefersReduced || !("IntersectionObserver" in window)) {
  // No motion: just show everything.
  targets.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // animate once
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  targets.forEach((el) => observer.observe(el));
}
