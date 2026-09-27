/*
 * PROFILI DI CONSUMATORE E GUIDE ANTI-MARKETING
 * =============================================
 * Il profilo si calcola nel browser alla fine del questionario: non viene
 * inviato al Google Form. Da qui leggono sia la pagina finale sia lo script
 * che genera i PDF (tools/genera-pdf.js): se cambi un testo, rigenera i PDF.
 *
 * Percorso A (uomini): due punteggi.
 *   Corpo (0-7):     q6  1-2 volte = 1, 3 o più = 2
 *                    q9  1-2 acquisti = 1, 3 o più = 2 ("Nessuno di questi" = 0)
 *                    q10 51-100 € = 1, oltre 100 € = 2
 *                    q10d almeno una zona = 1
 *   Tradizione (0-5): q15 bar o stadio = 2
 *                    q17d 3 = 1, 4-5 = 2
 *                    q17h 4-5 = 1
 *   Soglie: Corpo alto da 4, Tradizione alta da 3 (da ricontrollare sulle prime risposte).
 *
 * Percorso B: Corpo (0-6) da qb6, qb9, qb10 come sopra, alto da 3; stile di scelta da qb10b:
 *   più consigli/marchio di fiducia che confronto/prezzo = "fiducia", altrimenti "calcolo".
 *   Sotto il profilo compare anche l'idea di uomo (18a contro le voci tradizionali di 18b).
 */
window.PROFILES = (function () {
  var SOGLIA_CORPO = 4;
  var SOGLIA_TRADIZIONE = 3;
  var TRADIZIONALI_18B = ["calcio", "birra", "auto", "barbecue", "attrezzi", "caccia"];

  function arr(v) { return Array.isArray(v) ? v : []; }

  function scoreA(a) {
    var corpo = 0, trad = 0;
    if (a.q6 === "1_2") corpo += 1;
    if (a.q6 === "3_4" || a.q6 === "5piu") corpo += 2;
    var acquisti = arr(a.q9).filter(function (x) { return x !== "nessuno"; }).length;
    if (acquisti >= 3) corpo += 2; else if (acquisti >= 1) corpo += 1;
    if (a.q10 === "51_100") corpo += 1;
    if (a.q10 === "100") corpo += 2;
    if (arr(a.q10d).filter(function (x) { return x !== "nessuna"; }).length) corpo += 1;

    if (a.q15 === "bar" || a.q15 === "stadio") trad += 2;
    if (a.q17d === 3) trad += 1;
    if (a.q17d >= 4) trad += 2;
    if (a.q17h >= 4) trad += 1;
    return { corpo: corpo, tradizione: trad };
  }

  // Percorso B: stessi criteri del percorso A per il corpo, più lo stile di scelta (qb10b)
  var SOGLIA_CORPO_B = 3;
  var AFFIDA = ["amico", "nutrizionista", "influencer", "pt", "fiducia"];
  function scoreB(a) {
    var corpo = 0;
    if (a.qb6 === "1_2") corpo += 1;
    if (a.qb6 === "3_4" || a.qb6 === "5piu") corpo += 2;
    var acquisti = arr(a.qb9).filter(function (x) { return x !== "nessuno"; }).length;
    if (acquisti >= 3) corpo += 2; else if (acquisti >= 1) corpo += 1;
    if (a.qb10 === "51_100") corpo += 1;
    if (a.qb10 === "100") corpo += 2;
    var scelte = arr(a.qb10b);
    var affida = scelte.filter(function (x) { return AFFIDA.indexOf(x) !== -1; }).length;
    return { corpo: corpo, affida: affida, calcola: scelte.length - affida };
  }

  function compute(answers, path) {
    var a = answers || {};
    if (path === "A") {
      var s = scoreA(a);
      var altoC = s.corpo >= SOGLIA_CORPO, altoT = s.tradizione >= SOGLIA_TRADIZIONE;
      if (altoC && altoT) return "ibrido";
      if (altoC) return "costruttore";
      if (altoT) return "classico";
      return "essenziale";
    }
    var b = scoreB(a);
    var fiducia = b.affida > b.calcola;
    if (b.corpo >= SOGLIA_CORPO_B) return fiducia ? "cura_fiducia" : "cura_calcolo";
    return fiducia ? "fiducia" : "essenziale_b";
  }

  // Solo percorso B: l'idea di uomo che emerge dalla domanda 18 (mostrata sotto il profilo)
  function computeIdea(answers) {
    var a = answers || {};
    var cura = arr(a.q18a).filter(function (x) { return x !== "nessuno"; }).length;
    var trad = arr(a.q18b).filter(function (x) { return TRADIZIONALI_18B.indexOf(x) !== -1; }).length;
    if (!trad && !cura) return null;
    if (trad > cura) return "classica";
    if (cura > trad) return "contemporanea";
    return "mista";
  }

  // Tre domande valide per tutti, in fondo a ogni guida
  var domandeFinali = {
    title: { it: "Tre domande prima di ogni acquisto", en: "Three questions before every purchase" },
    items: [
      { it: "Lo volevo già prima di vedere la pubblicità?", en: "Did I want this before I saw the ad?" },
      { it: "Quanto costa per unità: al chilo, al litro, a porzione?", en: "What does it cost per unit: per kilo, per litre, per serving?" },
      { it: "Chi guadagna se lo compro, oltre a chi lo vende?", en: "Who else makes money if I buy it, besides the seller?" }
    ]
  };

  // Fonti citate nelle guide: ogni guida elenca solo quelle dei consigli che contiene
  var fonti = {
    agcom: { label: "AGCOM, Influencer: linee guida, codice di condotta e FAQ", url: "https://www.agcom.it/influencer-linee-guida-codice-di-condotta-e-faq" },
    agcm_integratori: { label: "Il Fatto Alimentare, L'Antitrust multa tre siti di integratori sportivi (2018)", url: "https://ilfattoalimentare.it/integratori-alimentari-sportivi-antitrust.html" },
    agcm_fitness: { label: "AGCM, Esiti di moral suasion: contratti di servizi fitness (2014)", url: "https://agcm.it/competenze/tutela-del-consumatore/dettaglio?id=c901d318-bf54-412a-bf11-4417ba1e9aba&parent=Esiti+moral+suasion&parentUrl=/competenze/tutela-del-consumatore/esiti-moral-suasion" },
    altroconsumo: { label: "Unione Nazionale Consumatori Umbria, Cibi proteici: boom sullo scaffale, ma servono davvero? (analisi Altroconsumo)", url: "https://www.consumatoriumbria.it/cibi-proteici-e-boom-sullo-scaffale-ma-servono-davvero/" },
    rinnovo: { label: "La Legge per Tutti, Il rinnovo automatico di un abbonamento è legale?", url: "https://www.laleggepertutti.it/745119_il-rinnovo-automatico-di-un-abbonamento-e-legale" },
    dellavigna: { label: "DellaVigna S., Malmendier U., Paying Not to Go to the Gym, American Economic Review, 96(3), 2006", url: "https://www.aeaweb.org/articles?id=10.1257/aer.96.3.694" },
    issn: { label: "Kreider R. B. et al., ISSN position stand: creatine supplementation, Journal of the International Society of Sports Nutrition, 2017", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/" },
    claim_cosmetici: { label: "Biutify, Claim cosmetici e Regolamento UE 655/2013", url: "https://www.biutify.it/didattica/cosmetologia/claim-cosmetici-reg-655-2013" },
    reg1223: { label: "Regolamento (CE) 1223/2009 sui prodotti cosmetici", url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32009R1223" },
    reg1924: { label: "Regolamento (CE) 1924/2006 sulle indicazioni nutrizionali e sulla salute", url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32006R1924" },
    reg1169: { label: "Regolamento (UE) 1169/2011 sulle informazioni alimentari ai consumatori", url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32011R1169" },
    psd2: { label: "Direttiva (UE) 2015/2366 sui servizi di pagamento (PSD2), art. 76", url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32015L2366" },
    omnibus: { label: "Direttiva (UE) 2019/2161 (Omnibus), annunci di riduzione di prezzo", url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32019L2161" },
    alone: { label: "FoodNavigator, The health halo effect: nutrition claims may increase portion sizes (2013)", url: "https://www.foodnavigator.com/Article/2013/05/20/The-health-halo-effect-Nutrition-claims-may-increase-portion-sizes/" },
    bio: { label: "Food Quality and Preference, meta-analisi sull'effetto alone del biologico (2025)", url: "https://www.sciencedirect.com/science/article/abs/pii/S0950329325000357" },
    green: { label: "Adnkronos, Greenwashing: dal 27 al via le nuove regole, cosa cambia", url: "https://www.adnkronos.com/sostenibilita/greenwashing-dal-27-al-via-le-nuove-regole-cosa-cambia_5fUOipFl6FYZWSe9ta8WrG" },
    larn: { label: "SINU, LARN: Livelli di assunzione di riferimento di nutrienti ed energia (2014)", url: "https://sinu.it/tabelle-larn-2014/" },
    adlibrary: { label: "Meta, Libreria inserzioni", url: "https://www.facebook.com/ads/library/" }
  };

  var consigli = {
    // ---------- Birra, sport, abbonamenti ----------
    litro: {
      t: { it: "Guarda il prezzo al litro", en: "Look at the price per litre" },
      b: { it: "Birre \"premium\" e artigianali possono costare molto di più a parità di quantità. Nei supermercati il prezzo al litro è scritto sul cartellino: spesso stai pagando il marchio più della birra.",
           en: "\"Premium\" and craft beers can cost far more for the same amount. In supermarkets the price per litre is on the shelf label: often you're paying for the brand more than for the beer." }
    },
    scaffali: {
      t: { it: "Guarda in alto e in basso", en: "Look up and down" },
      b: { it: "All'altezza degli occhi ci sono i prodotti che il negozio vuole venderti di più. Le alternative economiche stanno spesso negli scaffali bassi. E la zona casse è pensata per gli acquisti d'impulso: arrivaci con la lista già chiusa.",
           en: "At eye level you'll find the products the shop most wants to sell you. Cheaper alternatives are often on the lower shelves. And the checkout area is designed for impulse buys: get there with your list already closed." }
    },
    abbonamenti: {
      t: { it: "Conta le partite che guardi davvero", en: "Count the matches you actually watch" },
      b: { it: "Prima di rinnovare un abbonamento per lo sport, conta le partite che hai visto nell'ultimo mese. I pacchetti annuali si rinnovano da soli: segna la data di disdetta e confrontali con le opzioni mensili senza vincolo, se ci sono.",
           en: "Before renewing a sports subscription, count the matches you watched last month. Annual packages renew automatically: note the cancellation date and compare them with monthly no-contract options, if there are any." }
    },
    sepa: {
      t: { it: "L'addebito diretto è una rete di sicurezza", en: "Direct debit is a safety net" },
      b: { it: "Se paghi un abbonamento con addebito diretto SEPA, puoi chiedere alla banca il rimborso entro 8 settimane dall'addebito, senza dover spiegare perché. Non cancella un debito legittimo, ma blocca subito un addebito che contesti.",
           en: "If you pay a subscription by SEPA direct debit, you can ask your bank for a refund within 8 weeks of the charge, without giving a reason. It doesn't cancel a legitimate debt, but it immediately stops a charge you're disputing." },
      src: ["psd2"]
    },
    scommesse: {
      t: { it: "Leggi le condizioni del bonus", en: "Read the terms of the bonus" },
      b: { it: "Il \"bonus di benvenuto\" delle scommesse di solito si sblocca solo dopo aver giocato più volte l'importo ricevuto. È pensato per farti giocare di più, non per regalarti soldi.",
           en: "Betting \"welcome bonuses\" usually unlock only after you've wagered the bonus amount several times. They're designed to make you bet more, not to give you money." }
    },
    momento: {
      t: { it: "Ti vendono il momento, non il prodotto", en: "They sell you the moment, not the product" },
      b: { it: "Nelle pubblicità di birra e sport il prodotto si vede poco: si vedono amici, risate, vittorie. Quella serata la passeresti uguale con una marca più economica.",
           en: "In beer and sports ads you barely see the product: you see friends, laughter, victories. You'd have the same evening with a cheaper brand." }
    },
    maglie: {
      t: { it: "La maglia nuova ogni stagione", en: "A new shirt every season" },
      b: { it: "Le squadre cambiano la maglia ufficiale ogni stagione anche quando il disegno cambia poco. È un modo per farti ricomprare lo stesso oggetto.",
           en: "Teams change their official shirt every season even when the design barely changes. It's a way to make you buy the same thing again." }
    },

    // ---------- Cibo e proteine ----------
    proteine: {
      t: { it: "Calcola quanto costano 100 g di proteine", en: "Work out what 100 g of protein costs" },
      b: { it: "Formula: prezzo al chilo × 10 ÷ grammi di proteine per 100 g. Con prezzi indicativi: legumi secchi a 3 €/kg con il 22% di proteine costano circa 1,40 € ogni 100 g di proteine; proteine whey a 25 €/kg con l'80% circa 3,10 €; uno yogurt \"protein\" a 8 €/kg con il 10% 8 €. In trenta secondi vedi quale \"high protein\" è solo confezione.",
           en: "Formula: price per kilo × 10 ÷ grams of protein per 100 g. With indicative prices: dried pulses at €3/kg with 22% protein cost about €1.40 per 100 g of protein; whey at €25/kg with 80% about €3.10; a \"protein\" yogurt at €8/kg with 10% costs €8. In thirty seconds you see which \"high protein\" is just packaging." }
    },
    highprotein: {
      t: { it: "La versione \"protein\" costa di più", en: "The \"protein\" version costs more" },
      b: { it: "Altroconsumo ha confrontato latte, yogurt, formaggi, cereali e bevande vegetali: scegliendo le varianti \"protein\" si rischia di spendere più del doppio, spesso per una differenza piccola nel contenuto di proteine.",
           en: "Altroconsumo, an Italian consumer association, compared milk, yogurt, cheese, cereals and plant drinks: choosing the \"protein\" versions can cost more than twice as much, often for a small difference in protein content." },
      src: ["altroconsumo"]
    },
    fontediproteine: {
      t: { it: "\"Fonte di proteine\" è una soglia bassa", en: "\"Source of protein\" is a low bar" },
      b: { it: "Per la legge europea basta che almeno il 12% delle calorie di un alimento venga dalle proteine: anche un biscotto può scriverlo. Confronta sempre i grammi di proteine per 100 g.",
           en: "Under EU law it's enough for at least 12% of a food's calories to come from protein: even a biscuit can claim it. Always compare grams of protein per 100 g." },
      src: ["reg1924"]
    },
    larn: {
      t: { it: "Quante proteine ti servono davvero", en: "How much protein you actually need" },
      b: { it: "I LARN indicano 0,9 g di proteine al giorno per chilo di peso per un adulto. Chi si allena molto ne usa di più, ma yogurt greco, legumi, uova, tonno e formaggi ci arrivano senza confezioni speciali.",
           en: "Italy's reference intakes (LARN) set 0.9 g of protein per kilo of body weight a day for an adult. People who train hard use more, but Greek yogurt, pulses, eggs, tuna and cheese get there without special packaging." },
      src: ["larn"]
    },
    snack: {
      t: { it: "Gli snack \"proteici\" vanno letti dal retro", en: "Read \"protein\" snacks from the back" },
      b: { it: "Barrette e snack \"proteici\" possono avere zuccheri e calorie simili a una merendina. Leggi la tabella nutrizionale, non il fronte della confezione.",
           en: "\"Protein\" bars and snacks can have sugar and calories similar to a regular snack. Read the nutrition table, not the front of the pack." }
    },
    retro: {
      t: { it: "Il fronte è pubblicità, il retro è legge", en: "The front is advertising, the back is the law" },
      b: { it: "Gira la confezione prima di leggere il davanti. Gli ingredienti sono elencati in ordine decrescente di peso: se un prodotto \"con avena\" ha l'avena al quinto posto, ce n'è poca. Confronta sempre i valori per 100 g, non \"per porzione\".",
           en: "Turn the pack over before reading the front. Ingredients are listed in descending order of weight: if a product \"with oats\" has oats in fifth place, there isn't much. Always compare values per 100 g, not \"per serving\"." },
      src: ["reg1169"]
    },
    alone: {
      t: { it: "Una parola buona non rende sano tutto il prodotto", en: "One good word doesn't make the whole product healthy" },
      b: { it: "È l'effetto alone: una sola dicitura positiva fa sembrare migliore tutto il resto. Negli studi, scritte come \"ridotto contenuto di grassi\" o \"bio\" portano a sottostimare le calorie, anche quando il prodotto ne ha quante la versione normale.",
           en: "It's the halo effect: one positive label makes everything else seem better too. In studies, labels like \"reduced fat\" or \"organic\" lead people to underestimate calories, even when the product has as many as the regular version." },
      src: ["alone", "bio"]
    },
    zuccheri: {
      t: { it: "\"Zero zuccheri aggiunti\" non vuol dire pochi zuccheri", en: "\"No added sugar\" doesn't mean little sugar" },
      b: { it: "Guarda la riga \"di cui zuccheri\" nella tabella. Succhi concentrati e frutta disidratata non contano come zuccheri aggiunti, ma sono zuccheri.",
           en: "Look at the \"of which sugars\" line in the table. Fruit concentrates and dried fruit don't count as added sugar, but they are sugar." }
    },

    // ---------- Integratori ----------
    creatina: {
      t: { it: "La creatina più semplice è la più studiata", en: "The simplest creatine is the most studied" },
      b: { it: "Secondo la posizione ufficiale dell'International Society of Sports Nutrition, la creatina monoidrato è la forma più studiata ed efficace, e negli studi il mantenimento è di 3-5 g al giorno. Le versioni \"avanzate\" costano di più senza prove dello stesso livello.",
           en: "According to the International Society of Sports Nutrition's position stand, creatine monohydrate is the most studied and effective form, and studies use 3-5 g a day for maintenance. \"Advanced\" versions cost more without evidence of the same level." },
      src: ["issn"]
    },
    blend: {
      t: { it: "\"Formula esclusiva\" senza dosi? Salta", en: "\"Proprietary blend\" with no doses? Skip it" },
      b: { it: "Se l'etichetta dice \"proprietary blend\" o \"complesso esclusivo\" ma non indica la dose di ogni ingrediente, non sai cosa stai comprando. Confronta il costo per dose efficace, non per barattolo.",
           en: "If the label says \"proprietary blend\" or \"exclusive complex\" but doesn't give the dose of each ingredient, you don't know what you're buying. Compare the cost per effective dose, not per tub." }
    },
    aminospiking: {
      t: { it: "Controlla gli ingredienti delle proteine in polvere", en: "Check the ingredients of protein powder" },
      b: { it: "Se tra gli ingredienti compaiono glicina, taurina o creatina aggiunte, possono servire a gonfiare il contenuto proteico dichiarato con aminoacidi più economici. Meglio i prodotti che pubblicano l'aminogramma completo.",
           en: "If glycine, taurine or added creatine appear in the ingredients, they may be there to inflate the declared protein content with cheaper amino acids. Prefer products that publish their full amino acid profile." }
    },
    registro: {
      t: { it: "Compra solo integratori autorizzati in Italia", en: "Only buy supplements authorised in Italy" },
      b: { it: "Nel 2018 l'Antitrust ha multato per 330.000 euro in totale tre siti di nutrizione sportiva (myprotein.it, musclenutrition.com e prozis.com) che vendevano integratori non autorizzati dal Ministero della Salute. Se compri da siti esteri, controlla che il prodotto sia nel registro del Ministero.",
           en: "In 2018 Italy's competition authority fined three sports nutrition sites (myprotein.it, musclenutrition.com and prozis.com) a total of €330,000 for selling supplements not authorised by the Ministry of Health. If you buy from foreign sites, check that the product is in the Ministry's register." },
      src: ["agcm_integratori"]
    },
    preworkout: {
      t: { it: "Il pre-workout è spesso caffeina", en: "Pre-workout is often caffeine" },
      b: { it: "In molti pre-workout il principio attivo principale è la caffeina. Controlla quanta ne contiene una dose e confrontala con quella di un caffè prima di pagarla a peso d'oro.",
           en: "In many pre-workouts the main active ingredient is caffeine. Check how much one serving contains and compare it with a coffee before paying a premium for it." }
    },
    esami: {
      t: { it: "Prima gli esami, poi l'integratore", en: "Tests first, supplements second" },
      b: { it: "Vitamina D, ferro e B12 si misurano con un prelievo. Chiedi al medico prima di integrare \"per sicurezza\": è proprio quello che i produttori sperano che tu faccia.",
           en: "Vitamin D, iron and B12 can be measured with a blood test. Ask your doctor before supplementing \"just in case\": that's exactly what manufacturers hope you'll do." }
    },
    cura: {
      t: { it: "Un integratore non cura malattie", en: "A supplement doesn't cure diseases" },
      b: { it: "Per legge un alimento, integratori compresi, non può dichiarare di prevenire o curare una malattia. Se lo promette, è già fuori dalle regole.",
           en: "By law, a food, supplements included, cannot claim to prevent or cure a disease. If it promises that, it's already breaking the rules." },
      src: ["reg1169"]
    },

    // ---------- Palestra ----------
    palestra_ingresso: {
      t: { it: "Calcola quanto ti costa ogni ingresso", en: "Work out what each visit costs you" },
      b: { it: "Dividi l'abbonamento per le volte che ci vai davvero. Uno studio pubblicato sull'American Economic Review ha mostrato che chi sceglieva il mensile pagava in media ogni ingresso più di quanto avrebbe speso con un carnet: le palestre guadagnano sul fatto che si va meno di quanto si pensa.",
           en: "Divide the membership by the number of times you actually go. A study in the American Economic Review showed that people on monthly plans paid more per visit, on average, than a pay-per-visit pass would have cost: gyms profit from people going less than they expect." },
      src: ["dellavigna"]
    },
    palestra_prova: {
      t: { it: "Prova prima di firmare l'annuale", en: "Try before you sign up for a year" },
      b: { it: "Fatti dare il contratto da leggere a casa. Visita la sala all'ora in cui ci andresti davvero: alle 18:30 può essere un'altra palestra. Parti con ingressi singoli o un mensile per 2-3 mesi e passa all'annuale solo se hai frequentato.",
           en: "Take the contract home to read. Visit at the time you'd actually go: at 6:30 pm it may be a different gym. Start with single visits or a monthly plan for 2-3 months and switch to annual only if you've actually gone." }
    },
    palestra_offerta: {
      t: { it: "L'offerta \"solo oggi\" torna", en: "The \"today only\" offer comes back" },
      b: { it: "Rifiuta e ripassa a fine mese: spesso l'offerta ricompare uguale, perché chi vende ha obiettivi mensili. La quota d'iscrizione è la voce che si toglie più facilmente, se chiedi.",
           en: "Say no and come back at the end of the month: the offer often reappears unchanged, because sales staff have monthly targets. The joining fee is the easiest item to get waived, if you ask." }
    },
    palestra_disdetta: {
      t: { it: "Il rinnovo automatico ha dei limiti", en: "Automatic renewal has limits" },
      b: { it: "Il rinnovo automatico è legale, ma una disdetta con preavviso eccessivo può rendere la clausola vessatoria e quindi nulla: il contratto finisce alla scadenza e ciò che è stato addebitato dopo va rimborsato. L'Antitrust è già intervenuta su palestre che chiedevano 60 giorni di preavviso. Metti il promemoria di disdetta il giorno in cui firmi e disdici con PEC o raccomandata.",
           en: "Automatic renewal is legal, but an excessive notice period can make the clause unfair and therefore void: the contract ends at expiry and anything charged afterwards must be refunded. Italy's competition authority has already acted against gyms that required 60 days' notice. Set a cancellation reminder the day you sign and cancel by certified email or registered letter." },
      src: ["rinnovo", "agcm_fitness"]
    },

    // ---------- Influencer e social ----------
    influencer: {
      t: { it: "Il codice sconto ha un secondo fine", en: "The discount code has a second purpose" },
      b: { it: "Quando un creator ti dà \"il suo codice\", quasi sempre guadagna una percentuale su quello che compri. Il consiglio può essere sincero, ma non è disinteressato: leggi la recensione tenendolo presente.",
           en: "When a creator gives you \"their code\", they almost always earn a percentage of what you buy. The advice may be honest, but it isn't disinterested: read the review with that in mind." }
    },
    adv: {
      t: { it: "Cerca #adv e la segnalazione dei filtri", en: "Look for #adv and filter disclosures" },
      b: { it: "Per le regole AGCOM un contenuto promozionale deve essere riconoscibile subito come pubblicità (\"ADV\", \"Sponsorizzato da…\"), e i filtri che alterano in modo sostanziale l'aspetto vanno segnalati. Se un contenuto è chiaramente commerciale e non lo dice, è già un segnale.",
           en: "Under AGCOM rules (Italy's communications authority), promotional content must be immediately recognisable as advertising (\"ADV\", \"Sponsored by…\"), and filters that substantially alter appearance must be disclosed. If a post is clearly commercial and doesn't say so, that's already a warning sign." },
      src: ["agcom"]
    },
    primadopo: {
      t: { it: "Le foto prima e dopo non sono prove", en: "Before-and-after photos aren't proof" },
      b: { it: "Luce, postura, pompaggio muscolare e poca acqua cambiano molto un corpo in foto. Prova a caricarle su Google Lens: a volte sono prese da altri profili o da banche immagini.",
           en: "Lighting, posture, a muscle pump and low water change a body a lot in photos. Try uploading them to Google Lens: sometimes they're taken from other profiles or stock image sites." }
    },
    adlibrary: {
      t: { it: "Controlla da quando gira l'\"offerta limitata\"", en: "Check how long the \"limited offer\" has been running" },
      b: { it: "La libreria inserzioni di Meta è pubblica: cerchi un marchio e vedi tutte le sue pubblicità attive su Instagram e Facebook, con la data d'inizio. Se l'offerta \"limitata\" è online da quattro mesi, hai la risposta.",
           en: "Meta's Ad Library is public: search for a brand and you'll see all its active ads on Instagram and Facebook, with their start date. If the \"limited\" offer has been online for four months, you have your answer." },
      src: ["adlibrary"]
    },
    storico: {
      t: { it: "Verifica che lo sconto sia vero", en: "Check the discount is real" },
      b: { it: "Per le regole europee, lo sconto va calcolato sul prezzo più basso degli ultimi 30 giorni. Per Amazon, siti come Keepa o CamelCamelCamel mostrano lo storico dei prezzi: se il prezzo barrato non torna, lo sconto è gonfiato.",
           en: "Under EU rules, a discount must be calculated from the lowest price of the previous 30 days. For Amazon, sites like Keepa or CamelCamelCamel show price history: if the crossed-out price doesn't add up, the discount is inflated." },
      src: ["omnibus"]
    },
    carrello: {
      t: { it: "Lascia il carrello pieno", en: "Leave the basket full" },
      b: { it: "Molti negozi online, se abbandoni il carrello dopo aver fatto l'accesso, ti mandano un codice sconto entro qualche giorno. Se non ti serve subito, aspetta.",
           en: "Many online shops send you a discount code within a few days if you abandon your basket while logged in. If you don't need it right away, wait." }
    },
    email: {
      t: { it: "Una email solo per acquisti e newsletter", en: "One email address just for shopping and newsletters" },
      b: { it: "Così la casella principale resta libera e le promozioni le leggi solo quando stai già cercando qualcosa, non quando sono loro a cercare te.",
           en: "That keeps your main inbox clear, and you read promotions only when you're already looking for something, not when they come looking for you." }
    },
    impostazioni: {
      t: { it: "Riduci le pubblicità che ti tentano", en: "Cut down the ads that tempt you" },
      b: { it: "Nelle impostazioni pubblicitarie di Instagram e Facebook puoi limitare alcuni argomenti. Meno pubblicità di diete, integratori o shopping nel feed vuol dire meno occasioni di comprare d'impulso.",
           en: "In Instagram's and Facebook's ad settings you can limit some topics. Fewer diet, supplement or shopping ads in your feed means fewer chances to buy on impulse." }
    },

    // ---------- Cosmetica ----------
    formen: {
      t: { it: "\"For men\" spesso è solo la confezione", en: "\"For men\" is often just the packaging" },
      b: { it: "Confronta ingredienti e prezzo al millilitro tra la versione \"per uomo\" e quella standard. Spesso cambiano il colore del flacone e il profumo, non la sostanza.",
           en: "Compare ingredients and price per millilitre between the \"for men\" version and the standard one. Often only the bottle colour and the scent change, not the contents." }
    },
    dermatest: {
      t: { it: "\"Dermatologicamente testato\" dice poco", en: "\"Dermatologically tested\" says little" },
      b: { it: "Vuol dire che un dermatologo ha seguito un test, ma non dice quale, su quante persone né su che tipo di pelle. Non se ne può dedurre che il prodotto vada bene per la pelle sensibile.",
           en: "It means a dermatologist supervised a test, but not which test, on how many people or on what skin type. You can't infer that the product suits sensitive skin." },
      src: ["claim_cosmetici"]
    },
    senza_cosm: {
      t: { it: "Ogni \"senza\" nasconde un \"con\"", en: "Every \"free from\" hides a \"with\"" },
      b: { it: "\"Senza parabeni\" vuol dire che c'è un altro conservante. \"Non testato su animali\" vanta un obbligo: in Europa i test sui cosmetici sono vietati dal 2013. Vendere come vantaggio il semplice rispetto della legge è una tecnica ricorrente.",
           en: "\"Paraben-free\" means there's another preservative. \"Not tested on animals\" boasts about an obligation: cosmetic animal testing has been banned in Europe since 2013. Selling mere compliance with the law as a benefit is a common technique." },
      src: ["claim_cosmetici"]
    },
    inci: {
      t: { it: "Il trucco del fenossietanolo", en: "The phenoxyethanol trick" },
      b: { it: "Nell'INCI gli ingredienti sono in ordine decrescente, ma sotto l'1% l'ordine è libero. Il phenoxyethanol, un conservante molto diffuso, è ammesso al massimo all'1%: tutto quello che viene dopo è all'1% o meno. Se l'attivo pubblicizzato sta dopo, è lì soprattutto per il marketing.",
           en: "In the INCI list ingredients appear in descending order, but below 1% the order is free. Phenoxyethanol, a very common preservative, is allowed at a maximum of 1%: everything after it is at 1% or less. If the advertised active comes after it, it's there mostly for marketing." },
      src: ["reg1223"]
    },
    dupe: {
      t: { it: "Trova il prodotto equivalente", en: "Find the equivalent product" },
      b: { it: "Confronta i primi 5-6 ingredienti dell'INCI: sono quelli che fanno il prodotto. Siti come INCIDecoder aiutano a confrontarli. Spesso esistono formule simili da farmacia o con il marchio del supermercato.",
           en: "Compare the first 5-6 INCI ingredients: they're what make the product. Sites like INCIDecoder help you compare them. Similar formulas often exist from pharmacy brands or supermarket own labels." }
    },
    campioni: {
      t: { it: "Prima i campioni", en: "Samples first" },
      b: { it: "Chiedi un tester in farmacia o in profumeria e prova per due settimane prima di comprare il formato grande.",
           en: "Ask for a tester at the pharmacy or beauty shop and try it for two weeks before buying the full size." }
    },
    packaging: {
      t: { it: "Il barattolo dice molto", en: "The jar says a lot" },
      b: { it: "Vitamina C e retinolo sono sensibili ad aria e luce. Se un attivo delicato è venduto in un vasetto aperto, l'attenzione è sull'aspetto più che sull'efficacia.",
           en: "Vitamin C and retinol are sensitive to air and light. If a delicate active is sold in an open jar, the focus is on looks more than on effectiveness." }
    },
    percentuali: {
      t: { it: "\"Il 92% lo consiglia\": su quante persone?", en: "\"92% recommend it\": out of how many?" },
      b: { it: "Spesso sono autovalutazioni di poche decine di persone. Un numero senza campione e metodo è pubblicità, non un dato. E i confronti con i farmaci, come \"l'effetto del botox senza ago\", nei cosmetici sono vietati.",
           en: "They're often self-assessments by a few dozen people. A number without sample and method is advertising, not data. And comparisons with medicines, like \"the effect of Botox without the needle\", are banned for cosmetics." },
      src: ["claim_cosmetici"]
    },
    testato: {
      t: { it: "\"Clinicamente provato\" non basta", en: "\"Clinically proven\" isn't enough" },
      b: { it: "Chiediti quale studio, su quante persone e chi l'ha pagato. Se l'etichetta non lo dice e il sito nemmeno, è uno slogan.",
           en: "Ask which study, on how many people and who paid for it. If neither the label nor the website says, it's a slogan." }
    },
    tecnico: {
      t: { it: "Nell'abbigliamento tecnico paghi il logo", en: "With sportswear you pay for the logo" },
      b: { it: "Guarda la composizione del tessuto sull'etichetta interna. Lo stesso materiale, senza il marchio famoso, costa spesso molto meno.",
           en: "Check the fabric composition on the inside label. The same material without the famous brand often costs much less." }
    },

    // ---------- Diete e coaching ----------
    titolo: {
      t: { it: "Verifica il titolo di chi ti consiglia", en: "Check the credentials of whoever advises you" },
      b: { it: "Biologi nutrizionisti, dietisti e medici sono iscritti ad albi che si consultano online. \"Nutrition coach\" non è un titolo professionale.",
           en: "In Italy, nutritionist biologists, dietitians and doctors are listed in professional registers you can check online. \"Nutrition coach\" is not a professional title." }
    },
    metodo: {
      t: { it: "Il test del metodo", en: "The method test" },
      b: { it: "Se un metodo promette di dimagrire senza parlare di bilancio calorico, sta vendendo un racconto. Cerca \"[nome del metodo] randomized trial\": se non esce nulla, esiste solo nel marketing. E sugli alimenti le promesse sulla quantità o sul ritmo di peso perso non sono ammesse.",
           en: "If a method promises weight loss without talking about energy balance, it's selling a story. Search \"[method name] randomized trial\": if nothing comes up, it only exists in marketing. And on foods, claims about how much or how fast you'll lose weight aren't allowed." },
      src: ["reg1924"]
    },

    // ---------- Tecniche generali ----------
    routine: {
      t: { it: "Diffida delle routine in 10 passaggi", en: "Be wary of 10-step routines" },
      b: { it: "Una routine con tanti passaggi serve a venderti tanti prodotti. Per ogni passaggio chiediti quale problema risolve, e se quel problema ce l'hai. Le prove solide riguardano pochi attivi, come la protezione solare.",
           en: "A routine with many steps exists to sell you many products. For each step, ask what problem it solves, and whether you have that problem. Solid evidence covers few actives, such as sunscreen." }
    },
    prove: {
      t: { it: "Le prove gratuite si rinnovano da sole", en: "Free trials renew by themselves" },
      b: { it: "Quasi tutte le prove gratuite diventano a pagamento se non le disdici. Segna la data di disdetta nel calendario appena ti iscrivi.",
           en: "Almost all free trials turn into paid plans if you don't cancel. Put the cancellation date in your calendar as soon as you sign up." }
    },
    urgenza: {
      t: { it: "\"Solo per oggi\" serve a farti correre", en: "\"Today only\" is there to rush you" },
      b: { it: "Conti alla rovescia, \"ultimi pezzi\" e offerte a tempo servono a farti decidere prima di confrontare. Per gli acquisti non essenziali lascia passare 48 ore: l'effetto \"solo oggi\" sparisce.",
           en: "Countdowns, \"last items\" and time-limited offers are meant to make you decide before you compare. For non-essential purchases, wait 48 hours: the \"today only\" effect disappears." }
    },
    formula: {
      t: { it: "\"Nuova formula\" può voler dire nuovo prezzo", en: "\"New formula\" can mean a new price" },
      b: { it: "Quando un prodotto cambia confezione o formula, confronta ingredienti, quantità e prezzo al chilo con la versione precedente: a volte la confezione è la stessa ma il contenuto è diminuito.",
           en: "When a product changes its packaging or formula, compare ingredients, quantity and price per kilo with the previous version: sometimes the pack looks the same but holds less." }
    },
    tre_per_due: {
      t: { it: "Il 3x2 conviene solo se ti servivano tre pezzi", en: "3-for-2 only pays if you needed three" },
      b: { it: "Le offerte a quantità fanno scendere il prezzo unitario ma alzano la spesa. Conta cosa consumerai prima della scadenza: un terzo pezzo che butti non è uno sconto.",
           en: "Multi-buy offers lower the unit price but raise the total. Count what you'll use before it expires: a third item you throw away isn't a discount." }
    },
    green: {
      t: { it: "\"Green\" ora deve essere dimostrato", en: "\"Green\" now has to be proven" },
      b: { it: "Dal 27 settembre 2026 in Italia scritte generiche come \"eco\" o \"green\" sono scorrette se l'azienda non dimostra un vantaggio ambientale riconosciuto, e i bollini di sostenibilità inventati non sono più ammessi. Per la Commissione europea oltre metà dei claim ambientali esaminati era vaga, ingannevole o infondata.",
           en: "From 27 September 2026, in Italy generic labels like \"eco\" or \"green\" are unfair unless the company proves a recognised environmental benefit, and home-made sustainability badges are no longer allowed. According to the European Commission, over half of the environmental claims it examined were vague, misleading or unfounded." },
      src: ["green"]
    },
    ore: {
      t: { it: "Trasforma il prezzo in ore di lavoro", en: "Turn the price into hours of work" },
      b: { it: "Un prodotto da 60 € vale 6 ore se guadagni 10 € l'ora. È molto più concreto di \"in offerta al 30%\".",
           en: "A €60 product is worth 6 hours if you earn €10 an hour. That's far more concrete than \"30% off\"." }
    },
    bollo: {
      t: { it: "Scopri chi produce la marca del supermercato", en: "Find out who makes the supermarket brand" },
      b: { it: "Su latticini, salumi e uova c'è un bollo ovale con \"IT\" e il codice dello stabilimento. Cercando il codice nell'elenco del Ministero della Salute trovi chi l'ha prodotto: spesso è lo stesso stabilimento di un prodotto di marca che costa di più.",
           en: "On dairy, cured meats and eggs there's an oval mark with \"IT\" and a plant code. Look the code up in the Ministry of Health's list and you'll find the producer: often it's the same plant as a branded product that costs more." }
    },

    // ---------- Genere ----------
    genere: {
      t: { it: "Stesso prodotto, due versioni, due prezzi", en: "Same product, two versions, two prices" },
      b: { it: "Rasoi, deodoranti e creme esistono spesso in versione \"per lui\" e \"per lei\". Confronta ingredienti e prezzo al millilitro: a volte costa di più l'una, a volte l'altra. Anche i formati \"da viaggio\" costano spesso di più al millilitro.",
           en: "Razors, deodorants and creams often come in \"for him\" and \"for her\" versions. Compare ingredients and price per millilitre: sometimes one costs more, sometimes the other. Travel sizes are often more expensive per millilitre too." }
    },
    insicurezza: {
      t: { it: "Prima l'insicurezza, poi la soluzione", en: "First the insecurity, then the solution" },
      b: { it: "Molte pubblicità per il corpo, rivolte sia agli uomini sia alle donne, prima ti fanno notare un difetto e poi ti vendono il rimedio. Chiediti se quel difetto lo vedevi prima della pubblicità.",
           en: "Many body-care ads, aimed at both men and women, first point out a flaw and then sell you the fix. Ask yourself whether you noticed that flaw before the ad." }
    },
    regali: {
      t: { it: "Le confezioni regalo", en: "Gift sets" },
      b: { it: "Cofanetti e confezioni regalo costano spesso più dei singoli prodotti comprati separatamente, anche al millilitro. E l'uomo o la donna della pubblicità non sono per forza la persona a cui fai il regalo: guarda cosa usa davvero.",
           en: "Boxed sets and gift packs often cost more than buying the same items separately, even per millilitre. And the man or woman in the ad isn't necessarily the person you're buying for: look at what they actually use." }
    }
  };

  // Tabella "Tradurre i claim", uguale in tutte le guide
  var claim = {
    title: { it: "Tradurre i claim", en: "Translating the claims" },
    rule: { it: "Una regola per tutto: togli dal claim ogni aggettivo e ogni parola emotiva. Se non resta un fatto misurabile, era pubblicità.",
            en: "One rule for everything: strip every adjective and emotional word from the claim. If no measurable fact is left, it was advertising." },
    head: { it: ["Claim", "Cosa significa davvero"], en: ["Claim", "What it really means"] },
    rows: [
      { c: { it: "\"Naturale\"", en: "\"Natural\"" }, m: { it: "Per la maggior parte dei prodotti non ha una definizione legale", en: "For most products it has no legal definition" } },
      { c: { it: "\"Dermatologicamente testato\"", en: "\"Dermatologically tested\"" }, m: { it: "Un dermatologo ha seguito un test, non si sa quale", en: "A dermatologist supervised a test, nobody knows which" }, src: ["claim_cosmetici"] },
      { c: { it: "\"Senza parabeni\"", en: "\"Paraben-free\"" }, m: { it: "Contiene un altro conservante", en: "It contains another preservative" } },
      { c: { it: "\"Fonte di proteine\"", en: "\"Source of protein\"" }, m: { it: "Almeno il 12% delle calorie viene dalle proteine: può esserlo anche un biscotto", en: "At least 12% of calories come from protein: even a biscuit can qualify" }, src: ["reg1924"] },
      { c: { it: "\"Il 9x% lo consiglia\"", en: "\"9x% recommend it\"" }, m: { it: "Spesso un'autovalutazione su un piccolo gruppo", en: "Often a self-assessment by a small group" } },
      { c: { it: "\"Formula esclusiva\"", en: "\"Exclusive formula\"" }, m: { it: "Dosi non dichiarate", en: "Undeclared doses" } },
      { c: { it: "\"Clinicamente provato\"", en: "\"Clinically proven\"" }, m: { it: "Chiedi lo studio: se non te lo danno, non c'è", en: "Ask for the study: if they won't give it to you, there isn't one" } }
    ]
  };

  var profiles = {
    classico: {
      path: "A",
      name: { it: "Il classico", en: "The classic" },
      description: {
        it: "I tuoi consumi ruotano intorno allo stare insieme: il bar, la partita, la birra con gli amici. Spendi poco sul corpo e molto sui momenti.",
        en: "Your spending revolves around being together: the bar, the match, a beer with friends. You spend little on your body and a lot on moments."
      },
      view: {
        it: "Per il marketing sei il cliente dei momenti. Le pubblicità che ti cercano non ti descrivono un prodotto: ti mostrano un gruppo di amici.",
        en: "To marketers you're the customer of moments. The ads aimed at you don't describe a product: they show you a group of friends."
      },
      tips: ["momento", "litro", "scaffali", "abbonamenti", "sepa", "scommesse", "maglie", "storico", "urgenza", "ore"]
    },
    costruttore: {
      path: "A",
      name: { it: "Il costruttore", en: "The builder" },
      description: {
        it: "Il tuo corpo è un progetto: allenamento, integratori, cura di te. È lì che va gran parte della tua spesa e della tua attenzione.",
        en: "Your body is a project: training, supplements, self-care. That's where most of your spending and attention goes."
      },
      view: {
        it: "Per il marketing sei uno dei clienti più preziosi del fitness: compri con regolarità, ti informi online e ti fidi di chi ha il fisico che vorresti.",
        en: "To marketers you're one of fitness's most valuable customers: you buy regularly, you research online and you trust people who have the body you want."
      },
      tips: ["proteine", "highprotein", "fontediproteine", "larn", "creatina", "blend", "aminospiking", "registro", "preworkout", "influencer", "adv", "primadopo", "palestra_ingresso", "palestra_prova", "palestra_disdetta", "formen"]
    },
    ibrido: {
      path: "A",
      name: { it: "L'ibrido", en: "The hybrid" },
      description: {
        it: "Tieni insieme due mondi: la palestra e il bar, gli integratori e la partita. Sei il bersaglio di due tipi di marketing diversi.",
        en: "You hold two worlds together: the gym and the bar, supplements and the match. You're the target of two different kinds of marketing."
      },
      view: {
        it: "Per il marketing sei due clienti in uno. Ti cercano con due linguaggi diversi e, sempre più spesso, con prodotti che provano a unire i due mondi.",
        en: "To marketers you're two customers in one. They reach you in two different languages and, more and more, with products that try to merge both worlds."
      },
      tips: ["proteine", "highprotein", "snack", "fontediproteine", "creatina", "registro", "influencer", "adv", "palestra_ingresso", "palestra_offerta", "palestra_disdetta", "tecnico", "momento", "litro", "sepa"]
    },
    essenziale: {
      path: "A",
      name: { it: "L'essenziale", en: "The essentialist" },
      description: {
        it: "Spendi poco sia sul corpo sia sui riti di gruppo. Il marketing con te deve lavorare di più: per questo prova a crearti bisogni nuovi.",
        en: "You spend little on your body and on group rituals. Marketing has to work harder with you: that's why it tries to create new needs."
      },
      view: {
        it: "Per il marketing sei un cliente difficile: compri poco e senza abitudini fisse. Le tecniche che usa con te puntano a crearti un bisogno o a farti decidere in fretta.",
        en: "To marketers you're a hard customer: you buy little and without fixed habits. The techniques used on you aim to create a need or to make you decide quickly."
      },
      tips: ["routine", "prove", "sepa", "urgenza", "storico", "adlibrary", "formula", "tre_per_due", "green", "ore", "email", "bollo"]
    },
    cura_fiducia: {
      path: "B",
      name: { it: "Cura e fiducia", en: "Care and trust" },
      description: {
        it: "Investi con regolarità su corpo e cura di te, e scegli cosa comprare affidandoti a consigli di persone e marchi di cui ti fidi.",
        en: "You invest regularly in your body and self-care, and you choose what to buy by relying on advice from people and brands you trust."
      },
      view: {
        it: "Per il marketing sei una cliente o un cliente fedele: una volta conquistata la tua fiducia, è difficile che tu cambi. Per questo ti arriva molto marketing attraverso persone, non attraverso prodotti.",
        en: "To marketers you're a loyal customer: once they've won your trust, you rarely switch. That's why a lot of the marketing aimed at you arrives through people, not products."
      },
      tips: ["influencer", "adv", "titolo", "primadopo", "metodo", "dermatest", "senza_cosm", "inci", "percentuali", "insicurezza", "routine", "esami", "cura", "genere"]
    },
    cura_calcolo: {
      path: "B",
      name: { it: "Cura e calcolo", en: "Care and calculation" },
      description: {
        it: "Spendi volentieri su corpo e cura di te, ma confronti, aspetti le offerte e guardi il prezzo prima del marchio.",
        en: "You're happy to spend on your body and self-care, but you compare, wait for deals and look at the price before the brand."
      },
      view: {
        it: "Per il marketing sei una persona attenta, che non si convince con uno slogan. Con te usa altre leve: offerte a tempo, confezioni convenienti, prove gratuite.",
        en: "To marketers you're careful and not won over by a slogan. So they use other levers on you: time-limited deals, multi-packs, free trials."
      },
      tips: ["genere", "inci", "dupe", "storico", "adlibrary", "carrello", "urgenza", "tre_per_due", "formula", "retro", "alone", "zuccheri", "palestra_ingresso", "palestra_disdetta", "green"]
    },
    fiducia: {
      path: "B",
      name: { it: "Pochi acquisti, molta fiducia", en: "Few purchases, lots of trust" },
      description: {
        it: "Compri poco per il corpo e la cura di te, e quando lo fai ti affidi a un consiglio o a un marchio che conosci.",
        en: "You buy little for your body and self-care, and when you do, you rely on advice or a brand you know."
      },
      view: {
        it: "Per il marketing sei una persona da convincere con una raccomandazione: la voce di qualcuno conta più di una pubblicità.",
        en: "To marketers you're someone to be won over by a recommendation: a trusted voice counts for more than an ad."
      },
      tips: ["influencer", "adv", "titolo", "metodo", "insicurezza", "dermatest", "campioni", "packaging", "regali", "urgenza", "impostazioni", "esami", "testato"]
    },
    essenziale_b: {
      path: "B",
      name: { it: "L'essenziale", en: "The essentialist" },
      description: {
        it: "Spendi poco per il corpo e la cura di te, e quando compri confronti o guardi il prezzo. Il marketing con te deve lavorare di più: per questo prova a crearti bisogni nuovi.",
        en: "You spend little on your body and self-care, and when you buy you compare or look at the price. Marketing has to work harder with you: that's why it tries to create new needs."
      },
      view: {
        it: "Per il marketing sei una persona difficile da convincere: compri poco e confronti. Le tecniche che usa con te puntano a crearti un bisogno o a farti decidere in fretta.",
        en: "To marketers you're hard to convince: you buy little and you compare. The techniques used on you aim to create a need or to make you decide quickly."
      },
      tips: ["routine", "campioni", "dupe", "packaging", "prove", "sepa", "urgenza", "storico", "genere", "tre_per_due", "green", "ore"]
    }
  };

  // Idea di uomo del percorso B (riga sotto il profilo)
  var idee = {
    classica: { it: "classica. Per te la virilità passa ancora da riti e oggetti tradizionali, come lo stadio, i motori, la griglia.",
                en: "classic. For you, masculinity still runs through traditional rituals and objects, like the stadium, engines, the grill." },
    contemporanea: { it: "contemporanea. Per te l'uomo di oggi si riconosce dal corpo e da come se ne prende cura, più che dai riti di gruppo.",
                     en: "contemporary. For you, today's man is recognised by his body and how he looks after it, more than by group rituals." },
    mista: { it: "mista. Vedi l'uomo di oggi come un insieme di vecchio e nuovo, la palestra accanto alla partita.",
             en: "mixed. You see today's man as a mix of old and new, the gym next to the match." }
  };

  // Nome del file PDF (senza lingua ed estensione) per ogni profilo
  function guideFile(id) {
    var p = profiles[id];
    return "profilo-" + ((p && p.guide) || id).replace(/_/g, "-");
  }

  return {
    fonti: fonti, claim: claim, compute: compute, computeIdea: computeIdea, idee: idee, scoreA: scoreA, scoreB: scoreB, profiles: profiles,
    consigli: consigli, domandeFinali: domandeFinali, guideFile: guideFile,
    soglie: { corpo: SOGLIA_CORPO, tradizione: SOGLIA_TRADIZIONE }
  };
})();
