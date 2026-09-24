/**
 * CREA IL GOOGLE FORM "BACKEND" DEL QUESTIONARIO
 * ==============================================
 * 1. Vai su https://script.google.com → Nuovo progetto
 * 2. Incolla tutto questo file al posto del codice di esempio e salva
 * 3. Seleziona la funzione "creaQuestionario" e premi Esegui
 * 4. Autorizza (la prima volta Google avvisa che l'app non è verificata:
 *    Avanzate → Vai a … (non sicuro). È il tuo script, gira sul tuo account.)
 * 5. Apri "Log di esecuzione": copia il blocco tra le righe ===== e incollalo
 *    al posto di tutto il contenuto di assets/config.js
 *
 * Il form ha una sola sezione, nessuna domanda obbligatoria, non raccoglie email
 * ed è collegato a un nuovo Google Sheet.
 *
 * IMPORTANTE: le etichette delle opzioni devono essere IDENTICHE ai valori "it"
 * di assets/i18n.js. Se Google riceve un valore che non è tra le opzioni di una
 * domanda a scelta, scarta l'intera risposta.
 */

var TITOLO_FORM = 'Questionario tesi – consumi maschili (backend)';

var SCALA_MIN = 'Per niente d\'accordo';
var SCALA_MAX = 'Del tutto d\'accordo';
var AIUTO_SCALA = 'Quanto sei d\'accordo con queste affermazioni? 1 = per niente d\'accordo, 5 = del tutto d\'accordo';
var AIUTO_16 = 'Rispetto a cinque anni fa, spendi di più, di meno o uguale per…';

var CONSUMI_BASE = [
  'Integratori proteici',
  'Altri integratori (creatina, vitamine…)',
  'Abbonamento palestra',
  'App o programmi di allenamento',
  'Abbigliamento sportivo',
  'Prodotti per la cura del viso',
  'Prodotti per barba o capelli',
  'Profumi',
  'Trattamenti estetici (depilazione, centro estetico)'
];
var PIU_UGUALE_MENO = ['Di più', 'Uguale', 'Di meno'];

// k = chiave usata nel config del sito · t = titolo della domanda nel form
var DOMANDE = [
  // Apertura
  { k: 'q1', type: 'single', t: '1. Come ti identifichi?', o: ['Uomo', 'Donna', 'Altro', 'Preferisco non rispondere'] },
  { k: 'q2', type: 'single', t: '2. Quanti anni hai?', o: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
  { k: 'q3', type: 'single', t: '3. In che zona d\'Italia vivi?', o: ['Nord', 'Centro', 'Sud e Isole'] },
  { k: 'q4', type: 'single', t: '4. Titolo di studio', o: ['Licenza media', 'Diploma', 'Laurea', 'Post-laurea'] },
  { k: 'q5', type: 'single', t: '5. Occupazione', o: ['Studente', 'Lavoratore dipendente', 'Lavoratore autonomo', 'Non occupato', 'Pensionato'] },

  // Percorso A (uomini)
  { k: 'q6', type: 'single', t: '6. Quante volte a settimana fai attività fisica?', o: ['Mai', 'Meno di 1', '1-2', '3-4', '5 o più'] },
  { k: 'q7', type: 'multi', t: '7. Che attività fai? (più risposte)',
    o: ['Palestra con pesi', 'Corsa', 'Calcio o calcetto', 'Tennis', 'Padel', 'Nuoto', 'Ciclismo', 'Calisthenics',
        'Sport da combattimento', 'Arrampicata', 'Altro sport', 'Nessuna'] },
  { k: 'q8', type: 'multi', t: '8. Perché la fai? (massimo 2 risposte)',
    o: ['Salute', 'Aspetto fisico', 'Forza', 'Benessere mentale', 'Stare con gli amici', 'Prestazione sportiva', 'Sentirmi più sicuro di me'] },
  { k: 'q9', type: 'multi', t: '9. Negli ultimi 12 mesi hai acquistato… (più risposte)', o: CONSUMI_BASE.concat(['Nessuno di questi']) },
  { k: 'q10', type: 'single', t: '10. Quanto spendi al mese, in media, per corpo e cura di sé (palestra inclusa)?',
    o: ['Da 0 a 50 €', 'Da 51 a 100 €', 'Oltre 100 €'] },
  { k: 'q11', type: 'single', t: '11. Controlli quello che mangi per motivi legati all\'allenamento o all\'aspetto?',
    o: ['No', 'Ogni tanto', 'Sì, conto proteine o calorie', 'Seguo un piano di un professionista'] },
  { k: 'q12', type: 'multi', t: '12. Dove prendi informazioni su allenamento e alimentazione? (più risposte)',
    o: ['Influencer o creator', 'Amici', 'Personal trainer', 'Medico o nutrizionista', 'Forum e Reddit', 'Pubblicità', 'Nessuna fonte in particolare'] },
  { k: 'q13', type: 'single', t: '13. Con che frequenza guardi contenuti di fitness influencer?',
    o: ['Mai', 'Raramente', 'Qualche volta a settimana', 'Ogni giorno'] },
  { k: 'q14', type: 'single', t: '14. Hai mai comprato un prodotto consigliato da un influencer o creator di fitness?', o: ['Sì', 'No', 'Non ricordo'] },
  { k: 'q15', type: 'single', t: '15. Nel tempo libero con gli amici, dove passi più tempo?',
    o: ['Bar o locali', 'Stadio o partite in TV', 'Palestra o sport', 'A casa', 'Altro'] },
  { k: 'q16a', type: 'single', t: '16a. Spesa rispetto a cinque anni fa: Palestra e sport', o: PIU_UGUALE_MENO, help: AIUTO_16 },
  { k: 'q16b', type: 'single', t: '16b. Spesa rispetto a cinque anni fa: Uscite al bar', o: PIU_UGUALE_MENO, help: AIUTO_16 },
  { k: 'q16c', type: 'single', t: '16c. Spesa rispetto a cinque anni fa: Cura dell\'aspetto', o: PIU_UGUALE_MENO, help: AIUTO_16 },
  { k: 'q17a', type: 'scale', t: '17a. Avere un fisico allenato rende un uomo più rispettato.' },
  { k: 'q17b', type: 'scale', t: '17b. Un uomo che cura molto il proprio aspetto oggi è visto meglio di vent\'anni fa.' },
  { k: 'q17c', type: 'scale', t: '17c. Mi capita di sentirmi a disagio se il mio corpo non corrisponde a certi standard.' },
  { k: 'q17d', type: 'scale', t: '17d. Andare a vedere una partita con i miei amici e bermi una buona birra è ancora centrale nella mia vita sociale.' },
  { k: 'q17e', type: 'scale', t: '17e. La palestra per me è anche un luogo dove stare con altre persone.' },
  { k: 'q17f', type: 'scale', t: '17f. Come appare fisicamente un uomo conta poco.' },

  // Percorso B (donne, altro, preferisco non rispondere)
  { k: 'q18', type: 'multi', t: '18. Quali di questi consumi associ oggi a un uomo "virile"? (più risposte)',
    o: CONSUMI_BASE.concat(['Calcio allo stadio o in TV', 'Birra con gli amici', 'Auto e motori', 'Nessuno di questi']) },
  { k: 'q19a', type: 'scale', t: '19a. Un uomo con un fisico allenato è più attraente.' },
  { k: 'q19b', type: 'scale', t: '19b. Trovo normale che un uomo usi prodotti per la cura del viso.' },
  { k: 'q19c', type: 'scale', t: '19c. Un uomo che passa molto tempo in palestra dà un\'immagine di sé troppo costruita.' },
  { k: 'q19d', type: 'scale', t: '19d. Gli uomini oggi subiscono una pressione sull\'aspetto fisico simile a quella che subiscono le donne.' },
  { k: 'q19e', type: 'scale', t: '19e. Come appare fisicamente un uomo conta poco.' },

  // Chiusura
  { k: 'q20', type: 'text', t: '20. C\'è una pubblicità o un marchio che secondo te rappresenta l\'uomo di oggi? Quale?' },
  { k: 'q21', type: 'text', t: '21. Pensando agli uomini della generazione dei tuoi genitori, quali attività o consumi associ al loro "essere uomini"?' },
  { k: 'q22', type: 'paragraph', t: '22. E oggi, secondo te, cosa fa sentire un uomo "uomo"?' },
  { k: 'q23', type: 'single', t: '23. Come sei arrivato/a a questo questionario?', o: ['Pubblicità sui social', 'Condiviso da un amico', 'Altro'] },

  // Campi nascosti (compilati dal sito)
  { k: 'lingua', type: 'text', t: 'lingua', help: 'Campo tecnico compilato dal sito: it / en' },
  { k: 'percorso', type: 'text', t: 'percorso', help: 'Campo tecnico compilato dal sito: uomo / donna-altro' },
  { k: 'durata', type: 'text', t: 'durata_secondi', help: 'Campo tecnico compilato dal sito: durata della compilazione in secondi' },
  { k: 'sorgente', type: 'text', t: 'sorgente', help: 'Campo tecnico compilato dal sito: valore del parametro ?src= del link' },
  { k: 'inizio', type: 'text', t: 'inizio', help: 'Campo tecnico compilato dal sito: data e ora di inizio (AAAA-MM-GG hh:mm:ss)' }
];

function creaQuestionario() {
  var form = FormApp.create(TITOLO_FORM);
  form.setDescription('Questo form fa da archivio per il questionario pubblicato su GitHub Pages. ' +
    'Le risposte arrivano dal sito: non condividere questo link.');

  // Impostazioni: niente email, niente login, risposte illimitate
  form.setCollectEmail(false);
  prova_(function () { form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT); });
  prova_(function () { form.setRequireLogin(false); });           // esiste solo per account Workspace
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(false);
  form.setAcceptingResponses(true);

  var items = {};
  DOMANDE.forEach(function (d) {
    var it;
    switch (d.type) {
      case 'single':
        it = form.addMultipleChoiceItem().setTitle(d.t).setChoiceValues(d.o);
        break;
      case 'multi':
        it = form.addCheckboxItem().setTitle(d.t).setChoiceValues(d.o);
        break;
      case 'scale':
        it = form.addScaleItem().setTitle(d.t).setBounds(1, 5).setLabels(SCALA_MIN, SCALA_MAX).setHelpText(AIUTO_SCALA);
        break;
      case 'paragraph':
        it = form.addParagraphTextItem().setTitle(d.t);
        break;
      default:
        it = form.addTextItem().setTitle(d.t);
    }
    if (d.help) it.setHelpText(d.help);
    it.setRequired(false);
    items[d.k] = it;
  });

  // Foglio collegato
  var ss = SpreadsheetApp.create('Risposte – ' + TITOLO_FORM);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Pubblicazione (nei form nuovi Google richiede la pubblicazione esplicita)
  prova_(function () { if (typeof form.setPublished === 'function') form.setPublished(true); });

  // Codici entry: un link precompilato per domanda, così ogni codice è certo
  var entries = {};
  var tutto = form.createResponse();
  DOMANDE.forEach(function (d) {
    var it = items[d.k];
    var r;
    switch (d.type) {
      case 'single': r = it.createResponse(d.o[0]); break;
      case 'multi': r = it.createResponse([d.o[0]]); break;
      case 'scale': r = it.createResponse(1); break;
      default: r = it.createResponse('x');
    }
    var url = form.createResponse().withItemResponse(r).toPrefilledUrl();
    var m = url.match(/entry\.(\d+)=/);
    if (!m) throw new Error('Codice entry non trovato per ' + d.k + ': ' + url);
    entries[d.k] = 'entry.' + m[1];
    tutto.withItemResponse(r);
  });

  var formAction = form.getPublishedUrl().replace(/\/viewform.*$/, '/formResponse');

  // Blocco pronto per assets/config.js
  var righe = DOMANDE.map(function (d, i) {
    return '    ' + d.k + ': "' + entries[d.k] + '"' + (i < DOMANDE.length - 1 ? ',' : '');
  });
  var config =
    'window.SURVEY_CONFIG = {\n' +
    '  formAction: "' + formAction + '",\n' +
    '  entries: {\n' + righe.join('\n') + '\n  }\n' +
    '};';

  console.log('Form (modifica): ' + form.getEditUrl());
  console.log('Form (pubblico): ' + form.getPublishedUrl());
  console.log('Foglio risposte: ' + ss.getUrl());
  console.log('Link precompilato di controllo (tutte le domande):\n' + tutto.toPrefilledUrl());
  console.log('===== COPIA DA QUI E INCOLLA IN assets/config.js =====\n' + config + '\n===== FINE =====');
}

function prova_(fn) {
  try { fn(); } catch (e) { console.log('(impostazione saltata: ' + e.message + ')'); }
}
