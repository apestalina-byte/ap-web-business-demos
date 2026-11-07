(() => {
  "use strict";
  const form = document.getElementById("barber-form"),
    day = document.getElementById("day"),
    master = document.getElementById("master"),
    slots = document.getElementById("slots"),
    result = document.getElementById("booking-result");
  const now = new Date(),
    localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  day.min = localDate;
  day.value = localDate;
  let time = "",
    amount = 0,
    duration = 0;
  const choices = () => [...form.querySelectorAll("[data-name]:checked")];
  function renderSlots() {
    time = "";
    slots.replaceChildren();
    const seed = Number(day.value.replaceAll("-", "")) + master.selectedIndex;
    [
      "10:00",
      "11:30",
      "13:00",
      "14:30",
      "16:00",
      "17:30",
      "19:00",
      "20:00",
    ].forEach((t, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = t;
      b.setAttribute("aria-pressed", "false");
      const mins = Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
      const past =
        day.value === localDate &&
        mins <= now.getHours() * 60 + now.getMinutes();
      b.disabled =
        (i + seed) % 5 === 0 ||
        mins + duration > 21 * 60 ||
        past ||
        duration === 0;
      b.title = b.disabled
        ? "Недоступно в демонстрации"
        : "Демонстрационный слот";
      b.addEventListener("click", () => {
        slots
          .querySelectorAll("button")
          .forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
        time = t;
        clearResult();
      });
      slots.append(b);
    });
    if (![...slots.children].some((b) => !b.disabled)) {
      const note = document.createElement("p");
      note.className = "form-hint";
      note.textContent =
        "На эту дату нет подходящих демослотов. Выберите другой день и хотя бы одну услугу.";
      slots.append(note);
    }
  }
  function clearResult() {
    result.hidden = true;
    form.querySelector(".brief-result").hidden = true;
    form.querySelector(".form-status").textContent = "";
  }
  function update(e) {
    if (e?.target.name === "hair" && e.target.checked)
      form.elements.machine.checked = false;
    if (e?.target.name === "machine" && e.target.checked)
      form.elements.hair.checked = false;
    amount = choices().reduce((n, c) => n + Number(c.value), 0);
    duration = choices().reduce((n, c) => n + Number(c.dataset.minutes), 0);
    document.getElementById("barber-total").textContent = AP.money(amount);
    document.getElementById("duration").textContent = duration + " минут";
    clearResult();
    renderSlots();
  }
  form.addEventListener("change", update);
  update();
  document.querySelectorAll("[data-master]").forEach((b) =>
    b.addEventListener("click", () => {
      master.value = b.dataset.master;
      update();
      document
        .getElementById("booking")
        .scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      master.focus({ preventScroll: true });
    }),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector(".form-status");
    if (!choices().length) {
      status.textContent = "Выберите хотя бы одну услугу.";
      form.querySelector("input[type=checkbox]").focus();
      return;
    }
    if (day.value < localDate) {
      status.textContent = "Выберите сегодняшнюю или будущую дату.";
      day.focus();
      return;
    }
    if (!time) {
      status.textContent = "Выберите доступное демонстрационное время.";
      slots.querySelector("button:not(:disabled)")?.focus();
      return;
    }
    const services = choices()
      .map((c) => c.dataset.name)
      .join(", ");
    result.textContent = `Демозапись: ${AP.formatDate(day.value)}, ${time}. ${master.value}. ${services}. ${duration} мин · ${AP.money(amount)}. Это пример: реальное бронирование не создано.`;
    result.hidden = false;
    AP.showBrief(
      form,
      `Здравствуйте! Хочу обсудить сайт по примеру барбершопа «ТИХО».\nПример выбранного визита: ${services}.\nМастер: ${master.value}.\nДата: ${AP.formatDate(day.value)}, ${time}.\nДлительность: ${duration} мин. Условная стоимость: ${AP.money(amount)}.\nЭто демонстрация, запись в салон не требуется. Интересует разработка похожего сайта.`,
    );
  });
})();
