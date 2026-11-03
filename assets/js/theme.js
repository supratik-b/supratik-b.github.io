(() => {
  const key = "color-theme";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const validTheme = value => value === "light" || value === "dark";
  let preference = null;

  try {
    const saved = localStorage.getItem(key);
    if (validTheme(saved)) preference = saved;
  } catch {
    // The theme should still work when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? "dark" : "light");
    const next = theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === "dark" ? "#17191d" : "#f7f7f5";

    const button = document.getElementById("theme-toggle");
    if (button) {
      button.setAttribute("aria-label", `Switch to ${next} mode`);
      button.title = `Switch to ${next} mode`;
      button.hidden = false;
    }
  }

  applyTheme();

  systemTheme.addEventListener("change", () => {
    if (!preference) applyTheme();
  });

  window.addEventListener("storage", event => {
    if (event.key !== key && event.key !== null) return;
    preference = validTheme(event.newValue) ? event.newValue : null;
    applyTheme();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    button.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(key, preference);
      } catch {
        // Keep the selected theme for this visit even if it cannot be saved.
      }
      applyTheme();
    });
    applyTheme();
  });
})();
