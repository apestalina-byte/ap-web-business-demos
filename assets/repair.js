(() => {
  "use strict";
  const form = document.getElementById("repair-form"),
    area = document.getElementById("area"),
    type = document.getElementById("repair-type"),
    total = document.getElementById("repair-total");
  let low = 0,
    high = 0,
    rate = 0;
  function calculate() {
    const n = Number(area.value),
      share = [...form.querySelectorAll("[data-scope]:checked")].reduce(
        (s, c) => s + Number(c.value),
        0,
      );
    rate = Math.round(Number(type.value) * share);
    low = Math.round(n * rate);
    high = Math.round(low * 1.25);
    const valid = area.validity.valid && area.value !== "";
    total.textContent = valid
      ? AP.money(low) + "–" + AP.money(high)
      : "Укажите 10–500 м²";
    document.getElementById("rate-note").textContent =
      AP.money(rate) + "/м² · материалы отдельно";
    form.querySelector(".brief-result").hidden = true;
    form.querySelector(".form-status").textContent = "";
  }
  form.addEventListener("input", calculate);
  form.addEventListener("change", calculate);
  calculate();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const scope = [...form.querySelectorAll("[data-scope]:checked")].map(
      (c) => c.dataset.scope,
    );
    if (!scope.length) {
      form.querySelector(".form-status").textContent =
        "Выберите хотя бы одну группу работ.";
      form.querySelector("input[type=checkbox]").focus();
      return;
    }
    AP.showBrief(
      form,
      `Здравствуйте! Интересует сайт по примеру «ЛИНИЯ».\nДемонстрационный бриф:\nОбъект: ${document.getElementById("object").value}. Площадь: ${area.value} м².\nРемонт: ${type.selectedOptions[0].textContent}.\nСостав: ${scope.join(", ")}.\nУсловная ставка работ: ${AP.money(rate)}/м².\nОценка: ${AP.money(low)}–${AP.money(high)}. Без материалов, сложной инженерии и перепланировки; не смета.\nКомментарий: ${document.getElementById("repair-comment").value.trim() || "без комментария"}.\nРасчёт демонстрационный. Хочу обсудить разработку похожего сайта.`,
    );
  });
})();
