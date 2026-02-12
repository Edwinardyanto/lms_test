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
    const tg = links.telegram || defaultLinks.telegram;
    if (telegramCta) telegramCta.href = tg;
    const telegramCta2 = $("#telegramCta2");
    if (telegramCta2) telegramCta2.href = tg;
  }
  updateTelegramCta();

  // Scroll reveal
  const revealEls = $$(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  // Sneak peek chat motion
  const chatLive = $("#chatLive");
  if (chatLive) {
    const typingRow = $(".msg.typing", chatLive);
    const script = [
      { role: "bot", html: "Oke. Max drawdown kamu pilih: <b>1–5%</b> atau <b>&gt;5%</b>?" },
      { role: "user", html: "1–5%" },
      { role: "bot", html: "Market apa? <b>Forex</b>, <b>Gold</b>, <b>Crypto</b>, atau <b>Saham Indonesia</b>?" },
      { role: "user", html: "Gold, XAUUSD" },
      { role: "bot", html: "Mode: <b>Intraday</b>. Jadi aku cari setup yang gak maksa, dan risk-nya masih masuk batas kamu." },
      { role: "bot", html: "<b>Signal:</b> Wait. Belum match profil kamu. Volatilitas lagi tinggi. Aku sarankan tunggu konfirmasi dulu." },
    ];

    const makeMsg = (role, inner) => {
      const row = document.createElement("div");
      row.className = "msg " + role;
      if (role === "bot") {
        const av = document.createElement("div");
        av.className = "avatar";
        av.textContent = "AI";
        row.appendChild(av);
      }
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.innerHTML = inner;
      row.appendChild(bubble);
      return row;
    };

    let i = 0;
    const step = () => {
      if (i >= script.length) return;
      if (typingRow) typingRow.style.display = "";
      setTimeout(() => {
        if (typingRow) typingRow.style.display = "none";
        const item = script[i++];
        chatLive.appendChild(makeMsg(item.role, item.html));
        chatLive.scrollTop = chatLive.scrollHeight;
        setTimeout(step, item.role === "bot" ? 850 : 650);
      }, 650);
    };

    // kick off after short delay
    setTimeout(step, 750);
  }

})();
