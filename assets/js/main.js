(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  const year = new Date().getFullYear();
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(year);

  // Mobile menu
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
      const isOpen = mobileMenu.classList.contains("show");
      mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });

    $$(".mobile-link").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("show");
        mobileMenu.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Theme toggle (simple contrast)
  const themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("contrast");
    });
  }

  // Modal for plan selection
  const modal = $("#modal");
  const modalPlan = $("#modalPlan");
  const modalClose = $("#modalClose");
  const tgLink = $("#tgLink");
  const payLink = $("#payLink");
  const saveLinks = $("#saveLinks");
  const telegramCta = $("#telegramCta");

  const STORAGE_KEY = "aiTeleBotLinks:v1";
  const defaultLinks = {
    telegram: "https://t.me/your_bot",
    payment: ""
  };

  function loadLinks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultLinks };
      const parsed = JSON.parse(raw);
      return { ...defaultLinks, ...parsed };
    } catch {
      return { ...defaultLinks };
    }
  }

  function saveLinksToStorage(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function openModal(planName) {
    if (!modal) return;
    const links = loadLinks();
    if (modalPlan) modalPlan.textContent = planName;
    if (tgLink) tgLink.value = links.telegram || defaultLinks.telegram;
    if (payLink) payLink.value = links.payment || "";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  // Wire plan buttons
  $$("[data-plan]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const plan = btn.getAttribute("data-plan") || "Paket";
      openModal(plan);
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeModal();
    });
  }

  // Save and open Telegram
  if (saveLinks) {
    saveLinks.addEventListener("click", () => {
      const telegram = (tgLink?.value || "").trim() || defaultLinks.telegram;
      const payment = (payLink?.value || "").trim();
      saveLinksToStorage({ telegram, payment });
      closeModal();
      window.open(telegram, "_blank", "noopener");
    });
  }

  // Main CTA reads from storage
  function updateTelegramCta() {
    const links = loadLinks();
    if (telegramCta) telegramCta.href = links.telegram || defaultLinks.telegram;
  }
  updateTelegramCta();

})();
