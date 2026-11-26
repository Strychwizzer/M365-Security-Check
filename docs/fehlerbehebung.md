# Fehlerbehebung

## Anmeldung

| Meldung | Ursache | Lösung |
| --- | --- | --- |
| `AADSTS50011` – Umleitungs-URI stimmt nicht | URI fehlt oder Port weicht ab | In der App-Registrierung unter *Authentifizierung → Single-Page-Anwendung* exakt `http://localhost:8410/redirect.html` eintragen (bzw. den verwendeten Port) |
| `AADSTS9002326` – Cross-origin token redemption | URI ist als *Web* statt *SPA* registriert | URI unter *Web* entfernen und unter *Single-Page-Anwendung* anlegen |
| `AADSTS700016` – Anwendung nicht gefunden | App nicht mehrinstanzenfähig oder Client-ID falsch | Unter *Authentifizierung → Unterstützte Kontotypen* „Mehrinstanzenfähig“ wählen, Client-ID prüfen |
| `AADSTS65001` / „Administratorgenehmigung erforderlich“ | Zustimmung im Kundenmandanten fehlt oder ist nach dem Ergänzen von Berechtigungen veraltet | Zustimmungslink verwenden (wird in der Fehlermeldung angezeigt) oder Admin des Kunden zustimmen lassen |
| `AADSTS50020` / `AADSTS90072` – Benutzer existiert nicht im Mandanten | falscher Mandant oder GDAP-Beziehung fehlt | Kundenmandanten auf der Anmeldeseite eintragen; GDAP-Beziehung und Rollen prüfen |
| Anmeldefenster öffnet nicht | Pop-up-Blocker | Pop-ups für `localhost` erlauben oder auf der Anmeldeseite **„Anmeldung im selben Fenster statt Pop-up“** aktivieren |
| Anmeldefenster hängt nach der MFA-Bestätigung bzw. der Zustimmungsdialog erscheint nicht | Pop-up erhält die Authenticator-Bestätigung nicht (z. B. in eingebetteten Browsern) | Pop-up schließen, **„Anmeldung im selben Fenster statt Pop-up“** aktivieren und erneut anmelden |
| Anmeldung bleibt nach MFA oder „Akzeptieren“ stehen, auch ohne Pop-up | Eingebetteter Browser (In-App-Browser) bricht das Absenden der Microsoft-Anmeldeseite ab | In einem normalen Browser (Edge, Chrome, Firefox) anmelden; das Ergebnis lässt sich danach überall über „Gespeicherte Prüfung öffnen“ ansehen |
| Viele Bereiche „Keine Berechtigung (403)“, obwohl zugestimmt wurde | Berechtigung als *Anwendungsberechtigung* statt *delegiert* eingetragen | In der App-Registrierung prüfen, dass in der Spalte *Typ* überall „Delegiert“ steht; falsche Einträge entfernen, delegiert hinzufügen, erneut zustimmen |

## Prüfung

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| „Keine Berechtigung (403)“ im Scan-Protokoll | Graph-Berechtigung fehlt, Zustimmung veraltet oder Konto ohne passende Rolle | Berechtigungen laut [Einrichtung](einrichtung.md#3-api-berechtigungen) prüfen, nach Ergänzung **erneut zustimmen**; Konto braucht *Globaler Leser* |
| „Lizenz fehlt“ (PIM, Risikobenutzer, letzte Anmeldung …) | Mandant hat kein Entra ID P1/P2 | Das ist ein Befund an sich: Die Funktion steht nicht zur Verfügung. Betroffene Prüfungen sind „nicht prüfbar“ oder „nicht erfüllt“ mit Lizenzhinweis |
| Secure-Score-Kontrollen fehlen | `SecurityEvents.Read.All` fehlt oder für einen neuen Mandanten liegt noch kein Score vor | Berechtigung ergänzen; Secure Score wird von Microsoft täglich berechnet |
| SharePoint-Prüfungen „nicht prüfbar“ | `SharePointTenantSettings.Read.All` fehlt oder Rolle nicht ausreichend | Berechtigung ergänzen; Rolle Globaler Leser oder SharePoint-Administrator |
| E-Mail-DNS „nicht prüfbar“ | DNS-Prüfung abgewählt oder `cloudflare-dns.com` durch Proxy/Firewall blockiert | Haken auf der Anmeldeseite setzen bzw. Zugriff auf `https://cloudflare-dns.com` erlauben |
| DKIM „Prüfen“ trotz aktiver Signierung | Drittanbieter-Gateway signiert mit eigenem Selektor | Selektor des Gateways manuell prüfen und den Punkt ggf. als Risiko akzeptieren |
| Prüfung dauert lange | sehr große Mandanten (viele Benutzer, Geräte), Drosselung durch Graph | Das Programm wartet automatisch und wiederholt gedrosselte Anfragen |

## Programm

| Symptom | Lösung |
| --- | --- |
| „Port 8410 ist bereits belegt“ | Läuft das Programm schon (anderes Konsolenfenster)? Sonst mit `-port 8411` starten und die Umleitungs-URI ergänzen |
| Windows SmartScreen blockiert | *Weitere Informationen → Trotzdem ausführen*, siehe [Einrichtung](einrichtung.md#windows-smartscreen) |
| Browser öffnet sich nicht | Adresse aus dem Konsolenfenster (`http://localhost:8410/`) manuell öffnen |
| Word zeigt kein Inhaltsverzeichnis | beim Öffnen „Felder aktualisieren“ mit *Ja* bestätigen oder im Dokument `F9` |
| PDF ohne farbige Tabellenköpfe | Im Druckdialog *Hintergrundgrafiken* aktivieren |
| CSV in Excel mit falschen Spalten | Datei per Doppelklick öffnen; Trennzeichen ist Semikolon |

## Fehler melden

Bitte ein Issue mit Version (unter *Einstellungen*), Browser, Fehlermeldung und – falls möglich – dem betroffenen Eintrag aus dem Scan-Protokoll anlegen. **Keine Ergebnisdateien oder Kundendaten anhängen.**
