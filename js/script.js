// Play the entrance once. The page itself never needs to scroll.
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const animations = [];
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

  // Keyboard users can reach every link immediately, including during the intro.
  document.addEventListener("focusin", () => {
    animations.forEach(animation => animation.finish());
  }, { once: true });
});
