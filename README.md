# Oberland MV – Karriereseite + Ad-Funnel

Recruiting-Landingpage der **Oberland M & V GmbH**, Bad Wurzach.
Ausgeschriebene Stelle: **Verfahrensmechaniker (m/w/d) für Kunststoff- und
Kautschuktechnologie, Fachrichtung Formteile** – und ausschließlich diese.
Keine weiteren Positionen, keine Initiativbewerbung, keine Links auf andere
Vakanzen.

Aufbau 1:1 nach der ALWA-Seite: Topbar → Hero → Trust-Band → Stelle →
Benefits/Über uns → Ablauf → Mid-CTA → Bewerbungsformular → FAQ → Footer,
dazu der Sticky-CTA auf dem Handy.

## Inhalt

| Pfad | Inhalt |
|------|--------|
| `index.html` | die komplette Seite (self-contained, kein Build-Schritt) |
| `bilder/` | Bildmaterial des Kunden + Original-Logos (unverändert) |
| `bilder/web/` | web-optimierte Ableitungen für die Seite (siehe „Bildmaterial") |
| `creatives/` | Meta-Ads-Creatives, Facebook-Bilder, Werbetexte, Generator |
| `.nojekyll` | GitHub Pages liefert die Dateien 1:1 aus |

## Live schalten (GitHub Pages)

1. Repo-Settings → **Pages** → Source: **Deploy from a branch**, Branch: `main` / `/root`
2. Nach ein paar Minuten unter `https://saviold.github.io/Oberland/` erreichbar

## CI (laut Styleguide)

| Element | Wert | Verwendung |
|---------|------|------------|
| Grün | Pantone 7483 · `#225d39` | Hauptfarbe: Topbar-CTA, Überschriften, Flächen, Buttons |
| Silber | Pantone 877 · `#898c8e` | zweite Logofarbe: Akzente, Kampagnen-Split, Auswahl-Kennungen |
| Weiß | `#ffffff` | Flächen, CTAs auf Grün |
| Schwarz | `#1d1d1b` | Fließtext |
| Schrift | **Arial** (Styleguide) für Fließtext · **Maven Pro** für Überschriften | Maven Pro ist die Schrift von oberlandmv.com und der Kampagnenplakate („Oberland MV / Natürlich geht's") und greift die Anmutung des Logos auf |
| Slogan | „Natürlich geht’s!" | Topbar, Über uns, Footer, Creatives, Titelbild |
| Ecken | `0 R 0 R` | Kartenform der Website (oben rechts / unten links rund) |

Dunklere Grüntöne (`#17462a`, `#0d371f`) sind Abstufungen des Hausgrüns –
sie stammen von den Flächen der Website. Das Gelb der Website-Hover-Effekte
ist nicht im Farbcodex und wird deshalb **nicht** verwendet.

**Logos** (beide unverändert, nicht nachgebaut, nicht eingefärbt):

- `bilder/oberlandmv-logo-farbig.png` – Original vom Kunden (Grün + Silber),
  auf weißen Flächen: Topbar, Creative „Arbeitgeber", Facebook-Profilbild.
  `bilder/web/logo-farbig.png` ist dieselbe Datei, nur der Weißraum beschnitten.
- `bilder/oberlandmv-logo-weiss.svg` – Original von oberlandmv.com, auf
  grünen Flächen: Hero, Footer, Creatives „Stelle"/„Check", Titelbild.

## Bildmaterial

| Original (vom Kunden) | verwendet für |
|-----------------------|---------------|
| `Waldhaus_OMV-….jpg` | Hero der Seite, Creative „Stelle", Facebook-Titelbild |
| `Header-V2-OberlandMV-….jpg` | Mid-CTA der Seite, Creative „Check" |
| `Produktbeispiel-2-….jpg` | Stellen-Sektion der Seite, Creative „Arbeitgeber" |
| `Auszeichnung_DV-….jpg` | Über-uns-Block der Seite; Siegel daraus im Creative „Arbeitgeber" |

In den Plakaten eingebrannte Schrift und Logos werden **nie mitgezeigt** –
es wird jeweils nur der Kasten ausgeschnitten:

- `bilder/web/hero-waldhaus.jpg` – Waldhaus-Kasten ohne Claim und ohne Logo,
  nach links und oben nahtlos ins Grün des Plakats verlängert
- `bilder/web/kasten-split.jpg` – Mitte des Kampagnen-Banners (Silber | Grün)
  ohne die eingebrannten Zeilen
- `bilder/web/dvp-siegel.png` – Siegel „Deutscher Verpackungspreis" aus dem
  Auszeichnungsmotiv
- `bilder/web/produktbeispiel.jpg`, `bilder/web/auszeichnung.jpg` – Web-Größen

## Vorfilterung (Screening)

Vier Fragen, **eine pro Schritt**, danach die Kontaktdaten (5 Schritte).

| # | Frage | Kategorie | Erfüllt bei |
|---|-------|-----------|-------------|
| 1 | Ausbildung | **Pflicht** (K.-o.) | Abgeschlossene Ausbildung als Verfahrensmechaniker K&K **und** Fachrichtung Formteile |
| 2 | Deutschkenntnisse | **Pflicht** (K.-o.) | „Muttersprache / sehr gut" oder „Gut" |
| 3 | Erfahrung in der Fertigung | optional | Kunststoffverarbeitung oder andere Fertigung |
| 4 | 3-Schicht-Bereitschaft | optional | „Ja, das passt für mich" |

Die beiden Pflichtkriterien „Ausbildung" und „Fachrichtung Formteile" stecken
bewusst in **einer** Frage: Antwort A erfüllt beides, „andere Fachrichtung"
ist ein K.-o. Das spart einen Schritt, ohne etwas aufzuweichen.

**Die 3-Schicht-Bereitschaft** stand im Briefing unter „Allgemein wichtig",
nicht unter den K.-o.-Kriterien – deshalb ist sie optional. Soll sie
K.-o. werden, ist das eine Zeile im `<script>`:

```js
{ field:"schichtbereitschaft", label:"3-Schicht-Bereitschaft", pflicht:true }
```

**Logik**

- **Pflichtfrage nicht erfüllt** → Bewerbung endet sofort. Freundlicher
  Abschlusshinweis, keine weiteren Schritte, **kein Lead an die Lead Table**,
  keine anderen Stellen.
- **Optionale Frage nicht erfüllt** → Bewerber kommt normal weiter. Die
  Antwort wird übertragen und markiert: im Feld selbst mit „(nicht erfüllt)"
  und zusätzlich im Feld `nicht_erfuellt`.

Welche Antwort als „erfüllt" gilt, steht direkt am Radio-Input als
`data-ok="1"`.

**Nicht abgefragt:** Alter, Herkunft, Gesundheit, Religion, Familienstand (AGG).
**Kein Lebenslauf-Upload, keine Dateianhänge.**

## Mobile Laufruhe

Beim Schrittwechsel passiert ausschließlich ein Klassenwechsel. Es gibt
**kein** `window.scrollTo`, **kein** `scrollIntoView`, **kein** `focus()`,
keinen Reload und keinen Hash-Sprung. Der Formularcontainer hat eine feste
Mindesthöhe (`--form-min` 520 px / `--form-min-mobile` 500 px), die über
allen Schritten liegt – der Weiter-Button steht immer an derselben Stelle.
Bilder oberhalb des Formulars haben feste Seitenverhältnisse, nichts
verschiebt sich beim Nachladen.

Geprüft im Browser (Chromium, Touch-Emulation) **nach der Umstellung auf
Styleguide und Arial**, jeweils alle Wege – voll qualifiziert, optionale
Kriterien nicht erfüllt und drei K.-o.-Varianten:

| Viewport | scrollY über alle Schritte | Formularhöhe | Weiter-Button | Karte passt ins Bild |
|----------|----------------------------|--------------|---------------|----------------------|
| 360 × 640 | konstant | 500 px | fix | ja (558 px) |
| 375 × 667 | konstant | 500 px | fix | ja |
| 390 × 844 | konstant | 500 px | fix | ja |
| 414 × 896 | konstant | 500 px | fix | ja |
| 1366 × 900 | konstant | 520 px | fix | ja |

Von Frage 1 bis zur Bestätigung: kein einziger Scroll- oder Fokus-Aufruf.

## Lead Table

Webhook in `index.html` unter `WEBHOOK_URL` (Kachel `tableID 6aed88ccd7ad3158f44642cd`).
Gesendet wird **nur** bei vollständiger, qualifizierter Bewerbung.

Payload – **jedes Feld genau einmal**, Vor- und Nachname getrennt, **kein**
kombiniertes `name` / `fullname` / `vollstaendiger_name`:

```json
{
  "vorname": "Max",
  "nachname": "Mustermann",
  "telefon": "0151 23456789",
  "email": "max.mustermann@beispiel.de",
  "stelle": "Verfahrensmechaniker (m/w/d) für Kunststoff- und Kautschuktechnologie, Fachrichtung Formteile",
  "ausbildung": "Ja, abgeschlossen – Fachrichtung Formteile",
  "deutschkenntnisse": "Gut – ich verstehe Arbeitsanweisungen und verständige mich sicher",
  "erfahrung_fertigung": "Noch nicht – bisher nur in der Ausbildung (nicht erfüllt)",
  "schichtbereitschaft": "Ja, 3-Schicht passt für mich",
  "nicht_erfuellt": "Erfahrung in der Fertigung",
  "datum": "06.11.2026",
  "datenschutz": "Ja (Einwilligung mit Absenden, Art. 6 Abs. 1 lit. a DSGVO)",
  "quelle": "Karriere-Landingpage Oberland MV",
  "seite": "https://saviold.github.io/Oberland/?…"
}
```

Die Feldnamen folgen der Konvention der bestehenden Lead-Table-Anbindungen
derselben Agentur (ALWA, Schanbacher): `vorname`, `nachname`, `telefon`,
`email` als Standardfelder, alles Weitere als Zusatzfelder. Der Webhook bietet
keine Abfrage der erwarteten Felder (GET → 404).

**Testeintrag (06.11.2026):** über das echte Formular gesendet,
Vorname „Test", Nachname „Karriereseite", Telefon „0151 11122233",
E-Mail „test.karriereseite@example.com", `seite` endet auf
`?test=claude-testeintrag`. Antwort **HTTP 200**, Lead-ID
`6aed904406d74ade329880cc`. Genau ein Request, jedes Feld genau einmal.
→ Den Eintrag in der Lead Table bitte löschen.

## Creatives (Meta Ads) + Facebook-Seite

Alles in `creatives/`, gerendert mit **einem** Befehl:

```bash
node creatives/build.mjs
```

Das Skript baut jede Datei aus HTML/CSS im CI der Karriereseite – gleiche
Farben, gleiche Schriften (Maven Pro liegt als woff2 in `creatives/fonts/`,
damit offline identisch gerendert wird). Es verwendet ausschließlich Dateien
aus `bilder/`.

**3 Motive × 2 Formate** – alle mit der Qualifikationshürde im Bild
(Qualität statt Masse):

| Datei | Ansatz | Format |
|-------|--------|--------|
| `oberland-stelle-4x5.png` / `-9x16.png` | Berufsbild direkt, Waldhaus-Kasten auf Grün, „Fachrichtung Formteile" + „Ausbildung vorausgesetzt" | 1080 × 1350 / 1080 × 1920 |
| `oberland-check-4x5.png` / `-9x16.png` | Qualifizierer im Kampagnen-Look Silber \| Kasten \| Grün: „Hast du was auf dem Kasten?" + Checkliste | 1080 × 1350 / 1080 × 1920 |
| `oberland-arbeitgeber-4x5.png` / `-9x16.png` | Benefit voran: „Der Mehrweg für deine Karriere", Produktbild, Siegel Deutscher Verpackungspreis, farbiges Logo | 1080 × 1350 / 1080 × 1920 |

9:16: Oben ~14 % und unten ~20 % bleiben frei (Story-/Reels-Oberfläche).

**Facebook-Seite**

| Datei | Format | Hinweis |
|-------|--------|---------|
| `facebook-profilbild.png` | 1080 × 1080 | farbiges Original-Logo auf Weiß, mittig; Logo reicht max. 455 px vom Mittelpunkt → 85 px Rand zum runden Beschnitt |
| `facebook-profilbild-gruen.png` | 1080 × 1080 | Alternative: weißes Original-Logo auf Hausgrün |
| `facebook-titelbild.png` | 1640 × 856 | Logo, „Natürlich geht’s!" und Kasten in der Sicherheitszone 1092 × 616; unten rechts frei für den Button |

**Werbetexte:** `creatives/werbetexte.md` – 3 Varianten (Benefit voran /
Berufsbild direkt / Problem → Lösung), jede mit jedem Creative kombinierbar.

## Noch zu prüfen

- Testeintrag in der Lead Table ansehen (Spalten Name/Telefon/E-Mail) und löschen
- Analytics-Snippet am Seitenende (`analytics.laendle-digital.com`,
  `data-website-id="oberland_mv"`) ist von der Referenzseite übernommen –
  ID ggf. anlegen oder Snippet entfernen
- Auf den Produktmotiven sind Kundenmarken zu sehen (Waldhaus, Altenmünster,
  Schöfferhofer, Stiegl) – das Material kommt vom Kunden selbst; in den
  Texten werden die Marken bewusst nicht genannt
