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
  system.addEventListener("change", apply);
})();`;
