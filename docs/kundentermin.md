# Ablauf im Kundentermin

So lässt sich der kostenlose M365 Security Check als Vertriebsaktion durchführen – in der Regel in **60–90 Minuten** inklusive Fragebogen.

## Vorbereitung (Partner)

1. App-Registrierung einmalig im eigenen Partner-Mandanten anlegen ([Einrichtung](einrichtung.md)) und das ZIP mit vorbereiteter `config.json` an das Team verteilen.
2. In den *Prüfbericht*-Einstellungen Partnername, eigenen Namen und Kontakt hinterlegen – sie werden gespeichert.
3. Dem Kunden vorab schicken:
   - kurze Beschreibung (nur lesend, keine Änderungen, Daten bleiben lokal beim Prüfer),
   - den **Zustimmungslink** `https://login.microsoftonline.com/<Kundendomain>/adminconsent?client_id=<Client-ID>` – ein Globaler Administrator des Kunden stimmt einmal zu,
   - die Bitte, ein Konto mit der Rolle **Globaler Leser** bereitzustellen (oder GDAP mit Globaler Leser).

## Im Termin

| Schritt | Dauer | Inhalt |
| --- | --- | --- |
| 1. Anmeldung & technische Prüfung | 5–10 Min. | Kundenmandant eingeben, anmelden, Prüfung läuft automatisch |
| 2. Fragebogen | 20–30 Min. | 22 Fragen gemeinsam durchgehen; Antworten fließen direkt in die Bewertung ein |
| 3. Ergebnisse besprechen | 20–30 Min. | Übersicht, wichtigste offene Punkte, Quick Wins, Lizenzbasis |
| 4. Bericht | 5 Min. | Prüfbericht als Word oder PDF erzeugen und übergeben bzw. nachsenden |

Tipps:

- **Quick Wins** zuerst zeigen – sie lassen sich oft noch im Termin oder kurz danach umsetzen und schaffen Vertrauen.
- Der Hinweis **„Lizenz fehlt“** im Maßnahmenplan zeigt, wo Entra ID P1/P2, Intune, Defender oder Purview fehlen – ein natürlicher Einstieg in das Lizenzgespräch (z. B. Business Premium oder E5 Security).
- Punkte, die der Kunde bewusst anders löst (z. B. Drittanbieter-Gateway, eigene Backup-Lösung), über **Risiko akzeptieren** mit Begründung markieren – der Bericht weist sie gesondert aus.
- Kommentare je Prüfpunkt (Ansprechpartner, geplanter Termin) erscheinen im Bericht.
- Für Kunden mit NIS2-Pflichten die Ansicht **ISO 27001 & NIS2** zeigen.

## Nach dem Termin

- Bericht mit Angebot für die Maßnahmen der Priorität „Sofort“ und „Kurzfristig“ versenden; der **Maßnahmenplan als CSV** eignet sich als Projektliste.
- Folgetermin nach Umsetzung: erneut prüfen und unter **Verlauf & Vergleich** den Fortschritt zeigen – der Bericht enthält dann den Abschnitt „Veränderung seit …“.
- Auf Wunsch kann der Kunde die Unternehmensanwendung „M365 Security Check“ in seinem Mandanten wieder entfernen.

## Formulierungsvorschlag für die Einladung

> Im Rahmen unseres kostenlosen Microsoft-365-Sicherheitschecks prüfen wir Ihren Mandanten anhand von über 100 Prüfpunkten – von MFA und Administratorrechten über E-Mail-Sicherheit bis zu Datensicherung und Copilot-Readiness. Die Prüfung erfolgt ausschließlich lesend; es werden keine Einstellungen verändert und keine Daten an Dritte übertragen. Sie erhalten einen Prüfbericht mit Gesamtbewertung, priorisiertem Maßnahmenplan und Zuordnung zu ISO 27001 und NIS2.
