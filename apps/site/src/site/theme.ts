function toggleTheme() {
  if ("startViewTransition" in document) {
    document.startViewTransition(flipTheme);
  } else {
    flipTheme();
  }
}

function flipTheme() {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  const dark = root.classList.toggle("dark");

  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Storage can be blocked; the theme still flips for this visit.
  }

  // Applies the new theme with transitions still off, so nothing fades in after.
  getComputedStyle(root).getPropertyValue("color");
  root.classList.remove("theme-switching");
}

export { toggleTheme };

// Runs before first paint, so the page never flashes the wrong theme.
export const themeScript = `(() => {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    let stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {}
    root.classList.toggle(
      "dark",
      stored ? stored === "dark" : system.matches
    );
  };
  apply();
  system.addEventListener("change", () => {
    root.classList.add("theme-switching");
    apply();
    getComputedStyle(root).getPropertyValue("color");
    root.classList.remove("theme-switching");
  });
})();`;
