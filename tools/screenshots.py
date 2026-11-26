"""Erzeugt Screenshots (docs/screenshots) und Beispielberichte (docs/beispiel) aus dem Demo-Modus.

Voraussetzung: laufende App (z. B. `go run . -no-browser -data /tmp/msc`), Python mit Playwright und Chrome/Chromium.
Aufruf: python3 tools/screenshots.py [URL]   (Standard: http://localhost:8410)
"""
import asyncio, os, shutil, sys
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8410'
ROOT = os.path.join(os.path.dirname(__file__), '..', 'docs')
CHROME = shutil.which('google-chrome') or shutil.which('chromium') or None
SHOTS = [
    ('01-einrichtung', '', 'dark', None), ('02-anmeldung', '', 'dark', 'login'),
    ('03-uebersicht', '?demo', 'dark', None), ('04-befunde', '?demo&view=findings', 'dark', None),
    ('05-massnahmenplan', '?demo&view=plan', 'dark', None), ('06-fragebogen', '?demo&view=questions', 'dark', None),
    ('07-normen', '?demo&view=norms', 'dark', None), ('08-verlauf', '?demo&view=history', 'dark', 'compare'),
    ('09-pruefbericht', '?demo&view=export', 'dark', None), ('10-helles-design', '?demo', 'light', None)
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME) if CHROME else await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
        await pg.goto(BASE + '/')
        for name, q, theme, extra in SHOTS:
            await pg.evaluate("t => localStorage.setItem('msc.theme', t)", theme)
            await pg.goto(BASE + '/' + q); await pg.wait_for_timeout(600)
            if extra == 'login':
                await pg.evaluate("() => { document.querySelector('#cfgClient').value = '11111111-2222-3333-4444-555555555555'; }")
                await pg.click('[data-act=saveSetup]'); await pg.wait_for_timeout(400)
            if extra == 'compare':
                await pg.click('[data-act=compare]'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=os.path.join(ROOT, 'screenshots', name + '.png'), full_page=name in ('03-uebersicht', '10-helles-design'))
        # Beispielberichte
        await pg.evaluate("() => localStorage.setItem('msc.theme', 'dark')")
        await pg.goto(BASE + '/?demo&view=history'); await pg.wait_for_timeout(500)
        await pg.click('[data-act=compare]'); await pg.wait_for_timeout(300)
        await pg.click('[data-view=export]'); await pg.wait_for_timeout(300)
        await pg.fill('#exPartner', 'Muster IT-Partner GmbH'); await pg.fill('#exAuthor', 'Max Mustermann')
        await pg.fill('#exContact', 'Max Mustermann · +49 89 1234567 · security@muster-it-partner.example')
        for fmt, name in [('docx', 'Beispiel-Pruefbericht.docx'), ('html', 'Beispiel-Pruefbericht.html'), ('md', 'Beispiel-Pruefbericht.md'), ('csv', 'Beispiel-Befunde.csv')]:
            await pg.click(f'[data-fmt={fmt}]'); await pg.wait_for_timeout(200)
            async with pg.expect_download() as d:
                await pg.click('[data-act=doExport]')
            await (await d.value).save_as(os.path.join(ROOT, 'beispiel', name))
        rep = await b.new_page()
        await rep.goto('file://' + os.path.abspath(os.path.join(ROOT, 'beispiel', 'Beispiel-Pruefbericht.html')))
        await rep.pdf(path=os.path.join(ROOT, 'beispiel', 'Beispiel-Pruefbericht.pdf'), format='A4', print_background=True, margin={'top': '18mm', 'bottom': '18mm', 'left': '16mm', 'right': '16mm'})
        await b.close()
    print('Screenshots und Beispielberichte erzeugt.')

asyncio.run(main())
