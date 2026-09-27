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
    eyebrow:      { it: "Uomini e consumi, oggi.", en: "Men and consumption, today." },
    welcomeTitle: { it: "Se ti senti vittima del marketing, sei nel posto giusto.",
                    en: "If you feel like a victim of marketing, you're in the right place." },
    // Ogni blocco: "lead" in grassetto + testo
    intro: [
      { lead: { it: "Ciao, piacere: sono Simone Franco.", en: "Hi, nice to meet you: I'm Simone Franco." },
        text: { it: "Lavoro nel marketing e studio marketing all'Università degli Studi di Verona, dove sto finendo la laurea magistrale. Prima mi sono laureato in ambito economico all'Università degli Studi di Torino. Oggi voglio regalarti una guida per difenderti dal marketing.",
                en: "I work in marketing and study marketing at the University of Verona, where I'm finishing my master's degree. Before that, I earned a degree in economics and business at the University of Turin. Today I'd like to give you a guide to defending yourself from marketing." } },
      { lead: { it: "Come funziona.", en: "How it works." },
        text: { it: "Rispondi a un questionario anonimo sulle tue abitudini di consumo: ci vogliono tra 5 e 8 minuti. Alla fine vedi il tuo profilo di consumatore e ricevi la guida PDF per quel profilo, per saperti difendere dal marketing.",
                en: "You answer an anonymous questionnaire about your consumption habits: it takes 5 to 8 minutes. At the end you'll see your consumer profile and get the PDF guide for that profile, so you can defend yourself from marketing." } },
      { lead: { it: "Perché lo faccio.", en: "Why I'm doing this." },
        text: { it: "Le risposte servono alla mia tesi e a nient'altro. Non vendo niente, nessun marchio è coinvolto e non ti chiedo né nome né email.",
                en: "The answers are for my thesis and nothing else. I'm not selling anything, no brand is involved, and I won't ask for your name or email." } },
      { lead: { it: "Una sola richiesta.", en: "Just one request." },
        text: { it: "Rispondi per come stanno davvero le cose, senza imbarazzo. Nessuno saprà che sei tu, e più le risposte sono sincere, più il profilo sarà giusto.",
                en: "Answer the way things really are, without embarrassment. Nobody will know it's you, and the more honest your answers, the more accurate your profile." } }
    ],
    factTime:     { it: "5–8 minuti", en: "5–8 minutes" },
    factAnon:     { it: "Anonimo", en: "Anonymous" },
    factOne:      { it: "Guida PDF in regalo", en: "Free PDF guide" },
    welcomeNote:  { it: "Possono rispondere tutte e tutti, dai 18 anni in su.",
                    en: "Anyone aged 18 or over can take part." },
    start:        { it: "Inizia", en: "Start" },
    resume:       { it: "Riprendi", en: "Resume" },
    resumeInfo:   { it: "Eri arrivato/a alla domanda {n} di {t}.", en: "You'd reached question {n} of {t}." },
    resumePrivacy:{ it: "Eri arrivato/a all'informativa.", en: "You'd reached the privacy notice." },
    restart:      { it: "Ricomincia da capo", en: "Start over" },

    // Privacy
    privacyTitle: { it: "Prima di iniziare", en: "Before you start" },
    privacyIntro: {
      it: "Questo questionario fa parte della tesi di laurea magistrale di Simone Franco, corso di laurea in Marketing e Comunicazione d'Impresa, Università degli Studi di Verona.",
      en: "This questionnaire is part of the master's thesis of Simone Franco, Master's degree in Marketing and Business Communication, University of Verona."
    },
    privacyPoints: {
      it: [
        "È anonimo: non chiede e non registra nomi, indirizzi email o altri dati che possano identificarti.",
        "Oltre alle risposte vengono registrati solo dati tecnici: lingua scelta, durata della compilazione, data e ora di inizio e la campagna da cui arrivi.",
        "Le risposte sono conservate in un foglio Google accessibile solo all'autore della tesi, analizzate in forma aggregata e usate esclusivamente per la tesi.",
        "Le risposte sono raccolte e conservate tramite servizi Google (Moduli e Fogli); la pagina carica anche i caratteri tipografici da Google Fonts.",
        "Il profilo e la guida finale vengono calcolati sul tuo dispositivo: non inviano nessun dato in più.",
        "Puoi saltare qualsiasi domanda e interrompere quando vuoi. Il browser conserva i progressi su questo dispositivo per farti riprendere e li cancella dopo l'invio."
      ],
      en: [
        "It's anonymous: it doesn't ask for or record names, email addresses or any other data that could identify you.",
        "Besides your answers, only technical data is recorded: chosen language, time taken, start date and time, and the campaign you came from.",
        "Answers are stored in a Google Sheet that only the author of the thesis can access, analysed in aggregate form and used solely for the thesis.",
        "Responses are collected and stored through Google services (Forms and Sheets); the page also loads its fonts from Google Fonts.",
        "Your profile and the final guide are worked out on your device: they don't send any extra data.",
        "You can skip any question and stop whenever you like. Your browser keeps your progress on this device so you can resume, and deletes it after you submit."
      ]
    },
    privacyContact: { it: "Per informazioni: simone.franco_02@studenti.univr.it", en: "For information: simone.franco_02@studenti.univr.it" },
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
    doneBody:     { it: "Le tue risposte sono state inviate. Ecco cosa dicono di te.",
                    en: "Your answers have been sent. Here's what they say about you." },
    profileLabel: { it: "Il tuo profilo", en: "Your profile" },
    ideaLabel:    { it: "La tua idea di uomo", en: "Your idea of men" },
    download:     { it: "Scarica la guida PDF", en: "Download the PDF guide" },
    guideNote:    { it: "La guida è la stessa per tutte le persone con il tuo profilo: non contiene dati tuoi.",
                    en: "The guide is the same for everyone with your profile: it contains none of your data." },
    shareAsk:     { it: "Se conosci qualcuno che potrebbe rispondere, passagli il link: ogni persona che risponde riceve il proprio profilo.",
                    en: "If you know someone who could take part, pass the link on: everyone who takes part gets their own profile." },
    share:        { it: "Condividi il link", en: "Share the link" },
    shareText:    { it: "Questionario anonimo per una tesi magistrale: alla fine ricevi il tuo profilo di consumatore e una guida per difenderti dal marketing. Ci vogliono 5–8 minuti.",
                    en: "Anonymous questionnaire for a master's thesis: at the end you get your consumer profile and a guide to defending yourself from marketing. It takes 5–8 minutes." },
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
        o("sud", "Sud e Isole", "South and Islands"),
        o("estero", "Non vivo in Italia", "I don't live in Italy")
      ]
    },
    q4: {
      text: { it: "Titolo di studio", en: "Educational qualification" },
      options: [
        o("media", "Licenza media", "Lower secondary school"),
        o("diploma", "Diploma", "Upper secondary diploma"),
        o("triennale", "Laurea triennale", "Bachelor's degree"),
        o("magistrale", "Laurea magistrale, a ciclo unico o vecchio ordinamento", "Master's degree (including single-cycle and pre-reform degrees)"),
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
    q10b: {
      text: { it: "Quando compri integratori o prodotti per la cura di sé, come scegli cosa comprare?",
              en: "When you buy supplements or self-care products, how do you choose what to buy?" },
      options: [
        o("amico", "Me li consiglia un amico", "A friend recommends them"),
        o("nutrizionista", "Me li consiglia un nutrizionista", "A nutritionist recommends them"),
        o("influencer", "Me li consiglia un influencer o creator", "An influencer or creator recommends them"),
        o("pt", "Me li consiglia il mio personal trainer", "My personal trainer recommends them"),
        o("saldi", "Aspetto saldi e promozioni per comprare dal mio marchio di fiducia", "I wait for sales and promotions to buy from my trusted brand"),
        o("amazon", "Compro marchi generalisti su Amazon", "I buy generic brands on Amazon"),
        o("fiducia", "Compro regolarmente dal mio marchio di fiducia, anche senza sconti", "I regularly buy from my trusted brand, even without discounts"),
        o("confronto", "Confronto più marchi e compro prodotti diversi da marchi diversi", "I compare several brands and buy different products from different brands"),
        o("qualita", "La marca non conta, conta solo la qualità", "The brand doesn't matter, only quality does"),
        o("prezzo", "La marca non conta, conta solo il prezzo", "The brand doesn't matter, only price does")
      ]
    },
    q10c: {
      text: { it: "Cosa usi per la cura della barba o per raderti?", en: "What do you use to care for your beard or to shave?" },
      options: [
        o("lamette", "Rasoio a lamette", "Razor with blades"),
        o("elettrico", "Rasoio elettrico", "Electric shaver"),
        o("regolabarba", "Regolabarba", "Beard trimmer"),
        o("schiuma", "Schiuma o gel da barba", "Shaving foam or gel"),
        o("dopobarba", "Dopobarba", "Aftershave"),
        o("olio", "Olio o balsamo per barba", "Beard oil or balm"),
        o("shampoo", "Shampoo specifico per barba", "Beard shampoo"),
        o("pettine", "Pettine o spazzola per barba", "Beard comb or brush"),
        o("barbiere", "Vado dal barbiere per la barba", "I go to the barber for my beard"),
        o("nessuno", "Nessuno di questi", "None of these")
      ]
    },
    q10d: {
      text: { it: "Quali parti del corpo ti depili o ti radi, anche solo ogni tanto? (Barba esclusa)",
              en: "Which parts of your body do you wax or shave, even just occasionally? (Beard excluded)" },
      options: [
        o("petto", "Petto", "Chest"),
        o("addome", "Addome", "Stomach"),
        o("schiena", "Schiena", "Back"),
        o("ascelle", "Ascelle", "Armpits"),
        o("intima", "Zona intima", "Intimate area"),
        o("braccia", "Braccia", "Arms"),
        o("gambe", "Gambe", "Legs"),
        o("nessuna", "Nessuna", "None")
      ]
    },
    q10e: {
      text: { it: "Negli ultimi 12 mesi hai speso per qualcuno di questi?", en: "In the last 12 months, have you spent money on any of these?" },
      options: [
        o("orologio", "Orologio di valore", "A valuable watch"),
        o("tech", "Tecnologia di fascia alta (smartphone, console, gadget)", "High-end tech (smartphone, console, gadgets)"),
        o("attrezzi", "Attrezzi da lavoro o per il fai-da-te", "Work or DIY tools"),
        o("firmato", "Abbigliamento firmato o sneakers da collezione", "Designer clothing or collectible sneakers"),
        o("gioielli", "Gioielli o accessori da uomo (catene, anelli, bracciali)", "Men's jewellery or accessories (chains, rings, bracelets)"),
        o("auto", "Accessori o modifiche per auto o moto", "Accessories or modifications for a car or motorbike"),
        o("corsi", "Corsi di crescita personale, finanza o “mentalità”", "Personal growth, finance or “mindset” courses"),
        o("trading", "Trading o criptovalute", "Trading or cryptocurrency"),
        o("nessuno", "Nessuno di questi", "None of these")
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
        o("studio", "Studio per conto mio (libri, manuali)", "I study on my own (books, manuals)"),
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
    q15: {
      text: { it: "Nel tempo libero con gli amici, dove passi più tempo?", en: "In your free time with friends, where do you spend the most time?" },
      options: [
        o("bar", "Bar o locali", "Bars or venues"),
        o("stadio", "Stadio o partite in TV", "Stadium or matches on TV"),
        o("palestra", "Palestra o sport", "Gym or sport"),
        o("casa", "A casa", "At home"),
        o("aperto", "All'aperto (escursioni, caccia, pesca)", "Outdoors (hiking, hunting, fishing)"),
        o("altro", "Altro", "Other")
      ]
    },
    q17: {
      text: { it: "Quanto sei d'accordo con queste affermazioni?", en: "How much do you agree with these statements?" },
      min: { it: "per niente d'accordo", en: "do not agree at all" },
      max: { it: "del tutto d'accordo", en: "completely agree" }
    },
    q17a: { text: { it: "Avere un fisico allenato rende un uomo più rispettato.", en: "Having a trained body makes a man more respected." } },
    q17c: { text: { it: "Mi capita di sentirmi a disagio se il mio corpo non corrisponde a certi standard.",
                    en: "I sometimes feel uncomfortable if my body doesn't match certain standards." } },
    q17d: { text: { it: "Andare a vedere una partita con i miei amici e bermi una buona birra è ancora centrale nella mia vita sociale.",
                    en: "Going to watch a match with my friends and having a good beer is still central to my social life." } },
    q17e: { text: { it: "La palestra per me è anche un luogo dove stare con altre persone.",
                    en: "For me, the gym is also a place to be with other people." } },
    q17f: { text: { it: "Come appare fisicamente un uomo conta poco.", en: "How a man looks physically matters little." } },
    q17g: { text: { it: "Un uomo che si depila petto, braccia o gambe mi sembra meno maschile.",
                    en: "A man who waxes or shaves his chest, arms or legs seems less masculine to me." } },
    q17h: { text: { it: "Il barbecue e la griglia sono cose da uomini.", en: "Barbecue and grilling are men's things." } },
    q17i: { text: { it: "L'auto che un uomo guida dice molto di lui.", en: "The car a man drives says a lot about him." } },

    // ---------- PERCORSO B (donne, altro, preferisco non rispondere) ----------
    q18a: {
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
        o("nessuno", "Nessuno di questi", "None of these")
      ]
    },
    q18b: {
      text: { it: "E tra questi, quali associ oggi a un uomo “virile”?", en: "And which of these do you associate today with a “manly” man?" },
      options: [
        o("calcio", "Calcio allo stadio o in TV", "Football at the stadium or on TV"),
        o("birra", "Birra con gli amici", "Beer with friends"),
        o("auto", "Auto e motori", "Cars and motorbikes"),
        o("barbecue", "Carne alla griglia e barbecue", "Grilled meat and barbecue"),
        o("orologi", "Orologi di valore", "Valuable watches"),
        o("attrezzi", "Attrezzi e fai-da-te", "Tools and DIY"),
        o("firmato", "Abbigliamento firmato o sneakers da collezione", "Designer clothing or collectible sneakers"),
        o("gioielli", "Gioielli da uomo", "Men's jewellery"),
        o("caccia", "Caccia e pesca", "Hunting and fishing"),
        o("investimenti", "Investimenti, trading e criptovalute", "Investing, trading and cryptocurrency"),
        o("nessuno", "Nessuno di questi", "None of these")
      ]
    },
    q18c: {
      text: { it: "Secondo te, quali parti del corpo un uomo curato dovrebbe depilarsi o radersi? (Barba esclusa)",
              en: "In your view, which parts of the body should a well-groomed man wax or shave? (Beard excluded)" },
      options: [
        o("petto", "Petto", "Chest"),
        o("addome", "Addome", "Stomach"),
        o("schiena", "Schiena", "Back"),
        o("ascelle", "Ascelle", "Armpits"),
        o("intima", "Zona intima", "Intimate area"),
        o("braccia", "Braccia", "Arms"),
        o("gambe", "Gambe", "Legs"),
        o("nessuna", "Nessuna", "None"),
        o("scelta_sua", "È una scelta sua, non ho preferenze", "It's his choice, I have no preference")
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
    q19f: { text: { it: "Un uomo che si depila petto, braccia o gambe mi sembra meno maschile.",
                    en: "A man who waxes or shaves his chest, arms or legs seems less masculine to me." } },
    q19g: { text: { it: "Il barbecue e la griglia sono cose da uomini.", en: "Barbecue and grilling are men's things." } },
    q19h: { text: { it: "L'auto che un uomo guida dice molto di lui.", en: "The car a man drives says a lot about him." } },

    // ---------- CHIUSURA ----------
    qbarba: {
      text: { it: "Pensando alla barba di un uomo, quale di queste frasi si avvicina di più a quello che pensi?",
              en: "Thinking about a man's beard, which of these statements is closest to what you think?" },
      options: [
        o("curata", "Una barba ben curata indica più attenzione a sé rispetto a un viso rasato", "A well-groomed beard shows more self-care than a clean-shaven face"),
        o("rasato", "Un uomo ordinato si rade regolarmente e ha il viso pulito", "A tidy man shaves regularly and keeps his face clean"),
        o("incolta", "Una barba incolta dà un'idea di trascuratezza", "An unkempt beard gives an impression of neglect"),
        o("indifferente", "Per me è indifferente: la barba non dice niente su quanto un uomo si cura", "It makes no difference to me: a beard says nothing about how much a man takes care of himself")
      ]
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

  // Percorso B: le prime quattro domande sono le stesse del percorso A (6, 9, 10, 10b),
  // così i consumi di uomini e donne si confrontano direttamente.
  ["q6", "q9", "q10", "q10b"].forEach(function (k) {
    questions["qb" + k.slice(1)] = { text: questions[k].text, options: questions[k].options };
  });

  window.I18N = { ui: ui, questions: questions };
})();
