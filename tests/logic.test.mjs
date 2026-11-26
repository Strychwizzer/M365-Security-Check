// Logiktests der Bewertung mit den Demo-Daten und gezielten Varianten.
import assert from 'node:assert/strict';
import { evaluate, scoreOf, rating, CHECKS } from '../web/js/checks.js';
import { demoSnapshot, demoNotes, demoOlderSnapshot } from '../web/js/demo.js';
import { QUESTIONS, ISO, NIS2, CATEGORIES } from '../web/js/catalog.js';

const clone = (x) => JSON.parse(JSON.stringify(x));
const base = demoSnapshot();
const get = (ev, id) => ev.results.find((r) => r.id === id);

// Katalog konsistent
const ids = new Set();
for (const c of CHECKS.concat(QUESTIONS)) {
  assert.ok(!ids.has(c.id), 'doppelte ID ' + c.id); ids.add(c.id);
  assert.ok(CATEGORIES.some((k) => k.key === c.cat), 'Kategorie ' + c.cat);
  for (const k of c.iso || []) assert.ok(ISO[k], 'ISO-Referenz fehlt: ' + k + ' in ' + c.id);
  for (const k of c.nis2 || []) assert.ok(NIS2[k], 'NIS2-Referenz fehlt: ' + k + ' in ' + c.id);
}

// Demo
const ev = evaluate(base, demoNotes());
assert.equal(ev.counts.total, CHECKS.length + QUESTIONS.length + ev.counts.securescore);
assert.ok(ev.counts.securescore > 20, 'Secure-Score-Kontrollen übernommen');
assert.ok(!ev.results.some((r) => r.id === 'SS-MFARegistrationV2'), 'Entra-Kontrollen aus Secure Score werden ausgeblendet');
assert.equal(get(ev, 'SS-teams_unmanagedcommunication').status, 'info', 'in Secure Score ignorierte Kontrolle');
assert.equal(get(ev, 'ID-02').status, 'pass');
assert.equal(get(ev, 'AP-01').status, 'fail');
assert.equal(get(ev, 'PA-01').status, 'warn');
assert.equal(get(ev, 'ML-02').status, 'fail');
assert.equal(get(ev, 'CA-04').status, 'pass');
assert.equal(get(ev, 'CA-05').status, 'fail', 'Berichtsmodus zählt nicht');
assert.equal(get(ev, 'CP-02').status, 'fail');
assert.equal(get(ev, 'BK-01').status, 'fail', 'Fragebogen „Nein“ + kein M365 Backup');
assert.ok(ev.plan.every((r, i, a) => !i || a[i - 1].prio <= r.prio), 'Plan sortiert');
assert.ok(ev.score >= 30 && ev.score <= 60, 'Demo-Score plausibel: ' + ev.score);

// Sicherheitsstandards an, keine CA
const sd = clone(base); sd.data.secDefaults.isEnabled = true; sd.data.ca = [];
const e2 = evaluate(sd, {});
assert.equal(get(e2, 'ID-01').status, 'pass');
assert.equal(get(e2, 'ID-02').status, 'warn');
assert.equal(get(e2, 'ID-03').status, 'pass');
assert.equal(get(e2, 'CA-04').status, 'info');

// Weder SD noch CA
const none = clone(base); none.data.ca = []; 
assert.equal(get(evaluate(none, {}), 'ID-01').status, 'fail');

// MFA-Richtlinie mit "MFA ODER konformes Gerät" ist kein strikter MFA-Zwang
const or = clone(base); or.data.ca[0].grantControls.builtInControls = ['mfa', 'compliantDevice'];
assert.notEqual(get(evaluate(or, {}), 'ID-02').status, 'pass');

// Risikoakzeptanz
const acc = evaluate(base, { accepted: { 'AP-01': 'Fachentscheidung' } });
assert.equal(get(acc, 'AP-01').status, 'info');
assert.ok(acc.score > ev.score - 5);

// Fragebogen beeinflusst Bewertung
const allYes = Object.fromEntries(QUESTIONS.map((q) => [q.id, 'yes']));
const allNo = Object.fromEntries(QUESTIONS.map((q) => [q.id, 'no']));
assert.equal(evaluate(base, { answers: allYes }).scoreOrg, 100);
assert.equal(evaluate(base, { answers: allNo }).scoreOrg, 0);
assert.equal(evaluate(base, {}).scoreOrg, null);

// DNS deaktiviert
const nd = clone(base); nd.dns = null;
assert.equal(get(evaluate(nd, {}), 'ML-01').status, 'na');

// Bewertung
assert.equal(scoreOf([{ sev: 'high', status: 'pass' }, { sev: 'high', status: 'fail' }]), 50);
assert.equal(scoreOf([{ sev: 'high', status: 'warn' }, { sev: 'low', status: 'na' }]), 50);
assert.equal(rating(85).tone, 'ok'); assert.equal(rating(10).tone, 'bad');

// Verlauf
const old = evaluate(demoOlderSnapshot(), demoNotes());
assert.ok(old.score < ev.score, 'älterer Stand schlechter');

console.log('logic: OK –', ev.counts.total, 'Prüfpunkte, Demo-Score', ev.score);
