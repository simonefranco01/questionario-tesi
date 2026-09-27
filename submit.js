/*
 * INVIO AL GOOGLE FORM
 * - I valori inviati sono SEMPRE le etichette italiane (campo "it" in i18n.js),
 *   qualunque lingua abbia usato chi risponde.
 * - Scelta multipla = stesso parametro entry ripetuto.
 * - fetch con mode "no-cors": Google non restituisce conferma leggibile, quindi
 *   si intercettano solo gli errori di rete (offline, timeout).
 */
window.Submit = (function () {
  var TIMEOUT_MS = 15000;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // "2026-09-24 14:03:11" (ora locale): Google Sheets la riconosce come data
  function formatDate(ms) {
    var d = new Date(ms);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " +
      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }

  function findLabel(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].it;
    return null;
  }

  /*
   * info: { answers, lang, startedAt, src }
   * Ritorna { rows: [{key, entry, value}], body: "entry.1=...&entry.2=..." }
   */
  function build(info) {
    var CFG = window.SURVEY_CONFIG || { entries: {} };
    var SV = window.SURVEY;
    var Q = window.I18N.questions;
    var rows = [];

    function add(key, value) {
      var entry = (CFG.entries && CFG.entries[key]) || "entry.???(" + key + ")";
      rows.push({ key: key, entry: entry, value: String(value) });
    }

    SV.sequence(info.answers).forEach(function (qid) {
      var q = SV.questions[qid];
      var tx = Q[qid];
      var a = info.answers[qid];
      if (a === undefined || a === null || a === "") return;

      switch (q.type) {
        case "single": {
          var label = findLabel(tx.options, a);
          if (label) add(qid, label);
          break;
        }
        case "multi": {
          // nell'ordine in cui le opzioni compaiono nel questionario
          tx.options.forEach(function (opt) {
            if (a.indexOf(opt.id) !== -1) add(qid, opt.it);
          });
          break;
        }
        case "scale":
          add(qid, a);
          break;
        case "grid":
          tx.rows.forEach(function (row) {
            var l = a[row.id] ? findLabel(tx.options, a[row.id]) : null;
            if (l) add(row.id, l);
          });
          break;
        case "text":
        case "textarea": {
          var v = String(a).trim();
          if (v) add(qid, v);
          break;
        }
      }
    });

    // Campi nascosti
    var path = SV.path(info.answers);
    add("lingua", info.lang);
    add("percorso", SV.pathLabel[path]);
    add("durata", Math.max(0, Math.round((Date.now() - (info.startedAt || Date.now())) / 1000)));
    add("sorgente", info.src || "diretto");
    add("inizio", formatDate(info.startedAt || Date.now()));

    var params = new URLSearchParams();
    rows.forEach(function (r) { params.append(r.entry, r.value); });
    return { rows: rows, body: params.toString() };
  }

  function send(payload, opts) {
    var CFG = window.SURVEY_CONFIG || {};
    if (opts && opts.simulate) {
      try {
        console.group("%c[Questionario] Invio SIMULATO: payload", "font-weight:bold;color:#C47A10");
        if (console.table) console.table(payload.rows);
        console.log("Body POST:", payload.body);
        console.log("Endpoint:", CFG.formAction || "(formAction non configurato)");
        console.groupEnd();
      } catch (e) {}
      return Promise.resolve({ simulated: true });
    }

    if (navigator.onLine === false) return Promise.reject(new Error("offline"));

    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);

    return fetch(CFG.formAction, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: payload.body,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      clearTimeout(timer);
      return res;
    }, function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  return { build: build, send: send, formatDate: formatDate };
})();
