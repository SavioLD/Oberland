/* =====================================================================
   CREATIVE-GENERATOR · Oberland M & V GmbH
   ---------------------------------------------------------------------
   Rendert alle Meta-Ads-Creatives und die Facebook-Bilder aus HTML/CSS –
   im CI der Karriereseite (Farbcodex Grün/Silber/Weiß/Schwarz, Maven Pro
   + Arial, Ecken 0/R/0/R).

     node creatives/build.mjs

   Bildmaterial: AUSSCHLIESSLICH Dateien aus bilder/ (vom Kunden geliefert
   bzw. Original-Logo). Logos werden unverändert eingesetzt – nicht
   nachgebaut, nicht eingefärbt, Seitenverhältnis bleibt erhalten.
   ===================================================================== */

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TMP  = join(HERE, '.render.html');

/* ---------- CI (identisch mit dem :root-Block in index.html) ---------- */
const CI = {
  gruen:      '#225d39',   // Pantone 7483
  gruenTief:  '#0d371f',
  silber:     '#898c8e',   // Pantone 877
  silberHell: '#c9cbcc',
  schwarz:    '#1d1d1b',
  weiss:      '#ffffff',
  /* Exakte Flächenfarben aus den gelieferten Motiven – damit Foto und
     Fläche nahtlos ineinanderlaufen */
  bannerSilber: '#86898c',
  bannerGruen:  '#235d37',
  waldTop:      '#024a27',
  waldMitte:    '#003f20',
  waldUnten:    '#03361c'
};

/* ---------- Bildmaterial (nur aus bilder/) ---------- */
const BILD = {
  waldhaus:  'bilder/Waldhaus_OMV-1793888067.jpg',            // 1913 × 2684
  banner:    'bilder/Header-V2-OberlandMV-1793888067.jpg',     // 2940 × 600
  produkt:   'bilder/Produktbeispiel-2-1793888068.jpg',        // 2560 × 1040
  siegel:    'bilder/web/dvp-siegel.png',                      // Ausschnitt aus Auszeichnung_DV
  logoWeiss: 'bilder/oberlandmv-logo-weiss.svg',               // Original von oberlandmv.com
  logoFarbe: 'bilder/oberlandmv-logo-farbig.png',              // Original (Grün + Silber), 2000 × 2000 mit Weißraum
  logoFarbeEng: 'bilder/web/logo-farbig.png'                   // dasselbe Logo, nur Weißraum beschnitten
};
for (const [k, p] of Object.entries(BILD)) {
  if (!existsSync(join(ROOT, p))) { console.error(`Bild fehlt: ${p} (${k})`); process.exit(1); }
}
const url = p => '../' + p.split('/').map(encodeURIComponent).join('/');

/* ---------- Schrift lokal eingebettet (offline identisch) ---------- */
const MAVEN = readFileSync(join(HERE, 'fonts', 'maven-pro-latin-var.woff2')).toString('base64');
const BASE_CSS = `
@font-face{font-family:"Maven Pro";font-style:normal;font-weight:400 900;font-display:block;src:url(data:font/woff2;base64,${MAVEN}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Maven Pro",Arial,sans-serif;-webkit-font-smoothing:antialiased;position:relative;overflow:hidden;color:#fff}
.arial{font-family:Arial,"Liberation Sans",Helvetica,sans-serif}
.check{display:inline-grid;place-items:center;flex:0 0 auto;border-radius:50%;background:${CI.gruen}}
.check svg{stroke:#fff}
`;
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
const PFEIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/* Waldhaus-Kasten aus dem Plakat: nur Kasten + Spiegelung, eingebrannter
   Claim (oben) und Logo (unten rechts) liegen außerhalb des Ausschnitts.
   Ausschnitt im Original: x 0–1913, y 640–2150. Ränder weich maskiert. */
function waldhausKasten({ left, top, width, fadeBottom = 72 }) {
  const k = width / 1913, h = Math.round(1510 * k);
  return `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${h}px;
    background:url('${url(BILD.waldhaus)}') no-repeat;background-size:${Math.round(1913 * k)}px auto;background-position:0 ${-Math.round(640 * k)}px;
    -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 8%,#000 92%,transparent 100%),linear-gradient(180deg,transparent 0,#000 12%,#000 ${fadeBottom}%,transparent 100%);
    -webkit-mask-composite:source-in;mask-composite:intersect"></div>`;
}

/* Kasten aus dem Kampagnen-Banner (Mitte, ohne eingebrannte Schrift):
   Ausschnitt im Original x 930–2010, y 0–600 – die Silber/Grün-Kante liegt
   exakt in der Mitte. Oben/unten weich maskiert. */
function bannerKasten({ top, height = 600 }) {
  const k = height / 600;
  return `<div style="position:absolute;left:50%;top:${top}px;width:${Math.round(1080 * k)}px;height:${height}px;transform:translateX(-50%);
    background:url('${url(BILD.banner)}') no-repeat;background-size:${Math.round(2940 * k)}px auto;background-position:${-Math.round(930 * k)}px 0;
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 13%,#000 87%,transparent 100%)"></div>`;
}

const FORMATE = {
  '4x5':  { w: 1080, h: 1350 },
  '9x16': { w: 1080, h: 1920 }   // Safe Zones Stories/Reels: oben ~14 %, unten ~20 % frei
};

/* =====================================================================
   MOTIVE – drei Ansätze, alle mit der Qualifikationshürde im Bild
   (filtert auf Qualität statt Masse)
   ===================================================================== */
const MOTIVE = {

  /* 1 · STELLE – Berufsbild direkt ansprechen, Waldhaus-Kasten auf Grün */
  stelle(f) {
    const v = f.h > 1500;                       // 9:16
    const T = v ? 250 : 64;                     // oberer Rand
    const crateTop = v ? 690 : 455, crateW = v ? 1080 : 1000, crateL = v ? 0 : 40;
    const ctaTop = v ? 1405 : 1088;
    return `<style>
      body{width:${f.w}px;height:${f.h}px;background:linear-gradient(180deg,${CI.waldTop} 0%,${CI.waldMitte} 55%,${CI.waldUnten} 100%)}
      .kopf{position:absolute;left:72px;right:72px;top:${T}px;display:flex;align-items:center;justify-content:space-between}
      .kopf img{height:${v ? 112 : 96}px;width:auto}
      .pill{font-weight:700;font-size:25px;letter-spacing:.06em;text-transform:uppercase;color:#fff;border:2px solid rgba(255,255,255,.7);border-radius:999px;padding:11px 24px}
      .text{position:absolute;left:72px;right:60px;top:${T + (v ? 170 : 140)}px}
      .eyebrow{display:flex;align-items:center;gap:14px;font-weight:800;font-size:30px;letter-spacing:.08em;text-transform:uppercase;color:${CI.silberHell}}
      .eyebrow i{width:14px;height:14px;border-radius:50%;background:${CI.silberHell};box-shadow:0 0 0 6px rgba(201,203,204,.25)}
      h1{margin-top:20px;font-weight:800;font-size:${v ? 84 : 78}px;line-height:1.02;letter-spacing:-.01em}
      .sub{margin-top:14px;font-weight:600;font-size:${v ? 42 : 38}px;line-height:1.15;color:#e8efea}
      .badge{display:inline-block;margin-top:20px;background:#fff;color:${CI.gruen};font-weight:800;font-size:27px;letter-spacing:.07em;text-transform:uppercase;padding:10px 20px;border-radius:0 16px 0 16px}
      .schleier{position:absolute;left:0;right:0;bottom:0;height:${v ? 760 : 470}px;background:linear-gradient(180deg,rgba(3,54,28,0) 0%,rgba(3,54,28,.82) 38%,rgba(3,45,23,.96) 100%)}
      .unten{position:absolute;left:72px;right:72px;top:${ctaTop}px}
      .chips{display:flex;flex-wrap:wrap;gap:12px}
      .chip{font-weight:700;font-size:27px;padding:11px 22px;border-radius:999px;background:rgba(255,255,255,.12);border:2px solid rgba(201,203,204,.6)}
      .cta{margin-top:26px;display:inline-flex;align-items:center;gap:16px;background:#fff;color:${CI.gruen};font-weight:800;font-size:36px;padding:24px 42px;border-radius:999px;box-shadow:0 14px 40px rgba(0,0,0,.35)}
      .cta svg{width:34px;height:34px}
      .fein{margin-top:20px;font-size:23px;color:${CI.silberHell}}
    </style>
    ${waldhausKasten({ left: crateL, top: crateTop, width: crateW })}
    <div class="schleier"></div>
    <div class="kopf"><img src="${url(BILD.logoWeiss)}" alt=""><span class="pill">Wir stellen ein</span></div>
    <div class="text">
      <div class="eyebrow"><i></i>Hast du was auf dem Kasten?</div>
      <h1>Verfahrens&shy;mechaniker<br>(m/w/d)</h1>
      <div class="sub">für Kunststoff- und Kautschuktechnologie</div>
      <div class="badge">Fachrichtung Formteile</div>
    </div>
    <div class="unten">
      <div class="chips"><span class="chip">30 Tage Urlaub</span><span class="chip">Sicherer Arbeitsplatz</span><span class="chip">Bad Wurzach</span></div>
      <div class="cta">In 60 Sekunden bewerben ${PFEIL}</div>
      <div class="fein arial">Abgeschlossene Ausbildung vorausgesetzt · Ohne Lebenslauf bewerben</div>
    </div>`;
  },

  /* 2 · CHECK – Qualifizierer im Kampagnen-Look (Silber | Kasten | Grün) */
  check(f) {
    const v = f.h > 1500;
    const T = v ? 250 : 60;
    const bandTop = v ? 590 : 330, bandH = v ? 640 : 600;
    const cardTop = v ? 1160 : 870;
    return `<style>
      body{width:${f.w}px;height:${f.h}px;background:linear-gradient(90deg,${CI.bannerSilber} 0 50%,${CI.bannerGruen} 50% 100%)}
      .kopf{position:absolute;left:64px;right:64px;top:${T}px;display:flex;align-items:center;justify-content:space-between}
      .kopf span{font-weight:800;font-size:25px;letter-spacing:.1em;text-transform:uppercase}
      .kopf img{height:84px;width:auto}
      h1{position:absolute;left:0;right:0;top:${T + (v ? 120 : 96)}px;text-align:center;font-weight:800;font-size:${v ? 90 : 82}px;line-height:1.02;text-transform:uppercase;letter-spacing:.005em;text-shadow:0 3px 24px rgba(0,0,0,.18)}
      .karte{position:absolute;left:56px;right:56px;top:${cardTop}px;background:#fff;color:${CI.schwarz};border-radius:0 44px 0 44px;padding:36px 46px 36px;box-shadow:0 24px 60px rgba(0,0,0,.28)}
      .karte h2{font-weight:800;font-size:40px;line-height:1.1;color:${CI.gruen}}
      .karte h2 small{display:block;font-weight:600;font-size:25px;color:${CI.silber};margin-top:6px;letter-spacing:.02em}
      .liste{list-style:none;margin-top:24px;display:grid;gap:16px}
      .liste li{display:flex;align-items:center;gap:18px;font-size:29px;font-weight:700;line-height:1.25}
      .liste .check{width:44px;height:44px}.liste .check svg{width:24px;height:24px}
      .zeile{margin-top:28px;display:flex;align-items:center;justify-content:space-between;gap:20px}
      .zeile b{font-weight:800;font-size:34px;color:${CI.gruen}}
      .cta{display:inline-flex;align-items:center;gap:14px;background:${CI.gruen};color:#fff;font-weight:800;font-size:31px;padding:20px 32px;border-radius:999px}
      .cta svg{width:30px;height:30px}
    </style>
    ${bannerKasten({ top: bandTop, height: bandH })}
    <div class="kopf"><span>Wir stellen ein</span><img src="${url(BILD.logoWeiss)}" alt=""></div>
    <h1>Hast du was<br>auf dem Kasten?</h1>
    <div class="karte">
      <h2>Verfahrensmechaniker (m/w/d)<small>Kunststoff- und Kautschuktechnologie · Bad Wurzach</small></h2>
      <ul class="liste arial">
        <li><span class="check">${CHECK}</span>Ausbildung, Fachrichtung Formteile</li>
        <li><span class="check">${CHECK}</span>Spritzguss, Robotik, IML und GID</li>
        <li><span class="check">${CHECK}</span>Bereit für 3-Schicht</li>
      </ul>
      <div class="zeile"><b>Dann sollten wir reden.</b><span class="cta">Jetzt bewerben ${PFEIL}</span></div>
    </div>`;
  },

  /* 3 · ARBEITGEBER – Benefit voran, Produktbild + Auszeichnung, weiß mit farbigem Logo */
  arbeitgeber(f) {
    const v = f.h > 1500;
    const T = v ? 240 : 56;
    const imgTop = v ? 650 : 452;
    const listTop = v ? 1070 : 862;
    const barTop = v ? 1340 : 1102;
    return `<style>
      body{width:${f.w}px;height:${f.h}px;background:#fefefe;color:${CI.schwarz}}   /* = Hintergrund der Logo-Datei */
      .kopf{position:absolute;left:66px;right:66px;top:${T}px;display:flex;align-items:flex-start;justify-content:space-between}
      .logo{height:${v ? 132 : 120}px;width:auto}
      .siegel{height:${v ? 140 : 128}px;width:auto;border-radius:0 16px 0 16px}
      .text{position:absolute;left:66px;right:66px;top:${T + (v ? 200 : 182)}px}
      .kicker{font-weight:800;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:${CI.silber}}
      h1{margin-top:10px;font-weight:800;font-size:${v ? 80 : 72}px;line-height:1.03;color:${CI.gruen};letter-spacing:-.01em}
      .bild{position:absolute;left:66px;right:66px;top:${imgTop}px;height:${v ? 384 : 382}px;border-radius:0 40px 0 40px;overflow:hidden;
        background:url('${url(BILD.produkt)}') center/cover no-repeat}
      .bild span{position:absolute;left:0;bottom:0;background:rgba(13,55,31,.92);color:#fff;font-weight:700;font-size:24px;padding:12px 22px;border-radius:0 24px 0 0}
      .liste{position:absolute;left:66px;right:66px;top:${listTop}px;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:${v ? 22 : 18}px 26px}
      .liste li{display:flex;align-items:center;gap:14px;font-size:${v ? 31 : 29}px;font-weight:700}
      .liste .check{width:40px;height:40px}.liste .check svg{width:22px;height:22px}
      .bar{position:absolute;left:0;right:0;top:${barTop}px;bottom:0;background:${CI.gruen};color:#fff;padding:${v ? 46 : 38}px 66px}
      .bar .row{display:flex;align-items:center;justify-content:space-between;gap:24px}
      .bar b{display:block;font-weight:800;font-size:37px;line-height:1.1}
      .bar small{display:block;margin-top:6px;font-weight:600;font-size:25px;color:${CI.silberHell}}
      .cta{display:inline-flex;align-items:center;gap:14px;background:#fff;color:${CI.gruen};font-weight:800;font-size:31px;padding:20px 32px;border-radius:999px;white-space:nowrap}
      .cta svg{width:30px;height:30px}
      .claim{margin-top:${v ? 34 : 22}px;font-weight:500;font-size:24px;color:${CI.silberHell};letter-spacing:.04em}
    </style>
    <div class="kopf"><img class="logo" src="${url(BILD.logoFarbeEng)}" alt=""><img class="siegel" src="${url(BILD.siegel)}" alt=""></div>
    <div class="text">
      <div class="kicker">Ausgezeichnet in Form und Design</div>
      <h1>Der Mehrweg für<br>deine Karriere.</h1>
    </div>
    <div class="bild"><span>Das entsteht an deinen Anlagen</span></div>
    <ul class="liste arial">
      <li><span class="check">${CHECK}</span>30 Tage Urlaub</li>
      <li><span class="check">${CHECK}</span>VWL &amp; bAV</li>
      <li><span class="check">${CHECK}</span>Sicherer Arbeitsplatz</li>
      <li><span class="check">${CHECK}</span>Dienstrad-Leasing</li>
      <li><span class="check">${CHECK}</span>Weiterbildung</li>
      <li><span class="check">${CHECK}</span>Mitarbeiterevents</li>
    </ul>
    <div class="bar">
      <div class="row">
        <div><b>Verfahrensmechaniker (m/w/d)</b><small>Fachrichtung Formteile · Bad Wurzach</small></div>
        <span class="cta">Jetzt bewerben ${PFEIL}</span>
      </div>
      <div class="claim">Oberland MV – Natürlich geht’s!</div>
    </div>`;
  }
};

/* =====================================================================
   FACEBOOK
   ===================================================================== */
const FACEBOOK = {
  /* Profilbild 1080 × 1080, farbiges Original-Logo auf Weiß.
     Logo-Breite 830 px: die Ecken der Logo-Fläche liegen 470 px vom
     Mittelpunkt – Facebook schneidet bei 540 px rund. */
  'facebook-profilbild': { w: 1080, h: 1080, html: () => `<style>
      body{width:1080px;height:1080px;background:#fefefe}   /* = Hintergrund der Logo-Datei, nahtlos */
      /* Original-PNG (2000 × 2000, Logo-Fläche x 80–1914 / y 417–1391) so
         skalieren, dass die Logo-Fläche 830 px breit ist und mittig sitzt */
      img{position:absolute;width:${Math.round(2000 * 830 / 1834)}px;height:auto;
        left:${Math.round(540 - 997 * 830 / 1834)}px;top:${Math.round(540 - 904 * 830 / 1834)}px}
    </style><img src="${url(BILD.logoFarbe)}" alt="">` },

  /* Variante: weißes Original-Logo auf Hausgrün (gleiche Größe) */
  'facebook-profilbild-gruen': { w: 1080, h: 1080, html: () => `<style>
      body{width:1080px;height:1080px;background:${CI.gruen}}
      img{position:absolute;left:50%;top:50%;width:830px;height:auto;transform:translate(-50%,-50%)}
    </style><img src="${url(BILD.logoWeiss)}" alt="">` },

  /* Titelbild 1640 × 856. Sicherheitszone 1092 × 616 mittig
     (x 274–1366, y 120–736). Unten rechts bleibt frei (Button). */
  'facebook-titelbild': { w: 1640, h: 856, html: () => `<style>
      body{width:1640px;height:856px;background:linear-gradient(180deg,${CI.waldTop} 0%,${CI.waldMitte} 55%,${CI.waldUnten} 100%)}
      .links{position:absolute;left:300px;top:150px;width:520px}
      .links img{height:178px;width:auto}
      .slogan{margin-top:30px;font-weight:700;font-size:66px;line-height:1.02}
      .linie{width:92px;height:5px;background:${CI.silber};margin:26px 0 22px;border-radius:3px}
      .sub{font-weight:500;font-size:29px;line-height:1.3;color:${CI.silberHell}}
      .rechts-unten-frei{display:none}
    </style>
    ${waldhausKasten({ left: 790, top: 110, width: 600, fadeBottom: 62 })}
    <div class="links">
      <img src="${url(BILD.logoWeiss)}" alt="">
      <div class="slogan">Natürlich geht’s!</div>
      <div class="linie"></div>
      <div class="sub">Innovative, langlebige Mehrweglösungen für Europas Getränkebranche – seit fast 60 Jahren.</div>
    </div>` }
};

/* =====================================================================
   RENDERN
   ===================================================================== */
const page = (w, h, body) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${BASE_CSS} html,body{width:${w}px;height:${h}px}</style></head><body>${body}</body></html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const p = await ctx.newPage();
const fertig = [];

async function render(name, w, h, body) {
  writeFileSync(TMP, page(w, h, body));
  await p.setViewportSize({ width: w, height: h });
  await p.goto(pathToFileURL(TMP).href, { waitUntil: 'load' });
  await p.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  await p.waitForTimeout(250);
  const out = join(HERE, name + '.png');
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
  fertig.push(`${name}.png (${w} × ${h})`);
}

for (const [motiv, fn] of Object.entries(MOTIVE))
  for (const [fmtName, f] of Object.entries(FORMATE))
    await render(`oberland-${motiv}-${fmtName}`, f.w, f.h, fn(f));
for (const [name, fb] of Object.entries(FACEBOOK))
  await render(name, fb.w, fb.h, fb.html());

await browser.close();
if (existsSync(TMP)) unlinkSync(TMP);
console.log('Gerendert:\n  ' + fertig.join('\n  '));
