/*
 * STRUTTURA DEL QUESTIONARIO
 * Qui ci sono solo tipi, percorsi e regole. Tutti i testi (domande, opzioni,
 * interfaccia) stanno in i18n.js.
 *
 * Tipi: single (scelta singola, avanza da sola), multi (più risposte),
 *       scale (1-5, avanza da sola), grid (righe × colonne), text, textarea.
 * exclusive: opzioni che, se scelte, deselezionano le altre (es. "Nessuna").
 */
window.SURVEY = (function () {
  var sections = {
    apertura: ["q1", "q2", "q3", "q4", "q5"],
    A: ["q6", "q7", "q8", "q9", "q10", "q10b", "q10c", "q10d", "q10e",
        "q11", "q12", "q13", "q15",
        "q17a", "q17c", "q17d", "q17e", "q17f", "q17g", "q17h", "q17i"],
    B: ["qb6", "qb9", "qb10", "qb10b",
        "q18a", "q18b", "q18c",
        "q19a", "q19b", "q19c", "q19d", "q19e", "q19f", "q19g", "q19h"],
    chiusura: ["qbarba", "q21", "q22", "q23"]
  };

  var questions = {
    q1:  { type: "single", section: "about" },
    q2:  { type: "single", section: "about" },
    q3:  { type: "single", section: "about" },
    q4:  { type: "single", section: "about" },
    q5:  { type: "single", section: "about" },

    q6:   { type: "single", section: "body" },
    q7:   { type: "multi",  section: "body", exclusive: ["nessuna"] },
    q8:   { type: "multi",  section: "body", max: 3 },
    q9:   { type: "multi",  section: "body", exclusive: ["nessuno"] },
    q10:  { type: "single", section: "body" },
    q10b: { type: "multi",  section: "body", max: 2 },
    q10c: { type: "multi",  section: "body", exclusive: ["nessuno"] },
    q10d: { type: "multi",  section: "body", exclusive: ["nessuna"] },
    q10e: { type: "multi",  section: "body", exclusive: ["nessuno"] },
    q11:  { type: "single", section: "body" },
    q12:  { type: "multi",  section: "body", exclusive: ["nessuna_fonte"] },
    q13:  { type: "single", section: "body" },
    q15:  { type: "single", section: "body" },
    q17a: { type: "scale", section: "opinions", group: "q17" },
    q17c: { type: "scale", section: "opinions", group: "q17" },
    q17d: { type: "scale", section: "opinions", group: "q17" },
    q17e: { type: "scale", section: "opinions", group: "q17" },
    q17f: { type: "scale", section: "opinions", group: "q17" },
    q17g: { type: "scale", section: "opinions", group: "q17" },
    q17h: { type: "scale", section: "opinions", group: "q17" },
    q17i: { type: "scale", section: "opinions", group: "q17" },

    qb6:   { type: "single", section: "body" },
    qb9:   { type: "multi",  section: "body", exclusive: ["nessuno"] },
    qb10:  { type: "single", section: "body" },
    qb10b: { type: "multi",  section: "body", max: 2 },
    q18a: { type: "multi", section: "consumption", exclusive: ["nessuno"] },
    q18b: { type: "multi", section: "consumption", exclusive: ["nessuno"] },
    q18c: { type: "multi", section: "consumption", exclusive: ["nessuna", "scelta_sua"] },
    q19a: { type: "scale", section: "opinions", group: "q19" },
    q19b: { type: "scale", section: "opinions", group: "q19" },
    q19c: { type: "scale", section: "opinions", group: "q19" },
    q19d: { type: "scale", section: "opinions", group: "q19" },
    q19e: { type: "scale", section: "opinions", group: "q19" },
    q19f: { type: "scale", section: "opinions", group: "q19" },
    q19g: { type: "scale", section: "opinions", group: "q19" },
    q19h: { type: "scale", section: "opinions", group: "q19" },

    qbarba: { type: "single",   section: "closing" },
    q21:    { type: "text",     section: "closing", maxLength: 200 },
    q22:    { type: "textarea", section: "closing", maxLength: 800 },
    q23:    { type: "single",   section: "closing" }
  };

  // Bivio sulla domanda 1: "Uomo" → percorso A; tutto il resto (anche domanda saltata) → B.
  function path(answers) {
    return answers && answers.q1 === "uomo" ? "A" : "B";
  }

  function has(list, id) { return Array.isArray(list) && list.indexOf(id) !== -1; }

  /*
   * Salti interni al percorso A:
   * - chi alla 6 risponde "Mai" non vede la 7 e la 8;
   * - chi alla 7 sceglie "Nessuna" non vede la 8 (perché la fai?);
   * - chi alla 9 sceglie "Nessuno di questi" non vede la 10b (come scegli cosa comprare).
 * Percorso B: stesso salto tra B9 e B10b.
   */
  function skipped(qid, a) {
    a = a || {};
    if ((qid === "q7" || qid === "q8") && a.q6 === "mai") return true;
    if (qid === "q8" && has(a.q7, "nessuna")) return true;
    if (qid === "q10b" && has(a.q9, "nessuno")) return true;
    if (qid === "qb10b" && has(a.qb9, "nessuno")) return true;
    return false;
  }

  function sequence(answers) {
    return sections.apertura.concat(sections[path(answers)], sections.chiusura)
      .filter(function (qid) { return !skipped(qid, answers); });
  }

  // Valore inviato nel campo nascosto "percorso"
  var pathLabel = { A: "uomo", B: "donna-altro" };

  return { sections: sections, questions: questions, path: path, sequence: sequence, pathLabel: pathLabel };
})();
