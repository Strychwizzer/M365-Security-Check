# M365 Security Check 1.0.0

Kostenloser Sicherheitscheck für Microsoft-365-Mandanten – per Doppelklick, ohne PowerShell, ohne Installation.

Das Programm startet einen kleinen Webserver, der **nur auf diesem Rechner** erreichbar ist (`http://localhost:8410`), und öffnet die Oberfläche im Standardbrowser. Anmeldung und alle Abfragen laufen direkt aus dem Browser gegen Microsoft Entra ID und Microsoft Graph. Es werden **ausschließlich lesende** Aufrufe gemacht, und es gehen keine Daten an Dritte (optional: Abfrage der öffentlichen Mail-DNS-Einträge über Cloudflare DNS-over-HTTPS).

---

## Schnellstart

1. ZIP entpacken, z. B. nach `C:\Tools\M365SecurityCheck`.
2. `M365SecurityCheck.exe` doppelklicken. Es öffnet sich ein Konsolenfenster (offen lassen) und der Browser.
3. Beim ersten Start die **Client-ID** der App-Registrierung eintragen (siehe unten).
4. Kundenmandanten eingeben (Domain oder Tenant-ID), **Mit Microsoft anmelden** – die Prüfung läuft automatisch.
5. Fragebogen mit dem Kunden ausfüllen und den **Prüfbericht** erzeugen.

> **macOS / Linux:** `chmod +x M365SecurityCheck` und `./M365SecurityCheck` starten. macOS: beim ersten Start Rechtsklick → *Öffnen*.

> **Windows SmartScreen:** Die Datei ist nicht signiert. Beim ersten Start ggf. *Weitere Informationen → Trotzdem ausführen* wählen.

Ohne Mandant ausprobieren: Auf der Anmeldeseite **Demo mit Beispieldaten** wählen.

---

## Einmalige Einrichtung: App-Registrierung

Einmal anlegen, dann für alle Kunden nutzbar (z. B. im eigenen Partner-Mandanten).

1. **Entra Admin Center → Identität → Anwendungen → App-Registrierungen → Neue Registrierung**
   - Name: `M365 Security Check`
   - Unterstützte Kontotypen: **Konten in einem beliebigen Organisationsverzeichnis (mehrinstanzenfähig)**
2. **Authentifizierung → Plattform hinzufügen → Single-Page-Anwendung (SPA)**
   - Umleitungs-URI: `http://localhost:8410/redirect.html`
3. **API-Berechtigungen → Microsoft Graph → Delegierte Berechtigungen** (alle nur lesend):
   `User.Read`, `Directory.Read.All`, `Policy.Read.All`, `RoleManagement.Read.Directory`, `AuditLog.Read.All`, `IdentityRiskyUser.Read.All`, `SecurityEvents.Read.All`, `SecurityAlert.Read.All`, `SharePointTenantSettings.Read.All`, `DeviceManagementConfiguration.Read.All`, `DeviceManagementManagedDevices.Read.All`, `BackupRestore-Configuration.Read.All`
4. **Anwendungs-ID (Client-ID)** kopieren und beim ersten Start eintragen.
5. Im Kundenmandanten einmal die **Administratorzustimmung** erteilen – beim ersten Login eines Admins oder per Link:
   `https://login.microsoftonline.com/<KUNDENMANDANT>/adminconsent?client_id=<CLIENT-ID>`

Prüfkonto: Rolle **Globaler Leser** (auch per GDAP).

### Für Kollegen vorbereiten

Eine `config.json` neben die Programmdatei legen (Vorlage `config.json.beispiel`) – dann entfällt die Einrichtungsseite.

---

## Daten

Alles liegt im Ordner `M365SecurityCheck-Daten` neben der Programmdatei: Konfiguration, gespeicherte Prüfergebnisse (enthalten Kundendaten – vertraulich behandeln) sowie Fragebogen-Antworten und Kommentare je Mandant.

Ausführliche Dokumentation: https://github.com/Strychwizzer/M365-Security-Check
