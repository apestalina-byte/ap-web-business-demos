(() => {
  "use strict";
  const form = document.getElementById("auto-form"),
    service = document.getElementById("auto-service"),
    total = document.getElementById("auto-total");
  let amount = 0;
  const calculate = () => {
    amount =
      Number(service.value) +
      [...form.querySelectorAll("[data-extra]:checked")].reduce(
        (sum, c) => sum + Number(c.value),
        0,
      );
    total.textContent = AP.money(amount);
  };
  form.addEventListener("input", () => {
    form.querySelector(".brief-result").hidden = true;
    form.querySelector(".form-status").textContent = "";
  });
  form.addEventListener("change", () => {
    calculate();
    form.querySelector(".brief-result").hidden = true;
    form.querySelector(".form-status").textContent = "";
  });
  calculate();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const extras = [...form.querySelectorAll("[data-extra]:checked")].map(
      (c) => c.dataset.extra,
    );
    AP.showBrief(
      form,
      `Здравствуйте! Интересует сайт по примеру «КОНТУР».\nПроверил демонстрационный сценарий:\nУслуга: ${service.selectedOptions[0].textContent}.\nДополнительно: ${extras.join(", ") || "не выбрано"}.\nАвтомобиль: ${form.querySelector("#car").value.trim() || "не указан"}. Пробег: ${form.querySelector("#mileage").value || "не указан"} км.\nЗадача: ${form.querySelector("#symptom").value.trim() || "не указана"}.\nДемонстрационная оценка работы: ${AP.money(amount)}, запчасти отдельно.\nЭто пример интерфейса, реальная запись не выполняется. Хочу обсудить разработку похожего сайта.`,
    );
  });
})();
