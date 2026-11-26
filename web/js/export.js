// Prüfbericht: Word (.docx), PDF (über Druckansicht), HTML, Markdown, CSV, JSON.
// Der Inhalt wird einmal als Blockstruktur aufgebaut (buildDoc) und dann in jedes Format übersetzt.
/* global docx */
import { CATEGORIES, catLabel, ISO, NIS2, nis2Short, SEVERITY, STATUS, EFFORT, licHint } from './catalog.js';
import { rating, PRIO, scoreOf } from './checks.js';

export const SECTIONS = [
  { key: 'summary', label: 'Management-Zusammenfassung' },
  { key: 'scores', label: 'Bewertung nach Bereich' },
  { key: 'plan', label: 'Priorisierter Maßnahmenplan' },
  { key: 'details', label: 'Feststellungen im Detail (Handlungsbedarf)' },
  { key: 'passed', label: 'Erfüllte Prüfpunkte' },
  { key: 'questions', label: 'Organisatorische Bestandsaufnahme (Fragebogen)' },
  { key: 'norms', label: 'Zuordnung ISO/IEC 27001 und NIS2' },
  { key: 'compare', label: 'Veränderung seit Vergleichsstand' },
  { key: 'method', label: 'Prüfumfang, Methodik und Hinweise' }
];

const BRAND = '005758';
const fmtD = (iso) => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
const fmtDT = (iso) => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? '—' : d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const sc = (v) => v === null || v === undefined ? '–' : String(v);
const licShort = (k) => ({ P1: 'Entra ID P1', P2: 'Entra ID P2', INTUNE: 'Intune' })[k] || k || '';
const SRC = { graph: 'Microsoft Graph', dns: 'DNS', securescore: 'Secure Score', question: 'Fragebogen' };
const statusText = (r) => r.accepted ? 'Risiko akzeptiert' : STATUS[r.status];

export function buildModel(snap, ev, opts) {
  const o = opts || {};
  return {
    snap, ev, tenant: snap.tenant || {}, scannedAt: snap.scannedAt, scannedBy: snap.scannedBy, demo: !!snap.demo,
    sections: o.sections || new Set(SECTIONS.map((s) => s.key)), names: o.names !== false,
    partner: o.partner || '', author: o.author || '', contact: o.contact || '', customer: o.customer || (snap.tenant || {}).displayName || (snap.tenant || {}).domain || 'Mandant',
    notes: (o.notes && o.notes.notes) || {}, compare: o.compare || null
  };
}

const H = (level, text) => ({ t: 'h' + level, text });
const P = (text, tone) => ({ t: 'p', text, tone });
const TABLE = (head, rows, widths, cls) => ({ t: 'table', head, rows, widths, cls });
const BUL = (items) => ({ t: 'bullets', items });

function summaryBlocks(m) {
  const ev = m.ev, c = ev.counts, rt = rating(ev.score);
  const high = ev.results.filter((r) => r.status === 'fail' && r.sev === 'high' && !r.accepted);
  const lic = [...new Set(ev.plan.filter((r) => r.licMissing).map((r) => r.lic))];
  const b = [
    { t: 'score', score: ev.score, label: rt.label, tone: rt.tone, sub: [['Technisch', sc(ev.scoreTech)], ['Organisatorisch', sc(ev.scoreOrg)], ['Microsoft Secure Score', ev.secureScore ? ev.secureScore.pct + ' %' : '–']] },
    P('Im Rahmen der Sicherheitsprüfung wurde der Microsoft-365-Mandant von ' + m.customer + ' am ' + fmtD(m.scannedAt) + ' anhand von ' + c.total + ' Prüfpunkten bewertet: ' + (c.technical - c.securescore) + ' technische Prüfungen über Microsoft Graph und DNS, ' + c.securescore + ' Kontrollen aus dem Microsoft Secure Score sowie ' + c.questions + ' Fragen zu Organisation und Prozessen. Die Prüfung erfolgte ausschließlich lesend.'),
    P('Gesamtergebnis: ' + sc(ev.score) + ' von 100 Punkten – „' + rt.label + '“. ' + c.pass + ' Prüfpunkte sind erfüllt, ' + c.warn + ' teilweise und ' + c.fail + ' nicht erfüllt. ' + (c.na ? c.na + ' Punkte waren mangels Lizenz oder Berechtigung nicht prüfbar. ' : '') + (c.open ? c.open + ' Fragen sind noch offen.' : ''))
  ];
  if (high.length) b.push(H(3, 'Kritische Feststellungen'), BUL(high.slice(0, 10).map((r) => ({ sev: 'high', label: catLabel(r.cat), text: r.title + (r.summary ? ' – ' + r.summary : '') }))));
  const strong = ev.byCat.filter((x) => x.score !== null && x.score >= 80).map((x) => x.label);
  const weak = ev.byCat.filter((x) => x.score !== null && x.score < 50).sort((a, z) => a.score - z.score).map((x) => x.label + ' (' + x.score + ')');
  if (strong.length || weak.length) b.push(H(3, 'Stärken und Schwerpunkte'), BUL([].concat(strong.length ? [{ sev: 'low', label: 'Gut aufgestellt', text: strong.join(', ') }] : [], weak.length ? [{ sev: 'medium', label: 'Größter Handlungsbedarf', text: weak.join(', ') }] : [])));
  if (ev.quickWins.length) b.push(H(3, 'Quick Wins – schnell umsetzbar mit hoher Wirkung'), BUL(ev.quickWins.slice(0, 8).map((r) => ({ sev: r.sev, label: SEVERITY[r.sev], text: r.title }))));
  if (lic.length) b.push(H(3, 'Lizenzhinweise'), P('Für ' + ev.plan.filter((r) => r.licMissing).length + ' empfohlene Maßnahmen ist eine im Mandanten nicht vorhandene Lizenz erforderlich:'), BUL(lic.map((l) => ({ sev: 'info', label: licShort(l), text: licHint(l) }))));
  const acc = ev.results.filter((r) => r.accepted);
  if (acc.length) b.push(H(3, 'Akzeptierte Risiken'), TABLE(['Prüfpunkt', 'Begründung'], acc.map((r) => [r.title, typeof r.accepted === 'string' ? r.accepted : '—']), [55, 45]));
  b.push(H(3, 'Empfehlung'), P('Wir empfehlen, die Maßnahmen der Priorität „Sofort“ innerhalb der nächsten vier Wochen umzusetzen und die Prüfung nach Abschluss zu wiederholen, um den Fortschritt zu belegen.' + (m.contact ? ' Ihr Ansprechpartner: ' + m.contact + '.' : '')));
  return b;
}

function detailRows(m, r) {
  const rows = [['Ergebnis', statusText(r) + (r.summary ? ' – ' + r.summary : '')], ['Schweregrad', SEVERITY[r.sev]]];
  if (r.prio) rows.push(['Priorität', PRIO[r.prio]]);
  if (r.effort) rows.push(['Aufwand', EFFORT[r.effort]]);
  if (r.lic) rows.push(['Lizenz', licHint(r.lic) + (r.licMissing ? ' (nicht vorhanden)' : '')]);
  if (r.why) rows.push(['Risiko', r.why]);
  if (r.fix) rows.push(['Empfehlung' + (r.fixLang === 'en' ? ' (Microsoft)' : ''), r.fix]);
  const refs = (r.iso || []).map((k) => 'ISO ' + k).concat((r.nis2 || []).map((k) => 'NIS2 ' + nis2Short(k)));
  if (refs.length) rows.push(['Normbezug', refs.join(', ')]);
  rows.push(['Quelle', SRC[r.source] || r.source]);
  if (m.notes[r.id]) rows.push(['Kommentar', m.notes[r.id]]);
  return rows;
}

export function buildDoc(m) {
  const S = m.sections, ev = m.ev;
  const sections = [];
  const add = (id, title, blocks) => sections.push({ id, title, blocks });
  if (S.has('summary')) add('summary', 'Management-Zusammenfassung', summaryBlocks(m));
  if (S.has('scores')) add('scores', 'Bewertung nach Bereich', [
    TABLE(['Bereich', 'Bewertung', 'Erfüllt', 'Teilweise', 'Nicht erfüllt', 'Nicht prüfbar / offen'], ev.byCat.map((c) => [c.label, sc(c.score), c.pass, c.warn, c.fail, c.na + c.open]), [34, 14, 13, 13, 13, 13]),
    P('Bewertung 0–100, gewichtet nach Schweregrad (hoch × 10, mittel × 5, niedrig × 2); „teilweise“ zählt zur Hälfte. Informationen, nicht prüfbare und offene Punkte fließen nicht ein.', 'muted')
  ]);
  if (S.has('plan')) {
    const b = [];
    for (const p of [1, 2, 3]) {
      const list = ev.plan.filter((r) => r.prio === p);
      b.push(H(2, PRIO[p] + ' (' + list.length + ')'));
      b.push(TABLE(['Nr.', 'Maßnahme', 'Bereich', 'Aufwand', 'Lizenz'], list.map((r, i) => [p + '.' + (i + 1), r.title + '\n' + firstSentence(r.fix), catLabel(r.cat), EFFORT[r.effort] || '', r.lic ? licShort(r.lic) + (r.licMissing ? ' (fehlt)' : '') : '']), [7, 53, 18, 10, 12]));
    }
    add('plan', 'Priorisierter Maßnahmenplan', b);
  }
  if (S.has('details')) {
    const b = [];
    for (const c of CATEGORIES) {
      const list = ev.results.filter((r) => r.cat === c.key && r.source !== 'question' && (r.status === 'fail' || r.status === 'warn' || r.status === 'na' || r.accepted || (r.status === 'info' && r.rows)));
      if (!list.length) continue;
      b.push(H(2, c.label));
      for (const r of list.sort((a, z) => ({ fail: 0, warn: 1, info: 2, na: 3 })[a.status] - ({ fail: 0, warn: 1, info: 2, na: 3 })[z.status])) {
        b.push(H(3, (r.source === 'securescore' ? '' : r.id + ' ') + r.title), { t: 'kv', rows: detailRows(m, r) });
        if (r.rows && r.rows.length && (m.names || !personal(r))) b.push(TABLE(r.head, r.rows.slice(0, 60).concat(r.rows.length > 60 ? [['… ' + (r.rows.length - 60 + (r.more || 0)) + ' weitere'].concat(r.head.slice(1).map(() => ''))] : [])));
      }
    }
    add('details', 'Feststellungen im Detail', b);
  }
  if (S.has('passed')) {
    const list = ev.results.filter((r) => r.status === 'pass' && r.source !== 'question');
    add('passed', 'Erfüllte Prüfpunkte', [TABLE(['Prüfpunkt', 'Bereich', 'Ergebnis'], list.map((r) => [r.title, catLabel(r.cat), r.summary || '']), [45, 20, 35])]);
  }
  if (S.has('questions')) {
    const ans = { pass: 'Ja', warn: 'Teilweise', fail: 'Nein', info: 'Nicht relevant', open: 'offen' };
    const qs = ev.results.filter((r) => r.source === 'question');
    add('questions', 'Organisatorische Bestandsaufnahme', [
      P('Die folgenden Fragen wurden gemeinsam mit ' + m.customer + ' beantwortet. Sie ergänzen die technische Prüfung um Organisation, Prozesse und Verantwortlichkeiten.'),
      TABLE(['Nr.', 'Frage', 'Antwort', 'Empfehlung bei Lücke'], qs.map((r) => [r.id, r.title + (m.notes[r.id] ? '\nKommentar: ' + m.notes[r.id] : ''), r.accepted ? 'Risiko akzeptiert' : ans[r.status], r.status === 'pass' || r.status === 'info' ? '' : r.fix]), [7, 45, 12, 36])
    ]);
  }
  if (S.has('norms')) {
    const rowsFor = (keys, field, label) => keys.map((k) => { const l = ev.results.filter((r) => (r[field] || []).includes(k)); const c = (s) => l.filter((r) => r.status === s).length; return l.length ? [label(k), l.length, c('pass'), c('warn'), c('fail'), sc(scoreOf(l))] : null; }).filter(Boolean);
    add('norms', 'Zuordnung ISO/IEC 27001 und NIS2', [
      P('Die Prüfpunkte sind den Maßnahmen aus ISO/IEC 27001:2022 Anhang A und den Risikomanagementmaßnahmen nach Art. 21 der NIS2-Richtlinie (in Deutschland umgesetzt in § 30 BSIG) zugeordnet. Die Zuordnung dient als Orientierung und Grundlage für Audits; sie ersetzt keine Zertifizierungsprüfung.', 'muted'),
      H(2, 'ISO/IEC 27001:2022 – Anhang A'),
      TABLE(['Maßnahme', 'Prüfpunkte', 'Erfüllt', 'Teilweise', 'Nicht erfüllt', 'Bewertung'], rowsFor(Object.keys(ISO), 'iso', (k) => k + ' ' + ISO[k]), [44, 12, 11, 11, 11, 11]),
      H(2, 'NIS2 – Art. 21 Risikomanagementmaßnahmen'),
      TABLE(['Anforderung', 'Prüfpunkte', 'Erfüllt', 'Teilweise', 'Nicht erfüllt', 'Bewertung'], rowsFor(Object.keys(NIS2), 'nis2', (k) => NIS2[k]), [44, 12, 11, 11, 11, 11])
    ]);
  }
  if (S.has('compare') && m.compare) {
    const old = new Map(m.compare.ev.results.map((r) => [r.id, r]));
    const ch = ev.results.map((r) => [old.get(r.id), r]).filter(([a, b]) => a && a.status !== b.status);
    add('compare', 'Veränderung seit ' + fmtD(m.compare.at), [
      P('Bewertung damals: ' + sc(m.compare.ev.score) + ' – heute: ' + sc(ev.score) + '.'),
      TABLE(['Prüfpunkt', 'Vorher', 'Jetzt'], ch.map(([a, b]) => [b.title, statusText(a), statusText(b)]), [60, 20, 20])
    ]);
  }
  if (S.has('method')) add('method', 'Prüfumfang, Methodik und Hinweise', [
    BUL([
      { sev: 'info', label: 'Vorgehen', text: 'Anmeldung mit einem Konto des Mandanten bzw. per GDAP; ausschließlich lesende Abfragen über Microsoft Graph (delegierte Berechtigungen). Es wurden keine Einstellungen verändert.' },
      { sev: 'info', label: 'Datenhaltung', text: 'Die Auswertung erfolgte lokal auf dem Rechner des Prüfers. Es wurden keine Daten an Dritte übertragen' + (m.snap.dns ? '; für die DNS-Prüfung wurden die öffentlichen Domainnamen per DNS-over-HTTPS bei Cloudflare abgefragt.' : '.') },
      { sev: 'info', label: 'Quellen', text: 'Entra ID (Richtlinien, Rollen, Benutzer, Anwendungen), SharePoint-Mandanteneinstellungen, Intune, Microsoft Defender, Microsoft Secure Score (Exchange Online, Defender for Office 365, Teams, Purview, Endpoint), öffentliches DNS sowie ein Fragebogen.' },
      { sev: 'info', label: 'Bewertung', text: 'Gewichtung nach Schweregrad: hoch × 10, mittel × 5, niedrig × 2; „teilweise“ = 50 %. Nicht prüfbare Punkte (fehlende Lizenz oder Berechtigung) und offene Fragen bleiben unberücksichtigt.' },
      { sev: 'info', label: 'Grenzen', text: 'Die Prüfung ist eine Momentaufnahme der Konfiguration. Sie ersetzt keinen Penetrationstest, kein ISMS-Audit und keine Rechtsberatung. Einzelne Exchange-Online-Einstellungen sind über Microsoft Graph nicht lesbar und werden über den Microsoft Secure Score bewertet.' }
    ]),
    ...(m.snap.warnings.length ? [H(3, 'Hinweise aus der Datenerfassung'), TABLE(['Quelle', 'Hinweis'], m.snap.warnings.map((w) => [w.source, w.message]), [35, 65])] : [])
  ]);
  return {
    title: 'Microsoft-365-Sicherheitsprüfung', customer: m.customer, kicker: m.partner || 'M365 Security Check',
    coverRows: [['Mandant', (m.tenant.domain || '') + (m.tenant.id ? ' · ' + m.tenant.id : '')], ['Prüfdatum', fmtDT(m.scannedAt)], ['Erstellt von', m.author || m.scannedBy || '—']].concat(m.contact ? [['Ansprechpartner', m.contact]] : []).concat([['Prüfpunkte', String(ev.counts.total)], ['Gesamtbewertung', sc(ev.score) + ' / 100 – ' + rating(ev.score).label]]),
    demo: m.demo ? 'Beispieldaten (Demo-Modus)' : '', tocTitle: 'Inhalt', empty: 'keine Einträge', madeWith: 'Erstellt mit M365 Security Check',
    confidential: 'Vertraulich – nur für ' + m.customer, sections
  };
}
const firstSentence = (s) => { s = String(s || '').split('\n')[0]; const i = s.search(/(?<!\b(?:z|B|bzw|ggf|max|mind|ca|d|h|u|a|inkl|evtl|bspw|Nr|vgl|o))\.\s+(?=[A-ZÄÖÜ„])/); return i > 0 && i < 260 ? s.slice(0, i + 1) : (s.length > 260 ? s.slice(0, 260) + ' …' : s); };
const personal = (r) => /^(PA-0[1-68]|GU-0[78]|ID-04|CA-04|DF-02)$/.test(r.id);

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------
const mdEsc = (s) => String(s === undefined || s === null ? '' : s).replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
function mdTable(head, rows, empty) {
  if (!rows.length) return '_' + empty + '_\n\n';
  return '| ' + head.map(mdEsc).join(' | ') + ' |\n|' + head.map(() => ' --- ').join('|') + '|\n' + rows.map((r) => '| ' + r.map(mdEsc).join(' | ') + ' |').join('\n') + '\n\n';
}
export function toMarkdown(m) {
  const d = buildDoc(m);
  let out = '# ' + d.title + ' – ' + d.customer + '\n\n';
  for (const [k, v] of d.coverRows) out += '- ' + k + ': ' + v + '\n';
  if (m.partner) out += '- Partner: ' + m.partner + '\n';
  out += '- ' + d.madeWith + '\n\n';
  if (d.demo) out += '> ' + d.demo + '\n\n';
  for (const s of d.sections) {
    out += '## ' + s.title + '\n\n';
    for (const b of s.blocks) {
      if (b.t === 'h2') out += '### ' + b.text + '\n\n';
      else if (b.t === 'h3') out += '#### ' + b.text + '\n\n';
      else if (b.t === 'p') out += (b.tone === 'muted' ? '_' + b.text + '_' : b.text) + '\n\n';
      else if (b.t === 'score') out += '**Gesamtbewertung: ' + sc(b.score) + ' / 100 – ' + b.label + '** (' + b.sub.map((x) => x[0] + ': ' + x[1]).join(' · ') + ')\n\n';
      else if (b.t === 'table') out += mdTable(b.head, b.rows, d.empty);
      else if (b.t === 'kv') out += mdTable(['', ''], b.rows, d.empty);
      else if (b.t === 'bullets') out += (b.items.map((i) => '- **' + i.label + ':** ' + i.text).join('\n') || '_' + d.empty + '_') + '\n\n';
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTML (auch Grundlage für PDF)
// ---------------------------------------------------------------------------
const h = (s) => String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hCell = (c) => h(c).replace(/\n/g, '<br>');
const TONE = { ok: '#4E7D10', info: '#00787A', warn: '#9A5B00', bad: '#B3261E', neutral: '#4A5E5D' };
function hTable(head, rows, cls, empty, widths) {
  if (!rows.length) return '<p class="empty">' + h(empty) + '</p>';
  return '<table class="' + (cls || '') + '">' + (widths ? '<colgroup>' + widths.map((w) => '<col style="width:' + w + '%">').join('') + '</colgroup>' : '') + '<thead><tr>' + head.map((x) => '<th>' + h(x) + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map((r) => '<tr>' + r.map((c, i) => '<td' + (head[i] === 'Ergebnis' || head[i] === 'Antwort' || head[i] === 'Jetzt' || head[i] === 'Vorher' ? ' class="st st-' + h(String(c).split(' ')[0].toLowerCase()) + '"' : '') + '>' + hCell(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
}
function scoreSvg(score, tone) {
  const r = 42, c = 2 * Math.PI * r, v = score || 0;
  return '<svg viewBox="0 0 100 100" width="120" height="120"><circle cx="50" cy="50" r="42" fill="none" stroke="#E3EBEA" stroke-width="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="' + TONE[tone] + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + (c * v / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 50 50)"/><text x="50" y="57" text-anchor="middle" font-size="26" font-weight="700" fill="' + TONE[tone] + '">' + sc(score) + '</text></svg>';
}
export function toHtml(m) {
  const d = buildDoc(m);
  let body = '';
  for (const s of d.sections) {
    body += '<h1 id="' + s.id + '">' + h(s.title) + '</h1>';
    for (const b of s.blocks) {
      if (b.t === 'h2') body += '<h2>' + h(b.text) + '</h2>';
      else if (b.t === 'h3') body += '<h3>' + h(b.text) + '</h3>';
      else if (b.t === 'p') body += '<p class="' + (b.tone || '') + '">' + h(b.text) + '</p>';
      else if (b.t === 'score') body += '<div class="score">' + scoreSvg(b.score, b.tone) + '<div><div class="rl" style="color:' + TONE[b.tone] + '">' + h(b.label) + '</div><div class="subs">' + b.sub.map((x) => '<span><small>' + h(x[0]) + '</small><b>' + h(x[1]) + '</b></span>').join('') + '</div></div></div>';
      else if (b.t === 'table') body += hTable(b.head, b.rows, b.cls, d.empty, b.widths);
      else if (b.t === 'kv') body += hTable(['', ''], b.rows, 'kv', d.empty);
      else if (b.t === 'bullets') body += '<ul class="findings">' + b.items.map((i) => '<li class="sev-' + i.sev + '"><b>' + h(i.label) + ':</b> ' + h(i.text) + '</li>').join('') + '</ul>';
    }
  }
  const cover = '<div class="cover"><div class="brandbar"></div><p class="kicker">' + h(d.kicker) + '</p><h1 class="title">' + h(d.title) + '</h1><p class="customer">' + h(d.customer) + '</p>' +
    '<table class="kv cover-kv"><tbody>' + d.coverRows.map((r) => '<tr><td>' + h(r[0]) + '</td><td>' + h(r[1]) + '</td></tr>').join('') + '</tbody></table>' +
    (d.demo ? '<p class="demo">' + h(d.demo) + '</p>' : '') + '<p class="conf">' + h(d.confidential) + '</p>' +
    '<h2>' + h(d.tocTitle) + '</h2><ol class="toc">' + d.sections.map((s) => '<li><a href="#' + s.id + '">' + h(s.title) + '</a></li>').join('') + '</ol></div>';
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>' + h(d.title + ' – ' + d.customer) + '</title><style>' + REPORT_CSS + '</style></head><body>' + cover + body + '<p class="made">' + h(d.madeWith) + '</p></body></html>';
}

const REPORT_CSS = `
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: "Segoe UI", Calibri, Arial, sans-serif; font-size: 10pt; color: #13201F; line-height: 1.45; margin: 0; padding: 24px; max-width: 1000px; }
@media print { body { padding: 0; max-width: none; } }
h1 { font-size: 18pt; color: #${BRAND}; border-bottom: 2px solid #${BRAND}; padding-bottom: 4px; margin: 28px 0 12px; page-break-before: always; }
h2 { font-size: 13pt; color: #${BRAND}; margin: 20px 0 8px; page-break-after: avoid; }
h3 { font-size: 11pt; margin: 16px 0 6px; page-break-after: avoid; }
table { width: 100%; border-collapse: collapse; margin: 4px 0 10px; font-size: 9pt; page-break-inside: auto; }
th { background: #${BRAND}; color: #fff; text-align: left; padding: 5px 7px; font-weight: 600; }
td { border-bottom: 1px solid #D5E0DF; padding: 4px 7px; vertical-align: top; word-break: break-word; }
tr { page-break-inside: avoid; }
table.kv td:first-child { width: 22%; color: #4A5E5D; font-weight: 600; }
table.kv thead { display: none; }
td.st-erfüllt, td.st-ja { color: #4E7D10; font-weight: 600; } td.st-teilweise { color: #9A5B00; font-weight: 600; } td.st-nicht, td.st-nein { color: #B3261E; font-weight: 600; }
.empty { color: #6B7F7E; font-style: italic; }
p { margin: 0 0 8px; }
p.muted { color: #4A5E5D; font-style: italic; }
.findings li { margin: 4px 0; }
.sev-high b { color: #B3261E; } .sev-medium b { color: #9A5B00; } .sev-low b { color: #4E7D10; }
.score { display: flex; gap: 24px; align-items: center; padding: 14px 18px; background: #F4F7F6; border-radius: 10px; margin: 8px 0 14px; page-break-inside: avoid; }
.score .rl { font-size: 16pt; font-weight: 700; margin-bottom: 8px; }
.score .subs { display: flex; gap: 22px; flex-wrap: wrap; }
.score .subs span { display: flex; flex-direction: column; } .score small { color: #4A5E5D; font-size: 8.5pt; } .score b { font-size: 13pt; }
.cover { min-height: 90vh; }
.cover .brandbar { height: 10px; width: 120px; background: #${BRAND}; margin: 40px 0 28px; }
.cover .kicker { text-transform: uppercase; letter-spacing: .12em; color: #${BRAND}; font-weight: 600; font-size: 9pt; margin: 0; }
.cover .title { border: none; page-break-before: avoid; font-size: 28pt; margin: 6px 0 0; color: #13201F; }
.cover .customer { font-size: 18pt; color: #${BRAND}; margin: 4px 0 28px; }
.cover-kv { width: 75%; }
.conf { color: #9A5B00; font-size: 9pt; text-transform: uppercase; letter-spacing: .08em; }
.toc a { color: #13201F; text-decoration: none; }
.demo { color: #9A5B00; font-weight: 600; }
.made { margin-top: 30px; color: #6B7F7E; font-size: 8.5pt; }
`;

// ---------------------------------------------------------------------------
// CSV (Semikolon, UTF-8 mit BOM – öffnet direkt im deutschen Excel)
// ---------------------------------------------------------------------------
function csv(rows) {
  const cell = (v) => { const s = String(v === undefined || v === null ? '' : v); return (s.includes(';') || /["\n\r]/.test(s)) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  return '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n');
}
export function toCsv(m) {
  const rows = [['ID', 'Bereich', 'Prüfpunkt', 'Schweregrad', 'Ergebnis', 'Details', 'Priorität', 'Aufwand', 'Lizenz', 'Lizenz vorhanden', 'Empfehlung', 'ISO 27001', 'NIS2', 'Quelle', 'Kommentar']];
  for (const r of m.ev.results) rows.push([r.id, catLabel(r.cat), r.title, SEVERITY[r.sev], statusText(r), r.summary || '', r.prio ? PRIO[r.prio] : '', EFFORT[r.effort] || '', r.lic ? licShort(r.lic) : '', r.lic ? (r.licMissing ? 'Nein' : 'Ja') : '', r.fix || '', (r.iso || []).join(', '), (r.nis2 || []).map(nis2Short).join(', '), SRC[r.source] || r.source, m.notes[r.id] || '']);
  return csv(rows);
}
export function toCsvPlan(m) {
  const rows = [['Nr.', 'Priorität', 'Maßnahme', 'Bereich', 'Schweregrad', 'Aufwand', 'Lizenz', 'Empfehlung', 'Verantwortlich', 'Termin', 'Erledigt']];
  for (const p of [1, 2, 3]) m.ev.plan.filter((r) => r.prio === p).forEach((r, i) => rows.push([p + '.' + (i + 1), PRIO[p], r.title, catLabel(r.cat), SEVERITY[r.sev], EFFORT[r.effort] || '', r.lic ? licShort(r.lic) + (r.licMissing ? ' (fehlt)' : '') : '', r.fix || '', '', '', '']));
  return csv(rows);
}

// ---------------------------------------------------------------------------
// Word
// ---------------------------------------------------------------------------
export function toDocx(m) {
  const d = buildDoc(m);
  const D = docx;
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType, Footer, Header, PageNumber, TableOfContents, PageBreak, BorderStyle } = D;
  const para = (text, run) => new Paragraph({ spacing: { after: 100 }, children: [new TextRun(Object.assign({ text: String(text === undefined || text === null ? '' : text) }, run || {}))] });
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const cellBorder = { top: none, left: none, right: none, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D5E0DF' } };
  const statusColor = (t) => /^Erfüllt|^Ja$/.test(t) ? '4E7D10' : /^Teilweise/.test(t) ? '9A5B00' : /^Nicht erfüllt|^Nein$/.test(t) ? 'B3261E' : undefined;
  const textCell = (t, opts) => new TableCell({
    borders: cellBorder,
    shading: opts && opts.head ? { fill: BRAND, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    width: opts && opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: String(t === undefined || t === null ? '' : t).split(/\r?\n/).map((line) => new Paragraph({ children: [new TextRun({ text: line, bold: !!(opts && (opts.head || opts.bold)), color: opts && opts.head ? 'FFFFFF' : (opts && opts.color) || (opts && opts.muted ? '4A5E5D' : undefined), size: 17 })] }))
  });
  const table = (head, rows, widths) => {
    if (!rows.length) return [para(d.empty, { italics: true, color: '6B7F7E', size: 18 })];
    const stCol = head.findIndex((x) => ['Ergebnis', 'Antwort', 'Vorher', 'Jetzt'].includes(x));
    return [new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ tableHeader: true, children: head.map((x, i) => textCell(x, { head: true, width: widths && widths[i] })) })]
        .concat(rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => textCell(c, { width: widths && widths[i], color: i === stCol ? statusColor(String(c)) : undefined, bold: i === stCol })) })))
    }), para('')];
  };
  const kv = (rows) => [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([k, v]) => new TableRow({ cantSplit: true, children: [textCell(k, { bold: true, muted: true, width: 22 }), textCell(v, { width: 78, color: k === 'Ergebnis' ? statusColor(String(v)) : undefined })] }))
  }), para('')];
  const heading = (text, level) => new Paragraph({ text: String(text), heading: level });
  const TC = { ok: '4E7D10', info: '00787A', warn: '9A5B00', bad: 'B3261E', neutral: '4A5E5D' };

  const children = [];
  children.push(new Paragraph({ spacing: { before: 2200 }, children: [new TextRun({ text: d.kicker.toUpperCase(), bold: true, color: BRAND, size: 20 })] }));
  children.push(new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: d.title, bold: true, size: 56 })] }));
  children.push(new Paragraph({ spacing: { after: 500 }, children: [new TextRun({ text: d.customer, color: BRAND, size: 40 })] }));
  children.push(...kv(d.coverRows));
  if (d.demo) children.push(para(d.demo, { bold: true, color: '9A5B00' }));
  children.push(para(d.confidential.toUpperCase(), { color: '9A5B00', size: 16 }));
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new TableOfContents(d.tocTitle, { hyperlink: true, headingStyleRange: '1-2' }));
  children.push(para('Hinweis: Beim Öffnen in Word ggf. „Felder aktualisieren“ bestätigen, damit das Inhaltsverzeichnis erscheint.', { italics: true, color: '6B7F7E', size: 16 }));

  for (const s of d.sections) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(heading(s.title, HeadingLevel.HEADING_1));
    for (const b of s.blocks) {
      if (b.t === 'h2') children.push(heading(b.text, HeadingLevel.HEADING_2));
      else if (b.t === 'h3') children.push(heading(b.text, HeadingLevel.HEADING_3));
      else if (b.t === 'p') children.push(para(b.text, b.tone === 'muted' ? { italics: true, color: '4A5E5D' } : {}));
      else if (b.t === 'score') {
        children.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [new TextRun({ text: sc(b.score), bold: true, size: 72, color: TC[b.tone] }), new TextRun({ text: ' / 100   ', size: 28, color: '4A5E5D' }), new TextRun({ text: b.label, bold: true, size: 32, color: TC[b.tone] })] }));
        children.push(new Paragraph({ spacing: { after: 200 }, children: b.sub.map((x, i) => new TextRun({ text: (i ? '     ' : '') + x[0] + ': ' + x[1], size: 19, color: '4A5E5D' })) }));
      } else if (b.t === 'table') children.push(...table(b.head, b.rows, b.widths));
      else if (b.t === 'kv') children.push(...kv(b.rows));
      else if (b.t === 'bullets') for (const i of b.items) children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: i.label + ': ', bold: true, color: i.sev === 'high' ? 'B3261E' : i.sev === 'medium' ? '9A5B00' : undefined }), new TextRun({ text: i.text })] }));
    }
  }
  children.push(para(''), para(d.madeWith, { italics: true, color: '6B7F7E', size: 16 }));

  const doc = new Document({
    creator: m.author || 'M365 Security Check',
    title: d.title + ' – ' + d.customer,
    description: d.madeWith,
    features: { updateFields: true },
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20, noProof: true, language: { value: 'de-DE' } } },
        heading1: { run: { font: 'Calibri', size: 34, bold: true, color: BRAND }, paragraph: { keepNext: true, keepLines: true, spacing: { before: 240, after: 160 } } },
        heading2: { run: { font: 'Calibri', size: 27, bold: true, color: BRAND }, paragraph: { keepNext: true, keepLines: true, spacing: { before: 240, after: 120 } } },
        heading3: { run: { font: 'Calibri', size: 22, bold: true, color: '13201F' }, paragraph: { keepNext: true, keepLines: true, spacing: { before: 200, after: 80 } } }
      }
    },
    sections: [{
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: d.title + ' – ' + d.customer + ' · vertraulich', color: '6B7F7E', size: 16 })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [(m.partner ? m.partner + ' · ' : '') + 'Seite ', PageNumber.CURRENT, ' von ', PageNumber.TOTAL_PAGES], color: '6B7F7E', size: 16 })] })] }) },
      children
    }]
  });
  return Packer.toBlob(doc);
}

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------
export function download(name, data, mime) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
}
export function printHtml(html) {
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(f);
  f.srcdoc = html;
  f.onload = () => { setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 60000); }, 300); };
}
export function fileStem(m) {
  const d = new Date(m.scannedAt || Date.now());
  const ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  return 'M365-Sicherheitspruefung_' + String(m.customer).replace(/[^A-Za-z0-9ÄÖÜäöüß_-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '_' + ds;
}
