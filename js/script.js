// Wait for decoded imagery, fonts, and the first render of every 3D icon.
document.addEventListener("DOMContentLoaded", async () => {
  const root = document.documentElement;
  const animations = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reveal() {
    clearTimeout(window.pageLoadFallback);
    root.classList.remove("page-loading");
  }
  document.addEventListener("focusin", () => {
    reveal();
    animations.forEach(animation => animation.finish());
  }, { once: true });

  const portrait = document.querySelector("#page1");
  await Promise.allSettled([
    portrait ? portrait.decode() : Promise.resolve(),
    document.fonts.ready,
    import("./icons-3d.js").then(module => module.iconsReady)
  ]);
  // A timeout or keyboard interaction reveals the page without a late replay.
  if (!root.classList.contains("page-loading") || reducedMotion.matches) {
    reveal();
    return;
  }
  await new Promise(resolve => requestAnimationFrame(resolve));

  document.querySelectorAll(".hero-copy").forEach((element, index) => {
    animations.push(element.animate([
      { opacity: 0, transform: "translateY(38px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], {
      duration: 850,
      delay: 80 + index * 85,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "backwards"
    }));
  });

  document.querySelectorAll(".portrait-frame").forEach(element => {
    animations.push(element.animate([
      { opacity: 0, transform: "translateY(45px) rotate(3deg) scale(0.96)", offset: 0 },
      { opacity: 1, transform: "translateY(-10px) rotate(-1deg) scale(1.01)", offset: 0.55 },
      { opacity: 1, transform: "translateY(4px) rotate(0.5deg) scale(1)", offset: 0.78 },
      { opacity: 1, transform: "translateY(0) rotate(0) scale(1)", offset: 1 }
    ], { duration: 1100, delay: 160, easing: "ease-in-out", fill: "backwards" }));
  });

  // Shuffle entrance timing while keeping the navigation in its familiar order.
  const items = Array.from(document.querySelectorAll(".gridLayer"));
  for (let index = items.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  items.forEach((element, index) => {
    animations.push(element.animate([
      { opacity: 0, transform: "translateY(110px) scale(0.78, 1.16)", offset: 0, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      { opacity: 1, transform: "translateY(-38px) scale(1.06, 0.96)", offset: 0.38, easing: "ease-in" },
      { opacity: 1, transform: "translateY(10px) scale(1.12, 0.86)", offset: 0.56, easing: "ease-out" },
      { opacity: 1, transform: "translateY(-20px) scale(0.96, 1.06)", offset: 0.71, easing: "ease-in" },
      { opacity: 1, transform: "translateY(5px) scale(1.04, 0.96)", offset: 0.83, easing: "ease-out" },
      { opacity: 1, transform: "translateY(-7px) scale(1)", offset: 0.92, easing: "ease-in-out" },
      { opacity: 1, transform: "translateY(0) scale(1)", offset: 1 }
    ], {
      duration: 1250,
      delay: 180 + index * 100 + Math.random() * 50,
      easing: "ease-in-out",
      fill: "backwards"
    }));
  });

  reveal();
});
