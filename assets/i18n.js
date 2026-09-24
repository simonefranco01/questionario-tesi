/*
 * TUTTI I TESTI DEL SITO, IN ITALIANO E INGLESE
 * ============================================
 * Ogni testo ha la forma { it: "...", en: "..." }, una lingua accanto all'altra,
 * così la revisione delle traduzioni si fa leggendo questo file dall'alto in basso.
 *
 * ATTENZIONE: le etichette "it" delle opzioni sono i valori che finiscono nel
 * Google Sheet e devono essere IDENTICHE a quelle in apps-script/crea-form.gs.
 * Se ne cambi una qui, cambiala anche lì (e ricrea il form), altrimenti Google
 * rifiuta la risposta.
 *
 * Gli "id" delle opzioni sono interni: non cambiarli.
 */
(function () {
  function o(id, it, en) { return { id: id, it: it, en: en }; }

  var ui = {
    docTitle:      { it: "Questionario di tesi · Uomini e consumi", en: "Thesis questionnaire · Men and consumption" },
    brand:         { it: "Questionario di tesi", en: "Thesis questionnaire" },
    langLabel:     { it: "Lingua", en: "Language" },
    progressLabel: { it: "Avanzamento", en: "Progress" },

    // Audio
    listen:          { it: "Ascolta", en: "Listen" },
    stopListen:      { it: "Stop", en: "Stop" },
    autoRead:        { it: "Lettura auto", en: "Auto read" },
    autoReadLong:    { it: "Lettura automatica delle domande", en: "Read each question aloud" },
    autoReadOn:      { it: "Lettura automatica attiva", en: "Auto read on" },
    autoReadOff:     { it: "Lettura automatica disattivata", en: "Auto read off" },
    speechUnavailable: { it: "La lettura vocale non è disponibile in questo browser.", en: "Text-to-speech isn't available in this browser." },
    scaleSpeech:     { it: "Da 1, {min}, a 5, {max}.", en: "From 1, {min}, to 5, {max}." },

    // Benvenuto
    eyebrow:      { it: "Tesi magistrale · Sociologia del consumo", en: "Master's thesis · Sociology of consumption" },
    welcomeTitle: { it: "Uomini e consumi, oggi.", en: "Men and consumption, today." },
    welcomeLead:  { it: "Un questionario su abitudini, acquisti e opinioni legati al corpo, al tempo libero e all'essere uomini.",
                    en: "A questionnaire about habits, purchases and opinions related to the body, free time and being a man." },
    factTime:     { it: "5–7 minuti", en: "5–7 minutes" },
    factAnon:     { it: "Anonimo", en: "Anonymous" },
    factOne:      { it: "Una domanda alla volta", en: "One question at a time" },
    welcomeNote:  { it: "Possono rispondere tutte e tutti, dai 18 anni in su. Alcune domande cambiano in base alle risposte.",
                    en: "Anyone aged 18 or over can take part. Some questions change depending on your answers." },
    start:        { it: "Inizia", en: "Start" },
    resume:       { it: "Riprendi", en: "Resume" },
    resumeInfo:   { it: "Eri arrivato/a alla domanda {n} di {t}.", en: "You'd reached question {n} of {t}." },
    resumePrivacy:{ it: "Eri arrivato/a all'informativa.", en: "You'd reached the privacy notice." },
    restart:      { it: "Ricomincia da capo", en: "Start over" },

    // Privacy
    privacyTitle: { it: "Prima di iniziare", en: "Before you start" },
    privacyIntro: {
      it: "Questo questionario fa parte della tesi di laurea magistrale di [NOME COGNOME], corso di laurea in [CORSO DI LAUREA], [UNIVERSITÀ].",
      en: "This questionnaire is part of the master's thesis of [NOME COGNOME], degree course in [CORSO DI LAUREA], [UNIVERSITÀ]."
    },
    privacyPoints: {
      it: [
        "È anonimo: non chiede e non registra nomi, indirizzi email o altri dati che possano identificarti.",
        "Oltre alle risposte vengono registrati solo dati tecnici: lingua scelta, durata della compilazione, data e ora di inizio e la campagna da cui arrivi.",
        "Le risposte sono conservate in un foglio Google accessibile solo all'autore della tesi, analizzate in forma aggregata e usate esclusivamente per la tesi.",
        "Puoi saltare qualsiasi domanda e interrompere quando vuoi. Il browser conserva i progressi su questo dispositivo per farti riprendere e li cancella dopo l'invio."
      ],
      en: [
        "It's anonymous: it doesn't ask for or record names, email addresses or any other data that could identify you.",
        "Besides your answers, only technical data is recorded: chosen language, time taken, start date and time, and the campaign you came from.",
        "Answers are stored in a Google Sheet that only the author of the thesis can access, analysed in aggregate form and used solely for the thesis.",
        "You can skip any question and stop whenever you like. Your browser keeps your progress on this device so you can resume, and deletes it after you submit."
      ]
    },
    privacyContact: { it: "Per informazioni: [EMAIL DI CONTATTO]", en: "For information: [EMAIL DI CONTATTO]" },
    consentPrivacy: { it: "Ho letto e acconsento al trattamento dei dati", en: "I have read and consent to the processing of my data" },
    consentAge:     { it: "Ho almeno 18 anni", en: "I am at least 18 years old" },
    consentError:   { it: "Per continuare servono entrambe le conferme.", en: "Both confirmations are needed to continue." },
    continue:       { it: "Continua", en: "Continue" },

    // Navigazione
    back: { it: "Indietro", en: "Back" },
    skip: { it: "Salta", en: "Skip" },
    next: { it: "Avanti", en: "Next" },
    send: { it: "Invia", en: "Submit" },
    count:    { it: "{n} di {t}", en: "{n} of {t}" },
    announce: { it: "Domanda {n} di {t}", en: "Question {n} of {t}" },

    // Etichette di sezione (testi di passaggio: non commentano mai le risposte)
    sec_about:       { it: "Su di te", en: "About you" },
    sec_body:        { it: "Movimento e consumi", en: "Exercise and spending" },
    sec_opinions:    { it: "Opinioni", en: "Opinions" },
    sec_consumption: { it: "Consumi", en: "Consumption" },
    sec_closing:     { it: "Per chiudere", en: "To wrap up" },
    msHalf:   { it: "Metà strada", en: "Halfway there" },
    msAlmost: { it: "Quasi fatto", en: "Almost done" },
    msLast:   { it: "Ultima domanda", en: "Last question" },

    // Suggerimenti sotto le domande
    hintMulti:   { it: "Più risposte", en: "Multiple answers" },
    hintMax:     { it: "Massimo {n} risposte", en: "Maximum {n} answers" },
    maxReached:  { it: "Puoi sceglierne al massimo {n}. Togline una per cambiarla.", en: "You can choose up to {n}. Remove one to change it." },
    nudge:       { it: "Scegli una risposta, oppure tocca “Salta”.", en: "Choose an answer, or tap “Skip”." },
    placeholder: { it: "Scrivi qui…", en: "Type here…" },
    charsLeft:   { it: "{n} caratteri disponibili", en: "{n} characters left" },

    // Invio e fine
    sending:      { it: "Invio in corso…", en: "Sending…" },
    sendingSub:   { it: "Un attimo e abbiamo finito.", en: "One moment and we're done." },
    doneTitle:    { it: "Fatto. Grazie.", en: "Done. Thank you." },
    doneBody:     { it: "Le tue risposte sono state inviate. Se conosci qualcuno che potrebbe rispondere, passagli il link.",
                    en: "Your answers have been sent. If you know someone who could take part, pass the link on." },
    share:        { it: "Condividi il link", en: "Share the link" },
    shareText:    { it: "Questionario anonimo per una tesi magistrale su consumi e stili di vita. Ci vogliono 5–7 minuti.",
                    en: "Anonymous questionnaire for a master's thesis on consumption and lifestyles. It takes 5–7 minutes." },
    copied:       { it: "Link copiato", en: "Link copied" },
    copyManual:   { it: "Copia questo link:", en: "Copy this link:" },
    alreadyTitle: { it: "Hai già risposto, grazie.", en: "You've already answered, thank you." },
    alreadyBody:  { it: "Su questo dispositivo il questionario risulta già compilato. Se vuoi, puoi condividerlo con qualcun altro.",
                    en: "This questionnaire has already been completed on this device. You're welcome to share it with someone else." },
    errorTitle:   { it: "Invio non riuscito", en: "Couldn't send your answers" },
    errorBody:    { it: "Sembra che la connessione non sia disponibile. Le risposte sono ancora salvate su questo dispositivo: riprova tra un momento.",
                    en: "The connection seems to be unavailable. Your answers are still saved on this device: try again in a moment." },
    retry:        { it: "Riprova", en: "Try again" },
    backToQuestions: { it: "Torna alle domande", en: "Back to the questions" },

    // Modalità test
    testBadge:     { it: "TEST", en: "TEST" },
    notConfigured: { it: "NON CONFIGURATO", en: "NOT CONFIGURED" },
    testIntro:     { it: "Modalità test: non è stato inviato nulla. Questo è il payload che sarebbe partito verso il Google Form:",
                     en: "Test mode: nothing was sent. This is the payload that would have gone to the Google Form:" }
  };

  // ------------------------------------------------------------------
  // DOMANDE E OPZIONI
  // Il testo italiano è quello definitivo della tesi: non modificarlo.
  // ------------------------------------------------------------------
  var questions = {
    // ---------- APERTURA ----------
    q1: {
      text: { it: "Come ti identifichi?", en: "How do you identify?" },
      options: [
        o("uomo", "Uomo", "Man"),
        o("donna", "Donna", "Woman"),
        o("altro", "Altro", "Other"),
        o("pnr", "Preferisco non rispondere", "Prefer not to answer")
      ]
    },
    q2: {
      text: { it: "Quanti anni hai?", en: "How old are you?" },
      options: [
        o("18_24", "18-24", "18-24"),
        o("25_34", "25-34", "25-34"),
        o("35_44", "35-44", "35-44"),
        o("45_54", "45-54", "45-54"),
        o("55_64", "55-64", "55-64"),
        o("65", "65+", "65+")
      ]
    },
    q3: {
      text: { it: "In che zona d'Italia vivi?", en: "Which part of Italy do you live in?" },
      options: [
        o("nord", "Nord", "North"),
        o("centro", "Centro", "Centre"),
        o("sud", "Sud e Isole", "South and Islands")
      ]
    },
    q4: {
      text: { it: "Titolo di studio", en: "Educational qualification" },
      options: [
        o("media", "Licenza media", "Lower secondary school"),
        o("diploma", "Diploma", "Upper secondary diploma"),
        o("laurea", "Laurea", "University degree"),
        o("post", "Post-laurea", "Postgraduate degree")
      ]
    },
    q5: {
      text: { it: "Occupazione", en: "Occupation" },
      options: [
        o("studente", "Studente", "Student"),
        o("dipendente", "Lavoratore dipendente", "Employee"),
        o("autonomo", "Lavoratore autonomo", "Self-employed"),
        o("non_occupato", "Non occupato", "Not employed"),
        o("pensionato", "Pensionato", "Retired")
      ]
    },

    // ---------- PERCORSO A (uomini) ----------
    q6: {
      text: { it: "Quante volte a settimana fai attività fisica?", en: "How many times a week do you do physical activity?" },
      options: [
        o("mai", "Mai", "Never"),
        o("meno1", "Meno di 1", "Less than 1"),
        o("1_2", "1-2", "1-2"),
        o("3_4", "3-4", "3-4"),
        o("5piu", "5 o più", "5 or more")
      ]
    },
    q7: {
      text: { it: "Che attività fai?", en: "What activities do you do?" },
      options: [
        o("pesi", "Palestra con pesi", "Gym with weights"),
        o("corsa", "Corsa", "Running"),
        o("calcio", "Calcio o calcetto", "Football or five-a-side"),
        o("tennis", "Tennis", "Tennis"),
        o("padel", "Padel", "Padel"),
        o("nuoto", "Nuoto", "Swimming"),
        o("ciclismo", "Ciclismo", "Cycling"),
        o("calisthenics", "Calisthenics", "Calisthenics"),
        o("combattimento", "Sport da combattimento", "Combat sports"),
        o("arrampicata", "Arrampicata", "Climbing"),
        o("altro", "Altro sport", "Other sport"),
        o("nessuna", "Nessuna", "None")
      ]
    },
    q8: {
      text: { it: "Perché la fai?", en: "Why do you do it?" },
      options: [
        o("salute", "Salute", "Health"),
        o("aspetto", "Aspetto fisico", "Physical appearance"),
        o("forza", "Forza", "Strength"),
        o("mentale", "Benessere mentale", "Mental well-being"),
        o("amici", "Stare con gli amici", "Being with friends"),
        o("prestazione", "Prestazione sportiva", "Sports performance"),
        o("sicurezza", "Sentirmi più sicuro di me", "Feeling more self-confident")
      ]
    },
    q9: {
      text: { it: "Negli ultimi 12 mesi hai acquistato…", en: "In the last 12 months, have you bought…" },
      options: [
        o("proteici", "Integratori proteici", "Protein supplements"),
        o("integratori", "Altri integratori (creatina, vitamine…)", "Other supplements (creatine, vitamins…)"),
        o("palestra", "Abbonamento palestra", "Gym membership"),
        o("app", "App o programmi di allenamento", "Training apps or programmes"),
        o("abbigliamento", "Abbigliamento sportivo", "Sportswear"),
        o("viso", "Prodotti per la cura del viso", "Facial care products"),
        o("barba", "Prodotti per barba o capelli", "Beard or hair products"),
        o("profumi", "Profumi", "Fragrances"),
        o("estetici", "Trattamenti estetici (depilazione, centro estetico)", "Beauty treatments (hair removal, beauty salon)"),
        o("nessuno", "Nessuno di questi", "None of these")
      ]
    },
    q10: {
      text: { it: "Quanto spendi al mese, in media, per corpo e cura di sé (palestra inclusa)?",
              en: "How much do you spend per month, on average, on your body and self-care (gym included)?" },
      options: [
        o("0_50", "Da 0 a 50 €", "€0 to €50"),
        o("51_100", "Da 51 a 100 €", "€51 to €100"),
        o("100", "Oltre 100 €", "Over €100")
      ]
    },
    q11: {
      text: { it: "Controlli quello che mangi per motivi legati all'allenamento o all'aspetto?",
              en: "Do you monitor what you eat for reasons related to training or appearance?" },
      options: [
        o("no", "No", "No"),
        o("tanto", "Ogni tanto", "Sometimes"),
        o("conto", "Sì, conto proteine o calorie", "Yes, I count protein or calories"),
        o("piano", "Seguo un piano di un professionista", "I follow a plan from a professional")
      ]
    },
    q12: {
      text: { it: "Dove prendi informazioni su allenamento e alimentazione?", en: "Where do you get information about training and nutrition?" },
      options: [
        o("influencer", "Influencer o creator", "Influencers or creators"),
        o("amici", "Amici", "Friends"),
        o("pt", "Personal trainer", "Personal trainer"),
        o("medico", "Medico o nutrizionista", "Doctor or nutritionist"),
        o("forum", "Forum e Reddit", "Forums and Reddit"),
        o("pubblicita", "Pubblicità", "Advertising"),
        o("nessuna_fonte", "Nessuna fonte in particolare", "No particular source")
      ]
    },
    q13: {
      text: { it: "Con che frequenza guardi contenuti di fitness influencer?", en: "How often do you watch content by fitness influencers?" },
      options: [
        o("mai", "Mai", "Never"),
        o("raramente", "Raramente", "Rarely"),
        o("settimana", "Qualche volta a settimana", "A few times a week"),
        o("giorno", "Ogni giorno", "Every day")
      ]
    },
    q14: {
      text: { it: "Hai mai comprato un prodotto consigliato da un influencer o creator di fitness?",
              en: "Have you ever bought a product recommended by a fitness influencer or creator?" },
      options: [
        o("si", "Sì", "Yes"),
        o("no", "No", "No"),
        o("non_ricordo", "Non ricordo", "I don't remember")
      ]
    },
    q15: {
      text: { it: "Nel tempo libero con gli amici, dove passi più tempo?", en: "In your free time with friends, where do you spend the most time?" },
      options: [
        o("bar", "Bar o locali", "Bars or venues"),
        o("stadio", "Stadio o partite in TV", "Stadium or matches on TV"),
        o("palestra", "Palestra o sport", "Gym or sport"),
        o("casa", "A casa", "At home"),
        o("altro", "Altro", "Other")
      ]
    },
    q16: {
      text: { it: "Rispetto a cinque anni fa, spendi di più, di meno o uguale per…",
              en: "Compared with five years ago, do you spend more, less or the same on…" },
      rows: [
        o("q16a", "Palestra e sport", "Gym and sport"),
        o("q16b", "Uscite al bar", "Going out to bars"),
        o("q16c", "Cura dell'aspetto", "Care of your appearance")
      ],
      options: [
        o("piu", "Di più", "More"),
        o("uguale", "Uguale", "The same"),
        o("meno", "Di meno", "Less")
      ]
    },
    q17: {
      text: { it: "Quanto sei d'accordo con queste affermazioni?", en: "How much do you agree with these statements?" },
      min: { it: "per niente d'accordo", en: "do not agree at all" },
      max: { it: "del tutto d'accordo", en: "completely agree" }
    },
    q17a: { text: { it: "Avere un fisico allenato rende un uomo più rispettato.", en: "Having a trained body makes a man more respected." } },
    q17b: { text: { it: "Un uomo che cura molto il proprio aspetto oggi è visto meglio di vent'anni fa.",
                    en: "A man who takes great care of his appearance is seen more favourably today than twenty years ago." } },
    q17c: { text: { it: "Mi capita di sentirmi a disagio se il mio corpo non corrisponde a certi standard.",
                    en: "I sometimes feel uncomfortable if my body doesn't match certain standards." } },
    q17d: { text: { it: "Andare a vedere una partita con i miei amici e bermi una buona birra è ancora centrale nella mia vita sociale.",
                    en: "Going to watch a match with my friends and having a good beer is still central to my social life." } },
    q17e: { text: { it: "La palestra per me è anche un luogo dove stare con altre persone.",
                    en: "For me, the gym is also a place to be with other people." } },
    q17f: { text: { it: "Come appare fisicamente un uomo conta poco.", en: "How a man looks physically matters little." } },

    // ---------- PERCORSO B (donne, altro, preferisco non rispondere) ----------
    q18: {
      text: { it: "Quali di questi consumi associ oggi a un uomo “virile”?", en: "Which of these types of consumption do you associate today with a “manly” man?" },
      options: [
        o("proteici", "Integratori proteici", "Protein supplements"),
        o("integratori", "Altri integratori (creatina, vitamine…)", "Other supplements (creatine, vitamins…)"),
        o("palestra", "Abbonamento palestra", "Gym membership"),
        o("app", "App o programmi di allenamento", "Training apps or programmes"),
        o("abbigliamento", "Abbigliamento sportivo", "Sportswear"),
        o("viso", "Prodotti per la cura del viso", "Facial care products"),
        o("barba", "Prodotti per barba o capelli", "Beard or hair products"),
        o("profumi", "Profumi", "Fragrances"),
        o("estetici", "Trattamenti estetici (depilazione, centro estetico)", "Beauty treatments (hair removal, beauty salon)"),
        o("calcio", "Calcio allo stadio o in TV", "Football at the stadium or on TV"),
        o("birra", "Birra con gli amici", "Beer with friends"),
        o("auto", "Auto e motori", "Cars and motorbikes"),
        o("nessuno", "Nessuno di questi", "None of these")
      ]
    },
    q19: {
      text: { it: "Quanto sei d'accordo con queste affermazioni?", en: "How much do you agree with these statements?" },
      min: { it: "per niente d'accordo", en: "do not agree at all" },
      max: { it: "del tutto d'accordo", en: "completely agree" }
    },
    q19a: { text: { it: "Un uomo con un fisico allenato è più attraente.", en: "A man with a trained body is more attractive." } },
    q19b: { text: { it: "Trovo normale che un uomo usi prodotti per la cura del viso.", en: "I find it normal for a man to use facial care products." } },
    q19c: { text: { it: "Un uomo che passa molto tempo in palestra dà un'immagine di sé troppo costruita.",
                    en: "A man who spends a lot of time at the gym gives an overly constructed image of himself." } },
    q19d: { text: { it: "Gli uomini oggi subiscono una pressione sull'aspetto fisico simile a quella che subiscono le donne.",
                    en: "Men today face pressure about their physical appearance similar to the pressure women face." } },
    q19e: { text: { it: "Come appare fisicamente un uomo conta poco.", en: "How a man looks physically matters little." } },

    // ---------- CHIUSURA ----------
    q20: {
      text: { it: "C'è una pubblicità o un marchio che secondo te rappresenta l'uomo di oggi? Quale?",
              en: "Is there an advert or a brand that, in your view, represents today's man? Which one?" },
      hint: { it: "Risposta breve, facoltativa", en: "Short answer, optional" }
    },
    q21: {
      text: { it: "Pensando agli uomini della generazione dei tuoi genitori, quali attività o consumi associ al loro “essere uomini”?",
              en: "Thinking of men from your parents' generation, what activities or types of consumption do you associate with their “being men”?" },
      hint: { it: "Risposta breve", en: "Short answer" }
    },
    q22: {
      text: { it: "E oggi, secondo te, cosa fa sentire un uomo “uomo”?", en: "And today, in your view, what makes a man feel like a “man”?" },
      hint: { it: "Risposta aperta", en: "Open answer" }
    },
    q23: {
      text: { it: "Come sei arrivato/a a questo questionario?", en: "How did you come across this questionnaire?" },
      options: [
        o("social", "Pubblicità sui social", "Social media advert"),
        o("amico", "Condiviso da un amico", "Shared by a friend"),
        o("altro", "Altro", "Other")
      ]
    }
  };

  window.I18N = { ui: ui, questions: questions };
})();
