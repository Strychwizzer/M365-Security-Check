// Stammdaten: Prüfbereiche, Normbezüge (ISO/IEC 27001:2022 Anhang A, NIS2), Lizenzen, Fragebogen.

export const CATEGORIES = [
  { key: 'identitaet', label: 'Identität & Anmeldung', short: 'Identität' },
  { key: 'zugriff', label: 'Bedingter Zugriff', short: 'Bedingter Zugriff' },
  { key: 'privileg', label: 'Privilegierte Konten', short: 'Admins' },
  { key: 'gaeste', label: 'Benutzer & Gäste', short: 'Benutzer & Gäste' },
  { key: 'apps', label: 'Anwendungen & Berechtigungen', short: 'Apps' },
  { key: 'mail', label: 'E-Mail & Exchange Online', short: 'E-Mail' },
  { key: 'daten', label: 'SharePoint & OneDrive', short: 'SharePoint' },
  { key: 'teams', label: 'Microsoft Teams', short: 'Teams' },
  { key: 'geraete', label: 'Geräte & Intune', short: 'Geräte' },
  { key: 'defender', label: 'Defender & Überwachung', short: 'Defender' },
  { key: 'purview', label: 'Datenschutz & Purview', short: 'Purview' },
  { key: 'backup', label: 'Datensicherung & Notfall', short: 'Backup' },
  { key: 'copilot', label: 'Copilot & KI', short: 'Copilot' },
  { key: 'org', label: 'Organisation & Prozesse', short: 'Organisation' }
];
export const catLabel = (k) => (CATEGORIES.find((c) => c.key === k) || {}).label || k;

// ISO/IEC 27001:2022, Anhang A (Kurztitel)
export const ISO = {
  'A.5.1': 'Informationssicherheitsrichtlinien',
  'A.5.2': 'Rollen und Verantwortlichkeiten',
  'A.5.7': 'Bedrohungsintelligenz',
  'A.5.10': 'Zulässiger Gebrauch von Informationen',
  'A.5.12': 'Klassifizierung von Information',
  'A.5.13': 'Kennzeichnung von Information',
  'A.5.14': 'Informationsübertragung',
  'A.5.15': 'Zugangssteuerung',
  'A.5.16': 'Identitätsmanagement',
  'A.5.17': 'Authentifizierungsinformationen',
  'A.5.18': 'Zugangsrechte',
  'A.5.19': 'Informationssicherheit in Lieferantenbeziehungen',
  'A.5.23': 'Informationssicherheit bei Cloud-Diensten',
  'A.5.24': 'Planung der Handhabung von Sicherheitsvorfällen',
  'A.5.25': 'Beurteilung von Sicherheitsereignissen',
  'A.5.26': 'Reaktion auf Sicherheitsvorfälle',
  'A.5.29': 'Informationssicherheit bei Störungen',
  'A.5.30': 'IKT-Bereitschaft für Business Continuity',
  'A.5.34': 'Datenschutz und Schutz personenbezogener Daten',
  'A.6.3': 'Sensibilisierung und Schulung',
  'A.6.5': 'Verantwortlichkeiten nach Beendigung der Beschäftigung',
  'A.6.7': 'Remote-Arbeit',
  'A.8.1': 'Endpunktgeräte der Benutzer',
  'A.8.2': 'Privilegierte Zugangsrechte',
  'A.8.3': 'Beschränkung des Informationszugangs',
  'A.8.5': 'Sichere Authentifizierung',
  'A.8.7': 'Schutz gegen Schadsoftware',
  'A.8.8': 'Handhabung technischer Schwachstellen',
  'A.8.9': 'Konfigurationsmanagement',
  'A.8.12': 'Verhinderung von Datenlecks',
  'A.8.13': 'Sicherung von Information',
  'A.8.15': 'Protokollierung',
  'A.8.16': 'Überwachung von Aktivitäten',
  'A.8.20': 'Netzwerksicherheit',
  'A.8.23': 'Webfilterung',
  'A.8.24': 'Verwendung von Kryptographie',
  'A.8.32': 'Änderungssteuerung'
};

// NIS2-Richtlinie (EU) 2022/2555 – in Deutschland umgesetzt durch das NIS2UmsuCG (§ 30 BSIG)
export const NIS2 = {
  '20': 'Art. 20 – Verantwortung der Leitung',
  '21a': 'Art. 21 (2) a – Risikoanalyse & Sicherheitskonzepte',
  '21b': 'Art. 21 (2) b – Bewältigung von Sicherheitsvorfällen',
  '21c': 'Art. 21 (2) c – Betriebskontinuität, Backup, Krisenmanagement',
  '21d': 'Art. 21 (2) d – Sicherheit der Lieferkette',
  '21e': 'Art. 21 (2) e – Sicherheit bei Betrieb & Wartung, Schwachstellen',
  '21f': 'Art. 21 (2) f – Bewertung der Wirksamkeit',
  '21g': 'Art. 21 (2) g – Cyberhygiene & Schulungen',
  '21h': 'Art. 21 (2) h – Kryptografie & Verschlüsselung',
  '21i': 'Art. 21 (2) i – Zugriffskontrolle & Asset-Management',
  '21j': 'Art. 21 (2) j – Multi-Faktor-Authentifizierung',
  '23': 'Art. 23 – Meldepflichten'
};
export const nis2Short = (k) => (k.length > 2 ? 'Art. 21 (2) ' + k.slice(2) : 'Art. ' + k);

// Lizenzen: Erkennung über Service-Plan-Namen der abonnierten SKUs (Heuristik)
export const LICENSES = [
  { key: 'P1', label: 'Entra ID P1', hint: 'Entra ID P1 – z. B. in Microsoft 365 Business Premium, E3, E5', plans: [/^AAD_PREMIUM$/] },
  { key: 'P2', label: 'Entra ID P2', hint: 'Entra ID P2 – z. B. in Microsoft 365 E5, E5 Security oder Entra Suite', plans: [/^AAD_PREMIUM_P2$/] },
  { key: 'INTUNE', label: 'Intune', hint: 'Microsoft Intune Plan 1 – z. B. in Business Premium, E3, E5', plans: [/^INTUNE_A$/, /^INTUNE_EDU$/] },
  { key: 'MDO', label: 'Defender for Office 365', hint: 'Defender for Office 365 Plan 1/2 – z. B. in Business Premium (P1) oder E5 (P2)', plans: [/^ATP_ENTERPRISE$/, /^THREAT_INTELLIGENCE$/] },
  { key: 'MDE', label: 'Defender for Endpoint / Business', hint: 'Defender for Business bzw. Defender for Endpoint – z. B. in Business Premium, E3 (P1), E5 (P2)', plans: [/^WINDEFATP$/, /^MDE_LITE$/, /^MDE_SMB$/] },
  { key: 'MIP', label: 'Purview Information Protection', hint: 'Purview Information Protection (AIP P1/P2) – z. B. in Business Premium, E3, E5', plans: [/^RMS_S_PREMIUM2?$/, /^MIP_S_CLP[12]$/] },
  { key: 'MDA', label: 'Defender for Cloud Apps', hint: 'Defender for Cloud Apps – z. B. in E5 oder E5 Security', plans: [/^ADALLOM_S_STANDALONE$/] },
  { key: 'MDI', label: 'Defender for Identity', hint: 'Defender for Identity – z. B. in E5 oder E5 Security', plans: [/^ATA$/] },
  { key: 'COPILOT', label: 'Microsoft 365 Copilot', hint: 'Microsoft 365 Copilot (Add-on)', plans: [/COPILOT/i], sku: /COPILOT/i }
];
export const licHint = (k) => (LICENSES.find((l) => l.key === k) || {}).hint || k;

export const SEVERITY = { high: 'Hoch', medium: 'Mittel', low: 'Niedrig', info: 'Info' };
export const WEIGHT = { high: 10, medium: 5, low: 2, info: 0 };
export const STATUS = { pass: 'Erfüllt', warn: 'Teilweise', fail: 'Nicht erfüllt', info: 'Information', na: 'Nicht prüfbar', open: 'Offen' };
export const EFFORT = { low: 'gering', medium: 'mittel', high: 'hoch' };

// ---------------------------------------------------------------------------
// Fragebogen – organisatorische Bestandsaufnahme (Antworten: yes / partial / no / na)
// ---------------------------------------------------------------------------
export const QUESTIONS = [
  { id: 'Q01', cat: 'org', sev: 'medium', iso: ['A.5.2'], nis2: ['20'], title: 'Ist eine verantwortliche Person für die Informationssicherheit von Microsoft 365 benannt (z. B. ISB oder IT-Leitung)?', help: 'Ohne klare Verantwortung bleiben Befunde liegen. NIS2 verpflichtet zudem die Geschäftsleitung, Maßnahmen zu billigen und zu überwachen.', fix: 'Verantwortliche Person und Vertretung benennen, Aufgaben schriftlich festhalten und der Geschäftsleitung regelmäßig berichten.' },
  { id: 'Q02', cat: 'org', sev: 'medium', iso: ['A.5.1'], nis2: ['21a'], title: 'Gibt es eine dokumentierte und freigegebene Informationssicherheitsrichtlinie?', help: 'Die Leitlinie ist die Grundlage für alle technischen Vorgaben und für Audits.', fix: 'Informationssicherheitsleitlinie erstellen, von der Geschäftsleitung freigeben lassen und jährlich überprüfen.' },
  { id: 'Q03', cat: 'org', sev: 'medium', iso: ['A.5.7'], nis2: ['21a'], title: 'Wurde für die Microsoft-365-Umgebung eine Risikoanalyse durchgeführt und dokumentiert?', help: 'Die Risikoanalyse begründet, welche Maßnahmen in welcher Reihenfolge umgesetzt werden.', fix: 'Risiken (z. B. Kontoübernahme, Datenabfluss, Ausfall) bewerten und einen Behandlungsplan ableiten. Dieser Bericht kann als Ausgangspunkt dienen.' },
  { id: 'Q04', cat: 'org', sev: 'high', iso: ['A.5.18', 'A.8.2'], nis2: ['21i'], title: 'Werden administrative Berechtigungen nach einem festen Verfahren vergeben und mindestens jährlich überprüft?', help: 'Überzählige oder vergessene Adminrechte sind einer der häufigsten Einstiegspunkte bei Angriffen.', fix: 'Berechtigungskonzept für Admin-Rollen erstellen, Rezertifizierung (z. B. mit Entra Access Reviews) mindestens jährlich durchführen.' },
  { id: 'Q05', cat: 'org', sev: 'high', iso: ['A.5.16', 'A.6.5'], nis2: ['21i'], title: 'Gibt es einen geregelten Austrittsprozess, bei dem Konten am letzten Arbeitstag gesperrt und Daten übergeben werden?', help: 'Weiter aktive Konten ehemaliger Mitarbeitender sind ein erhebliches Risiko.', fix: 'Offboarding-Checkliste mit HR abstimmen: Konto sperren, Sitzungen widerrufen, Geräte zurücksetzen, Postfach und OneDrive übergeben.' },
  { id: 'Q06', cat: 'org', sev: 'medium', iso: ['A.5.18', 'A.5.19'], nis2: ['21i'], title: 'Werden Gastkonten und externe Freigaben regelmäßig überprüft und nicht mehr benötigte entfernt?', help: 'Gastkonten bleiben ohne Überprüfung oft jahrelang bestehen.', fix: 'Regelmäßige Überprüfung (z. B. Entra Access Reviews für Gäste, Ablauf von Gastzugriffen in SharePoint) einrichten.' },
  { id: 'Q07', cat: 'org', sev: 'high', iso: ['A.8.2', 'A.5.29'], nis2: ['21c'], title: 'Sind Notfallzugriffskonten (Break-Glass) dokumentiert, sicher verwahrt und wird ihre Funktion regelmäßig getestet?', help: 'Ohne funktionierenden Notfallzugang kann eine Fehlkonfiguration im bedingten Zugriff alle Admins aussperren.', fix: 'Zwei Cloud-only-Notfallkonten mit FIDO2-Schlüsseln anlegen, von CA-Richtlinien ausnehmen, Anmeldungen überwachen und halbjährlich testen.' },
  { id: 'Q08', cat: 'defender', sev: 'medium', iso: ['A.8.15', 'A.8.16'], nis2: ['21b'], title: 'Werden Anmelde- und Überwachungsprotokolle regelmäßig ausgewertet oder an ein SIEM übertragen?', help: 'Entra speichert Anmeldeprotokolle je nach Lizenz nur 7 bis 30 Tage – danach sind Vorfälle nicht mehr nachvollziehbar.', fix: 'Protokolle an Microsoft Sentinel oder ein anderes SIEM übertragen bzw. mindestens wöchentlich auswerten; Aufbewahrung festlegen.' },
  { id: 'Q09', cat: 'org', sev: 'high', iso: ['A.5.24', 'A.5.26'], nis2: ['21b', '23'], title: 'Gibt es einen dokumentierten Prozess für Sicherheitsvorfälle inklusive Meldewegen und Fristen?', help: 'NIS2 verlangt eine Frühwarnung innerhalb von 24 Stunden und eine Meldung innerhalb von 72 Stunden.', fix: 'Incident-Response-Plan mit Rollen, Kontaktdaten (auch Dienstleister, BSI), Erstmaßnahmen bei Kontoübernahme und Meldefristen erstellen.' },
  { id: 'Q10', cat: 'defender', sev: 'medium', iso: ['A.5.25', 'A.8.16'], nis2: ['21b'], title: 'Ist festgelegt, wer auf Warnungen aus Microsoft Defender reagiert – auch außerhalb der Geschäftszeiten?', help: 'Warnungen, die niemand liest, schützen nicht.', fix: 'Empfänger für Defender-Benachrichtigungen festlegen, Reaktionszeiten definieren, ggf. Managed Detection & Response (MDR) beauftragen.' },
  { id: 'Q11', cat: 'org', sev: 'low', iso: ['A.8.9', 'A.8.32'], nis2: ['21e'], title: 'Werden Änderungen an der Microsoft-365-Konfiguration nachvollziehbar dokumentiert?', help: 'Ohne Änderungsdokumentation lassen sich Fehler und Manipulationen kaum erkennen.', fix: 'Änderungsprozess (Ticket, Freigabe, Dokumentation) einführen; Konfiguration regelmäßig sichern und vergleichen.' },
  { id: 'Q12', cat: 'geraete', sev: 'medium', iso: ['A.8.8'], nis2: ['21e'], title: 'Werden Betriebssysteme, Office-Apps und Browser auf allen Geräten zeitnah aktualisiert?', help: 'Bekannte Schwachstellen werden oft innerhalb weniger Tage ausgenutzt.', fix: 'Update-Ringe bzw. Windows Autopatch nutzen, Update-Stand regelmäßig auswerten, veraltete Geräte sperren.' },
  { id: 'Q13', cat: 'org', sev: 'high', iso: ['A.6.3'], nis2: ['21g'], title: 'Werden alle Mitarbeitenden regelmäßig zu Phishing und Informationssicherheit geschult?', help: 'Die meisten Kontoübernahmen beginnen mit einer Phishing-Mail. NIS2 fordert Schulungen ausdrücklich – auch für die Geschäftsleitung.', fix: 'Jährliche Schulung und regelmäßige Phishing-Simulationen (z. B. Angriffssimulationstraining in Defender for Office 365 Plan 2) einführen.' },
  { id: 'Q14', cat: 'geraete', sev: 'medium', iso: ['A.8.1', 'A.6.7'], nis2: ['21i'], title: 'Gibt es verbindliche Regeln für private Geräte (BYOD), und werden sie technisch durchgesetzt?', help: 'Firmendaten auf unverwalteten Privatgeräten entziehen sich jeder Kontrolle.', fix: 'BYOD-Richtlinie festlegen und mit App-Schutzrichtlinien bzw. bedingtem Zugriff (nur verwaltete Geräte/Apps) durchsetzen.' },
  { id: 'Q15', cat: 'org', sev: 'medium', iso: ['A.5.19', 'A.5.23'], nis2: ['21d'], title: 'Sind Zugriffe externer IT-Dienstleister vertraglich geregelt und technisch auf das Nötige begrenzt (z. B. GDAP)?', help: 'Dienstleister mit dauerhaften Globaladmin-Rechten sind ein Lieferkettenrisiko.', fix: 'Alte DAP-Beziehungen entfernen, GDAP mit minimalen Rollen und Laufzeit nutzen, Zugriffe vertraglich und im Audit-Log nachvollziehen.' },
  { id: 'Q16', cat: 'backup', sev: 'high', iso: ['A.8.13'], nis2: ['21c'], title: 'Werden Exchange-Postfächer, OneDrive, SharePoint und Teams zusätzlich gesichert (Microsoft 365 Backup oder Drittanbieter)?', help: 'Microsoft garantiert die Verfügbarkeit des Dienstes, nicht die Wiederherstellbarkeit Ihrer Daten nach Löschung, Ransomware oder Fehlbedienung (Shared Responsibility).', fix: 'Microsoft 365 Backup oder eine Drittanbieterlösung einführen; Aufbewahrungszeiten festlegen.' },
  { id: 'Q17', cat: 'backup', sev: 'medium', iso: ['A.8.13', 'A.5.30'], nis2: ['21c'], title: 'Wurde in den letzten 12 Monaten eine Wiederherstellung aus der Sicherung erfolgreich getestet?', help: 'Ungetestete Sicherungen versagen oft im Ernstfall.', fix: 'Halbjährlichen Wiederherstellungstest (Postfach, Site, OneDrive) durchführen und dokumentieren.' },
  { id: 'Q18', cat: 'backup', sev: 'medium', iso: ['A.5.29', 'A.5.30'], nis2: ['21c'], title: 'Gibt es einen Notfallplan für den Ausfall von Microsoft 365 oder eine Kompromittierung des Mandanten?', help: 'Im Ernstfall muss klar sein, wie kommuniziert und weitergearbeitet wird.', fix: 'Notfallhandbuch mit alternativen Kommunikationswegen, Kontakten und Wiederanlaufreihenfolge erstellen.' },
  { id: 'Q19', cat: 'purview', sev: 'medium', iso: ['A.5.12', 'A.5.13'], nis2: ['21i'], title: 'Gibt es ein Klassifizierungsschema für Informationen (z. B. öffentlich, intern, vertraulich), das genutzt wird?', help: 'Ohne Klassifizierung lassen sich Schutzmaßnahmen wie Verschlüsselung oder DLP nicht gezielt einsetzen.', fix: 'Schema festlegen und mit Purview-Vertraulichkeitsbezeichnungen technisch umsetzen.' },
  { id: 'Q20', cat: 'purview', sev: 'low', iso: ['A.5.34'], nis2: [], title: 'Sind Auftragsverarbeitung mit Microsoft (DPA) und das Verzeichnis der Verarbeitungstätigkeiten für Microsoft 365 dokumentiert?', help: 'DSGVO-Pflichten (Art. 28 und 30) gelten auch für Cloud-Dienste.', fix: 'Microsoft Products and Services DPA prüfen, Verarbeitungen im Verzeichnis ergänzen, Datenschutz-Folgenabschätzung bei Bedarf.' },
  { id: 'Q21', cat: 'copilot', sev: 'high', iso: ['A.5.15', 'A.8.3'], nis2: ['21i'], title: 'Wurden vor bzw. beim Einsatz von Copilot Berechtigungen und Freigaben in SharePoint und OneDrive auf Übersharing geprüft?', help: 'Copilot findet alles, worauf ein Benutzer Zugriff hat – auch versehentlich zu weit freigegebene Inhalte.', fix: 'Freigaben auswerten (z. B. SharePoint Advanced Management, Data Access Governance), „Jeder“-Links und organisationsweite Freigaben bereinigen.' },
  { id: 'Q22', cat: 'copilot', sev: 'medium', iso: ['A.5.10'], nis2: ['21g'], title: 'Gibt es eine Richtlinie zur Nutzung von KI-Diensten (erlaubte Tools, Umgang mit vertraulichen Daten)?', help: 'Ohne Regeln landen Firmendaten schnell in nicht freigegebenen KI-Diensten (Schatten-KI). Der EU AI Act verlangt zudem KI-Kompetenz der Mitarbeitenden.', fix: 'KI-Nutzungsrichtlinie erstellen, freigegebene Dienste benennen, Mitarbeitende schulen; Nutzung nicht freigegebener Dienste technisch begrenzen.' }
];
export const ANSWERS = [['yes', 'Ja'], ['partial', 'Teilweise'], ['no', 'Nein'], ['na', 'Nicht relevant']];
