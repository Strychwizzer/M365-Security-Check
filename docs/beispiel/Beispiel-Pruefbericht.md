# Microsoft-365-Sicherheitsprüfung – Muster Maschinenbau GmbH

- Mandant: muster-maschinenbau.de · 7a3c1f20-0d5e-4b8a-9c11-3e2f4d5a6b7c
- Prüfdatum: 20.11.2026, 10:00
- Erstellt von: Max Mustermann
- Ansprechpartner: Max Mustermann · +49 89 1234567 · security@muster-it-partner.example
- Prüfpunkte: 110
- Gesamtbewertung: 45 / 100 – Erhöhtes Risiko
- Partner: Muster IT-Partner GmbH
- Erstellt mit M365 Security Check

> Beispieldaten (Demo-Modus)

## Management-Zusammenfassung

**Gesamtbewertung: 45 / 100 – Erhöhtes Risiko** (Technisch: 47 · Organisatorisch: 37 · Microsoft Secure Score: 50 %)

Im Rahmen der Sicherheitsprüfung wurde der Microsoft-365-Mandant von Muster Maschinenbau GmbH am 20.11.2026 anhand von 110 Prüfpunkten bewertet: 61 technische Prüfungen über Microsoft Graph und DNS, 27 Kontrollen aus dem Microsoft Secure Score sowie 22 Fragen zu Organisation und Prozessen. Die Prüfung erfolgte ausschließlich lesend.

Gesamtergebnis: 45 von 100 Punkten – „Erhöhtes Risiko“. 27 Prüfpunkte sind erfüllt, 36 teilweise und 38 nicht erfüllt. 1 Punkte waren mangels Lizenz oder Berechtigung nicht prüfbar. 3 Fragen sind noch offen.

#### Kritische Feststellungen

- **Privilegierte Konten:** Privilegierte Konten sind reine Cloud-Konten – 4 privilegierte Konten werden aus dem lokalen AD synchronisiert.
- **Privilegierte Konten:** Alle Administratoren haben MFA registriert – 1 von 6 Administratoren ohne MFA-Registrierung.
- **Anwendungen & Berechtigungen:** Benutzer können Apps nicht uneingeschränkt zustimmen – Benutzer dürfen allen Apps zustimmen (Standard „Legacy“).
- **E-Mail & Exchange Online:** DMARC ist mit Richtlinie „quarantine“ oder „reject“ aktiv – 0 von 2 Domänen in Ordnung.
- **E-Mail & Exchange Online:** Ensure Safe Links for Office applications is enabled – 0 von 8 Punkten – Not configured.
- **E-Mail & Exchange Online:** Turn on Safe Attachments in block mode – 0 von 8 Punkten – Not configured.
- **E-Mail & Exchange Online:** Enable impersonated user protection – 0 von 8 Punkten – Not configured.
- **E-Mail & Exchange Online:** Ensure all forms of mail forwarding are blocked and/or disabled – 0 von 8 Punkten – Automatic forwarding is allowed.
- **Organisation & Prozesse:** Gibt es einen dokumentierten Prozess für Sicherheitsvorfälle inklusive Meldewegen und Fristen? – Antwort: Nein
- **Datensicherung & Notfall:** Werden Exchange-Postfächer, OneDrive, SharePoint und Teams zusätzlich gesichert (Microsoft 365 Backup oder Drittanbieter)? – Antwort: Nein

#### Stärken und Schwerpunkte

- **Gut aufgestellt:** Identität & Anmeldung
- **Größter Handlungsbedarf:** Datensicherung & Notfall (0), Copilot & KI (13), Privilegierte Konten (27), Anwendungen & Berechtigungen (31), Microsoft Teams (33), Datenschutz & Purview (37), Defender & Überwachung (43), Benutzer & Gäste (45), Geräte & Intune (45), SharePoint & OneDrive (46), E-Mail & Exchange Online (49)

#### Quick Wins – schnell umsetzbar mit hoher Wirkung

- **Mittel:** Gerätecode-Fluss ist eingeschränkt
- **Hoch:** Zwei bis vier globale Administratoren
- **Hoch:** Keine Gastkonten mit Administratorrollen
- **Hoch:** Alle Administratoren haben MFA registriert
- **Mittel:** Keine inaktiven Administratorkonten
- **Mittel:** Gasteinladungen sind eingeschränkt
- **Mittel:** Benutzer dürfen keine Anwendungen registrieren
- **Mittel:** Benutzer dürfen keine neuen Mandanten erstellen

#### Lizenzhinweise

Für 2 empfohlene Maßnahmen ist eine im Mandanten nicht vorhandene Lizenz erforderlich:

- **Entra ID P2:** Entra ID P2 – z. B. in Microsoft 365 E5, E5 Security oder Entra Suite

#### Empfehlung

Wir empfehlen, die Maßnahmen der Priorität „Sofort“ innerhalb der nächsten vier Wochen umzusetzen und die Prüfung nach Abschluss zu wiederholen, um den Fortschritt zu belegen. Ihr Ansprechpartner: Max Mustermann · +49 89 1234567 · security@muster-it-partner.example.

## Bewertung nach Bereich

| Bereich | Bewertung | Erfüllt | Teilweise | Nicht erfüllt | Nicht prüfbar / offen |
| --- | --- | --- | --- | --- | --- |
| Identität & Anmeldung | 84 | 4 | 3 | 1 | 0 |
| Bedingter Zugriff | 56 | 3 | 2 | 3 | 0 |
| Privilegierte Konten | 27 | 0 | 4 | 3 | 0 |
| Benutzer & Gäste | 45 | 2 | 4 | 2 | 0 |
| Anwendungen & Berechtigungen | 31 | 0 | 5 | 1 | 0 |
| E-Mail & Exchange Online | 49 | 8 | 2 | 7 | 0 |
| SharePoint & OneDrive | 46 | 1 | 4 | 2 | 0 |
| Microsoft Teams | 33 | 1 | 0 | 2 | 0 |
| Geräte & Intune | 45 | 3 | 4 | 4 | 0 |
| Defender & Überwachung | 43 | 1 | 3 | 1 | 1 |
| Datenschutz & Purview | 37 | 1 | 0 | 4 | 1 |
| Datensicherung & Notfall | 0 | 0 | 0 | 3 | 1 |
| Copilot & KI | 13 | 0 | 1 | 2 | 0 |
| Organisation & Prozesse | 50 | 3 | 4 | 3 | 1 |

_Bewertung 0–100, gewichtet nach Schweregrad (hoch × 10, mittel × 5, niedrig × 2); „teilweise“ zählt zur Hälfte. Informationen, nicht prüfbare und offene Punkte fließen nicht ein._

## Priorisierter Maßnahmenplan

### Sofort (11)

| Nr. | Maßnahme | Bereich | Aufwand | Lizenz |
| --- | --- | --- | --- | --- |
| 1.1 | Benutzer können Apps nicht uneingeschränkt zustimmen<br>Entra › Unternehmensanwendungen › Zustimmung und Berechtigungen: Zustimmung nur für verifizierte Herausgeber mit geringen Berechtigungen oder gar nicht; Admin-Zustimmungsworkflow aktivieren. | Anwendungen & Berechtigungen | gering |  |
| 1.2 | Alle Administratoren haben MFA registriert<br>Betroffene Administratoren sofort MFA (am besten Passkey) registrieren lassen; bis dahin Rollen entziehen. | Privilegierte Konten | gering | Entra ID P1 |
| 1.3 | Ensure all forms of mail forwarding are blocked and/or disabled<br>Set automatic forwarding to Off in the outbound spam policy. | E-Mail & Exchange Online | gering |  |
| 1.4 | Turn on Safe Attachments in block mode<br>Create a Safe Attachments policy with action Block and apply it to all recipients. | E-Mail & Exchange Online | gering |  |
| 1.5 | Ensure Safe Links for Office applications is enabled<br>Turn on Safe Links for Office applications in the Safe Links policy. | E-Mail & Exchange Online | gering |  |
| 1.6 | DMARC ist mit Richtlinie „quarantine“ oder „reject“ aktiv<br>TXT-Eintrag _dmarc.<domäne>: Start mit „v=DMARC1; p=none; rua=mailto:…“, Berichte auswerten, dann auf „p=quarantine“ und „p=reject“ erhöhen. | E-Mail & Exchange Online | mittel |  |
| 1.7 | Privilegierte Konten sind reine Cloud-Konten<br>Für Administratoren eigene, nicht synchronisierte Konten (…@firma.onmicrosoft.com oder eigene Admin-Domäne) anlegen und die Rollen umziehen. | Privilegierte Konten | mittel |  |
| 1.8 | Gibt es einen dokumentierten Prozess für Sicherheitsvorfälle inklusive Meldewegen und Fristen?<br>Incident-Response-Plan mit Rollen, Kontaktdaten (auch Dienstleister, BSI), Erstmaßnahmen bei Kontoübernahme und Meldefristen erstellen. | Organisation & Prozesse | mittel |  |
| 1.9 | Werden Exchange-Postfächer, OneDrive, SharePoint und Teams zusätzlich gesichert (Microsoft 365 Backup oder Drittanbieter)?<br>Microsoft 365 Backup oder eine Drittanbieterlösung einführen; Aufbewahrungszeiten festlegen. | Datensicherung & Notfall | mittel |  |
| 1.10 | Wurden vor bzw. beim Einsatz von Copilot Berechtigungen und Freigaben in SharePoint und OneDrive auf Übersharing geprüft?<br>Freigaben auswerten (z. B. SharePoint Advanced Management, Data Access Governance), „Jeder“-Links und organisationsweite Freigaben bereinigen. | Copilot & KI | mittel |  |
| 1.11 | Enable impersonated user protection<br>Add executives and finance staff as protected users. | E-Mail & Exchange Online | mittel |  |

### Kurzfristig (29)

| Nr. | Maßnahme | Bereich | Aufwand | Lizenz |
| --- | --- | --- | --- | --- |
| 2.1 | Zwei bis vier globale Administratoren<br>Überzählige globale Administratoren auf passende, weniger privilegierte Rollen umstellen (z. B. Benutzer-, Exchange- oder Intune-Administrator). | Privilegierte Konten | gering |  |
| 2.2 | Keine Gastkonten mit Administratorrollen<br>Rollen von Gastkonten entfernen; Dienstleister besser über GDAP anbinden. | Privilegierte Konten | gering |  |
| 2.3 | Set the phishing email level threshold at 2 or higher<br>Raise the phishing threshold in the anti-phishing policy. | E-Mail & Exchange Online | gering |  |
| 2.4 | Werden administrative Berechtigungen nach einem festen Verfahren vergeben und mindestens jährlich überprüft?<br>Berechtigungskonzept für Admin-Rollen erstellen, Rezertifizierung (z. B. mit Entra Access Reviews) mindestens jährlich durchführen. | Organisation & Prozesse | mittel |  |
| 2.5 | Sind Notfallzugriffskonten (Break-Glass) dokumentiert, sicher verwahrt und wird ihre Funktion regelmäßig getestet?<br>Zwei Cloud-only-Notfallkonten mit FIDO2-Schlüsseln anlegen, von CA-Richtlinien ausnehmen, Anmeldungen überwachen und halbjährlich testen. | Organisation & Prozesse | mittel |  |
| 2.6 | Werden alle Mitarbeitenden regelmäßig zu Phishing und Informationssicherheit geschult?<br>Jährliche Schulung und regelmäßige Phishing-Simulationen (z. B. Angriffssimulationstraining in Defender for Office 365 Plan 2) einführen. | Organisation & Prozesse | mittel |  |
| 2.7 | Gerätecode-Fluss ist eingeschränkt<br>Richtlinie für bedingten Zugriff: Alle Benutzer, Bedingung „Authentifizierungsflüsse › Gerätecodefluss“ › Zugriff blockieren (Ausnahmen z. B. für Teams-Raumsysteme). | Bedingter Zugriff | gering | Entra ID P1 |
| 2.8 | Geräte ohne Konformitätsrichtlinie gelten als nicht konform<br>Intune › Gerätekonformität › Einstellungen für Konformitätsrichtlinien › „Geräte ohne zugewiesene Konformitätsrichtlinie markieren als“: Nicht konform. | Geräte & Intune | gering | Intune |
| 2.9 | Benutzer dürfen keine Anwendungen registrieren<br>Entra › Benutzer › Benutzereinstellungen › „Benutzer können Anwendungen registrieren“ auf Nein; bei Bedarf die Rolle „Anwendungsentwickler“ vergeben. | Benutzer & Gäste | gering |  |
| 2.10 | Benutzer dürfen keine neuen Mandanten erstellen<br>Entra › Benutzer › Benutzereinstellungen › „Erstellung von Mandanten durch Nicht-Administratoren einschränken“ auf Ja. | Benutzer & Gäste | gering |  |
| 2.11 | SPF-Eintrag ist vorhanden und korrekt<br>Je Maildomäne genau einen TXT-Eintrag, z. B. „v=spf1 include:spf.protection.outlook.com -all“; ungenutzte Domänen: „v=spf1 -all“. | E-Mail & Exchange Online | gering |  |
| 2.12 | Only invited users should be automatically admitted to Teams meetings<br>Set Who can bypass the lobby to People in my org. | Microsoft Teams | gering |  |
| 2.13 | Ensure idle session timeout is set<br>Configure idle session sign-out. | SharePoint & OneDrive | gering |  |
| 2.14 | Microsoft-365-Daten werden gesichert<br>Microsoft 365 Backup (Microsoft 365 Admin Center › Einstellungen › Microsoft 365 Backup) oder eine Drittanbieter-Sicherung einrichten. | Datensicherung & Notfall | mittel |  |
| 2.15 | Phishing-resistente MFA für Administratoren<br>Richtlinie für bedingten Zugriff auf Administratorrollen mit Authentifizierungsstärke „Phishing-resistente MFA“; Admins vorher mit Passkeys ausstatten. | Bedingter Zugriff | mittel | Entra ID P1 |
| 2.16 | Copilot-Readiness: technische Freigabe-Grundlagen<br>Die verknüpften Befunde SP-01, GU-02 und AP-01 beheben; zusätzlich Restricted Content Discovery bzw. SharePoint Advanced Management für sensible Sites prüfen. | Copilot & KI | mittel |  |
| 2.17 | Windows- und macOS-Geräte sind verschlüsselt<br>BitLocker bzw. FileVault per Endpoint-Security-Richtlinie aktivieren und Wiederherstellungsschlüssel in Entra/Intune sichern. | Geräte & Intune | mittel | Intune |
| 2.18 | Risikobasierter bedingter Zugriff (Anmelde- und Benutzerrisiko)<br>Zwei Richtlinien für bedingten Zugriff: Anmelderisiko „mittel/hoch“ › MFA verlangen; Benutzerrisiko „hoch“ › sichere Kennwortänderung verlangen. | Bedingter Zugriff | mittel | Entra ID P2 (fehlt) |
| 2.19 | Privileged Identity Management (Just-in-Time-Adminrechte)<br>Entra ID P2 bereitstellen, Admin-Rollen in PIM als „berechtigt“ statt „aktiv“ zuweisen; nur Notfallkonten bleiben dauerhaft aktiv. | Privilegierte Konten | mittel | Entra ID P2 (fehlt) |
| 2.20 | Wurde für die Microsoft-365-Umgebung eine Risikoanalyse durchgeführt und dokumentiert?<br>Risiken (z. B. Kontoübernahme, Datenabfluss, Ausfall) bewerten und einen Behandlungsplan ableiten. | Organisation & Prozesse | mittel |  |
| 2.21 | Werden Gastkonten und externe Freigaben regelmäßig überprüft und nicht mehr benötigte entfernt?<br>Regelmäßige Überprüfung (z. B. Entra Access Reviews für Gäste, Ablauf von Gastzugriffen in SharePoint) einrichten. | Organisation & Prozesse | mittel |  |
| 2.22 | Werden Anmelde- und Überwachungsprotokolle regelmäßig ausgewertet oder an ein SIEM übertragen?<br>Protokolle an Microsoft Sentinel oder ein anderes SIEM übertragen bzw. mindestens wöchentlich auswerten; Aufbewahrung festlegen. | Defender & Überwachung | mittel |  |
| 2.23 | Gibt es verbindliche Regeln für private Geräte (BYOD), und werden sie technisch durchgesetzt?<br>BYOD-Richtlinie festlegen und mit App-Schutzrichtlinien bzw. bedingtem Zugriff (nur verwaltete Geräte/Apps) durchsetzen. | Geräte & Intune | mittel |  |
| 2.24 | Wurde in den letzten 12 Monaten eine Wiederherstellung aus der Sicherung erfolgreich getestet?<br>Halbjährlichen Wiederherstellungstest (Postfach, Site, OneDrive) durchführen und dokumentieren. | Datensicherung & Notfall | mittel |  |
| 2.25 | Gibt es ein Klassifizierungsschema für Informationen (z. B. öffentlich, intern, vertraulich), das genutzt wird?<br>Schema festlegen und mit Purview-Vertraulichkeitsbezeichnungen technisch umsetzen. | Datenschutz & Purview | mittel |  |
| 2.26 | Create a DLP policy<br>Create DLP policies for sensitive information types. | Datenschutz & Purview | mittel |  |
| 2.27 | Publish M365 sensitivity label data classification policies<br>Create and publish sensitivity labels. | Datenschutz & Purview | mittel |  |
| 2.28 | Block Office applications from creating child processes<br>Enable ASR rule in block mode. | Geräte & Intune | mittel |  |
| 2.29 | Ensure external domains are restricted in Teams admin center<br>Allow only specific external domains. | Microsoft Teams | mittel |  |

### Mittelfristig (34)

| Nr. | Maßnahme | Bereich | Aufwand | Lizenz |
| --- | --- | --- | --- | --- |
| 3.1 | Gasteinladungen sind eingeschränkt<br>Entra › Externe Identitäten › Einstellungen für externe Zusammenarbeit: Einladungen nur durch Administratoren und Benutzer mit der Rolle „Gasteinladender“. | Benutzer & Gäste | gering |  |
| 3.2 | Keine inaktiven Administratorkonten<br>Admin-Rollen von Konten ohne Anmeldung in den letzten 90 Tagen entfernen (Notfallkonten ausgenommen, diese aber regelmäßig testen). | Privilegierte Konten | gering | Entra ID P1 |
| 3.3 | Keine anonymen „Jeder“-Freigabelinks<br>SharePoint Admin Center › Richtlinien › Freigabe: höchstens „Neue und vorhandene Gäste“. | SharePoint & OneDrive | gering |  |
| 3.4 | Turn on Microsoft Defender Antivirus PUA protection in block mode<br>Configure PUA protection. | Geräte & Intune | gering |  |
| 3.5 | Anwendungen mit weitreichenden Anwendungsberechtigungen<br>Jede gelistete App mit dem Fachbereich bewerten; nicht benötigte Rechte entziehen, Exchange-Zugriffe per RBAC for Applications auf einzelne Postfächer begrenzen. | Anwendungen & Berechtigungen | mittel |  |
| 3.6 | Mandantenweite Zustimmungen für Drittanbieter-Apps<br>Zustimmungen prüfen (Entra › Unternehmensanwendungen › Berechtigungen) und nicht mehr benötigte Apps bzw. Rechte entfernen. | Anwendungen & Berechtigungen | mittel |  |
| 3.7 | Microsoft Secure Score<br>Empfehlungen im Defender-Portal › Secure Score nach Wirkung abarbeiten; Score monatlich berichten. | Defender & Überwachung | mittel |  |
| 3.8 | Keine offenen Sicherheitswarnungen mit hohem Schweregrad<br>Warnungen im Defender-Portal › Vorfälle und Warnungen bearbeiten; Verantwortlichkeit und Reaktionszeiten festlegen. | Defender & Überwachung | mittel |  |
| 3.9 | Konformitätsrichtlinien sind vorhanden und zugewiesen<br>Je Plattform eine Konformitätsrichtlinie anlegen (Verschlüsselung, Mindest-OS-Version, Defender, Kennwort) und allen Benutzern bzw. Geräten zuweisen. | Geräte & Intune | mittel | Intune |
| 3.10 | Mindestens 95 % der Benutzer haben MFA registriert<br>Registrierungskampagne für Microsoft Authenticator aktivieren (Entra › Authentifizierungsmethoden › Registrierungskampagne) und Registrierung per bedingtem Zugriff nur aus vertrauenswürdigen Umgebungen zulassen. | Identität & Anmeldung | mittel | Entra ID P1 |
| 3.11 | SMS und Sprachanruf sind als Anmeldemethode deaktiviert<br>Benutzer auf Microsoft Authenticator oder Passkeys umstellen, danach SMS und Sprachanruf unter Entra › Authentifizierungsmethoden › Richtlinien deaktivieren. | Identität & Anmeldung | mittel |  |
| 3.12 | Keine Anwendungen mit privilegierten Verzeichnisrollen<br>Rollen prüfen und durch eng begrenzte Graph-Anwendungsberechtigungen ersetzen; Geheimnisse durch Zertifikate oder verwaltete Identitäten ablösen. | Privilegierte Konten | mittel |  |
| 3.13 | Gibt es eine dokumentierte und freigegebene Informationssicherheitsrichtlinie?<br>Informationssicherheitsleitlinie erstellen, von der Geschäftsleitung freigeben lassen und jährlich überprüfen. | Organisation & Prozesse | mittel |  |
| 3.14 | Ist festgelegt, wer auf Warnungen aus Microsoft Defender reagiert – auch außerhalb der Geschäftszeiten?<br>Empfänger für Defender-Benachrichtigungen festlegen, Reaktionszeiten definieren, ggf. Managed Detection & Response (MDR) beauftragen. | Defender & Überwachung | mittel |  |
| 3.15 | Gibt es eine Richtlinie zur Nutzung von KI-Diensten (erlaubte Tools, Umgang mit vertraulichen Daten)?<br>KI-Nutzungsrichtlinie erstellen, freigegebene Dienste benennen, Mitarbeitende schulen; Nutzung nicht freigegebener Dienste technisch begrenzen. | Copilot & KI | mittel |  |
| 3.16 | Zugriff nur von konformen bzw. verwalteten Geräten<br>Geräte in Intune registrieren und Konformitätsrichtlinien zuweisen; dann Richtlinie für bedingten Zugriff „Konformes Gerät erforderlich“ (für mobile Geräte alternativ „App-Schutzrichtlinie erforderlich“). | Bedingter Zugriff | hoch | Intune |
| 3.17 | Workflow für Administratorzustimmung ist aktiv<br>Entra › Unternehmensanwendungen › Einstellungen für die Administratoreinwilligung › Workflow aktivieren und Prüfer festlegen. | Anwendungen & Berechtigungen | gering |  |
| 3.18 | App-Geheimnisse und -Zertifikate sind gültig und gepflegt<br>Ablaufende Geheimnisse rechtzeitig erneuern (Überwachung einrichten), abgelaufene entfernen. | Anwendungen & Berechtigungen | gering |  |
| 3.19 | Keine Client-Geheimnisse mit über zwei Jahren Laufzeit<br>Geheimnisse mit max. 12 Monaten Laufzeit ausstellen oder auf Zertifikate bzw. Workload Identity Federation umstellen; per App-Verwaltungsrichtlinie erzwingen. | Anwendungen & Berechtigungen | gering |  |
| 3.20 | Keine Richtlinien dauerhaft im Berichtsmodus<br>Auswertung im Bereich „Erkenntnisse und Berichterstellung“ prüfen und die Richtlinien einschalten oder löschen. | Bedingter Zugriff | gering |  |
| 3.21 | Geräte melden sich regelmäßig<br>Bereinigungsregel in Intune einrichten (Geräte › Bereinigungsregeln, z. B. 90 Tage) und Geräte prüfen. | Geräte & Intune | gering | Intune |
| 3.22 | Benutzer dürfen keine Sicherheitsgruppen erstellen<br>Entra › Gruppen › Allgemein › „Benutzer können Sicherheitsgruppen erstellen“ auf Nein. | Benutzer & Gäste | gering |  |
| 3.23 | Keine inaktiven Gastkonten<br>Gäste ohne Anmeldung seit 90 Tagen entfernen; dauerhaft mit Access Reviews für Gäste (Entra ID P2 / ID Governance) automatisieren. | Benutzer & Gäste | gering | Entra ID P1 |
| 3.24 | Keine inaktiven aktivierten Mitgliedskonten<br>Konten ohne Anmeldung seit 90 Tagen prüfen, deaktivieren und Lizenzen freigeben; Offboarding-Prozess schärfen. | Benutzer & Gäste | gering | Entra ID P1 |
| 3.25 | Passkeys (FIDO2) sind als Methode verfügbar<br>Entra › Authentifizierungsmethoden › Richtlinien › Passkey (FIDO2) aktivieren, zunächst für Administratoren. | Identität & Anmeldung | gering |  |
| 3.26 | Kennwörter laufen nicht regelmäßig ab<br>Microsoft 365 Admin Center › Einstellungen › Organisationseinstellungen › Sicherheit & Datenschutz › Kennwortablaufrichtlinie: „Kennwörter laufen nie ab“. | Identität & Anmeldung | gering |  |
| 3.27 | Gäste dürfen Inhalte nicht weiterfreigeben<br>SharePoint Admin Center › Richtlinien › Freigabe › Weitere Einstellungen › „Gäste dürfen Elemente, die sie nicht besitzen, freigeben“ deaktivieren. | SharePoint & OneDrive | gering |  |
| 3.28 | Automatische Abmeldung bei Inaktivität<br>SharePoint Admin Center › Richtlinien › Zugriffssteuerung › Abmeldung bei Leerlauf aktivieren (z. B. nach 1 Stunde). | SharePoint & OneDrive | gering |  |
| 3.29 | Ensure additional storage providers are restricted in Outlook on the web<br>Set-OwaMailboxPolicy -AdditionalStorageProvidersAvailable $false | E-Mail & Exchange Online | gering |  |
| 3.30 | Anteil nicht konformer Geräte<br>Gründe in Intune › Geräte › Konformität auswerten, Geräte nachziehen oder Richtlinien anpassen. | Geräte & Intune | mittel | Intune |
| 3.31 | MTA-STS erzwingt verschlüsselten Mailempfang<br>TXT-Eintrag _mta-sts.<domäne> und Richtliniendatei unter https://mta-sts.<domäne>/.well-known/mta-sts.txt veröffentlichen (Exchange Online unterstützt MTA-STS für eingehende Mails). | E-Mail & Exchange Online | mittel |  |
| 3.32 | Externe Freigabe ist auf Domänen begrenzt<br>SharePoint Admin Center › Richtlinien › Freigabe › „Externe Freigabe nach Domäne einschränken“ – z. B. Partnerdomänen zulassen. | SharePoint & OneDrive | mittel |  |
| 3.33 | OneDrive-Synchronisierung nur auf Firmengeräten<br>SharePoint Admin Center › Einstellungen › OneDrive-Synchronisierung › „Synchronisierung nur auf Computern in bestimmten Domänen zulassen“ oder Gerätezugriff per bedingtem Zugriff steuern. | SharePoint & OneDrive | mittel |  |
| 3.34 | Extend M365 sensitivity labeling to assets in Microsoft Purview data map<br>Configure auto-labeling. | Datenschutz & Purview | hoch |  |

## Feststellungen im Detail

### Identität & Anmeldung

#### ID-06 Passkeys (FIDO2) sind als Methode verfügbar

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Passkeys (FIDO2) sind nicht aktiviert. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Passkeys sind phishing-resistent und die Grundlage für passwortlose Anmeldung – besonders für Administratoren. |
| Empfehlung | Entra › Authentifizierungsmethoden › Richtlinien › Passkey (FIDO2) aktivieren, zunächst für Administratoren. |
| Normbezug | ISO A.8.5, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

#### ID-04 Mindestens 95 % der Benutzer haben MFA registriert

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 88 % der aktiven Mitglieder haben MFA registriert (125 von 142). |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Benutzer ohne registrierte MFA-Methode können bei einer Kontoübernahme vom Angreifer „registriert“ werden. |
| Empfehlung | Registrierungskampagne für Microsoft Authenticator aktivieren (Entra › Authentifizierungsmethoden › Registrierungskampagne) und Registrierung per bedingtem Zugriff nur aus vertrauenswürdigen Umgebungen zulassen. |
| Normbezug | ISO A.8.5, ISO A.5.17, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

| Benutzer ohne MFA-Registrierung | Admin |
| --- | --- |
| Martin Altadmin (martin.altadmin@muster-maschinenbau.de) | Ja |
| Anna Becker (anna.becker@muster-maschinenbau.de) |  |
| Lukas Hartmann (lukas.hartmann@muster-maschinenbau.de) |  |
| Yasemin Zimmermann (yasemin.zimmermann@muster-maschinenbau.de) |  |
| Jonas Wolf (jonas.wolf33@muster-maschinenbau.de) |  |
| Vera Koch (vera.koch44@muster-maschinenbau.de) |  |
| Hannes Schulz (hannes.schulz55@muster-maschinenbau.de) |  |
| Tina Lange (tina.lange66@muster-maschinenbau.de) |  |
| Felix Braun (felix.braun77@muster-maschinenbau.de) |  |
| Rita Neumann (rita.neumann88@muster-maschinenbau.de) |  |
| David Richter (david.richter99@muster-maschinenbau.de) |  |
| Olga Wagner (olga.wagner110@muster-maschinenbau.de) |  |
| Ben Werner (ben.werner121@muster-maschinenbau.de) |  |
| Empfang (empfang@muster-maschinenbau.de) |  |
| Besprechung EG (raum-eg@muster-maschinenbau.de) |  |
| Besprechung OG (raum-og@muster-maschinenbau.de) |  |
| Buchhaltung Postfach (buchhaltung@muster-maschinenbau.de) |  |

#### ID-05 SMS und Sprachanruf sind als Anmeldemethode deaktiviert

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Aktiviert: SMS. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | SMS und Anrufe lassen sich durch SIM-Swapping und Phishing-Proxys abfangen. Microsoft Authenticator mit Nummernabgleich oder Passkeys sind deutlich sicherer. |
| Empfehlung | Benutzer auf Microsoft Authenticator oder Passkeys umstellen, danach SMS und Sprachanruf unter Entra › Authentifizierungsmethoden › Richtlinien deaktivieren. |
| Normbezug | ISO A.8.5, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

#### ID-08 Kennwörter laufen nicht regelmäßig ab

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 Domäne erzwingt einen Kennwortablauf. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Erzwungene Kennwortwechsel führen zu schwächeren, vorhersehbaren Kennwörtern. Microsoft und BSI empfehlen bei MFA keinen periodischen Wechsel. |
| Empfehlung | Microsoft 365 Admin Center › Einstellungen › Organisationseinstellungen › Sicherheit & Datenschutz › Kennwortablaufrichtlinie: „Kennwörter laufen nie ab“. |
| Normbezug | ISO A.5.17, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

| Domäne | Ablauf nach |
| --- | --- |
| muster-maschinenbau.de | 90 Tagen |

### Bedingter Zugriff

#### ID-09 Risikobasierter bedingter Zugriff (Anmelde- und Benutzerrisiko)

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Keine risikobasierten Richtlinien. Entra ID P2 ist im Mandanten nicht lizenziert. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Lizenz | Entra ID P2 – z. B. in Microsoft 365 E5, E5 Security oder Entra Suite (nicht vorhanden) |
| Risiko | Identity Protection erkennt z. B. Anmeldungen aus dem Darknet bekannter Kennwörter, unmögliche Reisen oder Token-Diebstahl und kann automatisch MFA oder einen Kennwortwechsel verlangen. |
| Empfehlung | Zwei Richtlinien für bedingten Zugriff: Anmelderisiko „mittel/hoch“ › MFA verlangen; Benutzerrisiko „hoch“ › sichere Kennwortänderung verlangen. |
| Normbezug | ISO A.8.5, ISO A.8.16, NIS2 Art. 21 (2) j, NIS2 Art. 21 (2) b |
| Quelle | Microsoft Graph |

#### CA-02 Phishing-resistente MFA für Administratoren

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Keine Richtlinie verlangt phishing-resistente MFA für Administratoren. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Phishing-Proxys (Adversary-in-the-Middle) umgehen klassische MFA. Passkeys, Windows Hello for Business oder Zertifikate sind dagegen immun. |
| Empfehlung | Richtlinie für bedingten Zugriff auf Administratorrollen mit Authentifizierungsstärke „Phishing-resistente MFA“; Admins vorher mit Passkeys ausstatten. |
| Normbezug | ISO A.8.2, ISO A.8.5, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

#### CA-05 Gerätecode-Fluss ist eingeschränkt

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Gerätecode-Fluss ist nicht eingeschränkt. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Device-Code-Phishing ist eine aktuell stark genutzte Angriffstechnik, mit der Angreifer gültige Token erbeuten – trotz MFA. |
| Empfehlung | Richtlinie für bedingten Zugriff: Alle Benutzer, Bedingung „Authentifizierungsflüsse › Gerätecodefluss“ › Zugriff blockieren (Ausnahmen z. B. für Teams-Raumsysteme). |
| Normbezug | ISO A.8.5, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

#### CA-03 Zugriff nur von konformen bzw. verwalteten Geräten

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Gerätebedingung nur für Teilbereiche (Gruppen oder einzelne Apps). |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | hoch |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Ohne Geräteanforderung reicht ein gestohlenes Kennwort samt MFA-Token, um von jedem beliebigen Gerät auf Firmendaten zuzugreifen. |
| Empfehlung | Geräte in Intune registrieren und Konformitätsrichtlinien zuweisen; dann Richtlinie für bedingten Zugriff „Konformes Gerät erforderlich“ (für mobile Geräte alternativ „App-Schutzrichtlinie erforderlich“). |
| Normbezug | ISO A.8.1, ISO A.5.15, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Richtlinie | Status | Ausnahmen |
| --- | --- | --- |
| CA03 – Konforme Geräte (Pilot Vertrieb) | Aktiv | 1 Ausnahme |

#### CA-07 Keine Richtlinien dauerhaft im Berichtsmodus

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 5 Richtlinien: 3 aktiv, 1 im Berichtsmodus, 1 deaktiviert. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Richtlinien im Berichtsmodus schützen nicht. Sie sind für einen kurzen Testzeitraum gedacht. |
| Empfehlung | Auswertung im Bereich „Erkenntnisse und Berichterstellung“ prüfen und die Richtlinien einschalten oder löschen. |
| Normbezug | ISO A.8.9, NIS2 Art. 21 (2) f |
| Quelle | Microsoft Graph |

| Richtlinie | Status | Ausnahmen |
| --- | --- | --- |
| CA01 – MFA für alle Benutzer | Aktiv | 1 Ausnahme |
| CA02 – Legacy-Authentifizierung blockieren | Aktiv | 1 Ausnahme |
| CA03 – Konforme Geräte (Pilot Vertrieb) | Aktiv | 1 Ausnahme |
| CA04 – Gerätecodefluss blockieren | Nur Bericht | — |
| Alt – MFA außerhalb Firmennetz | Aus | — |

### Privilegierte Konten

#### PA-02 Privilegierte Konten sind reine Cloud-Konten

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 4 privilegierte Konten werden aus dem lokalen AD synchronisiert. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | mittel |
| Risiko | Wird ein aus dem lokalen Active Directory synchronisiertes Konto dort kompromittiert, übernimmt der Angreifer auch die Cloud-Adminrechte. |
| Empfehlung | Für Administratoren eigene, nicht synchronisierte Konten (…@firma.onmicrosoft.com oder eigene Admin-Domäne) anlegen und die Rollen umziehen. |
| Normbezug | ISO A.8.2, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Konto | Rolle |
| --- | --- |
| Thomas Admin (thomas.admin@muster-maschinenbau.de) | Global Administrator |
| Sabine Krause (sabine.krause@muster-maschinenbau.de) | Global Administrator |
| Martin Altadmin (martin.altadmin@muster-maschinenbau.de) | Global Administrator |
| Petra Exchange (petra.vogel@muster-maschinenbau.de) | Exchange Administrator |
| Sabine Krause (sabine.krause@muster-maschinenbau.de) | User Administrator |

#### PA-04 Alle Administratoren haben MFA registriert

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 1 von 6 Administratoren ohne MFA-Registrierung. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | gering |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Ein Adminkonto ohne MFA ist mit einem einzigen Kennwort übernehmbar. |
| Empfehlung | Betroffene Administratoren sofort MFA (am besten Passkey) registrieren lassen; bis dahin Rollen entziehen. |
| Normbezug | ISO A.8.2, ISO A.8.5, NIS2 Art. 21 (2) j |
| Quelle | Microsoft Graph |

| Administrator |
| --- |
| Martin Altadmin (martin.altadmin@muster-maschinenbau.de) |

#### PA-05 Privileged Identity Management (Just-in-Time-Adminrechte)

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – PIM wird nicht genutzt – Entra ID P2 ist nicht lizenziert. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Lizenz | Entra ID P2 – z. B. in Microsoft 365 E5, E5 Security oder Entra Suite (nicht vorhanden) |
| Risiko | Mit PIM sind Adminrechte nur bei Bedarf und zeitlich begrenzt aktiv – mit Begründung, MFA und optionaler Genehmigung. Dauerhafte Rechte vergrößern das Risiko. |
| Empfehlung | Entra ID P2 bereitstellen, Admin-Rollen in PIM als „berechtigt“ statt „aktiv“ zuweisen; nur Notfallkonten bleiben dauerhaft aktiv. |
| Normbezug | ISO A.8.2, ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### PA-01 Zwei bis vier globale Administratoren

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 5 globale Administratoren – mehr als empfohlen. |
| Schweregrad | Hoch |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Mindestens zwei sorgen für Redundanz, mehr als vier vergrößern die Angriffsfläche unnötig. Für die tägliche Arbeit reichen meist spezifische Rollen. |
| Empfehlung | Überzählige globale Administratoren auf passende, weniger privilegierte Rollen umstellen (z. B. Benutzer-, Exchange- oder Intune-Administrator). |
| Normbezug | ISO A.8.2, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |
| Kommentar | Martin Altadmin ist seit Mai im Ruhestand – Konto wird entfernt (Ticket #4711). |

| Name | UPN | Art | Zuweisung |
| --- | --- | --- | --- |
| Thomas Admin | thomas.admin@muster-maschinenbau.de | Benutzer | aktiv |
| Sabine Krause | sabine.krause@muster-maschinenbau.de | Benutzer | aktiv |
| IT-Dienstleister Admin | admin@musterbau.onmicrosoft.com | Benutzer | aktiv |
| Notfallkonto 1 | bg-01@musterbau.onmicrosoft.com | Benutzer | aktiv |
| Martin Altadmin | martin.altadmin@muster-maschinenbau.de | Benutzer | aktiv |

#### PA-03 Keine Gastkonten mit Administratorrollen

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 Rollenzuweisung an Gastkonten. |
| Schweregrad | Hoch |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Gastkonten werden in einem fremden Mandanten verwaltet – deren Sicherheit liegt außerhalb Ihrer Kontrolle. |
| Empfehlung | Rollen von Gastkonten entfernen; Dienstleister besser über GDAP anbinden. |
| Normbezug | ISO A.8.2, ISO A.5.19, NIS2 Art. 21 (2) i, NIS2 Art. 21 (2) d |
| Quelle | Microsoft Graph |

| Gastkonto | Rolle |
| --- | --- |
| Gast 3 (steuerberatung-x.de) (gast3_steuerberatung-x-de#EXT#@musterbau.onmicrosoft.com) | Global Reader |

#### PA-06 Keine inaktiven Administratorkonten

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 2 Administratoren ohne Anmeldung seit über 90 Tagen. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Ungenutzte Adminkonten fallen bei einer Übernahme nicht auf und haben oft veraltete Schutzmaßnahmen. |
| Empfehlung | Admin-Rollen von Konten ohne Anmeldung in den letzten 90 Tagen entfernen (Notfallkonten ausgenommen, diese aber regelmäßig testen). |
| Normbezug | ISO A.8.2, ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Konto | Letzte Anmeldung | Konto |
| --- | --- | --- |
| Notfallkonto 1 (bg-01@musterbau.onmicrosoft.com) | 23.07.2026 | aktiv |
| Martin Altadmin (martin.altadmin@muster-maschinenbau.de) | 24.04.2026 | aktiv |

#### PA-07 Keine Anwendungen mit privilegierten Verzeichnisrollen

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 privilegierte Rollenzuweisung an Anwendungen. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Dienstprinzipale mit Admin-Rollen unterliegen keiner MFA. Ein geleaktes App-Geheimnis genügt für die Übernahme. |
| Empfehlung | Rollen prüfen und durch eng begrenzte Graph-Anwendungsberechtigungen ersetzen; Geheimnisse durch Zertifikate oder verwaltete Identitäten ablösen. |
| Normbezug | ISO A.8.2, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Anwendung | Rolle |
| --- | --- |
| Backup-Connector (Drittanbieter) | Exchange Administrator |

#### PA-08 Übersicht privilegierter Rollenzuweisungen

|  |  |
| --- | --- |
| Ergebnis | Information – 8 privilegierte Zuweisungen an 7 Identitäten. |
| Schweregrad | Info |
| Aufwand | gering |
| Risiko | Grundlage für die regelmäßige Rezertifizierung der Adminrechte. |
| Empfehlung | Liste mit den Verantwortlichen abgleichen und überzählige Zuweisungen entfernen. |
| Normbezug | ISO A.8.2, ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Rolle | Identität | Art | Zuweisung |
| --- | --- | --- | --- |
| Exchange Administrator | Petra Exchange (petra.vogel@muster-maschinenbau.de) | Benutzer | aktiv |
| Exchange Administrator | Backup-Connector (Drittanbieter) | Anwendung | aktiv |
| Global Administrator | Thomas Admin (thomas.admin@muster-maschinenbau.de) | Benutzer | aktiv |
| Global Administrator | Sabine Krause (sabine.krause@muster-maschinenbau.de) | Benutzer | aktiv |
| Global Administrator | IT-Dienstleister Admin (admin@musterbau.onmicrosoft.com) | Benutzer | aktiv |
| Global Administrator | Notfallkonto 1 (bg-01@musterbau.onmicrosoft.com) | Benutzer | aktiv |
| Global Administrator | Martin Altadmin (martin.altadmin@muster-maschinenbau.de) | Benutzer | aktiv |
| User Administrator | Sabine Krause (sabine.krause@muster-maschinenbau.de) | Benutzer | aktiv |

### Benutzer & Gäste

#### GU-03 Benutzer dürfen keine Anwendungen registrieren

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Alle Benutzer dürfen Anwendungen registrieren. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Selbst registrierte Apps sind ein beliebter Weg für dauerhafte Hintertüren (Illicit Consent, Persistenz). |
| Empfehlung | Entra › Benutzer › Benutzereinstellungen › „Benutzer können Anwendungen registrieren“ auf Nein; bei Bedarf die Rolle „Anwendungsentwickler“ vergeben. |
| Normbezug | ISO A.5.15, ISO A.8.9, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### GU-04 Benutzer dürfen keine neuen Mandanten erstellen

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Alle Benutzer dürfen neue Mandanten erstellen. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Von Mitarbeitenden angelegte Mandanten entziehen sich der Kontrolle der IT (Schatten-IT, Datenabfluss). |
| Empfehlung | Entra › Benutzer › Benutzereinstellungen › „Erstellung von Mandanten durch Nicht-Administratoren einschränken“ auf Ja. |
| Normbezug | ISO A.5.15, ISO A.5.23, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### GU-01 Gasteinladungen sind eingeschränkt

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Alle Mitglieder dürfen Gäste einladen. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Dürfen alle Benutzer (oder sogar Gäste) Externe einladen, entstehen unkontrolliert Zugänge zu Teams, Gruppen und Dateien. |
| Empfehlung | Entra › Externe Identitäten › Einstellungen für externe Zusammenarbeit: Einladungen nur durch Administratoren und Benutzer mit der Rolle „Gasteinladender“. |
| Normbezug | ISO A.5.15, ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### GU-05 Benutzer dürfen keine Sicherheitsgruppen erstellen

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Alle Benutzer dürfen Sicherheitsgruppen erstellen. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Selbst erstellte Sicherheitsgruppen erschweren die Rechteverwaltung und können Zuweisungen unterlaufen. |
| Empfehlung | Entra › Gruppen › Allgemein › „Benutzer können Sicherheitsgruppen erstellen“ auf Nein. |
| Normbezug | ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### GU-07 Keine inaktiven Gastkonten

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 13 von 26 Gastkonten seit über 90 Tagen ohne Anmeldung. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Vergessene Gastkonten behalten Zugriff auf Teams, Dateien und Gruppen. |
| Empfehlung | Gäste ohne Anmeldung seit 90 Tagen entfernen; dauerhaft mit Access Reviews für Gäste (Entra ID P2 / ID Governance) automatisieren. |
| Normbezug | ISO A.5.18, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Gast | Letzte Anmeldung | Erstellt |
| --- | --- | --- |
| Gast 2 (zulieferer-ag.com) (gast2_zulieferer-ag-com#EXT#@musterbau.onmicrosoft.com) | 13.06.2026 | 14.04.2026 |
| Gast 4 (partner-ing.de) (gast4_partner-ing-de#EXT#@musterbau.onmicrosoft.com) | 24.05.2026 | 05.03.2026 |
| Gast 6 (steuerberatung-x.de) (gast6_steuerberatung-x-de#EXT#@musterbau.onmicrosoft.com) | 04.05.2026 | 24.01.2026 |
| Gast 8 (zulieferer-ag.com) (gast8_zulieferer-ag-com#EXT#@musterbau.onmicrosoft.com) | 14.04.2026 | 15.12.2025 |
| Gast 10 (partner-ing.de) (gast10_partner-ing-de#EXT#@musterbau.onmicrosoft.com) | 25.03.2026 | 05.11.2025 |
| Gast 12 (steuerberatung-x.de) (gast12_steuerberatung-x-de#EXT#@musterbau.onmicrosoft.com) | 05.03.2026 | 26.09.2025 |
| Gast 14 (zulieferer-ag.com) (gast14_zulieferer-ag-com#EXT#@musterbau.onmicrosoft.com) | 13.02.2026 | 17.08.2025 |
| Gast 16 (partner-ing.de) (gast16_partner-ing-de#EXT#@musterbau.onmicrosoft.com) | 24.01.2026 | 08.07.2025 |
| Gast 18 (steuerberatung-x.de) (gast18_steuerberatung-x-de#EXT#@musterbau.onmicrosoft.com) | 04.01.2026 | 29.05.2025 |
| Gast 20 (zulieferer-ag.com) (gast20_zulieferer-ag-com#EXT#@musterbau.onmicrosoft.com) | 15.12.2025 | 19.04.2025 |
| Gast 22 (partner-ing.de) (gast22_partner-ing-de#EXT#@musterbau.onmicrosoft.com) | 25.11.2025 | 10.03.2025 |
| Gast 24 (steuerberatung-x.de) (gast24_steuerberatung-x-de#EXT#@musterbau.onmicrosoft.com) | 05.11.2025 | 29.01.2025 |
| Gast 26 (zulieferer-ag.com) (gast26_zulieferer-ag-com#EXT#@musterbau.onmicrosoft.com) | 16.10.2025 | 20.12.2024 |

#### GU-08 Keine inaktiven aktivierten Mitgliedskonten

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 12 von 142 aktivierten Mitgliedskonten seit über 90 Tagen ohne Anmeldung (enthält ggf. Raum- und Funktionspostfächer). |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Lizenz | Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5 |
| Risiko | Aktive, aber ungenutzte Konten (z. B. ehemaliger Mitarbeitender) sind ein beliebtes Ziel. |
| Empfehlung | Konten ohne Anmeldung seit 90 Tagen prüfen, deaktivieren und Lizenzen freigeben; Offboarding-Prozess schärfen. |
| Normbezug | ISO A.5.18, ISO A.6.5, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Konto | Letzte Anmeldung | Erstellt |
| --- | --- | --- |
| Notfallkonto 1 (bg-01@musterbau.onmicrosoft.com) | 23.07.2026 | 01.01.2024 |
| Martin Altadmin (martin.altadmin@muster-maschinenbau.de) | 24.04.2026 | 11.12.2022 |
| Felix Hoffmann (felix.hoffmann@muster-maschinenbau.de) | 08.07.2026 | 16.10.2022 |
| Eva Koch (eva.koch28@muster-maschinenbau.de) | 15.06.2026 | 27.04.2024 |
| David Richter (david.richter51@muster-maschinenbau.de) | 23.05.2026 | 06.02.2024 |
| Clara Klein (clara.klein74@muster-maschinenbau.de) | 30.04.2026 | 21.05.2024 |
| Ben Wolf (ben.wolf97@muster-maschinenbau.de) | 07.04.2026 | 22.11.2022 |
| Anna Neumann (anna.neumann120@muster-maschinenbau.de) | 15.03.2026 | 31.08.2023 |
| Empfang (empfang@muster-maschinenbau.de) | — | 25.12.2023 |
| Besprechung EG (raum-eg@muster-maschinenbau.de) | — | 23.03.2023 |
| Besprechung OG (raum-og@muster-maschinenbau.de) | — | 20.03.2024 |
| Buchhaltung Postfach (buchhaltung@muster-maschinenbau.de) | — | 17.01.2023 |

### Anwendungen & Berechtigungen

#### AP-01 Benutzer können Apps nicht uneingeschränkt zustimmen

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Benutzer dürfen allen Apps zustimmen (Standard „Legacy“). |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | gering |
| Risiko | Consent-Phishing: Eine bösartige App lässt sich vom Benutzer Zugriff auf Mails und Dateien geben – ganz ohne Kennwort und unbeeindruckt von MFA. |
| Empfehlung | Entra › Unternehmensanwendungen › Zustimmung und Berechtigungen: Zustimmung nur für verifizierte Herausgeber mit geringen Berechtigungen oder gar nicht; Admin-Zustimmungsworkflow aktivieren. |
| Normbezug | ISO A.5.15, ISO A.8.12, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### AP-02 Workflow für Administratorzustimmung ist aktiv

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Workflow für Administratorzustimmung ist deaktiviert. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Benutzer können benötigte Apps beantragen, statt Umwege zu suchen – Admins prüfen und genehmigen. |
| Empfehlung | Entra › Unternehmensanwendungen › Einstellungen für die Administratoreinwilligung › Workflow aktivieren und Prüfer festlegen. |
| Normbezug | ISO A.5.15, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### AP-03 App-Geheimnisse und -Zertifikate sind gültig und gepflegt

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 laufen in 30 Tagen ab, 1 sind bereits abgelaufen. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Ablaufende Anmeldeinformationen führen zu Ausfällen; abgelaufene Altlasten erschweren den Überblick. |
| Empfehlung | Ablaufende Geheimnisse rechtzeitig erneuern (Überwachung einrichten), abgelaufene entfernen. |
| Normbezug | ISO A.8.9, ISO A.8.24, NIS2 Art. 21 (2) e |
| Quelle | Microsoft Graph |

| Anwendung | Typ | Gültig bis | Status |
| --- | --- | --- | --- |
| ERP-Schnittstelle | Geheimnis | 02.12.2026 | noch 6 Tage |
| Intranet-Login | Geheimnis | 21.10.2026 | abgelaufen |

#### AP-04 Anwendungen mit weitreichenden Anwendungsberechtigungen

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 2 Anwendungen haben weitreichende Anwendungsberechtigungen auf Microsoft Graph. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Anwendungsberechtigungen wirken ohne angemeldeten Benutzer auf den ganzen Mandanten, z. B. alle Postfächer oder alle Dateien. Sie sollten bekannt, begründet und begrenzt sein. |
| Empfehlung | Jede gelistete App mit dem Fachbereich bewerten; nicht benötigte Rechte entziehen, Exchange-Zugriffe per RBAC for Applications auf einzelne Postfächer begrenzen. |
| Normbezug | ISO A.5.15, ISO A.8.2, NIS2 Art. 21 (2) i, NIS2 Art. 21 (2) d |
| Quelle | Microsoft Graph |

| Anwendung | Herkunft | Berechtigungen |
| --- | --- | --- |
| Backup-Connector (Drittanbieter) | Drittanbieter | Files.ReadWrite.All, Mail.ReadWrite |
| Signatur-Tool Pro | Drittanbieter | MailboxSettings.ReadWrite |

#### AP-05 Mandantenweite Zustimmungen für Drittanbieter-Apps

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 Drittanbieter-App hat mandantenweite Zustimmung für sensible Daten. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Mit einer Administratorzustimmung „für alle Benutzer“ darf die App im Namen jedes Benutzers auf Mails oder Dateien zugreifen. |
| Empfehlung | Zustimmungen prüfen (Entra › Unternehmensanwendungen › Berechtigungen) und nicht mehr benötigte Apps bzw. Rechte entfernen. |
| Normbezug | ISO A.5.15, ISO A.5.19, NIS2 Art. 21 (2) i, NIS2 Art. 21 (2) d |
| Quelle | Microsoft Graph |

| Anwendung | Sensible Berechtigungen |
| --- | --- |
| Meeting-Notizen KI (Testversion) | Files.Read.All, Mail.Read |

#### AP-06 Keine Client-Geheimnisse mit über zwei Jahren Laufzeit

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 1 Geheimnis läuft länger als zwei Jahre. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Langlaufende Geheimnisse werden selten rotiert und bleiben nach einem Leak lange nutzbar. |
| Empfehlung | Geheimnisse mit max. 12 Monaten Laufzeit ausstellen oder auf Zertifikate bzw. Workload Identity Federation umstellen; per App-Verwaltungsrichtlinie erzwingen. |
| Normbezug | ISO A.8.24, ISO A.5.17, NIS2 Art. 21 (2) h |
| Quelle | Microsoft Graph |

| Anwendung | Erstellt | Gültig bis | Laufzeit |
| --- | --- | --- | --- |
| Intranet-Login | 24.01.2026 | 16.06.2033 | 7 Jahre |

### E-Mail & Exchange Online

#### ML-01 SPF-Eintrag ist vorhanden und korrekt

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 1 von 2 Domänen in Ordnung. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | SPF legt fest, welche Server im Namen Ihrer Domäne senden dürfen – Grundlage gegen gefälschte Absender. |
| Empfehlung | Je Maildomäne genau einen TXT-Eintrag, z. B. „v=spf1 include:spf.protection.outlook.com -all“; ungenutzte Domänen: „v=spf1 -all“. |
| Normbezug | ISO A.5.14, NIS2 Art. 21 (2) j |
| Quelle | DNS |

| Domäne | Ergebnis | Details |
| --- | --- | --- |
| muster-maschinenbau.de | OK | v=spf1 include:spf.protection.outlook.com include:_spf.newsletter-tool.example -all |
| muster-shop.de | Fehlt/falsch | kein SPF |

#### ML-02 DMARC ist mit Richtlinie „quarantine“ oder „reject“ aktiv

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 2 Domänen in Ordnung. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | mittel |
| Risiko | Erst DMARC sorgt dafür, dass gefälschte Mails mit Ihrer Domäne beim Empfänger abgewiesen werden (CEO-Fraud, Rechnungsbetrug). Google und Yahoo verlangen DMARC für Massenversender. |
| Empfehlung | TXT-Eintrag _dmarc.<domäne>: Start mit „v=DMARC1; p=none; rua=mailto:…“, Berichte auswerten, dann auf „p=quarantine“ und „p=reject“ erhöhen. |
| Normbezug | ISO A.5.14, ISO A.8.7, NIS2 Art. 21 (2) j |
| Quelle | DNS |
| Kommentar | DMARC-Berichte laufen seit 3 Monaten; Umstellung auf quarantine im Q1 geplant. |

| Domäne | Ergebnis | Details |
| --- | --- | --- |
| muster-maschinenbau.de | Prüfen | p=none (nur Überwachung) |
| muster-shop.de | Fehlt/falsch | kein DMARC |

#### Ensure Safe Links for Office applications is enabled

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 8 Punkten – Not configured. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Turn on Safe Links for Office applications in the Safe Links policy. |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### Turn on Safe Attachments in block mode

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 8 Punkten – Not configured. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Create a Safe Attachments policy with action Block and apply it to all recipients. |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### Enable impersonated user protection

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 8 Punkten – Not configured. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | mittel |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Add executives and finance staff as protected users. |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### Ensure all forms of mail forwarding are blocked and/or disabled

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 8 Punkten – Automatic forwarding is allowed. |
| Schweregrad | Hoch |
| Priorität | Sofort |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Set automatic forwarding to Off in the outbound spam policy. |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### Ensure additional storage providers are restricted in Outlook on the web

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 3 Punkten – Not restricted. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Set-OwaMailboxPolicy -AdditionalStorageProvidersAvailable $false |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### ML-04 MTA-STS erzwingt verschlüsselten Mailempfang

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 0 von 1 Domänen in Ordnung. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | MTA-STS verhindert, dass Angreifer die TLS-Verschlüsselung beim Mailtransport herunterstufen. |
| Empfehlung | TXT-Eintrag _mta-sts.<domäne> und Richtliniendatei unter https://mta-sts.<domäne>/.well-known/mta-sts.txt veröffentlichen (Exchange Online unterstützt MTA-STS für eingehende Mails). |
| Normbezug | ISO A.8.24, ISO A.5.14, NIS2 Art. 21 (2) h |
| Quelle | DNS |

| Domäne | Ergebnis | Details |
| --- | --- | --- |
| muster-maschinenbau.de | Prüfen | kein MTA-STS |
| muster-shop.de | — | kein MX |

#### Set the phishing email level threshold at 2 or higher

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 4.5 von 9 Punkten – Partially configured. |
| Schweregrad | Hoch |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Raise the phishing threshold in the anti-phishing policy. |
| Normbezug | ISO A.8.7, ISO A.5.14, NIS2 Art. 21 (2) e |
| Quelle | Secure Score |

#### ML-05 Mailfluss (MX-Einträge) der Domänen

|  |  |
| --- | --- |
| Ergebnis | Information – 2 Domänen ausgewertet. |
| Schweregrad | Info |
| Aufwand | gering |
| Risiko | Zeigt, ob Mails direkt über Exchange Online Protection oder über ein vorgeschaltetes Gateway laufen. |
| Empfehlung | Bei Drittanbieter-Gateways „Erweiterte Filterung für Connectors“ in Exchange Online aktivieren, damit SPF/DMARC korrekt ausgewertet werden. |
| Normbezug | ISO A.8.7 |
| Quelle | DNS |

| Domäne | Ergebnis | Details |
| --- | --- | --- |
| muster-maschinenbau.de | — | 10 muster-maschinenbau-de.mail.protection.outlook.com |
| muster-shop.de | — | kein MX |

### SharePoint & OneDrive

#### SP-02 Gäste dürfen Inhalte nicht weiterfreigeben

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Gäste dürfen weiterfreigeben. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Sonst können Gäste Inhalte, die ihnen freigegeben wurden, an weitere Personen freigeben. |
| Empfehlung | SharePoint Admin Center › Richtlinien › Freigabe › Weitere Einstellungen › „Gäste dürfen Elemente, die sie nicht besitzen, freigeben“ deaktivieren. |
| Normbezug | ISO A.5.14, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### Ensure idle session timeout is set

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 5 Punkten – Not configured. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Configure idle session sign-out. |
| Normbezug | ISO A.5.14, ISO A.8.12, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

#### SP-01 Keine anonymen „Jeder“-Freigabelinks

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Anonyme „Jeder“-Links sind erlaubt. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | „Jeder“-Links funktionieren ohne Anmeldung und lassen sich beliebig weiterleiten. Niemand kann nachvollziehen, wer die Daten geöffnet hat. |
| Empfehlung | SharePoint Admin Center › Richtlinien › Freigabe: höchstens „Neue und vorhandene Gäste“. Wo nötig „Jeder“-Links nur für einzelne Sites und mit Ablaufdatum. |
| Normbezug | ISO A.5.14, ISO A.8.12, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### SP-03 Externe Freigabe ist auf Domänen begrenzt

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Freigabe an beliebige externe Domänen möglich. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Eine Zulassungs- oder Sperrliste von Domänen reduziert versehentliche Freigaben an falsche Empfänger. |
| Empfehlung | SharePoint Admin Center › Richtlinien › Freigabe › „Externe Freigabe nach Domäne einschränken“ – z. B. Partnerdomänen zulassen. |
| Normbezug | ISO A.5.14, ISO A.5.19, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### SP-04 OneDrive-Synchronisierung nur auf Firmengeräten

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Synchronisierung ist von jedem Gerät möglich. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Sonst lassen sich Firmendaten vollständig auf private Rechner synchronisieren. |
| Empfehlung | SharePoint Admin Center › Einstellungen › OneDrive-Synchronisierung › „Synchronisierung nur auf Computern in bestimmten Domänen zulassen“ oder Gerätezugriff per bedingtem Zugriff steuern. |
| Normbezug | ISO A.8.1, ISO A.8.12, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### SP-05 Automatische Abmeldung bei Inaktivität

|  |  |
| --- | --- |
| Ergebnis | Teilweise – Keine Abmeldung bei Leerlauf. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Auf gemeinsam genutzten oder unverwalteten Rechnern bleiben Sitzungen sonst offen. |
| Empfehlung | SharePoint Admin Center › Richtlinien › Zugriffssteuerung › Abmeldung bei Leerlauf aktivieren (z. B. nach 1 Stunde). |
| Normbezug | ISO A.8.5, ISO A.8.1, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

### Microsoft Teams

#### Only invited users should be automatically admitted to Teams meetings

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 5 Punkten – Everyone can bypass the lobby. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Set Who can bypass the lobby to People in my org. |
| Normbezug | ISO A.5.14, ISO A.5.15, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

#### Ensure external domains are restricted in Teams admin center

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 5 Punkten – All external domains allowed. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Allow only specific external domains. |
| Normbezug | ISO A.5.14, ISO A.5.15, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

### Geräte & Intune

#### DV-02 Geräte ohne Konformitätsrichtlinie gelten als nicht konform

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Geräte ohne Richtlinie gelten als konform. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | gering |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Sonst gilt ein Gerät ohne zugewiesene Richtlinie automatisch als konform – und erfüllt damit Gerätebedingungen im bedingten Zugriff. |
| Empfehlung | Intune › Gerätekonformität › Einstellungen für Konformitätsrichtlinien › „Geräte ohne zugewiesene Konformitätsrichtlinie markieren als“: Nicht konform. |
| Normbezug | ISO A.8.1, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### DV-04 Windows- und macOS-Geräte sind verschlüsselt

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 14 von 84 Windows-/macOS-Geräten unverschlüsselt. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Bei Verlust oder Diebstahl schützt nur die Festplattenverschlüsselung (BitLocker / FileVault) die Daten. |
| Empfehlung | BitLocker bzw. FileVault per Endpoint-Security-Richtlinie aktivieren und Wiederherstellungsschlüssel in Entra/Intune sichern. |
| Normbezug | ISO A.8.1, ISO A.8.24, NIS2 Art. 21 (2) h |
| Quelle | Microsoft Graph |

#### Block Office applications from creating child processes

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 7 Punkten – Audit mode. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Enable ASR rule in block mode. |
| Normbezug | ISO A.8.1, ISO A.8.7, NIS2 Art. 21 (2) e, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

#### DV-01 Konformitätsrichtlinien sind vorhanden und zugewiesen

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 3 Richtlinien, davon 1 ohne Zuweisung. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Konformitätsrichtlinien definieren den Mindeststandard (Verschlüsselung, Updates, Virenschutz) und sind Voraussetzung für Gerätebedingungen im bedingten Zugriff. |
| Empfehlung | Je Plattform eine Konformitätsrichtlinie anlegen (Verschlüsselung, Mindest-OS-Version, Defender, Kennwort) und allen Benutzern bzw. Geräten zuweisen. |
| Normbezug | ISO A.8.1, ISO A.8.9, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Richtlinie | Plattform | Zuweisungen |
| --- | --- | --- |
| WIN – Compliance Standard | windows10 | 1 |
| iOS – Compliance | ios | 1 |
| macOS – Test | macOS | 0 |

#### DV-03 Anteil nicht konformer Geräte

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 13 von 118 Geräten nicht konform (11 %). |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Viele nicht konforme Geräte deuten auf fehlende Updates, Verschlüsselung oder zu strenge bzw. unrealistische Richtlinien hin. |
| Empfehlung | Gründe in Intune › Geräte › Konformität auswerten, Geräte nachziehen oder Richtlinien anpassen. |
| Normbezug | ISO A.8.1, ISO A.8.8, NIS2 Art. 21 (2) i, NIS2 Art. 21 (2) e |
| Quelle | Microsoft Graph |

#### DV-05 Geräte melden sich regelmäßig

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 7 von 118 Geräten seit über 30 Tagen ohne Check-in. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Lizenz | Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5 |
| Risiko | Geräte ohne Check-in erhalten keine Richtlinien und Updates – oder existieren nicht mehr. |
| Empfehlung | Bereinigungsregel in Intune einrichten (Geräte › Bereinigungsregeln, z. B. 90 Tage) und Geräte prüfen. |
| Normbezug | ISO A.8.1, ISO A.8.9, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

#### Turn on Microsoft Defender Antivirus PUA protection in block mode

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 2 von 4 Punkten – 50% devices. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | gering |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Configure PUA protection. |
| Normbezug | ISO A.8.1, ISO A.8.7, NIS2 Art. 21 (2) e, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

### Defender & Überwachung

#### DF-01 Microsoft Secure Score

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 157 von 312 Punkten (50 %). Durchschnitt aller Mandanten: 141 Punkte. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Der Secure Score bewertet die Konfiguration aller Microsoft-365-Dienste und ist eine gute Kennzahl für die Wirksamkeit der Maßnahmen (NIS2: Bewertung der Wirksamkeit). |
| Empfehlung | Empfehlungen im Defender-Portal › Secure Score nach Wirkung abarbeiten; Score monatlich berichten. |
| Normbezug | ISO A.8.9, ISO A.5.23, NIS2 Art. 21 (2) f |
| Quelle | Microsoft Graph |

#### DF-03 Keine offenen Sicherheitswarnungen mit hohem Schweregrad

|  |  |
| --- | --- |
| Ergebnis | Teilweise – 2 offene Warnungen, davon 0 hoch. |
| Schweregrad | Mittel |
| Priorität | Mittelfristig |
| Aufwand | mittel |
| Risiko | Offene Warnungen in Microsoft Defender können auf laufende Angriffe hinweisen. |
| Empfehlung | Warnungen im Defender-Portal › Vorfälle und Warnungen bearbeiten; Verantwortlichkeit und Reaktionszeiten festlegen. |
| Normbezug | ISO A.5.25, ISO A.8.16, NIS2 Art. 21 (2) b |
| Quelle | Microsoft Graph |

| Warnung | Schweregrad | Quelle | Erstellt |
| --- | --- | --- | --- |
| Verdächtige Posteingangsregel erstellt | Mittel | microsoftDefenderForOffice365 | 17.11.2026 |
| Mehrere fehlgeschlagene Anmeldeversuche | Niedrig | microsoftDefenderForCloudApps | 14.11.2026 |

#### DF-02 Keine offenen Risikobenutzer

|  |  |
| --- | --- |
| Ergebnis | Nicht prüfbar – Nicht prüfbar: Lizenz fehlt (Entra ID P2). |
| Schweregrad | Hoch |
| Aufwand | gering |
| Lizenz | Entra ID P2 – z. B. in Microsoft 365 E5, E5 Security oder Entra Suite (nicht vorhanden) |
| Risiko | Identity Protection hat Hinweise auf kompromittierte Konten gefunden, die noch nicht behandelt wurden. |
| Empfehlung | Betroffene Konten untersuchen, Kennwort zurücksetzen, Sitzungen widerrufen und Risiko bestätigen bzw. schließen. |
| Normbezug | ISO A.5.25, ISO A.5.26, NIS2 Art. 21 (2) b |
| Quelle | Microsoft Graph |

### Datenschutz & Purview

#### Publish M365 sensitivity label data classification policies

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 6 Punkten – No labels published. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Create and publish sensitivity labels. |
| Normbezug | ISO A.8.12, ISO A.5.12, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

#### Create a DLP policy

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 6 Punkten – No DLP policy. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Create DLP policies for sensitive information types. |
| Normbezug | ISO A.8.12, ISO A.5.12, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

#### Extend M365 sensitivity labeling to assets in Microsoft Purview data map

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – 0 von 3 Punkten – Not configured. |
| Schweregrad | Niedrig |
| Priorität | Mittelfristig |
| Aufwand | hoch |
| Risiko | Auswirkung auf Benutzer: Low. |
| Empfehlung (Microsoft) | Configure auto-labeling. |
| Normbezug | ISO A.8.12, ISO A.5.12, NIS2 Art. 21 (2) i |
| Quelle | Secure Score |

### Datensicherung & Notfall

#### BK-01 Microsoft-365-Daten werden gesichert

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Laut Fragebogen keine Sicherung; Microsoft 365 Backup ist nicht aktiv. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Papierkorb und Aufbewahrung ersetzen keine Sicherung – etwa bei Ransomware, versehentlicher Massenlöschung oder einem kompromittierten Admin. |
| Empfehlung | Microsoft 365 Backup (Microsoft 365 Admin Center › Einstellungen › Microsoft 365 Backup) oder eine Drittanbieter-Sicherung einrichten. |
| Normbezug | ISO A.8.13, NIS2 Art. 21 (2) c |
| Quelle | Microsoft Graph |

### Copilot & KI

#### CP-02 Copilot-Readiness: technische Freigabe-Grundlagen

|  |  |
| --- | --- |
| Ergebnis | Nicht erfüllt – Offen: SP-01, AP-01. |
| Schweregrad | Mittel |
| Priorität | Kurzfristig |
| Aufwand | mittel |
| Risiko | Zusammenfassung der Einstellungen, die Übersharing an Copilot begünstigen: anonyme Links, offene Gastrechte und uneingeschränkte App-Zustimmung. |
| Empfehlung | Die verknüpften Befunde SP-01, GU-02 und AP-01 beheben; zusätzlich Restricted Content Discovery bzw. SharePoint Advanced Management für sensible Sites prüfen. |
| Normbezug | ISO A.5.15, ISO A.8.3, ISO A.8.12, NIS2 Art. 21 (2) i |
| Quelle | Microsoft Graph |

| Prüfung | Ergebnis |
| --- | --- |
| SP-01 Keine anonymen „Jeder“-Freigabelinks | Teilweise |
| GU-02 Gastbenutzer haben eingeschränkten Verzeichniszugriff | Erfüllt |
| AP-01 Benutzer können Apps nicht uneingeschränkt zustimmen | Nicht erfüllt |

## Organisatorische Bestandsaufnahme

Die folgenden Fragen wurden gemeinsam mit Muster Maschinenbau GmbH beantwortet. Sie ergänzen die technische Prüfung um Organisation, Prozesse und Verantwortlichkeiten.

| Nr. | Frage | Antwort | Empfehlung bei Lücke |
| --- | --- | --- | --- |
| Q01 | Ist eine verantwortliche Person für die Informationssicherheit von Microsoft 365 benannt (z. B. ISB oder IT-Leitung)? | Ja |  |
| Q02 | Gibt es eine dokumentierte und freigegebene Informationssicherheitsrichtlinie? | Teilweise | Informationssicherheitsleitlinie erstellen, von der Geschäftsleitung freigeben lassen und jährlich überprüfen. |
| Q03 | Wurde für die Microsoft-365-Umgebung eine Risikoanalyse durchgeführt und dokumentiert? | Nein | Risiken (z. B. Kontoübernahme, Datenabfluss, Ausfall) bewerten und einen Behandlungsplan ableiten. Dieser Bericht kann als Ausgangspunkt dienen. |
| Q04 | Werden administrative Berechtigungen nach einem festen Verfahren vergeben und mindestens jährlich überprüft? | Teilweise | Berechtigungskonzept für Admin-Rollen erstellen, Rezertifizierung (z. B. mit Entra Access Reviews) mindestens jährlich durchführen. |
| Q05 | Gibt es einen geregelten Austrittsprozess, bei dem Konten am letzten Arbeitstag gesperrt und Daten übergeben werden? | Ja |  |
| Q06 | Werden Gastkonten und externe Freigaben regelmäßig überprüft und nicht mehr benötigte entfernt? | Nein | Regelmäßige Überprüfung (z. B. Entra Access Reviews für Gäste, Ablauf von Gastzugriffen in SharePoint) einrichten. |
| Q07 | Sind Notfallzugriffskonten (Break-Glass) dokumentiert, sicher verwahrt und wird ihre Funktion regelmäßig getestet? | Teilweise | Zwei Cloud-only-Notfallkonten mit FIDO2-Schlüsseln anlegen, von CA-Richtlinien ausnehmen, Anmeldungen überwachen und halbjährlich testen. |
| Q08 | Werden Anmelde- und Überwachungsprotokolle regelmäßig ausgewertet oder an ein SIEM übertragen? | Nein | Protokolle an Microsoft Sentinel oder ein anderes SIEM übertragen bzw. mindestens wöchentlich auswerten; Aufbewahrung festlegen. |
| Q09 | Gibt es einen dokumentierten Prozess für Sicherheitsvorfälle inklusive Meldewegen und Fristen? | Nein | Incident-Response-Plan mit Rollen, Kontaktdaten (auch Dienstleister, BSI), Erstmaßnahmen bei Kontoübernahme und Meldefristen erstellen. |
| Q10 | Ist festgelegt, wer auf Warnungen aus Microsoft Defender reagiert – auch außerhalb der Geschäftszeiten? | Teilweise | Empfänger für Defender-Benachrichtigungen festlegen, Reaktionszeiten definieren, ggf. Managed Detection & Response (MDR) beauftragen. |
| Q11 | Werden Änderungen an der Microsoft-365-Konfiguration nachvollziehbar dokumentiert? | offen | Änderungsprozess (Ticket, Freigabe, Dokumentation) einführen; Konfiguration regelmäßig sichern und vergleichen. |
| Q12 | Werden Betriebssysteme, Office-Apps und Browser auf allen Geräten zeitnah aktualisiert? | Ja |  |
| Q13 | Werden alle Mitarbeitenden regelmäßig zu Phishing und Informationssicherheit geschult? | Teilweise | Jährliche Schulung und regelmäßige Phishing-Simulationen (z. B. Angriffssimulationstraining in Defender for Office 365 Plan 2) einführen. |
| Q14 | Gibt es verbindliche Regeln für private Geräte (BYOD), und werden sie technisch durchgesetzt? | Nein | BYOD-Richtlinie festlegen und mit App-Schutzrichtlinien bzw. bedingtem Zugriff (nur verwaltete Geräte/Apps) durchsetzen. |
| Q15 | Sind Zugriffe externer IT-Dienstleister vertraglich geregelt und technisch auf das Nötige begrenzt (z. B. GDAP)? | Ja |  |
| Q16 | Werden Exchange-Postfächer, OneDrive, SharePoint und Teams zusätzlich gesichert (Microsoft 365 Backup oder Drittanbieter)? | Nein | Microsoft 365 Backup oder eine Drittanbieterlösung einführen; Aufbewahrungszeiten festlegen. |
| Q17 | Wurde in den letzten 12 Monaten eine Wiederherstellung aus der Sicherung erfolgreich getestet? | Nein | Halbjährlichen Wiederherstellungstest (Postfach, Site, OneDrive) durchführen und dokumentieren. |
| Q18 | Gibt es einen Notfallplan für den Ausfall von Microsoft 365 oder eine Kompromittierung des Mandanten? | offen | Notfallhandbuch mit alternativen Kommunikationswegen, Kontakten und Wiederanlaufreihenfolge erstellen. |
| Q19 | Gibt es ein Klassifizierungsschema für Informationen (z. B. öffentlich, intern, vertraulich), das genutzt wird? | Nein | Schema festlegen und mit Purview-Vertraulichkeitsbezeichnungen technisch umsetzen. |
| Q20 | Sind Auftragsverarbeitung mit Microsoft (DPA) und das Verzeichnis der Verarbeitungstätigkeiten für Microsoft 365 dokumentiert? | offen | Microsoft Products and Services DPA prüfen, Verarbeitungen im Verzeichnis ergänzen, Datenschutz-Folgenabschätzung bei Bedarf. |
| Q21 | Wurden vor bzw. beim Einsatz von Copilot Berechtigungen und Freigaben in SharePoint und OneDrive auf Übersharing geprüft? | Nein | Freigaben auswerten (z. B. SharePoint Advanced Management, Data Access Governance), „Jeder“-Links und organisationsweite Freigaben bereinigen. |
| Q22 | Gibt es eine Richtlinie zur Nutzung von KI-Diensten (erlaubte Tools, Umgang mit vertraulichen Daten)? | Teilweise | KI-Nutzungsrichtlinie erstellen, freigegebene Dienste benennen, Mitarbeitende schulen; Nutzung nicht freigegebener Dienste technisch begrenzen. |

## Zuordnung ISO/IEC 27001 und NIS2

_Die Prüfpunkte sind den Maßnahmen aus ISO/IEC 27001:2022 Anhang A und den Risikomanagementmaßnahmen nach Art. 21 der NIS2-Richtlinie (in Deutschland umgesetzt in § 30 BSIG) zugeordnet. Die Zuordnung dient als Orientierung und Grundlage für Audits; sie ersetzt keine Zertifizierungsprüfung._

### ISO/IEC 27001:2022 – Anhang A

| Maßnahme | Prüfpunkte | Erfüllt | Teilweise | Nicht erfüllt | Bewertung |
| --- | --- | --- | --- | --- | --- |
| A.5.1 Informationssicherheitsrichtlinien | 1 | 0 | 1 | 0 | 50 |
| A.5.2 Rollen und Verantwortlichkeiten | 1 | 1 | 0 | 0 | 100 |
| A.5.7 Bedrohungsintelligenz | 1 | 0 | 0 | 1 | 0 |
| A.5.10 Zulässiger Gebrauch von Informationen | 2 | 0 | 1 | 0 | 50 |
| A.5.12 Klassifizierung von Information | 5 | 1 | 0 | 4 | 37 |
| A.5.13 Kennzeichnung von Information | 1 | 0 | 0 | 1 | 0 |
| A.5.14 Informationsübertragung | 25 | 9 | 4 | 11 | 45 |
| A.5.15 Zugangssteuerung | 17 | 2 | 5 | 7 | 27 |
| A.5.16 Identitätsmanagement | 2 | 2 | 0 | 0 | 100 |
| A.5.17 Authentifizierungsinformationen | 4 | 1 | 3 | 0 | 76 |
| A.5.18 Zugangsrechte | 9 | 0 | 6 | 2 | 36 |
| A.5.19 Informationssicherheit in Lieferantenbeziehungen | 5 | 1 | 3 | 1 | 50 |
| A.5.23 Informationssicherheit bei Cloud-Diensten | 3 | 1 | 1 | 1 | 50 |
| A.5.24 Planung der Handhabung von Sicherheitsvorfällen | 1 | 0 | 0 | 1 | 0 |
| A.5.25 Beurteilung von Sicherheitsereignissen | 3 | 0 | 2 | 0 | 50 |
| A.5.26 Reaktion auf Sicherheitsvorfälle | 2 | 0 | 0 | 1 | 0 |
| A.5.29 Informationssicherheit bei Störungen | 3 | 1 | 1 | 0 | 67 |
| A.5.30 IKT-Bereitschaft für Business Continuity | 2 | 0 | 0 | 1 | 0 |
| A.5.34 Datenschutz und Schutz personenbezogener Daten | 1 | 0 | 0 | 0 | – |
| A.6.3 Sensibilisierung und Schulung | 1 | 0 | 1 | 0 | 50 |
| A.6.5 Verantwortlichkeiten nach Beendigung der Beschäftigung | 2 | 1 | 1 | 0 | 92 |
| A.6.7 Remote-Arbeit | 1 | 0 | 0 | 1 | 0 |
| A.8.1 Endpunktgeräte der Benutzer | 13 | 2 | 7 | 4 | 41 |
| A.8.2 Privilegierte Zugangsrechte | 15 | 3 | 7 | 4 | 45 |
| A.8.3 Beschränkung des Informationszugangs | 3 | 1 | 0 | 2 | 25 |
| A.8.5 Sichere Authentifizierung | 15 | 7 | 3 | 5 | 65 |
| A.8.7 Schutz gegen Schadsoftware | 20 | 10 | 2 | 7 | 52 |
| A.8.8 Handhabung technischer Schwachstellen | 2 | 1 | 1 | 0 | 86 |
| A.8.9 Konfigurationsmanagement | 7 | 0 | 5 | 1 | 38 |
| A.8.12 Verhinderung von Datenlecks | 9 | 1 | 2 | 6 | 28 |
| A.8.13 Sicherung von Information | 3 | 0 | 0 | 3 | 0 |
| A.8.15 Protokollierung | 1 | 0 | 0 | 1 | 0 |
| A.8.16 Überwachung von Aktivitäten | 5 | 1 | 2 | 2 | 32 |
| A.8.24 Verwendung von Kryptographie | 5 | 1 | 3 | 1 | 50 |
| A.8.32 Änderungssteuerung | 1 | 0 | 0 | 0 | – |

### NIS2 – Art. 21 Risikomanagementmaßnahmen

| Anforderung | Prüfpunkte | Erfüllt | Teilweise | Nicht erfüllt | Bewertung |
| --- | --- | --- | --- | --- | --- |
| Art. 20 – Verantwortung der Leitung | 1 | 1 | 0 | 0 | 100 |
| Art. 23 – Meldepflichten | 1 | 0 | 0 | 1 | 0 |
| Art. 21 (2) a – Risikoanalyse & Sicherheitskonzepte | 2 | 0 | 1 | 1 | 25 |
| Art. 21 (2) b – Bewältigung von Sicherheitsvorfällen | 7 | 1 | 2 | 3 | 22 |
| Art. 21 (2) c – Betriebskontinuität, Backup, Krisenmanagement | 6 | 1 | 1 | 3 | 29 |
| Art. 21 (2) d – Sicherheit der Lieferkette | 4 | 1 | 3 | 0 | 60 |
| Art. 21 (2) e – Sicherheit bei Betrieb & Wartung, Schwachstellen | 22 | 11 | 4 | 6 | 58 |
| Art. 21 (2) f – Bewertung der Wirksamkeit | 2 | 0 | 2 | 0 | 50 |
| Art. 21 (2) g – Cyberhygiene & Schulungen | 2 | 0 | 2 | 0 | 50 |
| Art. 21 (2) h – Kryptografie & Verschlüsselung | 4 | 1 | 2 | 1 | 50 |
| Art. 21 (2) i – Zugriffskontrolle & Asset-Management | 51 | 8 | 21 | 19 | 40 |
| Art. 21 (2) j – Multi-Faktor-Authentifizierung | 17 | 7 | 3 | 7 | 56 |

## Veränderung seit 14.08.2026

Bewertung damals: 42 – heute: 45.

| Prüfpunkt | Vorher | Jetzt |
| --- | --- | --- |
| Legacy-Authentifizierung ist blockiert | Nicht erfüllt | Erfüllt |
| Zugriff nur von konformen bzw. verwalteten Geräten | Nicht erfüllt | Teilweise |
| Microsoft Secure Score | Nicht erfüllt | Teilweise |

## Prüfumfang, Methodik und Hinweise

- **Vorgehen:** Anmeldung mit einem Konto des Mandanten bzw. per GDAP; ausschließlich lesende Abfragen über Microsoft Graph (delegierte Berechtigungen). Es wurden keine Einstellungen verändert.
- **Datenhaltung:** Die Auswertung erfolgte lokal auf dem Rechner des Prüfers. Es wurden keine Daten an Dritte übertragen; für die DNS-Prüfung wurden die öffentlichen Domainnamen per DNS-over-HTTPS bei Cloudflare abgefragt.
- **Quellen:** Entra ID (Richtlinien, Rollen, Benutzer, Anwendungen), SharePoint-Mandanteneinstellungen, Intune, Microsoft Defender, Microsoft Secure Score (Exchange Online, Defender for Office 365, Teams, Purview, Endpoint), öffentliches DNS sowie ein Fragebogen.
- **Bewertung:** Gewichtung nach Schweregrad: hoch × 10, mittel × 5, niedrig × 2; „teilweise“ = 50 %. Nicht prüfbare Punkte (fehlende Lizenz oder Berechtigung) und offene Fragen bleiben unberücksichtigt.
- **Grenzen:** Die Prüfung ist eine Momentaufnahme der Konfiguration. Sie ersetzt keinen Penetrationstest, kein ISMS-Audit und keine Rechtsberatung. Einzelne Exchange-Online-Einstellungen sind über Microsoft Graph nicht lesbar und werden über den Microsoft Secure Score bewertet.

#### Hinweise aus der Datenerfassung

| Quelle | Hinweis |
| --- | --- |
| PIM: berechtigte Zuweisungen | Lizenz fehlt (Entra ID P2): Der Mandant verfügt nicht über Entra ID P2. |
| Risikobenutzer (Identity Protection) | Lizenz fehlt (Entra ID P2). |

