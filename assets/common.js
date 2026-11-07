/* Shared UI: no requests, analytics or persisted visitor data. */
(() => {
  "use strict";
  const mobileAction = document.querySelector(".mobile-action");
  if (mobileAction && "IntersectionObserver" in window) {
    const destination = document.querySelector(
      mobileAction.getAttribute("href"),
    );
    if (destination) {
      new IntersectionObserver((entries) => {
        mobileAction.hidden = entries[0].isIntersecting;
      }).observe(destination);
    }
  }
  const nav = document.querySelector("[data-nav]"),
    toggle = document.querySelector("[data-menu-toggle]");
  if (nav && toggle) {
    const close = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Открыть меню");
    };
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    nav
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        close();
        toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".site-header")) close();
    });
    nav.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey && e.target === nav.lastElementChild)
        close();
    });
  }
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const name = group.dataset.filterGroup;
    group.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      group.querySelectorAll("button").forEach((el) => {
        el.classList.toggle("active", el === b);
        el.setAttribute("aria-pressed", String(el === b));
      });
      document
        .querySelectorAll(`[data-filter-item="${name}"]`)
        .forEach((el) => {
          el.hidden =
            b.dataset.filter !== "all" &&
            el.dataset.category !== b.dataset.filter;
          if (el.hidden && el.tagName === "DETAILS") el.open = false;
        });
    });
  });
  const modal = document.getElementById("lightbox");
  if (modal) {
    let current = 0,
      group = [],
      trigger = null;
    const img = modal.querySelector("img"),
      caption = modal.querySelector("#photo-caption"),
      count = modal.querySelector("#photo-count");
    const display = () => {
      const src = group[current].querySelector("img");
      img.src = src.src;
      img.alt = src.alt;
      caption.textContent = group[current].dataset.caption;
      count.textContent = `${current + 1} / ${group.length}`;
    };
    const move = (delta) => {
      current = (current + delta + group.length) % group.length;
      display();
    };
    document.querySelectorAll("[data-gallery]").forEach((b) =>
      b.addEventListener("click", () => {
        group = [...document.querySelectorAll("[data-gallery]")].filter(
          (el) => !el.closest("[hidden]"),
        );
        current = group.indexOf(b);
        trigger = b;
        display();
        modal.showModal();
        document.body.style.overflow = "hidden";
      }),
    );
    modal
      .querySelector("[data-close]")
      .addEventListener("click", () => modal.close());
    modal
      .querySelector("[data-prev]")
      .addEventListener("click", () => move(-1));
    modal.querySelector("[data-next]").addEventListener("click", () => move(1));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        const r = modal.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          modal.close();
      }
    });
    modal.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    });
    modal.addEventListener("close", () => {
      document.body.style.overflow = "";
      trigger?.focus();
    });
  }
  window.AP = {
    money: (n) =>
      new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) +
      " ₽",
    showBrief(form, text) {
      const result = form.querySelector(".brief-result");
      result.hidden = false;
      result.querySelector("textarea").value = text;
      form.querySelector(".form-status").textContent =
        "Текст готов. Его можно скопировать. Telegram открывается отдельной кнопкой; отправку выполняете вы.";
    },
    formatDate: (value) =>
      new Date(value + "T12:00:00").toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  };
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const result = b.closest(".brief-result"),
        text = result.querySelector("textarea"),
        status = b.closest("form").querySelector(".form-status");
      try {
        await navigator.clipboard.writeText(text.value);
        status.textContent =
          "Текст скопирован. Откройте Telegram и отправьте его самостоятельно.";
        b.textContent = "Скопировано ✓";
        setTimeout(() => (b.textContent = "Скопировать текст"), 2500);
      } catch {
        text.focus();
        text.select();
        status.textContent =
          "Автокопирование недоступно. Текст выделен: скопируйте его вручную.";
      }
    }),
  );
  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(
        ".section-head,.project-description,.about-grid,.atmosphere-caption",
      )
      .forEach((el) => observer.observe(el));
  }
})();
