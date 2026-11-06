# Oberland MV – Karriereseite

Recruiting-Landingpage der **Oberland M & V GmbH**, Bad Wurzach.
Ausgeschriebene Stelle: **Verfahrensmechaniker (m/w/d) für Kunststoff- und
Kautschuktechnologie, Fachrichtung Formteile** – und ausschließlich diese.
Keine weiteren Positionen, keine Initiativbewerbung, keine Links auf andere
Vakanzen.

Aufbau 1:1 nach der ALWA-Seite: Topbar → Hero → Trust-Band → Stelle →
Benefits → Ablauf → Mid-CTA → Bewerbungsformular → FAQ → Footer, dazu der
Sticky-CTA auf dem Handy.

## Inhalt

- `index.html` – die komplette Seite (self-contained, kein Build-Schritt)
- `bilder/` – Logo, CI-Hintergrund, Favicon; hier kommt auch das Bildmaterial hin
  (siehe `bilder/HIER-BILDER-ABLEGEN.txt`)
- `.nojekyll` – GitHub Pages liefert die Dateien 1:1 aus

## Live schalten (GitHub Pages)

1. Repo-Settings → **Pages** → Source: **Deploy from a branch**, Branch: `main` / `/root`
2. Nach ein paar Minuten unter `https://saviold.github.io/Oberland/` erreichbar

## CI

Alle Werte stammen von **oberlandmv.com** (Theme-Variablen der Website):

| Token | Wert | Herkunft |
|-------|------|----------|
| `--brand` | `#225d39` | `--accent` der Website (Hausgrün) |
| `--brand-800` | `#17462a` | Hintergrund der Benefit-Fläche |
| `--brand-900` | `#0d371f` | Hintergrund-Logo der Website |
| `--yellow` | `#ffcd20` | `--yellow` der Website (Akzent) |
| Schrift | Maven Pro | `--gp-font--maven-pro` der Website |
| Ecken | `0 R 0 R` | Kartenform der Website (oben rechts / unten links rund) |

Logo: `bilder/oberlandmv-logo-weiss.svg` ist die Originaldatei der Website,
byte-identisch, nicht verändert. Weil es nur eine weiße Fassung gibt, ist die
Topbar grün – genau wie auf oberlandmv.com.

Claims von der Website: „natürlich geht's", „Hast du was auf dem Kasten?",
„Der Mehrweg für Ihre Karriere" (aus der Stellenanzeige).

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

Geprüft im Browser (Chromium, Touch-Emulation), jeweils alle Wege – voll
qualifiziert, optionale Kriterien nicht erfüllt und drei K.-o.-Varianten:

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

## Noch zu prüfen

- Testeintrag in der Lead Table ansehen (Spalten Name/Telefon/E-Mail) und löschen
- Analytics-Snippet am Seitenende (`analytics.laendle-digital.com`,
  `data-website-id="oberland_mv"`) ist von der Referenzseite übernommen –
  ID ggf. anlegen oder Snippet entfernen
- Hero-Foto: bis Bildmaterial da ist, steht das CI-Motiv der Website
