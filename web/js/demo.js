// Demo-Mandant mit Beispieldaten (frei erfunden) – zum Ausprobieren, für Screenshots und Tests.
const T0 = Date.parse('2026-11-20T09:00:00Z');
const ago = (d) => new Date(T0 - d * 86400000).toISOString();
const ahead = (d) => new Date(T0 + d * 86400000).toISOString();
const TENANT = '7a3c1f20-0d5e-4b8a-9c11-3e2f4d5a6b7c';
const DOM = 'muster-maschinenbau.de';

let seed = 42;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const gid = (n) => '00000000-0000-4000-8000-' + String(n).padStart(12, '0');

const FIRST = ['Anna', 'Ben', 'Clara', 'David', 'Eva', 'Felix', 'Greta', 'Hannes', 'Ida', 'Jonas', 'Katrin', 'Lukas', 'Mia', 'Noah', 'Olga', 'Paul', 'Rita', 'Stefan', 'Tina', 'Uwe', 'Vera', 'Wolfgang', 'Yasemin', 'Zoe'];
const LAST = ['Becker', 'Schulz', 'Wagner', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hartmann', 'Lange', 'Werner'];

function users() {
  const u = [];
  let n = 1;
  const mk = (dn, upn, o) => u.push(Object.assign({ id: gid(n++), displayName: dn, userPrincipalName: upn, userType: 'Member', accountEnabled: true, onPremisesSyncEnabled: true, createdDateTime: ago(900 + Math.floor(rnd() * 600)), signInActivity: { lastSignInDateTime: ago(Math.floor(rnd() * 5)), lastSuccessfulSignInDateTime: ago(Math.floor(rnd() * 5)) } }, o || {}));
  mk('Thomas Admin', 'thomas.admin@' + DOM, {});
  mk('Sabine Krause', 'sabine.krause@' + DOM, {});
  mk('IT-Dienstleister Admin', 'admin@musterbau.onmicrosoft.com', { onPremisesSyncEnabled: null });
  mk('Notfallkonto 1', 'bg-01@musterbau.onmicrosoft.com', { onPremisesSyncEnabled: null, signInActivity: { lastSignInDateTime: ago(120) } });
  mk('Martin Altadmin', 'martin.altadmin@' + DOM, { signInActivity: { lastSignInDateTime: ago(210) } });
  mk('Petra Exchange', 'petra.vogel@' + DOM, {});
  for (let i = 0; i < 132; i++) {
    const f = FIRST[i % FIRST.length], l = LAST[(i * 7) % LAST.length];
    const inactive = i % 23 === 5;
    mk(f + ' ' + l, (f + '.' + l + (i > 23 ? i : '')).toLowerCase().replace('ü', 'ue').replace('ö', 'oe') + '@' + DOM, inactive ? { signInActivity: { lastSignInDateTime: ago(130 + i) } } : {});
  }
  for (let i = 0; i < 4; i++) mk(['Empfang', 'Besprechung EG', 'Besprechung OG', 'Buchhaltung Postfach'][i], ['empfang', 'raum-eg', 'raum-og', 'buchhaltung'][i] + '@' + DOM, { signInActivity: {} });
  const partners = ['partner-ing.de', 'zulieferer-ag.com', 'steuerberatung-x.de'];
  for (let i = 0; i < 26; i++) mk('Gast ' + (i + 1) + ' (' + partners[i % 3] + ')', 'gast' + (i + 1) + '_' + partners[i % 3].replace('.', '-') + '#EXT#@musterbau.onmicrosoft.com', { userType: 'Guest', onPremisesSyncEnabled: null, createdDateTime: ago(200 + i * 20), signInActivity: i % 2 ? { lastSignInDateTime: ago(150 + i * 10) } : { lastSignInDateTime: ago(10 + i) } });
  u.withSignIn = true;
  return u;
}

const GA = '62e90394-69f5-4237-9190-012177145e10';
const EXA = '29232cdf-9323-42fd-ade2-1d097af3e4de';
const USA = 'fe930be7-5e62-47db-91af-98c3a49a38b1';
const GR = 'f2ef992c-3afb-46b9-b7cf-a126ee74c451';

function secure() {
  const P = (id, title, service, max, score, cost, remediation, status, cat) => ({ id, title, service, maxScore: max, implementationCost: cost, userImpact: 'Low', controlCategory: cat || 'Apps', threats: [], deprecated: false, remediation, actionUrl: '', controlStateUpdates: [], _score: score, _status: status });
  const list = [
    P('mdo_safelinksforOfficeApps', 'Ensure Safe Links for Office applications is enabled', 'MDO', 8, 0, 'Low', '<p>Turn on Safe Links for Office applications in the Safe Links policy.</p>', 'Not configured'),
    P('mdo_safeattachments', 'Turn on Safe Attachments in block mode', 'MDO', 8, 0, 'Low', '<p>Create a Safe Attachments policy with action <b>Block</b> and apply it to all recipients.</p>', 'Not configured'),
    P('mdo_atpprotection', 'Turn on Microsoft Defender for Office 365 in SharePoint, OneDrive, and Microsoft Teams', 'MDO', 8, 8, 'Low', '<p>Enable ATP for SharePoint, OneDrive and Teams.</p>', 'Enabled'),
    P('mdo_antiphishingpolicies', 'Set the phishing email level threshold at 2 or higher', 'MDO', 9, 4.5, 'Low', '<p>Raise the phishing threshold in the anti-phishing policy.</p>', 'Partially configured'),
    P('mdo_mailboxintelligence', 'Enable mailbox intelligence protection in anti-phishing policies', 'MDO', 8, 8, 'Low', '<p>Enable mailbox intelligence.</p>', 'Enabled'),
    P('mdo_impersonationprotection', 'Enable impersonated user protection', 'MDO', 8, 0, 'Moderate', '<p>Add executives and finance staff as protected users.</p>', 'Not configured'),
    P('mdo_autoforwardingmode', 'Ensure all forms of mail forwarding are blocked and/or disabled', 'Exchange', 8, 0, 'Low', '<p>Set automatic forwarding to <b>Off</b> in the outbound spam policy.</p>', 'Automatic forwarding is allowed'),
    P('exo_mailboxaudit', 'Ensure mailbox auditing for all users is enabled', 'Exchange', 6, 6, 'Low', '<p>Mailbox auditing is on by default.</p>', 'Enabled'),
    P('exo_storageproviderrestricted', 'Ensure additional storage providers are restricted in Outlook on the web', 'Exchange', 3, 0, 'Low', '<p>Set-OwaMailboxPolicy -AdditionalStorageProvidersAvailable $false</p>', 'Not restricted'),
    P('exo_oauth2clientprofileenabled', 'Ensure modern authentication for Exchange Online is enabled', 'Exchange', 9, 9, 'Low', '<p>Enabled.</p>', 'Enabled'),
    P('exo_transportrules_domainwhitelist', 'Ensure mail transport rules do not allow specific domains', 'Exchange', 6, 6, 'Low', '<p>Remove allow rules.</p>', 'No rules found'),
    P('mdo_commonattachmentsfilter', 'Ensure the common attachment types filter is enabled', 'MDO', 5, 5, 'Low', '<p>Enabled.</p>', 'Enabled'),
    P('mdo_zapspam', 'Ensure Zero-hour auto purge for spam and phishing is enabled', 'MDO', 5, 5, 'Low', '<p>Enabled.</p>', 'Enabled'),
    P('meeting_externalrequestjoin', 'Only invited users should be automatically admitted to Teams meetings', 'Teams', 5, 0, 'Low', '<p>Set <i>Who can bypass the lobby</i> to <b>People in my org</b>.</p>', 'Everyone can bypass the lobby'),
    P('meeting_anonymousjoin', 'Ensure anonymous users can\'t start Teams meetings', 'Teams', 4, 4, 'Low', '<p>Disable anonymous meeting start.</p>', 'Configured'),
    P('teams_externalaccess', 'Ensure external domains are restricted in Teams admin center', 'Teams', 5, 0, 'Moderate', '<p>Allow only specific external domains.</p>', 'All external domains allowed'),
    P('teams_unmanagedcommunication', 'Ensure communication with unmanaged Teams users is disabled', 'Teams', 4, 0, 'Low', '<p>Disable communication with Teams personal accounts.</p>', 'Enabled'),
    P('spo_idlesessiontimeout', 'Ensure idle session timeout is set', 'SPO', 5, 0, 'Low', '<p>Configure idle session sign-out.</p>', 'Not configured'),
    P('mip_sensitivitylabelspolicies', 'Publish M365 sensitivity label data classification policies', 'MIP', 6, 0, 'Moderate', '<p>Create and publish sensitivity labels.</p>', 'No labels published'),
    P('mip_DLPpolicies', 'Create a DLP policy', 'MIP', 6, 0, 'Moderate', '<p>Create DLP policies for sensitive information types.</p>', 'No DLP policy'),
    P('mip_autosensitivitylabelspolicies', 'Extend M365 sensitivity labeling to assets in Microsoft Purview data map', 'MIP', 3, 0, 'High', '<p>Configure auto-labeling.</p>', 'Not configured'),
    P('mip_search_auditlog', 'Ensure Microsoft 365 audit log search is enabled', 'MIP', 8, 8, 'Low', '<p>Enabled.</p>', 'Enabled'),
    P('scid_2010', 'Turn on Microsoft Defender Antivirus PUA protection in block mode', 'MDE', 4, 2, 'Low', '<p>Configure PUA protection.</p>', '50% devices'),
    P('scid_2090', 'Block credential stealing from the Windows local security authority subsystem', 'MDE', 7, 7, 'Low', '<p>Enable ASR rule.</p>', 'Enabled'),
    P('scid_2096', 'Block Office applications from creating child processes', 'MDE', 7, 0, 'Moderate', '<p>Enable ASR rule in block mode.</p>', 'Audit mode'),
    P('scid_91', 'Turn on Tamper Protection', 'MDE', 6, 6, 'Low', '<p>Enabled.</p>', 'Enabled'),
    P('AATP_SensorHealth', 'Resolve Defender for Identity health issues', 'MDI', 3, 3, 'Low', '<p>-</p>', 'Healthy')
  ];
  const controlScores = list.map((p) => ({ controlName: p.id, controlCategory: p.controlCategory, score: p._score, implementationStatus: p._status }));
  // Entra-Kontrollen (werden von der App bewusst ausgeblendet, da eigene Prüfungen)
  controlScores.push({ controlName: 'MFARegistrationV2', controlCategory: 'Identity', score: 6 }, { controlName: 'BlockLegacyAuthentication', controlCategory: 'Identity', score: 8 });
  const profiles = list.map((p) => { const x = Object.assign({}, p); delete x._score; delete x._status; return x; }).concat([
    { id: 'MFARegistrationV2', title: 'Ensure multifactor authentication is enabled for all users', service: 'AzureAD', maxScore: 9, deprecated: false },
    { id: 'BlockLegacyAuthentication', title: 'Enable Conditional Access policies to block legacy authentication', service: 'AzureAD', maxScore: 8, deprecated: false }
  ]);
  profiles.find((p) => p.id === 'teams_unmanagedcommunication').controlStateUpdates = [{ state: 'Ignored', comment: 'Fachbereich braucht Kontakt zu Lieferanten', updatedBy: 'thomas.admin@' + DOM, updatedDateTime: ago(40) }];
  const cur = controlScores.reduce((a, c) => a + c.score, 0) + 61;
  return {
    score: { id: TENANT + '_2026-11-20', createdDateTime: ago(0), currentScore: cur, maxScore: 312, averageComparativeScores: [{ basis: 'AllTenants', averageScore: 141.2 }, { basis: 'TotalSeats', averageScore: 152.8 }], controlScores },
    profiles
  };
}

function devices() {
  const out = [];
  const os = ['Windows', 'Windows', 'Windows', 'Windows', 'iOS', 'Android', 'macOS'];
  for (let i = 0; i < 118; i++) {
    const o = os[i % os.length];
    out.push({ id: gid(5000 + i), operatingSystem: o, complianceState: i % 9 === 3 ? 'noncompliant' : i % 31 === 7 ? 'inGracePeriod' : 'compliant', isEncrypted: o === 'Windows' ? i % 13 !== 2 : o === 'macOS' ? i % 2 === 0 : true, lastSyncDateTime: ago(i % 17 === 4 ? 45 : i % 5), managedDeviceOwnerType: o === 'Android' && i % 2 ? 'personal' : 'company' });
  }
  return out;
}

export function demoSnapshot() {
  seed = 42;
  const u = users();
  const byUpn = (s) => u.find((x) => x.userPrincipalName.startsWith(s));
  const ss = secure();
  const assign = (role, user, i) => ({ id: 'ra' + i, roleDefinitionId: role, principalId: user.id, directoryScopeId: '/', principal: { '@odata.type': '#microsoft.graph.user', id: user.id, displayName: user.displayName, userPrincipalName: user.userPrincipalName } });
  const app = { id: gid(9001), displayName: 'Backup-Connector (Drittanbieter)' };
  const regDetails = u.filter((x) => x.accountEnabled).map((x, i) => ({ id: x.id, userPrincipalName: x.userPrincipalName, userDisplayName: x.displayName, userType: x.userType === 'Guest' ? 'guest' : 'member', isAdmin: ['thomas.admin', 'sabine.krause', 'admin@musterbau', 'bg-01', 'martin.altadmin', 'petra.vogel'].some((p) => x.userPrincipalName.startsWith(p)), isMfaRegistered: !(i % 11 === 6 || x.userPrincipalName.startsWith('martin.altadmin') || /^(empfang|raum|buchhaltung)/.test(x.userPrincipalName)), methodsRegistered: ['microsoftAuthenticatorPush'] }));
  return {
    tool: 'm365-security-check', format: 1, demo: true,
    scannedAt: '2026-11-20T09:00:00.000Z', scannedBy: 'demo@' + DOM,
    tenant: { id: TENANT, displayName: 'Muster Maschinenbau GmbH', domain: DOM, initialDomain: 'musterbau.onmicrosoft.com' },
    warnings: [{ source: 'PIM: berechtigte Zuweisungen', message: 'Lizenz fehlt (Entra ID P2): Der Mandant verfügt nicht über Entra ID P2.' }, { source: 'Risikobenutzer (Identity Protection)', message: 'Lizenz fehlt (Entra ID P2).' }],
    errors: {
      pimEligible: { status: 403, kind: 'license', text: 'Lizenz fehlt (Entra ID P2): Der Mandant verfügt nicht über Entra ID P2.' },
      pimActive: { status: 403, kind: 'license', text: 'Lizenz fehlt (Entra ID P2).' },
      riskyUsers: { status: 403, kind: 'license', text: 'Lizenz fehlt (Entra ID P2).' },
      backup: { status: 404, kind: 'unavailable', text: 'Im Mandanten nicht vorhanden bzw. nicht eingerichtet (404).' }
    },
    data: {
      org: { id: TENANT, displayName: 'Muster Maschinenbau GmbH' },
      domains: [
        { id: DOM, isVerified: true, isDefault: true, authenticationType: 'Managed', supportedServices: ['Email', 'OfficeCommunicationsOnline'], passwordValidityPeriodInDays: 90 },
        { id: 'muster-shop.de', isVerified: true, authenticationType: 'Managed', supportedServices: ['Email'], passwordValidityPeriodInDays: 2147483647 },
        { id: 'musterbau.onmicrosoft.com', isVerified: true, isInitial: true, authenticationType: 'Managed', supportedServices: ['Email'], passwordValidityPeriodInDays: 2147483647 }
      ],
      skus: [
        { skuPartNumber: 'SPB', capabilityStatus: 'Enabled', consumedUnits: 128, prepaidUnits: { enabled: 135 }, servicePlans: ['AAD_PREMIUM', 'INTUNE_A', 'ATP_ENTERPRISE', 'MDE_SMB', 'RMS_S_PREMIUM', 'EXCHANGE_S_STANDARD'].map((n) => ({ servicePlanName: n })) },
        { skuPartNumber: 'Microsoft_365_Copilot', capabilityStatus: 'Enabled', consumedUnits: 18, prepaidUnits: { enabled: 25 }, servicePlans: [{ servicePlanName: 'M365_COPILOT_APPS' }] }
      ],
      secDefaults: { isEnabled: false },
      ca: [
        { id: 'ca1', displayName: 'CA01 – MFA für alle Benutzer', state: 'enabled', conditions: { users: { includeUsers: ['All'], excludeUsers: [byUpn('bg-01').id], excludeGroups: [] }, applications: { includeApplications: ['All'] }, clientAppTypes: ['all'] }, grantControls: { operator: 'OR', builtInControls: ['mfa'] } },
        { id: 'ca2', displayName: 'CA02 – Legacy-Authentifizierung blockieren', state: 'enabled', conditions: { users: { includeUsers: ['All'], excludeUsers: [byUpn('bg-01').id] }, applications: { includeApplications: ['All'] }, clientAppTypes: ['exchangeActiveSync', 'other'] }, grantControls: { operator: 'OR', builtInControls: ['block'] } },
        { id: 'ca3', displayName: 'CA03 – Konforme Geräte (Pilot Vertrieb)', state: 'enabled', conditions: { users: { includeUsers: [], includeGroups: ['grp-vertrieb'], excludeUsers: [byUpn('bg-01').id] }, applications: { includeApplications: ['All'] }, clientAppTypes: ['all'] }, grantControls: { operator: 'OR', builtInControls: ['compliantDevice'] } },
        { id: 'ca4', displayName: 'CA04 – Gerätecodefluss blockieren', state: 'enabledForReportingButNotEnforced', conditions: { users: { includeUsers: ['All'] }, applications: { includeApplications: ['All'] }, authenticationFlows: { transferMethods: 'deviceCodeFlow' } }, grantControls: { operator: 'OR', builtInControls: ['block'] } },
        { id: 'ca5', displayName: 'Alt – MFA außerhalb Firmennetz', state: 'disabled', conditions: { users: { includeUsers: ['All'] }, applications: { includeApplications: ['All'] }, locations: { includeLocations: ['All'], excludeLocations: ['AllTrusted'] } }, grantControls: { operator: 'OR', builtInControls: ['mfa'] } }
      ],
      authStrengths: [{ id: '00000000-0000-0000-0000-000000000004', displayName: 'Phishing-resistant MFA', allowedCombinations: ['windowsHelloForBusiness', 'fido2', 'x509CertificateMultiFactor'] }],
      authMethods: { authenticationMethodConfigurations: [{ id: 'Fido2', state: 'disabled' }, { id: 'MicrosoftAuthenticator', state: 'enabled' }, { id: 'Sms', state: 'enabled' }, { id: 'Voice', state: 'disabled' }, { id: 'TemporaryAccessPass', state: 'enabled' }] },
      authz: { allowInvitesFrom: 'adminsGuestInvitersAndAllMembers', guestUserRoleId: '10dae51f-b6af-4016-8d66-8c2a99b929b3', allowEmailVerifiedUsersToJoinOrganization: false, defaultUserRolePermissions: { allowedToCreateApps: true, allowedToCreateSecurityGroups: true, allowedToCreateTenants: true, permissionGrantPoliciesAssigned: ['ManagePermissionGrantsForSelf.microsoft-user-default-legacy'] } },
      adminConsent: { isEnabled: false },
      groupSettings: [],
      roleDefs: [{ id: GA, templateId: GA, displayName: 'Global Administrator', isBuiltIn: true, isPrivileged: true }, { id: EXA, templateId: EXA, displayName: 'Exchange Administrator', isBuiltIn: true, isPrivileged: true }, { id: USA, templateId: USA, displayName: 'User Administrator', isBuiltIn: true, isPrivileged: true }, { id: GR, templateId: GR, displayName: 'Global Reader', isBuiltIn: true, isPrivileged: false }],
      roleAssignments: [
        assign(GA, byUpn('thomas.admin'), 1), assign(GA, byUpn('sabine.krause'), 2), assign(GA, byUpn('admin@musterbau'), 3), assign(GA, byUpn('bg-01'), 4), assign(GA, byUpn('martin.altadmin'), 5),
        assign(EXA, byUpn('petra.vogel'), 6), assign(USA, byUpn('sabine.krause'), 7), assign(GR, byUpn('gast3_'), 8),
        { id: 'ra9', roleDefinitionId: EXA, principalId: app.id, directoryScopeId: '/', principal: { '@odata.type': '#microsoft.graph.servicePrincipal', id: app.id, displayName: app.displayName } }
      ],
      pimEligible: null, pimActive: null,
      users: u,
      regDetails,
      riskyUsers: null,
      apps: [
        { id: 'a1', appId: 'x1', displayName: 'ERP-Schnittstelle', createdDateTime: ago(800), passwordCredentials: [{ startDateTime: ago(700), endDateTime: ahead(12) }], keyCredentials: [] },
        { id: 'a2', appId: 'x2', displayName: 'Intranet-Login', createdDateTime: ago(1500), passwordCredentials: [{ startDateTime: ago(1500), endDateTime: ago(30) }, { startDateTime: ago(300), endDateTime: ahead(2400) }], keyCredentials: [] },
        { id: 'a3', appId: 'x3', displayName: 'Scan-to-Mail', createdDateTime: ago(400), passwordCredentials: [], keyCredentials: [{ startDateTime: ago(300), endDateTime: ahead(400) }] }
      ],
      sps: [
        { id: app.id, appId: 'b1', displayName: app.displayName, appOwnerOrganizationId: '11111111-2222-3333-4444-555555555555', servicePrincipalType: 'Application' },
        { id: gid(9002), appId: 'b2', displayName: 'Signatur-Tool Pro', appOwnerOrganizationId: '66666666-2222-3333-4444-555555555555', servicePrincipalType: 'Application' },
        { id: gid(9003), appId: 'x1', displayName: 'ERP-Schnittstelle', appOwnerOrganizationId: TENANT, servicePrincipalType: 'Application' },
        { id: gid(9004), appId: 'b4', displayName: 'Meeting-Notizen KI (Testversion)', appOwnerOrganizationId: '77777777-2222-3333-4444-555555555555', servicePrincipalType: 'Application' }
      ],
      graphSp: { id: 'g', appRoles: [{ id: 'r1', value: 'Mail.ReadWrite' }, { id: 'r2', value: 'Files.ReadWrite.All' }, { id: 'r3', value: 'User.Read.All' }, { id: 'r4', value: 'MailboxSettings.ReadWrite' }] },
      graphAssigned: [
        { principalId: app.id, principalDisplayName: app.displayName, appRoleId: 'r1' }, { principalId: app.id, principalDisplayName: app.displayName, appRoleId: 'r2' },
        { principalId: gid(9002), principalDisplayName: 'Signatur-Tool Pro', appRoleId: 'r4' }, { principalId: gid(9002), principalDisplayName: 'Signatur-Tool Pro', appRoleId: 'r3' },
        { principalId: gid(9003), principalDisplayName: 'ERP-Schnittstelle', appRoleId: 'r3' }
      ],
      grants: [{ clientId: gid(9004), consentType: 'AllPrincipals', scope: 'openid profile User.Read Calendars.Read Files.Read.All Mail.Read' }],
      spo: { sharingCapability: 'externalUserAndGuestSharing', isResharingByExternalUsersEnabled: true, sharingDomainRestrictionMode: 'none', isUnmanagedSyncAppForTenantRestricted: false, idleSessionSignOut: { isEnabled: false }, isLegacyAuthProtocolsEnabled: false },
      secureScore: ss.score,
      secureControls: ss.profiles,
      alerts: [
        { id: 'al1', title: 'Verdächtige Posteingangsregel erstellt', severity: 'medium', status: 'new', serviceSource: 'microsoftDefenderForOffice365', createdDateTime: ago(3) },
        { id: 'al2', title: 'Mehrere fehlgeschlagene Anmeldeversuche', severity: 'low', status: 'inProgress', serviceSource: 'microsoftDefenderForCloudApps', createdDateTime: ago(6) }
      ],
      intuneSettings: { settings: { secureByDefault: false, deviceComplianceCheckinThresholdDays: 30 } },
      compliance: [
        { '@odata.type': '#microsoft.graph.windows10CompliancePolicy', displayName: 'WIN – Compliance Standard', assignments: [{ id: 'x' }] },
        { '@odata.type': '#microsoft.graph.iosCompliancePolicy', displayName: 'iOS – Compliance', assignments: [{ id: 'y' }] },
        { '@odata.type': '#microsoft.graph.macOSCompliancePolicy', displayName: 'macOS – Test', assignments: [] }
      ],
      devices: devices(),
      backup: null
    },
    dns: [
      { domain: DOM, error: '', mx: ['10 muster-maschinenbau-de.mail.protection.outlook.com'], spf: ['v=spf1 include:spf.protection.outlook.com include:_spf.newsletter-tool.example -all'], dmarc: ['v=DMARC1; p=none; rua=mailto:dmarc@' + DOM], dkim: [{ cname: 'selector1-muster-maschinenbau-de._domainkey.musterbau.onmicrosoft.com', key: true }, { cname: 'selector2-muster-maschinenbau-de._domainkey.musterbau.onmicrosoft.com', key: true }], mtaSts: [] },
      { domain: 'muster-shop.de', error: '', mx: [], spf: [], dmarc: [], dkim: [{ cname: '', key: false }, { cname: '', key: false }], mtaSts: [] }
    ]
  };
}

// Beispielhafte Fragebogen-Antworten und Notizen für die Demo
export function demoNotes() {
  return {
    answers: { Q01: 'yes', Q02: 'partial', Q03: 'no', Q04: 'partial', Q05: 'yes', Q06: 'no', Q07: 'partial', Q08: 'no', Q09: 'no', Q10: 'partial', Q12: 'yes', Q13: 'partial', Q14: 'no', Q15: 'yes', Q16: 'no', Q17: 'no', Q19: 'no', Q21: 'no', Q22: 'partial' },
    notes: { 'PA-01': 'Martin Altadmin ist seit Mai im Ruhestand – Konto wird entfernt (Ticket #4711).', 'ML-02': 'DMARC-Berichte laufen seit 3 Monaten; Umstellung auf quarantine im Q1 geplant.' },
    accepted: {}
  };
}

// Älterer Stand für den Verlaufsvergleich
export function demoOlderSnapshot() {
  const s = demoSnapshot();
  s.scannedAt = '2026-08-14T10:30:00.000Z';
  s.data.ca = s.data.ca.filter((p) => p.id !== 'ca2' && p.id !== 'ca3');
  s.data.authMethods.authenticationMethodConfigurations.find((m) => m.id === 'Voice').state = 'enabled';
  s.data.secureScore = Object.assign({}, s.data.secureScore, { currentScore: s.data.secureScore.currentScore - 38 });
  return s;
}
