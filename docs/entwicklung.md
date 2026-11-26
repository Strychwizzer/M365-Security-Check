# Entwicklung

## Aufbau

```
main.go                 lokaler Webserver (nur Go-Standardbibliothek), bettet web/ ein
web/index.html          Einstieg
web/app.css             Design (dunkel/hell, IBM Plex) – gemeinsame Basis mit dem Intune Inspector
web/js/graph.js         Anmeldung (MSAL) und Graph-Zugriff mit Wiederholung bei Drosselung
web/js/collector.js     Datenerfassung: Graph-Quellen und DNS-over-HTTPS
web/js/catalog.js       Bereiche, ISO-/NIS2-Bezüge, Lizenzen, Fragebogen
web/js/checks.js        Prüfungen, Secure-Score-Übernahme, Bewertung, Maßnahmenplan
web/js/export.js        Prüfbericht (Word, HTML/PDF, Markdown, CSV)
web/js/demo.js          Demo-Mandant
web/js/app.js           Oberfläche
tests/                  Node-Tests (ohne Abhängigkeiten)
tools/                  Paketbau, Screenshots, Prüfkatalog
```

## Starten

```sh
go run . -no-browser -data /tmp/msc     # http://localhost:8410/?demo
```

Änderungen an `web/` werden beim nächsten `go run`/`go build` eingebettet.

## Tests

```sh
cd tests
node logic.test.mjs       # Bewertungslogik mit Demo-Daten und Varianten, Katalog-Konsistenz
node scan-mock.test.mjs   # Datenerfassung gegen simulierte Graph-API und DNS (nur GET erlaubt)
node export.test.mjs      # Berichtsexporte
```

## Neue Prüfung hinzufügen

1. In `web/js/checks.js` im Array `CHECKS` einen Eintrag ergänzen: `id`, `cat`, `sev`, `title` (als Soll-Zustand formuliert), `why`, `fix`, `effort`, ggf. `lic`, `iso`, `nis2`, `needs` (benötigte Datenquellen) und `run(ctx)`, das `{ status, summary, head?, rows? }` liefert.
2. Braucht die Prüfung neue Daten, in `web/js/collector.js` eine Quelle in `SOURCES` ergänzen (nur GET!) und die Berechtigung in `PERMS` (`app.js`), der README und `docs/einrichtung.md` nachtragen.
3. Demo-Daten (`demo.js`) und `scan-mock.test.mjs` erweitern.
4. `node tools/katalog.mjs` erzeugt `docs/pruefkatalog.md` neu.

## Screenshots und Beispielbericht

```sh
go run . -no-browser -data /tmp/msc &
python3 tools/screenshots.py
```

## Release

```sh
git tag v1.0.0 && git push origin v1.0.0
```

Der Workflow *Release* testet, baut die Pakete für Windows, macOS und Linux und legt einen Release-Entwurf mit den Notizen aus `CHANGELOG.md` an. Alternativ lokal: `tools/package.sh`.
