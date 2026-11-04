/* =========================================================
   4 Drive Service. Общий скрипт сайта.
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG: единственное место с контактами.
   Всё, что помечено PLACEHOLDER, нужно заменить на реальные данные.
   Ссылки на сайте строятся отсюда через data-link и data-config.
   --------------------------------------------------------- */
const CONFIG = {
  name: "4 Drive Service",
  phone: "+995 5XX XXX XXX",            // PLACEHOLDER: телефон для показа
  phoneHref: "+995500000000",            // PLACEHOLDER: телефон для ссылки tel:
  telegram: "D22224444",         // PLACEHOLDER: username без @
  whatsapp: "995500000000",              // PLACEHOLDER: номер для wa.me, только цифры
  callbackUrl: "",                       // PLACEHOLDER: адрес воркера из callback-bot. Пусто: заявка на звонок идёт через WhatsApp
  instagram: "4drive_service",           // PLACEHOLDER: аккаунт без @
  hours: "Ежедневно с 9:00 до 19:00",    // PLACEHOLDER: уточнить график
  address: "ул. Нико Джакели 22Д, Батуми",
  yandex: "https://yandex.ru/navi/org/143645771537",
  yandexOid: "143645771537",
  rating: "5,0",
  reviews: 95
};

/* Ссылки по типу. */
const LINKS = {
  telegram: () => `https://t.me/${CONFIG.telegram}`,
  whatsapp: () => `https://wa.me/${CONFIG.whatsapp}`,
  phone: () => `tel:${CONFIG.phoneHref}`,
  instagram: () => `https://instagram.com/${CONFIG.instagram}`,
  yandex: () => CONFIG.yandex
};

/* ---------------------------------------------------------
   i18n. RU берётся из разметки (каждый data-i18n хранит русский
   текст как запасной вариант) и дублируется в словаре ниже для
   общих ключей и текстов, которые собирает JS. EN и GE пока
   заглушки: шапка, первый экран, кнопки, заголовки секций.
   Нет перевода: показываем русский.
   --------------------------------------------------------- */
const I18N = {
  ru: {
    "nav.home": "Главная",
    "nav.services": "Услуги",
    "nav.vin": "VIN",
    "nav.guide": "Гайд",
    "nav.contacts": "Контакты",
    "btn.book": "Записаться",
    "btn.book.long": "Записаться на ремонт",
    "btn.prices": "Весь прайс",
    "btn.telegram": "Написать в Telegram",
    "btn.whatsapp": "Написать в WhatsApp",
    "btn.call": "Позвонить",
    "btn.route": "Построить маршрут",
    "map.title": "Мы на карте",
    "map.open": "Открыть в Яндекс Картах",
    "btn.check": "Проверить",
    "hero.l1": "Ремонт",
    "hero.l2": "без сюрпризов.",
    "hero.l3": "Смета заранее.",
    "hero.badge": "95 отзывов",
    "hero.lead": "Автосервис в Батуми. Согласуем смету до начала работ, показываем и возвращаем снятые детали, присылаем фото и видео ремонта.",
    "hero.sticker1": "Смета до начала работ",
    "hero.sticker2": "Опытные мастера",
    "hero.gaugeTag": "Рейтинг на Яндексе",
    "hero.gaugeOf": "из 5",
    "hero.gaugeLink": "Читать на Яндексе",
    "form.sendTg": "Отправить в Telegram",
    "form.sendWa": "Отправить в WhatsApp",
    "form.send": "Отправить заявку",
    "form.sendCall": "Заказать звонок",
    "form.err.name": "Укажите, как к вам обращаться",
    "form.err.car": "Укажите марку и модель",
    "form.err.channel": "Выберите, как с вами связаться",
    "form.err.phone": "Укажите номер, чтобы мы могли перезвонить",
    "form.err.phoneBad": "Проверьте номер телефона",
    "form.err.top": "Проверьте поля, отмеченные красным.",
    "form.ok.tg": "Текст заявки скопирован. Открываем Telegram: вставьте сообщение в чат и отправьте.",
    "form.ok.tgNoCopy": "Открываем Telegram. Скопируйте текст ниже и отправьте его в чат.",
    "form.ok.wa": "Открываем WhatsApp с готовым сообщением. Осталось нажать «отправить».",
    "form.openWa": "Чат не открылся? Откройте WhatsApp",
    "form.openTg": "Чат не открылся? Откройте Telegram",
    "form.ok.call": "Открываем WhatsApp с заявкой на звонок. Нажмите «отправить», и мы перезвоним.",
    "form.ok.callSent": "Заявка принята. Мы скоро перезвоним.",
    "form.err.callFail": "Не удалось отправить заявку. Напишите нам или позвоните:",
    "form.msg.hello": "Здравствуйте! Хочу записаться в 4 Drive Service.",
    "form.msg.helloCall": "Здравствуйте! Перезвоните мне, пожалуйста.",
    "form.msg.phone": "Телефон",
    "form.msg.name": "Имя",
    "form.msg.car": "Авто",
    "form.msg.service": "Что нужно",
    "form.msg.when": "Когда удобно",
    "form.msg.comment": "Комментарий",
    "toast.copied": "Скопировано"
  },
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.vin": "VIN",
    "nav.guide": "Guide",
    "nav.contacts": "Contacts",
    "btn.book": "Book",
    "btn.book.long": "Book a repair",
    "btn.prices": "Full price list",
    "btn.telegram": "Message on Telegram",
    "btn.whatsapp": "Message on WhatsApp",
    "btn.call": "Call",
    "btn.route": "Get directions",
    "map.title": "Find us on the map",
    "map.open": "Open in Yandex Maps",
    "btn.check": "Check",
    "hero.l1": "Repairs",
    "hero.l2": "no surprises.",
    "hero.l3": "Price up front.",
    "hero.badge": "95 reviews",
    "hero.lead": "Car repair in Batumi. We agree the estimate before any work starts, return the removed parts and send photos and videos of the repair.",
    "hero.sticker1": "Estimate first",
    "hero.sticker2": "Experienced mechanics",
    "hero.gaugeTag": "Yandex rating",
    "hero.gaugeOf": "out of 5",
    "hero.gaugeLink": "Read on Yandex",
    "form.sendTg": "Send via Telegram",
    "form.sendWa": "Send via WhatsApp",
    "form.send": "Send request",
    "form.sendCall": "Request a call"
  },
  ge: {
    "nav.home": "მთავარი",
    "nav.services": "სერვისები",
    "nav.vin": "VIN",
    "nav.guide": "გზამკვლევი",
    "nav.contacts": "კონტაქტი",
    "btn.book": "ჩაწერა",
    "btn.book.long": "ჩაეწერეთ შეკეთებაზე",
    "btn.prices": "სრული ფასები",
    "btn.telegram": "მოგვწერეთ Telegram-ში",
    "btn.whatsapp": "მოგვწერეთ WhatsApp-ში",
    "btn.call": "დარეკვა",
    "btn.route": "მარშრუტი",
    "map.title": "ჩვენ რუკაზე",
    "map.open": "გახსენით Yandex Maps-ში",
    "btn.check": "შემოწმება",
    "hero.l1": "შეკეთება",
    "hero.l2": "სიურპრიზების გარეშე.",
    "hero.l3": "ფასი წინასწარ.",
    "hero.badge": "95 შეფასება",
    "hero.lead": "ავტოსერვისი ბათუმში. ჯერ ხარჯთაღრიცხვა, მერე შეკეთება.",
    "hero.sticker1": "ჯერ ფასი",
    "hero.sticker2": "გამოცდილი ხელოსნები",
    "hero.gaugeTag": "Yandex-ის რეიტინგი",
    "hero.gaugeOf": "5-დან",
    "hero.gaugeLink": "წაიკითხეთ Yandex-ზე",
    "form.send": "გაგზავნა",
    "form.sendCall": "დამირეკეთ"
  }
};

const LANG_KEY = "4drive_lang";
const HTML_LANG = { ru: "ru", en: "en", ge: "ka" };
let currentLang = "ru";

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch (e) { /* хранилище недоступно */ }
}

/* Перевод для JS. Нет ключа в языке: русский. */
function t(key) {
  const dict = I18N[currentLang] || {};
  if (dict[key] != null) return dict[key];
  if (I18N.ru[key] != null) return I18N.ru[key];
  return key;
}

function applyLang(lang) {
  if (!I18N[lang]) lang = "ru";
  currentLang = lang;
  document.documentElement.lang = HTML_LANG[lang] || "ru";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.dataset.i18nRu == null) el.dataset.i18nRu = el.innerHTML;
    const key = el.dataset.i18n;
    const val = lang === "ru" ? null : (I18N[lang] || {})[key];
    el.innerHTML = val != null ? val : el.dataset.i18nRu;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    if (el.dataset.i18nPhRu == null) el.dataset.i18nPhRu = el.getAttribute("placeholder") || "";
    const val = lang === "ru" ? null : (I18N[lang] || {})[el.dataset.i18nPlaceholder];
    el.setAttribute("placeholder", val != null ? val : el.dataset.i18nPhRu);
  });

  document.querySelectorAll(".lang-switch button").forEach((b) => {
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });

  safeSet(LANG_KEY, lang);
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function initLang() {
  document.querySelectorAll(".lang-switch button").forEach((b) => {
    b.addEventListener("click", () => applyLang(b.dataset.lang));
  });
  const saved = safeGet(LANG_KEY);
  applyLang(saved && I18N[saved] ? saved : "ru");
}

/* ---------------------------------------------------------
   Контакты из CONFIG
   --------------------------------------------------------- */
function initConfigLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const make = LINKS[el.dataset.link];
    if (!make) return;
    el.setAttribute("href", make());
    if (el.dataset.link !== "phone") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    let val = CONFIG[key];
    if (key === "telegram" || key === "instagram") val = "@" + val;
    if (key === "whatsapp") val = CONFIG.phone;
    if (val != null) el.textContent = val;
  });
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

/* ---------------------------------------------------------
   Шапка, мобильное меню, активный пункт
   --------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = document.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    const setOpen = (open) => {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      menu.classList.toggle("is-open", open);
      menu.toggleAttribute("inert", !open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("menu-open", open);
      if (open) {
        const first = menu.querySelector("a, button");
        if (first) first.focus();
      }
    };
    setOpen(false);
    burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); burger.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 1080) setOpen(false); });
  }

  // Активный пункт меню по имени файла
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    const isAnchor = (a.getAttribute("href") || "").includes("#");
    if (!isAnchor && (href === file || (href === "index.html" && file === ""))) {
      a.setAttribute("aria-current", "page");
    }
  });
}

/* ---------------------------------------------------------
   Появление блоков при прокрутке
   --------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------
   Toast
   --------------------------------------------------------- */
let toastTimer;
function toast(text) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* пробуем запасной способ */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

/* ---------------------------------------------------------
   VIN тизер на главной: уводит на vin.html?vin=...
   --------------------------------------------------------- */
function initVinTeaser() {
  document.querySelectorAll("form[data-vin-teaser]").forEach((form) => {
    const input = form.querySelector("input");
    const counter = form.querySelector("[data-vin-counter]");
    const update = () => {
      const clean = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17);
      if (input.value !== clean) input.value = clean;
      if (counter) counter.textContent = `${clean.length} / 17`;
    };
    input.addEventListener("input", update);
    update();
    form.querySelectorAll("[data-sample]").forEach((chip) => {
      chip.addEventListener("click", () => { input.value = chip.dataset.sample; update(); input.focus(); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const vin = input.value.trim();
      location.href = vin ? `vin.html?vin=${encodeURIComponent(vin)}` : "vin.html";
    });
  });
}

/* ---------------------------------------------------------
   Форма записи
   --------------------------------------------------------- */
function initBooking() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const params = new URLSearchParams(location.search);
  const carParam = params.get("car");
  const serviceParam = params.get("service");
  const carInput = form.elements.car;
  const serviceSelect = form.elements.service;

  if (carParam && carInput) {
    carInput.value = carParam.slice(0, 120);
    const note = form.querySelector("[data-car-note]");
    if (note) note.hidden = false;
  }
  if (serviceParam && serviceSelect) {
    const match = Array.from(serviceSelect.options).find((o) => o.value === serviceParam || o.text === serviceParam);
    if (match) serviceSelect.value = match.value;
    else {
      const opt = new Option(serviceParam.slice(0, 80), serviceParam.slice(0, 80), true, true);
      serviceSelect.add(opt, 1);
    }
  }
  if ((carParam || serviceParam) && location.hash === "#booking") {
    const target = document.getElementById("booking");
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "auto", block: "start" }), 60);
  }

  // Дата не раньше сегодняшней
  const dateInput = form.elements.date;
  if (dateInput) {
    const d = new Date();
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = iso;
  }

  const submitBtn = form.querySelector("[type=submit]");
  const submitLabel = submitBtn ? submitBtn.querySelector("[data-submit-label]") : null;
  const status = form.querySelector(".form-status");

  const channelValue = () => {
    const c = form.querySelector("input[name=channel]:checked");
    return c ? c.value : "";
  };
  const syncSubmit = () => {
    if (!submitLabel) return;
    const ch = channelValue();
    submitLabel.textContent = ch === "telegram" ? t("form.sendTg") : ch === "whatsapp" ? t("form.sendWa") : ch === "call" ? t("form.sendCall") : t("form.send");
    const phoneBox = fieldBox("phone");
    if (phoneBox) phoneBox.hidden = ch !== "call";
  };
  form.querySelectorAll("input[name=channel]").forEach((r) => r.addEventListener("change", () => { syncSubmit(); clearError("channel"); status.className = "form-status"; }));
  document.addEventListener("langchange", syncSubmit);
  syncSubmit();

  function fieldBox(name) {
    return form.querySelector(`[data-field="${name}"]`);
  }
  function setError(name, msgKey) {
    const box = fieldBox(name);
    if (!box) return;
    box.classList.add("has-error");
    const err = box.querySelector(".field-error");
    if (err) err.textContent = t(msgKey);
    box.querySelectorAll("input, select, textarea").forEach((i) => i.setAttribute("aria-invalid", "true"));
  }
  function clearError(name) {
    const box = fieldBox(name);
    if (!box) return;
    box.classList.remove("has-error");
    box.querySelectorAll("[aria-invalid]").forEach((i) => i.removeAttribute("aria-invalid"));
  }
  ["name", "car", "phone"].forEach((n) => {
    const el = form.elements[n];
    if (el) el.addEventListener("input", () => { if (el.value.trim()) clearError(n); });
  });

  function showStatus(type, html) {
    status.className = `form-status form-status--${type} is-visible`;
    status.innerHTML = html;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function buildMessage(data) {
    const lines = [t(data.channel === "call" ? "form.msg.helloCall" : "form.msg.hello"), ""];
    lines.push(`${t("form.msg.name")}: ${data.name}`);
    if (data.channel === "call") lines.push(`${t("form.msg.phone")}: ${data.phone}`);
    lines.push(`${t("form.msg.car")}: ${data.car}`);
    if (data.service) lines.push(`${t("form.msg.service")}: ${data.service}`);
    const when = [data.date ? formatDate(data.date) : "", data.time].filter(Boolean).join(", ");
    if (when) lines.push(`${t("form.msg.when")}: ${when}`);
    if (data.comment) lines.push(`${t("form.msg.comment")}: ${data.comment}`);
    return lines.join("\n");
  }
  function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
  }

  async function sendCallback(data) {
    const res = await fetch(CONFIG.callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, website: form.elements.website.value }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`callback ${res.status}`);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: form.elements.name.value.trim(),
      car: form.elements.car.value.trim(),
      service: serviceSelect && serviceSelect.value ? serviceSelect.options[serviceSelect.selectedIndex].text : "",
      date: dateInput ? dateInput.value : "",
      time: form.elements.time ? form.elements.time.value : "",
      comment: form.elements.comment ? form.elements.comment.value.trim() : "",
      channel: channelValue(),
      phone: form.elements.phone.value.trim()
    };

    let ok = true;
    if (!data.name) { setError("name", "form.err.name"); ok = false; } else clearError("name");
    if (!data.car) { setError("car", "form.err.car"); ok = false; } else clearError("car");
    if (!data.channel) { setError("channel", "form.err.channel"); ok = false; } else clearError("channel");
    const phoneDigits = data.phone.replace(/\D/g, "").length;
    if (data.channel === "call" && !data.phone) { setError("phone", "form.err.phone"); ok = false; }
    else if (data.channel === "call" && (/[^\d\s()+-]/.test(data.phone) || phoneDigits < 7 || phoneDigits > 15)) { setError("phone", "form.err.phoneBad"); ok = false; }
    else clearError("phone");
    if (!ok) {
      showStatus("err", esc(t("form.err.top")));
      const firstBad = form.querySelector(".has-error input, .has-error select");
      if (firstBad) firstBad.focus();
      return;
    }

    const text = buildMessage(data);
    if (submitBtn) submitBtn.disabled = true;

    if (data.channel === "call" && CONFIG.callbackUrl) {
      try {
        await sendCallback(data);
        form.reset();
        syncSubmit();
        showStatus("ok", `<strong>${esc(t("form.ok.callSent"))}</strong>`);
      } catch {
        // После await браузер заблокирует window.open, поэтому даём обычные ссылки.
        const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
        showStatus("err", `${esc(t("form.err.callFail"))} <a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a>, <a href="${esc(LINKS.phone())}">${esc(CONFIG.phone)}</a>`);
      }
    } else if (data.channel === "whatsapp" || data.channel === "call") {
      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      showStatus("ok", `<strong>${esc(t(data.channel === "call" ? "form.ok.call" : "form.ok.wa"))}</strong><br><a href="${esc(url)}" target="_blank" rel="noopener">${esc(t("form.openWa"))}</a><pre>${esc(text)}</pre>`);
    } else {
      const copied = await copyText(text);
      window.open(LINKS.telegram(), "_blank", "noopener");
      showStatus("ok", `<strong>${esc(copied ? t("form.ok.tg") : t("form.ok.tgNoCopy"))}</strong><br><a href="${esc(LINKS.telegram())}" target="_blank" rel="noopener">${esc(t("form.openTg"))}</a><pre>${esc(text)}</pre>`);
      if (copied) toast(t("toast.copied"));
    }
    setTimeout(() => { if (submitBtn) submitBtn.disabled = false; }, 1200);
  });
}

/* ---------------------------------------------------------
   Карта Яндекса: грузим только когда блок рядом.
   Ошибку внутри iframe страница не видит, поэтому сначала
   проверяем адрес запросом. Не ответил: остаётся заглушка.
   --------------------------------------------------------- */
function initMap() {
  const box = document.querySelector("[data-map]");
  if (!box) return;
  const load = () => {
    const url = `https://yandex.ru/map-widget/v1/?oid=${CONFIG.yandexOid}&ol=biz&z=16`;
    fetch(url, { mode: "no-cors", credentials: "omit", signal: AbortSignal.timeout(6000) }).then(() => {
      const f = document.createElement("iframe");
      f.src = url;
      f.title = "4 Drive Service на Яндекс Картах";
      f.setAttribute("allowfullscreen", "");
      box.prepend(f);
      box.classList.add("is-loaded");
    }).catch(() => {});
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => {
      if (en.some((x) => x.isIntersecting)) { load(); io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe(box);
  } else load();
}

/* ---------------------------------------------------------
   Прайс: фильтр и поиск (services.html)
   --------------------------------------------------------- */
function initPriceFilter() {
  const root = document.querySelector("[data-price]");
  if (!root) return;
  const buttons = root.querySelectorAll(".filter-btn");
  const cats = root.querySelectorAll(".price-cat");
  const search = root.querySelector("[data-price-search]");
  const empty = root.querySelector(".price-empty");
  let active = "all";

  // счётчики
  buttons.forEach((b) => {
    const c = b.dataset.filter;
    const n = c === "all" ? root.querySelectorAll(".price-table tbody tr").length
      : root.querySelectorAll(`.price-cat[data-cat="${c}"] tbody tr`).length;
    const span = b.querySelector(".count");
    if (span) span.textContent = n;
  });

  const apply = () => {
    const q = search ? search.value.trim().toLowerCase() : "";
    let shown = 0;
    cats.forEach((cat) => {
      const catOk = active === "all" || cat.dataset.cat === active;
      let rows = 0;
      cat.querySelectorAll("tbody tr").forEach((tr) => {
        const hit = !q || tr.textContent.toLowerCase().includes(q);
        tr.hidden = !(catOk && hit);
        if (!tr.hidden) rows++;
      });
      cat.hidden = rows === 0;
      shown += rows;
    });
    if (empty) empty.hidden = shown > 0;
  };

  buttons.forEach((b) => b.addEventListener("click", () => {
    active = b.dataset.filter;
    buttons.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    apply();
  }));
  if (search) search.addEventListener("input", apply);
  const reset = root.querySelector("[data-price-reset]");
  if (reset) reset.addEventListener("click", () => {
    active = "all";
    if (search) search.value = "";
    buttons.forEach((x) => x.setAttribute("aria-pressed", x.dataset.filter === "all" ? "true" : "false"));
    apply();
  });

  const hashCat = location.hash.replace("#", "");
  const fromHash = Array.from(buttons).find((b) => b.dataset.filter === hashCat);
  if (fromHash) fromHash.click();
}

/* ---------------------------------------------------------
   Гайд: чеклист в дорогу и подсветка навигации
   --------------------------------------------------------- */
function initChecklist() {
  const list = document.querySelector("[data-checklist]");
  if (!list) return;
  const KEY = "4drive_trip_checklist";
  const boxes = Array.from(list.querySelectorAll("input[type=checkbox]"));
  const num = document.querySelector("[data-progress-num]");
  const bar = document.querySelector("[data-progress-bar]");
  const msg = document.querySelector("[data-progress-msg]");

  let saved = [];
  try { saved = JSON.parse(safeGet(KEY) || "[]"); } catch (e) { saved = []; }
  boxes.forEach((b) => { if (saved.includes(b.value)) b.checked = true; });

  const update = () => {
    const done = boxes.filter((b) => b.checked).length;
    const total = boxes.length;
    if (num) num.textContent = `${done}/${total}`;
    if (bar) bar.style.width = `${Math.round((done / total) * 100)}%`;
    if (msg) {
      msg.textContent = done === 0 ? "Начните с масла и шин, это займёт пять минут."
        : done < total / 2 ? "Продолжайте проверку."
        : done < total ? "Осталось немного."
        : "Всё проверено. Хорошей дороги.";
    }
    safeSet(KEY, JSON.stringify(boxes.filter((b) => b.checked).map((b) => b.value)));
  };
  boxes.forEach((b) => b.addEventListener("change", update));
  const reset = document.querySelector("[data-checklist-reset]");
  if (reset) reset.addEventListener("click", () => { boxes.forEach((b) => (b.checked = false)); update(); });
  update();
}

function initGuideNav() {
  const nav = document.querySelector(".guide-nav");
  if (!nav || !("IntersectionObserver" in window)) return;
  const links = Array.from(nav.querySelectorAll("a[href^='#']"));
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        const a = map.get(en.target.id);
        if (a) a.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------------------------------------------------------
   Старт
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initConfigLinks();
  initLang();
  initHeader();
  initReveal();
  initVinTeaser();
  initBooking();
  initMap();
  initPriceFilter();
  initChecklist();
  initGuideNav();
});

window.FOURDRIVE = { CONFIG, t, toast, copyText };
