/* ============================================================
   The Long Way Home — site behaviour
   Countdown · trilingual switcher (EN/RU/HY) · scroll reveals · parallax
   Ported from the original Claude Design prototype to plain DOM.
   ============================================================ */
(function () {
  "use strict";

  // Mark JS as available so CSS can hide [data-reveal] elements until shown.
  document.documentElement.classList.add("js");

  /* ---- Countdown ---- */
  var target = new Date("2026-09-06T16:30:00+04:00").getTime();
  var refs = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs")
  };
  function pad(n) { return String(n).padStart(2, "0"); }
  function updateCountdown() {
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff / 86400000); diff -= d * 86400000;
    var h = Math.floor(diff / 3600000); diff -= h * 3600000;
    var m = Math.floor(diff / 60000); diff -= m * 60000;
    var s = Math.floor(diff / 1000);
    if (refs.d) refs.d.textContent = pad(d);
    if (refs.h) refs.h.textContent = pad(h);
    if (refs.m) refs.m.textContent = pad(m);
    if (refs.s) refs.s.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---- Trilingual content ---- */
  var dict = {
    en: {
      "hero.eyebrow":"Together with our families","hero.n1":"Ekaterina","hero.n2":"Norayr","hero.tagline":"The Long Way Home",
      "hero.date":"Sunday · 6 September 2026","hero.venue":"Vagharshyan Garden · Saghmosavan, Armenia",
      "hero.line":"Above the Kasakh Gorge, where the road finally leads home.","hero.until":"Until we gather","hero.scroll":"Scroll",
      "cd.days":"Days","cd.hours":"Hours","cd.minutes":"Minutes","cd.seconds":"Seconds",
      "ess.eyebrow":"Event essentials","ess.title":"The essentials",
      "ess.dateLabel":"Date","ess.dateVal":"Sunday, 6 September 2026","ess.dateSub":"Ceremony at 17:15",
      "ess.venueLabel":"Venue","ess.venueVal":"Vagharshyan Garden","ess.venueSub":"Saghmosavan, Armenia",
      "ess.setLabel":"Setting","ess.setVal":"An outdoor garden above the Kasakh Gorge","ess.setSub":"Views toward Saghmosavank monastery and Mt. Aragats",
      "ess.travLabel":"From Yerevan","ess.travVal":"About 40 minutes by car","ess.travSub":"Taxis recommended for arrival",
      "tl.eyebrow":"The day","tl.title":"How the evening unfolds",
      "tl.h1":"Guest arrival","tl.d1":"Welcome drinks, food, lounge seating, and time to settle in.",
      "tl.h2":"Bride & groom arrival",
      "tl.h3":"Ceremony","tl.d3":"In Armenian, Russian, and English.",
      "tl.h4":"Dinner, drinks & dancing","tl.d4":"The party begins.",
      "tl.h5":"First Sprinter home","tl.d5":"First return coach to Yerevan.",
      "tl.h6":"The long way home","tl.d6":"Final Sprinter to Yerevan.",
      "exp.eyebrow":"The celebration","exp.title":"What to expect",
      "exp.t1":"Garden & lounges","exp.d1":"Outdoor garden celebration with lounge areas and quieter corners.",
      "exp.t2":"Food & traditions","exp.d2":"Armenian and Russian food, drinks, music, and traditions.",
      "exp.t6":"Lawn games","exp.d6":"Relaxed games and quiet corners around the garden.",
      "exp.t7":"Trilingual ceremony","exp.d7":"Ceremony elements in Armenian, Russian, and English.",
      "exp.t8":"Candlelight & stars","exp.d8":"Dinner, dancing, candlelit gorge views, and stargazing.",
      "trv.eyebrow":"Getting there & back","trv.title":"The journey",
      "trv.thereT":"Arrive by taxi","trv.thereD":"Guests can arrive by taxi — about 40 minutes from Yerevan.",
      "trv.backT":"Sprinters home","trv.backD":"Sprinters return to Yerevan at 23:00 and 00:00.",
      "trv.remT":"A friendly reminder","trv.remD":"Please don't drink and drive. We have Sprinters for a reason — and they are much better at going home than you will be after the bar.",
      "trv.mapYerevan":"YEREVAN","trv.mapVenue":"THE GARDEN","trv.mapTime":"≈ 40 minutes","trv.directions":"Open directions",
      "con.eyebrow":"Questions?","con.title":"Your hosts","con.intro":"For all guest questions — practical and organisational.",
      "con.n1":"Ksenia","con.r1":"Guest coordinator","con.n2":"Kristina","con.r2":"Guest coordinator",
      "foot.tagline":"The Long Way Home","foot.place":"Vagharshyan Garden · Saghmosavan, Armenia","foot.closing":"We can't wait to welcome you home."
    },
    ru: {
      "hero.eyebrow":"Вместе с нашими семьями","hero.n1":"Екатерина","hero.n2":"Норайр","hero.tagline":"Долгая дорога домой",
      "hero.date":"Воскресенье · 6 сентября 2026","hero.venue":"Сад Вагаршян · Сагмосаван, Армения",
      "hero.line":"Над ущельем Касах, где дорога наконец ведёт домой.","hero.until":"До праздника","hero.scroll":"Листайте",
      "cd.days":"Дней","cd.hours":"Часов","cd.minutes":"Минут","cd.seconds":"Секунд",
      "ess.eyebrow":"Главное о дне","ess.title":"Коротко о главном",
      "ess.dateLabel":"Дата","ess.dateVal":"Воскресенье, 6 сентября 2026","ess.dateSub":"Церемония в 17:15",
      "ess.venueLabel":"Место","ess.venueVal":"Сад Вагаршян","ess.venueSub":"Сагмосаван, Армения",
      "ess.setLabel":"Атмосфера","ess.setVal":"Сад под открытым небом над ущельем Касах","ess.setSub":"С видом на монастырь Сагмосаванк и гору Арагац",
      "ess.travLabel":"Из Еревана","ess.travVal":"Около 40 минут на машине","ess.travSub":"Удобно добраться на такси",
      "tl.eyebrow":"День","tl.title":"Как пройдёт вечер",
      "tl.h1":"Сбор гостей","tl.d1":"Welcome-напитки, угощения, лаунж и время освоиться.",
      "tl.h2":"Приезд жениха и невесты",
      "tl.h3":"Церемония","tl.d3":"На армянском, русском и английском.",
      "tl.h4":"Ужин, напитки и танцы","tl.d4":"Начинается праздник.",
      "tl.h5":"Первый спринтер домой","tl.d5":"Первый трансфер в Ереван.",
      "tl.h6":"Долгая дорога домой","tl.d6":"Последний спринтер в Ереван.",
      "exp.eyebrow":"Праздник","exp.title":"Что вас ждёт",
      "exp.t1":"Сад и лаунж-зоны","exp.d1":"Праздник в саду с лаунж-зонами и тихими уголками.",
      "exp.t2":"Кухня и традиции","exp.d2":"Армянская и русская кухня, напитки, музыка и традиции.",
      "exp.t6":"Игры на лужайке","exp.d6":"Спокойные игры и тихие уголки в саду.",
      "exp.t7":"Церемония на трёх языках","exp.d7":"Элементы церемонии на армянском, русском и английском.",
      "exp.t8":"Свечи и звёзды","exp.d8":"Ужин, танцы, виды на ущелье при свечах и звёздное небо.",
      "trv.eyebrow":"Дорога туда и обратно","trv.title":"Путь",
      "trv.thereT":"Приезд на такси","trv.thereD":"Гости могут приехать на такси — около 40 минут от Еревана.",
      "trv.backT":"Спринтеры домой","trv.backD":"Спринтеры отвезут гостей в Ереван в 23:00 и 00:00.",
      "trv.remT":"Дружеское напоминание","trv.remD":"Пожалуйста, не садитесь за руль нетрезвыми. Для этого есть спринтеры — они доедут до дома гораздо лучше, чем вы после бара.",
      "trv.mapYerevan":"ЕРЕВАН","trv.mapVenue":"САД","trv.mapTime":"≈ 40 минут","trv.directions":"Построить маршрут",
      "con.eyebrow":"Вопросы?","con.title":"Ваши координаторы","con.intro":"По всем вопросам гостей — практическим и организационным.",
      "con.n1":"Ксения","con.r1":"Координатор гостей","con.n2":"Кристина","con.r2":"Координатор гостей",
      "foot.tagline":"Долгая дорога домой","foot.place":"Сад Вагаршян · Сагмосаван, Армения","foot.closing":"Будем рады встретить вас дома."
    },
    hy: {
      "hero.eyebrow":"Մեր ընտանիքների հետ միասին","hero.n1":"Եկատերինա","hero.n2":"Նորայր","hero.tagline":"Երկար ճանապարհը դեպի տուն",
      "hero.date":"Կիրակի · 6 սեպտեմբերի 2026","hero.venue":"Վաղարշյան այգի · Սաղմոսավան, Հայաստան",
      "hero.line":"Քասախի կիրճի վրա, որտեղ ճանապարհը վերջապես տուն է տանում։","hero.until":"Մինչև տոնը","hero.scroll":"Ոլորեք",
      "cd.days":"Օր","cd.hours":"Ժամ","cd.minutes":"Րոպե","cd.seconds":"Վայրկյան",
      "ess.eyebrow":"Հիմնական մանրամասներ","ess.title":"Կարևորը",
      "ess.dateLabel":"Ամսաթիվ","ess.dateVal":"Կիրակի, 6 սեպտեմբերի 2026","ess.dateSub":"Արարողությունը՝ 17:15",
      "ess.venueLabel":"Վայր","ess.venueVal":"Վաղարշյան այգի","ess.venueSub":"Սաղմոսավան, Հայաստան",
      "ess.setLabel":"Մթնոլորտ","ess.setVal":"Բացօթյա այգի Քասախի կիրճի վրա","ess.setSub":"Սաղմոսավանք վանքի և Արագած լեռան տեսարանով",
      "ess.travLabel":"Երևանից","ess.travVal":"Մոտ 40 րոպե մեքենայով","ess.travSub":"Հարմար է գալ տաքսիով",
      "tl.eyebrow":"Օրը","tl.title":"Ինչպես կանցնի երեկոն",
      "tl.h1":"Հյուրերի ժամանումը","tl.d1":"Ողջույնի խմիչքներ, հյուրասիրություն, լաունջ և ժամանակ՝ հարմարվելու։",
      "tl.h2":"Հարսի և փեսայի ժամանումը",
      "tl.h3":"Արարողություն","tl.d3":"Հայերեն, ռուսերեն և անգլերեն։",
      "tl.h4":"Ընթրիք, խմիչքներ և պարեր","tl.d4":"Տոնը սկսվում է։",
      "tl.h5":"Առաջին «Սպրինտերը» տուն","tl.d5":"Առաջին երթուղին դեպի Երևան։",
      "tl.h6":"Երկար ճանապարհը դեպի տուն","tl.d6":"Վերջին «Սպրինտերը» դեպի Երևան։",
      "exp.eyebrow":"Տոնը","exp.title":"Ի՞նչ է սպասվում",
      "exp.t1":"Այգի և լաունջ","exp.d1":"Բացօթյա տոնակատարություն այգում՝ լաունջ գոտիներով և հանգիստ անկյուններով։",
      "exp.t2":"Խոհանոց և ավանդույթներ","exp.d2":"Հայկական և ռուսական խոհանոց, խմիչքներ, երաժշտություն և ավանդույթներ։",
      "exp.t6":"Խաղեր մարգագետնում","exp.d6":"Հանգիստ խաղեր և անկյուններ այգու շուրջ։",
      "exp.t7":"Եռալեզու արարողություն","exp.d7":"Արարողության տարրեր՝ հայերեն, ռուսերեն և անգլերեն։",
      "exp.t8":"Մոմեր և աստղեր","exp.d8":"Ընթրիք, պարեր, կիրճի տեսարան մոմերի լույսին և աստղադիտում։",
      "trv.eyebrow":"Ճանապարհը այնտեղ և հետ","trv.title":"Ճանապարհը",
      "trv.thereT":"Ժամանում տաքսիով","trv.thereD":"Հյուրերը կարող են գալ տաքսիով՝ մոտ 40 րոպե Երևանից։",
      "trv.backT":"«Սպրինտերներ» տուն","trv.backD":"«Սպրինտերները» հյուրերին կվերադարձնեն Երևան՝ 23:00 և 00:00։",
      "trv.remT":"Բարեկամական հիշեցում","trv.remD":"Խնդրում ենք՝ մի՛ նստեք ղեկին հարբած։ Հենց դրա համար ունենք «Սպրինտերներ»՝ նրանք շատ ավելի լավ տուն կհասցնեն, քան դուք բարից հետո։",
      "trv.mapYerevan":"ԵՐԵՎԱՆ","trv.mapVenue":"ԱՅԳԻ","trv.mapTime":"≈ 40 րոպե","trv.directions":"Բացել երթուղին",
      "con.eyebrow":"Հարցե՞ր ունեք","con.title":"Ձեր համակարգողները","con.intro":"Հյուրերի բոլոր հարցերով՝ գործնական և կազմակերպչական։",
      "con.n1":"Քսենիա","con.r1":"Հյուրերի համակարգող","con.n2":"Կրիստինա","con.r2":"Հյուրերի համակարգող",
      "foot.tagline":"Երկար ճանապարհը դեպի տուն","foot.place":"Վաղարշյան այգի · Սաղմոսավան, Հայաստան","foot.closing":"Անհամբեր սպասում ենք ձեզ տանը դիմավորելու։"
    }
  };

  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var langBtns = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));

  function setLang(lang) {
    var table = dict[lang] || dict.en;
    i18nEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (table[key] != null) el.textContent = table[key];
    });
    langBtns.forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.style.color = active ? "var(--ink)" : "var(--ink-soft)";
      btn.style.borderBottomColor = active ? "var(--accent)" : "transparent";
    });
    try { document.documentElement.lang = lang; } catch (e) {}
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang")); });
  });
  setLang("en");

  /* ---- Scroll reveals ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  function reveal(el) {
    if (!el || el.dataset.shown) return;
    el.dataset.shown = "1";
    var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
    el.style.setProperty("--reveal-delay", delay + "ms");
    el.classList.add("revealed");
    // Timeline connector lines grow in just after the row appears.
    el.querySelectorAll("[data-line]").forEach(function (line) {
      line.style.animation = "growLine 1.1s ease " + (delay + 250) + "ms forwards";
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(reveal);
  }
  // Safety net — never leave content hidden.
  setTimeout(function () { revealEls.forEach(reveal); }, 3500);

  /* ---- Parallax ---- */
  var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset || 0;
      layers.forEach(function (l) {
        var sp = parseFloat(l.getAttribute("data-speed")) || 0.1;
        l.style.transform = "translate3d(0," + (y * sp) + "px,0)";
      });
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
