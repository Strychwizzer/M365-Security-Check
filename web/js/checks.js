// Prüfkatalog und Bewertung.
//
// Jede Prüfung liest ausschließlich aus dem Snapshot (snap.data / snap.dns) und liefert
// { status: pass|warn|fail|info|na, summary, head?, rows?, note? }.
// Fehlen die nötigen Daten (Berechtigung, Rolle, Lizenz), wird die Prüfung als „nicht prüfbar“ geführt.
import { CATEGORIES, QUESTIONS, WEIGHT, LICENSES } from './catalog.js';

const DAY = 86400000;
const now = () => Date.now();
const days = (iso) => iso ? Math.floor((now() - Date.parse(iso)) / DAY) : null;
const fmtD = (iso) => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const plural = (n, s, p) => n + ' ' + (n === 1 ? s : p);

// ---------------------------------------------------------------------------
// Rollen
// ---------------------------------------------------------------------------
export const GA = '62e90394-69f5-4237-9190-012177145e10';
// Hochprivilegierte Rollen (Vorlagen-IDs), angelehnt an Microsoft- und CISA-Empfehlungen
export const PRIV_ROLES = {
  '62e90394-69f5-4237-9190-012177145e10': 'Globaler Administrator',
  'e8611ab8-c189-46e8-94e1-60213ab1f814': 'Administrator für privilegierte Rollen',
  '7be44c8a-adaf-4e2a-84d6-ab2649e08a13': 'Administrator für privilegierte Authentifizierung',
  '194ae4cb-b126-40b2-bd5b-6091b380977d': 'Sicherheitsadministrator',
  'b1be1c3e-b65d-4f19-8427-f6fa0d97feb9': 'Administrator für bedingten Zugriff',
  '29232cdf-9323-42fd-ade2-1d097af3e4de': 'Exchange-Administrator',
  'f28a1f50-f6e7-4571-818b-6a12f2af6b6c': 'SharePoint-Administrator',
  'fe930be7-5e62-47db-91af-98c3a49a38b1': 'Benutzeradministrator',
  '9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3': 'Anwendungsadministrator',
  '158c047a-c907-4556-b7ef-446551a6b5f7': 'Cloudanwendungsadministrator',
  'c4e39bd9-1100-46d3-8c65-fb160da0071f': 'Authentifizierungsadministrator',
  '729827e3-9c14-49f7-bb1b-9608f156bbb8': 'Helpdeskadministrator',
  'b0f54661-2d74-4c50-afa3-1ec803f12efe': 'Abrechnungsadministrator',
  '8ac3fc64-6eca-42ea-9e69-59f4c7b60eb2': 'Administrator für Hybrididentität',
  '3a2c62db-5318-420d-8d74-23affee5d9d5': 'Intune-Administrator',
  '69091246-20e8-4a56-aa4d-066075b2a7a8': 'Teams-Administrator'
};
const PHISH_RESISTANT = '00000000-0000-0000-0000-000000000004';
const AZURE_MGMT = '797f4846-ba00-4fd7-ba43-dac1f8f63013';
const MS_TENANTS = new Set(['f8cdef31-a31e-4b4a-93e4-5f571e91255a', '72f988bf-86f1-41af-91ab-2d7cd011db47']);
const GUEST_ROLE = { 'a0b1b346-4d3e-4e8b-98f8-753987be4970': 'same', '10dae51f-b6af-4016-8d66-8c2a99b929b3': 'limited', '2af84b1e-32c8-42b7-82bc-daa82404023b': 'restricted' };
const HIGH_APP_PERMS = new Set(['Directory.ReadWrite.All', 'RoleManagement.ReadWrite.Directory', 'AppRoleAssignment.ReadWrite.All', 'Application.ReadWrite.All', 'User.ReadWrite.All', 'Group.ReadWrite.All', 'GroupMember.ReadWrite.All', 'Mail.ReadWrite', 'Mail.Read', 'Mail.Send', 'MailboxSettings.ReadWrite', 'Files.ReadWrite.All', 'Files.Read.All', 'Sites.ReadWrite.All', 'Sites.Read.All', 'Sites.FullControl.All', 'Sites.Manage.All', 'Policy.ReadWrite.ConditionalAccess', 'UserAuthenticationMethod.ReadWrite.All', 'Domain.ReadWrite.All', 'DeviceManagementConfiguration.ReadWrite.All', 'DeviceManagementManagedDevices.PrivilegedOperations.All', 'Chat.Read.All', 'ChannelMessage.Read.All', 'Calendars.ReadWrite', 'Contacts.ReadWrite']);
const HIGH_DELEGATED = /^(Mail\.(Read|ReadWrite|Send)(\.Shared)?|Files\.ReadWrite\.All|Files\.Read\.All|Sites\.(ReadWrite|FullControl|Manage)\.All|Directory\.ReadWrite\.All|User\.ReadWrite\.All|Group\.ReadWrite\.All|RoleManagement\.ReadWrite\.Directory|Application\.ReadWrite\.All|full_access_as_user|EWS\.AccessAsUser\.All|Calendars\.ReadWrite|Chat\.ReadWrite)$/;

// ---------------------------------------------------------------------------
// Kontext: aufbereitete Daten, die mehrere Prüfungen nutzen
// ---------------------------------------------------------------------------
export function buildContext(snap, extra) {
  const d = snap.data || {};
  const ctx = { snap, d, err: snap.errors || {}, answers: (extra && extra.answers) || {} };
  // Lizenzen
  const plans = new Set();
  const skus = (d.skus || []).filter((s) => s.capabilityStatus !== 'Deleted' && ((s.prepaidUnits || {}).enabled || 0) > 0);
  for (const s of skus) for (const p of s.servicePlans || []) if (p.appliesTo !== 'Company' || true) plans.add(p.servicePlanName);
  ctx.lic = {};
  ctx.licKnown = !!d.skus;
  for (const l of LICENSES) ctx.lic[l.key] = [...plans].some((p) => l.plans.some((rx) => rx.test(p))) || (l.sku ? skus.some((s) => l.sku.test(s.skuPartNumber)) : false);
  ctx.copilotSeats = skus.filter((s) => /COPILOT/i.test(s.skuPartNumber)).reduce((a, s) => ({ total: a.total + ((s.prepaidUnits || {}).enabled || 0), used: a.used + (s.consumedUnits || 0) }), { total: 0, used: 0 });
  // Benutzer
  ctx.users = d.users || null;
  ctx.userById = new Map((d.users || []).map((u) => [u.id, u]));
  ctx.withSignIn = !!(d.users && d.users.withSignIn);
  // Rollen
  const defs = d.roleDefs || [];
  ctx.roleName = (id) => { const x = defs.find((r) => r.id === id || r.templateId === id); return (x && x.displayName) || PRIV_ROLES[id] || id; };
  ctx.isPrivRole = (id) => !!PRIV_ROLES[id] || defs.some((r) => (r.id === id || r.templateId === id) && r.isPrivileged);
  const princType = (p) => String((p && p['@odata.type']) || '').replace('#microsoft.graph.', '');
  ctx.assign = (d.roleAssignments || []).map((a) => ({ roleId: a.roleDefinitionId, principalId: a.principalId, type: princType(a.principal) || (ctx.userById.has(a.principalId) ? 'user' : ''), name: (a.principal && (a.principal.displayName || a.principal.userPrincipalName)) || a.principalId, upn: (a.principal && a.principal.userPrincipalName) || '', kind: 'aktiv', scope: a.directoryScopeId }));
  ctx.eligible = (d.pimEligible || []).map((a) => { const u = ctx.userById.get(a.principalId); return { roleId: a.roleDefinitionId, principalId: a.principalId, type: u ? 'user' : '', name: u ? (u.displayName || u.userPrincipalName) : a.principalId, upn: u ? u.userPrincipalName : '', kind: 'berechtigt (PIM)' }; });
  ctx.privAll = ctx.assign.concat(ctx.eligible).filter((a) => ctx.isPrivRole(a.roleId));
  // Bedingter Zugriff
  ctx.ca = d.ca || null;
  ctx.caEnabled = (d.ca || []).filter((p) => p.state === 'enabled');
  ctx.sd = d.secDefaults ? !!d.secDefaults.isEnabled : null;
  ctx.strengths = new Map((d.authStrengths || []).map((s) => [s.id, s]));
  // Secure Score
  const ss = d.secureScore;
  ctx.secureScore = ss ? { current: ss.currentScore, max: ss.maxScore, pct: pct(ss.currentScore, ss.maxScore), date: ss.createdDateTime, avg: ((ss.averageComparativeScores || []).find((x) => x.basis === 'AllTenants') || {}).averageScore, avgSeats: ((ss.averageComparativeScores || []).find((x) => x.basis === 'TotalSeats') || {}).averageScore } : null;
  return ctx;
}

// --- CA-Helfer ---
const gc = (p) => p.grantControls || {};
const built = (p) => gc(p).builtInControls || [];
const strengthOf = (p) => gc(p).authenticationStrength || null;
const cond = (p) => p.conditions || {};
const usersOf = (p) => cond(p).users || {};
const isAllUsers = (p) => (usersOf(p).includeUsers || []).includes('All');
const isAllApps = (p) => ((cond(p).applications || {}).includeApplications || []).includes('All');
const clientsOk = (p) => { const c = cond(p).clientAppTypes || []; return !c.length || c.includes('all') || (c.includes('browser') && c.includes('mobileAppsAndDesktopClients')); };
const unconditional = (p) => {
  const c = cond(p);
  if ((c.signInRiskLevels || []).length || (c.userRiskLevels || []).length) return false;
  if (c.platforms && (c.platforms.includePlatforms || []).length && !(c.platforms.includePlatforms || []).includes('all')) return false;
  if (c.locations && (c.locations.includeLocations || []).length && !(c.locations.includeLocations || []).includes('All')) return false;
  return true;
};
const requiresMfa = (p) => {
  const b = built(p);
  if (!b.includes('mfa') && !strengthOf(p)) return false;
  if ((gc(p).operator || 'OR') === 'OR' && b.some((x) => x !== 'mfa')) return false; // MFA ODER konformes Gerät = kein strikter MFA-Zwang
  return true;
};
const isBlock = (p) => built(p).includes('block');
const targetsRole = (p, role) => (usersOf(p).includeRoles || []).includes(role);
const exclusions = (p) => { const u = usersOf(p); return (u.excludeUsers || []).length + (u.excludeGroups || []).length + (u.excludeRoles || []).length + (u.excludeGuestsOrExternalUsers ? 1 : 0); };
const caRow = (p) => [p.displayName, p.state === 'enabled' ? 'Aktiv' : p.state === 'enabledForReportingButNotEnforced' ? 'Nur Bericht' : 'Aus', exclusions(p) ? plural(exclusions(p), 'Ausnahme', 'Ausnahmen') : '—'];
const CA_HEAD = ['Richtlinie', 'Status', 'Ausnahmen'];
function isPhishResistant(ctx, p) {
  const s = strengthOf(p);
  if (!s) return false;
  if (s.id === PHISH_RESISTANT) return true;
  const full = ctx.strengths.get(s.id) || s;
  const combos = full.allowedCombinations || [];
  return combos.length > 0 && combos.every((c) => /^(fido2|windowsHelloForBusiness|x509CertificateMultiFactor|passkey)/i.test(c));
}
function mfaAllUsersPolicies(ctx, state) {
  return (ctx.ca || []).filter((p) => p.state === state && requiresMfa(p) && isAllUsers(p) && isAllApps(p) && clientsOk(p) && unconditional(p));
}
const methodCfg = (ctx, id) => (((ctx.d.authMethods || {}).authenticationMethodConfigurations) || []).find((m) => String(m.id).toLowerCase() === id.toLowerCase());

const na = (text) => ({ status: 'na', summary: text });
function needs(ctx, keys) {
  for (const k of keys) {
    if (ctx.d[k] === undefined || ctx.d[k] === null) {
      const e = ctx.err[k];
      if (k === 'secureScore' && ctx.d.secureScore === null && !e) return 'Für diesen Mandanten liegt noch kein Secure Score vor.';
      return 'Nicht prüfbar: ' + (e ? e.text : 'Daten wurden nicht gelesen.');
    }
  }
  return '';
}
const userLabel = (u) => u ? (u.displayName ? u.displayName + (u.userPrincipalName ? ' (' + u.userPrincipalName + ')' : '') : u.userPrincipalName || u.id) : '';
const lastSignIn = (u) => { const s = u.signInActivity || {}; return s.lastSuccessfulSignInDateTime || s.lastSignInDateTime || s.lastNonInteractiveSignInDateTime || null; };

// ---------------------------------------------------------------------------
// Prüfungen
// ---------------------------------------------------------------------------
// Felder: id, cat, sev, title, why, fix, effort (low|medium|high), lic (Lizenzschlüssel), iso, nis2, ref, needs, run(ctx)
export const CHECKS = [
  // ----- Identität & Anmeldung -----
  { id: 'ID-01', cat: 'identitaet', sev: 'high', title: 'MFA-Grundschutz ist aktiv (Sicherheitsstandards oder bedingter Zugriff)', effort: 'low', iso: ['A.8.5', 'A.5.17'], nis2: ['21j'],
    why: 'Laut Microsoft verhindert MFA über 99 % der automatisierten Angriffe auf Konten. Ohne MFA-Grundschutz reicht ein erbeutetes Kennwort.',
    fix: 'Mit Entra ID P1: Richtlinie für bedingten Zugriff „MFA für alle Benutzer“ aktivieren. Ohne P1: Sicherheitsstandards (Security Defaults) einschalten – Entra Admin Center › Übersicht › Eigenschaften › Sicherheitsstandards verwalten.',
    ref: 'https://learn.microsoft.com/entra/fundamentals/security-defaults', needs: ['secDefaults'],
    run(ctx) {
      if (ctx.sd) return { status: 'pass', summary: 'Sicherheitsstandards (Security Defaults) sind aktiviert.' };
      if (!ctx.ca) return { status: 'fail', summary: 'Sicherheitsstandards sind deaktiviert, und Richtlinien für bedingten Zugriff konnten nicht gelesen werden.' };
      const pols = mfaAllUsersPolicies(ctx, 'enabled');
      if (pols.length) return { status: 'pass', summary: 'MFA wird per bedingtem Zugriff für alle Benutzer erzwungen.', head: CA_HEAD, rows: pols.map(caRow) };
      const any = ctx.caEnabled.filter(requiresMfa);
      if (any.length) return { status: 'warn', summary: 'Sicherheitsstandards sind aus; MFA wird nur durch einzelne Richtlinien für Teilbereiche erzwungen.', head: CA_HEAD, rows: any.map(caRow) };
      return { status: 'fail', summary: 'Weder Sicherheitsstandards noch eine aktive MFA-Richtlinie im bedingten Zugriff gefunden.' };
    } },
  { id: 'ID-02', cat: 'identitaet', sev: 'high', title: 'MFA wird für alle Benutzer bei jeder Anmeldung erzwungen', effort: 'low', lic: 'P1', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Sicherheitsstandards fordern MFA nur situationsabhängig. Eine Richtlinie für bedingten Zugriff erzwingt MFA für alle Benutzer, alle Apps und alle Clients – mit gezielten Ausnahmen für Notfallkonten.',
    fix: 'Richtlinie für bedingten Zugriff anlegen: Alle Benutzer (Notfallkonten ausnehmen), alle Ressourcen, Gewähren › Authentifizierungsstärke „Multi-Faktor-Authentifizierung“. Zuerst im Berichtsmodus testen.',
    ref: 'https://learn.microsoft.com/entra/identity/conditional-access/policy-all-users-mfa-strength', needs: ['secDefaults'],
    run(ctx) {
      if (!ctx.ca) return ctx.sd ? { status: 'warn', summary: 'Sicherheitsstandards sind aktiv; MFA wird damit nur situationsabhängig abgefragt. Bedingter Zugriff ist nicht verfügbar (Entra ID P1 erforderlich).' } : na(needs(ctx, ['ca']));
      const pols = mfaAllUsersPolicies(ctx, 'enabled');
      if (pols.length) {
        const ex = pols.every((p) => exclusions(p) > 5);
        return { status: ex ? 'warn' : 'pass', summary: ex ? 'Richtlinie vorhanden, aber mit vielen Ausnahmen – Ausnahmen prüfen.' : 'Aktive Richtlinie erzwingt MFA für alle Benutzer und alle Apps.', head: CA_HEAD, rows: pols.map(caRow) };
      }
      const ro = mfaAllUsersPolicies(ctx, 'enabledForReportingButNotEnforced');
      if (ro.length) return { status: 'warn', summary: 'Passende Richtlinie existiert nur im Berichtsmodus und wird nicht durchgesetzt.', head: CA_HEAD, rows: ro.map(caRow) };
      if (ctx.sd) return { status: 'warn', summary: 'Nur Sicherheitsstandards aktiv – MFA wird damit nicht bei jeder Anmeldung erzwungen.' };
      return { status: 'fail', summary: 'Keine Richtlinie, die MFA für alle Benutzer und alle Apps erzwingt.' };
    } },
  { id: 'ID-03', cat: 'identitaet', sev: 'high', title: 'Legacy-Authentifizierung ist blockiert', effort: 'low', lic: 'P1', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Alte Protokolle (POP, IMAP, SMTP-Auth, EAS mit Basic Auth) können kein MFA und sind das bevorzugte Ziel von Password-Spray-Angriffen.',
    fix: 'Richtlinie für bedingten Zugriff: Alle Benutzer, alle Ressourcen, Client-Apps „Exchange ActiveSync-Clients“ und „Andere Clients“ › Zugriff blockieren.',
    ref: 'https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication', needs: ['secDefaults'],
    run(ctx) {
      if (ctx.sd) return { status: 'pass', summary: 'Durch Sicherheitsstandards blockiert.' };
      if (!ctx.ca) return na(needs(ctx, ['ca']));
      const ok = (p) => isBlock(p) && isAllUsers(p) && isAllApps(p) && (cond(p).clientAppTypes || []).includes('exchangeActiveSync') && (cond(p).clientAppTypes || []).includes('other');
      const on = ctx.ca.filter((p) => p.state === 'enabled' && ok(p));
      if (on.length) return { status: 'pass', summary: 'Legacy-Authentifizierung wird per bedingtem Zugriff blockiert.', head: CA_HEAD, rows: on.map(caRow) };
      const ro = ctx.ca.filter((p) => p.state === 'enabledForReportingButNotEnforced' && ok(p));
      if (ro.length) return { status: 'warn', summary: 'Sperr-Richtlinie existiert nur im Berichtsmodus.', head: CA_HEAD, rows: ro.map(caRow) };
      return { status: 'fail', summary: 'Keine Richtlinie blockiert Legacy-Authentifizierung.' };
    } },
  { id: 'ID-04', cat: 'identitaet', sev: 'medium', title: 'Mindestens 95 % der Benutzer haben MFA registriert', effort: 'medium', lic: 'P1', iso: ['A.8.5', 'A.5.17'], nis2: ['21j'],
    why: 'Benutzer ohne registrierte MFA-Methode können bei einer Kontoübernahme vom Angreifer „registriert“ werden.',
    fix: 'Registrierungskampagne für Microsoft Authenticator aktivieren (Entra › Authentifizierungsmethoden › Registrierungskampagne) und Registrierung per bedingtem Zugriff nur aus vertrauenswürdigen Umgebungen zulassen.',
    needs: ['regDetails'],
    run(ctx) {
      const all = (ctx.d.regDetails || []).filter((r) => (r.userType || 'member') === 'member');
      if (!all.length) return { status: 'info', summary: 'Keine Registrierungsdaten vorhanden.' };
      const reg = all.filter((r) => r.isMfaRegistered).length;
      const p = pct(reg, all.length);
      const missing = all.filter((r) => !r.isMfaRegistered);
      return { status: p >= 95 ? 'pass' : p >= 80 ? 'warn' : 'fail', summary: p + ' % der aktiven Mitglieder haben MFA registriert (' + reg + ' von ' + all.length + ').', metric: p + ' %',
        head: ['Benutzer ohne MFA-Registrierung', 'Admin'], rows: missing.slice(0, 200).map((r) => [r.userDisplayName ? r.userDisplayName + ' (' + r.userPrincipalName + ')' : r.userPrincipalName, r.isAdmin ? 'Ja' : '']), more: Math.max(0, missing.length - 200) };
    } },
  { id: 'ID-05', cat: 'identitaet', sev: 'medium', title: 'SMS und Sprachanruf sind als Anmeldemethode deaktiviert', effort: 'medium', iso: ['A.8.5'], nis2: ['21j'],
    why: 'SMS und Anrufe lassen sich durch SIM-Swapping und Phishing-Proxys abfangen. Microsoft Authenticator mit Nummernabgleich oder Passkeys sind deutlich sicherer.',
    fix: 'Benutzer auf Microsoft Authenticator oder Passkeys umstellen, danach SMS und Sprachanruf unter Entra › Authentifizierungsmethoden › Richtlinien deaktivieren.',
    needs: ['authMethods'],
    run(ctx) {
      const on = ['Sms', 'Voice'].filter((id) => (methodCfg(ctx, id) || {}).state === 'enabled');
      if (!on.length) return { status: 'pass', summary: 'SMS und Sprachanruf sind deaktiviert.' };
      return { status: 'warn', summary: 'Aktiviert: ' + on.map((x) => x === 'Sms' ? 'SMS' : 'Sprachanruf').join(', ') + '.' };
    } },
  { id: 'ID-06', cat: 'identitaet', sev: 'low', title: 'Passkeys (FIDO2) sind als Methode verfügbar', effort: 'low', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Passkeys sind phishing-resistent und die Grundlage für passwortlose Anmeldung – besonders für Administratoren.',
    fix: 'Entra › Authentifizierungsmethoden › Richtlinien › Passkey (FIDO2) aktivieren, zunächst für Administratoren.',
    needs: ['authMethods'],
    run(ctx) { const m = methodCfg(ctx, 'Fido2'); return m && m.state === 'enabled' ? { status: 'pass', summary: 'Passkeys (FIDO2) sind aktiviert.' } : { status: 'fail', summary: 'Passkeys (FIDO2) sind nicht aktiviert.' }; } },
  { id: 'ID-07', cat: 'identitaet', sev: 'medium', title: 'Microsoft Authenticator ist als Methode aktiviert', effort: 'low', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Der Authenticator mit Nummernabgleich ist die empfohlene Standardmethode für MFA.',
    fix: 'Entra › Authentifizierungsmethoden › Richtlinien › Microsoft Authenticator für alle Benutzer aktivieren.',
    needs: ['authMethods'],
    run(ctx) { const m = methodCfg(ctx, 'MicrosoftAuthenticator'); return m && m.state === 'enabled' ? { status: 'pass', summary: 'Microsoft Authenticator ist aktiviert.' } : { status: 'fail', summary: 'Microsoft Authenticator ist nicht aktiviert.' }; } },
  { id: 'ID-08', cat: 'identitaet', sev: 'low', title: 'Kennwörter laufen nicht regelmäßig ab', effort: 'low', iso: ['A.5.17'], nis2: ['21j'],
    why: 'Erzwungene Kennwortwechsel führen zu schwächeren, vorhersehbaren Kennwörtern. Microsoft und BSI empfehlen bei MFA keinen periodischen Wechsel.',
    fix: 'Microsoft 365 Admin Center › Einstellungen › Organisationseinstellungen › Sicherheit & Datenschutz › Kennwortablaufrichtlinie: „Kennwörter laufen nie ab“.',
    needs: ['domains'],
    run(ctx) {
      const doms = (ctx.d.domains || []).filter((x) => x.isVerified && x.authenticationType !== 'Federated' && x.passwordValidityPeriodInDays && x.passwordValidityPeriodInDays < 2147483647);
      return doms.length ? { status: 'warn', summary: plural(doms.length, 'Domäne erzwingt', 'Domänen erzwingen') + ' einen Kennwortablauf.', head: ['Domäne', 'Ablauf nach'], rows: doms.map((x) => [x.id, x.passwordValidityPeriodInDays + ' Tagen']) } : { status: 'pass', summary: 'Kein erzwungener Kennwortablauf.' };
    } },
  { id: 'ID-09', cat: 'zugriff', sev: 'medium', title: 'Risikobasierter bedingter Zugriff (Anmelde- und Benutzerrisiko)', effort: 'medium', lic: 'P2', iso: ['A.8.5', 'A.8.16'], nis2: ['21j', '21b'],
    why: 'Identity Protection erkennt z. B. Anmeldungen aus dem Darknet bekannter Kennwörter, unmögliche Reisen oder Token-Diebstahl und kann automatisch MFA oder einen Kennwortwechsel verlangen.',
    fix: 'Zwei Richtlinien für bedingten Zugriff: Anmelderisiko „mittel/hoch“ › MFA verlangen; Benutzerrisiko „hoch“ › sichere Kennwortänderung verlangen.',
    ref: 'https://learn.microsoft.com/entra/id-protection/howto-identity-protection-configure-risk-policies', needs: ['ca'],
    run(ctx) {
      const sign = ctx.caEnabled.filter((p) => (cond(p).signInRiskLevels || []).length);
      const user = ctx.caEnabled.filter((p) => (cond(p).userRiskLevels || []).length);
      const lic = ctx.lic.P2 ? '' : ' Entra ID P2 ist im Mandanten nicht lizenziert.';
      if (sign.length && user.length) return { status: 'pass', summary: 'Richtlinien für Anmelde- und Benutzerrisiko sind aktiv.', head: CA_HEAD, rows: sign.concat(user).map(caRow) };
      if (sign.length || user.length) return { status: 'warn', summary: 'Nur ' + (sign.length ? 'Anmelderisiko' : 'Benutzerrisiko') + ' wird ausgewertet.' + lic, head: CA_HEAD, rows: sign.concat(user).map(caRow) };
      return { status: 'fail', summary: 'Keine risikobasierten Richtlinien.' + lic };
    } },

  // ----- Bedingter Zugriff -----
  { id: 'CA-01', cat: 'zugriff', sev: 'high', title: 'MFA ist für alle Administratorrollen erzwungen', effort: 'low', lic: 'P1', iso: ['A.8.2', 'A.8.5'], nis2: ['21j', '21i'],
    why: 'Administratorkonten sind das wertvollste Ziel. Ein einziges kompromittiertes Adminkonto bedeutet den Verlust des gesamten Mandanten.',
    fix: 'Richtlinie für bedingten Zugriff „MFA für Administratoren“ mit allen privilegierten Verzeichnisrollen anlegen (Vorlage im Entra Admin Center).',
    needs: ['secDefaults'],
    run(ctx) {
      if (ctx.sd) return { status: 'pass', summary: 'Durch Sicherheitsstandards für Administratoren erzwungen.' };
      if (!ctx.ca) return na(needs(ctx, ['ca']));
      const all = mfaAllUsersPolicies(ctx, 'enabled');
      const adm = ctx.caEnabled.filter((p) => requiresMfa(p) && targetsRole(p, GA) && isAllApps(p));
      const hit = all.concat(adm);
      return hit.length ? { status: 'pass', summary: 'MFA für Administratoren ist erzwungen.', head: CA_HEAD, rows: hit.map(caRow) } : { status: 'fail', summary: 'Keine aktive Richtlinie erzwingt MFA für Administratoren.' };
    } },
  { id: 'CA-02', cat: 'zugriff', sev: 'medium', title: 'Phishing-resistente MFA für Administratoren', effort: 'medium', lic: 'P1', iso: ['A.8.2', 'A.8.5'], nis2: ['21j'],
    why: 'Phishing-Proxys (Adversary-in-the-Middle) umgehen klassische MFA. Passkeys, Windows Hello for Business oder Zertifikate sind dagegen immun.',
    fix: 'Richtlinie für bedingten Zugriff auf Administratorrollen mit Authentifizierungsstärke „Phishing-resistente MFA“; Admins vorher mit Passkeys ausstatten.',
    ref: 'https://learn.microsoft.com/entra/identity/conditional-access/policy-admin-phish-resistant-mfa', needs: ['ca'],
    run(ctx) {
      const hit = ctx.caEnabled.filter((p) => isPhishResistant(ctx, p) && (targetsRole(p, GA) || isAllUsers(p)));
      return hit.length ? { status: 'pass', summary: 'Phishing-resistente MFA für Administratoren ist erzwungen.', head: CA_HEAD, rows: hit.map(caRow) } : { status: 'fail', summary: 'Keine Richtlinie verlangt phishing-resistente MFA für Administratoren.' };
    } },
  { id: 'CA-03', cat: 'zugriff', sev: 'medium', title: 'Zugriff nur von konformen bzw. verwalteten Geräten', effort: 'high', lic: 'INTUNE', iso: ['A.8.1', 'A.5.15'], nis2: ['21i'],
    why: 'Ohne Geräteanforderung reicht ein gestohlenes Kennwort samt MFA-Token, um von jedem beliebigen Gerät auf Firmendaten zuzugreifen.',
    fix: 'Geräte in Intune registrieren und Konformitätsrichtlinien zuweisen; dann Richtlinie für bedingten Zugriff „Konformes Gerät erforderlich“ (für mobile Geräte alternativ „App-Schutzrichtlinie erforderlich“).',
    needs: ['ca'],
    run(ctx) {
      const hit = ctx.caEnabled.filter((p) => built(p).some((b) => b === 'compliantDevice' || b === 'domainJoinedDevice' || b === 'compliantApplication'));
      if (!hit.length) return { status: 'fail', summary: 'Keine Richtlinie verlangt konforme oder verwaltete Geräte.' };
      const broad = hit.some((p) => isAllUsers(p) && isAllApps(p));
      return { status: broad ? 'pass' : 'warn', summary: broad ? 'Konforme/verwaltete Geräte werden für alle Benutzer verlangt.' : 'Gerätebedingung nur für Teilbereiche (Gruppen oder einzelne Apps).', head: CA_HEAD, rows: hit.map(caRow) };
    } },
  { id: 'CA-04', cat: 'zugriff', sev: 'medium', title: 'Notfallzugriffskonto ist von den Richtlinien ausgenommen', effort: 'low', iso: ['A.8.2', 'A.5.29'], nis2: ['21c'],
    why: 'Ein Fehler im bedingten Zugriff oder ein MFA-Ausfall kann alle Administratoren aussperren. Ein überwachtes Notfallkonto (Break-Glass) sichert den Zugang.',
    fix: 'Zwei Cloud-only-Konten mit Rolle Globaler Administrator und FIDO2-Schlüssel anlegen, von allen Richtlinien ausnehmen (am besten über eine eigene Gruppe) und deren Anmeldungen alarmieren.',
    ref: 'https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access', needs: ['ca'],
    run(ctx) {
      const pols = ctx.caEnabled.filter((p) => requiresMfa(p) || isBlock(p));
      if (!pols.length) return { status: 'info', summary: 'Keine aktiven sperrenden bzw. MFA-Richtlinien – nicht relevant.' };
      const inter = (key) => pols.map((p) => new Set(usersOf(p)[key] || [])).reduce((a, s) => new Set([...a].filter((x) => s.has(x))));
      const u = [...inter('excludeUsers')];
      const g = [...inter('excludeGroups')];
      if (u.length || g.length) return { status: 'pass', summary: 'In allen ' + pols.length + ' Richtlinien ausgenommen: ' + plural(u.length, 'Konto', 'Konten') + (g.length ? ', ' + plural(g.length, 'Gruppe', 'Gruppen') : '') + '.', head: ['Ausgenommen', 'Art'], rows: u.map((id) => [userLabel(ctx.userById.get(id)) || id, 'Benutzer']).concat(g.map((id) => [id, 'Gruppe'])) };
      return { status: 'warn', summary: 'Kein Konto bzw. keine Gruppe ist in allen ' + pols.length + ' Richtlinien ausgenommen – Aussperrrisiko.' };
    } },
  { id: 'CA-05', cat: 'zugriff', sev: 'medium', title: 'Gerätecode-Fluss ist eingeschränkt', effort: 'low', lic: 'P1', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Device-Code-Phishing ist eine aktuell stark genutzte Angriffstechnik, mit der Angreifer gültige Token erbeuten – trotz MFA.',
    fix: 'Richtlinie für bedingten Zugriff: Alle Benutzer, Bedingung „Authentifizierungsflüsse › Gerätecodefluss“ › Zugriff blockieren (Ausnahmen z. B. für Teams-Raumsysteme).',
    ref: 'https://learn.microsoft.com/entra/identity/conditional-access/policy-block-authentication-flows', needs: ['ca'],
    run(ctx) {
      const hit = ctx.caEnabled.filter((p) => isBlock(p) && (((cond(p).authenticationFlows || {}).transferMethods || '') + '').includes('deviceCodeFlow'));
      return hit.length ? { status: 'pass', summary: 'Gerätecode-Fluss wird blockiert.', head: CA_HEAD, rows: hit.map(caRow) } : { status: 'fail', summary: 'Gerätecode-Fluss ist nicht eingeschränkt.' };
    } },
  { id: 'CA-06', cat: 'zugriff', sev: 'medium', title: 'MFA für die Azure-Verwaltung', effort: 'low', lic: 'P1', iso: ['A.8.2', 'A.8.5'], nis2: ['21j'],
    why: 'Über das Azure-Portal, PowerShell und CLI lassen sich Ressourcen und Abos verwalten – auch Benutzer ohne Admin-Rolle haben oft Zugriff.',
    fix: 'Richtlinie für bedingten Zugriff: Alle Benutzer, Ressource „Windows Azure Service Management API“ (bzw. „Microsoft Admin Portals“) › MFA verlangen.',
    needs: ['secDefaults'],
    run(ctx) {
      if (ctx.sd) return { status: 'pass', summary: 'Durch Sicherheitsstandards abgedeckt.' };
      if (!ctx.ca) return na(needs(ctx, ['ca']));
      const hit = ctx.caEnabled.filter((p) => requiresMfa(p) && (isAllUsers(p) || targetsRole(p, GA)) && (isAllApps(p) || ((cond(p).applications || {}).includeApplications || []).some((a) => a === AZURE_MGMT || a === 'MicrosoftAdminPortals')));
      return hit.length ? { status: 'pass', summary: 'MFA für die Azure-Verwaltung ist erzwungen.', head: CA_HEAD, rows: hit.map(caRow) } : { status: 'fail', summary: 'Keine Richtlinie erzwingt MFA für die Azure-Verwaltung.' };
    } },
  { id: 'CA-07', cat: 'zugriff', sev: 'low', title: 'Keine Richtlinien dauerhaft im Berichtsmodus', effort: 'low', iso: ['A.8.9'], nis2: ['21f'],
    why: 'Richtlinien im Berichtsmodus schützen nicht. Sie sind für einen kurzen Testzeitraum gedacht.',
    fix: 'Auswertung im Bereich „Erkenntnisse und Berichterstellung“ prüfen und die Richtlinien einschalten oder löschen.',
    needs: ['ca'],
    run(ctx) {
      const ro = ctx.ca.filter((p) => p.state === 'enabledForReportingButNotEnforced');
      const off = ctx.ca.filter((p) => p.state === 'disabled');
      if (!ctx.ca.length) return { status: 'info', summary: 'Keine Richtlinien für bedingten Zugriff vorhanden.' };
      return { status: ro.length ? 'warn' : 'pass', summary: ctx.ca.length + ' Richtlinien: ' + ctx.caEnabled.length + ' aktiv, ' + ro.length + ' im Berichtsmodus, ' + off.length + ' deaktiviert.', head: CA_HEAD, rows: ctx.ca.map(caRow) };
    } },

  // ----- Privilegierte Konten -----
  { id: 'PA-01', cat: 'privileg', sev: 'high', title: 'Zwei bis vier globale Administratoren', effort: 'low', iso: ['A.8.2'], nis2: ['21i'],
    why: 'Mindestens zwei sorgen für Redundanz, mehr als vier vergrößern die Angriffsfläche unnötig. Für die tägliche Arbeit reichen meist spezifische Rollen.',
    fix: 'Überzählige globale Administratoren auf passende, weniger privilegierte Rollen umstellen (z. B. Benutzer-, Exchange- oder Intune-Administrator).',
    ref: 'https://learn.microsoft.com/entra/identity/role-based-access-control/best-practices', needs: ['roleAssignments'],
    run(ctx) {
      const ga = ctx.assign.concat(ctx.eligible).filter((a) => a.roleId === GA);
      const ids = new Set(ga.map((a) => a.principalId));
      const n = ids.size;
      const rows = ga.map((a) => [a.name, a.upn, a.type === 'group' ? 'Gruppe' : a.type === 'servicePrincipal' ? 'Dienstprinzipal' : 'Benutzer', a.kind]);
      const st = n >= 2 && n <= 4 ? 'pass' : n === 1 || (n >= 5 && n <= 6) ? 'warn' : 'fail';
      return { status: st, summary: plural(n, 'globaler Administrator', 'globale Administratoren') + (n === 1 ? ' – keine Redundanz.' : n > 4 ? ' – mehr als empfohlen.' : '.'), metric: String(n), head: ['Name', 'UPN', 'Art', 'Zuweisung'], rows };
    } },
  { id: 'PA-02', cat: 'privileg', sev: 'high', title: 'Privilegierte Konten sind reine Cloud-Konten', effort: 'medium', iso: ['A.8.2'], nis2: ['21i'],
    why: 'Wird ein aus dem lokalen Active Directory synchronisiertes Konto dort kompromittiert, übernimmt der Angreifer auch die Cloud-Adminrechte.',
    fix: 'Für Administratoren eigene, nicht synchronisierte Konten (…@firma.onmicrosoft.com oder eigene Admin-Domäne) anlegen und die Rollen umziehen.',
    needs: ['roleAssignments', 'users'],
    run(ctx) {
      const bad = ctx.privAll.filter((a) => { const u = ctx.userById.get(a.principalId); return u && u.onPremisesSyncEnabled; });
      return bad.length ? { status: 'fail', summary: plural(new Set(bad.map((a) => a.principalId)).size, 'privilegiertes Konto wird', 'privilegierte Konten werden') + ' aus dem lokalen AD synchronisiert.', head: ['Konto', 'Rolle'], rows: bad.map((a) => [userLabel(ctx.userById.get(a.principalId)), ctx.roleName(a.roleId)]) } : { status: 'pass', summary: 'Alle privilegierten Konten sind Cloud-only.' };
    } },
  { id: 'PA-03', cat: 'privileg', sev: 'high', title: 'Keine Gastkonten mit Administratorrollen', effort: 'low', iso: ['A.8.2', 'A.5.19'], nis2: ['21i', '21d'],
    why: 'Gastkonten werden in einem fremden Mandanten verwaltet – deren Sicherheit liegt außerhalb Ihrer Kontrolle.',
    fix: 'Rollen von Gastkonten entfernen; Dienstleister besser über GDAP anbinden.',
    needs: ['roleAssignments', 'users'],
    run(ctx) {
      const bad = ctx.assign.concat(ctx.eligible).filter((a) => { const u = ctx.userById.get(a.principalId); return u && u.userType === 'Guest'; });
      const priv = bad.filter((a) => ctx.isPrivRole(a.roleId));
      if (!bad.length) return { status: 'pass', summary: 'Kein Gastkonto hat eine Verzeichnisrolle.' };
      return { status: priv.length ? 'fail' : 'warn', summary: plural(bad.length, 'Rollenzuweisung', 'Rollenzuweisungen') + ' an Gastkonten' + (priv.length ? ', davon ' + priv.length + ' privilegiert.' : '.'), head: ['Gastkonto', 'Rolle'], rows: bad.map((a) => [userLabel(ctx.userById.get(a.principalId)), ctx.roleName(a.roleId)]) };
    } },
  { id: 'PA-04', cat: 'privileg', sev: 'high', title: 'Alle Administratoren haben MFA registriert', effort: 'low', lic: 'P1', iso: ['A.8.2', 'A.8.5'], nis2: ['21j'],
    why: 'Ein Adminkonto ohne MFA ist mit einem einzigen Kennwort übernehmbar.',
    fix: 'Betroffene Administratoren sofort MFA (am besten Passkey) registrieren lassen; bis dahin Rollen entziehen.',
    needs: ['regDetails'],
    run(ctx) {
      const adm = (ctx.d.regDetails || []).filter((r) => r.isAdmin);
      const bad = adm.filter((r) => !r.isMfaRegistered);
      if (!adm.length) return { status: 'info', summary: 'Keine Administratoren in den Registrierungsdaten.' };
      return bad.length ? { status: 'fail', summary: bad.length + ' von ' + adm.length + ' Administratoren ohne MFA-Registrierung.', head: ['Administrator'], rows: bad.map((r) => [r.userDisplayName + ' (' + r.userPrincipalName + ')']) } : { status: 'pass', summary: 'Alle ' + adm.length + ' Administratoren haben MFA registriert.' };
    } },
  { id: 'PA-05', cat: 'privileg', sev: 'medium', title: 'Privileged Identity Management (Just-in-Time-Adminrechte)', effort: 'medium', lic: 'P2', iso: ['A.8.2', 'A.5.18'], nis2: ['21i'],
    why: 'Mit PIM sind Adminrechte nur bei Bedarf und zeitlich begrenzt aktiv – mit Begründung, MFA und optionaler Genehmigung. Dauerhafte Rechte vergrößern das Risiko.',
    fix: 'Entra ID P2 bereitstellen, Admin-Rollen in PIM als „berechtigt“ statt „aktiv“ zuweisen; nur Notfallkonten bleiben dauerhaft aktiv.',
    ref: 'https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure',
    run(ctx) {
      const e = ctx.err.pimEligible;
      if (e) return e.kind === 'license' || !ctx.lic.P2 ? { status: 'fail', summary: 'PIM wird nicht genutzt – Entra ID P2 ist nicht lizenziert.' } : na('Nicht prüfbar: ' + e.text);
      if (!ctx.d.pimEligible) return na('Nicht prüfbar: Daten wurden nicht gelesen.');
      const elig = ctx.eligible.filter((a) => ctx.isPrivRole(a.roleId));
      if (!elig.length) return { status: 'fail', summary: 'Keine berechtigten (Just-in-Time-)Zuweisungen – alle Adminrechte sind dauerhaft aktiv.' };
      const perm = (ctx.d.pimActive || []).filter((s) => s.roleDefinitionId === GA && s.assignmentType === 'Assigned' && ((s.scheduleInfo || {}).expiration || {}).type === 'noExpiration');
      const n = new Set(perm.map((s) => s.principalId)).size;
      return { status: n <= 2 ? 'pass' : 'warn', summary: plural(elig.length, 'berechtigte Zuweisung', 'berechtigte Zuweisungen') + ' in PIM; ' + plural(n, 'dauerhaft aktiver globaler Administrator', 'dauerhaft aktive globale Administratoren') + '.' };
    } },
  { id: 'PA-06', cat: 'privileg', sev: 'medium', title: 'Keine inaktiven Administratorkonten', effort: 'low', lic: 'P1', iso: ['A.8.2', 'A.5.18'], nis2: ['21i'],
    why: 'Ungenutzte Adminkonten fallen bei einer Übernahme nicht auf und haben oft veraltete Schutzmaßnahmen.',
    fix: 'Admin-Rollen von Konten ohne Anmeldung in den letzten 90 Tagen entfernen (Notfallkonten ausgenommen, diese aber regelmäßig testen).',
    needs: ['roleAssignments', 'users'],
    run(ctx) {
      if (!ctx.withSignIn) return na('Nicht prüfbar: Letzte Anmeldung nicht lesbar (AuditLog.Read.All / Entra ID P1).');
      const seen = new Set();
      const bad = [];
      for (const a of ctx.privAll) {
        const u = ctx.userById.get(a.principalId);
        if (!u || seen.has(u.id)) continue;
        seen.add(u.id);
        const ls = lastSignIn(u);
        if (!ls || days(ls) > 90) bad.push([userLabel(u), ls ? fmtD(ls) : 'nie', u.accountEnabled === false ? 'deaktiviert' : 'aktiv']);
      }
      return bad.length ? { status: 'warn', summary: plural(bad.length, 'Administrator', 'Administratoren') + ' ohne Anmeldung seit über 90 Tagen.', head: ['Konto', 'Letzte Anmeldung', 'Konto'], rows: bad } : { status: 'pass', summary: 'Alle Administratoren waren in den letzten 90 Tagen aktiv.' };
    } },
  { id: 'PA-07', cat: 'privileg', sev: 'medium', title: 'Keine Anwendungen mit privilegierten Verzeichnisrollen', effort: 'medium', iso: ['A.8.2'], nis2: ['21i'],
    why: 'Dienstprinzipale mit Admin-Rollen unterliegen keiner MFA. Ein geleaktes App-Geheimnis genügt für die Übernahme.',
    fix: 'Rollen prüfen und durch eng begrenzte Graph-Anwendungsberechtigungen ersetzen; Geheimnisse durch Zertifikate oder verwaltete Identitäten ablösen.',
    needs: ['roleAssignments'],
    run(ctx) {
      const bad = ctx.assign.filter((a) => a.type === 'servicePrincipal' && ctx.isPrivRole(a.roleId));
      return bad.length ? { status: 'warn', summary: plural(bad.length, 'privilegierte Rollenzuweisung', 'privilegierte Rollenzuweisungen') + ' an Anwendungen.', head: ['Anwendung', 'Rolle'], rows: bad.map((a) => [a.name, ctx.roleName(a.roleId)]) } : { status: 'pass', summary: 'Keine Anwendung hat eine privilegierte Verzeichnisrolle.' };
    } },
  { id: 'PA-08', cat: 'privileg', sev: 'info', title: 'Übersicht privilegierter Rollenzuweisungen', effort: 'low', iso: ['A.8.2', 'A.5.18'], nis2: ['21i'],
    why: 'Grundlage für die regelmäßige Rezertifizierung der Adminrechte.',
    fix: 'Liste mit den Verantwortlichen abgleichen und überzählige Zuweisungen entfernen.',
    needs: ['roleAssignments'],
    run(ctx) {
      const rows = ctx.privAll.map((a) => [ctx.roleName(a.roleId), a.name + (a.upn && a.upn !== a.name ? ' (' + a.upn + ')' : ''), a.type === 'group' ? 'Gruppe' : a.type === 'servicePrincipal' ? 'Anwendung' : 'Benutzer', a.kind]).sort((x, y) => x[0].localeCompare(y[0]));
      return { status: 'info', summary: plural(rows.length, 'privilegierte Zuweisung', 'privilegierte Zuweisungen') + ' an ' + plural(new Set(ctx.privAll.map((a) => a.principalId)).size, 'Identität', 'Identitäten') + '.', head: ['Rolle', 'Identität', 'Art', 'Zuweisung'], rows };
    } },

  // ----- Benutzer & Gäste -----
  { id: 'GU-01', cat: 'gaeste', sev: 'medium', title: 'Gasteinladungen sind eingeschränkt', effort: 'low', iso: ['A.5.15', 'A.5.18'], nis2: ['21i'],
    why: 'Dürfen alle Benutzer (oder sogar Gäste) Externe einladen, entstehen unkontrolliert Zugänge zu Teams, Gruppen und Dateien.',
    fix: 'Entra › Externe Identitäten › Einstellungen für externe Zusammenarbeit: Einladungen nur durch Administratoren und Benutzer mit der Rolle „Gasteinladender“.',
    needs: ['authz'],
    run(ctx) {
      const v = ctx.d.authz.allowInvitesFrom;
      const map = { everyone: ['fail', 'Jeder – auch Gäste – darf Gäste einladen.'], adminsGuestInvitersAndAllMembers: ['warn', 'Alle Mitglieder dürfen Gäste einladen.'], adminsAndGuestInviters: ['pass', 'Nur Administratoren und Gasteinladende dürfen einladen.'], none: ['pass', 'Gasteinladungen sind deaktiviert.'] };
      const m = map[v] || ['info', 'Einstellung: ' + v];
      return { status: m[0], summary: m[1] };
    } },
  { id: 'GU-02', cat: 'gaeste', sev: 'medium', title: 'Gastbenutzer haben eingeschränkten Verzeichniszugriff', effort: 'low', iso: ['A.5.15', 'A.8.3'], nis2: ['21i'],
    why: 'Mit Mitgliedsrechten können Gäste das komplette Verzeichnis auslesen – eine Fundgrube für gezieltes Phishing.',
    fix: 'Entra › Externe Identitäten › Einstellungen für externe Zusammenarbeit › Gastbenutzerzugriff „eingeschränkt“ oder „am stärksten eingeschränkt“.',
    needs: ['authz'],
    run(ctx) {
      const v = GUEST_ROLE[ctx.d.authz.guestUserRoleId];
      if (v === 'same') return { status: 'fail', summary: 'Gäste haben dieselben Verzeichnisrechte wie Mitglieder.' };
      if (v === 'limited') return { status: 'pass', summary: 'Gäste haben eingeschränkten Zugriff (Standard). Noch strenger: „am stärksten eingeschränkt“.' };
      if (v === 'restricted') return { status: 'pass', summary: 'Gastzugriff ist am stärksten eingeschränkt.' };
      return { status: 'info', summary: 'Unbekannte Einstellung.' };
    } },
  { id: 'GU-03', cat: 'gaeste', sev: 'medium', title: 'Benutzer dürfen keine Anwendungen registrieren', effort: 'low', iso: ['A.5.15', 'A.8.9'], nis2: ['21i'],
    why: 'Selbst registrierte Apps sind ein beliebter Weg für dauerhafte Hintertüren (Illicit Consent, Persistenz).',
    fix: 'Entra › Benutzer › Benutzereinstellungen › „Benutzer können Anwendungen registrieren“ auf Nein; bei Bedarf die Rolle „Anwendungsentwickler“ vergeben.',
    needs: ['authz'],
    run(ctx) { const v = (ctx.d.authz.defaultUserRolePermissions || {}).allowedToCreateApps; return v ? { status: 'fail', summary: 'Alle Benutzer dürfen Anwendungen registrieren.' } : { status: 'pass', summary: 'Nur berechtigte Rollen dürfen Anwendungen registrieren.' }; } },
  { id: 'GU-04', cat: 'gaeste', sev: 'medium', title: 'Benutzer dürfen keine neuen Mandanten erstellen', effort: 'low', iso: ['A.5.15', 'A.5.23'], nis2: ['21i'],
    why: 'Von Mitarbeitenden angelegte Mandanten entziehen sich der Kontrolle der IT (Schatten-IT, Datenabfluss).',
    fix: 'Entra › Benutzer › Benutzereinstellungen › „Erstellung von Mandanten durch Nicht-Administratoren einschränken“ auf Ja.',
    needs: ['authz'],
    run(ctx) { const v = (ctx.d.authz.defaultUserRolePermissions || {}).allowedToCreateTenants; return v === false ? { status: 'pass', summary: 'Erstellung von Mandanten ist eingeschränkt.' } : v === true ? { status: 'fail', summary: 'Alle Benutzer dürfen neue Mandanten erstellen.' } : { status: 'info', summary: 'Einstellung nicht ermittelbar.' }; } },
  { id: 'GU-05', cat: 'gaeste', sev: 'low', title: 'Benutzer dürfen keine Sicherheitsgruppen erstellen', effort: 'low', iso: ['A.5.18'], nis2: ['21i'],
    why: 'Selbst erstellte Sicherheitsgruppen erschweren die Rechteverwaltung und können Zuweisungen unterlaufen.',
    fix: 'Entra › Gruppen › Allgemein › „Benutzer können Sicherheitsgruppen erstellen“ auf Nein.',
    needs: ['authz'],
    run(ctx) { const v = (ctx.d.authz.defaultUserRolePermissions || {}).allowedToCreateSecurityGroups; return v ? { status: 'warn', summary: 'Alle Benutzer dürfen Sicherheitsgruppen erstellen.' } : { status: 'pass', summary: 'Nur Administratoren erstellen Sicherheitsgruppen.' }; } },
  { id: 'GU-06', cat: 'gaeste', sev: 'low', title: 'Keine Selbstregistrierung per E-Mail-Bestätigung', effort: 'low', iso: ['A.5.16'], nis2: ['21i'],
    why: 'Sonst können sich Personen mit passender E-Mail-Domäne selbst ein Konto im Mandanten anlegen (virale Registrierung).',
    fix: 'Per Microsoft Graph bzw. PowerShell „allowEmailVerifiedUsersToJoinOrganization“ deaktivieren.',
    needs: ['authz'],
    run(ctx) { return ctx.d.authz.allowEmailVerifiedUsersToJoinOrganization ? { status: 'fail', summary: 'E-Mail-verifizierte Benutzer können dem Mandanten beitreten.' } : { status: 'pass', summary: 'Selbstregistrierung ist deaktiviert.' }; } },
  { id: 'GU-07', cat: 'gaeste', sev: 'low', title: 'Keine inaktiven Gastkonten', effort: 'low', lic: 'P1', iso: ['A.5.18'], nis2: ['21i'],
    why: 'Vergessene Gastkonten behalten Zugriff auf Teams, Dateien und Gruppen.',
    fix: 'Gäste ohne Anmeldung seit 90 Tagen entfernen; dauerhaft mit Access Reviews für Gäste (Entra ID P2 / ID Governance) automatisieren.',
    needs: ['users'],
    run(ctx) {
      if (!ctx.withSignIn) return na('Nicht prüfbar: Letzte Anmeldung nicht lesbar (AuditLog.Read.All / Entra ID P1).');
      const g = ctx.users.filter((u) => u.userType === 'Guest' && u.accountEnabled !== false);
      const old = g.filter((u) => { const ls = lastSignIn(u); return ls ? days(ls) > 90 : days(u.createdDateTime) > 90; });
      if (!g.length) return { status: 'pass', summary: 'Keine aktiven Gastkonten.' };
      return { status: old.length ? 'warn' : 'pass', summary: old.length + ' von ' + g.length + ' Gastkonten seit über 90 Tagen ohne Anmeldung.', metric: String(old.length), head: ['Gast', 'Letzte Anmeldung', 'Erstellt'], rows: old.slice(0, 200).map((u) => [userLabel(u), fmtD(lastSignIn(u)), fmtD(u.createdDateTime)]), more: Math.max(0, old.length - 200) };
    } },
  { id: 'GU-08', cat: 'gaeste', sev: 'low', title: 'Keine inaktiven aktivierten Mitgliedskonten', effort: 'low', lic: 'P1', iso: ['A.5.18', 'A.6.5'], nis2: ['21i'],
    why: 'Aktive, aber ungenutzte Konten (z. B. ehemaliger Mitarbeitender) sind ein beliebtes Ziel.',
    fix: 'Konten ohne Anmeldung seit 90 Tagen prüfen, deaktivieren und Lizenzen freigeben; Offboarding-Prozess schärfen.',
    needs: ['users'],
    run(ctx) {
      if (!ctx.withSignIn) return na('Nicht prüfbar: Letzte Anmeldung nicht lesbar (AuditLog.Read.All / Entra ID P1).');
      const m = ctx.users.filter((u) => u.userType !== 'Guest' && u.accountEnabled !== false);
      const old = m.filter((u) => { const ls = lastSignIn(u); return ls ? days(ls) > 90 : days(u.createdDateTime) > 90; });
      return { status: old.length ? 'warn' : 'pass', summary: old.length + ' von ' + m.length + ' aktivierten Mitgliedskonten seit über 90 Tagen ohne Anmeldung (enthält ggf. Raum- und Funktionspostfächer).', metric: String(old.length), head: ['Konto', 'Letzte Anmeldung', 'Erstellt'], rows: old.slice(0, 200).map((u) => [userLabel(u), fmtD(lastSignIn(u)), fmtD(u.createdDateTime)]), more: Math.max(0, old.length - 200) };
    } },
  { id: 'GU-09', cat: 'teams', sev: 'info', title: 'Erstellung von Microsoft-365-Gruppen und Teams', effort: 'low', iso: ['A.5.15'], nis2: ['21i'],
    why: 'Dürfen alle Benutzer Teams erstellen, wächst die Zahl der Teams und Freigaben schnell – relevant für Governance und Copilot.',
    fix: 'Je nach Governance-Konzept: Erstellung auf eine Gruppe beschränken und/oder Namens- und Ablaufrichtlinien einführen.',
    needs: ['groupSettings'],
    run(ctx) {
      const s = (ctx.d.groupSettings || []).find((x) => x.displayName === 'Group.Unified' || x.templateId === '62375ab9-6b52-47ed-826b-58e47e0e304b');
      const v = s && ((s.values || []).find((x) => x.name === 'EnableGroupCreation') || {}).value;
      return { status: 'info', summary: v === 'false' || v === 'False' ? 'Erstellung von Gruppen/Teams ist auf berechtigte Personen beschränkt.' : 'Alle Benutzer dürfen Microsoft-365-Gruppen und Teams erstellen.' };
    } },

  // ----- Anwendungen -----
  { id: 'AP-01', cat: 'apps', sev: 'high', title: 'Benutzer können Apps nicht uneingeschränkt zustimmen', effort: 'low', iso: ['A.5.15', 'A.8.12'], nis2: ['21i'],
    why: 'Consent-Phishing: Eine bösartige App lässt sich vom Benutzer Zugriff auf Mails und Dateien geben – ganz ohne Kennwort und unbeeindruckt von MFA.',
    fix: 'Entra › Unternehmensanwendungen › Zustimmung und Berechtigungen: Zustimmung nur für verifizierte Herausgeber mit geringen Berechtigungen oder gar nicht; Admin-Zustimmungsworkflow aktivieren.',
    ref: 'https://learn.microsoft.com/entra/identity/enterprise-apps/configure-user-consent', needs: ['authz'],
    run(ctx) {
      const p = (ctx.d.authz.defaultUserRolePermissions || {}).permissionGrantPoliciesAssigned || [];
      if (p.some((x) => /microsoft-user-default-legacy/i.test(x))) return { status: 'fail', summary: 'Benutzer dürfen allen Apps zustimmen (Standard „Legacy“).' };
      if (p.some((x) => /microsoft-user-default-low/i.test(x))) return { status: 'pass', summary: 'Zustimmung nur für verifizierte Herausgeber mit geringen Berechtigungen.' };
      if (p.some((x) => /ManagePermissionGrantsForSelf/i.test(x))) return { status: 'warn', summary: 'Eigene Zustimmungsrichtlinie: ' + p.filter((x) => /ForSelf/.test(x)).join(', ') };
      return { status: 'pass', summary: 'Benutzer dürfen Apps nicht selbst zustimmen.' };
    } },
  { id: 'AP-02', cat: 'apps', sev: 'low', title: 'Workflow für Administratorzustimmung ist aktiv', effort: 'low', iso: ['A.5.15'], nis2: ['21i'],
    why: 'Benutzer können benötigte Apps beantragen, statt Umwege zu suchen – Admins prüfen und genehmigen.',
    fix: 'Entra › Unternehmensanwendungen › Einstellungen für die Administratoreinwilligung › Workflow aktivieren und Prüfer festlegen.',
    needs: ['adminConsent'],
    run(ctx) { return ctx.d.adminConsent.isEnabled ? { status: 'pass', summary: 'Workflow ist aktiv.' } : { status: 'warn', summary: 'Workflow für Administratorzustimmung ist deaktiviert.' }; } },
  { id: 'AP-03', cat: 'apps', sev: 'low', title: 'App-Geheimnisse und -Zertifikate sind gültig und gepflegt', effort: 'low', iso: ['A.8.9', 'A.8.24'], nis2: ['21e'],
    why: 'Ablaufende Anmeldeinformationen führen zu Ausfällen; abgelaufene Altlasten erschweren den Überblick.',
    fix: 'Ablaufende Geheimnisse rechtzeitig erneuern (Überwachung einrichten), abgelaufene entfernen.',
    needs: ['apps'],
    run(ctx) {
      const rows = [];
      let exp = 0, soon = 0;
      for (const a of ctx.d.apps) for (const c of (a.passwordCredentials || []).map((x) => [x, 'Geheimnis']).concat((a.keyCredentials || []).map((x) => [x, 'Zertifikat']))) {
        const left = -days(c[0].endDateTime);
        if (left < 0) { exp++; rows.push([a.displayName, c[1], fmtD(c[0].endDateTime), 'abgelaufen']); } else if (left <= 30) { soon++; rows.push([a.displayName, c[1], fmtD(c[0].endDateTime), 'noch ' + left + ' Tage']); }
      }
      if (!rows.length) return { status: 'pass', summary: 'Keine abgelaufenen oder in 30 Tagen ablaufenden Anmeldeinformationen.' };
      return { status: 'warn', summary: soon + ' laufen in 30 Tagen ab, ' + exp + ' sind bereits abgelaufen.', head: ['Anwendung', 'Typ', 'Gültig bis', 'Status'], rows };
    } },
  { id: 'AP-04', cat: 'apps', sev: 'medium', title: 'Anwendungen mit weitreichenden Anwendungsberechtigungen', effort: 'medium', iso: ['A.5.15', 'A.8.2'], nis2: ['21i', '21d'],
    why: 'Anwendungsberechtigungen wirken ohne angemeldeten Benutzer auf den ganzen Mandanten, z. B. alle Postfächer oder alle Dateien. Sie sollten bekannt, begründet und begrenzt sein.',
    fix: 'Jede gelistete App mit dem Fachbereich bewerten; nicht benötigte Rechte entziehen, Exchange-Zugriffe per RBAC for Applications auf einzelne Postfächer begrenzen.',
    needs: ['graphAssigned', 'graphSp', 'sps'],
    run(ctx) {
      const roles = new Map((ctx.d.graphSp.appRoles || []).map((r) => [r.id, r.value]));
      const sp = new Map(ctx.d.sps.map((s) => [s.id, s]));
      const by = new Map();
      for (const a of ctx.d.graphAssigned) {
        const v = roles.get(a.appRoleId);
        if (!v || !HIGH_APP_PERMS.has(v)) continue;
        const s = sp.get(a.principalId);
        if (s && MS_TENANTS.has(s.appOwnerOrganizationId)) continue;
        const k = a.principalId;
        if (!by.has(k)) by.set(k, { name: (s && s.displayName) || a.principalDisplayName, own: s && s.appOwnerOrganizationId === ctx.snap.tenant.id ? 'eigene App' : 'Drittanbieter', perms: [] });
        by.get(k).perms.push(v);
      }
      const rows = [...by.values()].map((x) => [x.name, x.own, x.perms.sort().join(', ')]);
      return rows.length ? { status: 'warn', summary: plural(rows.length, 'Anwendung hat', 'Anwendungen haben') + ' weitreichende Anwendungsberechtigungen auf Microsoft Graph.', head: ['Anwendung', 'Herkunft', 'Berechtigungen'], rows } : { status: 'pass', summary: 'Keine Nicht-Microsoft-App mit weitreichenden Graph-Anwendungsberechtigungen.' };
    } },
  { id: 'AP-05', cat: 'apps', sev: 'medium', title: 'Mandantenweite Zustimmungen für Drittanbieter-Apps', effort: 'medium', iso: ['A.5.15', 'A.5.19'], nis2: ['21i', '21d'],
    why: 'Mit einer Administratorzustimmung „für alle Benutzer“ darf die App im Namen jedes Benutzers auf Mails oder Dateien zugreifen.',
    fix: 'Zustimmungen prüfen (Entra › Unternehmensanwendungen › Berechtigungen) und nicht mehr benötigte Apps bzw. Rechte entfernen.',
    needs: ['grants', 'sps'],
    run(ctx) {
      const sp = new Map(ctx.d.sps.map((s) => [s.id, s]));
      const rows = [];
      for (const g of ctx.d.grants) {
        if (g.consentType !== 'AllPrincipals') continue;
        const s = sp.get(g.clientId);
        if (!s || MS_TENANTS.has(s.appOwnerOrganizationId) || s.appOwnerOrganizationId === ctx.snap.tenant.id) continue;
        const risky = String(g.scope || '').split(/\s+/).filter((x) => HIGH_DELEGATED.test(x));
        if (risky.length) rows.push([s.displayName, risky.join(', ')]);
      }
      return rows.length ? { status: 'warn', summary: plural(rows.length, 'Drittanbieter-App hat', 'Drittanbieter-Apps haben') + ' mandantenweite Zustimmung für sensible Daten.', head: ['Anwendung', 'Sensible Berechtigungen'], rows } : { status: 'pass', summary: 'Keine mandantenweiten Zustimmungen mit sensiblen Berechtigungen an Drittanbieter.' };
    } },
  { id: 'AP-06', cat: 'apps', sev: 'low', title: 'Keine Client-Geheimnisse mit über zwei Jahren Laufzeit', effort: 'low', iso: ['A.8.24', 'A.5.17'], nis2: ['21h'],
    why: 'Langlaufende Geheimnisse werden selten rotiert und bleiben nach einem Leak lange nutzbar.',
    fix: 'Geheimnisse mit max. 12 Monaten Laufzeit ausstellen oder auf Zertifikate bzw. Workload Identity Federation umstellen; per App-Verwaltungsrichtlinie erzwingen.',
    needs: ['apps'],
    run(ctx) {
      const rows = [];
      for (const a of ctx.d.apps) for (const c of a.passwordCredentials || []) {
        const life = Math.round((Date.parse(c.endDateTime) - Date.parse(c.startDateTime)) / DAY);
        if (life > 730 && Date.parse(c.endDateTime) > now()) rows.push([a.displayName, fmtD(c.startDateTime), fmtD(c.endDateTime), Math.round(life / 365) + ' Jahre']);
      }
      return rows.length ? { status: 'warn', summary: plural(rows.length, 'Geheimnis läuft', 'Geheimnisse laufen') + ' länger als zwei Jahre.', head: ['Anwendung', 'Erstellt', 'Gültig bis', 'Laufzeit'], rows } : { status: 'pass', summary: 'Keine Geheimnisse mit über zwei Jahren Laufzeit.' };
    } },

  // ----- SharePoint & OneDrive -----
  { id: 'SP-01', cat: 'daten', sev: 'medium', title: 'Keine anonymen „Jeder“-Freigabelinks', effort: 'low', iso: ['A.5.14', 'A.8.12'], nis2: ['21i'],
    why: '„Jeder“-Links funktionieren ohne Anmeldung und lassen sich beliebig weiterleiten. Niemand kann nachvollziehen, wer die Daten geöffnet hat.',
    fix: 'SharePoint Admin Center › Richtlinien › Freigabe: höchstens „Neue und vorhandene Gäste“. Wo nötig „Jeder“-Links nur für einzelne Sites und mit Ablaufdatum.',
    needs: ['spo'],
    run(ctx) {
      const v = ctx.d.spo.sharingCapability;
      const map = { externalUserAndGuestSharing: ['warn', 'Anonyme „Jeder“-Links sind erlaubt.'], externalUserSharingOnly: ['pass', 'Freigabe nur an angemeldete Gäste.'], existingExternalUserSharingOnly: ['pass', 'Freigabe nur an vorhandene Gäste.'], disabled: ['pass', 'Externe Freigabe ist deaktiviert.'] };
      const m = map[v] || ['info', 'Einstellung: ' + v];
      return { status: m[0], summary: m[1] };
    } },
  { id: 'SP-02', cat: 'daten', sev: 'low', title: 'Gäste dürfen Inhalte nicht weiterfreigeben', effort: 'low', iso: ['A.5.14'], nis2: ['21i'],
    why: 'Sonst können Gäste Inhalte, die ihnen freigegeben wurden, an weitere Personen freigeben.',
    fix: 'SharePoint Admin Center › Richtlinien › Freigabe › Weitere Einstellungen › „Gäste dürfen Elemente, die sie nicht besitzen, freigeben“ deaktivieren.',
    needs: ['spo'],
    run(ctx) { const v = ctx.d.spo.isResharingByExternalUsersEnabled; return v === undefined ? na('Einstellung nicht verfügbar.') : v ? { status: 'fail', summary: 'Gäste dürfen weiterfreigeben.' } : { status: 'pass', summary: 'Weiterfreigabe durch Gäste ist deaktiviert.' }; } },
  { id: 'SP-03', cat: 'daten', sev: 'low', title: 'Externe Freigabe ist auf Domänen begrenzt', effort: 'medium', iso: ['A.5.14', 'A.5.19'], nis2: ['21i'],
    why: 'Eine Zulassungs- oder Sperrliste von Domänen reduziert versehentliche Freigaben an falsche Empfänger.',
    fix: 'SharePoint Admin Center › Richtlinien › Freigabe › „Externe Freigabe nach Domäne einschränken“ – z. B. Partnerdomänen zulassen.',
    needs: ['spo'],
    run(ctx) {
      const s = ctx.d.spo;
      if (s.sharingCapability === 'disabled') return { status: 'pass', summary: 'Externe Freigabe ist deaktiviert.' };
      const m = s.sharingDomainRestrictionMode;
      return m === 'allowList' ? { status: 'pass', summary: 'Freigabe nur an zugelassene Domänen (' + (s.sharingAllowedDomainList || []).length + ').' } : m === 'blockList' ? { status: 'warn', summary: 'Nur eine Sperrliste ist gepflegt (' + (s.sharingBlockedDomainList || []).length + ' Domänen).' } : { status: 'warn', summary: 'Freigabe an beliebige externe Domänen möglich.' };
    } },
  { id: 'SP-04', cat: 'daten', sev: 'low', title: 'OneDrive-Synchronisierung nur auf Firmengeräten', effort: 'medium', iso: ['A.8.1', 'A.8.12'], nis2: ['21i'],
    why: 'Sonst lassen sich Firmendaten vollständig auf private Rechner synchronisieren.',
    fix: 'SharePoint Admin Center › Einstellungen › OneDrive-Synchronisierung › „Synchronisierung nur auf Computern in bestimmten Domänen zulassen“ oder Gerätezugriff per bedingtem Zugriff steuern.',
    needs: ['spo'],
    run(ctx) { const v = ctx.d.spo.isUnmanagedSyncAppForTenantRestricted; return v === undefined ? na('Einstellung nicht verfügbar.') : v ? { status: 'pass', summary: 'Synchronisierung ist auf Firmengeräte beschränkt.' } : { status: 'warn', summary: 'Synchronisierung ist von jedem Gerät möglich.' }; } },
  { id: 'SP-05', cat: 'daten', sev: 'low', title: 'Automatische Abmeldung bei Inaktivität', effort: 'low', iso: ['A.8.5', 'A.8.1'], nis2: ['21i'],
    why: 'Auf gemeinsam genutzten oder unverwalteten Rechnern bleiben Sitzungen sonst offen.',
    fix: 'SharePoint Admin Center › Richtlinien › Zugriffssteuerung › Abmeldung bei Leerlauf aktivieren (z. B. nach 1 Stunde).',
    needs: ['spo'],
    run(ctx) { const v = (ctx.d.spo.idleSessionSignOut || {}).isEnabled; return v === undefined ? na('Einstellung nicht verfügbar.') : v ? { status: 'pass', summary: 'Abmeldung bei Leerlauf ist aktiv.' } : { status: 'warn', summary: 'Keine Abmeldung bei Leerlauf.' }; } },
  { id: 'SP-06', cat: 'daten', sev: 'medium', title: 'Legacy-Authentifizierung für SharePoint ist deaktiviert', effort: 'low', iso: ['A.8.5'], nis2: ['21j'],
    why: 'Ältere Clients können sich sonst ohne moderne Authentifizierung und damit ohne MFA anmelden.',
    fix: 'SharePoint Admin Center › Richtlinien › Zugriffssteuerung › Apps ohne moderne Authentifizierung blockieren.',
    needs: ['spo'],
    run(ctx) { const v = ctx.d.spo.isLegacyAuthProtocolsEnabled; return v === undefined ? na('Einstellung nicht verfügbar.') : v ? { status: 'fail', summary: 'Legacy-Authentifizierung ist erlaubt.' } : { status: 'pass', summary: 'Legacy-Authentifizierung ist blockiert.' }; } },

  // ----- E-Mail (DNS) -----
  { id: 'ML-01', cat: 'mail', sev: 'medium', title: 'SPF-Eintrag ist vorhanden und korrekt', effort: 'low', iso: ['A.5.14'], nis2: ['21j'], dns: true,
    why: 'SPF legt fest, welche Server im Namen Ihrer Domäne senden dürfen – Grundlage gegen gefälschte Absender.',
    fix: 'Je Maildomäne genau einen TXT-Eintrag, z. B. „v=spf1 include:spf.protection.outlook.com -all“; ungenutzte Domänen: „v=spf1 -all“.',
    ref: 'https://learn.microsoft.com/defender-office-365/email-authentication-spf-configure',
    run(ctx) { return dnsEval(ctx, (r) => {
      if (!r.spf.length) return ['fail', 'kein SPF'];
      if (r.spf.length > 1) return ['fail', 'mehrere SPF-Einträge (ungültig)'];
      const s = r.spf[0];
      if (/[+?]all\b/i.test(s) || !/[-~]all\b/i.test(s)) return ['fail', 'zu offen: ' + s];
      if (r.mx.some((m) => /mail\.protection\.outlook\.com$/i.test(m)) && !/spf\.protection\.outlook\.com/i.test(s)) return ['warn', 'Exchange Online fehlt: ' + s];
      return ['pass', s];
    }); } },
  { id: 'ML-02', cat: 'mail', sev: 'high', title: 'DMARC ist mit Richtlinie „quarantine“ oder „reject“ aktiv', effort: 'medium', iso: ['A.5.14', 'A.8.7'], nis2: ['21j'], dns: true,
    why: 'Erst DMARC sorgt dafür, dass gefälschte Mails mit Ihrer Domäne beim Empfänger abgewiesen werden (CEO-Fraud, Rechnungsbetrug). Google und Yahoo verlangen DMARC für Massenversender.',
    fix: 'TXT-Eintrag _dmarc.<domäne>: Start mit „v=DMARC1; p=none; rua=mailto:…“, Berichte auswerten, dann auf „p=quarantine“ und „p=reject“ erhöhen.',
    ref: 'https://learn.microsoft.com/defender-office-365/email-authentication-dmarc-configure',
    run(ctx) { return dnsEval(ctx, (r) => {
      if (!r.dmarc.length) return ['fail', 'kein DMARC'];
      const s = r.dmarc[0];
      const p = ((s.match(/;\s*p\s*=\s*(\w+)/i) || [])[1] || '').toLowerCase();
      const pc = parseInt((s.match(/pct\s*=\s*(\d+)/i) || [])[1] || '100', 10);
      if (p === 'reject' || p === 'quarantine') return pc < 100 ? ['warn', 'p=' + p + ', nur ' + pc + ' %'] : ['pass', 'p=' + p];
      return ['warn', 'p=' + (p || '?') + ' (nur Überwachung)'];
    }); } },
  { id: 'ML-03', cat: 'mail', sev: 'medium', title: 'DKIM-Signatur für Exchange Online ist aktiv', effort: 'low', lic: '', iso: ['A.5.14', 'A.8.24'], nis2: ['21h'], dns: true,
    why: 'DKIM signiert ausgehende Mails kryptografisch. Ohne DKIM besteht DMARC bei Weiterleitungen oft nicht.',
    fix: 'Defender-Portal › E-Mail und Zusammenarbeit › Richtlinien › E-Mail-Authentifizierung › DKIM: CNAME-Einträge selector1/selector2 veröffentlichen und Signierung aktivieren.',
    ref: 'https://learn.microsoft.com/defender-office-365/email-authentication-dkim-configure',
    run(ctx) { return dnsEval(ctx, (r) => {
      const keys = r.dkim.filter((k) => k.key).length;
      const cn = r.dkim.filter((k) => k.cname).length;
      const exo = r.mx.some((m) => /mail\.protection\.outlook\.com$/i.test(m));
      if (keys) return ['pass', keys + ' Selektor(en) mit Schlüssel'];
      if (cn) return ['warn', 'CNAME vorhanden, Signierung vermutlich nicht aktiviert'];
      if (!r.mx.length) return ['info', 'kein Mailempfang (MX) – nicht relevant'];
      return [exo ? 'fail' : 'warn', exo ? 'keine DKIM-Selektoren' : 'keine Microsoft-Selektoren (Drittanbieter-Gateway? manuell prüfen)'];
    }); } },
  { id: 'ML-04', cat: 'mail', sev: 'low', title: 'MTA-STS erzwingt verschlüsselten Mailempfang', effort: 'medium', iso: ['A.8.24', 'A.5.14'], nis2: ['21h'], dns: true,
    why: 'MTA-STS verhindert, dass Angreifer die TLS-Verschlüsselung beim Mailtransport herunterstufen.',
    fix: 'TXT-Eintrag _mta-sts.<domäne> und Richtliniendatei unter https://mta-sts.<domäne>/.well-known/mta-sts.txt veröffentlichen (Exchange Online unterstützt MTA-STS für eingehende Mails).',
    run(ctx) { return dnsEval(ctx, (r) => !r.mx.length ? ['info', 'kein MX'] : r.mtaSts.length ? ['pass', 'MTA-STS vorhanden'] : ['warn', 'kein MTA-STS']); } },
  { id: 'ML-05', cat: 'mail', sev: 'info', title: 'Mailfluss (MX-Einträge) der Domänen', effort: 'low', iso: ['A.8.7'], nis2: [], dns: true,
    why: 'Zeigt, ob Mails direkt über Exchange Online Protection oder über ein vorgeschaltetes Gateway laufen.',
    fix: 'Bei Drittanbieter-Gateways „Erweiterte Filterung für Connectors“ in Exchange Online aktivieren, damit SPF/DMARC korrekt ausgewertet werden.',
    run(ctx) {
      const r = dnsEval(ctx, (x) => ['info', x.mx.length ? x.mx.join(', ') : 'kein MX']);
      if (r.status !== 'na') r.status = 'info';
      return r;
    } },

  // ----- Geräte -----
  { id: 'DV-01', cat: 'geraete', sev: 'medium', title: 'Konformitätsrichtlinien sind vorhanden und zugewiesen', effort: 'medium', lic: 'INTUNE', iso: ['A.8.1', 'A.8.9'], nis2: ['21i'],
    why: 'Konformitätsrichtlinien definieren den Mindeststandard (Verschlüsselung, Updates, Virenschutz) und sind Voraussetzung für Gerätebedingungen im bedingten Zugriff.',
    fix: 'Je Plattform eine Konformitätsrichtlinie anlegen (Verschlüsselung, Mindest-OS-Version, Defender, Kennwort) und allen Benutzern bzw. Geräten zuweisen.',
    needs: ['compliance'],
    run(ctx) {
      const p = ctx.d.compliance;
      if (!p.length) return { status: ctx.lic.INTUNE ? 'fail' : 'fail', summary: 'Keine Konformitätsrichtlinien vorhanden.' + (ctx.lic.INTUNE ? '' : ' Intune ist nicht lizenziert.') };
      const un = p.filter((x) => !(x.assignments || []).length);
      const plat = (x) => String(x['@odata.type'] || '').replace('#microsoft.graph.', '').replace(/CompliancePolicy$/, '');
      return { status: un.length === p.length ? 'fail' : un.length ? 'warn' : 'pass', summary: p.length + ' Richtlinien, davon ' + un.length + ' ohne Zuweisung.', head: ['Richtlinie', 'Plattform', 'Zuweisungen'], rows: p.map((x) => [x.displayName, plat(x), String((x.assignments || []).length)]) };
    } },
  { id: 'DV-02', cat: 'geraete', sev: 'medium', title: 'Geräte ohne Konformitätsrichtlinie gelten als nicht konform', effort: 'low', lic: 'INTUNE', iso: ['A.8.1'], nis2: ['21i'],
    why: 'Sonst gilt ein Gerät ohne zugewiesene Richtlinie automatisch als konform – und erfüllt damit Gerätebedingungen im bedingten Zugriff.',
    fix: 'Intune › Gerätekonformität › Einstellungen für Konformitätsrichtlinien › „Geräte ohne zugewiesene Konformitätsrichtlinie markieren als“: Nicht konform.',
    needs: ['intuneSettings'],
    run(ctx) { const v = ((ctx.d.intuneSettings || {}).settings || {}).secureByDefault; return v === undefined ? na('Einstellung nicht verfügbar.') : v ? { status: 'pass', summary: 'Geräte ohne Richtlinie gelten als nicht konform.' } : { status: 'fail', summary: 'Geräte ohne Richtlinie gelten als konform.' }; } },
  { id: 'DV-03', cat: 'geraete', sev: 'low', title: 'Anteil nicht konformer Geräte', effort: 'medium', lic: 'INTUNE', iso: ['A.8.1', 'A.8.8'], nis2: ['21i', '21e'],
    why: 'Viele nicht konforme Geräte deuten auf fehlende Updates, Verschlüsselung oder zu strenge bzw. unrealistische Richtlinien hin.',
    fix: 'Gründe in Intune › Geräte › Konformität auswerten, Geräte nachziehen oder Richtlinien anpassen.',
    needs: ['devices'],
    run(ctx) {
      const all = ctx.d.devices;
      if (!all.length) return { status: 'info', summary: 'Keine verwalteten Geräte.' };
      const nc = all.filter((x) => x.complianceState === 'noncompliant' || x.complianceState === 'error').length;
      const p = pct(nc, all.length);
      return { status: p <= 10 ? 'pass' : p <= 30 ? 'warn' : 'fail', summary: nc + ' von ' + all.length + ' Geräten nicht konform (' + p + ' %).', metric: p + ' %' };
    } },
  { id: 'DV-04', cat: 'geraete', sev: 'medium', title: 'Windows- und macOS-Geräte sind verschlüsselt', effort: 'medium', lic: 'INTUNE', iso: ['A.8.1', 'A.8.24'], nis2: ['21h'],
    why: 'Bei Verlust oder Diebstahl schützt nur die Festplattenverschlüsselung (BitLocker / FileVault) die Daten.',
    fix: 'BitLocker bzw. FileVault per Endpoint-Security-Richtlinie aktivieren und Wiederherstellungsschlüssel in Entra/Intune sichern.',
    needs: ['devices'],
    run(ctx) {
      const pc = ctx.d.devices.filter((x) => /windows|macos/i.test(x.operatingSystem || ''));
      if (!pc.length) return { status: 'info', summary: 'Keine verwalteten Windows- oder macOS-Geräte.' };
      const un = pc.filter((x) => !x.isEncrypted).length;
      const p = pct(un, pc.length);
      return { status: p === 0 ? 'pass' : p <= 10 ? 'warn' : 'fail', summary: un + ' von ' + pc.length + ' Windows-/macOS-Geräten unverschlüsselt.', metric: p + ' %' };
    } },
  { id: 'DV-05', cat: 'geraete', sev: 'low', title: 'Geräte melden sich regelmäßig', effort: 'low', lic: 'INTUNE', iso: ['A.8.1', 'A.8.9'], nis2: ['21i'],
    why: 'Geräte ohne Check-in erhalten keine Richtlinien und Updates – oder existieren nicht mehr.',
    fix: 'Bereinigungsregel in Intune einrichten (Geräte › Bereinigungsregeln, z. B. 90 Tage) und Geräte prüfen.',
    needs: ['devices'],
    run(ctx) {
      const all = ctx.d.devices;
      if (!all.length) return { status: 'info', summary: 'Keine verwalteten Geräte.' };
      const st = all.filter((x) => days(x.lastSyncDateTime) > 30).length;
      const p = pct(st, all.length);
      return { status: p <= 5 ? 'pass' : 'warn', summary: st + ' von ' + all.length + ' Geräten seit über 30 Tagen ohne Check-in.' };
    } },

  // ----- Defender & Überwachung -----
  { id: 'DF-01', cat: 'defender', sev: 'medium', title: 'Microsoft Secure Score', effort: 'medium', iso: ['A.8.9', 'A.5.23'], nis2: ['21f'],
    why: 'Der Secure Score bewertet die Konfiguration aller Microsoft-365-Dienste und ist eine gute Kennzahl für die Wirksamkeit der Maßnahmen (NIS2: Bewertung der Wirksamkeit).',
    fix: 'Empfehlungen im Defender-Portal › Secure Score nach Wirkung abarbeiten; Score monatlich berichten.',
    needs: ['secureScore'],
    run(ctx) {
      const s = ctx.secureScore;
      if (!s) return na('Für diesen Mandanten liegt noch kein Secure Score vor.');
      const cmp = s.avg ? ' Durchschnitt aller Mandanten: ' + Math.round(s.avg) + ' Punkte.' : '';
      return { status: s.pct >= 70 ? 'pass' : s.pct >= 50 ? 'warn' : 'fail', summary: Math.round(s.current) + ' von ' + Math.round(s.max) + ' Punkten (' + s.pct + ' %).' + cmp, metric: s.pct + ' %' };
    } },
  { id: 'DF-02', cat: 'defender', sev: 'high', title: 'Keine offenen Risikobenutzer', effort: 'low', lic: 'P2', iso: ['A.5.25', 'A.5.26'], nis2: ['21b'],
    why: 'Identity Protection hat Hinweise auf kompromittierte Konten gefunden, die noch nicht behandelt wurden.',
    fix: 'Betroffene Konten untersuchen, Kennwort zurücksetzen, Sitzungen widerrufen und Risiko bestätigen bzw. schließen.',
    needs: ['riskyUsers'],
    run(ctx) {
      const r = ctx.d.riskyUsers;
      return r.length ? { status: r.some((x) => x.riskLevel === 'high') ? 'fail' : 'warn', summary: plural(r.length, 'Benutzer gilt', 'Benutzer gelten') + ' als gefährdet.', head: ['Benutzer', 'Risiko', 'Seit'], rows: r.map((x) => [(x.userDisplayName || '') + ' (' + x.userPrincipalName + ')', { high: 'Hoch', medium: 'Mittel', low: 'Niedrig' }[x.riskLevel] || x.riskLevel, fmtD(x.riskLastUpdatedDateTime)]) } : { status: 'pass', summary: 'Keine offenen Risikobenutzer.' };
    } },
  { id: 'DF-03', cat: 'defender', sev: 'medium', title: 'Keine offenen Sicherheitswarnungen mit hohem Schweregrad', effort: 'medium', iso: ['A.5.25', 'A.8.16'], nis2: ['21b'],
    why: 'Offene Warnungen in Microsoft Defender können auf laufende Angriffe hinweisen.',
    fix: 'Warnungen im Defender-Portal › Vorfälle und Warnungen bearbeiten; Verantwortlichkeit und Reaktionszeiten festlegen.',
    needs: ['alerts'],
    run(ctx) {
      const a = ctx.d.alerts;
      const hi = a.filter((x) => x.severity === 'high');
      const rows = a.slice(0, 100).map((x) => [x.title, { high: 'Hoch', medium: 'Mittel', low: 'Niedrig', informational: 'Info' }[x.severity] || x.severity, x.serviceSource || '', fmtD(x.createdDateTime)]);
      if (!a.length) return { status: 'pass', summary: 'Keine offenen Warnungen.' };
      return { status: hi.length ? 'fail' : 'warn', summary: a.length + ' offene Warnungen, davon ' + hi.length + ' hoch.', head: ['Warnung', 'Schweregrad', 'Quelle', 'Erstellt'], rows };
    } },

  // ----- Datensicherung -----
  { id: 'BK-01', cat: 'backup', sev: 'medium', title: 'Microsoft-365-Daten werden gesichert', effort: 'medium', iso: ['A.8.13'], nis2: ['21c'],
    why: 'Papierkorb und Aufbewahrung ersetzen keine Sicherung – etwa bei Ransomware, versehentlicher Massenlöschung oder einem kompromittierten Admin.',
    fix: 'Microsoft 365 Backup (Microsoft 365 Admin Center › Einstellungen › Microsoft 365 Backup) oder eine Drittanbieter-Sicherung einrichten.',
    run(ctx) {
      const ans = ctx.answers.Q16;
      const b = ctx.d.backup;
      const st = b && b.serviceStatus && b.serviceStatus.status;
      if (st === 'enabled' || st === 'protectionChangeLocked' || st === 'restoreLocked') return { status: 'pass', summary: 'Microsoft 365 Backup ist aktiviert.' };
      if (ans === 'yes') return { status: 'pass', summary: 'Laut Fragebogen wird eine (Drittanbieter-)Sicherung eingesetzt.' };
      if (ans === 'partial') return { status: 'warn', summary: 'Laut Fragebogen werden nur Teile gesichert.' };
      if (ans === 'no') return { status: 'fail', summary: 'Laut Fragebogen keine Sicherung; Microsoft 365 Backup ist nicht aktiv.' };
      if (st) return { status: 'warn', summary: 'Microsoft 365 Backup ist nicht aktiv. Drittanbieter-Sicherung? Bitte im Fragebogen beantworten.' };
      return na('Microsoft 365 Backup nicht lesbar – bitte Frage Q16 im Fragebogen beantworten.');
    } },

  // ----- Copilot -----
  { id: 'CP-01', cat: 'copilot', sev: 'info', title: 'Microsoft 365 Copilot im Mandanten', effort: 'low', iso: ['A.5.10', 'A.5.15'], nis2: [],
    why: 'Mit Copilot werden bestehende Berechtigungsprobleme sichtbar: Copilot findet alles, worauf ein Benutzer zugreifen darf.',
    fix: 'Vor dem breiten Rollout Freigaben bereinigen (siehe SharePoint- und Gäste-Prüfungen), Vertraulichkeitsbezeichnungen einführen und eine KI-Richtlinie veröffentlichen.',
    needs: ['skus'],
    run(ctx) {
      const s = ctx.copilotSeats;
      return { status: 'info', summary: s.total ? s.used + ' von ' + s.total + ' Copilot-Lizenzen zugewiesen.' : 'Keine Microsoft-365-Copilot-Lizenzen im Mandanten.' };
    } },
  { id: 'CP-02', cat: 'copilot', sev: 'medium', title: 'Copilot-Readiness: technische Freigabe-Grundlagen', effort: 'medium', iso: ['A.5.15', 'A.8.3', 'A.8.12'], nis2: ['21i'],
    why: 'Zusammenfassung der Einstellungen, die Übersharing an Copilot begünstigen: anonyme Links, offene Gastrechte und uneingeschränkte App-Zustimmung.',
    fix: 'Die verknüpften Befunde SP-01, GU-02 und AP-01 beheben; zusätzlich Restricted Content Discovery bzw. SharePoint Advanced Management für sensible Sites prüfen.',
    derived: ['SP-01', 'GU-02', 'AP-01'],
    run() { return { status: 'info', summary: '' }; } }
];

// Auswertung DNS über alle Maildomänen: schlechtester Status gewinnt
function dnsEval(ctx, fn) {
  const dns = ctx.snap.dns;
  if (dns === null || dns === undefined) return na('DNS-Prüfung wurde nicht ausgeführt (beim Start deaktiviert oder nicht erreichbar).');
  if (!dns.length) return { status: 'info', summary: 'Keine eigenen Maildomänen (nur onmicrosoft.com).' };
  const order = { fail: 0, warn: 1, pass: 2, info: 3 };
  const rows = [];
  let worst = 'info';
  let ok = 0, rel = 0;
  for (const r of dns) {
    if (r.error) { rows.push([r.domain, 'Fehler', r.error]); continue; }
    const [st, txt] = fn(r);
    rows.push([r.domain, { pass: 'OK', warn: 'Prüfen', fail: 'Fehlt/falsch', info: '—' }[st], txt]);
    if (st !== 'info') { rel++; if (st === 'pass') ok++; }
    if (order[st] < order[worst]) worst = st;
  }
  return { status: worst, summary: rel ? ok + ' von ' + rel + ' Domänen in Ordnung.' : plural(dns.length, 'Domäne', 'Domänen') + ' ausgewertet.', head: ['Domäne', 'Ergebnis', 'Details'], rows };
}

// ---------------------------------------------------------------------------
// Secure-Score-Kontrollen als zusätzliche Prüfungen (Exchange, Defender, Teams, Purview …)
// ---------------------------------------------------------------------------
const stripHtml = (s) => String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|div)>/gi, '\n').replace(/<li>/gi, '• ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();
function ssCategory(service, ctrlCat) {
  const s = String(service || '').toLowerCase();
  if (/azuread|entra|aad|azure active/.test(s)) return null; // durch eigene Prüfungen abgedeckt
  if (/exchange|exo|mdo|office 365|defender for office/.test(s)) return 'mail';
  if (/teams/.test(s)) return 'teams';
  if (/sharepoint|spo|onedrive/.test(s)) return 'daten';
  if (/mip|purview|information protection|dlp|compliance/.test(s)) return 'purview';
  if (/intune|mde|endpoint|windows/.test(s)) return 'geraete';
  if (/mcas|cloud app|mda|identity|mdi|atp/.test(s)) return 'defender';
  if (String(ctrlCat || '').toLowerCase() === 'device') return 'geraete';
  if (String(ctrlCat || '').toLowerCase() === 'data') return 'purview';
  return 'defender';
}
const SS_ISO = { mail: ['A.8.7', 'A.5.14'], teams: ['A.5.14', 'A.5.15'], daten: ['A.5.14', 'A.8.12'], purview: ['A.8.12', 'A.5.12'], geraete: ['A.8.1', 'A.8.7'], defender: ['A.8.16', 'A.8.7'] };
const SS_NIS2 = { mail: ['21e'], teams: ['21i'], daten: ['21i'], purview: ['21i'], geraete: ['21e', '21i'], defender: ['21b', '21e'] };
const SS_EFFORT = { low: 'low', moderate: 'medium', high: 'high' };

export function secureScoreChecks(snap) {
  const prof = (snap.data || {}).secureControls;
  const ss = (snap.data || {}).secureScore;
  if (!prof || !ss) return [];
  const scores = new Map((ss.controlScores || []).map((c) => [c.controlName, c]));
  const out = [];
  for (const p of prof) {
    if (p.deprecated) continue;
    const sc = scores.get(p.id);
    if (!sc) continue;
    const cat = ssCategory(p.service, p.controlCategory);
    if (!cat) continue;
    const max = p.maxScore || 0;
    const sev = max >= 8 ? 'high' : max >= 4 ? 'medium' : 'low';
    const upd = (p.controlStateUpdates || []).slice(-1)[0];
    const state = upd && upd.state;
    const got = sc.score || 0;
    let status = got >= max && max > 0 ? 'pass' : got > 0 ? 'warn' : 'fail';
    let summary = Math.round(got * 10) / 10 + ' von ' + max + ' Punkten' + (sc.implementationStatus ? ' – ' + stripHtml(sc.implementationStatus) : '') + '.';
    if (state && /ignored|thirdparty|resolved/i.test(state) && status !== 'pass') { status = 'info'; summary = 'In Secure Score als „' + ({ Ignored: 'Risiko akzeptiert', ThirdParty: 'durch Drittanbieter gelöst', Resolved: 'gelöst' }[state] || state) + '“ markiert. ' + summary; }
    out.push({
      id: 'SS-' + p.id, cat, sev, title: p.title, source: 'securescore', service: p.service,
      why: (p.threats && p.threats.length ? 'Bedrohungen: ' + p.threats.join(', ') + '. ' : '') + (p.userImpact ? 'Auswirkung auf Benutzer: ' + p.userImpact + '.' : ''),
      fix: stripHtml(p.remediation) || 'Siehe Microsoft Defender › Secure Score.', fixLang: 'en',
      effort: SS_EFFORT[String(p.implementationCost || '').toLowerCase()] || 'medium',
      iso: SS_ISO[cat], nis2: SS_NIS2[cat], ref: p.actionUrl || '',
      result: { status, summary, metric: Math.round(got * 10) / 10 + '/' + max }
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Gesamtauswertung
// ---------------------------------------------------------------------------
export const STATUS_SCORE = { pass: 1, warn: 0.5, fail: 0 };

export function priorityOf(r) {
  if (r.status === 'fail' && r.sev === 'high') return 1;
  if ((r.status === 'fail' && r.sev === 'medium') || (r.status === 'warn' && r.sev === 'high')) return 2;
  if (r.status === 'fail' || r.status === 'warn') return 3;
  return 0;
}
export const PRIO = { 1: 'Sofort', 2: 'Kurzfristig', 3: 'Mittelfristig' };

export function scoreOf(list) {
  let got = 0, max = 0;
  for (const r of list) {
    if (!(r.status in STATUS_SCORE)) continue;
    const w = WEIGHT[r.sev] || 0;
    got += w * STATUS_SCORE[r.status];
    max += w;
  }
  return max ? Math.round(got / max * 100) : null;
}
export function rating(score) {
  if (score === null || score === undefined) return { label: 'Keine Bewertung', tone: 'neutral' };
  if (score >= 80) return { label: 'Gut aufgestellt', tone: 'ok' };
  if (score >= 60) return { label: 'Solide mit Lücken', tone: 'info' };
  if (score >= 40) return { label: 'Erhöhtes Risiko', tone: 'warn' };
  return { label: 'Hohes Risiko', tone: 'bad' };
}

export function evaluate(snap, extra) {
  const ex = extra || {};
  const answers = ex.answers || {};
  const accepted = ex.accepted || {};
  const ctx = buildContext(snap, { answers });
  const results = [];
  const byId = new Map();
  for (const c of CHECKS) {
    let res;
    if (!c.derived) {
      const miss = c.needs ? needs(ctx, c.needs) : '';
      try { res = miss ? na(miss) : c.run(ctx); } catch (e) { res = na('Auswertung nicht möglich: ' + (e.message || e)); }
    }
    const r = Object.assign({ source: c.dns ? 'dns' : 'graph' }, c, res || {});
    delete r.run; delete r.needs;
    results.push(r);
    byId.set(r.id, r);
  }
  // Abgeleitete Prüfungen
  for (const r of results.filter((x) => x.derived)) {
    const parts = r.derived.map((id) => byId.get(id)).filter(Boolean);
    const sc = parts.filter((p) => p.status in STATUS_SCORE);
    if (!sc.length) { r.status = 'na'; r.summary = 'Nicht prüfbar – zugrunde liegende Prüfungen fehlen.'; continue; }
    const bad = sc.filter((p) => p.status !== 'pass');
    r.status = !bad.length ? 'pass' : bad.some((p) => p.status === 'fail') ? 'fail' : 'warn';
    r.summary = !bad.length ? 'Alle Grundlagen erfüllt.' : 'Offen: ' + bad.map((p) => p.id).join(', ') + '.';
    r.head = ['Prüfung', 'Ergebnis']; r.rows = parts.map((p) => [p.id + ' ' + p.title, ({ pass: 'Erfüllt', warn: 'Teilweise', fail: 'Nicht erfüllt', na: 'Nicht prüfbar', info: 'Info' })[p.status]]);
  }
  for (const s of secureScoreChecks(snap)) { const r = Object.assign({}, s, s.result); delete r.result; results.push(r); }
  for (const q of QUESTIONS) {
    const a = answers[q.id];
    const status = a === 'yes' ? 'pass' : a === 'partial' ? 'warn' : a === 'no' ? 'fail' : a === 'na' ? 'info' : 'open';
    results.push({ id: q.id, cat: q.cat, sev: q.sev, title: q.title, why: q.help, fix: q.fix, iso: q.iso, nis2: q.nis2, effort: 'medium', source: 'question', status, answer: a || '', summary: a ? 'Antwort: ' + { yes: 'Ja', partial: 'Teilweise', no: 'Nein', na: 'Nicht relevant' }[a] : 'Noch nicht beantwortet.' });
  }
  // Risikoakzeptanz
  for (const r of results) {
    if (accepted[r.id] && (r.status === 'fail' || r.status === 'warn')) { r.origStatus = r.status; r.status = 'info'; r.accepted = accepted[r.id]; r.summary = 'Risiko akzeptiert' + (typeof accepted[r.id] === 'string' ? ': ' + accepted[r.id] : '') + '. Ursprünglich: ' + r.summary; }
    r.prio = priorityOf(r);
    r.licMissing = r.lic ? !ctx.lic[r.lic] && ctx.licKnown : false;
  }
  const byCat = CATEGORIES.map((c) => {
    const list = results.filter((r) => r.cat === c.key);
    const cnt = (s) => list.filter((r) => r.status === s).length;
    return { key: c.key, label: c.label, short: c.short, total: list.length, score: scoreOf(list), pass: cnt('pass'), warn: cnt('warn'), fail: cnt('fail'), info: cnt('info'), na: cnt('na'), open: cnt('open') };
  }).filter((c) => c.total);
  const technical = results.filter((r) => r.source !== 'question');
  const cnt = (s) => results.filter((r) => r.status === s).length;
  return {
    results, byCat, ctx,
    score: scoreOf(results), scoreTech: scoreOf(technical), scoreOrg: scoreOf(results.filter((r) => r.source === 'question')),
    counts: { total: results.length, technical: technical.length, questions: QUESTIONS.length, securescore: results.filter((r) => r.source === 'securescore').length, pass: cnt('pass'), warn: cnt('warn'), fail: cnt('fail'), info: cnt('info'), na: cnt('na'), open: cnt('open') },
    licenses: LICENSES.map((l) => ({ key: l.key, label: l.label, hint: l.hint, has: !!ctx.lic[l.key] })),
    secureScore: ctx.secureScore,
    plan: results.filter((r) => r.prio).sort((a, b) => a.prio - b.prio || (WEIGHT[b.sev] - WEIGHT[a.sev]) || ({ low: 0, medium: 1, high: 2 }[a.effort] - { low: 0, medium: 1, high: 2 }[b.effort]) || a.id.localeCompare(b.id)),
    quickWins: results.filter((r) => r.prio && r.effort === 'low' && (r.sev === 'high' || r.sev === 'medium'))
  };
}
