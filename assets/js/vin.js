/* =========================================================
   4 Drive Service. Расшифровка VIN.
   Локальная проверка + данные NHTSA vPIC, если база ответит.
   ========================================================= */
(function () {
  "use strict";

  const TRANSLIT = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
  };
  const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789"; // 1980..2009, дальше цикл 30 лет

  /* Производители по WMI (первые три символа) */
  const WMI = {
    WBA: "BMW", WBS: "BMW M", WBY: "BMW i", "4US": "BMW", "5UX": "BMW", "5UJ": "BMW", WMW: "MINI",
    WDB: "Mercedes-Benz", WDD: "Mercedes-Benz", WDC: "Mercedes-Benz", W1K: "Mercedes-Benz", W1N: "Mercedes-Benz", "4JG": "Mercedes-Benz", WDF: "Mercedes-Benz",
    JTD: "Toyota", JTE: "Toyota", JTN: "Toyota", JTM: "Toyota", JTK: "Toyota", "2T1": "Toyota", "4T1": "Toyota", "5TD": "Toyota", "4T3": "Toyota", "5TF": "Toyota", "2T3": "Toyota", SB1: "Toyota",
    JTH: "Lexus", JTJ: "Lexus", "2T2": "Lexus",
    KMH: "Hyundai", KMF: "Hyundai", "5NP": "Hyundai", TMA: "Hyundai", KM8: "Hyundai",
    KNA: "Kia", KND: "Kia", "5XY": "Kia", U5Y: "Kia", KNM: "Renault Samsung",
    WVW: "Volkswagen", WVG: "Volkswagen", WV1: "Volkswagen", WV2: "Volkswagen", "3VW": "Volkswagen", "1VW": "Volkswagen",
    WAU: "Audi", WUA: "Audi", TRU: "Audi", WA1: "Audi",
    TMB: "Škoda", VSS: "SEAT",
    JN1: "Nissan", JN8: "Nissan", "1N4": "Nissan", "5N1": "Nissan", "3N1": "Nissan", SJN: "Nissan", VSK: "Nissan",
    JNK: "Infiniti", JNR: "Infiniti",
    JHM: "Honda", "1HG": "Honda", "2HG": "Honda", "5FN": "Honda", JHL: "Honda", SHH: "Honda", "19X": "Honda", "5J6": "Honda",
    "1FA": "Ford", "1FM": "Ford", "1FT": "Ford", "2FM": "Ford", "3FA": "Ford", WF0: "Ford", "1FD": "Ford",
    "1G1": "Chevrolet", "1GC": "Chevrolet", "1GN": "Chevrolet", "2G1": "Chevrolet", "3GN": "Chevrolet", KL1: "Chevrolet", XUU: "Chevrolet",
    JM1: "Mazda", JM3: "Mazda", JMZ: "Mazda",
    JA3: "Mitsubishi", JA4: "Mitsubishi", JMB: "Mitsubishi", JMY: "Mitsubishi",
    JF1: "Subaru", JF2: "Subaru", "4S3": "Subaru", "4S4": "Subaru",
    VF1: "Renault", UU1: "Dacia", VF3: "Peugeot", VF7: "Citroën",
    W0L: "Opel", W0V: "Opel",
    YV1: "Volvo", YV4: "Volvo",
    WP0: "Porsche", WP1: "Porsche",
    SAL: "Land Rover", SAJ: "Jaguar",
    ZFA: "Fiat", ZAR: "Alfa Romeo",
    "1C4": "Jeep", "1J4": "Jeep", "1C6": "Ram",
    "5YJ": "Tesla", "7SA": "Tesla", LRW: "Tesla",
    JSA: "Suzuki", TSM: "Suzuki", JS3: "Suzuki",
    XTA: "Lada", LVS: "Ford (Китай)"
  };

  /* Страна по первым символам */
  function country(vin) {
    const a = vin[0], b = vin[1];
    const two = a + b;
    const between = (c, from, to) => c >= from && c <= to;
    if (a === "1" || a === "4" || a === "5") return "США";
    if (a === "2") return "Канада";
    if (a === "3") return between(b, "A", "W") ? "Мексика" : "Северная Америка";
    if (a === "J") return "Япония";
    if (a === "K") return between(b, "L", "R") ? "Южная Корея" : "Азия";
    if (a === "L") return "Китай";
    if (two === "MA" || two === "MB" || two === "MC") return "Индия";
    if (two === "MM" || two === "ML") return "Таиланд";
    if (a === "N") return between(b, "L", "R") ? "Турция" : "Азия";
    if (a === "S") return between(b, "A", "M") ? "Великобритания" : between(b, "N", "T") ? "Германия" : "Европа";
    if (a === "T") return between(b, "J", "P") ? "Чехия" : between(b, "R", "V") ? "Венгрия" : "Европа";
    if (a === "U") return between(b, "U", "Z") ? "Румыния" : "Европа";
    if (a === "V") return between(b, "F", "R") ? "Франция" : between(b, "S", "W") ? "Испания" : "Европа";
    if (a === "W") return "Германия";
    if (a === "X") return "Россия или СНГ";
    if (two === "YV" || two === "YS") return "Швеция";
    if (a === "Y") return "Северная Европа";
    if (a === "Z") return "Италия";
    if (a === "9") return "Бразилия";
    if (a === "6") return "Австралия";
    if (a === "7") return between(b, "A", "E") ? "Океания" : "США";
    if (a === "8") return "Южная Америка";
    return "не определили";
  }

  const isNA = (vin) => /^([1-5]|7[F-Z0-9])/.test(vin);

  function checkDigit(vin) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const ch = vin[i];
      const v = /\d/.test(ch) ? Number(ch) : TRANSLIT[ch];
      if (v == null) return null;
      sum += v * WEIGHTS[i];
    }
    const r = sum % 11;
    return r === 10 ? "X" : String(r);
  }

  /* Модельный год: возвращает {year, alt} */
  function modelYear(vin) {
    const code = vin[9];
    const idx = YEAR_CODES.indexOf(code);
    if (idx < 0) return null;
    const base = 1980 + idx;
    const candidates = [base, base + 30, base + 60].filter((y) => y >= 1980);
    const maxYear = new Date().getFullYear() + 1;
    let year;
    if (isNA(vin) && /[A-Z]/.test(code)) {
      // В Северной Америке буква на 7 позиции означает цикл с 2010 года
      year = /[A-Z]/.test(vin[6]) ? base + 30 : base;
      if (year > maxYear) year = base;
    } else {
      const ok = candidates.filter((y) => y <= maxYear);
      year = ok.length ? ok[ok.length - 1] : base;
    }
    const alt = candidates.filter((y) => y !== year && y <= maxYear).pop() || null;
    return { year, alt };
  }

  function validate(raw) {
    const vin = raw.toUpperCase().replace(/[\s-]/g, "");
    const res = { vin, errors: [], warnings: [], bad: [] };
    if (!vin) { res.errors.push("Введите VIN, 17 символов."); return res; }
    const foreign = vin.match(/[^A-Z0-9]/g);
    if (foreign) res.errors.push("В VIN бывают только латинские буквы и цифры. Проверьте раскладку.");
    const iq = [];
    for (let i = 0; i < vin.length; i++) {
      if ("IOQ".includes(vin[i])) { iq.push(`${vin[i]} на ${i + 1} месте`); res.bad.push(i); }
    }
    if (iq.length) res.errors.push(`Буквы I, O и Q в VIN не используют, их легко спутать с 1 и 0. Нашли: ${iq.join(", ")}.`);
    if (vin.length !== 17) {
      res.errors.push(vin.length < 17
        ? `Символов ${vin.length}, а нужно 17. Не хватает ${17 - vin.length}.`
        : `Символов ${vin.length}, а нужно 17. Лишних ${vin.length - 17}.`);
    }
    if (res.errors.length) return res;

    const cd = checkDigit(vin);
    res.check = { expected: cd, actual: vin[8], ok: cd === vin[8] };
    if (!res.check.ok) {
      if (isNA(vin)) {
        res.errors.push(`Контрольная цифра не сходится: на 9 месте стоит ${vin[8]}, а по расчёту должна быть ${cd}. Для автомобилей из Северной Америки это, скорее всего, опечатка в номере.`);
        res.bad.push(8);
      } else {
        res.warnings.push(`Контрольная цифра не совпала (стоит ${vin[8]}, по расчёту ${cd}). Для европейских и азиатских автомобилей это нормально: там её часто не используют. Расшифровываем дальше.`);
      }
    }
    return res;
  }

  function localDecode(vin) {
    const wmi = vin.slice(0, 3);
    const make = WMI[wmi] || null;
    const y = modelYear(vin);
    return {
      wmi,
      vds: vin.slice(3, 9),
      vis: vin.slice(9),
      make,
      country: country(vin),
      year: y ? y.year : null,
      altYear: y ? y.alt : null,
      plant: vin[10],
      serial: vin.slice(11),
      na: isNA(vin)
    };
  }

  /* ---------- DOM ---------- */
  const $ = (s) => document.querySelector(s);
  const form = $("#vin-form");
  if (!form) return;
  const input = $("#vin-input");
  const counter = $("[data-vin-count]");
  const msg = $("#vin-msg");
  const result = $("#vin-result");
  const emptyState = $("#vin-empty");
  const cells = $("#vin-cells");
  const localKv = $("#vin-local");
  const apiBox = $("#vin-api");
  const apiPill = $("#vin-api-pill");
  const ctaCar = $("#vin-cta-car");
  const ctaLink = $("#vin-cta-link");
  const submitBtn = form.querySelector("[type=submit]");
  let reqId = 0;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICONS = {
    err: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
  };

  function showMsg(type, lines) {
    if (!lines || !lines.length) { msg.className = "vin-msg"; msg.innerHTML = ""; return; }
    msg.className = `vin-msg vin-msg--${type} is-visible`;
    msg.innerHTML = ICONS[type] + `<div>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}</div>`;
  }

  function updateCounter() {
    const clean = input.value.toUpperCase().replace(/[\s-]/g, "");
    counter.textContent = `${clean.length} / 17`;
  }

  input.addEventListener("input", () => {
    const pos = input.selectionStart;
    const up = input.value.toUpperCase();
    if (up !== input.value) { input.value = up; try { input.setSelectionRange(pos, pos); } catch (e) {} }
    input.removeAttribute("aria-invalid");
    updateCounter();
  });

  document.querySelectorAll("[data-vin-sample]").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.vinSample;
      updateCounter();
      run(input.value);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    run(input.value);
  });

  function renderCells(vin, bad, check) {
    const labels = { 8: "контр.", 9: "год", 10: "завод" };
    cells.innerHTML = "";
    for (let i = 0; i < 17; i++) {
      const el = document.createElement("div");
      const group = i < 3 ? "wmi" : i < 9 ? "vds" : "vis";
      el.className = `vin-cell vin-cell--${group}`;
      if (i === 9 || (i === 8 && check && check.ok)) el.classList.add("vin-cell--key");
      if (bad.includes(i)) el.classList.add("vin-cell--bad");
      el.style.setProperty("--i", i);
      el.innerHTML = `<b>${esc(vin[i] || "")}</b><small>${labels[i] || i + 1}</small>`;
      el.title = `Позиция ${i + 1}`;
      cells.appendChild(el);
    }
  }

  function kvRow(dt, dd, small) {
    return `<dt>${esc(dt)}</dt><dd>${esc(dd)}${small ? `<small>${esc(small)}</small>` : ""}</dd>`;
  }

  function renderLocal(d, v) {
    let html = "";
    html += kvRow("Марка", d.make || "Не нашли в нашей таблице", d.make ? `по коду ${d.wmi}` : `код ${d.wmi}`);
    html += kvRow("Страна производителя", d.country);
    html += kvRow("Модельный год", d.year ? String(d.year) : "не определили", d.year && !d.na ? "ориентировочно: вне Северной Америки год кодируют не всегда" : d.altYear ? `или ${d.altYear}, код повторяется каждые 30 лет` : "");
    html += kvRow("Контрольная цифра", v.check.ok ? `${v.check.actual}, сходится` : `${v.check.actual}, по расчёту ${v.check.expected}`, d.na ? "для Северной Америки обязательна" : "в Европе и Азии бывает любой");
    html += kvRow("Код завода", d.plant);
    html += kvRow("Серийный номер", d.serial);
    localKv.innerHTML = html;
  }

  function setPill(type, text) {
    apiPill.className = `status-pill status-pill--${type}`;
    apiPill.textContent = text;
  }

  const API_FIELDS = [
    ["Make", "Марка"],
    ["Model", "Модель"],
    ["ModelYear", "Год"],
    ["Trim", "Комплектация"],
    ["Series", "Серия"],
    ["BodyClass", "Кузов"],
    ["DriveType", "Привод"],
    ["FuelTypePrimary", "Топливо"],
    ["DisplacementL", "Объём, л"],
    ["EngineCylinders", "Цилиндров"],
    ["EngineHP", "Мощность, л.с."],
    ["EngineModel", "Двигатель"],
    ["TransmissionStyle", "Коробка"],
    ["PlantCountry", "Завод, страна"]
  ];

  async function fetchApi(vin, id) {
    setPill("load", "Запрашиваем базу");
    apiBox.innerHTML = '<div class="skeleton" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><p class="visually-hidden" role="status">Загружаем данные</p>';
    const ctrl = "AbortController" in window ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), 6000);
    try {
      const r = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`, ctrl ? { signal: ctrl.signal } : {});
      clearTimeout(timer);
      if (!r.ok) throw new Error("http");
      const json = await r.json();
      if (id !== reqId) return null;
      const row = json && json.Results && json.Results[0];
      const clean = (v) => (v == null ? "" : String(v).trim());
      const rows = row ? API_FIELDS.filter(([k]) => clean(row[k]) && clean(row[k]) !== "0" && clean(row[k]).toLowerCase() !== "not applicable") : [];
      if (!rows.length) throw new Error("empty");
      let html = '<dl class="kv">';
      rows.forEach(([k, label]) => {
        let val = clean(row[k]);
        if (k === "DisplacementL") val = String(Math.round(parseFloat(val) * 10) / 10 || val);
        html += kvRow(label, val);
      });
      html += "</dl>";
      apiBox.innerHTML = html;
      setPill("ok", "Данные NHTSA");
      return row;
    } catch (e) {
      clearTimeout(timer);
      if (id !== reqId) return null;
      apiBox.innerHTML = '<p class="muted">Онлайн-база по этому номеру ничего не дала. Так часто бывает с автомобилями для Европы и Азии. Расшифровка в соседнем блоке сделана по самому номеру, а точную комплектацию посмотрим в сервисе по документам.</p>';
      setPill("warn", "Нет данных");
      return null;
    }
  }

  function setCta(make, model, year, vin) {
    const parts = [make, model, year].filter(Boolean);
    const car = parts.length ? parts.join(" ") : "Авто";
    ctaCar.textContent = car;
    const q = `${car}, VIN ${vin}`;
    ctaLink.href = `index.html?car=${encodeURIComponent(q)}#booking`;
  }

  async function run(raw) {
    const id = ++reqId;
    const v = validate(raw);
    input.value = v.vin;
    updateCounter();

    if (v.errors.length) {
      input.setAttribute("aria-invalid", "true");
      showMsg("err", v.errors);
      result.hidden = true;
      emptyState.hidden = false;
      return;
    }
    input.removeAttribute("aria-invalid");
    showMsg(v.warnings.length ? "warn" : "ok", v.warnings.length ? v.warnings : ["Номер в порядке. Разбираем по частям."]);

    try { history.replaceState(null, "", `?vin=${v.vin}`); } catch (e) {}

    const d = localDecode(v.vin);
    emptyState.hidden = true;
    result.hidden = false;
    renderCells(v.vin, v.bad, v.check);
    renderLocal(d, v);
    setCta(d.make, "", d.year, v.vin);

    if (submitBtn) submitBtn.disabled = true;
    const row = await fetchApi(v.vin, id);
    if (submitBtn) submitBtn.disabled = false;
    if (id !== reqId) return;
    if (row) {
      const make = (row.Make || "").trim();
      const prettyMake = make ? make.charAt(0) + make.slice(1).toLowerCase() : d.make;
      setCta(d.make || prettyMake, (row.Model || "").trim(), (row.ModelYear || "").trim() || d.year, v.vin);
    }
  }

  // Автозапуск по ?vin=
  updateCounter();
  const qp = new URLSearchParams(location.search).get("vin");
  if (qp) {
    input.value = qp.slice(0, 30);
    run(input.value);
  }

  // Для проверки из консоли
  window.VIN = { validate, checkDigit, modelYear, localDecode };
})();
