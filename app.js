// --- Instructions dropdown ---
(function setupHowToDropdown() {
  const btn = document.getElementById("howtoBtn");
  const menu = document.getElementById("howtoMenu");
  if (!btn || !menu) return;

  const KEY = "howto_open_v1";
  const saved = localStorage.getItem(KEY);
  const initialOpen = saved === "1";

  const setOpen = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    localStorage.setItem(KEY, open ? "1" : "0");
  };

  setOpen(initialOpen);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });

  // Close when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("open")) return;
    if (!menu.contains(e.target) && e.target !== btn) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();
