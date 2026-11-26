// Datenerfassung: liest alle für die Prüfung nötigen Einstellungen über Microsoft Graph (nur GET)
// und optional die öffentlichen Mail-DNS-Einträge (SPF, DMARC, DKIM, MTA-STS) per DNS-over-HTTPS.
//
// Jede Quelle wird einzeln abgefragt. Fehlt eine Berechtigung, Rolle oder Lizenz, wird das als
// Hinweis festgehalten; die betroffenen Prüfungen erscheinen dann als „nicht prüfbar“.
import * as G from './graph.js';

// Seiten einer Collection holen, mit Obergrenze (Schutz bei sehr großen Mandanten).
async function pages(url, maxPages, onPage) {
  let page = await G.get(url);
  const out = (page && page.value) ? page.value.slice() : [];
  let n = 1;
  while (page && page['@odata.nextLink'] && n < (maxPages || 50)) {
    page = await G.get(page['@odata.nextLink']);
    if (page && page.value) out.push(...page.value);
    n++;
    if (onPage) onPage(out.length);
  }
  if (page && page['@odata.nextLink']) out.truncated = true;
  return out;
}

const MAIL_EXCLUDE = /\.onmicrosoft\.(com|de)$|\.mail\.onmicrosoft\.com$/i;

// key: Ablage im Snapshot (snap.data[key]); label: Anzeige im Fortschritt; perm: benötigte Graph-Berechtigung
export const SOURCES = [
  { key: 'org', label: 'Mandant & Domänen', perm: 'Directory.Read.All', run: async () => {
    const org = (await G.get('/v1.0/organization?$select=id,displayName,verifiedDomains,createdDateTime,countryLetterCode')).value[0] || {};
    return org;
  } },
  { key: 'domains', label: 'Domänen (Kennwortablauf, Maildienste)', perm: 'Directory.Read.All', run: () => pages('/v1.0/domains', 5) },
  { key: 'skus', label: 'Lizenzen', perm: 'Directory.Read.All', run: () => pages('/v1.0/subscribedSkus?$select=skuId,skuPartNumber,capabilityStatus,consumedUnits,prepaidUnits,servicePlans', 5) },
  { key: 'secDefaults', label: 'Sicherheitsstandards (Security Defaults)', perm: 'Policy.Read.All', run: () => G.get('/v1.0/policies/identitySecurityDefaultsEnforcementPolicy') },
  { key: 'ca', label: 'Richtlinien für bedingten Zugriff', perm: 'Policy.Read.All', run: () => pages('/v1.0/identity/conditionalAccess/policies', 10) },
  { key: 'authStrengths', label: 'Authentifizierungsstärken', perm: 'Policy.Read.All', run: () => pages('/v1.0/policies/authenticationStrengthPolicies', 5) },
  { key: 'authMethods', label: 'Authentifizierungsmethoden', perm: 'Policy.Read.All', run: () => G.get('/v1.0/policies/authenticationMethodsPolicy') },
  { key: 'authz', label: 'Autorisierungsrichtlinie (Benutzer- & Gastrechte)', perm: 'Policy.Read.All', run: () => G.get('/v1.0/policies/authorizationPolicy') },
  { key: 'adminConsent', label: 'Workflow für Administratorzustimmung', perm: 'Policy.Read.All', run: () => G.get('/v1.0/policies/adminConsentRequestPolicy') },
  { key: 'groupSettings', label: 'Verzeichniseinstellungen (Gruppen)', perm: 'Directory.Read.All', run: () => pages('/v1.0/groupSettings', 3) },
  { key: 'roleDefs', label: 'Rollendefinitionen', perm: 'RoleManagement.Read.Directory', run: () => pages('/beta/roleManagement/directory/roleDefinitions?$select=id,displayName,templateId,isBuiltIn,isPrivileged', 10) },
  { key: 'roleAssignments', label: 'Rollenzuweisungen (aktiv)', perm: 'RoleManagement.Read.Directory', run: () => pages('/v1.0/roleManagement/directory/roleAssignments?$expand=principal', 50) },
  { key: 'pimEligible', label: 'PIM: berechtigte Zuweisungen', perm: 'RoleManagement.Read.Directory', license: 'Entra ID P2', run: () => pages('/v1.0/roleManagement/directory/roleEligibilitySchedules', 20) },
  { key: 'pimActive', label: 'PIM: aktive Zuweisungszeitpläne', perm: 'RoleManagement.Read.Directory', license: 'Entra ID P2', run: () => pages('/v1.0/roleManagement/directory/roleAssignmentSchedules', 20) },
  { key: 'users', label: 'Benutzer & Gäste (inkl. letzter Anmeldung)', perm: 'Directory.Read.All, AuditLog.Read.All', run: async (p) => {
    const sel = 'id,displayName,userPrincipalName,userType,accountEnabled,onPremisesSyncEnabled,createdDateTime';
    try {
      const u = await pages('/v1.0/users?$top=500&$select=' + sel + ',signInActivity', 200, (n) => p(n + ' gelesen'));
      u.withSignIn = true;
      return u;
    } catch (e) {
      // signInActivity braucht AuditLog.Read.All und Entra ID P1 – ohne geht es mit weniger Details weiter.
      const u = await pages('/v1.0/users?$top=999&$select=' + sel, 200, (n) => p(n + ' gelesen'));
      u.withSignIn = false;
      u.signInError = String(e.message || e);
      return u;
    }
  } },
  { key: 'regDetails', label: 'MFA-Registrierung der Benutzer', perm: 'AuditLog.Read.All', license: 'Entra ID P1', run: (p) => pages('/v1.0/reports/authenticationMethods/userRegistrationDetails', 200, (n) => p(n + ' gelesen')) },
  { key: 'riskyUsers', label: 'Risikobenutzer (Identity Protection)', perm: 'IdentityRiskyUser.Read.All', license: 'Entra ID P2', run: () => pages("/v1.0/identityProtection/riskyUsers?$filter=riskState eq 'atRisk'&$select=id,userPrincipalName,userDisplayName,riskLevel,riskState,riskLastUpdatedDateTime", 10) },
  { key: 'apps', label: 'App-Registrierungen (Geheimnisse & Zertifikate)', perm: 'Directory.Read.All', run: () => pages('/v1.0/applications?$top=999&$select=id,appId,displayName,createdDateTime,passwordCredentials,keyCredentials', 50) },
  { key: 'sps', label: 'Unternehmensanwendungen', perm: 'Directory.Read.All', run: () => pages('/v1.0/servicePrincipals?$top=999&$select=id,appId,displayName,appOwnerOrganizationId,servicePrincipalType,accountEnabled', 100) },
  { key: 'graphSp', label: 'Microsoft-Graph-Berechtigungsdefinitionen', perm: 'Directory.Read.All', run: () => G.get("/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')?$select=id,appRoles,oauth2PermissionScopes") },
  { key: 'graphAssigned', label: 'Anwendungsberechtigungen auf Microsoft Graph', perm: 'Directory.Read.All', run: () => pages("/v1.0/servicePrincipals(appId='00000003-0000-0000-c000-000000000000')/appRoleAssignedTo?$top=999", 50) },
  { key: 'grants', label: 'Delegierte Berechtigungen (Zustimmungen)', perm: 'Directory.Read.All', run: () => pages('/v1.0/oauth2PermissionGrants?$top=999', 50) },
  { key: 'spo', label: 'SharePoint & OneDrive (Freigabe)', perm: 'SharePointTenantSettings.Read.All', run: () => G.get('/v1.0/admin/sharepoint/settings') },
  { key: 'secureScore', label: 'Microsoft Secure Score', perm: 'SecurityEvents.Read.All', run: async () => (await G.get('/v1.0/security/secureScores?$top=1')).value[0] || null },
  { key: 'secureControls', label: 'Secure-Score-Kontrollen (Exchange, Defender, Teams, Purview …)', perm: 'SecurityEvents.Read.All', run: () => pages('/v1.0/security/secureScoreControlProfiles', 20) },
  { key: 'alerts', label: 'Offene Defender-Warnungen', perm: 'SecurityAlert.Read.All', run: async () => {
    // $select wird von alerts_v2 nicht unterstützt; Status getrennt filtern
    const slim = (a) => ({ id: a.id, title: a.title, severity: a.severity, status: a.status, serviceSource: a.serviceSource, createdDateTime: a.createdDateTime });
    const n = await pages("/v1.0/security/alerts_v2?$filter=status eq 'new'&$top=200", 5);
    const p = await pages("/v1.0/security/alerts_v2?$filter=status eq 'inProgress'&$top=200", 5);
    return n.concat(p).map(slim);
  } },
  { key: 'intuneSettings', label: 'Intune-Mandanteneinstellungen', perm: 'DeviceManagementConfiguration.Read.All', run: () => G.get('/v1.0/deviceManagement?$select=id,settings') },
  { key: 'compliance', label: 'Intune-Konformitätsrichtlinien', perm: 'DeviceManagementConfiguration.Read.All', run: () => pages('/v1.0/deviceManagement/deviceCompliancePolicies?$expand=assignments', 10) },
  { key: 'devices', label: 'Verwaltete Geräte (Zusammenfassung)', perm: 'DeviceManagementManagedDevices.Read.All', run: (p) => pages('/v1.0/deviceManagement/managedDevices?$top=999&$select=id,operatingSystem,complianceState,isEncrypted,lastSyncDateTime,managedDeviceOwnerType', 100, (n) => p(n + ' gelesen')) },
  { key: 'backup', label: 'Microsoft 365 Backup', perm: 'BackupRestore-Configuration.Read.All', run: () => G.get('/v1.0/solutions/backupRestore') }
];

// Fehler verständlich beschreiben
export function describeError(e, src) {
  const st = e && e.status;
  const code = (e && e.code) || '';
  const msg = String((e && e.message) || e || '');
  if (st === 403 || st === 401) {
    if (/licen|premium|P1|P2|not.*(subscri|enabled)|AadPremium/i.test(msg + code)) return { status: st, kind: 'license', text: 'Lizenz fehlt' + (src.license ? ' (' + src.license + ')' : '') + ': ' + msg };
    return { status: st, kind: 'permission', text: 'Keine Berechtigung (' + st + '): Graph-Recht ' + (src.perm || '?') + ' bzw. passende Rolle (z. B. Globaler Leser) fehlt.' };
  }
  if (st === 400 && /licen|premium|tenant.*not|not.*license/i.test(msg)) return { status: st, kind: 'license', text: 'Lizenz fehlt' + (src.license ? ' (' + src.license + ')' : '') + ': ' + msg };
  if (st === 404) return { status: st, kind: 'unavailable', text: 'Im Mandanten nicht vorhanden bzw. nicht eingerichtet (404).' };
  return { status: st || 0, kind: 'error', text: (st ? 'HTTP ' + st + ': ' : '') + msg };
}

// ---------------------------------------------------------------------------
// DNS (DNS-over-HTTPS, öffentlich)
// ---------------------------------------------------------------------------
const DOH = 'https://cloudflare-dns.com/dns-query';
export async function doh(name, type, fetchImpl) {
  const f = fetchImpl || fetch;
  const r = await f(DOH + '?name=' + encodeURIComponent(name) + '&type=' + type, { headers: { Accept: 'application/dns-json' } });
  if (!r.ok) throw new Error('DNS-Abfrage fehlgeschlagen (' + r.status + ')');
  const j = await r.json();
  return { status: j.Status, answers: (j.Answer || []).map((a) => ({ type: a.type, data: String(a.data || '') })) };
}
const txtJoin = (d) => d.replace(/^"|"$/g, '').replace(/"\s+"/g, '');

export async function checkMailDomain(domain, fetchImpl) {
  const q = (n, t) => doh(n, t, fetchImpl).catch((e) => ({ error: String(e.message || e), answers: [] }));
  const [mx, txt, dmarc, s1, s2, sts] = await Promise.all([
    q(domain, 'MX'), q(domain, 'TXT'), q('_dmarc.' + domain, 'TXT'), q('selector1._domainkey.' + domain, 'TXT'), q('selector2._domainkey.' + domain, 'TXT'), q('_mta-sts.' + domain, 'TXT')
  ]);
  const txts = (r) => r.answers.filter((a) => a.type === 16).map((a) => txtJoin(a.data));
  const cname = (r) => (r.answers.find((a) => a.type === 5) || {}).data || '';
  const dk = (r) => ({ cname: cname(r).replace(/\.$/, ''), key: txts(r).some((t) => /v=DKIM1|p=/i.test(t)) });
  return {
    domain,
    error: [mx, txt, dmarc].some((r) => r.error) ? (mx.error || txt.error || dmarc.error) : '',
    mx: mx.answers.filter((a) => a.type === 15).map((a) => a.data.replace(/\.$/, '')),
    spf: txts(txt).filter((t) => /^v=spf1/i.test(t)),
    dmarc: txts(dmarc).filter((t) => /^v=DMARC1/i.test(t)),
    dkim: [dk(s1), dk(s2)],
    mtaSts: txts(sts).filter((t) => /^v=STSv1/i.test(t))
  };
}

export function mailDomains(domains) {
  return (domains || []).filter((d) => d.isVerified && (d.supportedServices || []).includes('Email') && !MAIL_EXCLUDE.test(d.id)).map((d) => d.id);
}

// ---------------------------------------------------------------------------
// Gesamter Scan
// ---------------------------------------------------------------------------
export async function scanTenant(onProgress, opts) {
  const o = opts || {};
  const snap = { tool: 'm365-security-check', format: 1, scannedAt: new Date().toISOString(), tenant: {}, data: {}, errors: {}, dns: null, warnings: [] };
  const tick = (key, label, state, info) => onProgress && onProgress({ key, label, state, info });

  // Grunddaten zuerst (für Mandantennamen), danach parallel in kleinen Gruppen
  const runOne = async (src) => {
    tick(src.key, src.label, 'running', '');
    try {
      const v = await src.run((info) => tick(src.key, src.label, 'running', info));
      snap.data[src.key] = v;
      if (v && v.truncated) snap.warnings.push({ source: src.label, message: 'Sehr viele Einträge – es wurde nur ein Teil gelesen.' });
      if (src.key === 'users' && v && v.withSignIn === false) snap.warnings.push({ source: src.label, message: 'Letzte Anmeldung nicht lesbar (AuditLog.Read.All bzw. Entra ID P1 fehlt) – Inaktivitätsprüfungen entfallen.' });
      const n = Array.isArray(v) ? v.length : (v ? 1 : 0);
      tick(src.key, src.label, 'done', Array.isArray(v) ? n + ' Einträge' : 'gelesen');
    } catch (e) {
      const d = describeError(e, src);
      snap.errors[src.key] = d;
      if (d.kind !== 'unavailable') snap.warnings.push({ source: src.label, message: d.text });
      tick(src.key, src.label, 'error', d.kind === 'license' ? 'Lizenz fehlt' : d.kind === 'permission' ? 'keine Berechtigung' : d.kind === 'unavailable' ? 'nicht eingerichtet' : 'Fehler');
    }
  };
  await runOne(SOURCES[0]);
  const rest = SOURCES.slice(1);
  for (let i = 0; i < rest.length; i += 4) await Promise.all(rest.slice(i, i + 4).map(runOne));

  const org = snap.data.org || {};
  const vd = org.verifiedDomains || [];
  snap.tenant = {
    id: org.id || '',
    displayName: org.displayName || '',
    domain: ((vd.find((d) => d.isDefault) || vd[0] || {}).name) || '',
    initialDomain: ((vd.find((d) => d.isInitial) || {}).name) || ''
  };

  if (o.dns !== false) {
    const doms = mailDomains(snap.data.domains);
    tick('dns', 'Mail-DNS (SPF, DKIM, DMARC, MTA-STS)', 'running', doms.length + ' Domänen');
    try {
      snap.dns = [];
      for (const d of doms.slice(0, 40)) snap.dns.push(await checkMailDomain(d));
      if (doms.length > 40) snap.warnings.push({ source: 'Mail-DNS', message: 'Nur die ersten 40 Maildomänen wurden geprüft.' });
      tick('dns', 'Mail-DNS (SPF, DKIM, DMARC, MTA-STS)', 'done', doms.length + ' Domänen');
    } catch (e) {
      snap.dns = null;
      snap.warnings.push({ source: 'Mail-DNS', message: 'DNS-Abfrage nicht möglich: ' + (e.message || e) });
      tick('dns', 'Mail-DNS (SPF, DKIM, DMARC, MTA-STS)', 'error', 'nicht erreichbar');
    }
  }
  return snap;
}
