// End-to-End-Test der Datenerfassung gegen eine simulierte Graph-API und simuliertes DNS-over-HTTPS.
import assert from 'node:assert/strict';
globalThis.location = { origin: 'http://localhost:8410' };
globalThis.sessionStorage = { clear() {} };
globalThis.msal = { PublicClientApplication: class { async initialize() {} getAllAccounts() { return []; } async loginPopup() { return { account: { username: 'admin@kunde.de' } }; } setActiveAccount() {} async acquireTokenSilent() { return { accessToken: 't' }; } } };

const { demoSnapshot } = await import('../web/js/demo.js');
const G = await import('../web/js/graph.js');
const { scanTenant } = await import('../web/js/collector.js');
const { evaluate } = await import('../web/js/checks.js');

const demo = demoSnapshot().data;
const GRAPH = 'https://graph.microsoft.com';
const seen = [];
const route = (path) => {
  const p = decodeURIComponent(path);
  if (p.startsWith('/v1.0/organization')) return { value: [{ id: 'tid-1', displayName: 'Kunde AG', verifiedDomains: [{ name: 'kunde.de', isDefault: true }, { name: 'kunde.onmicrosoft.com', isInitial: true }] }] };
  if (p.startsWith('/v1.0/domains')) return { value: [{ id: 'kunde.de', isVerified: true, supportedServices: ['Email'], passwordValidityPeriodInDays: 2147483647 }, { id: 'kunde.onmicrosoft.com', isVerified: true, supportedServices: ['Email'] }] };
  if (p.startsWith('/v1.0/subscribedSkus')) return { value: demo.skus };
  if (p.startsWith('/v1.0/policies/identitySecurityDefaults')) return { isEnabled: false };
  if (p.startsWith('/v1.0/identity/conditionalAccess/policies')) return { value: demo.ca.slice(0, 2), '@odata.nextLink': GRAPH + '/v1.0/capage2' };
  if (p.startsWith('/v1.0/capage2')) return { value: demo.ca.slice(2) };
  if (p.startsWith('/v1.0/policies/authenticationStrengthPolicies')) return { value: demo.authStrengths };
  if (p.startsWith('/v1.0/policies/authenticationMethodsPolicy')) return demo.authMethods;
  if (p.startsWith('/v1.0/policies/authorizationPolicy')) return demo.authz;
  if (p.startsWith('/v1.0/policies/adminConsentRequestPolicy')) return demo.adminConsent;
  if (p.startsWith('/v1.0/groupSettings')) return { value: [] };
  if (p.startsWith('/beta/roleManagement/directory/roleDefinitions')) return { value: demo.roleDefs };
  if (p.startsWith('/v1.0/roleManagement/directory/roleAssignments')) return { value: demo.roleAssignments };
  if (p.startsWith('/v1.0/roleManagement/directory/roleEligibilitySchedules')) return { status: 403, body: { error: { code: 'AadPremiumLicenseRequired', message: 'The tenant needs an AAD Premium 2 license.' } } };
  if (p.startsWith('/v1.0/roleManagement/directory/roleAssignmentSchedules')) return { status: 403, body: { error: { code: 'AadPremiumLicenseRequired', message: 'The tenant needs an AAD Premium 2 license.' } } };
  if (p.startsWith('/v1.0/users') && p.includes('signInActivity')) return { status: 403, body: { error: { code: 'Authentication_RequestFromNonPremiumTenantOrB2CTenant', message: 'Neither tenant is B2C or tenant doesn\'t have premium license' } } };
  if (p.startsWith('/v1.0/users')) return { value: demo.users.map((u) => { const x = Object.assign({}, u); delete x.signInActivity; return x; }) };
  if (p.startsWith('/v1.0/reports/authenticationMethods/userRegistrationDetails')) return { value: demo.regDetails };
  if (p.startsWith('/v1.0/identityProtection/riskyUsers')) return { status: 403, body: { error: { code: 'Forbidden', message: 'Your tenant is not licensed for this feature.' } } };
  if (p.startsWith('/v1.0/applications')) return { value: demo.apps };
  if (p.startsWith('/v1.0/servicePrincipals(appId=\'00000003-0000-0000-c000-000000000000\')/appRoleAssignedTo')) return { value: demo.graphAssigned };
  if (p.startsWith('/v1.0/servicePrincipals(appId=')) return demo.graphSp;
  if (p.startsWith('/v1.0/servicePrincipals')) return { value: demo.sps };
  if (p.startsWith('/v1.0/oauth2PermissionGrants')) return { value: demo.grants };
  if (p.startsWith('/v1.0/admin/sharepoint/settings')) return { status: 403, body: { error: { code: 'accessDenied', message: 'Access denied' } } };
  if (p.startsWith('/v1.0/security/secureScores')) return { value: [demo.secureScore] };
  if (p.startsWith('/v1.0/security/secureScoreControlProfiles')) return { value: demo.secureControls };
  if (p.startsWith('/v1.0/security/alerts_v2')) return { value: demo.alerts };
  if (p.startsWith('/v1.0/deviceManagement/deviceCompliancePolicies')) return { value: demo.compliance };
  if (p.startsWith('/v1.0/deviceManagement/managedDevices')) return { value: demo.devices };
  if (p.startsWith('/v1.0/deviceManagement')) return demo.intuneSettings;
  if (p.startsWith('/v1.0/solutions/backupRestore')) return { status: 404, body: { error: { code: 'NotFound', message: 'not found' } } };
  return { status: 400, body: { error: { code: 'BadRequest', message: 'Unbekannter Pfad im Test: ' + p } } };
};
const dns = {
  'kunde.de|MX': [{ type: 15, data: '0 kunde-de.mail.protection.outlook.com.' }],
  'kunde.de|TXT': [{ type: 16, data: '"v=spf1 include:spf.protection.outlook.com" " -all"' }, { type: 16, data: '"MS=ms123"' }],
  '_dmarc.kunde.de|TXT': [{ type: 16, data: '"v=DMARC1; p=reject; rua=mailto:d@kunde.de"' }],
  'selector1._domainkey.kunde.de|TXT': [{ type: 5, data: 'selector1-kunde-de._domainkey.kunde.r-v1.dkim.mail.microsoft.' }, { type: 16, data: '"v=DKIM1; k=rsa; p=MIGf..."' }],
  'selector2._domainkey.kunde.de|TXT': [{ type: 5, data: 'selector2-kunde-de._domainkey.kunde.r-v1.dkim.mail.microsoft.' }]
};
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  if (u.startsWith('https://cloudflare-dns.com/')) {
    const q = new URL(u).searchParams;
    const a = dns[q.get('name') + '|' + q.get('type')];
    return { ok: true, status: 200, json: async () => ({ Status: a ? 0 : 3, Answer: a }) };
  }
  assert.equal(opts.method, 'GET', 'nur lesende Aufrufe erlaubt: ' + u);
  const path = u.replace(GRAPH, '');
  seen.push(path);
  const r = route(path);
  const status = r.status || 200;
  const body = r.status ? r.body : r;
  return { ok: status < 300, status, headers: { get: () => null }, json: async () => body };
};

await G.initAuth('client', 'kunde.de');
await G.login();
const rows = {};
const snap = await scanTenant((p) => { rows[p.key] = p.state; }, { dns: true });

assert.equal(snap.tenant.displayName, 'Kunde AG');
assert.equal(snap.tenant.domain, 'kunde.de');
assert.equal(snap.data.ca.length, demo.ca.length, 'Folgeseiten werden geladen');
assert.equal(snap.data.users.withSignIn, false, 'Fallback ohne signInActivity');
assert.equal(snap.errors.pimEligible.kind, 'license');
assert.equal(snap.errors.spo.kind, 'permission');
assert.equal(snap.errors.backup.kind, 'unavailable');
assert.ok(!seen.some((p) => p.includes('$batch')), 'keine Batch-Aufrufe nötig');
assert.equal(snap.dns.length, 1, 'onmicrosoft.com wird nicht per DNS geprüft');
assert.deepEqual(snap.dns[0].spf, ['v=spf1 include:spf.protection.outlook.com -all']);
assert.ok(snap.dns[0].dkim[0].key && !snap.dns[0].dkim[1].key && snap.dns[0].dkim[1].cname);
assert.ok(Object.values(rows).every((s) => s === 'done' || s === 'error'));

const ev = evaluate(snap, {});
const r = (id) => ev.results.find((x) => x.id === id);
assert.equal(r('PA-05').status, 'fail', 'PIM ohne P2 ist ein Befund');
assert.equal(r('GU-07').status, 'na', 'ohne Anmeldedaten nicht prüfbar');
assert.equal(r('SP-01').status, 'na');
assert.match(r('SP-01').summary, /Keine Berechtigung/);
assert.equal(r('ML-01').status, 'pass');
assert.equal(r('ML-02').status, 'pass');
assert.equal(r('ML-03').status, 'pass');
assert.equal(r('BK-01').status, 'na');
assert.ok(ev.score > 0 && ev.score < 100);
console.log('scan-mock: OK –', Object.keys(snap.data).length, 'Quellen gelesen,', Object.keys(snap.errors).length, 'mit Einschränkung, Score', ev.score);
