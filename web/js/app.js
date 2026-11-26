// M365 Security Check – Oberfläche
import * as G from './graph.js';
import { scanTenant, SOURCES } from './collector.js';
import { evaluate, rating, PRIO, scoreOf } from './checks.js';
import { CATEGORIES, catLabel, ISO, NIS2, nis2Short, QUESTIONS, ANSWERS, SEVERITY, STATUS, EFFORT, licHint } from './catalog.js';
import { demoSnapshot, demoNotes, demoOlderSnapshot } from './demo.js';
import * as X from './export.js';

const root = document.getElementById('root');

// ---------------- Hilfen ----------------
const esc = (s) => String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmtDT = (iso) => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const fmtD = (iso) => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* egal */ } };
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const ALL = 'all';

export const PERMS = [
  'User.Read', 'Directory.Read.All', 'Policy.Read.All', 'RoleManagement.Read.Directory', 'AuditLog.Read.All',
  'IdentityRiskyUser.Read.All', 'SecurityEvents.Read.All', 'SecurityAlert.Read.All', 'SharePointTenantSettings.Read.All',
  'DeviceManagementConfiguration.Read.All', 'DeviceManagementManagedDevices.Read.All', 'BackupRestore-Configuration.Read.All'
];

const I = (p, size) => '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
const ICON = {
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8E06A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 4v5c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V7l8-4z"></path><rect x="8.5" y="10.5" width="7" height="5.5" rx="1"></rect><path d="M10 10.5V9a2 2 0 0 1 4 0v1.5"></path></svg>',
  dash: I('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  list: I('<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'),
  plan: I('<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>'),
  quest: I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01"/>'),
  norm: I('<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 14h8M8 17h5"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  file: I('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M12 18v-6M9 15l3 3 3-3"/>'),
  log: I('<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>'),
  gear: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  search: I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', 16),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  refresh: I('<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>', 16),
  check: I('<path d="M5 12l5 5L20 7"/>', 16),
  x: I('<path d="M6 6l12 12M18 6L6 18"/>', 16),
  copy: I('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', 16),
  ext: I('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', 14),
  bolt: I('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', 16)
};
const msLogo = '<svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>';

// ---------------- Zustand ----------------
const state = {
  screen: 'boot', view: 'dashboard', info: {}, cfg: {}, account: null, error: '', busy: false,
  snap: null, ev: null, notes: { answers: {}, notes: {}, accepted: {} }, viewingSaved: null, liveSnap: null,
  scan: { rows: {} },
  q: '', cat: ALL, statusF: 'open', sourceF: ALL, sevF: ALL, refF: '', selId: null,
  qCat: ALL, normTab: 'iso',
  saved: [], snapshots: [], compareName: '', compareSnap: null, compareEv: null,
  ex: { format: 'docx', sections: new Set(X.SECTIONS.map((s) => s.key).filter((k) => k !== 'passed')), names: true, partner: lsGet('msc.partner', ''), author: lsGet('msc.author', ''), contact: lsGet('msc.contact', ''), customer: '' },
  dns: lsGet('msc.dns', '1') === '1',
  loginRedirect: lsGet('msc.loginMode', 'popup') === 'redirect',
  toast: ''
};

function setTheme(t) { document.documentElement.dataset.theme = t; lsSet('msc.theme', t); }
setTheme(lsGet('msc.theme', 'dark'));
const themeLabel = () => document.documentElement.dataset.theme === 'light' ? 'Dunkles Design' : 'Helles Design';

async function api(path, opts) {
  const r = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, opts || {}));
  if (!r.ok) throw new Error((await r.text()) || ('HTTP ' + r.status));
  return r.json();
}
let toastTimer;
function toast(msg) { state.toast = msg; render(); clearTimeout(toastTimer); toastTimer = setTimeout(() => { state.toast = ''; render(); }, 3200); }

// ---------------- Render ----------------
function render() {
  const a = document.activeElement;
  const fid = a && a.id;
  const sel = a && typeof a.selectionStart === 'number' ? [a.selectionStart, a.selectionEnd] : null;
  const scrollers = {};
  root.querySelectorAll('[data-keep-scroll]').forEach((el) => { scrollers[el.dataset.keepScroll] = el.scrollTop; });
  root.innerHTML = (SCREENS[state.screen] || SCREENS.boot)() + (state.toast ? '<div class="toast" role="status">' + esc(state.toast) + '</div>' : '');
  root.querySelectorAll('[data-keep-scroll]').forEach((el) => { if (scrollers[el.dataset.keepScroll] !== undefined) el.scrollTop = scrollers[el.dataset.keepScroll]; });
  if (fid) {
    const el = document.getElementById(fid);
    if (el) { el.focus(); if (sel && el.setSelectionRange) { try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* */ } } }
  }
}
const renderSoon = debounce(render, 140);
const SCREENS = { boot: () => '<div class="center"><div class="spinner"></div></div>', setup: screenSetup, login: screenLogin, scanning: screenScanning, app: screenApp };

function brand() {
  return '<div class="brandrow"><div class="logo">' + ICON.shield + '</div><div><div class="name">M365 Security Check</div><div class="small muted">' + esc(state.cfg.brandLabel || 'Sicherheitsprüfung für Microsoft 365') + '</div></div></div>';
}
const permChips = () => '<div class="permlist">' + PERMS.map((p) => '<span class="chip mono">' + p + '</span>').join('') + '</div>';

function screenSetup() {
  const ru = state.info.redirectUri || (location.origin + '/redirect.html');
  return '<div class="center"><div class="wrap wide">' + brand() +
    '<div class="card"><h1>Einmalige Einrichtung</h1>' +
    '<p class="muted">M365 Security Check meldet sich über eine eigene App-Registrierung in Entra ID an. Sie wird einmal angelegt und kann für alle Kundenmandanten genutzt werden.</p>' +
    '<ol class="steps">' +
    '<li>Im Entra Admin Center unter <b>App-Registrierungen › Neue Registrierung</b> eine App „M365 Security Check“ anlegen. Unterstützte Kontotypen: <b>Konten in einem beliebigen Organisationsverzeichnis (mehrinstanzenfähig)</b>.</li>' +
    '<li>Plattform <b>Single-Page-Anwendung (SPA)</b> hinzufügen mit dieser Umleitungs-URI:<div class="copyrow" style="margin-top:8px"><code>' + esc(ru) + '</code><button class="btn" data-act="copy" data-text="' + esc(ru) + '">' + ICON.copy + 'Kopieren</button></div></li>' +
    '<li>Unter <b>API-Berechtigungen › Microsoft Graph › Delegiert</b> diese Rechte hinzufügen (alle nur lesend):<div style="margin-top:8px">' + permChips() + '</div></li>' +
    '<li>Im jeweiligen Kundenmandanten einmal die <b>Administratorzustimmung</b> erteilen (passiert beim ersten Login eines Admins über den Zustimmungsdialog).</li>' +
    '<li>Die <b>Anwendungs-ID (Client-ID)</b> hier eintragen.</li></ol>' +
    '<label class="field" for="cfgClient">Anwendungs-ID (Client-ID)<input class="input mono" id="cfgClient" placeholder="00000000-0000-0000-0000-000000000000" value="' + esc(state.cfg.clientId || '') + '"></label>' +
    '<label class="field" for="cfgTenant">Standard-Mandant (optional, z. B. der eigene)<input class="input mono" id="cfgTenant" placeholder="contoso.onmicrosoft.com" value="' + esc(state.cfg.defaultTenant || '') + '"></label>' +
    (state.error ? '<div class="err">' + esc(state.error) + '</div>' : '') +
    '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary lg" data-act="saveSetup">Speichern und weiter</button><button class="btn lg" data-act="demo">Erst einmal die Demo ansehen</button></div>' +
    '</div><div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;align-items:center"><span class="small faint">Version ' + esc(state.info.version || '') + ' · Daten bleiben lokal: ' + esc(state.info.dataDir || '') + '</span></div></div></div>';
}

function screenLogin() {
  const acc = state.account;
  return '<div class="center"><div class="wrap">' + brand() +
    '<div class="card"><div style="display:flex;flex-direction:column;gap:6px"><h1>Mandant prüfen</h1><p class="muted">Prüft Entra ID, bedingten Zugriff, Admins, Apps, E-Mail, SharePoint, Intune und Defender – ausschließlich lesend, es wird nichts verändert.</p></div>' +
    '<label class="field" for="loginTenant">Kundenmandant (Domain oder Tenant-ID)<input class="input mono" id="loginTenant" placeholder="contoso.onmicrosoft.com" value="' + esc(lsGet('msc.lastTenant', state.cfg.defaultTenant || '')) + '"></label>' +
    '<p class="small faint" style="margin-top:-8px">Für Partner-Zugriff (GDAP) unbedingt den Kundenmandanten angeben. Empfohlene Rolle: <b>Globaler Leser</b>.</p>' +
    '<label class="check" style="background:transparent;padding:0;min-height:0"><input type="checkbox" data-ch="dns"' + (state.dns ? ' checked' : '') + '><span class="small">Öffentliche Mail-DNS-Einträge (SPF, DKIM, DMARC) mitprüfen <span class="faint">– Abfrage der Domainnamen über Cloudflare DNS-over-HTTPS</span></span></label>' +
    '<label class="check" style="background:transparent;padding:0;min-height:0"><input type="checkbox" data-ch="loginRedirect"' + (state.loginRedirect ? ' checked' : '') + '><span class="small">Anmeldung im selben Fenster statt Pop-up <span class="faint">– falls das Anmeldefenster blockiert wird oder hängen bleibt</span></span></label>' +
    (acc ? '<button class="btn primary lg" data-act="continue">Als ' + esc(acc.username) + ' fortfahren</button>' : '') +
    '<button class="btn ms lg" data-act="login" ' + (state.busy ? 'disabled' : '') + '>' + msLogo + (acc ? 'Mit anderem Konto anmelden' : 'Mit Microsoft anmelden') + '</button>' +
    (state.error ? '<div class="err">' + state.error + '</div>' : '') +
    '<div style="display:flex;flex-wrap:wrap;gap:8px"><span class="chip">Nur Leserechte</span><span class="chip">GDAP-fähig</span><span class="chip">Daten bleiben lokal</span></div>' +
    '</div>' + savedPanel() + '<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap"><button class="btn ghost" data-act="demo">Demo mit Beispieldaten</button><button class="btn ghost" data-act="openSetup">Einrichtung / Client-ID</button><button class="btn ghost" data-act="theme">' + themeLabel() + '</button></div></div></div>';
}

function savedPanel() {
  if (!state.saved.length) return '';
  return '<div class="card" style="gap:10px;padding:20px 24px"><h2 style="font-size:15px">Gespeicherte Prüfung öffnen</h2><p class="small muted" style="margin-top:-4px">Ergebnis ansehen, Bericht erzeugen oder Fragebogen ergänzen – ohne erneute Anmeldung.</p>' +
    state.saved.slice(0, 6).map((x) => '<div class="assign" style="align-items:center"><span style="display:flex;flex-direction:column;gap:2px;min-width:0"><b style="font-weight:500">' + esc(x.tenant || 'Mandant') + '</b><span class="small muted">' + fmtDT(x.scannedAt) + (x.score !== null && x.score !== undefined ? ' · Bewertung ' + x.score : '') + '</span></span><button class="btn" style="min-height:34px" data-act="openSaved" data-name="' + esc(x.name) + '">Öffnen</button></div>').join('') + '</div>';
}

function screenScanning() {
  const keys = SOURCES.map((s) => s.key).concat(state.dns ? ['dns'] : []);
  const rows = keys.map((k) => state.scan.rows[k] || { label: (SOURCES.find((s) => s.key === k) || { label: 'Mail-DNS (SPF, DKIM, DMARC, MTA-STS)' }).label, state: 'pending' });
  const done = rows.filter((r) => r.state === 'done' || r.state === 'error').length;
  const p = Math.round(done / rows.length * 100);
  const st = (s) => s === 'running' ? '<span class="spinner"></span>' : s === 'done' ? '<span style="color:var(--lime)">' + ICON.check + '</span>' : s === 'error' ? '<span style="color:var(--amber)">' + ICON.x + '</span>' : '<span class="faint">·</span>';
  return '<div class="center"><div class="wrap wide">' + brand() + '<div class="card"><h1>Mandant wird geprüft …</h1><p class="muted">Alle Bereiche werden gelesen. Bei großen Mandanten kann das ein paar Minuten dauern. Fehlende Lizenzen oder Rechte sind kein Problem – die betroffenen Prüfungen werden als „nicht prüfbar“ markiert.</p>' +
    '<div class="progress" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + p + '%"></div></div>' +
    '<div class="scanlist" data-keep-scroll="scan">' + rows.map((r) => '<div class="scanrow"><span class="st">' + st(r.state) + '</span><span>' + esc(r.label) + '</span><span class="info">' + esc(r.info || '') + '</span></div>').join('') + '</div></div></div></div>';
}

// ---------------- App-Rahmen ----------------
const statusBadge = (s, r) => {
  const cls = { pass: 'b-ok', warn: 'b-warn', fail: 'b-bad', info: 'b-info', na: 'b-neutral', open: 'b-neutral' }[s];
  return '<span class="badge ' + cls + '">' + (r && r.accepted ? 'Risiko akzeptiert' : STATUS[s]) + '</span>';
};
const sevBadge = (s) => '<span class="sev sev-' + s + '">' + SEVERITY[s] + '</span>';
const scoreColor = (s) => s === null || s === undefined ? 'var(--muted)' : s >= 80 ? 'var(--lime)' : s >= 60 ? 'var(--accent)' : s >= 40 ? 'var(--amber)' : 'var(--red-text)';
function ring(score, size, label) {
  const r = 42, c = 2 * Math.PI * r;
  const v = score === null || score === undefined ? 0 : score;
  return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px"><svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" aria-hidden="true"><circle cx="50" cy="50" r="' + r + '" fill="none" stroke="var(--panel2)" stroke-width="9"/><circle cx="50" cy="50" r="' + r + '" fill="none" stroke="' + scoreColor(score) + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/></svg><div class="rv"><b style="color:' + scoreColor(score) + '">' + (score === null || score === undefined ? '–' : score) + '</b>' + (label ? '<span>' + esc(label) + '</span>' : '') + '</div></div>';
}

function screenApp() {
  const s = state.snap, ev = state.ev;
  const nav = (id, icon, label, cnt, bad) => '<button class="navbtn' + (state.view === id ? ' on' : '') + '" data-act="nav" data-view="' + id + '">' + icon + label + (cnt !== undefined && cnt !== null ? '<span class="cnt' + (bad ? ' bad' : '') + '">' + cnt + '</span>' : '') + '</button>';
  const initials = (state.account && state.account.username ? state.account.username.slice(0, 2) : (s.demo ? 'DE' : '–')).toUpperCase();
  const views = { dashboard: viewDashboard, findings: viewFindings, plan: viewPlan, questions: viewQuestions, norms: viewNorms, history: viewHistory, export: viewExport, log: viewLog, settings: viewSettings };
  const p1 = ev.plan.filter((r) => r.prio === 1).length;
  return '<div class="app"><header class="topbar">' +
    '<div style="display:flex;align-items:center;gap:10px"><div class="logo sm">' + ICON.shield + '</div><span class="title">M365 Security Check</span></div>' +
    '<div class="tenantpill"><span class="dot"></span><b class="small">' + esc(s.tenant.displayName || 'Mandant') + '</b><span class="dom">' + esc(s.tenant.domain || '') + '</span></div>' +
    '<div class="search"><label for="q">' + ICON.search + '<span class="sr">Suche</span><input id="q" data-in="q" placeholder="Prüfungen durchsuchen, z. B. „DMARC“ oder „Gast“" value="' + esc(state.q) + '" autocomplete="off"><span class="kbd">Strg K</span></label></div>' +
    '<div class="right">' + (s.demo ? '<span class="badge b-warn">Demo</span>' : '<span class="badge b-ok">Nur lesen</span>') +
    '<button class="iconbtn" data-act="theme" aria-label="Design wechseln" title="Design wechseln">' + (document.documentElement.dataset.theme === 'light' ? ICON.moon : ICON.sun) + '</button>' +
    '<button class="avatar" data-act="logout" title="Abmelden' + (state.account ? ' (' + esc(state.account.username) + ')' : '') + '" aria-label="Abmelden">' + esc(initials) + '</button></div></header>' +
    '<div class="body"><nav class="sidebar" aria-label="Hauptnavigation">' +
    '<span class="sect">Ergebnis</span>' +
    nav('dashboard', ICON.dash, 'Übersicht') +
    nav('findings', ICON.list, 'Befunde', ev.counts.fail + ev.counts.warn || null, ev.counts.fail > 0) +
    nav('plan', ICON.plan, 'Maßnahmenplan', p1 || null, p1 > 0) +
    nav('questions', ICON.quest, 'Fragebogen', ev.counts.open ? ev.counts.open + ' offen' : null) +
    nav('norms', ICON.norm, 'ISO 27001 & NIS2') +
    '<span class="sect">Bericht</span>' +
    nav('history', ICON.clock, 'Verlauf & Vergleich') +
    nav('export', ICON.file, 'Prüfbericht') +
    nav('log', ICON.log, 'Scan-Protokoll', s.warnings.length || null) +
    nav('settings', ICON.gear, 'Einstellungen') +
    '<div class="lastscan"><span class="muted">' + (state.viewingSaved ? 'Gespeicherter Stand' : 'Letzte Prüfung') + '</span><b>' + fmtDT(s.scannedAt) + '</b><span class="muted">' + ev.counts.total + ' Prüfpunkte · Score ' + (ev.score === null ? '–' : ev.score) + '</span>' +
    (!s.demo ? '<button class="btn" style="margin-top:8px;min-height:34px" data-act="rescan">' + ICON.refresh + 'Neu prüfen</button>' : '') + '</div>' +
    '</nav><main class="main" id="main"><div class="page">' +
    (state.viewingSaved ? '<div class="banner">Ansicht eines gespeicherten Stands (' + esc(state.viewingSaved) + '). <button class="btn ghost" data-act="backToLive">' + (state.liveSnap || state.account ? 'Zurück zur aktuellen Prüfung' : 'Zur Anmeldung') + '</button></div>' : '') +
    (views[state.view] || viewDashboard)() + '</div></main></div></div>';
}

function head(title, sub, actions) {
  return '<div class="pagehead"><div style="display:flex;flex-direction:column;gap:4px"><h1>' + esc(title) + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';
}
function kpi(lbl, val, sub, act, color) {
  return '<button class="kpi" ' + act + '><span class="lbl">' + esc(lbl) + '</span><span class="val"' + (color ? ' style="color:' + color + '"' : '') + '>' + esc(val) + '</span><span class="sub">' + esc(sub) + '</span></button>';
}

// ---------------- Übersicht ----------------
function viewDashboard() {
  const ev = state.ev, c = ev.counts, rt = rating(ev.score);
  const ss = ev.secureScore;
  const top = ev.plan.slice(0, 9);
  return head('Übersicht', 'Sicherheitsbewertung des Microsoft-365-Mandanten ' + esc(state.snap.tenant.displayName || state.snap.tenant.domain) + ' · Stand ' + fmtDT(state.snap.scannedAt),
    '<button class="btn" data-act="nav" data-view="questions">' + ICON.quest + 'Fragebogen' + (c.open ? ' (' + c.open + ' offen)' : '') + '</button><button class="btn primary" data-act="nav" data-view="export">Prüfbericht erzeugen</button>') +
    '<div class="row">' +
    '<section class="panel scorepanel" style="flex:2 1 420px"><div class="scorehead">' + ring(ev.score, 148, 'von 100') +
    '<div style="display:flex;flex-direction:column;gap:8px;min-width:0;flex:1 1 260px"><span class="small muted">Gesamtbewertung</span><span class="rating r-' + rt.tone + '">' + esc(rt.label) + '</span>' +
    '<p class="small muted">Gewichtet nach Schweregrad (hoch × 10, mittel × 5, niedrig × 2); „teilweise“ zählt zur Hälfte. Nicht prüfbare und offene Punkte fließen nicht ein.</p>' +
    '<div class="subscores">' +
    '<div><span class="small muted">Technisch</span><b style="color:' + scoreColor(ev.scoreTech) + '">' + (ev.scoreTech === null ? '–' : ev.scoreTech) + '</b></div>' +
    '<div><span class="small muted">Organisatorisch</span><b style="color:' + scoreColor(ev.scoreOrg) + '">' + (ev.scoreOrg === null ? '–' : ev.scoreOrg) + '</b></div>' +
    '<div><span class="small muted">Microsoft Secure Score</span><b>' + (ss ? ss.pct + ' %' : '–') + '</b></div></div></div></div></section>' +
    '<section class="panel" style="flex:1 1 300px"><h2>Lizenzbasis</h2><p class="small muted">Erkannte Sicherheitsfunktionen – fehlende Lizenzen begrenzen, was sich umsetzen lässt.</p><div class="lics">' +
    ev.licenses.map((l) => '<div class="lic' + (l.has ? ' on' : '') + '" title="' + esc(l.hint) + '"><span class="ico">' + (l.has ? ICON.check : ICON.x) + '</span>' + esc(l.label) + '</div>').join('') + '</div></section></div>' +
    '<div class="kpis">' +
    kpi('Prüfpunkte', c.total, c.technical - c.securescore + ' eigene · ' + c.securescore + ' Secure Score · ' + c.questions + ' Fragen', 'data-act="filter" data-status="all"') +
    kpi('Erfüllt', c.pass, Math.round(c.pass / Math.max(1, c.pass + c.warn + c.fail) * 100) + ' % der bewerteten Punkte', 'data-act="filter" data-status="pass"', 'var(--lime)') +
    kpi('Teilweise', c.warn, 'Nachbesserung empfohlen', 'data-act="filter" data-status="warn"', 'var(--amber)') +
    kpi('Nicht erfüllt', c.fail, ev.plan.filter((r) => r.prio === 1).length + ' mit Priorität „Sofort“', 'data-act="filter" data-status="fail"', 'var(--red-text)') +
    kpi('Nicht prüfbar', c.na, 'fehlende Lizenz oder Berechtigung', 'data-act="filter" data-status="na"') +
    kpi('Fragebogen', (QUESTIONS.length - c.open) + '/' + QUESTIONS.length, c.open ? c.open + ' Fragen offen' : 'vollständig beantwortet', 'data-act="nav" data-view="questions"', c.open ? 'var(--amber)' : 'var(--lime)') +
    '</div><div class="row">' +
    '<section class="panel" style="flex:3 1 420px"><h2>Bewertung nach Bereich</h2><div class="bars">' +
    ev.byCat.map((b) => '<button class="bar catbar" data-act="cat" data-cat="' + b.key + '"><div class="top"><span>' + esc(b.label) + '</span><span class="mono" style="color:' + scoreColor(b.score) + '">' + (b.score === null ? '–' : b.score) + '</span></div><div class="track">' +
      seg(b.pass, b.total, 'a') + seg(b.warn, b.total, 'u') + seg(b.fail, b.total, 'f') + seg(b.info + b.na + b.open, b.total, 'n') + '</div></button>').join('') +
    '</div><div class="legend"><span><i style="background:var(--accent)"></i>erfüllt</span><span><i style="background:var(--amber)"></i>teilweise</span><span><i style="background:var(--red)"></i>nicht erfüllt</span><span><i style="background:var(--line2)"></i>info / nicht prüfbar / offen</span></div></section>' +
    '<section class="panel" style="flex:2 1 340px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px"><h2>Wichtigste offene Punkte</h2><button class="btn ghost" data-act="nav" data-view="plan">Maßnahmenplan</button></div>' +
    (top.length ? top.map((r) => '<button class="finding" data-act="open" data-id="' + esc(r.id) + '"><span class="d d-' + (r.status === 'fail' ? 'high' : 'medium') + '"></span><span style="display:flex;flex-direction:column;gap:2px;min-width:0"><b style="font-weight:500">' + esc(r.title) + '</b><span class="small muted">' + esc(PRIO[r.prio]) + ' · ' + esc(catLabel(r.cat)) + (r.licMissing ? ' · Lizenz: ' + esc(r.lic === 'P1' ? 'Entra ID P1' : r.lic === 'P2' ? 'Entra ID P2' : r.lic) : '') + '</span></span></button>').join('') : '<p class="muted">Keine offenen Maßnahmen.</p>') +
    '</section></div>' +
    (ev.quickWins.length ? '<section class="panel"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h2>' + ICON.bolt + ' Quick Wins</h2><span class="small muted">Geringer Aufwand, mittlere bis hohe Wirkung</span></div><div class="qw">' +
      ev.quickWins.slice(0, 12).map((r) => '<button class="qwitem" data-act="open" data-id="' + esc(r.id) + '">' + sevBadge(r.sev) + '<span>' + esc(r.title) + '</span></button>').join('') + '</div></section>' : '');
}
const seg = (n, t, cls) => n ? '<div class="' + cls + '" style="width:' + (n / t * 100) + '%"></div>' : '';

// ---------------- Befunde ----------------
const STATUS_F = [['open', 'Handlungsbedarf'], ['all', 'Alle Ergebnisse'], ['fail', 'Nicht erfüllt'], ['warn', 'Teilweise'], ['pass', 'Erfüllt'], ['na', 'Nicht prüfbar'], ['info', 'Information']];
const SOURCE_F = [[ALL, 'Alle Quellen'], ['graph', 'Eigene Prüfungen (Graph)'], ['dns', 'DNS'], ['securescore', 'Microsoft Secure Score'], ['question', 'Fragebogen']];
function filtered() {
  const q = state.q.trim().toLowerCase();
  return state.ev.results.filter((r) => {
    if (state.cat !== ALL && r.cat !== state.cat) return false;
    if (state.statusF === 'open' ? !(r.status === 'fail' || r.status === 'warn') : state.statusF !== 'all' && r.status !== state.statusF) return false;
    if (state.sourceF !== ALL && r.source !== state.sourceF) return false;
    if (state.sevF !== ALL && r.sev !== state.sevF) return false;
    if (state.refF && !((r.iso || []).includes(state.refF) || (r.nis2 || []).includes(state.refF))) return false;
    if (q && ![r.id, r.title, r.summary, r.why, r.fix, catLabel(r.cat)].some((x) => String(x || '').toLowerCase().includes(q))) return false;
    return true;
  });
}
const ORDER = { fail: 0, warn: 1, open: 2, na: 3, info: 4, pass: 5 };
const SEVO = { high: 0, medium: 1, low: 2, info: 3 };
function viewFindings() {
  const list = filtered().sort((a, b) => ORDER[a.status] - ORDER[b.status] || SEVO[a.sev] - SEVO[b.sev] || a.id.localeCompare(b.id));
  const counts = {};
  for (const r of state.ev.results) counts[r.cat] = (counts[r.cat] || 0) + 1;
  if (state.selId && !list.some((r) => r.id === state.selId) && !state.ev.results.some((r) => r.id === state.selId)) state.selId = null;
  const sel = state.selId ? state.ev.results.find((r) => r.id === state.selId) : list[0];
  const refLabel = state.refF ? (ISO[state.refF] ? state.refF + ' ' + ISO[state.refF] : NIS2[state.refF]) : '';
  return head('Befunde', list.length + ' von ' + state.ev.results.length + ' Prüfpunkten' + (state.q ? ' · Suche „' + esc(state.q) + '“' : '') + (refLabel ? ' · Normbezug ' + esc(refLabel) : '')) +
    '<div class="filters">' + [ALL].concat(CATEGORIES.map((c) => c.key).filter((k) => counts[k])).map((k) => '<button class="pill' + (state.cat === k ? ' on' : '') + '" data-act="cat" data-cat="' + k + '">' + (k === ALL ? 'Alle' : esc(CATEGORIES.find((c) => c.key === k).short)) + '<span class="n">' + (k === ALL ? state.ev.results.length : counts[k]) + '</span></button>').join('') + '</div>' +
    '<div class="filters">' + sel3('statusF', 'Status', STATUS_F, state.statusF) + sel3('sourceF', 'Quelle', SOURCE_F, state.sourceF) + sel3('sevF', 'Schweregrad', [[ALL, 'Alle Schweregrade'], ['high', 'Hoch'], ['medium', 'Mittel'], ['low', 'Niedrig'], ['info', 'Info']], state.sevF) +
    ((state.cat !== ALL || state.statusF !== 'open' || state.sourceF !== ALL || state.sevF !== ALL || state.q || state.refF) ? '<button class="btn ghost" data-act="resetFilters">Filter zurücksetzen</button>' : '') + '</div>' +
    '<div class="split"><section class="panel listcol" style="padding:6px 0"><div class="tablewrap" data-keep-scroll="list"><table class="t" style="min-width:620px"><thead><tr><th style="width:110px">ID</th><th>Prüfung</th><th>Bereich</th><th>Schwere</th><th>Ergebnis</th></tr></thead><tbody>' +
    (list.length ? list.map((r) => '<tr class="click' + (sel && sel.id === r.id ? ' sel' : '') + '" data-act="select" data-id="' + esc(r.id) + '"><td class="mono small muted">' + esc(shortId(r.id)) + '</td><td class="name wrap">' + esc(r.title) + '<div class="small faint" style="font-weight:400">' + esc(trim(r.summary, 120)) + '</div></td><td class="muted small">' + esc(CATEGORIES.find((c) => c.key === r.cat).short) + '</td><td>' + sevBadge(r.sev) + '</td><td>' + statusBadge(r.status, r) + '</td></tr>').join('') : '<tr><td colspan="5"><div class="emptybox">Kein Prüfpunkt passt zu Filter und Suche.</div></td></tr>') +
    '</tbody></table></div></section><aside class="panel detailcol" data-keep-scroll="detail">' + (sel ? detail(sel) : '<div class="emptybox">Prüfpunkt auswählen</div>') + '</aside></div>';
}
const shortId = (id) => id.startsWith('SS-') ? 'Score' : id;
const trim = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; };
const sel3 = (id, label, opts, cur) => '<label class="sr" for="' + id + '">' + label + '</label><select class="input" id="' + id + '" data-ch="' + id + '">' + opts.map(([k, l]) => '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + l + '</option>').join('') + '</select>';
const SRC = { graph: 'Microsoft Graph', dns: 'Öffentliches DNS', securescore: 'Microsoft Secure Score', question: 'Fragebogen' };

function detail(r) {
  const meta = [['Bereich', esc(catLabel(r.cat))], ['Schweregrad', sevBadge(r.sev)], ['Quelle', esc(SRC[r.source] || r.source) + (r.service ? ' · ' + esc(r.service) : '')]];
  if (r.prio) meta.push(['Priorität', esc(PRIO[r.prio])]);
  if (r.effort) meta.push(['Aufwand', esc(EFFORT[r.effort])]);
  if (r.lic) meta.push(['Lizenz', esc(licHint(r.lic)) + (r.licMissing ? ' <span class="badge b-warn">nicht vorhanden</span>' : ' <span class="badge b-ok">vorhanden</span>')]);
  if ((r.iso || []).length) meta.push(['ISO 27001', r.iso.map((k) => '<button class="reflink" data-act="ref" data-ref="' + k + '" title="' + esc(ISO[k] || '') + '">' + k + '</button>').join(' ')]);
  if ((r.nis2 || []).length) meta.push(['NIS2', r.nis2.map((k) => '<button class="reflink" data-act="ref" data-ref="' + k + '" title="' + esc(NIS2[k] || '') + '">' + esc(nis2Short(k)) + '</button>').join(' ')]);
  let h = '<div style="display:flex;flex-direction:column;gap:6px"><span class="small muted mono">' + esc(r.id.startsWith('SS-') ? r.id.slice(3) : r.id) + '</span><h2 style="font-size:18px">' + esc(r.title) + '</h2><div style="display:flex;gap:8px;flex-wrap:wrap">' + statusBadge(r.status, r) + (r.metric ? '<span class="chip mono">' + esc(r.metric) + '</span>' : '') + '</div></div>';
  if (r.source === 'question') {
    h += '<div class="answers">' + ANSWERS.map(([k, l]) => '<button class="pill' + (r.answer === k ? ' on' : '') + '" data-act="answer" data-q="' + r.id + '" data-a="' + k + '">' + l + '</button>').join('') + '</div>';
  } else if (r.summary) h += '<p class="result r-' + r.status + '">' + esc(r.summary) + '</p>';
  if (r.rows && r.rows.length) {
    h += '<div class="tablewrap mini"><table class="t"><thead><tr>' + r.head.map((x) => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + r.rows.slice(0, 150).map((row) => '<tr>' + row.map((c) => '<td class="wrap">' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>' + (r.rows.length > 150 || r.more ? '<p class="small muted" style="padding:6px 12px">… weitere Einträge im Prüfbericht bzw. CSV-Export.</p>' : '') + '</div>';
  }
  h += '<dl class="kv">' + meta.map(([k, v]) => '<dt>' + k + '</dt><dd>' + v + '</dd>').join('') + '</dl>';
  if (r.why) h += '<div class="block"><span class="sectlabel">Warum wichtig</span><p class="small" style="color:var(--text2)">' + esc(r.why) + '</p></div>';
  if (r.fix) h += '<div class="block"><span class="sectlabel">Empfehlung' + (r.fixLang === 'en' ? ' (Microsoft)' : '') + '</span><p class="small fix">' + esc(r.fix) + '</p></div>';
  if (r.ref) h += '<a class="small" href="' + esc(r.ref) + '" target="_blank" rel="noopener">Microsoft-Dokumentation ' + ICON.ext + '</a>';
  h += '<label class="field" for="note">Kommentar für den Bericht<textarea class="input" id="note" data-in="note" data-id="' + esc(r.id) + '" placeholder="Ansprechpartner, geplante Umsetzung, Ticket …">' + esc(state.notes.notes[r.id] || '') + '</textarea></label>';
  if (r.status === 'fail' || r.status === 'warn' || r.accepted) h += '<div style="display:flex;gap:8px;flex-wrap:wrap">' + (r.accepted ? '<button class="btn" data-act="unaccept" data-id="' + esc(r.id) + '">Risikoakzeptanz aufheben</button>' : '<button class="btn" data-act="accept" data-id="' + esc(r.id) + '">Risiko akzeptieren</button>') + '</div><p class="small faint">Akzeptierte Risiken zählen nicht in die Bewertung und werden im Bericht gesondert ausgewiesen.</p>';
  return h;
}

// ---------------- Maßnahmenplan ----------------
function viewPlan() {
  const plan = state.ev.plan;
  const grp = [1, 2, 3].map((p) => [p, plan.filter((r) => r.prio === p)]);
  const lic = [...new Set(plan.filter((r) => r.licMissing).map((r) => r.lic))];
  return head('Maßnahmenplan', 'Priorisiert nach Ergebnis und Schweregrad, innerhalb der Priorität nach Aufwand.', '<button class="btn" data-act="csvPlan">Als CSV (Excel)</button><button class="btn primary" data-act="nav" data-view="export">Prüfbericht erzeugen</button>') +
    (lic.length ? '<div class="banner info">Für ' + plan.filter((r) => r.licMissing).length + ' Maßnahmen fehlt eine Lizenz: ' + lic.map((l) => '<b>' + esc(licHint(l)) + '</b>').join(' · ') + '</div>' : '') +
    '<div class="prios">' + grp.map(([p, list]) => '<section class="panel prio p' + p + '"><div class="priohead"><h2>' + esc(PRIO[p]) + '</h2><span class="badge ' + (p === 1 ? 'b-bad' : p === 2 ? 'b-warn' : 'b-info') + '">' + list.length + '</span><span class="small muted">' + ({ 1: 'nicht erfüllt, hoher Schweregrad', 2: 'nicht erfüllt (mittel) oder teilweise (hoch)', 3: 'übrige Lücken' })[p] + '</span></div>' +
      (list.length ? '<div class="tablewrap"><table class="t"><thead><tr><th>Maßnahme</th><th>Bereich</th><th>Aufwand</th><th>Lizenz</th><th>Status</th></tr></thead><tbody>' + list.map((r) => '<tr class="click" data-act="open" data-id="' + esc(r.id) + '"><td class="name wrap">' + esc(r.title) + '<div class="small faint" style="font-weight:400">' + esc(trim(r.fix, 160)) + '</div></td><td class="muted small">' + esc(CATEGORIES.find((c) => c.key === r.cat).short) + '</td><td class="small">' + esc(EFFORT[r.effort] || '') + '</td><td class="small">' + (r.lic ? (r.licMissing ? '<span class="badge b-warn">' : '<span class="badge b-neutral">') + esc(r.lic === 'P1' ? 'Entra P1' : r.lic === 'P2' ? 'Entra P2' : r.lic === 'INTUNE' ? 'Intune' : r.lic) + '</span>' : '') + '</td><td>' + statusBadge(r.status, r) + '</td></tr>').join('') + '</tbody></table></div>' : '<div class="emptybox">Keine Maßnahmen.</div>') + '</section>').join('') + '</div>';
}

// ---------------- Fragebogen ----------------
function viewQuestions() {
  const ans = state.notes.answers;
  const n = QUESTIONS.filter((q) => ans[q.id]).length;
  const cats = [...new Set(QUESTIONS.map((q) => q.cat))];
  return head('Fragebogen', 'Geführte Bestandsaufnahme zu Organisation, Prozessen und Verantwortlichkeiten – am besten gemeinsam mit dem Kunden ausfüllen. Antworten fließen in Bewertung und Bericht ein.') +
    '<div class="progress big" role="progressbar" aria-valuenow="' + n + '" aria-valuemax="' + QUESTIONS.length + '"><div style="width:' + (n / QUESTIONS.length * 100) + '%"></div></div><p class="small muted" style="margin-top:-12px">' + n + ' von ' + QUESTIONS.length + ' Fragen beantwortet · organisatorische Bewertung: <b style="color:' + scoreColor(state.ev.scoreOrg) + '">' + (state.ev.scoreOrg === null ? '–' : state.ev.scoreOrg) + '</b></p>' +
    cats.map((c) => '<section class="panel"><h2>' + esc(catLabel(c)) + '</h2>' + QUESTIONS.filter((q) => q.cat === c).map((q) => '<div class="qrow"><div class="qtext"><div style="display:flex;gap:8px;align-items:center"><span class="mono small faint">' + q.id + '</span>' + sevBadge(q.sev) + '</div><p>' + esc(q.title) + '</p><p class="small muted">' + esc(q.help) + '</p>' +
      '<p class="small faint">' + q.iso.map((k) => k + ' ' + (ISO[k] || '')).concat(q.nis2.map((k) => 'NIS2 ' + nis2Short(k))).map(esc).join(' · ') + '</p></div>' +
      '<div class="answers">' + ANSWERS.map(([k, l]) => '<button class="pill ans-' + k + (ans[q.id] === k ? ' on' : '') + '" data-act="answer" data-q="' + q.id + '" data-a="' + k + '">' + l + '</button>').join('') + '</div></div>').join('') + '</section>').join('');
}

// ---------------- Normen ----------------
function viewNorms() {
  const res = state.ev.results;
  const tab = state.normTab;
  const keys = tab === 'iso' ? Object.keys(ISO) : Object.keys(NIS2);
  const label = (k) => tab === 'iso' ? k + ' ' + ISO[k] : NIS2[k];
  const rows = keys.map((k) => {
    const list = res.filter((r) => (tab === 'iso' ? r.iso : r.nis2 || []).includes(k));
    const c = (s) => list.filter((r) => r.status === s).length;
    return { k, list, score: scoreOf(list), pass: c('pass'), warn: c('warn'), fail: c('fail'), other: c('na') + c('info') + c('open') };
  }).filter((x) => x.list.length);
  return head('ISO 27001 & NIS2', 'Zuordnung der Prüfpunkte zu ISO/IEC 27001:2022 Anhang A und zu den Risikomanagementmaßnahmen nach NIS2 (Art. 21, in Deutschland § 30 BSIG). Die Zuordnung dient der Orientierung und ersetzt kein Audit.') +
    '<div class="filters"><button class="pill' + (tab === 'iso' ? ' on' : '') + '" data-act="normTab" data-tab="iso">ISO/IEC 27001:2022</button><button class="pill' + (tab === 'nis2' ? ' on' : '') + '" data-act="normTab" data-tab="nis2">NIS2</button></div>' +
    '<section class="panel" style="padding:6px 0"><div class="tablewrap"><table class="t"><thead><tr><th>' + (tab === 'iso' ? 'Maßnahme (Anhang A)' : 'Anforderung') + '</th><th>Prüfpunkte</th><th>Erfüllt</th><th>Teilweise</th><th>Nicht erfüllt</th><th>Sonstige</th><th>Bewertung</th></tr></thead><tbody>' +
    rows.map((x) => '<tr class="click" data-act="ref" data-ref="' + x.k + '"><td class="name wrap">' + esc(label(x.k)) + '</td><td class="mono">' + x.list.length + '</td><td class="mono" style="color:var(--lime)">' + x.pass + '</td><td class="mono" style="color:var(--amber)">' + x.warn + '</td><td class="mono" style="color:var(--red-text)">' + x.fail + '</td><td class="mono muted">' + x.other + '</td><td><div class="minibar"><div style="width:' + (x.score || 0) + '%;background:' + scoreColor(x.score) + '"></div></div><span class="mono small" style="color:' + scoreColor(x.score) + '">' + (x.score === null ? '–' : x.score) + '</span></td></tr>').join('') +
    '</tbody></table></div></section>';
}

// ---------------- Verlauf ----------------
function viewHistory() {
  const demo = state.snap.demo;
  const list = demo ? [{ name: 'demo-vorher.json', tenant: state.snap.tenant.displayName, scannedAt: demoOlderSnapshot().scannedAt, score: null }] : state.snapshots;
  const cmp = state.compareEv;
  let diffHtml = '<div class="emptybox">Links einen gespeicherten Stand als Vergleichsbasis wählen.</div>';
  if (cmp) {
    const old = new Map(cmp.results.map((r) => [r.id, r]));
    const ch = state.ev.results.map((r) => [old.get(r.id), r]).filter(([a, b]) => a && a.status !== b.status);
    const neu = state.ev.results.filter((r) => !old.has(r.id) && r.source !== 'question');
    const better = ch.filter(([a, b]) => ORDER[b.status] > ORDER[a.status]);
    const worse = ch.filter(([a, b]) => ORDER[b.status] < ORDER[a.status]);
    const d = (state.ev.score || 0) - (cmp.score || 0);
    diffHtml = '<h2>Veränderung seit ' + fmtDT(state.compareSnap.scannedAt) + '</h2><div class="kpis">' +
      kpi('Bewertung', (d > 0 ? '+' : '') + d, (cmp.score === null ? '–' : cmp.score) + ' → ' + (state.ev.score === null ? '–' : state.ev.score), '', d >= 0 ? 'var(--lime)' : 'var(--red-text)') +
      kpi('Verbessert', better.length, 'Prüfpunkte', '', 'var(--lime)') + kpi('Verschlechtert', worse.length, 'Prüfpunkte', '', worse.length ? 'var(--red-text)' : null) + kpi('Neu', neu.length, 'Prüfpunkte', '') + '</div>' +
      (ch.length ? '<div class="tablewrap"><table class="t"><thead><tr><th>Prüfung</th><th>Vorher</th><th>Jetzt</th></tr></thead><tbody>' + ch.sort((x, y) => ORDER[x[1].status] - ORDER[y[1].status]).map(([a, b]) => '<tr class="click" data-act="open" data-id="' + esc(b.id) + '"><td class="name wrap">' + esc(b.title) + '</td><td>' + statusBadge(a.status) + '</td><td>' + statusBadge(b.status, b) + '</td></tr>').join('') + '</tbody></table></div>' : '<div class="emptybox">Keine Statusänderungen.</div>');
  }
  return head('Verlauf & Vergleich', 'Jede Prüfung wird lokal gespeichert. Der Vergleich zeigt, was sich seit einem früheren Stand verbessert oder verschlechtert hat – ideal für Folgetermine.',
    '<label class="btn" for="importFile">Ergebnisdatei laden</label><input type="file" id="importFile" accept=".json,application/json" class="sr" data-ch="importFile"><button class="btn" data-act="exportJson">Aktuellen Stand als JSON</button>') +
    '<div class="split"><section class="panel" style="flex:1 1 300px;max-width:440px"><h2>Gespeicherte Stände</h2>' +
    (list.length ? '<div class="targetlist" data-keep-scroll="snaps">' + list.map((s) => '<div class="assign" style="flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-weight:500">' + fmtDT(s.scannedAt) + '</b>' + (s.score !== null && s.score !== undefined ? '<span class="mono" style="color:' + scoreColor(s.score) + '">' + s.score + '</span>' : '') + '</div><span class="small muted">' + esc(s.tenant || '') + '</span><div style="display:flex;gap:6px;flex-wrap:wrap">' +
      '<button class="btn" style="min-height:32px" data-act="compare" data-name="' + esc(s.name) + '">' + (state.compareName === s.name ? '✓ Vergleichsbasis' : 'Vergleichen') + '</button>' +
      (!demo ? '<button class="btn" style="min-height:32px" data-act="openSnap" data-name="' + esc(s.name) + '">Ansehen</button><button class="btn ghost" style="min-height:32px" data-act="delSnap" data-name="' + esc(s.name) + '">Entfernen</button>' : '') + '</div></div>').join('') + '</div>' : '<p class="muted small">Noch keine gespeicherten Stände. Nach der nächsten Prüfung liegt hier der erste.</p>') +
    (demo ? '<p class="small faint">Demo: Vergleich mit einem Beispielstand von August.</p>' : '<p class="small faint">Ablage: ' + esc(state.info.dataDir || '') + '/ergebnisse</p>') + '</section>' +
    '<section class="panel" style="flex:3 1 520px">' + diffHtml + '</section></div>';
}

// ---------------- Export ----------------
const FORMATS = [['docx', 'Word', '.docx mit Titelseite & Inhaltsverzeichnis'], ['pdf', 'PDF', 'über den Druckdialog'], ['html', 'HTML-Bericht', 'eine Datei, im Browser lesbar'], ['md', 'Markdown', 'für Wiki, Git, IT-Glue'], ['csv', 'Excel: Befunde', 'CSV, eine Zeile je Prüfpunkt'], ['json', 'JSON', 'vollständiger Rohdatenstand']];
function viewExport() {
  const e = state.ex;
  const isDoc = ['docx', 'pdf', 'html', 'md'].includes(e.format);
  const fmtLabel = FORMATS.find((f) => f[0] === e.format)[1];
  const toc = X.SECTIONS.filter((s) => e.sections.has(s.key) && (s.key !== 'compare' || state.compareEv)).map((s) => s.label);
  const rt = rating(state.ev.score);
  return head('Prüfbericht', 'Management-Zusammenfassung, Bewertung, Maßnahmenplan und Detailergebnisse – mit Ihrem Branding.') +
    '<div class="split"><section class="panel" style="flex:3 1 480px;gap:20px">' +
    '<div style="display:flex;flex-direction:column;gap:10px"><h2 style="font-size:14px">Format</h2><div class="formats">' +
    FORMATS.map(([k, l, s]) => '<button class="fmt' + (e.format === k ? ' on' : '') + '" data-act="fmt" data-fmt="' + k + '"><b>' + esc(l) + '</b><span class="s">' + esc(s) + '</span></button>').join('') + '</div></div>' +
    (isDoc ? '<div style="display:flex;flex-direction:column;gap:10px"><h2 style="font-size:14px">Inhalt</h2><div class="checks">' +
      X.SECTIONS.map((s) => '<label class="check"><input type="checkbox" data-ch="sec" data-key="' + s.key + '"' + (e.sections.has(s.key) ? ' checked' : '') + (s.key === 'compare' && !state.compareEv ? ' disabled' : '') + '><span>' + esc(s.label) + (s.key === 'compare' && !state.compareEv ? ' <span class="faint">(erst unter „Verlauf“ einen Stand wählen)</span>' : '') + '</span></label>').join('') +
      '<label class="check"><input type="checkbox" data-ch="names"' + (e.names ? ' checked' : '') + '><span>Namen in Detaillisten (Admins, Gäste …) <span class="faint">(personenbezogen)</span></span></label></div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">' +
      '<label class="field" for="exCustomer">Kunde (Titel)<input class="input" id="exCustomer" data-in="exCustomer" placeholder="' + esc(state.snap.tenant.displayName || '') + '" value="' + esc(e.customer) + '"></label>' +
      '<label class="field" for="exPartner">Partner (Branding)<input class="input" id="exPartner" data-in="exPartner" placeholder="z. B. Muster IT-Partner GmbH" value="' + esc(e.partner) + '"></label>' +
      '<label class="field" for="exAuthor">Erstellt von<input class="input" id="exAuthor" data-in="exAuthor" placeholder="Name" value="' + esc(e.author) + '"></label>' +
      '<label class="field" for="exContact">Ansprechpartner (Kontakt im Bericht)<input class="input" id="exContact" data-in="exContact" placeholder="Name · Telefon · E-Mail" value="' + esc(e.contact) + '"></label></div>' : '') +
    '<button class="btn primary lg" data-act="doExport"' + (state.busy ? ' disabled' : '') + '>' + (state.busy ? 'Wird erzeugt …' : esc(fmtLabel) + ' erzeugen') + '</button>' +
    (e.format === 'pdf' ? '<p class="small muted">Im Druckdialog als Ziel „Als PDF speichern“ bzw. „Microsoft Print to PDF“ wählen.</p>' : '') +
    (e.format === 'docx' ? '<p class="small muted">Word fragt beim Öffnen, ob Felder aktualisiert werden sollen – mit „Ja“ erscheint das Inhaltsverzeichnis.</p>' : '') +
    (state.ev.counts.open ? '<p class="small" style="color:var(--amber)">' + state.ev.counts.open + ' Fragen im Fragebogen sind noch offen und erscheinen im Bericht als „offen“.</p>' : '') +
    '</section><aside class="preview" style="flex:2 1 300px"><span class="k">Vorschau · Titelseite</span><span class="k" style="color:#4A5E5D">' + esc(e.partner || 'M365 Security Check') + '</span><h3>Microsoft-365-Sicherheitsprüfung<br>' + esc(e.customer || state.snap.tenant.displayName || '') + '</h3><span class="small" style="color:#4A5E5D">Stand ' + esc(fmtD(state.snap.scannedAt)) + (e.author ? ' · ' + esc(e.author) : '') + '</span><div class="bar"></div>' +
    '<div class="pvscore"><b style="color:' + ({ ok: '#4E7D10', info: '#00787A', warn: '#9A5B00', bad: '#B3261E', neutral: '#4A5E5D' })[rt.tone] + '">' + (state.ev.score === null ? '–' : state.ev.score) + '</b><span>' + esc(rt.label) + '</span></div>' +
    (isDoc ? '<div class="toc"><b>Inhalt</b>' + toc.map((l) => '<span>' + esc(l) + '</span>').join('') + '</div>' : '<p class="small" style="color:#4A5E5D">Tabellenexport mit Semikolon als Trennzeichen – lässt sich direkt in Excel öffnen.</p>') + '</aside></div>';
}

// ---------------- Protokoll & Einstellungen ----------------
function viewLog() {
  const s = state.snap;
  return head('Scan-Protokoll', 'Was gelesen wurde und wo es Einschränkungen gab.') +
    '<section class="panel"><h2>Hinweise (' + s.warnings.length + ')</h2>' + (s.warnings.length ? '<div class="tablewrap"><table class="t"><thead><tr><th>Quelle</th><th>Hinweis</th></tr></thead><tbody>' + s.warnings.map((w) => '<tr><td class="name">' + esc(w.source) + '</td><td class="wrap">' + esc(w.message) + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted">Alles vollständig gelesen.</p>') +
    '<p class="small muted">„Keine Berechtigung (403)“ bedeutet meist: Die Graph-Berechtigung fehlt in der App-Registrierung bzw. die Administratorzustimmung ist veraltet, oder die angemeldete Person hat keine passende Rolle (empfohlen: Globaler Leser). „Lizenz fehlt“ ist ein Befund an sich – die Funktion steht im Mandanten nicht zur Verfügung.</p></section>' +
    '<section class="panel"><h2>Gelesene Quellen</h2><div class="tablewrap"><table class="t"><thead><tr><th>Quelle</th><th>Berechtigung</th><th>Ergebnis</th></tr></thead><tbody>' +
    SOURCES.map((src) => { const v = s.data[src.key]; const e = s.errors[src.key]; return '<tr><td>' + esc(src.label) + '</td><td class="mono small muted">' + esc(src.perm) + '</td><td class="small">' + (e ? '<span style="color:var(--amber)">' + esc(e.kind === 'license' ? 'Lizenz fehlt' : e.kind === 'permission' ? 'Keine Berechtigung' : e.kind === 'unavailable' ? 'Nicht eingerichtet' : 'Fehler') + '</span>' : v === undefined ? '—' : Array.isArray(v) ? v.length + ' Einträge' : 'gelesen') + '</td></tr>'; }).join('') +
    '<tr><td>Mail-DNS (SPF, DKIM, DMARC, MTA-STS)</td><td class="mono small muted">öffentliches DNS</td><td class="small">' + (s.dns ? s.dns.length + ' Domänen' : 'nicht ausgeführt') + '</td></tr></tbody></table></div></section>';
}
function viewSettings() {
  const ru = state.info.redirectUri || '';
  return head('Einstellungen', 'Verbindung und Darstellung.') +
    '<section class="panel" style="max-width:760px"><h2>App-Registrierung</h2>' +
    '<label class="field" for="cfgClient">Anwendungs-ID (Client-ID)<input class="input mono" id="cfgClient" value="' + esc(state.cfg.clientId || '') + '"></label>' +
    '<label class="field" for="cfgTenant">Standard-Mandant (optional)<input class="input mono" id="cfgTenant" value="' + esc(state.cfg.defaultTenant || '') + '"></label>' +
    '<label class="field" for="cfgBrand">Untertitel unter dem Logo (z. B. Firmen- oder Teamname)<input class="input" id="cfgBrand" placeholder="Sicherheitsprüfung für Microsoft 365" value="' + esc(state.cfg.brandLabel || '') + '"></label>' +
    '<div><button class="btn primary" data-act="saveSettings">Speichern</button></div>' +
    '<span class="sectlabel">Umleitungs-URI (SPA)</span><div class="copyrow"><code>' + esc(ru) + '</code><button class="btn" data-act="copy" data-text="' + esc(ru) + '">' + ICON.copy + 'Kopieren</button></div>' +
    '<span class="sectlabel">Benötigte Graph-Berechtigungen (delegiert, nur lesend)</span>' + permChips() + '</section>' +
    '<section class="panel" style="max-width:760px"><h2>Darstellung & Daten</h2><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="theme">' + themeLabel() + '</button></div>' +
    '<dl class="kv"><dt>Version</dt><dd>' + esc(state.info.version || '') + '</dd><dt>Datenordner</dt><dd class="mono">' + esc(state.info.dataDir || '') + '</dd><dt>Angemeldet</dt><dd>' + esc(state.account ? state.account.username : '—') + '</dd></dl></section>';
}

// ---------------- Aktionen ----------------
function reevaluate() { state.ev = evaluate(state.snap, state.notes); if (state.compareSnap) state.compareEv = evaluate(state.compareSnap, state.compareSnap.notes || state.notes); }
function load(snap, notes) {
  state.snap = snap;
  state.notes = Object.assign({ answers: {}, notes: {}, accepted: {} }, notes || {});
  reevaluate();
  state.selId = null;
  state.ex.customer = '';
}
const noteKey = () => String(state.snap.tenant.id || state.snap.tenant.domain || 'tenant').replace(/[^A-Za-z0-9._-]/g, '_');
async function loadNotes() {
  if (state.snap.demo) return;
  try { const n = await api('/api/notes/' + encodeURIComponent(noteKey())); state.notes = Object.assign({ answers: {}, notes: {}, accepted: {} }, n); } catch (e) { /* leer */ }
  reevaluate();
}
const saveNotes = debounce(async () => {
  if (state.snap.demo) return;
  try { await api('/api/notes/' + encodeURIComponent(noteKey()), { method: 'POST', body: JSON.stringify(state.notes) }); } catch (e) { toast('Konnte nicht gespeichert werden: ' + e.message); }
}, 500);
async function refreshSnapshots() {
  if (state.snap && state.snap.demo) return;
  try { const all = await api('/api/snapshots'); const tid = state.snap && state.snap.tenant.id; state.snapshots = all.filter((s) => !tid || !s.tenantId || s.tenantId === tid); } catch (e) { state.snapshots = []; }
}

function explainLoginError(e) {
  const m = String((e && (e.errorMessage || e.message)) || e);
  const code = (e && e.errorCode) || '';
  if (code === 'popup_window_error' || (/popup/i.test(m) && /block/i.test(m))) return 'Das Anmeldefenster wurde blockiert. Bitte Pop-ups für <b>localhost</b> erlauben und erneut versuchen.';
  if (code === 'user_cancelled') return 'Anmeldung abgebrochen.';
  if (/AADSTS50011/.test(m)) return 'Die Umleitungs-URI passt nicht. In der App-Registrierung unter <b>Authentifizierung › Single-Page-Anwendung</b> genau <code>' + esc(state.info.redirectUri) + '</code> eintragen.';
  if (/AADSTS700016/.test(m)) return 'Die App-Registrierung wurde in diesem Mandanten nicht gefunden. Ist sie als <b>mehrinstanzenfähig</b> konfiguriert und die Client-ID korrekt?';
  if (/AADSTS65001|AADSTS90094|consent/i.test(m)) {
    const t = (document.getElementById('loginTenant') || {}).value || 'organizations';
    const url = 'https://login.microsoftonline.com/' + encodeURIComponent(t.trim() || 'organizations') + '/adminconsent?client_id=' + encodeURIComponent(state.cfg.clientId || '');
    return 'Für diesen Mandanten fehlt die Administratorzustimmung. Ein Administrator des Kunden (oder per GDAP mit der Rolle Cloudanwendungsadministrator) kann sie einmalig erteilen: <a href="' + esc(url) + '" target="_blank" rel="noopener">Admin-Zustimmung öffnen</a>';
  }
  if (/AADSTS90072|AADSTS50020/.test(m)) return 'Das Konto existiert im angegebenen Mandanten nicht. Bei GDAP den Kundenmandanten angeben und mit dem Partnerkonto anmelden.';
  if (/AADSTS9002326|Cross-origin/i.test(m)) return 'Die Umleitungs-URI ist als „Web“ statt als <b>Single-Page-Anwendung</b> registriert.';
  return esc(m);
}

async function startScan() {
  state.screen = 'scanning';
  state.scan = { rows: {} };
  render();
  try {
    const snap = await scanTenant((p) => { state.scan.rows[p.key] = { label: p.label, state: p.state, info: p.info }; renderSoon(); }, { dns: state.dns });
    snap.scannedBy = state.account ? state.account.username : '';
    state.snap = snap;
    await loadNotes();
    load(snap, state.notes);
    state.viewingSaved = null;
    try {
      const slug = String(snap.tenant.initialDomain || snap.tenant.domain || snap.tenant.id || 'tenant').replace(/\.onmicrosoft\.com$/, '').replace(/[^A-Za-z0-9-]/g, '-');
      const ts = snap.scannedAt.replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
      const toSave = Object.assign({}, snap, { score: state.ev.score, summary: { checks: state.ev.counts.total }, notes: state.notes });
      await api('/api/snapshots?name=' + encodeURIComponent(slug + '_' + ts + '.json'), { method: 'POST', body: JSON.stringify(toSave) });
    } catch (e) { snap.warnings.push({ source: 'Ablage', message: 'Ergebnis konnte nicht lokal gespeichert werden: ' + e.message }); }
    await refreshSnapshots();
    state.screen = 'app'; state.view = 'dashboard';
    render();
  } catch (e) {
    state.screen = 'login';
    state.error = 'Prüfung fehlgeschlagen: ' + esc(e.message || e);
    render();
  }
}
function startDemo() {
  load(demoSnapshot(), demoNotes());
  state.viewingSaved = null; clearCompare();
  state.screen = 'app'; state.view = 'dashboard';
  render();
}
function clearCompare() { state.compareSnap = null; state.compareEv = null; state.compareName = ''; }
function setCompare(s, name) { state.compareSnap = s; state.compareName = name; state.compareEv = evaluate(s, s.notes || state.notes); }

function openCheck(id) {
  state.view = 'findings'; state.selId = id; state.cat = ALL; state.statusF = 'all'; state.sourceF = ALL; state.sevF = ALL; state.q = ''; state.refF = '';
  render(); window.scrollTo(0, 0);
}

const ACTIONS = {
  async saveSetup() {
    const clientId = document.getElementById('cfgClient').value.trim();
    const defaultTenant = document.getElementById('cfgTenant').value.trim();
    if (!/^[0-9a-f-]{36}$/i.test(clientId)) { state.error = 'Bitte eine gültige Client-ID (GUID) eintragen.'; render(); return; }
    state.cfg = await api('/api/config', { method: 'POST', body: JSON.stringify({ clientId, defaultTenant, brandLabel: state.cfg.brandLabel || '' }) });
    state.error = ''; state.screen = 'login'; render();
  },
  async saveSettings() {
    const clientId = document.getElementById('cfgClient').value.trim();
    const defaultTenant = document.getElementById('cfgTenant').value.trim();
    if (clientId && !/^[0-9a-f-]{36}$/i.test(clientId)) { toast('Ungültige Client-ID'); return; }
    const brandLabel = document.getElementById('cfgBrand').value.trim();
    state.cfg = await api('/api/config', { method: 'POST', body: JSON.stringify({ clientId, defaultTenant, brandLabel }) });
    toast('Gespeichert');
  },
  openSetup() { state.error = ''; state.screen = 'setup'; render(); },
  demo() { startDemo(); },
  async login() {
    if (!state.cfg.clientId) { state.screen = 'setup'; render(); return; }
    const tenant = document.getElementById('loginTenant').value.trim();
    lsSet('msc.lastTenant', tenant);
    state.error = ''; state.busy = true; render();
    try {
      G.setLoginMode(state.loginRedirect ? 'redirect' : 'popup');
      await G.initAuth(state.cfg.clientId, tenant);
      if (state.loginRedirect) { try { sessionStorage.setItem('msc.autoscan', '1'); } catch (e) { /* */ } }
      state.account = await G.login();
      state.busy = false;
      await startScan();
    } catch (e) { state.busy = false; state.error = explainLoginError(e); render(); }
  },
  async continue() {
    const tenant = document.getElementById('loginTenant').value.trim();
    lsSet('msc.lastTenant', tenant);
    try { await G.initAuth(state.cfg.clientId, tenant); state.account = G.currentAccount(); await startScan(); } catch (e) { state.error = explainLoginError(e); render(); }
  },
  async logout() {
    if (!confirm('Abmelden und zur Anmeldung zurückkehren?')) return;
    await G.logout();
    state.account = null; state.snap = null; state.ev = null; clearCompare();
    state.screen = 'login'; render();
  },
  async rescan() { await startScan(); },
  theme() { setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'); render(); },
  nav(el) { state.view = el.dataset.view; if (state.view === 'history') refreshSnapshots().then(render); render(); window.scrollTo(0, 0); },
  cat(el) { state.cat = el.dataset.cat; state.view = 'findings'; state.selId = null; if (state.statusF === 'open' && el.closest('.catbar')) state.statusF = 'all'; render(); window.scrollTo(0, 0); },
  filter(el) { state.view = 'findings'; state.statusF = el.dataset.status; state.cat = ALL; state.sourceF = ALL; state.sevF = ALL; state.q = ''; state.refF = ''; state.selId = null; render(); window.scrollTo(0, 0); },
  ref(el) { state.view = 'findings'; state.refF = el.dataset.ref; state.statusF = 'all'; state.cat = ALL; state.sourceF = ALL; state.sevF = ALL; state.q = ''; state.selId = null; render(); window.scrollTo(0, 0); },
  normTab(el) { state.normTab = el.dataset.tab; render(); },
  resetFilters() { state.cat = ALL; state.statusF = 'open'; state.sourceF = ALL; state.sevF = ALL; state.q = ''; state.refF = ''; render(); },
  select(el) { state.selId = el.dataset.id; render(); },
  open(el) { openCheck(el.dataset.id); },
  answer(el) {
    const q = el.dataset.q, a = el.dataset.a;
    if (state.notes.answers[q] === a) delete state.notes.answers[q]; else state.notes.answers[q] = a;
    reevaluate(); saveNotes(); render();
  },
  accept(el) {
    const why = prompt('Begründung für die Risikoakzeptanz (erscheint im Bericht):', '');
    if (why === null) return;
    state.notes.accepted[el.dataset.id] = why.trim() || true;
    reevaluate(); saveNotes(); render();
  },
  unaccept(el) { delete state.notes.accepted[el.dataset.id]; reevaluate(); saveNotes(); render(); },
  fmt(el) { state.ex.format = el.dataset.fmt; render(); },
  copy(el) {
    const t = el.dataset.text;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Kopiert'), () => toast('Kopieren nicht möglich – bitte manuell markieren.'));
  },
  async compare(el) {
    const name = el.dataset.name;
    if (state.snap.demo) { setCompare(demoOlderSnapshot(), name); render(); return; }
    try { const s = await api('/api/snapshots/' + encodeURIComponent(name)); setCompare(s, name); render(); } catch (e) { toast('Nicht lesbar: ' + e.message); }
  },
  async openSnap(el) {
    try {
      const s = await api('/api/snapshots/' + encodeURIComponent(el.dataset.name));
      state.liveSnap = state.liveSnap || state.snap;
      load(s, s.notes || state.notes); state.viewingSaved = fmtDT(s.scannedAt); clearCompare();
      state.view = 'dashboard'; render();
    } catch (e) { toast('Nicht lesbar: ' + e.message); }
  },
  async openSaved(el) {
    try {
      const s = await api('/api/snapshots/' + encodeURIComponent(el.dataset.name));
      state.snap = s; await loadNotes();
      load(s, state.notes.answers && Object.keys(state.notes.answers).length ? state.notes : (s.notes || state.notes));
      state.viewingSaved = fmtDT(s.scannedAt); state.liveSnap = null; clearCompare();
      await refreshSnapshots();
      state.screen = 'app'; state.view = 'dashboard'; render(); window.scrollTo(0, 0);
    } catch (e) { toast('Nicht lesbar: ' + e.message); }
  },
  async backToLive() {
    if (!state.liveSnap && !state.account) { state.viewingSaved = null; state.snap = null; state.ev = null; clearCompare(); state.screen = 'login'; render(); return; }
    if (state.liveSnap) { state.snap = state.liveSnap; state.liveSnap = null; }
    state.viewingSaved = null; clearCompare();
    await loadNotes(); render();
  },
  async delSnap(el) {
    if (!confirm('Diesen gespeicherten Stand entfernen? Er wird in den Unterordner „_entfernt“ verschoben.')) return;
    try { await api('/api/snapshots/' + encodeURIComponent(el.dataset.name), { method: 'DELETE' }); if (state.compareName === el.dataset.name) clearCompare(); await refreshSnapshots(); render(); } catch (e) { toast(e.message); }
  },
  exportJson() { X.download(X.fileStem(model()) + '.json', JSON.stringify(Object.assign({}, state.snap, { score: state.ev.score, notes: state.notes }), null, 2), 'application/json'); },
  csvPlan() { const m = model(); X.download(X.fileStem(m) + '_Massnahmenplan.csv', X.toCsvPlan(m), 'text/csv;charset=utf-8'); },
  async doExport() {
    const e = state.ex;
    lsSet('msc.partner', e.partner); lsSet('msc.author', e.author); lsSet('msc.contact', e.contact);
    state.busy = true; render();
    try {
      const m = model();
      const stem = X.fileStem(m);
      if (e.format === 'docx') X.download(stem + '.docx', await X.toDocx(m));
      else if (e.format === 'pdf') X.printHtml(X.toHtml(m));
      else if (e.format === 'html') X.download(stem + '.html', X.toHtml(m), 'text/html;charset=utf-8');
      else if (e.format === 'md') X.download(stem + '.md', X.toMarkdown(m), 'text/markdown;charset=utf-8');
      else if (e.format === 'csv') X.download(stem + '_Befunde.csv', X.toCsv(m), 'text/csv;charset=utf-8');
      else ACTIONS.exportJson();
      state.busy = false; toast(e.format === 'pdf' ? 'Druckdialog geöffnet' : 'Datei erzeugt');
    } catch (err) { state.busy = false; toast('Export fehlgeschlagen: ' + err.message); }
  }
};
function model() {
  const e = state.ex;
  return X.buildModel(state.snap, state.ev, { sections: e.sections, names: e.names, partner: e.partner, author: e.author, contact: e.contact, customer: e.customer, notes: state.notes, compare: state.compareEv ? { ev: state.compareEv, at: state.compareSnap.scannedAt } : null });
}

const INPUTS = {
  q(el) { state.q = el.value; if (state.view !== 'findings') { state.view = 'findings'; state.statusF = 'all'; state.selId = null; render(); } else renderSoon(); },
  note(el) { const id = el.dataset.id; if (el.value) state.notes.notes[id] = el.value; else delete state.notes.notes[id]; saveNotes(); },
  exCustomer(el) { state.ex.customer = el.value; renderSoon(); },
  exPartner(el) { state.ex.partner = el.value; renderSoon(); },
  exAuthor(el) { state.ex.author = el.value; renderSoon(); },
  exContact(el) { state.ex.contact = el.value; }
};
const CHANGES = {
  statusF(el) { state.statusF = el.value; state.selId = null; render(); },
  sourceF(el) { state.sourceF = el.value; state.selId = null; render(); },
  sevF(el) { state.sevF = el.value; state.selId = null; render(); },
  dns(el) { state.dns = el.checked; lsSet('msc.dns', el.checked ? '1' : '0'); },
  loginRedirect(el) { state.loginRedirect = el.checked; lsSet('msc.loginMode', el.checked ? 'redirect' : 'popup'); G.setLoginMode(el.checked ? 'redirect' : 'popup'); },
  names(el) { state.ex.names = el.checked; },
  sec(el) { if (el.checked) state.ex.sections.add(el.dataset.key); else state.ex.sections.delete(el.dataset.key); render(); },
  importFile(el) {
    const f = el.files && el.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(r.result);
        if (!s || !s.data || !s.tenant) throw new Error('Keine Ergebnisdatei von M365 Security Check.');
        setCompare(s, 'file:' + f.name); render();
      } catch (e) { toast('Datei nicht lesbar: ' + e.message); }
    };
    r.readAsText(f);
  }
};

root.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || !root.contains(el)) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) { e.preventDefault(); Promise.resolve(fn(el, e)).catch((err) => toast(err.message || String(err))); }
});
root.addEventListener('input', (e) => { const el = e.target.closest('[data-in]'); if (el && INPUTS[el.dataset.in]) INPUTS[el.dataset.in](el, e); });
root.addEventListener('change', (e) => { const el = e.target.closest('[data-ch]'); if (el && CHANGES[el.dataset.ch]) CHANGES[el.dataset.ch](el, e); });
root.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'loginTenant') { e.preventDefault(); ACTIONS.login(); }
  if (e.key === 'Enter' && (e.target.id === 'cfgClient' || e.target.id === 'cfgTenant') && state.screen === 'setup') { e.preventDefault(); ACTIONS.saveSetup(); }
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && state.screen === 'app') { e.preventDefault(); const q = document.getElementById('q'); if (q) { q.focus(); q.select(); } }
  if (e.key === 'Escape' && document.activeElement && document.activeElement.id === 'q' && state.q) { state.q = ''; render(); }
});

// ---------------- Start ----------------
(async function boot() {
  try { state.info = await api('/api/info'); } catch (e) { state.info = { redirectUri: location.origin + '/redirect.html' }; }
  try { state.cfg = await api('/api/config'); } catch (e) { state.cfg = {}; }
  const params = new URLSearchParams(location.search);
  if (params.has('demo')) { startDemo(); if (params.get('view')) { state.view = params.get('view'); render(); } return; }
  if (!state.cfg.clientId) { state.screen = 'setup'; render(); return; }
  G.setLoginMode(state.loginRedirect ? 'redirect' : 'popup');
  let auto = false;
  try { auto = sessionStorage.getItem('msc.autoscan') === '1'; sessionStorage.removeItem('msc.autoscan'); } catch (e) { /* */ }
  try { state.account = await G.initAuth(state.cfg.clientId, lsGet('msc.lastTenant', state.cfg.defaultTenant || '')); } catch (e) { state.account = null; }
  const rErr = G.takeRedirectError();
  if (location.hash || location.search) history.replaceState(null, '', '/');
  if (rErr) { state.error = explainLoginError(rErr); state.screen = 'login'; render(); return; }
  if (auto && state.account) { await startScan(); return; }
  try { state.saved = await api('/api/snapshots'); } catch (e) { state.saved = []; }
  state.screen = 'login';
  render();
})();
