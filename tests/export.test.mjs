// Berichtsexporte (Markdown, HTML, CSV) auf Plausibilität prüfen.
import assert from 'node:assert/strict';
import { evaluate } from '../web/js/checks.js';
import { demoSnapshot, demoNotes } from '../web/js/demo.js';
import * as X from '../web/js/export.js';

const snap = demoSnapshot();
const ev = evaluate(snap, demoNotes());
const m = X.buildModel(snap, ev, { partner: 'Partner GmbH', author: 'Test', notes: demoNotes() });
const md = X.toMarkdown(m);
assert.match(md, /# Microsoft-365-Sicherheitsprüfung – Muster Maschinenbau GmbH/);
assert.match(md, /Gesamtbewertung: \d+ \/ 100/);
assert.match(md, /Ticket #4711/, 'Kommentare erscheinen im Bericht');
const html = X.toHtml(m);
assert.ok(html.startsWith('<!doctype html>'));
assert.ok(!/<script/i.test(html), 'Bericht ohne Skripte');
const csv = X.toCsv(m);
assert.equal(csv.charCodeAt(0), 0xFEFF);
assert.equal(csv.trim().split('\r\n').length, ev.results.length + 1);
const noNames = X.toMarkdown(X.buildModel(snap, ev, { names: false }));
assert.ok(!noNames.includes('thomas.admin@'), 'Namen lassen sich ausblenden');
assert.ok(X.toCsvPlan(m).split('\r\n').length === ev.plan.length + 1);
console.log('export: OK');
