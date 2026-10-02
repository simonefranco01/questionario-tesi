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

var TITOLO_FORM = 'Questionario tesi – consumi maschili v2 (backend)';

// Form della prima versione: lo script lo chiude alle risposte (resta consultabile)
var VECCHIO_FORM_ID = '1hHKRPR11bpnVouLEt3G0sNRle6Kp-hg3JGqmszU-cUk';

var SCALA_MIN = 'Per niente d\'accordo';
var SCALA_MAX = 'Del tutto d\'accordo';
var AIUTO_SCALA = 'Quanto sei d\'accordo con queste affermazioni? 1 = per niente d\'accordo, 4 = del tutto d\'accordo';

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
var ZONE_CORPO = ['Petto', 'Addome', 'Schiena', 'Ascelle', 'Zona intima', 'Braccia', 'Gambe', 'Nessuna'];

// k = chiave usata nel config del sito · t = titolo della domanda nel form
var DOMANDE = [
  // Apertura
  { k: 'q1', type: 'single', t: '1. Come ti identifichi?', o: ['Uomo', 'Donna', 'Altro', 'Preferisco non rispondere'] },
  { k: 'q2', type: 'single', t: '2. Quanti anni hai?', o: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
  { k: 'q3', type: 'single', t: '3. In che zona d\'Italia vivi?', o: ['Nord', 'Centro', 'Sud e Isole', 'Non vivo in Italia'] },
  { k: 'q4', type: 'single', t: '4. Titolo di studio',
    o: ['Licenza media', 'Diploma', 'Laurea triennale', 'Laurea magistrale, a ciclo unico o vecchio ordinamento', 'Post-laurea'] },
  { k: 'q5', type: 'single', t: '5. Occupazione', o: ['Studente', 'Lavoratore dipendente', 'Lavoratore autonomo', 'Non occupato', 'Pensionato'] },

  // Percorso A (uomini)
  { k: 'q6', type: 'single', t: '6. Quante volte a settimana fai attività fisica?', o: ['Mai', 'Meno di 1', '1-2', '3-4', '5 o più'] },
  { k: 'q7', type: 'multi', t: '7. Che attività fai? (più risposte)',
    o: ['Palestra con pesi', 'Corsa', 'Calcio o calcetto', 'Tennis', 'Padel', 'Nuoto', 'Ciclismo', 'Calisthenics',
        'Sport da combattimento', 'Arrampicata', 'Altro sport', 'Nessuna'] },
  { k: 'q8', type: 'multi', t: '8. Perché la fai? (massimo 3 risposte)',
    o: ['Salute', 'Aspetto fisico', 'Forza', 'Benessere mentale', 'Stare con gli amici', 'Prestazione sportiva', 'Sentirmi più sicuro di me'] },
  { k: 'q9', type: 'multi', t: '9. Negli ultimi 12 mesi hai acquistato… (più risposte)', o: CONSUMI_BASE.concat(['Nessuno di questi']) },
  { k: 'q10', type: 'single', t: '10. Quanto spendi al mese, in media, per corpo e cura di sé (palestra inclusa)?',
    o: ['Da 0 a 50 €', 'Da 51 a 100 €', 'Oltre 100 €'] },
  { k: 'q10b', type: 'multi', t: '10b. Quando compri integratori o prodotti per la cura di sé, come scegli cosa comprare? (massimo 2 risposte)',
    o: ['Me li consiglia un amico', 'Me li consiglia un nutrizionista', 'Me li consiglia un influencer o creator',
        'Me li consiglia il mio personal trainer', 'Aspetto saldi e promozioni per comprare dal mio marchio di fiducia',
        'Compro marchi generalisti su Amazon', 'Compro regolarmente dal mio marchio di fiducia, anche senza sconti',
        'Confronto più marchi e compro prodotti diversi da marchi diversi', 'La marca non conta, conta solo la qualità',
        'La marca non conta, conta solo il prezzo'] },
  { k: 'q10c', type: 'multi', t: '10c. Cosa usi per la cura della barba o per raderti? (più risposte)',
    o: ['Rasoio a lamette', 'Rasoio elettrico', 'Regolabarba', 'Schiuma o gel da barba', 'Dopobarba', 'Olio o balsamo per barba',
        'Shampoo specifico per barba', 'Pettine o spazzola per barba', 'Vado dal barbiere per la barba', 'Nessuno di questi'] },
  { k: 'q10d', type: 'multi', t: '10d. Quali parti del corpo ti depili o ti radi, anche solo ogni tanto? (Barba esclusa)', o: ZONE_CORPO },
  { k: 'q10e', type: 'multi', t: '10e. Negli ultimi 12 mesi hai speso per qualcuno di questi? (più risposte)',
    o: ['Orologio di valore', 'Tecnologia di fascia alta (smartphone, console, gadget)', 'Attrezzi da lavoro o per il fai-da-te',
        'Abbigliamento firmato o sneakers da collezione', 'Gioielli o accessori da uomo (catene, anelli, bracciali)',
        'Accessori o modifiche per auto o moto', 'Corsi di crescita personale, finanza o “mentalità”', 'Trading o criptovalute',
        'Nessuno di questi'] },
  { k: 'q11', type: 'single', t: '11. Controlli quello che mangi per motivi legati all\'allenamento o all\'aspetto?',
    o: ['No', 'Ogni tanto', 'Sì, conto proteine o calorie', 'Seguo un piano di un professionista'] },
  { k: 'q12', type: 'multi', t: '12. Dove prendi informazioni su allenamento e alimentazione? (più risposte)',
    o: ['Influencer o creator', 'Amici', 'Personal trainer', 'Medico o nutrizionista', 'Forum e Reddit', 'Pubblicità',
        'Studio per conto mio (libri, manuali)', 'Nessuna fonte in particolare'] },
  { k: 'q13', type: 'single', t: '13. Con che frequenza guardi contenuti di fitness influencer?',
    o: ['Mai', 'Raramente', 'Qualche volta a settimana', 'Ogni giorno'] },
  { k: 'q15', type: 'single', t: '15. Nel tempo libero con gli amici, dove passi più tempo?',
    o: ['Bar o locali', 'Stadio o partite in TV', 'Palestra o sport', 'A casa', 'All\'aperto (escursioni, caccia, pesca)', 'Altro'] },
  { k: 'q17a', type: 'scale', t: '17a. Avere un fisico allenato rende un uomo più rispettato.' },
  { k: 'q17c', type: 'scale', t: '17c. È facile sentirsi a disagio quando il corpo di un uomo non corrisponde a certi standard.' },
  { k: 'q17d', type: 'scale', t: '17d. Andare a vedere una partita con i miei amici e bermi una buona birra è ancora centrale nella mia vita sociale.' },
  { k: 'q17e', type: 'scale', t: '17e. La palestra per me è anche un luogo dove stare con altre persone.' },
  { k: 'q17f', type: 'scale', t: '17f. Come appare fisicamente un uomo conta poco.' },
  { k: 'q17g', type: 'scale', t: '17g. Un uomo che si depila petto, braccia o gambe mi sembra meno maschile.' },
  { k: 'q17h', type: 'scale', t: '17h. Il barbecue e la griglia sono cose da uomini.' },
  { k: 'q17i', type: 'scale', t: '17i. L\'auto che un uomo guida dice molto di lui.' },

  // Percorso B (donne, altro, preferisco non rispondere)
  // B6-B10b: stesse domande e opzioni di 6, 9, 10 e 10b (vedi copiaDa_ più sotto)
  { k: 'qb6', copia: 'q6', t: 'B6. Quante volte a settimana fai attività fisica?' },
  { k: 'qb9', copia: 'q9', t: 'B9. Negli ultimi 12 mesi hai acquistato… (più risposte)' },
  { k: 'qb10', copia: 'q10', t: 'B10. Quanto spendi al mese, in media, per corpo e cura di sé (palestra inclusa)?' },
  { k: 'qb10b', copia: 'q10b', t: 'B10b. Quando compri integratori o prodotti per la cura di sé, come scegli cosa comprare? (massimo 2 risposte)' },
  // Domande su di lei (percorso B), aggiunte dopo il lancio della v2
  { k: 'qw1', type: 'single', t: 'W1. Quanto tempo dedichi alla cura di te (pelle, capelli, trucco) in una giornata normale?',
    o: ['Meno di 10 minuti', 'Da 10 a 20 minuti', 'Da 20 a 40 minuti', 'Più di 40 minuti'] },
  { k: 'qw2', type: 'multi', t: 'W2. Negli ultimi 6 mesi hai comprato qualcosa dopo averlo visto sui social? (più risposte)',
    o: ['Skincare', 'Trucco', 'Prodotti per capelli', 'Integratori', 'Abbigliamento o accessori', 'Niente di tutto questo'] },
  { k: 'qw3', type: 'single', t: 'W3. Ti è capitato di pagare di più un prodotto "da donna" rispetto alla versione da uomo o neutra?',
    o: ['Sì, spesso', 'Qualche volta', 'Non ci ho mai fatto caso', 'No'] },
  { k: 'qw4', type: 'multi', t: 'W4. Cosa ti convince di più a provare un prodotto nuovo? (massimo 2 risposte)',
    o: ['Le recensioni online', "Il consiglio di un'amica", 'Influencer o creator', 'Farmacista o dermatologo',
        'Uno sconto o una promozione', 'Gli ingredienti in etichetta'] },
  { k: 'qw5a', type: 'scale', t: 'W5a. Ho comprato prodotti di bellezza che poi non ho mai finito.' },
  { k: 'qw5b', type: 'scale', t: 'W5b. Certe pubblicità mi fanno sentire che al mio aspetto manca sempre qualcosa.' },
  { k: 'q18a', type: 'multi', t: '18a. Quali di questi consumi associ oggi a un uomo "virile"? (corpo e cura, più risposte)',
    o: CONSUMI_BASE.concat(['Nessuno di questi']) },
  { k: 'q18b', type: 'multi', t: '18b. E tra questi, quali associ oggi a un uomo "virile"? (tempo libero e status, più risposte)',
    o: ['Calcio allo stadio o in TV', 'Birra con gli amici', 'Auto e motori', 'Carne alla griglia e barbecue', 'Orologi di valore',
        'Attrezzi e fai-da-te', 'Abbigliamento firmato o sneakers da collezione', 'Gioielli da uomo', 'Caccia e pesca',
        'Investimenti, trading e criptovalute', 'Nessuno di questi'] },
  { k: 'q18c', type: 'multi', t: '18c. Secondo te, quali parti del corpo un uomo curato dovrebbe depilarsi o radersi? (Barba esclusa)',
    o: ZONE_CORPO.concat(['È una scelta sua, non ho preferenze']) },
  { k: 'q19a', type: 'scale', t: '19a. Un uomo con un fisico allenato è più attraente.' },
  { k: 'q19b', type: 'scale', t: '19b. Trovo normale che un uomo usi prodotti per la cura del viso.' },
  { k: 'q19c', type: 'scale', t: '19c. Un uomo che passa molto tempo in palestra dà un\'immagine di sé troppo costruita.' },
  { k: 'q19d', type: 'scale', t: '19d. Gli uomini oggi subiscono una pressione sull\'aspetto fisico simile a quella che subiscono le donne.' },
  { k: 'q19e', type: 'scale', t: '19e. Come appare fisicamente un uomo conta poco.' },
  { k: 'q19f', type: 'scale', t: '19f. Un uomo che si depila petto, braccia o gambe mi sembra meno maschile.' },
  { k: 'q19g', type: 'scale', t: '19g. Il barbecue e la griglia sono cose da uomini.' },
  { k: 'q19h', type: 'scale', t: '19h. L\'auto che un uomo guida dice molto di lui.' },

  // Chiusura
  { k: 'qbarba', type: 'single', t: 'Barba. Pensando alla barba di un uomo, quale di queste frasi si avvicina di più a quello che pensi?',
    o: ['Una barba ben curata indica più attenzione a sé rispetto a un viso rasato',
        'Un uomo ordinato si rade regolarmente e ha il viso pulito',
        'Una barba incolta dà un\'idea di trascuratezza',
        'Per me è indifferente: la barba non dice niente su quanto un uomo si cura'] },
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

// Le domande B6-B10b prendono tipo e opzioni dalle corrispondenti del percorso A
DOMANDE.forEach(function (d) {
  if (!d.copia) return;
  var src = DOMANDE.filter(function (x) { return x.k === d.copia; })[0];
  d.type = src.type;
  d.o = src.o;
});

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
        it = form.addScaleItem().setTitle(d.t).setBounds(1, 4).setLabels(SCALA_MIN, SCALA_MAX).setHelpText(AIUTO_SCALA);
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

  // Chiude alle risposte il form della prima versione
  prova_(function () { FormApp.openById(VECCHIO_FORM_ID).setAcceptingResponses(false); console.log('Vecchio form chiuso alle risposte.'); });

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

/*
 * AGGIUNTA AL FORM ESISTENTE (v2): crea solo le domande "qw" nel form già in uso,
 * senza toccare le altre, e stampa le righe da aggiungere a config.js.
 * Eseguire UNA volta sola.
 */
var FORM_V2_ID = '137ISg9m8NWY3LpN1ECZ2zaEan6pZ-wlsMZSpG-r31OY';
function aggiungiDomandeDonne() {
  var form = FormApp.openById(FORM_V2_ID);
  var esistenti = form.getItems().map(function (it) { return it.getTitle(); });
  var righe = [];
  DOMANDE.filter(function (d) { return d.k.indexOf('qw') === 0; }).forEach(function (d) {
    if (esistenti.indexOf(d.t) !== -1) throw new Error('Domanda già presente: ' + d.t);
    var it, r;
    switch (d.type) {
      case 'single': it = form.addMultipleChoiceItem().setTitle(d.t).setChoiceValues(d.o); r = it.createResponse(d.o[0]); break;
      case 'multi': it = form.addCheckboxItem().setTitle(d.t).setChoiceValues(d.o); r = it.createResponse([d.o[0]]); break;
      case 'scale': it = form.addScaleItem().setTitle(d.t).setBounds(1, 4).setLabels(SCALA_MIN, SCALA_MAX).setHelpText(AIUTO_SCALA); r = it.createResponse(1); break;
    }
    it.setRequired(false);
    var m = form.createResponse().withItemResponse(r).toPrefilledUrl().match(/entry\.(\d+)=/);
    righe.push('    ' + d.k + ': "entry.' + m[1] + '",');
  });
  console.log('===== RIGHE PER config.js =====\n' + righe.join('\n') + '\n===== FINE =====');
}
