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
    A: ["q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16",
        "q17a", "q17b", "q17c", "q17d", "q17e", "q17f"],
    B: ["q18", "q19a", "q19b", "q19c", "q19d", "q19e"],
    chiusura: ["q20", "q21", "q22", "q23"]
  };

  var questions = {
    q1:  { type: "single", section: "about" },
    q2:  { type: "single", section: "about" },
    q3:  { type: "single", section: "about" },
    q4:  { type: "single", section: "about" },
    q5:  { type: "single", section: "about" },

    q6:  { type: "single", section: "body" },
    q7:  { type: "multi",  section: "body", exclusive: ["nessuna"] },
    q8:  { type: "multi",  section: "body", max: 2 },
    q9:  { type: "multi",  section: "body", exclusive: ["nessuno"] },
    q10: { type: "single", section: "body" },
    q11: { type: "single", section: "body" },
    q12: { type: "multi",  section: "body", exclusive: ["nessuna_fonte"] },
    q13: { type: "single", section: "body" },
    q14: { type: "single", section: "body" },
    q15: { type: "single", section: "body" },
    q16: { type: "grid",   section: "body" },
    q17a: { type: "scale", section: "opinions", group: "q17" },
    q17b: { type: "scale", section: "opinions", group: "q17" },
    q17c: { type: "scale", section: "opinions", group: "q17" },
    q17d: { type: "scale", section: "opinions", group: "q17" },
    q17e: { type: "scale", section: "opinions", group: "q17" },
    q17f: { type: "scale", section: "opinions", group: "q17" },

    q18:  { type: "multi", section: "consumption", exclusive: ["nessuno"] },
    q19a: { type: "scale", section: "opinions", group: "q19" },
    q19b: { type: "scale", section: "opinions", group: "q19" },
    q19c: { type: "scale", section: "opinions", group: "q19" },
    q19d: { type: "scale", section: "opinions", group: "q19" },
    q19e: { type: "scale", section: "opinions", group: "q19" },

    q20: { type: "text",     section: "closing", maxLength: 200 },
    q21: { type: "text",     section: "closing", maxLength: 200 },
    q22: { type: "textarea", section: "closing", maxLength: 800 },
    q23: { type: "single",   section: "closing" }
  };

  // Bivio sulla domanda 1: "Uomo" → percorso A; tutto il resto (anche domanda saltata) → B.
  function path(answers) {
    return answers && answers.q1 === "uomo" ? "A" : "B";
  }

  function sequence(answers) {
    return sections.apertura.concat(sections[path(answers)], sections.chiusura);
  }

  // Valore inviato nel campo nascosto "percorso"
  var pathLabel = { A: "uomo", B: "donna-altro" };

  return { sections: sections, questions: questions, path: path, sequence: sequence, pathLabel: pathLabel };
})();
