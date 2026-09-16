# empiriausluge.hr

Static bilingual (EN/HR) one-page site for **Empiria Usluge d.o.o.**

No build step, no dependencies. Plain HTML + CSS + one small script.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, services, contact, legal footer |
| `privacy.html` | Privacy Policy — **required** for the Meta / WhatsApp Business API app |
| `terms.html` | Terms of Service |
| `style.css` | All styling |
| `lang.js` | EN/HR toggle (URL `?lang=hr`, then `localStorage`, then browser language) |
| `assets/logo-*.svg` | Three eta logo variants; `logo.svg` is the active one |
| `assets/og.png` | 1200×630 social preview |
| `assets/icon-180.png` | Apple touch icon / Meta profile picture source |
| `favicon.svg` | Favicon |
| `_headers` | Security headers (Cloudflare Pages reads this automatically) |

## Local preview

```
python3 -m http.server 4321
```

Then open <http://localhost:4321>.

## Deploy — Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick this repo.
3. Build settings: **Framework preset:** None · **Build command:** *(leave empty)* · **Build output directory:** `/`
4. Deploy. You get a `*.pages.dev` URL immediately.

## Deploy — DNS for empiriausluge.hr

1. Add `empiriausluge.hr` as a site in Cloudflare (Free plan).
2. Cloudflare gives you two nameservers. Set them in your `.hr` registrar's panel, replacing the current ones.
3. Once the zone is active: Pages project → **Custom domains** → add `empiriausluge.hr` **and** `www.empiriausluge.hr`. Cloudflare creates the records and the certificate itself.

## Email on the domain — do this before the site goes public

The site publishes `info@empiriausluge.hr`, so routing has to exist or mail to it bounces.

1. Cloudflare → your domain → **Email** → **Email Routing** → **Get started**.
2. Cloudflare adds the required MX and TXT (SPF) records to the zone for you.
3. Create a custom address: `info@empiriausluge.hr` → forward to the Gmail address.
4. Confirm the forwarding destination from the verification mail Google receives.
5. To *send* as `info@`, add it in Gmail under **Settings → Accounts → Send mail as**.

## Meta checklist

Order matters — do these top to bottom.

- [ ] Email Routing live, `info@empiriausluge.hr` receives mail
- [ ] Site live at `https://empiriausluge.hr` with company name, address, OIB and MBS in the footer
- [ ] Business Manager → **Brand safety → Domains** → add domain → copy the meta tag into the
      commented slot in `index.html` `<head>`, redeploy, verify
- [ ] App settings → **Privacy Policy URL:** `https://empiriausluge.hr/privacy`
- [ ] App settings → **Terms of Service URL:** `https://empiriausluge.hr/terms`
- [ ] Business verification: try **email confirmation to `info@empiriausluge.hr`** first — a
      domain-matched address often avoids the phone step entirely
- [ ] Only if Meta explicitly asks for a phone: add one and leave it up until the WABA is live
