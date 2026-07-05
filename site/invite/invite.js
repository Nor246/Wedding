/* ============================================================
   The Long Way Home — personal invitation page
   Token lookup · open tracking · RSVP · trilingual (EN/RU/HY)
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG — the only two values to wire up.
     SCRIPT_URL: the Apps Script Web-App URL (ends in /exec) from
                 tools/apps-script/SETUP.md step 4.
     VIDEO_ID:   the YouTube id of the unlisted invitation video
                 (the part after watch?v=).
     While SCRIPT_URL is empty the page runs in DEMO mode: a sample
     guest is shown and nothing is saved anywhere.
     ------------------------------------------------------------------ */
  var CONFIG = {
    SCRIPT_URL: "",
    VIDEO_ID: ""
  };

  document.documentElement.classList.add("js");

  /* ---- Elements & state (declared before i18n: setLang touches these) ---- */
  var $ = function (id) { return document.getElementById(id); };
  var partyEl = $("party-name");
  var secError = $("sec-error"), errTitle = $("err-title"), errSub = $("err-sub"), btnRetry = $("btn-retry");
  var secVideo = $("sec-video"), vidbox = $("vidbox"), vidPlaceholder = $("vid-placeholder");
  var secRsvp = $("sec-rsvp"), form = $("rsvp-form"), respondedBanner = $("responded-banner");
  var cardYes = $("card-yes"), cardNo = $("card-no");
  var rowCount = $("row-count"), fCount = $("f-count"), cntMinus = $("cnt-minus"), cntPlus = $("cnt-plus");
  var rowRestr = $("row-restr"), fRestr = $("f-restr");
  var rowArrival = $("row-arrival"), fArrival = $("f-arrival");
  var fMsg = $("f-msg");
  var btnSend = $("btn-send"), btnSendLabel = $("btn-send-label"), formStatus = $("form-status");
  var demoChip = $("demo-chip");

  var DEMO = !CONFIG.SCRIPT_URL;
  var token = "";
  try { token = (new URLSearchParams(location.search).get("g") || "").trim(); } catch (e) {}

  var guest = null;       // filled by the open call
  var maxCount = 8;
  var hasResponded = false;
  var lastStatus = null;  // {key,color} so language switches re-render it

  /* ---- i18n ---- */
  var SUPPORTED = ["en", "ru", "hy"];
  var STORAGE_KEY = "lwh-lang"; // shared with the main site
  var dict = {
    en: {
      "inv.eyebrow": "Together with our families",
      "inv.title": "You're invited",
      "inv.line": "We would be honoured to have you with us — above the Kasakh Gorge, where the road finally leads home.",
      "inv.date": "Sunday · 6 September 2026",
      "inv.venue": "Vagharshyan Garden · Saghmosavan, Armenia",
      "inv.videoEyebrow": "Before anything else",
      "inv.videoTitle": "A few words from us",
      "inv.videoSoon": "Our video greeting is on its way — check back soon.",
      "inv.rsvpEyebrow": "Kindly reply",
      "inv.rsvpTitle": "Will you join us?",
      "inv.yes": "Joyfully accept", "inv.yesSub": "We'll be there",
      "inv.no": "Regretfully decline", "inv.noSub": "Celebrating from afar",
      "inv.count": "How many of you will come?", "inv.countHint": "Including you",
      "inv.restr": "Food allergies or restrictions?", "inv.restrPh": "e.g. nuts, vegetarian, gluten-free…",
      "inv.arrival": "When do you arrive in Armenia?", "inv.arrivalHint": "For guests arriving from abroad",
      "inv.msg": "A note for us (optional)", "inv.msgPh": "Anything you'd like us to know",
      "inv.send": "Send answer", "inv.sending": "Sending…", "inv.update": "Update answer",
      "inv.thanksYes": "Wonderful — we can't wait to celebrate with you!",
      "inv.thanksNo": "We'll miss you dearly. Thank you for letting us know.",
      "inv.updateNote": "Plans changed? Reopen this link anytime and update your answer.",
      "inv.responded": "You've already replied — you can update your answer below.",
      "inv.needAttend": "Please choose an answer above.",
      "inv.sendErr": "Couldn't send — please try again, or message the hosts below.",
      "inv.loadErr": "We couldn't load your invitation right now.",
      "inv.loadErrSub": "Please try again in a moment — or message the hosts below, they'll help.",
      "inv.retry": "Try again",
      "inv.badLink": "This link seems incomplete.",
      "inv.badLinkSub": "Please open the exact link you received, or message the hosts below — they'll sort it out.",
      "con.eyebrow": "Questions?", "con.title": "Your hosts",
      "con.intro": "For all guest questions — practical and organisational.",
      "con.n1": "Ksenia", "con.r1": "Guest coordinator",
      "con.n2": "Kristina", "con.r2": "Guest coordinator",
      "inv.full": "Schedule, map & all the details are on the main page",
      "inv.fullCta": "Open the wedding site"
    },
    ru: {
      "inv.eyebrow": "Вместе с нашими семьями",
      "inv.title": "Приглашаем вас",
      "inv.line": "Для нас будет честью видеть вас рядом — над ущельем Касах, где дорога наконец ведёт домой.",
      "inv.date": "Воскресенье · 6 сентября 2026",
      "inv.venue": "Сад Вагаршян · Сагмосаван, Армения",
      "inv.videoEyebrow": "Прежде всего",
      "inv.videoTitle": "Пара слов от нас",
      "inv.videoSoon": "Наше видеоприглашение уже в пути — загляните чуть позже.",
      "inv.rsvpEyebrow": "Просим ответить",
      "inv.rsvpTitle": "Будете ли вы с нами?",
      "inv.yes": "С радостью придём", "inv.yesSub": "Мы будем",
      "inv.no": "К сожалению, не сможем", "inv.noSub": "Будем праздновать издалека",
      "inv.count": "Сколько вас будет?", "inv.countHint": "Включая вас",
      "inv.restr": "Аллергии или ограничения в еде?", "inv.restrPh": "например: орехи, вегетарианство…",
      "inv.arrival": "Когда вы прилетаете в Армению?", "inv.arrivalHint": "Для гостей, приезжающих из-за границы",
      "inv.msg": "Пара слов для нас (по желанию)", "inv.msgPh": "Всё, что хотите нам сказать",
      "inv.send": "Отправить ответ", "inv.sending": "Отправляем…", "inv.update": "Обновить ответ",
      "inv.thanksYes": "Чудесно — с нетерпением ждём встречи!",
      "inv.thanksNo": "Нам будет вас не хватать. Спасибо, что сообщили.",
      "inv.updateNote": "Планы изменились? Откройте эту ссылку снова и обновите ответ.",
      "inv.responded": "Вы уже ответили — ниже можно обновить ответ.",
      "inv.needAttend": "Пожалуйста, выберите ответ выше.",
      "inv.sendErr": "Не получилось отправить — попробуйте ещё раз или напишите координаторам ниже.",
      "inv.loadErr": "Не получилось загрузить ваше приглашение.",
      "inv.loadErrSub": "Попробуйте ещё раз через минуту — или напишите координаторам ниже, они помогут.",
      "inv.retry": "Попробовать снова",
      "inv.badLink": "Похоже, ссылка неполная.",
      "inv.badLinkSub": "Откройте, пожалуйста, ссылку из сообщения целиком — или напишите координаторам ниже, они всё решат.",
      "con.eyebrow": "Вопросы?", "con.title": "Ваши координаторы",
      "con.intro": "По всем вопросам гостей — практическим и организационным.",
      "con.n1": "Ксения", "con.r1": "Координатор гостей",
      "con.n2": "Кристина", "con.r2": "Координатор гостей",
      "inv.full": "Программа, карта и все детали — на главной странице",
      "inv.fullCta": "Открыть сайт свадьбы"
    },
    hy: {
      "inv.eyebrow": "Մեր ընտանիքների հետ միասին",
      "inv.title": "Հրավիրում ենք ձեզ",
      "inv.line": "Պատիվ կլինի ձեզ մեր կողքին տեսնել՝ Քասախի կիրճի վրա, որտեղ ճանապարհը վերջապես տուն է տանում։",
      "inv.date": "Կիրակի · 6 սեպտեմբերի 2026",
      "inv.venue": "Վաղարշյան այգի · Սաղմոսավան, Հայաստան",
      "inv.videoEyebrow": "Ամենից առաջ",
      "inv.videoTitle": "Մի քանի խոսք մեզնից",
      "inv.videoSoon": "Մեր տեսաուղերձը շուտով կլինի այստեղ — այցելեք մի փոքր ուշ։",
      "inv.rsvpEyebrow": "Խնդրում ենք պատասխանել",
      "inv.rsvpTitle": "Կմիանա՞ք մեզ",
      "inv.yes": "Սիրով կգանք", "inv.yesSub": "Մենք կլինենք",
      "inv.no": "Ցավոք, չենք կարող", "inv.noSub": "Կնշենք հեռվից",
      "inv.count": "Քանի՞ հոգով կգաք", "inv.countHint": "Ներառյալ ձեզ",
      "inv.restr": "Սննդային ալերգիա կամ սահմանափակումնե՞ր", "inv.restrPh": "օր.՝ ընկույզ, բուսակերություն…",
      "inv.arrival": "Ե՞րբ եք ժամանում Հայաստան", "inv.arrivalHint": "Արտասահմանից ժամանող հյուրերի համար",
      "inv.msg": "Խոսք մեզ համար (ըստ ցանկության)", "inv.msgPh": "Այն, ինչ կուզենայիք ասել մեզ",
      "inv.send": "Ուղարկել պատասխանը", "inv.sending": "Ուղարկվում է…", "inv.update": "Թարմացնել պատասխանը",
      "inv.thanksYes": "Հրաշալի է — անհամբեր սպասում ենք ձեզ։",
      "inv.thanksNo": "Դուք շատ կպակասեք մեզ։ Շնորհակալ ենք, որ տեղեկացրիք։",
      "inv.updateNote": "Պլանները փոխվե՞լ են։ Ցանկացած պահի նորից բացեք հղումը և թարմացրեք պատասխանը։",
      "inv.responded": "Դուք արդեն պատասխանել եք — ստորև կարող եք թարմացնել պատասխանը։",
      "inv.needAttend": "Խնդրում ենք ընտրել պատասխանը վերևում։",
      "inv.sendErr": "Չհաջողվեց ուղարկել — փորձեք կրկին կամ գրեք համակարգողներին։",
      "inv.loadErr": "Չհաջողվեց բեռնել ձեր հրավերը։",
      "inv.loadErrSub": "Փորձեք մի փոքր ուշ — կամ գրեք համակարգողներին ներքևում, նրանք կօգնեն։",
      "inv.retry": "Փորձել կրկին",
      "inv.badLink": "Հղումը կարծես թերի է։",
      "inv.badLinkSub": "Խնդրում ենք բացել ստացած հղումն ամբողջությամբ կամ գրել համակարգողներին ներքևում։",
      "con.eyebrow": "Հարցե՞ր ունեք", "con.title": "Ձեր համակարգողները",
      "con.intro": "Հյուրերի բոլոր հարցերով՝ գործնական և կազմակերպչական։",
      "con.n1": "Քսենիա", "con.r1": "Հյուրերի համակարգող",
      "con.n2": "Կրիստինա", "con.r2": "Հյուրերի համակարգող",
      "inv.full": "Ծրագիրը, քարտեզը և բոլոր մանրամասները՝ գլխավոր էջում",
      "inv.fullCta": "Բացել կայքը"
    }
  };

  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var phEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-ph]"));
  var langBtns = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));
  var lang = "en";

  function t(key) { return (dict[lang] && dict[lang][key]) || dict.en[key] || ""; }

  function setLang(next, persist) {
    if (SUPPORTED.indexOf(next) < 0) next = "en";
    lang = next;
    var table = dict[lang] || dict.en;
    i18nEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (table[key] != null) el.textContent = table[key];
    });
    phEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (table[key] != null) el.setAttribute("placeholder", table[key]);
    });
    langBtns.forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.style.color = active ? "var(--ink)" : "var(--ink-soft)";
      btn.style.borderBottomColor = active ? "var(--accent)" : "transparent";
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try { document.documentElement.lang = lang; } catch (e) {}
    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
    // Live text that isn't static-keyed:
    if (lastStatus) setStatus(lastStatus);
    syncSendLabel();
  }

  function storedLang() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(s) >= 0 ? s : null;
    } catch (e) { return null; }
  }

  function browserLang() {
    var prefs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var c = String(prefs[i]).toLowerCase().slice(0, 2);
      if (SUPPORTED.indexOf(c) >= 0) return c;
    }
    return null;
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang"), true); });
  });
  setLang(storedLang() || browserLang() || "en", false);

  /* ---- Scroll reveals (same mechanism as the main page) ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  function reveal(el) {
    if (!el || el.dataset.shown) return;
    el.dataset.shown = "1";
    el.style.setProperty("--reveal-delay", (parseInt(el.getAttribute("data-delay") || "0", 10)) + "ms");
    el.classList.add("revealed");
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(reveal); }
  setTimeout(function () { revealEls.forEach(reveal); }, 3500);

  /* ---- Video ---- */
  function initVideo() {
    if (!CONFIG.VIDEO_ID) return; // placeholder stays
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(CONFIG.VIDEO_ID) + "?rel=0&modestbranding=1";
    iframe.title = "Invitation video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    vidPlaceholder.hidden = true;
    vidbox.appendChild(iframe);
  }

  /* ---- Status line under the submit button ---- */
  function setStatus(s) {
    lastStatus = s;
    formStatus.textContent = s ? t(s.key) : "";
    formStatus.style.color = s && s.color ? s.color : "var(--ink-soft)";
  }

  function syncSendLabel() {
    btnSendLabel.textContent = btnSend.disabled ? t("inv.sending") : t(hasResponded ? "inv.update" : "inv.send");
  }

  /* ---- Attending cards ---- */
  function attendingValue() {
    var r = form.querySelector('input[name="attending"]:checked');
    return r ? r.value : "";
  }
  function syncAttendUi() {
    var v = attendingValue();
    cardYes.classList.toggle("sel", v === "yes");
    cardNo.classList.toggle("sel", v === "no");
    var yes = v === "yes";
    rowCount.hidden = !yes;
    rowRestr.hidden = !yes;
    rowArrival.hidden = !(yes && guest && guest.abroad);
  }
  Array.prototype.forEach.call(form.querySelectorAll('input[name="attending"]'), function (r) {
    r.addEventListener("change", function () { setStatus(null); syncAttendUi(); });
  });

  /* ---- Count stepper ---- */
  function setCount(n) {
    n = Math.max(1, Math.min(maxCount, n));
    fCount.value = String(n);
  }
  cntMinus.addEventListener("click", function () { setCount(parseInt(fCount.value, 10) - 1); });
  cntPlus.addEventListener("click", function () { setCount(parseInt(fCount.value, 10) + 1); });

  /* ---- Backend calls ----
     POST as text/plain = a CORS "simple request": Apps Script can't answer
     preflights, but this pattern needs none and the response is readable. */
  function api(payload) {
    if (DEMO) return demoApi(payload);
    return fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    });
  }

  function demoApi(payload) {
    demoChip.hidden = false;
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (payload.action === "open") {
          resolve({ ok: token !== "badtoken", guest: { party_name: "Anna & Sergey", lang: "en", abroad: true, invited_count: 3, rsvp: null } });
        } else resolve({ ok: true });
      }, 700);
    });
  }

  /** Best-effort IP + city for open tracking; adblock-safe, 2s cap. */
  function getIpInfo() {
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 2000);
    return fetch("https://ipapi.co/json/", ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        return { ip: j.ip || "", city: [j.city, j.country_name].filter(Boolean).join(", ") };
      })
      .catch(function () { return { ip: "", city: "" }; })
      .then(function (v) { if (timer) clearTimeout(timer); return v; });
  }

  /* ---- Page states ---- */
  function showBadLink(retriable) {
    secVideo.hidden = true;
    secRsvp.hidden = true;
    secError.hidden = false;
    partyEl.hidden = true;
    errTitle.setAttribute("data-i18n", retriable ? "inv.loadErr" : "inv.badLink");
    errSub.setAttribute("data-i18n", retriable ? "inv.loadErrSub" : "inv.badLinkSub");
    btnRetry.hidden = !retriable;
    i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
    setLang(lang, false);
  }

  function personalize(g) {
    guest = g;
    partyEl.textContent = g.party_name;
    maxCount = Math.max(1, Math.min(20, Number(g.invited_count) || 2));
    setCount(g.rsvp && g.rsvp.count ? g.rsvp.count : maxCount);
    // Guest's configured language wins unless they've explicitly chosen one before.
    if (!storedLang() && SUPPORTED.indexOf(g.lang) >= 0) setLang(g.lang, false);
    if (g.rsvp) {
      hasResponded = true;
      respondedBanner.hidden = false;
      var pick = g.rsvp.attending === "yes" ? cardYes : cardNo;
      pick.querySelector("input").checked = true;
      fRestr.value = g.rsvp.restrictions || "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(g.rsvp.arrival || "")) fArrival.value = g.rsvp.arrival;
      fMsg.value = g.rsvp.message || "";
    }
    syncAttendUi();
    syncSendLabel();
  }

  function load() {
    if (!token) { showBadLink(false); return; }
    secError.hidden = true;
    getIpInfo().then(function (info) {
      return api({
        action: "open", token: token,
        ip: info.ip, city: info.city,
        ua: (navigator.userAgent || "").slice(0, 200), lang: lang
      });
    }).then(function (res) {
      if (res && res.ok && res.guest) personalize(res.guest);
      else showBadLink(false);
    }).catch(function () {
      showBadLink(true);
    });
  }
  btnRetry.addEventListener("click", function () {
    secVideo.hidden = false;
    secRsvp.hidden = false;
    partyEl.hidden = false;
    load();
  });

  /* ---- Submit ---- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var attending = attendingValue();
    if (!attending) { setStatus({ key: "inv.needAttend", color: "var(--wine)" }); return; }
    btnSend.disabled = true;
    syncSendLabel();
    api({
      action: "rsvp", token: token,
      attending: attending,
      count: parseInt(fCount.value, 10) || 1,
      restrictions: attending === "yes" ? fRestr.value.trim() : "",
      arrival: attending === "yes" && guest && guest.abroad ? fArrival.value : "",
      message: fMsg.value.trim()
    }).then(function (res) {
      if (!res || !res.ok) throw new Error("save failed");
      hasResponded = true;
      respondedBanner.hidden = true;
      setStatus({ key: attending === "yes" ? "inv.thanksYes" : "inv.thanksNo", color: "var(--olive)" });
      setTimeout(function () {
        if (lastStatus && (lastStatus.key === "inv.thanksYes" || lastStatus.key === "inv.thanksNo")) {
          setStatus({ key: "inv.updateNote", color: "var(--ink-soft)" });
        }
      }, 6000);
    }).catch(function () {
      setStatus({ key: "inv.sendErr", color: "var(--wine)" });
    }).then(function () {
      btnSend.disabled = false;
      syncSendLabel();
    });
  });

  initVideo();
  load();
})();
