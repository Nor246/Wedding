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
      "dc.eyebrow":"Dress code","dc.title":"A garden palette",
      "dc.intro":"We gather in a garden above the gorge, in sunset and candlelight. Please dress in a calm, natural palette — and if you add a touch of bordeaux, we'll be delighted. It sets the mood of the evening, though it's never required.",
      "dc.paletteLabel":"Palette",
      "dc.sw2":"Champagne","dc.sw3":"Cream","dc.sw4":"Peach","dc.sw5":"Apricot","dc.sw6":"Powder beige","dc.sw7":"Dusty rose","dc.sw8":"Sand","dc.sw9":"Taupe","dc.sw10":"Olive","dc.sw11":"Bordeaux · accent",
      "dc.accent":"Build your look from the warm, pastel tones on the left. Bordeaux is our little wish — an optional accent, if you'd like to add it.",
      "dc.womenT":"For her","dc.womenLead":"A dress or suit in a neutral tone. Any cut — midi, maxi, or a jumpsuit.",
      "dc.womenLi1":"A bordeaux accent is welcome — earrings, a clutch, a slim belt, or a ribbon in your hair.",
      "dc.womenLi2":"A light shawl or wrap in bordeaux is lovely for the evening chill.",
      "dc.womenLi3":"Shoes without a thin stiletto — there's grass and gravel underfoot.",
      "dc.avoidLabel":"Best avoided:","dc.womenAvoid":"white and ivory (the bride's colours), neon, sporty casual.",
      "dc.menT":"For him","dc.menLead":"A light-toned suit — beige, sand, or grey-olive. A cream or white shirt.",
      "dc.menLi1":"A bordeaux accent is welcome — a tie, bow tie, or pocket square.",
      "dc.menLi2":"The jacket can come off for dancing — but do bring it; the evening turns cool.",
      "dc.avoidLabel2":"Best avoided:","dc.menAvoid":"an all-black suit (too formal for a garden), shorts, sneakers, jeans.",
      "dc.noteT":"Good to know",
      "dc.note1":"The ceremony and reception are outdoors, on grass and gravel paths. After sunset the mountains turn cool — bring a light extra layer.",
      "dc.note2":"Steady shoes are your friend — nothing with a sharp heel.",
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
      "dc.eyebrow":"Дресс-код","dc.title":"Палитра сада",
      "dc.intro":"Мы встречаем гостей в саду над ущельем, в свете заката и свечей. Просим одеться в спокойной природной палитре. А если добавите деталь цвета бордо — будем очень рады: это задаст общее настроение вечера, но, конечно, совсем не обязательно.",
      "dc.paletteLabel":"Палитра",
      "dc.sw2":"Шампань","dc.sw3":"Кремовый","dc.sw4":"Персиковый","dc.sw5":"Абрикос","dc.sw6":"Пудровый беж","dc.sw7":"Пыльная роза","dc.sw8":"Песочный","dc.sw9":"Тауп","dc.sw10":"Олива","dc.sw11":"Бордо · акцент",
      "dc.accent":"Основа наряда — из тёплых и пастельных тонов слева. Бордо — наше маленькое пожелание, необязательный акцент, если захотите его добавить.",
      "dc.womenT":"Женщинам","dc.womenLead":"Платье или костюм в нейтральном тоне. Любой фасон: миди, макси, комбинезон.",
      "dc.womenLi1":"Если хочется добавить акцент бордо — будем рады: серьги, клатч, тонкий пояс, лента в причёске.",
      "dc.womenLi2":"Лёгкая шаль или палантин бордового тона — пригодится и вечером, когда похолодает.",
      "dc.womenLi3":"Обувь — без тонкой шпильки: газон и грунтовые дорожки.",
      "dc.avoidLabel":"Не стоит:","dc.womenAvoid":"белый и айвори (цвет невесты), неон, спортивный кэжуал.",
      "dc.menT":"Мужчинам","dc.menLead":"Костюм светлых тонов — бежевый, песочный, серо-оливковый. Рубашка кремовая или белая.",
      "dc.menLi1":"Если хочется добавить акцент бордо — будем рады: галстук, бабочка или платок в нагрудный карман.",
      "dc.menLi2":"Пиджак можно снять к танцам — но взять с собой, вечером свежо.",
      "dc.avoidLabel2":"Не стоит:","dc.menAvoid":"чёрный костюм целиком (слишком строго для сада), шорты, кроссовки, джинсы.",
      "dc.noteT":"На заметку",
      "dc.note1":"Церемония и приём — на открытом воздухе, на траве и гравийных дорожках. После заката в горах становится прохладно — возьмите с собой лёгкий верхний слой.",
      "dc.note2":"Обувь — устойчивая: без острого каблука.",
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
      "dc.eyebrow":"Դրես-կոդ","dc.title":"Այգու գունապնակ",
      "dc.intro":"Հյուրերին դիմավորում ենք կիրճի վրայի այգում՝ մայրամուտի և մոմերի լույսի ներքո։ Խնդրում ենք հագնվել հանգիստ, բնական երանգներով։ Իսկ եթե ավելացնեք բորդո գույնի դետալ՝ շատ կուրախանանք. դա կստեղծի երեկոյի ընդհանուր տրամադրությունը, բայց, իհարկե, պարտադիր չէ։",
      "dc.paletteLabel":"Գունապնակ",
      "dc.sw2":"Շամպայն","dc.sw3":"Կրեմ","dc.sw4":"Դեղձի","dc.sw5":"Ծիրանի","dc.sw6":"Փոշոտ բեժ","dc.sw7":"Փոշոտ վարդագույն","dc.sw8":"Ավազի","dc.sw9":"Տաուպ","dc.sw10":"Ձիթապտղի","dc.sw11":"Բորդո · շեշտ",
      "dc.accent":"Հանդերձանքի հիմքը՝ ձախ կողմի տաք ու պաստելային երանգներից։ Բորդոն մեր փոքրիկ ցանկությունն է՝ ոչ պարտադիր շեշտ, եթե ցանկանաք ավելացնել։",
      "dc.womenT":"Կանանց","dc.womenLead":"Զգեստ կամ կոստյում չեզոք երանգով։ Ցանկացած ֆասոն՝ միդի, մաքսի, կոմբինեզոն։",
      "dc.womenLi1":"Եթե ուզում եք ավելացնել բորդո շեշտ՝ կուրախանանք. ականջօղեր, քլաթչ, բարակ գոտի, ժապավեն մազերին։",
      "dc.womenLi2":"Բորդո երանգի թեթև շալ կամ փալանտին՝ կպահանջվի նաև երեկոյան, երբ ցրտի։",
      "dc.womenLi3":"Կոշիկ՝ առանց բարակ կրունկի. մարգագետին և գրունտային արահետներ։",
      "dc.avoidLabel":"Խորհուրդ չենք տալիս՝","dc.womenAvoid":"սպիտակ և այվորի (հարսի գույնը), նեոն, սպորտային կեժուալ։",
      "dc.menT":"Տղամարդկանց","dc.menLead":"Բաց երանգների կոստյում՝ բեժ, ավազագույն, մոխրա-ձիթապտղային։ Վերնաշապիկ՝ կրեմ կամ սպիտակ։",
      "dc.menLi1":"Եթե ուզում եք ավելացնել բորդո շեշտ՝ կուրախանանք. փողկապ, թիթեռ կամ թաշկինակ կրծքի գրպանում։",
      "dc.menLi2":"Բաճկոնը կարելի է հանել պարերի համար՝ բայց վերցրեք ձեզ հետ, երեկոյան զով է։",
      "dc.avoidLabel2":"Խորհուրդ չենք տալիս՝","dc.menAvoid":"ամբողջովին սև կոստյում (այգու համար չափազանց խիստ է), շորտեր, սպորտային կոշիկներ, ջինսեր։",
      "dc.noteT":"Հիշեցում",
      "dc.note1":"Արարողությունը և ընդունելությունը՝ բացօթյա, խոտի և խճաքարային արահետների վրա։ Մայրամուտից հետո լեռներում զովանում է՝ վերցրեք թեթև վերնահագուստ։",
      "dc.note2":"Կոշիկը՝ կայուն. առանց սուր կրունկի։",
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

  var SUPPORTED = ["en", "ru", "hy"];
  var STORAGE_KEY = "lwh-lang";
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var langBtns = Array.prototype.slice.call(document.querySelectorAll("[data-lang]"));

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) < 0) lang = "en";
    var table = dict[lang] || dict.en;
    i18nEls.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (table[key] != null) el.textContent = table[key];
    });
    langBtns.forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.style.color = active ? "var(--ink)" : "var(--ink-soft)";
      btn.style.borderBottomColor = active ? "var(--accent)" : "transparent";
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try { document.documentElement.lang = lang; } catch (e) {}
    if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang"), true); });
  });

  // Initial language: a previously chosen one wins; otherwise match the
  // visitor's browser languages (ru / hy / en); otherwise fall back to English.
  // An auto-detected choice isn't persisted, so it keeps tracking the browser
  // until the guest explicitly picks one.
  function detectLang() {
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored && SUPPORTED.indexOf(stored) >= 0) return { lang: stored, persist: true };
    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).toLowerCase().slice(0, 2);
      if (SUPPORTED.indexOf(code) >= 0) return { lang: code, persist: false };
    }
    return { lang: "en", persist: false };
  }
  var initial = detectLang();
  setLang(initial.lang, initial.persist);

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
