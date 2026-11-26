# Sicherheit & Datenschutz

## Architektur

```
Browser (localhost:8410) ──► login.microsoftonline.com   Anmeldung (MSAL, PKCE, öffentlicher Client)
        │                ──► graph.microsoft.com          nur GET-Abfragen (delegiert)
        │                ──► cloudflare-dns.com           optional: öffentliche DNS-Einträge der Maildomänen
        ▼
Lokaler Server (Programmdatei) – liefert die Oberfläche aus, speichert Konfiguration, Ergebnisse und Notizen
```

- Der lokale Server lauscht **nur auf 127.0.0.1** und nimmt nur Anfragen mit Host `localhost`/`127.0.0.1` an (Schutz vor DNS-Rebinding). Schreibende API-Aufrufe sind nur von der eigenen Oberfläche erlaubt (Origin-Prüfung).
- Eine strikte **Content-Security-Policy** erlaubt Verbindungen ausschließlich zu den drei oben genannten Zielen.
- Es gibt **keinen Cloud-Dienst des Herstellers**, keine Telemetrie und keine Weitergabe von Daten.
- Alle Microsoft-Graph-Aufrufe sind **lesend** (GET). Der automatisierte Test prüft das.
- Das Zugriffstoken liegt nur im Session Storage des Browsers und verfällt mit der Sitzung.

## Was wird gespeichert?

Im Ordner `M365SecurityCheck-Daten` neben der Programmdatei:

| Datei | Inhalt |
| --- | --- |
| `config.json` | Client-ID, Standard-Mandant, Untertitel |
| `ergebnisse/*.json` | Rohdaten jeder Prüfung (für Verlauf und Vergleich) |
| `notizen/<Tenant-ID>.json` | Fragebogen-Antworten, Kommentare, akzeptierte Risiken |

Gelöschte Ergebnisse werden in `ergebnisse/_entfernt` verschoben, nicht endgültig gelöscht.

## Personenbezogene Daten

Für die Prüfung werden u. a. Anzeigenamen, Benutzerprinzipalnamen, letzte Anmeldung, MFA-Registrierungsstatus und Rollenzuweisungen gelesen und in der Ergebnisdatei gespeichert. Das ist für die Bewertung (z. B. inaktive Administratoren, Gäste ohne Anmeldung) erforderlich.

Empfehlungen:

- Ergebnisdateien wie Kundendaten behandeln (verschlüsselter Datenträger, Löschfristen).
- Prüfung auf Grundlage eines Auftrags bzw. einer Vereinbarung mit dem Kunden durchführen.
- Im Prüfbericht lassen sich Namen in den Detaillisten abwählen („Namen in Detaillisten“).
- Nicht mehr benötigte Ergebnisse löschen (`ergebnisse/` und `ergebnisse/_entfernt/`).

## DNS-Prüfung

Bei aktivierter DNS-Prüfung fragt der Browser für jede eigene Maildomäne die öffentlichen Einträge (MX, TXT/SPF, `_dmarc`, `selector1/2._domainkey`, `_mta-sts`) bei Cloudflare per DNS-over-HTTPS ab. Übertragen werden dabei nur die Domainnamen. Die Prüfung lässt sich auf der Anmeldeseite abwählen.

## Sicherheitslücken melden

Siehe [SECURITY.md](../SECURITY.md).
