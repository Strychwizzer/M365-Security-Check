// Pop-up-Anmeldung: Das aufrufende Fenster liest die Antwort selbst aus – nichts tun.
// Anmeldung per Weiterleitung (kein Pop-up): Antwort an die App weiterreichen, die sie mit MSAL verarbeitet.
if (!window.opener) location.replace('/' + location.search + location.hash);
