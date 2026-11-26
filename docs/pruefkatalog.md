# Prüfkatalog

> Automatisch erzeugt aus `web/js/checks.js` und `web/js/catalog.js` (`node tools/katalog.mjs`).

M365 Security Check bewertet **61 eigene technische Prüfungen**, **22 Fragen** des Fragebogens und zusätzlich alle **Kontrollen des Microsoft Secure Score** für Exchange Online, Defender for Office 365, Teams, SharePoint, Purview, Defender for Endpoint, Defender for Identity und Defender for Cloud Apps (je nach Lizenz typischerweise 50–100). Entra-Kontrollen des Secure Score werden ausgeblendet, weil die eigenen Prüfungen sie genauer abdecken.

## Bewertung

| Ergebnis | Anteil |
| --- | --- |
| Erfüllt | 100 % |
| Teilweise | 50 % |
| Nicht erfüllt | 0 % |
| Information, nicht prüfbar, offen, Risiko akzeptiert | zählt nicht |

Gewichtung nach Schweregrad: Hoch × 10, Mittel × 5, Niedrig × 2. Priorität im Maßnahmenplan: **Sofort** = nicht erfüllt & hoch · **Kurzfristig** = nicht erfüllt & mittel oder teilweise & hoch · **Mittelfristig** = übrige Lücken.

## Identität & Anmeldung

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| ID-01 | **MFA-Grundschutz ist aktiv (Sicherheitsstandards oder bedingter Zugriff)**<br>Laut Microsoft verhindert MFA über 99 % der automatisierten Angriffe auf Konten. Ohne MFA-Grundschutz reicht ein erbeutetes Kennwort. | Hoch | – | A.8.5, A.5.17 | Art. 21 (2) j |
| ID-02 | **MFA wird für alle Benutzer bei jeder Anmeldung erzwungen**<br>Sicherheitsstandards fordern MFA nur situationsabhängig. Eine Richtlinie für bedingten Zugriff erzwingt MFA für alle Benutzer, alle Apps und alle Clients – mit gezielten Ausnahmen für Notfallkonten. | Hoch | Entra ID P1 | A.8.5 | Art. 21 (2) j |
| ID-03 | **Legacy-Authentifizierung ist blockiert**<br>Alte Protokolle (POP, IMAP, SMTP-Auth, EAS mit Basic Auth) können kein MFA und sind das bevorzugte Ziel von Password-Spray-Angriffen. | Hoch | Entra ID P1 | A.8.5 | Art. 21 (2) j |
| ID-04 | **Mindestens 95 % der Benutzer haben MFA registriert**<br>Benutzer ohne registrierte MFA-Methode können bei einer Kontoübernahme vom Angreifer „registriert“ werden. | Mittel | Entra ID P1 | A.8.5, A.5.17 | Art. 21 (2) j |
| ID-05 | **SMS und Sprachanruf sind als Anmeldemethode deaktiviert**<br>SMS und Anrufe lassen sich durch SIM-Swapping und Phishing-Proxys abfangen. Microsoft Authenticator mit Nummernabgleich oder Passkeys sind deutlich sicherer. | Mittel | – | A.8.5 | Art. 21 (2) j |
| ID-06 | **Passkeys (FIDO2) sind als Methode verfügbar**<br>Passkeys sind phishing-resistent und die Grundlage für passwortlose Anmeldung – besonders für Administratoren. | Niedrig | – | A.8.5 | Art. 21 (2) j |
| ID-07 | **Microsoft Authenticator ist als Methode aktiviert**<br>Der Authenticator mit Nummernabgleich ist die empfohlene Standardmethode für MFA. | Mittel | – | A.8.5 | Art. 21 (2) j |
| ID-08 | **Kennwörter laufen nicht regelmäßig ab**<br>Erzwungene Kennwortwechsel führen zu schwächeren, vorhersehbaren Kennwörtern. Microsoft und BSI empfehlen bei MFA keinen periodischen Wechsel. | Niedrig | – | A.5.17 | Art. 21 (2) j |

## Bedingter Zugriff

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| ID-09 | **Risikobasierter bedingter Zugriff (Anmelde- und Benutzerrisiko)**<br>Identity Protection erkennt z. B. Anmeldungen aus dem Darknet bekannter Kennwörter, unmögliche Reisen oder Token-Diebstahl und kann automatisch MFA oder einen Kennwortwechsel verlangen. | Mittel | Entra ID P2 | A.8.5, A.8.16 | Art. 21 (2) j, Art. 21 (2) b |
| CA-01 | **MFA ist für alle Administratorrollen erzwungen**<br>Administratorkonten sind das wertvollste Ziel. Ein einziges kompromittiertes Adminkonto bedeutet den Verlust des gesamten Mandanten. | Hoch | Entra ID P1 | A.8.2, A.8.5 | Art. 21 (2) j, Art. 21 (2) i |
| CA-02 | **Phishing-resistente MFA für Administratoren**<br>Phishing-Proxys (Adversary-in-the-Middle) umgehen klassische MFA. Passkeys, Windows Hello for Business oder Zertifikate sind dagegen immun. | Mittel | Entra ID P1 | A.8.2, A.8.5 | Art. 21 (2) j |
| CA-03 | **Zugriff nur von konformen bzw. verwalteten Geräten**<br>Ohne Geräteanforderung reicht ein gestohlenes Kennwort samt MFA-Token, um von jedem beliebigen Gerät auf Firmendaten zuzugreifen. | Mittel | Microsoft Intune Plan 1 | A.8.1, A.5.15 | Art. 21 (2) i |
| CA-04 | **Notfallzugriffskonto ist von den Richtlinien ausgenommen**<br>Ein Fehler im bedingten Zugriff oder ein MFA-Ausfall kann alle Administratoren aussperren. Ein überwachtes Notfallkonto (Break-Glass) sichert den Zugang. | Mittel | – | A.8.2, A.5.29 | Art. 21 (2) c |
| CA-05 | **Gerätecode-Fluss ist eingeschränkt**<br>Device-Code-Phishing ist eine aktuell stark genutzte Angriffstechnik, mit der Angreifer gültige Token erbeuten – trotz MFA. | Mittel | Entra ID P1 | A.8.5 | Art. 21 (2) j |
| CA-06 | **MFA für die Azure-Verwaltung**<br>Über das Azure-Portal, PowerShell und CLI lassen sich Ressourcen und Abos verwalten – auch Benutzer ohne Admin-Rolle haben oft Zugriff. | Mittel | Entra ID P1 | A.8.2, A.8.5 | Art. 21 (2) j |
| CA-07 | **Keine Richtlinien dauerhaft im Berichtsmodus**<br>Richtlinien im Berichtsmodus schützen nicht. Sie sind für einen kurzen Testzeitraum gedacht. | Niedrig | – | A.8.9 | Art. 21 (2) f |

## Privilegierte Konten

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| PA-01 | **Zwei bis vier globale Administratoren**<br>Mindestens zwei sorgen für Redundanz, mehr als vier vergrößern die Angriffsfläche unnötig. Für die tägliche Arbeit reichen meist spezifische Rollen. | Hoch | – | A.8.2 | Art. 21 (2) i |
| PA-02 | **Privilegierte Konten sind reine Cloud-Konten**<br>Wird ein aus dem lokalen Active Directory synchronisiertes Konto dort kompromittiert, übernimmt der Angreifer auch die Cloud-Adminrechte. | Hoch | – | A.8.2 | Art. 21 (2) i |
| PA-03 | **Keine Gastkonten mit Administratorrollen**<br>Gastkonten werden in einem fremden Mandanten verwaltet – deren Sicherheit liegt außerhalb Ihrer Kontrolle. | Hoch | – | A.8.2, A.5.19 | Art. 21 (2) i, Art. 21 (2) d |
| PA-04 | **Alle Administratoren haben MFA registriert**<br>Ein Adminkonto ohne MFA ist mit einem einzigen Kennwort übernehmbar. | Hoch | Entra ID P1 | A.8.2, A.8.5 | Art. 21 (2) j |
| PA-05 | **Privileged Identity Management (Just-in-Time-Adminrechte)**<br>Mit PIM sind Adminrechte nur bei Bedarf und zeitlich begrenzt aktiv – mit Begründung, MFA und optionaler Genehmigung. Dauerhafte Rechte vergrößern das Risiko. | Mittel | Entra ID P2 | A.8.2, A.5.18 | Art. 21 (2) i |
| PA-06 | **Keine inaktiven Administratorkonten**<br>Ungenutzte Adminkonten fallen bei einer Übernahme nicht auf und haben oft veraltete Schutzmaßnahmen. | Mittel | Entra ID P1 | A.8.2, A.5.18 | Art. 21 (2) i |
| PA-07 | **Keine Anwendungen mit privilegierten Verzeichnisrollen**<br>Dienstprinzipale mit Admin-Rollen unterliegen keiner MFA. Ein geleaktes App-Geheimnis genügt für die Übernahme. | Mittel | – | A.8.2 | Art. 21 (2) i |
| PA-08 | **Übersicht privilegierter Rollenzuweisungen**<br>Grundlage für die regelmäßige Rezertifizierung der Adminrechte. | Info | – | A.8.2, A.5.18 | Art. 21 (2) i |

## Benutzer & Gäste

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| GU-01 | **Gasteinladungen sind eingeschränkt**<br>Dürfen alle Benutzer (oder sogar Gäste) Externe einladen, entstehen unkontrolliert Zugänge zu Teams, Gruppen und Dateien. | Mittel | – | A.5.15, A.5.18 | Art. 21 (2) i |
| GU-02 | **Gastbenutzer haben eingeschränkten Verzeichniszugriff**<br>Mit Mitgliedsrechten können Gäste das komplette Verzeichnis auslesen – eine Fundgrube für gezieltes Phishing. | Mittel | – | A.5.15, A.8.3 | Art. 21 (2) i |
| GU-03 | **Benutzer dürfen keine Anwendungen registrieren**<br>Selbst registrierte Apps sind ein beliebter Weg für dauerhafte Hintertüren (Illicit Consent, Persistenz). | Mittel | – | A.5.15, A.8.9 | Art. 21 (2) i |
| GU-04 | **Benutzer dürfen keine neuen Mandanten erstellen**<br>Von Mitarbeitenden angelegte Mandanten entziehen sich der Kontrolle der IT (Schatten-IT, Datenabfluss). | Mittel | – | A.5.15, A.5.23 | Art. 21 (2) i |
| GU-05 | **Benutzer dürfen keine Sicherheitsgruppen erstellen**<br>Selbst erstellte Sicherheitsgruppen erschweren die Rechteverwaltung und können Zuweisungen unterlaufen. | Niedrig | – | A.5.18 | Art. 21 (2) i |
| GU-06 | **Keine Selbstregistrierung per E-Mail-Bestätigung**<br>Sonst können sich Personen mit passender E-Mail-Domäne selbst ein Konto im Mandanten anlegen (virale Registrierung). | Niedrig | – | A.5.16 | Art. 21 (2) i |
| GU-07 | **Keine inaktiven Gastkonten**<br>Vergessene Gastkonten behalten Zugriff auf Teams, Dateien und Gruppen. | Niedrig | Entra ID P1 | A.5.18 | Art. 21 (2) i |
| GU-08 | **Keine inaktiven aktivierten Mitgliedskonten**<br>Aktive, aber ungenutzte Konten (z. B. ehemaliger Mitarbeitender) sind ein beliebtes Ziel. | Niedrig | Entra ID P1 | A.5.18, A.6.5 | Art. 21 (2) i |

## Anwendungen & Berechtigungen

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| AP-01 | **Benutzer können Apps nicht uneingeschränkt zustimmen**<br>Consent-Phishing: Eine bösartige App lässt sich vom Benutzer Zugriff auf Mails und Dateien geben – ganz ohne Kennwort und unbeeindruckt von MFA. | Hoch | – | A.5.15, A.8.12 | Art. 21 (2) i |
| AP-02 | **Workflow für Administratorzustimmung ist aktiv**<br>Benutzer können benötigte Apps beantragen, statt Umwege zu suchen – Admins prüfen und genehmigen. | Niedrig | – | A.5.15 | Art. 21 (2) i |
| AP-03 | **App-Geheimnisse und -Zertifikate sind gültig und gepflegt**<br>Ablaufende Anmeldeinformationen führen zu Ausfällen; abgelaufene Altlasten erschweren den Überblick. | Niedrig | – | A.8.9, A.8.24 | Art. 21 (2) e |
| AP-04 | **Anwendungen mit weitreichenden Anwendungsberechtigungen**<br>Anwendungsberechtigungen wirken ohne angemeldeten Benutzer auf den ganzen Mandanten, z. B. alle Postfächer oder alle Dateien. Sie sollten bekannt, begründet und begrenzt sein. | Mittel | – | A.5.15, A.8.2 | Art. 21 (2) i, Art. 21 (2) d |
| AP-05 | **Mandantenweite Zustimmungen für Drittanbieter-Apps**<br>Mit einer Administratorzustimmung „für alle Benutzer“ darf die App im Namen jedes Benutzers auf Mails oder Dateien zugreifen. | Mittel | – | A.5.15, A.5.19 | Art. 21 (2) i, Art. 21 (2) d |
| AP-06 | **Keine Client-Geheimnisse mit über zwei Jahren Laufzeit**<br>Langlaufende Geheimnisse werden selten rotiert und bleiben nach einem Leak lange nutzbar. | Niedrig | – | A.8.24, A.5.17 | Art. 21 (2) h |

## E-Mail & Exchange Online

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| ML-01 | **SPF-Eintrag ist vorhanden und korrekt**<br>SPF legt fest, welche Server im Namen Ihrer Domäne senden dürfen – Grundlage gegen gefälschte Absender. | Mittel | – | A.5.14 | Art. 21 (2) j |
| ML-02 | **DMARC ist mit Richtlinie „quarantine“ oder „reject“ aktiv**<br>Erst DMARC sorgt dafür, dass gefälschte Mails mit Ihrer Domäne beim Empfänger abgewiesen werden (CEO-Fraud, Rechnungsbetrug). Google und Yahoo verlangen DMARC für Massenversender. | Hoch | – | A.5.14, A.8.7 | Art. 21 (2) j |
| ML-03 | **DKIM-Signatur für Exchange Online ist aktiv**<br>DKIM signiert ausgehende Mails kryptografisch. Ohne DKIM besteht DMARC bei Weiterleitungen oft nicht. | Mittel | – | A.5.14, A.8.24 | Art. 21 (2) h |
| ML-04 | **MTA-STS erzwingt verschlüsselten Mailempfang**<br>MTA-STS verhindert, dass Angreifer die TLS-Verschlüsselung beim Mailtransport herunterstufen. | Niedrig | – | A.8.24, A.5.14 | Art. 21 (2) h |
| ML-05 | **Mailfluss (MX-Einträge) der Domänen**<br>Zeigt, ob Mails direkt über Exchange Online Protection oder über ein vorgeschaltetes Gateway laufen. | Info | – | A.8.7 |  |

## SharePoint & OneDrive

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| SP-01 | **Keine anonymen „Jeder“-Freigabelinks**<br>„Jeder“-Links funktionieren ohne Anmeldung und lassen sich beliebig weiterleiten. Niemand kann nachvollziehen, wer die Daten geöffnet hat. | Mittel | – | A.5.14, A.8.12 | Art. 21 (2) i |
| SP-02 | **Gäste dürfen Inhalte nicht weiterfreigeben**<br>Sonst können Gäste Inhalte, die ihnen freigegeben wurden, an weitere Personen freigeben. | Niedrig | – | A.5.14 | Art. 21 (2) i |
| SP-03 | **Externe Freigabe ist auf Domänen begrenzt**<br>Eine Zulassungs- oder Sperrliste von Domänen reduziert versehentliche Freigaben an falsche Empfänger. | Niedrig | – | A.5.14, A.5.19 | Art. 21 (2) i |
| SP-04 | **OneDrive-Synchronisierung nur auf Firmengeräten**<br>Sonst lassen sich Firmendaten vollständig auf private Rechner synchronisieren. | Niedrig | – | A.8.1, A.8.12 | Art. 21 (2) i |
| SP-05 | **Automatische Abmeldung bei Inaktivität**<br>Auf gemeinsam genutzten oder unverwalteten Rechnern bleiben Sitzungen sonst offen. | Niedrig | – | A.8.5, A.8.1 | Art. 21 (2) i |
| SP-06 | **Legacy-Authentifizierung für SharePoint ist deaktiviert**<br>Ältere Clients können sich sonst ohne moderne Authentifizierung und damit ohne MFA anmelden. | Mittel | – | A.8.5 | Art. 21 (2) j |

## Microsoft Teams

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| GU-09 | **Erstellung von Microsoft-365-Gruppen und Teams**<br>Dürfen alle Benutzer Teams erstellen, wächst die Zahl der Teams und Freigaben schnell – relevant für Governance und Copilot. | Info | – | A.5.15 | Art. 21 (2) i |

## Geräte & Intune

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| DV-01 | **Konformitätsrichtlinien sind vorhanden und zugewiesen**<br>Konformitätsrichtlinien definieren den Mindeststandard (Verschlüsselung, Updates, Virenschutz) und sind Voraussetzung für Gerätebedingungen im bedingten Zugriff. | Mittel | Microsoft Intune Plan 1 | A.8.1, A.8.9 | Art. 21 (2) i |
| DV-02 | **Geräte ohne Konformitätsrichtlinie gelten als nicht konform**<br>Sonst gilt ein Gerät ohne zugewiesene Richtlinie automatisch als konform – und erfüllt damit Gerätebedingungen im bedingten Zugriff. | Mittel | Microsoft Intune Plan 1 | A.8.1 | Art. 21 (2) i |
| DV-03 | **Anteil nicht konformer Geräte**<br>Viele nicht konforme Geräte deuten auf fehlende Updates, Verschlüsselung oder zu strenge bzw. unrealistische Richtlinien hin. | Niedrig | Microsoft Intune Plan 1 | A.8.1, A.8.8 | Art. 21 (2) i, Art. 21 (2) e |
| DV-04 | **Windows- und macOS-Geräte sind verschlüsselt**<br>Bei Verlust oder Diebstahl schützt nur die Festplattenverschlüsselung (BitLocker / FileVault) die Daten. | Mittel | Microsoft Intune Plan 1 | A.8.1, A.8.24 | Art. 21 (2) h |
| DV-05 | **Geräte melden sich regelmäßig**<br>Geräte ohne Check-in erhalten keine Richtlinien und Updates – oder existieren nicht mehr. | Niedrig | Microsoft Intune Plan 1 | A.8.1, A.8.9 | Art. 21 (2) i |

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q12** Werden Betriebssysteme, Office-Apps und Browser auf allen Geräten zeitnah aktualisiert? | Mittel | A.8.8 | Art. 21 (2) e |
| **Q14** Gibt es verbindliche Regeln für private Geräte (BYOD), und werden sie technisch durchgesetzt? | Mittel | A.8.1, A.6.7 | Art. 21 (2) i |

## Defender & Überwachung

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| DF-01 | **Microsoft Secure Score**<br>Der Secure Score bewertet die Konfiguration aller Microsoft-365-Dienste und ist eine gute Kennzahl für die Wirksamkeit der Maßnahmen (NIS2: Bewertung der Wirksamkeit). | Mittel | – | A.8.9, A.5.23 | Art. 21 (2) f |
| DF-02 | **Keine offenen Risikobenutzer**<br>Identity Protection hat Hinweise auf kompromittierte Konten gefunden, die noch nicht behandelt wurden. | Hoch | Entra ID P2 | A.5.25, A.5.26 | Art. 21 (2) b |
| DF-03 | **Keine offenen Sicherheitswarnungen mit hohem Schweregrad**<br>Offene Warnungen in Microsoft Defender können auf laufende Angriffe hinweisen. | Mittel | – | A.5.25, A.8.16 | Art. 21 (2) b |

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q08** Werden Anmelde- und Überwachungsprotokolle regelmäßig ausgewertet oder an ein SIEM übertragen? | Mittel | A.8.15, A.8.16 | Art. 21 (2) b |
| **Q10** Ist festgelegt, wer auf Warnungen aus Microsoft Defender reagiert – auch außerhalb der Geschäftszeiten? | Mittel | A.5.25, A.8.16 | Art. 21 (2) b |

## Datenschutz & Purview

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q19** Gibt es ein Klassifizierungsschema für Informationen (z. B. öffentlich, intern, vertraulich), das genutzt wird? | Mittel | A.5.12, A.5.13 | Art. 21 (2) i |
| **Q20** Sind Auftragsverarbeitung mit Microsoft (DPA) und das Verzeichnis der Verarbeitungstätigkeiten für Microsoft 365 dokumentiert? | Niedrig | A.5.34 |  |

## Datensicherung & Notfall

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| BK-01 | **Microsoft-365-Daten werden gesichert**<br>Papierkorb und Aufbewahrung ersetzen keine Sicherung – etwa bei Ransomware, versehentlicher Massenlöschung oder einem kompromittierten Admin. | Mittel | – | A.8.13 | Art. 21 (2) c |

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q16** Werden Exchange-Postfächer, OneDrive, SharePoint und Teams zusätzlich gesichert (Microsoft 365 Backup oder Drittanbieter)? | Hoch | A.8.13 | Art. 21 (2) c |
| **Q17** Wurde in den letzten 12 Monaten eine Wiederherstellung aus der Sicherung erfolgreich getestet? | Mittel | A.8.13, A.5.30 | Art. 21 (2) c |
| **Q18** Gibt es einen Notfallplan für den Ausfall von Microsoft 365 oder eine Kompromittierung des Mandanten? | Mittel | A.5.29, A.5.30 | Art. 21 (2) c |

## Copilot & KI

| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |
| --- | --- | --- | --- | --- | --- |
| CP-01 | **Microsoft 365 Copilot im Mandanten**<br>Mit Copilot werden bestehende Berechtigungsprobleme sichtbar: Copilot findet alles, worauf ein Benutzer zugreifen darf. | Info | – | A.5.10, A.5.15 |  |
| CP-02 | **Copilot-Readiness: technische Freigabe-Grundlagen**<br>Zusammenfassung der Einstellungen, die Übersharing an Copilot begünstigen: anonyme Links, offene Gastrechte und uneingeschränkte App-Zustimmung. | Mittel | – | A.5.15, A.8.3, A.8.12 | Art. 21 (2) i |

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q21** Wurden vor bzw. beim Einsatz von Copilot Berechtigungen und Freigaben in SharePoint und OneDrive auf Übersharing geprüft? | Hoch | A.5.15, A.8.3 | Art. 21 (2) i |
| **Q22** Gibt es eine Richtlinie zur Nutzung von KI-Diensten (erlaubte Tools, Umgang mit vertraulichen Daten)? | Mittel | A.5.10 | Art. 21 (2) g |

## Organisation & Prozesse

| Frage | Schwere | ISO 27001 | NIS2 |
| --- | --- | --- | --- |
| **Q01** Ist eine verantwortliche Person für die Informationssicherheit von Microsoft 365 benannt (z. B. ISB oder IT-Leitung)? | Mittel | A.5.2 | Art. 20 |
| **Q02** Gibt es eine dokumentierte und freigegebene Informationssicherheitsrichtlinie? | Mittel | A.5.1 | Art. 21 (2) a |
| **Q03** Wurde für die Microsoft-365-Umgebung eine Risikoanalyse durchgeführt und dokumentiert? | Mittel | A.5.7 | Art. 21 (2) a |
| **Q04** Werden administrative Berechtigungen nach einem festen Verfahren vergeben und mindestens jährlich überprüft? | Hoch | A.5.18, A.8.2 | Art. 21 (2) i |
| **Q05** Gibt es einen geregelten Austrittsprozess, bei dem Konten am letzten Arbeitstag gesperrt und Daten übergeben werden? | Hoch | A.5.16, A.6.5 | Art. 21 (2) i |
| **Q06** Werden Gastkonten und externe Freigaben regelmäßig überprüft und nicht mehr benötigte entfernt? | Mittel | A.5.18, A.5.19 | Art. 21 (2) i |
| **Q07** Sind Notfallzugriffskonten (Break-Glass) dokumentiert, sicher verwahrt und wird ihre Funktion regelmäßig getestet? | Hoch | A.8.2, A.5.29 | Art. 21 (2) c |
| **Q09** Gibt es einen dokumentierten Prozess für Sicherheitsvorfälle inklusive Meldewegen und Fristen? | Hoch | A.5.24, A.5.26 | Art. 21 (2) b, Art. 23 |
| **Q11** Werden Änderungen an der Microsoft-365-Konfiguration nachvollziehbar dokumentiert? | Niedrig | A.8.9, A.8.32 | Art. 21 (2) e |
| **Q13** Werden alle Mitarbeitenden regelmäßig zu Phishing und Informationssicherheit geschult? | Hoch | A.6.3 | Art. 21 (2) g |
| **Q15** Sind Zugriffe externer IT-Dienstleister vertraglich geregelt und technisch auf das Nötige begrenzt (z. B. GDAP)? | Mittel | A.5.19, A.5.23 | Art. 21 (2) d |

## Normbezüge

### ISO/IEC 27001:2022 Anhang A

- **A.5.1** Informationssicherheitsrichtlinien
- **A.5.2** Rollen und Verantwortlichkeiten
- **A.5.7** Bedrohungsintelligenz
- **A.5.10** Zulässiger Gebrauch von Informationen
- **A.5.12** Klassifizierung von Information
- **A.5.13** Kennzeichnung von Information
- **A.5.14** Informationsübertragung
- **A.5.15** Zugangssteuerung
- **A.5.16** Identitätsmanagement
- **A.5.17** Authentifizierungsinformationen
- **A.5.18** Zugangsrechte
- **A.5.19** Informationssicherheit in Lieferantenbeziehungen
- **A.5.23** Informationssicherheit bei Cloud-Diensten
- **A.5.24** Planung der Handhabung von Sicherheitsvorfällen
- **A.5.25** Beurteilung von Sicherheitsereignissen
- **A.5.26** Reaktion auf Sicherheitsvorfälle
- **A.5.29** Informationssicherheit bei Störungen
- **A.5.30** IKT-Bereitschaft für Business Continuity
- **A.5.34** Datenschutz und Schutz personenbezogener Daten
- **A.6.3** Sensibilisierung und Schulung
- **A.6.5** Verantwortlichkeiten nach Beendigung der Beschäftigung
- **A.6.7** Remote-Arbeit
- **A.8.1** Endpunktgeräte der Benutzer
- **A.8.2** Privilegierte Zugangsrechte
- **A.8.3** Beschränkung des Informationszugangs
- **A.8.5** Sichere Authentifizierung
- **A.8.7** Schutz gegen Schadsoftware
- **A.8.8** Handhabung technischer Schwachstellen
- **A.8.9** Konfigurationsmanagement
- **A.8.12** Verhinderung von Datenlecks
- **A.8.13** Sicherung von Information
- **A.8.15** Protokollierung
- **A.8.16** Überwachung von Aktivitäten
- **A.8.20** Netzwerksicherheit
- **A.8.23** Webfilterung
- **A.8.24** Verwendung von Kryptographie
- **A.8.32** Änderungssteuerung

### NIS2 (Richtlinie (EU) 2022/2555, in Deutschland § 30 BSIG)

- Art. 20 – Verantwortung der Leitung
- Art. 23 – Meldepflichten
- Art. 21 (2) a – Risikoanalyse & Sicherheitskonzepte
- Art. 21 (2) b – Bewältigung von Sicherheitsvorfällen
- Art. 21 (2) c – Betriebskontinuität, Backup, Krisenmanagement
- Art. 21 (2) d – Sicherheit der Lieferkette
- Art. 21 (2) e – Sicherheit bei Betrieb & Wartung, Schwachstellen
- Art. 21 (2) f – Bewertung der Wirksamkeit
- Art. 21 (2) g – Cyberhygiene & Schulungen
- Art. 21 (2) h – Kryptografie & Verschlüsselung
- Art. 21 (2) i – Zugriffskontrolle & Asset-Management
- Art. 21 (2) j – Multi-Faktor-Authentifizierung

Die Zuordnung dient der Orientierung und ersetzt keine Auditprüfung.
