/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — SHARED NAVIGATION / SIDEBAR
   Include on every admin page.
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Sidebar toggle ── */
  const toggleBtn   = document.getElementById("toggleSidebar");
  const sidebar     = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");

  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    });
  }

  /* ── Nav active state via data-page on <body> ── */
  const currentPage = document.body.dataset.page || "";
  document.querySelectorAll(".sidebar-nav a[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === currentPage);
  });

  /* ── Nav links: use the href attribute directly.
        Each page's HTML already has the correct relative href set.
        We only prevent default if clicking the already-active page. ── */
  document.querySelectorAll(".sidebar-nav a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.dataset.page === currentPage) {
        e.preventDefault(); // already here, do nothing
      }
      // Otherwise let the browser follow the href naturally
    });
  });
})();
