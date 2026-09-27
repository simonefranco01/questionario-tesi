/*
 * MOTORE DEL QUESTIONARIO
 * Schermate: welcome → privacy → domande (q) → sending → done
 *            (+ error se l'invio fallisce, already se ha già risposto)
 */
(function () {
  "use strict";

  var CFG = window.SURVEY_CONFIG || { formAction: "", entries: {} };
  var T = window.I18N;
  var SV = window.SURVEY;
  var Speech = window.Speech;
  var Submit = window.Submit;
  var Profiles = window.PROFILES;
  var doneProfile = null;
  var doneIdea = null;
  var doneNotes = [];

  var params = new URLSearchParams(location.search);
  var TEST = params.get("test") === "1";
  var CONFIGURED = /\/formResponse$/.test(CFG.formAction || "");
  var SIMULATE = TEST || !CONFIGURED;
  var STATE_KEY = TEST ? "qv:test:state" : "qv:state";
  var DONE_KEY = "qv:done";

  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return motionQuery.matches; }

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var stage = $("#stage");
  var nav = $("#nav");
  var btnBack = $("#back");
  var btnSkip = $("#skip");
  var btnNext = $("#next");
  var live = $("#live");
  var toastEl = $("#toast");
  var progress = $("#progress");
  var autoBtn = $("#autoread");
  var langGroup = $("#lang");
  var themeMeta = $('meta[name="theme-color"]');

  // ---------- Archiviazione (localStorage può essere bloccato: sempre try/catch) ----------
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  function fresh() {
    return { v: 1, lang: "it", answers: {}, current: null, startedAt: null, src: "", autoRead: false,
             consent: { privacy: false, age: false } };
  }

  var S = fresh();
  var screen = "welcome";
  var currentNode = null;
  var advanceTimer = null;
  var speakTimer = null;
  var saveTimer = null;
  var busyUntil = 0;
  var speechOk = Speech.supported;
  var lastPayload = null;

  var sealed = false; // dopo l'invio lo stato non va più salvato (altrimenti riapparirebbe "Riprendi")
  function save() { if (!sealed) store.set(STATE_KEY, S); }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); }

  // ---------- Testi ----------
  function tr(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[S.lang] != null ? obj[S.lang] : obj.it;
  }
  function ui(key, vars) {
    var s = tr(T.ui[key]);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function rich(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
  function introBlock(b) {
    if (b.h) return '<h2 class="intro-h">' + esc(tr(b.h)) + "</h2>";
    if (b.ol) return '<ol class="intro-list">' + b.ol.map(function (x) { return "<li>" + rich(tr(x)) + "</li>"; }).join("") + "</ol>";
    return "<p>" + rich(tr(b.p)) + "</p>";
  }
  function titleHtml(t) {
    var k = t.lastIndexOf(", ");
    if (k < 0) return esc(t);
    return esc(t.slice(0, k + 1)) + ' <span class="title-pill">' + esc(t.slice(k + 2)) + "</span>";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Evidenzia i segnaposto [NOME COGNOME] ecc. finché non vengono compilati
  function withPlaceholders(s) {
    return esc(s).replace(/\[[A-ZÀ-Ü' ]+\]/g, function (m) { return '<mark class="ph">' + m + "</mark>"; });
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // ---------- Icone ----------
  var I = {
    arrowR: '<svg class="ico arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    arrowL: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6"/></svg>',
    clock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    lock: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    stack: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M9 12h6"/></svg>',
    speaker: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    stop: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
    headphones: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="5" height="6" rx="2"/><rect x="16" y="14" width="5" height="6" rx="2"/></svg>',
    share: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    refresh: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/></svg>',
    download: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 19h14"/></svg>',
    check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>'
  };

  var glassId = 0;
  var GLASS_PATH = "M18 8 H102 L92 148 Q91 154 84 154 H36 Q29 154 28 148 Z";
  function glass(level, cls) {
    var id = "gl" + (++glassId);
    var y = 150 - level * 142;
    return '<svg class="glass ' + (cls || "") + '" viewBox="0 0 120 160" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><path d="' + GLASS_PATH + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')"><g class="liq-g" style="transform:translateY(' + y + 'px)">' +
      '<path class="liq wave" d="M-60 6 q15 -7 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V220 H-60 Z"/>' +
      '<circle class="bub b1" cx="40" cy="70" r="3"/><circle class="bub b2" cx="70" cy="90" r="2.2"/>' +
      '<circle class="bub b3" cx="58" cy="50" r="2.6"/><circle class="bub b4" cx="82" cy="60" r="1.8"/>' +
      "</g></g>" +
      '<path class="outline" d="' + GLASS_PATH + '"/></svg>';
  }
  function setGlassLevel(node, level) {
    var g = node && node.querySelector(".liq-g");
    if (g) g.style.transform = "translateY(" + (150 - level * 142) + "px)";
  }

  // ---------- Feedback ----------
  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }
  function announce(msg) {
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 30);
  }
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }
  function restartAnim(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  // ---------- Transizioni tra schermate ----------
  function swap(node, dir, opts) {
    opts = opts || {};
    var old = $$(".screen", stage);
    stage.appendChild(node);
    currentNode = node;
    busyUntil = performance.now() + 320;
    stage.scrollTop = 0;

    var animate = !opts.instant && typeof node.animate === "function";
    if (!animate) {
      old.forEach(function (o) { o.remove(); });
    } else if (reduced()) {
      old.forEach(function (o) { o.remove(); });
      node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: "linear" });
    } else {
      var d = dir || 1;
      old.forEach(function (o) {
        o.setAttribute("aria-hidden", "true");
        o.style.pointerEvents = "none";
        var a = o.animate(
          [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(" + (-18 * d) + "px)" }],
          { duration: 200, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
        a.onfinish = function () { o.remove(); };
      });
      var base = old.length ? 140 : 40;
      $$(".stagger", node).slice(0, 16).forEach(function (s, i) {
        s.animate(
          [{ opacity: 0, transform: "translateY(" + (22 * d) + "px)" }, { opacity: 1, transform: "none" }],
          { duration: 520, delay: base + i * 45, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      });
    }

    if (opts.focus !== false) {
      var target = node.querySelector("[data-autofocus]");
      if (target) { try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); } }
    }
  }

  function rerender() {
    var node = renderCurrent();
    if (!node) return;
    var active = document.activeElement;
    var wasField = active && active.classList && active.classList.contains("field");
    swap(node, 0, { instant: true, focus: false });
    if (wasField) {
      var f = node.querySelector(".field");
      if (f) { f.focus(); try { f.setSelectionRange(f.value.length, f.value.length); } catch (e) {} }
    }
    updateChrome();
  }

  function renderCurrent() {
    switch (screen) {
      case "welcome": return renderWelcome();
      case "privacy": return renderPrivacy();
      case "q": return renderQuestion(S.current);
      case "sending": return renderSending(false);
      case "done": return renderDone();
      case "error": return renderError();
      case "already": return renderAlready();
    }
    return null;
  }

  // ---------- Avanzamento, sfondo, navigazione ----------
  // Per il contatore: finché la domanda 1 non ha risposta si mostra la lunghezza del percorso più lungo,
  // così il totale non "salta" in su dopo la scelta.
  function displaySeq(qid) {
    if (qid === "q1" && !S.answers.q1) return SV.sequence({ q1: "uomo" });
    return SV.sequence(S.answers);
  }

  var BG_FROM = [246, 221, 169];  // ambra "birra"
  var BG_TO = [214, 237, 227];    // menta "whey"
  function lerpColor(p) {
    var c = BG_FROM.map(function (v, i) { return Math.round(v + (BG_TO[i] - v) * p); });
    return "rgb(" + c.join(",") + ")";
  }

  function progressValue() {
    if (screen === "welcome" || screen === "already") return 0;
    if (screen === "privacy") return 0.02;
    if (screen === "q") {
      var seq = displaySeq(S.current);
      var i = seq.indexOf(S.current);
      return Math.max(0.03, i / seq.length);
    }
    return 1;
  }

  function updateChrome() {
    var p = progressValue();
    var color = lerpColor(p);
    document.body.style.backgroundColor = color;
    document.documentElement.style.setProperty("--fizz", String(Math.max(0, 1 - p * 1.15)));
    if (themeMeta) themeMeta.setAttribute("content", color);

    progress.hidden = (screen === "welcome" || screen === "already");
    progress.style.setProperty("--p", String(p));
    progress.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    progress.style.setProperty("--track", progress.clientWidth + "px");

    updateNav();
  }

  function isAnswered(qid) {
    var a = S.answers[qid];
    if (a === undefined || a === null || a === "") return false;
    if (Array.isArray(a)) return a.length > 0;
    if (typeof a === "object") return Object.keys(a).length > 0;
    return true;
  }

  function updateNav() {
    if (screen !== "q" && screen !== "privacy") { nav.hidden = true; return; }
    nav.hidden = false;
    btnBack.hidden = false;
    btnBack.querySelector("span").textContent = ui("back");

    if (screen === "privacy") {
      btnSkip.hidden = true;
      btnNext.hidden = false;
      btnNext.querySelector("span").textContent = ui("continue");
      return;
    }
    var q = SV.questions[S.current];
    var seq = SV.sequence(S.answers);
    var last = seq.indexOf(S.current) === seq.length - 1;
    btnSkip.hidden = false;
    btnSkip.textContent = ui("skip");
    var always = q.type === "multi" || q.type === "grid" || q.type === "text" || q.type === "textarea";
    btnNext.hidden = !(always || isAnswered(S.current) || last);
    btnNext.querySelector("span").textContent = last ? ui("send") : ui("next");
  }

  // ---------- Lettura vocale ----------
  function speechChunks(qid) {
    var q = SV.questions[qid];
    var tx = T.questions[qid];
    var out = [];
    if (q.group) out.push(tr(T.questions[q.group].text));
    out.push(tr(tx.text));
    var hint = hintText(qid);
    if (hint) out.push(hint);
    if (q.type === "single" || q.type === "multi") {
      tx.options.forEach(function (opt, i) { out.push((i + 1) + ". " + tr(opt)); });
    } else if (q.type === "scale") {
      var g = T.questions[q.group];
      out.push(ui("scaleSpeech", { min: tr(g.min), max: tr(g.max) }));
    } else if (q.type === "grid") {
      tx.rows.forEach(function (r) { out.push(tr(r)); });
      out.push(tx.options.map(tr).join(", "));
    }
    return out;
  }

  function speakCurrent() {
    if (!speechOk || screen !== "q") return;
    Speech.speak(speechChunks(S.current), S.lang);
  }

  function stopSpeech() {
    clearTimeout(speakTimer);
    if (speechOk) Speech.stop();
  }

  function updateListenButtons(speaking) {
    $$(".listen").forEach(function (b) {
      b.setAttribute("aria-pressed", speaking ? "true" : "false");
      b.innerHTML = (speaking ? I.stop : I.speaker) + "<span>" + esc(speaking ? ui("stopListen") : ui("listen")) + "</span>";
    });
  }

  function setAutoRead(on) {
    S.autoRead = !!on;
    save();
    autoBtn.setAttribute("aria-pressed", S.autoRead ? "true" : "false");
    var sw = $("#w-auto");
    if (sw) sw.checked = S.autoRead;
    if (S.autoRead) {
      Speech.unlock();
      if (screen === "q") speakCurrent();
    } else {
      stopSpeech();
    }
  }

  function disableSpeech() {
    if (!speechOk) return;
    speechOk = false;
    S.autoRead = false;
    save();
    autoBtn.hidden = true;
    $$(".listen, .switch-speech").forEach(function (n) { n.remove(); });
    toast(ui("speechUnavailable"));
  }

  // ---------- Schermata iniziale ----------
  function renderWelcome() {
    var resuming = !!(S.startedAt && S.current);
    var info = "";
    if (resuming) {
      if (S.current === "privacy") info = ui("resumePrivacy");
      else {
        var seq = displaySeq(S.current);
        info = ui("resumeInfo", { n: seq.indexOf(S.current) + 1, t: seq.length });
      }
    }
    var node = el(
      '<section class="screen screen-welcome" aria-labelledby="w-title">' +
        '<div class="welcome-mark stagger">' + glass(0.34, "fizzy") + "</div>" +
        '<p class="eyebrow stagger">' + esc(ui("eyebrow")) + "</p>" +
        '<h1 id="w-title" class="display display-long stagger" tabindex="-1" data-autofocus>' + titleHtml(ui("welcomeTitle")) + "</h1>" +
        '<div class="intro stagger">' + T.ui.intro.map(introBlock).join("") + "</div>" +
        '<ul class="facts stagger">' +
          "<li>" + I.clock + "<span>" + esc(ui("factTime")) + "</span></li>" +
          "<li>" + I.lock + "<span>" + esc(ui("factAnon")) + "</span></li>" +
          "<li>" + I.stack + "<span>" + esc(ui("factOne")) + "</span></li>" +
        "</ul>" +
        '<p class="note stagger">' + esc(ui("welcomeNote")) + "</p>" +
        (speechOk ?
          '<label class="switch switch-speech stagger"><input type="checkbox" role="switch" id="w-auto"' + (S.autoRead ? " checked" : "") + ">" +
          '<span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>' +
          '<span class="switch-label">' + esc(ui("autoReadLong")) + "</span></label>" : "") +
        '<div class="cta stagger">' +
          (resuming ?
            '<button type="button" class="btn btn-primary btn-xl" id="w-resume"><span>' + esc(ui("resume")) + "</span>" + I.arrowR + "</button>" +
            '<p class="cta-sub">' + esc(info) + "</p>" +
            '<button type="button" class="btn-link" id="w-restart">' + esc(ui("restart")) + "</button>"
            :
            '<button type="button" class="btn btn-primary btn-xl" id="w-start"><span>' + esc(ui("start")) + "</span>" + I.arrowR + "</button>") +
        "</div>" +
      "</section>");

    var sw = $("#w-auto", node);
    if (sw) sw.addEventListener("change", function () { setAutoRead(sw.checked); });

    var start = $("#w-start", node);
    if (start) start.addEventListener("click", function () {
      Speech.unlock();
      S.startedAt = Date.now();
      S.current = "privacy";
      save();
      showPrivacy(1);
    });
    var resume = $("#w-resume", node);
    if (resume) resume.addEventListener("click", function () {
      Speech.unlock();
      if (S.current === "privacy") showPrivacy(1);
      else goQ(S.current, 1);
    });
    var restart = $("#w-restart", node);
    if (restart) restart.addEventListener("click", function () {
      Speech.unlock();
      var keep = { lang: S.lang, autoRead: S.autoRead, src: S.src };
      S = fresh();
      S.lang = keep.lang; S.autoRead = keep.autoRead; S.src = readSrc() || keep.src;
      S.startedAt = Date.now();
      S.current = "privacy";
      save();
      showPrivacy(1);
    });
    return node;
  }

  function showWelcome(dir) {
    stopSpeech();
    screen = "welcome";
    swap(renderWelcome(), dir || 1);
    updateChrome();
  }

  // ---------- Informativa ----------
  function renderPrivacy() {
    var points = tr(T.ui.privacyPoints).map(function (p) { return "<li>" + withPlaceholders(p) + "</li>"; }).join("");
    var node = el(
      '<section class="screen screen-privacy" aria-labelledby="p-title">' +
        '<h1 id="p-title" class="title stagger" tabindex="-1" data-autofocus>' + esc(ui("privacyTitle")) + "</h1>" +
        '<div class="privacy-box stagger">' +
          "<p>" + withPlaceholders(ui("privacyIntro")) + "</p>" +
          (points ? "<ul>" + points + "</ul>" : "") +
          '<p class="privacy-contact">' + withPlaceholders(ui("privacyContact")) + "</p>" +
        "</div>" +
        '<label class="check stagger"><input type="checkbox" id="c-privacy"' + (S.consent.privacy ? " checked" : "") + ">" +
          '<span class="check-box" aria-hidden="true">' + I.check + '</span><span class="check-label">' + esc(ui("consentPrivacy")) + "</span></label>" +
        '<label class="check stagger"><input type="checkbox" id="c-age"' + (S.consent.age ? " checked" : "") + ">" +
          '<span class="check-box" aria-hidden="true">' + I.check + '</span><span class="check-label">' + esc(ui("consentAge")) + "</span></label>" +
        '<p class="form-error" id="c-error" role="alert"></p>' +
      "</section>");

    ["privacy", "age"].forEach(function (k) {
      var input = $("#c-" + k, node);
      input.addEventListener("change", function () {
        S.consent[k] = input.checked;
        if (input.checked) buzz(8);
        save();
        if (S.consent.privacy && S.consent.age) $("#c-error", node).textContent = "";
      });
    });
    return node;
  }

  function showPrivacy(dir) {
    stopSpeech();
    clearTimeout(advanceTimer);
    screen = "privacy";
    S.current = "privacy";
    save();
    swap(renderPrivacy(), dir || 1);
    updateChrome();
  }

  function privacyContinue() {
    if (S.consent.privacy && S.consent.age) {
      goQ(SV.sequence(S.answers)[0], 1);
      return;
    }
    var err = $("#c-error", currentNode);
    err.textContent = ui("consentError");
    buzz([15, 40, 15]);
    ["privacy", "age"].forEach(function (k) {
      if (!S.consent[k]) restartAnim($("#c-" + k, currentNode).closest(".check"), "shake");
    });
  }

  // ---------- Domande ----------
  function sectionLabel(q) { return ui("sec_" + q.section); }

  function milestone(i, total) {
    if (i === total - 1) return ui("msLast");
    if (i === total - 3) return ui("msAlmost");
    if (i === Math.floor(total / 2)) return ui("msHalf");
    return "";
  }

  function hintText(qid) {
    var q = SV.questions[qid];
    var tx = T.questions[qid];
    if (q.type === "multi") return q.max ? ui("hintMax", { n: q.max }) : ui("hintMulti");
    if (tx.hint) return tr(tx.hint);
    return "";
  }

  function renderQuestion(qid) {
    var q = SV.questions[qid];
    var tx = T.questions[qid];
    var seq = displaySeq(qid);
    var idx = seq.indexOf(qid);
    var total = seq.length;
    var ms = milestone(idx, total);
    var hint = hintText(qid);

    var head =
      '<div class="q-meta stagger">' +
        '<span class="kicker">' + esc(sectionLabel(q)) + "</span>" +
        '<span class="count" aria-hidden="true">' + esc(ui("count", { n: idx + 1, t: total })) + "</span>" +
        (ms ? '<span class="chip">' + esc(ms) + "</span>" : "") +
        (speechOk ? '<button type="button" class="listen" aria-pressed="false">' + I.speaker + "<span>" + esc(ui("listen")) + "</span></button>" : "") +
      "</div>" +
      (q.group ? '<p class="q-group stagger">' + esc(tr(T.questions[q.group].text)) + "</p>" : "") +
      '<h1 class="q-title stagger" id="q-title" tabindex="-1" data-autofocus>' + esc(tr(tx.text)) + "</h1>" +
      (hint ? '<p class="q-hint stagger" id="q-hint">' + esc(hint) + "</p>" : "");

    var body = "";
    var sel = S.answers[qid];

    if (q.type === "single" || q.type === "multi") {
      var multi = q.type === "multi";
      var capped = multi && q.max && Array.isArray(sel) && sel.length >= q.max;
      body = '<div class="options' + (tx.options.length > 8 ? " many" : "") + '" data-kind="' + q.type + '" role="' + (multi ? "group" : "radiogroup") +
        '" aria-labelledby="q-title"' + (hint ? ' aria-describedby="q-hint"' : "") + ">" +
        tx.options.map(function (opt, i) {
          var on = multi ? (Array.isArray(sel) && sel.indexOf(opt.id) !== -1) : sel === opt.id;
          return '<button type="button" class="opt stagger' + (capped && !on ? " is-capped" : "") + '" role="' + (multi ? "checkbox" : "radio") +
            '" aria-checked="' + on + '" data-opt="' + esc(opt.id) + '">' +
            (i < 9 ? '<span class="opt-key" aria-hidden="true">' + (i + 1) + "</span>" : '<span class="opt-key opt-key-empty" aria-hidden="true"></span>') +
            '<span class="opt-label">' + esc(tr(opt)) + "</span>" +
            '<span class="opt-mark" aria-hidden="true">' + I.check + "</span></button>";
        }).join("") + "</div>";
    } else if (q.type === "scale") {
      var g = T.questions[q.group];
      var v = typeof sel === "number" ? sel : 0;
      body = '<div class="scale stagger">' +
        '<div class="scale-row" role="radiogroup" aria-labelledby="q-title" style="--v:' + v + '">' +
          '<div class="scale-track" aria-hidden="true"><div class="scale-fill"></div></div>' +
          [1, 2, 3, 4, 5].map(function (n) {
            var label = n === 1 ? n + " – " + tr(g.min) : n === 5 ? n + " – " + tr(g.max) : String(n);
            return '<button type="button" class="scale-btn' + (v && n <= v ? " is-under" : "") + '" role="radio" aria-checked="' + (v === n) +
              '" data-opt="' + n + '" aria-label="' + esc(label) + '"><span>' + n + "</span></button>";
          }).join("") +
        "</div>" +
        '<div class="scale-legend" aria-hidden="true"><span><b>1</b> ' + esc(tr(g.min)) + "</span><span><b>5</b> " + esc(tr(g.max)) + "</span></div>" +
      "</div>";
    } else if (q.type === "grid") {
      var cur = sel || {};
      body = '<div class="grid">' + tx.rows.map(function (row) {
        return '<div class="grid-row stagger" role="radiogroup" aria-labelledby="gl-' + row.id + '">' +
          '<p class="grid-label" id="gl-' + row.id + '">' + esc(tr(row)) + "</p>" +
          '<div class="seg">' + tx.options.map(function (opt) {
            return '<button type="button" role="radio" aria-checked="' + (cur[row.id] === opt.id) + '" data-row="' + row.id + '" data-col="' + opt.id + '">' +
              esc(tr(opt)) + "</button>";
          }).join("") + "</div></div>";
      }).join("") + "</div>";
    } else {
      var val = typeof sel === "string" ? sel : "";
      var max = q.maxLength || 300;
      var attrs = ' class="field" id="q-field" maxlength="' + max + '" aria-labelledby="q-title"' + (hint ? ' aria-describedby="q-hint"' : "") +
        ' placeholder="' + esc(ui("placeholder")) + '" autocomplete="off" autocapitalize="sentences" spellcheck="true"';
      body = '<div class="text-wrap stagger">' +
        (q.type === "textarea" ? "<textarea rows=\"5\"" + attrs + "></textarea>" : '<input type="text" enterkeyhint="next"' + attrs + ">") +
        '<div class="field-meta"><span></span><span class="field-count" aria-live="off">' + esc(ui("charsLeft", { n: max - val.length })) + "</span></div>" +
      "</div>";
    }

    var node = el(
      '<section class="screen screen-q" data-type="' + q.type + '" data-qid="' + qid + '">' + head +
        '<div class="answers">' + body + "</div>" +
        '<p class="q-nudge" id="q-nudge" role="status"></p>' +
      "</section>");

    // Valore dei campi di testo impostato via DOM (niente HTML iniettato)
    var field = $("#q-field", node);
    if (field) {
      field.value = typeof sel === "string" ? sel : "";
      var counter = $(".field-count", node);
      field.addEventListener("input", function () {
        var v2 = field.value;
        if (v2.trim()) S.answers[qid] = v2; else delete S.answers[qid];
        counter.textContent = ui("charsLeft", { n: (q.maxLength || 300) - v2.length });
        saveSoon();
      });
      field.addEventListener("focus", function () { stopSpeech(); });
      field.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && field.tagName === "INPUT") { e.preventDefault(); next(); }
      });
    }

    // Deleghe
    node.addEventListener("pointerdown", function (e) {
      var b = e.target.closest(".opt");
      if (!b) return;
      var r = b.getBoundingClientRect();
      b.style.setProperty("--ox", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    });
    node.addEventListener("click", function (e) {
      var listenBtn = e.target.closest(".listen");
      if (listenBtn) {
        Speech.unlock();
        if (Speech.isSpeaking()) stopSpeech(); else speakCurrent();
        return;
      }
      var b = e.target.closest("[data-opt]");
      if (b) {
        if (q.type === "multi") toggleMulti(qid, b.getAttribute("data-opt"), b);
        else if (q.type === "scale") chooseScale(qid, parseInt(b.getAttribute("data-opt"), 10));
        else chooseSingle(qid, b.getAttribute("data-opt"));
        return;
      }
      var gb = e.target.closest("[data-row]");
      if (gb) chooseGrid(qid, gb.getAttribute("data-row"), gb.getAttribute("data-col"), gb);
    });
    node.addEventListener("keydown", function (e) {
      // Frecce per muoversi tra le opzioni
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].indexOf(e.key) === -1) return;
      var cur = e.target.closest("[data-opt], [data-row]");
      if (!cur) return;
      var group = cur.hasAttribute("data-row") ? $$("[data-row]", cur.parentNode) : $$("[data-opt]", node);
      var i = group.indexOf(cur);
      var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
      var nxt = group[(i + d + group.length) % group.length];
      if (nxt) { e.preventDefault(); nxt.focus(); }
    });

    return node;
  }

  function goQ(qid, dir) {
    clearTimeout(advanceTimer);
    stopSpeech();
    screen = "q";
    S.current = qid;
    save();
    swap(renderQuestion(qid), dir);
    updateChrome();
    var seq = displaySeq(qid);
    announce(ui("announce", { n: seq.indexOf(qid) + 1, t: seq.length }));
    if (S.autoRead && speechOk) {
      speakTimer = setTimeout(function () {
        if (screen === "q" && S.current === qid) speakCurrent();
      }, reduced() ? 60 : 520);
    }
  }

  function next() {
    if (performance.now() < busyUntil) return;
    clearTimeout(advanceTimer);
    var seq = SV.sequence(S.answers);
    var i = seq.indexOf(S.current);
    if (i === -1) { goQ(seq[0], 1); return; }
    if (i < seq.length - 1) goQ(seq[i + 1], 1);
    else finish();
  }

  function back() {
    if (performance.now() < busyUntil) return;
    clearTimeout(advanceTimer);
    var seq = SV.sequence(S.answers);
    var i = seq.indexOf(S.current);
    if (i > 0) goQ(seq[i - 1], -1);
    else showPrivacy(-1);
  }

  function skip() {
    if (performance.now() < busyUntil) return;
    delete S.answers[S.current];
    save();
    next();
  }

  function nextPressed() {
    var q = SV.questions[S.current];
    if ((q.type === "multi" || q.type === "grid") && !isAnswered(S.current)) {
      var n = $("#q-nudge", currentNode);
      n.textContent = ui("nudge");
      restartAnim(n, "flash");
      restartAnim($(".answers", currentNode), "shake-soft");
      buzz([12, 40, 12]);
      return;
    }
    next();
  }

  function clearNudge() {
    var n = currentNode && $("#q-nudge", currentNode);
    if (n) n.textContent = "";
  }

  function chooseSingle(qid, id) {
    if (performance.now() < busyUntil) return;
    stopSpeech();
    S.answers[qid] = id;
    save();
    buzz(10);
    $$("[data-opt]", currentNode).forEach(function (b) {
      b.setAttribute("aria-checked", String(b.getAttribute("data-opt") === id));
    });
    updateNav();
    scheduleAdvance(qid);
  }

  function chooseScale(qid, v) {
    if (performance.now() < busyUntil) return;
    stopSpeech();
    S.answers[qid] = v;
    save();
    buzz(10);
    var row = $(".scale-row", currentNode);
    row.style.setProperty("--v", String(v));
    $$("[data-opt]", row).forEach(function (b) {
      var n = parseInt(b.getAttribute("data-opt"), 10);
      b.setAttribute("aria-checked", String(n === v));
      b.classList.toggle("is-under", n <= v);
    });
    updateNav();
    scheduleAdvance(qid);
  }

  function scheduleAdvance(qid) {
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(function () {
      if (screen === "q" && S.current === qid) next();
    }, reduced() ? 250 : 520);
  }

  function toggleMulti(qid, id, btn) {
    var q = SV.questions[qid];
    var excl = q.exclusive || [];
    var cur = Array.isArray(S.answers[qid]) ? S.answers[qid].slice() : [];
    var on = cur.indexOf(id) !== -1;

    if (on) {
      cur = cur.filter(function (x) { return x !== id; });
    } else if (excl.indexOf(id) !== -1) {
      cur = [id];
    } else {
      cur = cur.filter(function (x) { return excl.indexOf(x) === -1; });
      if (q.max && cur.length >= q.max) {
        restartAnim(btn, "shake");
        var h = $("#q-hint", currentNode);
        if (h) restartAnim(h, "flash");
        buzz([15, 40, 15]);
        announce(ui("maxReached", { n: q.max }));
        var n = $("#q-nudge", currentNode);
        n.textContent = ui("maxReached", { n: q.max });
        return;
      }
      cur.push(id);
    }

    stopSpeech();
    clearNudge();
    if (cur.length) S.answers[qid] = cur; else delete S.answers[qid];
    save();
    buzz(8);
    var capped = q.max && cur.length >= q.max;
    $$("[data-opt]", currentNode).forEach(function (b) {
      var sel = cur.indexOf(b.getAttribute("data-opt")) !== -1;
      b.setAttribute("aria-checked", String(sel));
      b.classList.toggle("is-capped", !!capped && !sel);
    });
    updateNav();
  }

  function chooseGrid(qid, rowId, colId, btn) {
    stopSpeech();
    clearNudge();
    var cur = Object.assign({}, S.answers[qid] || {});
    cur[rowId] = colId;
    S.answers[qid] = cur;
    save();
    buzz(8);
    $$("[data-row]", btn.parentNode).forEach(function (b) {
      b.setAttribute("aria-checked", String(b.getAttribute("data-col") === colId));
    });
    var rows = T.questions[qid].rows;
    var complete = rows.every(function (r) { return cur[r.id]; });
    if (complete) restartAnim(btnNext, "ready");
  }

  // ---------- Invio ----------
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function renderSending() {
    return el(
      '<section class="screen screen-center" aria-labelledby="s-title">' +
        '<div class="big-glass stagger">' + glass(0.3, "fizzy") + "</div>" +
        '<h1 class="title stagger" id="s-title" tabindex="-1" data-autofocus>' + esc(ui("sending")) + "</h1>" +
        '<p class="lead stagger">' + esc(ui("sendingSub")) + "</p>" +
      "</section>");
  }

  function finish() {
    clearTimeout(advanceTimer);
    stopSpeech();
    var payload = Submit.build({ answers: S.answers, lang: S.lang, startedAt: S.startedAt, src: S.src });
    lastPayload = payload;
    screen = "sending";
    var node = renderSending();
    swap(node, 1);
    updateChrome();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { setGlassLevel(node, 0.94); });
    });

    Promise.all([Submit.send(payload, { simulate: SIMULATE }), wait(reduced() ? 300 : 1300)])
      .then(function () {
        doneProfile = Profiles.compute(S.answers, SV.path(S.answers));
        doneIdea = SV.path(S.answers) === "B" ? Profiles.computeIdea(S.answers) : null;
        doneNotes = SV.path(S.answers) === "B" ? Profiles.computeNotes(S.answers) : [];
        if (!SIMULATE) store.set(DONE_KEY, { at: new Date().toISOString(), profile: doneProfile, idea: doneIdea, notes: doneNotes });
        sealed = true;
        clearTimeout(saveTimer);
        store.del(STATE_KEY);
        screen = "done";
        swap(renderDone(), 1);
        updateChrome();
        buzz([10, 60, 20]);
      })
      .catch(function (err) {
        if (window.console) console.warn("[Questionario] invio fallito:", err);
        screen = "error";
        swap(renderError(), 1);
        updateChrome();
        buzz([20, 60, 20]);
      });
  }

  function testPanel() {
    if (!SIMULATE || !lastPayload) return "";
    var rows = lastPayload.rows.map(function (r) {
      return "<tr><td><code>" + esc(r.key) + "</code></td><td><code>" + esc(r.entry) + "</code></td><td>" + esc(r.value) + "</td></tr>";
    }).join("");
    return '<div class="test-panel stagger">' +
      "<p>" + esc(ui("testIntro")) + "</p>" +
      '<div class="test-table"><table><thead><tr><th>campo</th><th>entry</th><th>valore</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      "<details><summary>Body POST</summary><pre>" + esc(lastPayload.body) + "</pre></details>" +
    "</div>";
  }

  function shareBlock() {
    return '<div class="share-wrap stagger"><button type="button" class="btn btn-primary" id="share"><span>' + esc(ui("share")) + "</span>" + I.share + "</button>" +
      '<div class="copy-fallback" id="copy-fallback" hidden><label for="copy-input">' + esc(ui("copyManual")) + '</label><input id="copy-input" class="field" readonly></div></div>';
  }

  function wireShare(node) {
    var b = $("#share", node);
    if (b) b.addEventListener("click", function () { share(node); });
  }

  // ---------- Profilo e guida PDF ----------
  function guideUrl(id) {
    return "" + Profiles.guideFile(id) + ".pdf";
  }

  function profileCard(id, idea, notes) {
    notes = (notes || []).filter(function (n) { return Profiles.note && Profiles.note[n]; });
    var p = id && Profiles.profiles[id];
    if (!p) return "";
    return '<div class="profile-card stagger">' +
        '<p class="profile-label">' + esc(ui("profileLabel")) + "</p>" +
        '<h2 class="profile-name">' + esc(tr(p.name)) + "</h2>" +
        '<p class="profile-desc">' + esc(tr(p.description)) + "</p>" +
        (idea && Profiles.idee[idea] ? '<p class="profile-idea"><strong>' + esc(ui("ideaLabel")) + ":</strong> " + esc(tr(Profiles.idee[idea])) + "</p>" : "") +
        (notes.length ? '<div class="profile-notes"><p class="profile-notes-label">' + esc(ui("notesLabel")) + "</p><ul>" +
          notes.map(function (n) { return "<li>" + esc(tr(Profiles.note[n])) + "</li>"; }).join("") + "</ul></div>" : "") +
        '<a class="btn btn-primary btn-xl" id="download" href="' + esc(guideUrl(id)) + '" target="_blank" rel="noopener" download>' +
          "<span>" + esc(ui("download")) + "</span>" + I.download + "</a>" +
        '<p class="profile-note">' + esc(ui("guideNote")) + "</p>" +
      "</div>";
  }

  function renderDone() {
    var node = el(
      '<section class="screen screen-center screen-done" aria-labelledby="d-title">' +
        '<div class="big-glass done-glass stagger">' + glass(0.94, "full") +
          '<span class="done-check" aria-hidden="true">' + I.check + "</span></div>" +
        '<h1 class="display stagger" id="d-title" tabindex="-1" data-autofocus>' + esc(ui("doneTitle")) + "</h1>" +
        '<p class="lead stagger">' + esc(ui("doneBody")) + "</p>" +
        profileCard(doneProfile, doneIdea, doneNotes) +
        '<p class="lead share-ask stagger">' + esc(ui("shareAsk")) + "</p>" +
        shareBlock() + testPanel() +
      "</section>");
    wireShare(node);
    return node;
  }

  function renderAlready() {
    var saved = store.get(DONE_KEY) || {};
    var node = el(
      '<section class="screen screen-center" aria-labelledby="a-title">' +
        '<div class="big-glass stagger">' + glass(0.94, "full") + "</div>" +
        '<h1 class="title stagger" id="a-title" tabindex="-1" data-autofocus>' + esc(ui("alreadyTitle")) + "</h1>" +
        '<p class="lead stagger">' + esc(ui("alreadyBody")) + "</p>" +
        profileCard(saved.profile, saved.idea, saved.notes) +
        shareBlock() +
      "</section>");
    wireShare(node);
    return node;
  }

  function renderError() {
    var node = el(
      '<section class="screen screen-center" aria-labelledby="e-title">' +
        '<div class="big-glass stagger">' + glass(0.3, "") + "</div>" +
        '<h1 class="title stagger" id="e-title" tabindex="-1" data-autofocus>' + esc(ui("errorTitle")) + "</h1>" +
        '<p class="lead stagger">' + esc(ui("errorBody")) + "</p>" +
        '<div class="cta cta-center stagger">' +
          '<button type="button" class="btn btn-primary btn-xl" id="retry"><span>' + esc(ui("retry")) + "</span>" + I.refresh + "</button>" +
          '<button type="button" class="btn-link" id="to-questions">' + esc(ui("backToQuestions")) + "</button>" +
        "</div>" +
      "</section>");
    $("#retry", node).addEventListener("click", finish);
    $("#to-questions", node).addEventListener("click", function () { goQ(S.current, -1); });
    return node;
  }

  // ---------- Condivisione ----------
  function shareUrl() {
    var u = new URL(location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("src", "condiviso");
    return u.toString();
  }

  function share(node) {
    var url = shareUrl();
    var data = { title: ui("docTitle"), text: ui("shareText"), url: url };
    if (navigator.share) {
      navigator.share(data).catch(function (e) {
        if (e && e.name === "AbortError") return;
        copyLink(url, node);
      });
      return;
    }
    copyLink(url, node);
  }

  function copyLink(url, node) {
    function manual() {
      var box = $("#copy-fallback", node);
      var input = $("#copy-input", node);
      box.hidden = false;
      input.value = url;
      input.focus();
      input.select();
    }
    function legacy() {
      try {
        var ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, url.length);
        var ok = document.execCommand("copy");
        ta.remove();
        if (ok) { toast(ui("copied")); buzz(10); } else manual();
      } catch (e) { manual(); }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { toast(ui("copied")); buzz(10); }, legacy);
    } else {
      legacy();
    }
  }

  // ---------- Lingua ----------
  function applyLang() {
    document.documentElement.lang = S.lang;
    document.title = ui("docTitle");
    langGroup.setAttribute("aria-label", ui("langLabel"));
    langGroup.setAttribute("data-active", S.lang);
    $$("[data-lang]", langGroup).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === S.lang));
    });
    $("#brand-text").textContent = ui("brand");
    autoBtn.querySelector("span").textContent = ui("autoRead");
    autoBtn.setAttribute("aria-label", ui("autoReadLong"));
    progress.setAttribute("aria-label", ui("progressLabel"));
  }

  function setLang(l) {
    if (l === S.lang || !T.ui.brand[l]) return;
    stopSpeech();
    S.lang = l;
    save();
    applyLang();
    rerender();
  }

  // ---------- Avvio ----------
  function readSrc() {
    return (params.get("src") || "").trim().slice(0, 60).replace(/[^\w.\-]/g, "");
  }

  function fitViewport() {
    // Nei browser in-app (Instagram/Facebook) 100vh include le barre: si usa l'area visibile reale
    var vv = window.visualViewport;
    if (!vv) return;
    function fit() {
      if (Math.abs((vv.scale || 1) - 1) > 0.01) return;
      document.documentElement.style.setProperty("--app-h", Math.round(vv.height) + "px");
      progress.style.setProperty("--track", progress.clientWidth + "px");
    }
    vv.addEventListener("resize", fit);
    fit();
  }

  function boot() {
    if (params.get("reset") === "1") {
      store.del(STATE_KEY);
      store.del(DONE_KEY);
      params.delete("reset");
      var qs = params.toString();
      try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "")); } catch (e) {}
    }

    var saved = store.get(STATE_KEY);
    if (saved && saved.v === 1) {
      S = Object.assign(fresh(), saved);
    } else {
      var l = params.get("lang");
      if (l === "en" || l === "it") S.lang = l;
    }
    // La sorgente è quella del primo accesso: una ripresa da un altro link non la sovrascrive
    if (!S.src) S.src = readSrc() || "diretto";

    if (!speechOk) { autoBtn.hidden = true; S.autoRead = false; }
    autoBtn.setAttribute("aria-pressed", S.autoRead ? "true" : "false");

    Speech.onChange(updateListenButtons);
    Speech.onFail(disableSpeech);

    applyLang();
    fitViewport();

    $$("[data-lang]", langGroup).forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    autoBtn.addEventListener("click", function () {
      setAutoRead(!S.autoRead);
      toast(S.autoRead ? ui("autoReadOn") : ui("autoReadOff"));
    });
    btnBack.addEventListener("click", function () {
      if (screen === "privacy") showWelcome(-1); else back();
    });
    btnSkip.addEventListener("click", skip);
    btnNext.addEventListener("click", function () {
      if (screen === "privacy") privacyContinue(); else nextPressed();
    });

    // Scorciatoie da tastiera: 1-9 per scegliere, Invio per andare avanti
    document.addEventListener("keydown", function (e) {
      if (screen !== "q" || e.altKey || e.ctrlKey || e.metaKey) return;
      var tag = e.target.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      var q = SV.questions[S.current];
      if (/^[1-9]$/.test(e.key) && q.type !== "grid") {
        var b = $$("[data-opt]", currentNode)[parseInt(e.key, 10) - 1];
        if (b) { e.preventDefault(); b.focus(); b.click(); }
      } else if (e.key === "Enter" && (e.target === document.body || e.target.id === "q-title")) {
        if (!btnNext.hidden) { e.preventDefault(); btnNext.click(); }
      }
    });

    window.addEventListener("resize", function () {
      progress.style.setProperty("--track", progress.clientWidth + "px");
    });
    // Salvataggio immediato quando l'app va in background (chiusura accidentale)
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") { clearTimeout(saveTimer); save(); stopSpeech(); }
    });

    if (SIMULATE) {
      var badge = $("#test-badge");
      badge.hidden = false;
      badge.textContent = TEST ? ui("testBadge") : ui("notConfigured");
      if (window.console) console.info("[Questionario] " + (TEST ? "Modalità test (?test=1)" : "formAction non configurato") + ": nessun invio reale.");
    }

    if (!TEST && store.get(DONE_KEY)) screen = "already";
    else screen = "welcome";
    swap(renderCurrent(), 1, { focus: false });
    updateChrome();
    document.documentElement.classList.add("ready");
  }

  boot();
})();
