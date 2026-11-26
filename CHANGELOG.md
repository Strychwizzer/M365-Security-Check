# Änderungen

## 1.0.1 (2026-11-26)

- Neue Option „Anmeldung im selben Fenster statt Pop-up“: hilft, wenn das Anmeldefenster blockiert wird oder bei der MFA-Bestätigung hängen bleibt (z. B. in eingebetteten Browsern)
- Dokumentation: Hinweis, dass alle Graph-Berechtigungen als *delegiert* (nicht als Anwendungsberechtigung) eingetragen werden müssen

## 1.0.0 (2026-11-26)

Erste Version.

- Technische Prüfung über Microsoft Graph (nur lesend): 61 Prüfungen in den Bereichen Identität & Anmeldung, bedingter Zugriff, privilegierte Konten, Benutzer & Gäste, Anwendungen, SharePoint & OneDrive, Teams, Geräte & Intune, Defender, Datensicherung und Copilot
- Übernahme der Microsoft-Secure-Score-Kontrollen (Exchange Online, Defender for Office 365, Teams, Purview, Endpoint …) als zusätzliche Prüfpunkte
- Prüfung von SPF, DMARC, DKIM, MTA-STS und MX über DNS-over-HTTPS
- Fragebogen mit 22 Fragen zu Organisation, Prozessen, Notfall und KI
- Bewertung 0–100 (gesamt, technisch, organisatorisch, je Bereich), Quick Wins, Risikoakzeptanz, Kommentare
- Priorisierter Maßnahmenplan mit Aufwand und Lizenzhinweisen, CSV-Export
- Zuordnung zu ISO/IEC 27001:2022 Anhang A und NIS2 Art. 21
- Verlauf und Vergleich gespeicherter Prüfungen
- Prüfbericht als Word, PDF, HTML, Markdown, CSV und JSON mit Partner-Branding
- Demo-Modus mit Beispieldaten
