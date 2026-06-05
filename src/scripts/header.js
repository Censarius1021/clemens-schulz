/* header.js — toggles the header between "transparent over hero" and "solid".
   Only relevant on pages that have a .hero; elsewhere the header stays solid. */

const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

if (header && hero) {
  // Switch to solid just before the hero scrolls out from under the header.
  const threshold = () => Math.max(0, hero.offsetHeight - header.offsetHeight);

  const update = () => {
    header.classList.toggle("is-top", window.scrollY < threshold());
  };

  update(); // set correct state on load (markup pre-sets is-top to avoid flash)

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update, { passive: true });
} else if (header) {
  // No hero on this page → always solid.
  header.classList.remove("is-top");
}
