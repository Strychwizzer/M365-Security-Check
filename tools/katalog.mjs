// Erzeugt docs/pruefkatalog.md aus dem Prüfkatalog im Code.  Aufruf: node tools/katalog.mjs
import { writeFileSync } from 'node:fs';
import { CHECKS } from '../web/js/checks.js';
import { CATEGORIES, QUESTIONS, ISO, NIS2, nis2Short, SEVERITY, licHint } from '../web/js/catalog.js';
const esc = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
let out = '# Prüfkatalog\n\n> Automatisch erzeugt aus `web/js/checks.js` und `web/js/catalog.js` (`node tools/katalog.mjs`).\n\n';
out += 'M365 Security Check bewertet **' + CHECKS.length + ' eigene technische Prüfungen**, **' + QUESTIONS.length + ' Fragen** des Fragebogens und zusätzlich alle **Kontrollen des Microsoft Secure Score** für Exchange Online, Defender for Office 365, Teams, SharePoint, Purview, Defender for Endpoint, Defender for Identity und Defender for Cloud Apps (je nach Lizenz typischerweise 50–100). Entra-Kontrollen des Secure Score werden ausgeblendet, weil die eigenen Prüfungen sie genauer abdecken.\n\n';
out += '## Bewertung\n\n| Ergebnis | Anteil |\n| --- | --- |\n| Erfüllt | 100 % |\n| Teilweise | 50 % |\n| Nicht erfüllt | 0 % |\n| Information, nicht prüfbar, offen, Risiko akzeptiert | zählt nicht |\n\nGewichtung nach Schweregrad: Hoch × 10, Mittel × 5, Niedrig × 2. Priorität im Maßnahmenplan: **Sofort** = nicht erfüllt & hoch · **Kurzfristig** = nicht erfüllt & mittel oder teilweise & hoch · **Mittelfristig** = übrige Lücken.\n\n';
for (const c of CATEGORIES) {
  const l = CHECKS.filter((x) => x.cat === c.key);
  const q = QUESTIONS.filter((x) => x.cat === c.key);
  if (!l.length && !q.length) continue;
  out += '## ' + c.label + '\n\n';
  if (l.length) {
    out += '| ID | Prüfung | Schwere | Lizenz | ISO 27001 | NIS2 |\n| --- | --- | --- | --- | --- | --- |\n';
    for (const x of l) out += '| ' + x.id + ' | **' + esc(x.title) + '**<br>' + esc(x.why) + ' | ' + SEVERITY[x.sev] + ' | ' + (x.lic ? esc(licHint(x.lic).split(' – ')[0]) : '–') + ' | ' + (x.iso || []).join(', ') + ' | ' + (x.nis2 || []).map(nis2Short).join(', ') + ' |\n';
    out += '\n';
  }
  if (q.length) {
    out += '| Frage | Schwere | ISO 27001 | NIS2 |\n| --- | --- | --- | --- |\n';
    for (const x of q) out += '| **' + x.id + '** ' + esc(x.title) + ' | ' + SEVERITY[x.sev] + ' | ' + x.iso.join(', ') + ' | ' + x.nis2.map(nis2Short).join(', ') + ' |\n';
    out += '\n';
  }
}
out += '## Normbezüge\n\n### ISO/IEC 27001:2022 Anhang A\n\n' + Object.entries(ISO).map(([k, v]) => '- **' + k + '** ' + v).join('\n') + '\n\n### NIS2 (Richtlinie (EU) 2022/2555, in Deutschland § 30 BSIG)\n\n' + Object.values(NIS2).map((v) => '- ' + v).join('\n') + '\n\nDie Zuordnung dient der Orientierung und ersetzt keine Auditprüfung.\n';
writeFileSync(new URL('../docs/pruefkatalog.md', import.meta.url), out);
console.log('docs/pruefkatalog.md geschrieben');
