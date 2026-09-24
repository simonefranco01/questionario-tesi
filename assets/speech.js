/*
 * LETTURA VOCALE (Web Speech API, speechSynthesis)
 * - Il testo è diviso in frasi brevi: Chrome interrompe le letture lunghe.
 * - iOS (anche nel browser di Instagram) parla solo dopo un tocco dell'utente:
 *   unlock() va chiamato dentro un gestore di click.
 * - Se la sintesi non parte o dà errore, onFail avvisa l'app, che nasconde i controlli.
 */
window.Speech = (function () {
  var synth = window.speechSynthesis;
  var supported = !!(synth && window.SpeechSynthesisUtterance);
  var voices = [];
  var speaking = false;
  var unlocked = false;
  var token = 0;
  var changeFns = [];
  var failFns = [];

  function loadVoices() {
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
  }

  if (supported) {
    loadVoices();
    try {
      if (synth.addEventListener) synth.addEventListener("voiceschanged", loadVoices);
      else synth.onvoiceschanged = loadVoices;
    } catch (e) {}
  }

  function pickVoice(lang) {
    var prefs = lang === "it" ? ["it-it", "it"] : ["en-gb", "en-us", "en"];
    for (var p = 0; p < prefs.length; p++) {
      var best = null;
      for (var i = 0; i < voices.length; i++) {
        var vl = String(voices[i].lang || "").replace("_", "-").toLowerCase();
        if (vl.indexOf(prefs[p]) === 0) {
          if (!best || (voices[i].localService && !best.localService)) best = voices[i];
        }
      }
      if (best) return best;
    }
    return null;
  }

  function setSpeaking(v) {
    if (speaking === v) return;
    speaking = v;
    changeFns.forEach(function (fn) { fn(v); });
  }

  function fail(reason) {
    failFns.forEach(function (fn) { fn(reason); });
  }

  function unlock() {
    if (!supported || unlocked) return;
    try {
      var u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      synth.speak(u);
      unlocked = true;
    } catch (e) {}
  }

  function stop() {
    token++;
    if (supported) { try { synth.cancel(); } catch (e) {} }
    setSpeaking(false);
  }

  function speak(chunks, lang) {
    if (!supported || !chunks || !chunks.length) return;
    stop();
    var my = token;
    loadVoices();
    var voice = pickVoice(lang);
    var started = false;
    setSpeaking(true);

    chunks.forEach(function (text, i) {
      var u = new SpeechSynthesisUtterance(text);
      u.lang = voice ? voice.lang : (lang === "it" ? "it-IT" : "en-GB");
      if (voice) u.voice = voice;
      u.rate = 1;
      u.onstart = function () { started = true; };
      u.onerror = function (e) {
        var err = e && e.error;
        if (my !== token || err === "interrupted" || err === "canceled") return;
        setSpeaking(false);
        fail(err || "error");
      };
      if (i === chunks.length - 1) {
        u.onend = function () { if (my === token) setSpeaking(false); };
      }
      try { synth.speak(u); } catch (e) { setSpeaking(false); fail("exception"); }
    });

    // Se dopo qualche secondo non è partito niente, la sintesi non funziona qui.
    setTimeout(function () {
      if (my === token && !started && !synth.speaking && !synth.pending) {
        setSpeaking(false);
        fail("timeout");
      }
    }, 4000);
  }

  return {
    supported: supported,
    unlock: unlock,
    speak: speak,
    stop: stop,
    isSpeaking: function () { return speaking; },
    onChange: function (fn) { changeFns.push(fn); },
    onFail: function (fn) { failFns.push(fn); }
  };
})();
