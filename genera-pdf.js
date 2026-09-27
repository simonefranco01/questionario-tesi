/*
 * GENERA LE GUIDE PDF (assets/guide/*.pdf) dai testi di assets/profiles.js
 *
 * Requisiti (una volta):  npm i playwright @fontsource/fraunces @fontsource/inter
 * Uso:                    node tools/genera-pdf.js
 *
 * Una guida per profilo, con la versione italiana e poi quella inglese: profilo-<id>.pdf.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "guide");

// Carica profiles.js come nel browser
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets", "profiles.js"), "utf8"), sandbox);
const P = sandbox.window.PROFILES;

function font(pkg, file) {
  const p = require.resolve(pkg + "/files/" + file);
  return "data:font/woff2;base64," + fs.readFileSync(p).toString("base64");
}
const FONTS = `
@font-face{font-family:Fraunces;font-weight:500;src:url(${font("@fontsource/fraunces", "fraunces-latin-500-normal.woff2")})}
@font-face{font-family:Fraunces;font-weight:600;src:url(${font("@fontsource/fraunces", "fraunces-latin-600-normal.woff2")})}
@font-face{font-family:Inter;font-weight:400;src:url(${font("@fontsource/inter", "inter-latin-400-normal.woff2")})}
@font-face{font-family:Inter;font-weight:500;src:url(${font("@fontsource/inter", "inter-latin-500-normal.woff2")})}
@font-face{font-family:Inter;font-weight:600;src:url(${font("@fontsource/inter", "inter-latin-600-normal.woff2")})}
@font-face{font-family:Inter;font-weight:700;src:url(${font("@fontsource/inter", "inter-latin-700-normal.woff2")})}`;

const L = {
  it: {
    kicker: "Guida anti-marketing",
    title: "Come non farti fregare dal marketing",
    profileLabel: "Il tuo profilo",
    viewTitle: "Come ti vede il marketing",
    tipsTitle: "Cosa fare",
    refsTitle: "Fonti",
    footer: "Questa guida non contiene pubblicità, link di affiliazione o codici sconto. È stata scritta da Simone Franco per chi ha risposto al questionario della sua tesi magistrale all'Università degli Studi di Verona."
  },
  en: {
    kicker: "Anti-marketing guide",
    title: "How not to get fooled by marketing",
    profileLabel: "Your profile",
    viewTitle: "How marketing sees you",
    tipsTitle: "What to do",
    refsTitle: "Sources",
    footer: "This guide contains no advertising, affiliate links or discount codes. It was written by Simone Franco for the people who answered the questionnaire for his master's thesis at the University of Verona."
  }
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function section(lang, g) {
  const t = L[lang];
  const num = (keys) => (keys || []).map((k) => g.refs.indexOf(k) + 1).sort((a, b) => a - b);
  const sup = (keys) => { const n = num(keys); return n.length ? `<sup>${n.join(",")}</sup>` : ""; };
  const tips = g.tips.map((k, i) => {
    const c = P.consigli[k];
    return `<li class="tip"><span class="n">${i + 1}</span><div><h3>${esc(c.t[lang])}${sup(c.src)}</h3><p>${esc(c.b[lang])}</p></div></li>`;
  }).join("");
  const C = P.claim;
  const claimRows = C.rows.map((r) => `<tr><td>${esc(r.c[lang])}${sup(r.src)}</td><td>${esc(r.m[lang])}</td></tr>`).join("");
  const refs = g.refs.map((k) => `<li>${esc(P.fonti[k].label)}. <span class="url">${esc(P.fonti[k].url)}</span></li>`).join("");
  const qs = P.domandeFinali.items.map((q) => `<li>${esc(q[lang])}</li>`).join("");
  return `<section class="lang-${lang}" lang="${lang}">
<div class="head">
  <p class="kicker">${esc(t.kicker)} · Simone Franco <span class="lang-tag">${lang === "it" ? "IT" : "EN"}</span></p>
  <h1>${esc(t.title)}</h1>
  <p class="label">${esc(g.label)}</p>
  <p class="profile">${esc(g.name)}</p>
  ${g.desc ? `<p class="desc">${esc(g.desc)}</p>` : ""}
  ${lang === "it" ? `<p class="other">English version after the Italian one.</p>` : ""}
</div>
<div class="view"><h2>${esc(t.viewTitle)}</h2><p>${esc(g.view)}</p></div>
<h2 class="tips-title">${esc(t.tipsTitle)}</h2>
<ol class="tips">${tips}</ol>
<div class="claims"><h2>${esc(C.title[lang])}</h2>
<table><thead><tr><th>${esc(C.head[lang][0])}</th><th>${esc(C.head[lang][1])}</th></tr></thead><tbody>${claimRows}</tbody></table>
<p class="rule">${esc(C.rule[lang])}</p></div>
<div class="qs"><h2>${esc(P.domandeFinali.title[lang])}</h2><ol>${qs}</ol></div>
<div class="refs"><h2>${esc(t.refsTitle)}</h2><ol>${refs}</ol></div>
<p class="foot">${esc(t.footer)}</p>
</section>`;
}

const STYLE = `<meta charset="utf-8"><style>
${FONTS}
@page{size:A4;margin:13mm 15mm 14mm}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,sans-serif;font-size:10pt;line-height:1.45;color:#1F1A13}
.head{background:linear-gradient(135deg,#F6DDA9,#D6EDE3);border-radius:18px;padding:18px 22px 16px;margin-bottom:14px}
.kicker{font-size:8.5pt;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:#4B4236;margin:0 0 8px}
h1{font-family:Fraunces,serif;font-weight:600;font-size:25pt;line-height:1.05;margin:0 0 14px}
.label{font-size:8.5pt;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#4B4236;margin:0 0 2px}
.profile{font-family:Fraunces,serif;font-weight:600;font-size:17pt;margin:0 0 6px}
.desc{margin:0;color:#1F1A13;max-width:44em}
.view{border-left:4px solid #D08A1E;padding:4px 0 4px 14px;margin:0 0 18px}
.view h2,.tips-title,.qs h2{font-family:Fraunces,serif;font-weight:600;font-size:13pt;margin:0 0 4px}
.view p{margin:0;color:#4B4236}
.tips-title{margin:0 0 10px}
ol.tips{list-style:none;padding:0;margin:0 0 18px}
.tip{display:flex;gap:12px;padding:8px 13px;margin:0 0 7px;background:#FFF9EC;border:1px solid rgba(31,26,19,.14);border-radius:12px;break-inside:avoid}
.tip .n{flex:none;width:22px;height:22px;border-radius:50%;background:#1F1A13;color:#FFF9EC;font-weight:700;font-size:9pt;display:grid;place-items:center;margin-top:1px}
.tip h3{font-size:10.5pt;font-weight:600;margin:0 0 2px}
.tip p{margin:0;color:#4B4236}
.qs{background:#1F1A13;color:#FFF9EC;border-radius:14px;padding:14px 18px;break-inside:avoid;margin-bottom:14px}
.qs ol{margin:6px 0 0;padding-left:1.2em}.qs li{margin:0 0 3px}
sup{font-size:7pt;font-weight:600;color:#D08A1E;margin-left:2px}
.claims{break-inside:avoid;margin:0 0 16px}
.claims h2,.refs h2{font-family:Fraunces,serif;font-weight:600;font-size:13pt;margin:0 0 6px}
.claims table{width:100%;border-collapse:collapse;font-size:9.5pt}
.claims th{text-align:left;font-size:8.5pt;letter-spacing:.05em;text-transform:uppercase;color:#4B4236;border-bottom:1.5px solid #1F1A13;padding:4px 8px 4px 0}
.claims td{border-bottom:1px solid rgba(31,26,19,.14);padding:5px 8px 5px 0;vertical-align:top}
.claims td:first-child{font-weight:600;width:38%}
.rule{margin:8px 0 0;font-size:9.5pt;font-style:italic;color:#4B4236}
.refs{margin:0 0 12px;break-inside:avoid-page}
.refs ol{margin:0;padding-left:1.4em;font-size:8pt;color:#4B4236}
.refs li{margin:0 0 3px}
.refs .url{word-break:break-all;color:#8A5A10}
.foot{break-inside:avoid;font-size:8.5pt;color:#4B4236;border-top:1px solid rgba(31,26,19,.2);padding-top:8px}
.lang-en{break-before:page}
.lang-tag{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;background:#1F1A13;color:#FFF9EC;letter-spacing:.06em}
.other{margin:10px 0 0;font-size:8.5pt;color:#4B4236}
`;

function html(id) {
  const p = P.profiles[id];
  // Fonti numerate nell'ordine in cui compaiono: prima i consigli, poi la tabella dei claim
  const refs = [];
  p.tips.forEach((k) => (P.consigli[k].src || []).forEach((f) => { if (!refs.includes(f)) refs.push(f); }));
  P.claim.rows.forEach((r) => (r.src || []).forEach((f) => { if (!refs.includes(f)) refs.push(f); }));
  const g = (lang) => ({ label: L[lang].profileLabel, name: p.name[lang], desc: p.description[lang], view: p.view[lang], tips: p.tips, refs });
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><style>\n${FONTS}\n${STYLE}</style></head><body>${section("it", g("it"))}${section("en", g("en"))}</body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage();
  const ids = Object.keys(P.profiles).filter((id) => P.profiles[id].tips);
  for (const id of ids) {
    const file = `${P.guideFile(id)}.pdf`;
    await page.setContent(html(id), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(OUT, file), format: "A4", printBackground: true, preferCSSPageSize: true });
    console.log("creato", file);
  }
  await browser.close();
})();
