# Questionario di tesi · Uomini e consumi

Landing page-questionario per la tesi magistrale in Sociologia del consumo.
È un sito statico (HTML, CSS e JavaScript senza framework né build), pubblicabile su GitHub Pages.
Le risposte arrivano in un Google Sheet attraverso un Google Form usato solo come archivio.

```
questionario-tesi/
├── index.html
├── .nojekyll
├── assets/
│   ├── config.js      ← URL del form e codici entry (l'unico file da toccare dopo lo script)
│   ├── i18n.js        ← TUTTI i testi IT/EN: domande, opzioni, informativa, interfaccia
│   ├── questions.js   ← struttura: tipi di domanda, percorsi A/B, regole (max 2, "Nessuna")
│   ├── app.js         ← motore del questionario
│   ├── submit.js      ← costruzione e invio del payload
│   ├── speech.js      ← lettura vocale
│   └── style.css
└── apps-script/
    └── crea-form.gs   ← crea il Google Form e il foglio, stampa i codici entry
```

---

## 1. Completa i testi

Apri `assets/i18n.js`:

1. Cerca `[NOME COGNOME]`, `[CORSO DI LAUREA]`, `[UNIVERSITÀ]` ed `[EMAIL DI CONTATTO]` e sostituiscili, sia nella riga `it` sia nella riga `en`. Finché non li compili, sul sito compaiono evidenziati in arancione.
2. Rivedi le traduzioni inglesi: ogni testo ha la forma `{ it: "...", en: "..." }`, con le due lingue una accanto all'altra.

> ⚠️ Non modificare le etichette **italiane** delle opzioni. Sono i valori che finiscono nel foglio e devono coincidere con quelle dello script Apps Script. Se una non coincide, Google scarta l'intera risposta **senza dare errori**. Se proprio devi cambiarne una, cambiala in entrambi i file e ricrea il form.

## 2. Crea il Google Form con lo script

1. Vai su <https://script.google.com> e fai clic su **Nuovo progetto**.
2. Cancella il codice di esempio e incolla tutto il contenuto di `apps-script/crea-form.gs`. Salva (icona del dischetto).
3. Nella barra in alto scegli la funzione **`creaQuestionario`** e premi **Esegui**.
4. Autorizza lo script. Google mostrerà "App non verificata": fai clic su **Avanzate → Vai a … (non sicuro)**. Lo script è tuo e agisce solo sul tuo account.
5. Al termine si apre il **Log di esecuzione** (se non compare: menu *Visualizza → Log*). Trovi:
   - il link per modificare il form;
   - il link al **foglio delle risposte**;
   - un link precompilato di controllo, che se aperto mostra il form con tutte le domande compilate;
   - il blocco tra `===== COPIA DA QUI …` e `===== FINE =====`.

Lo script crea:
- un form con una sola sezione, 34 domande + 5 campi tecnici, nessuna domanda obbligatoria, senza raccolta di email;
- le domande 16a/16b/16c come tre domande separate e le affermazioni 17 e 19 come scale lineari 1-5;
- un nuovo Google Sheet collegato.

### Controlla le impostazioni del form (una volta sola)

Apri il form dal link "modifica":
- in alto a destra dev'esserci **Pubblicato**. Se vedi il pulsante **Pubblica**, premilo e, alla voce *Utenti che rispondono*, scegli **Chiunque abbia il link**;
- in *Impostazioni → Risposte*: **Raccogli indirizzi email = Non raccogliere**, **Limita a 1 risposta = disattivato**. Con uno di questi attivi Google chiede il login e le risposte dal sito vanno perse in silenzio.

## 3. Incolla i codici nel config

Apri `assets/config.js`, cancella **tutto** il contenuto e incolla il blocco copiato dal log (da `window.SURVEY_CONFIG = {` fino a `};`). Il risultato sarà simile a:

```js
window.SURVEY_CONFIG = {
  formAction: "https://docs.google.com/forms/d/e/1FAIpQL.../formResponse",
  entries: {
    q1: "entry.123456789",
    q2: "entry.987654321",
    …
    inizio: "entry.555555555"
  }
};
```

Finché `formAction` è vuoto, il sito lavora in **invio simulato** e in alto mostra il bollino *NON CONFIGURATO*.

## 4. Prova il sito

### In locale
Il sito va aperto tramite un piccolo server, non con doppio clic su `index.html`. Ecco due modi:
- **VS Code**: installa l'estensione *Live Server*, fai clic destro su `index.html` e scegli *Open with Live Server*;
- **Python** (se installato): dalla cartella del progetto lancia `python -m http.server 8000` e apri <http://localhost:8000>.

### Modalità test: `?test=1`
Aggiungi `?test=1` all'indirizzo, per esempio `https://simonefranco01.github.io/questionario-tesi/?test=1`.
- Non viene inviato nulla, e in alto compare il bollino **TEST**.
- Alla fine, il payload compare **a schermo** (tabella con campo → entry → valore, più il body POST completo) e anche **nella console** del browser.
- Il flag "hai già risposto" viene ignorato, quindi puoi rifare il test quante volte vuoi.
- Una colonna `entry.???(qX)` indica un codice mancante in `config.js`.

### Prova reale (consigliata prima di lanciare le sponsorizzate)
1. Apri il sito **senza** `?test=1` e compila il questionario.
2. Controlla che nel Google Sheet sia comparsa la riga, con le etichette in italiano.
3. Cancella la riga di prova dal foglio.
4. Riapri il sito con `?reset=1` alla fine dell'indirizzo, così il browser dimentica "Hai già risposto".

## 5. Pubblica su GitHub Pages

1. Su <https://github.com/new> crea un repository pubblico (account **simonefranco01**). Consiglio un nome neutro come **`questionario-tesi`**, perché compare nell'indirizzo che vedono i rispondenti.
2. **Senza git:** nella pagina del repository vuoto fai clic su *uploading an existing file*, trascina **il contenuto** della cartella (`index.html`, `.nojekyll`, `assets/`, `apps-script/`, `README.md`) e premi *Commit changes*.
   Il file `.nojekyll` è nascosto: su Windows attiva *Visualizza → Elementi nascosti* per vederlo e trascinarlo.
   **Con git:**
   ```bash
   git init
   git add .
   git commit -m "Questionario di tesi"
   git branch -M main
   git remote add origin https://github.com/simonefranco01/questionario-tesi.git
   git push -u origin main
   ```
3. Nel repository vai su **Settings → Pages**. In *Build and deployment* scegli *Source: Deploy from a branch*, poi *Branch: `main`* e cartella */ (root)*, e premi **Save**.
4. Dopo uno o due minuti il sito sarà online su **`https://simonefranco01.github.io/questionario-tesi/`**.

Per aggiornare il sito basta caricare di nuovo i file modificati. GitHub Pages si aggiorna in un paio di minuti; se vedi ancora la versione vecchia, ricarica la pagina forzando l'aggiornamento.

## 6. Un link diverso per ogni pubblicità: `?src=`

Aggiungi `?src=` seguito da un nome breve, senza spazi (lettere, numeri, `-`, `_`, `.`):

| Pubblicità | Link |
|---|---|
| Instagram, storia A | `https://simonefranco01.github.io/questionario-tesi/?src=ig_storia_a` |
| Instagram, reel | `https://simonefranco01.github.io/questionario-tesi/?src=ig_reel` |
| Facebook, feed | `https://simonefranco01.github.io/questionario-tesi/?src=fb_feed` |

- Il valore finisce nella colonna **sorgente** del foglio. Chi apre il link senza `src` viene registrato come `diretto`.
- Chi condivide dalla schermata finale diffonde automaticamente il link con `?src=condiviso`.
- Nel pannello Meta Ads puoi incollare il link completo nel campo *URL del sito web*, oppure mettere solo `src=ig_storia_a` nel campo *Parametri URL*. Il parametro `fbclid` che Meta aggiunge da sola viene ignorato.
- Se una persona riprende il questionario da un altro link, resta valida la sorgente del **primo** accesso.

## 7. Cosa trovi nel foglio

| Colonna | Contenuto |
|---|---|
| 1. … 23. | Risposte con le etichette italiane, anche se la persona ha compilato in inglese. Le scelte multiple sono separate da virgola nella stessa cella. |
| 16a/16b/16c | Di più / Uguale / Di meno |
| 17a–17f, 19a–19e | Numeri da 1 a 5 |
| lingua | `it` o `en` (lingua attiva al momento dell'invio) |
| percorso | `uomo` (percorso A) oppure `donna-altro` (percorso B) |
| durata_secondi | Secondi dall'inizio all'invio. Se la persona ha chiuso e ripreso più tardi, include anche la pausa. |
| sorgente | Valore di `?src=` |
| inizio | Data e ora locali di inizio, formato `AAAA-MM-GG hh:mm:ss` |

Le domande saltate restano vuote. Anche le domande dell'altro percorso restano vuote.

**Regole di percorso:** "Uomo" alla domanda 1 porta al percorso A. "Donna", "Altro", "Preferisco non rispondere" **e la domanda 1 saltata** portano al percorso B. Se qualcuno torna indietro e cambia risposta, vengono inviate solo le risposte del percorso finale.

**Scelte "Nessuna" / "Nessuno di questi" / "Nessuna fonte in particolare":** selezionarle deseleziona le altre opzioni, e viceversa, così non si ottengono combinazioni contraddittorie.

## 8. Limiti noti (da citare eventualmente nella nota metodologica)

- **Nessuna conferma di ricezione.** Google non permette di leggere la risposta di un invio dal sito (`no-cors`). Il sito intercetta solo gli errori di rete (offline o timeout di 15 secondi) e in quel caso mostra "Riprova". Se il form viene chiuso o richiede il login, le risposte vanno perse senza avviso: per questo conviene fare la prova reale del punto 4.
- **"Hai già risposto" è un controllo per dispositivo e browser, non una garanzia.** Il flag vive nel `localStorage`: aprendo il link da un altro browser (per esempio prima da Instagram e poi da Safari), o in navigazione privata, si può rispondere di nuovo. I browser interni di Instagram e Facebook a volte cancellano questi dati. Lo stesso vale per la ripresa dei progressi.
- **Lettura vocale.** Usa le voci installate sul telefono, quindi qualità e disponibilità cambiano da un dispositivo all'altro. Se la sintesi non parte, i controlli audio spariscono e compare un avviso. Su iOS parte solo dopo un tocco: il pulsante "Inizia" e l'interruttore servono anche a questo.
- **Condivisione.** Nei browser interni di Instagram e Facebook il pannello di condivisione spesso non è disponibile. Il sito prova in quest'ordine: condivisione nativa, poi copia negli appunti, poi un campo con il link da copiare a mano.
- **Vibrazione.** Solo Android: iOS non la supporta.

## 9. Accessibilità e movimento

- Si naviga con la tastiera: Tab per spostarsi, frecce tra le opzioni, tasti **1-9** per scegliere, **Invio** per andare avanti.
- Con *Riduci movimento* attivo nel sistema operativo, le animazioni diventano semplici dissolvenze e le bollicine spariscono.
- Le aree di tocco sono alte almeno 44 px e i testi rispettano il contrasto WCAG AA.
