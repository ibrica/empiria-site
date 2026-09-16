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

## Live infrastructure

Everything below is provisioned and serving as of 16 September 2026.

| Piece | Value |
| --- | --- |
| Registrar | CARNET (`.hr`), delegation set to Cloudflare |
| Nameservers | `kimora.ns.cloudflare.com`, `valentin.ns.cloudflare.com` |
| Cloudflare zone | `empiriausluge.hr`, Free plan, active |
| Hosting | Cloudflare Pages project `empiria-site`, connected to `ibrica/empiria-site` |
| Build | Framework preset None · no build command · output `/` |
| Domains | `empiriausluge.hr` (apex, flattened CNAME) and `www` |
| `www` | 301 redirect to apex via a Redirect Rule, query string preserved |
| TLS | Let's Encrypt, auto-renewed by Cloudflare |
| Inbound mail | Email Routing: `info@empiriausluge.hr` → `empiria.hr@gmail.com` |
| Mail DNS | 3× MX to `route{1,2,3}.mx.cloudflare.net`, SPF and DKIM TXT |

Any push to `main` redeploys the site automatically.

Note: Pages serves extensionless paths. `/privacy.html` 308-redirects to `/privacy`,
so link and advertise the extensionless form.

## Outbound mail — Brevo SMTP relay

Email Routing only *receives*. Sending as `info@empiriausluge.hr` goes through Brevo
as an SMTP relay, with Gmail's "Send mail as" on top.

The domain is authenticated in Brevo. These records are in the zone:

| Type | Name | Content |
| --- | --- | --- |
| TXT | `@` | `brevo-code:fbf76cbbc6b87a86e44a01beabe8f8ba` |
| CNAME | `brevo1._domainkey` | `b1.empiriausluge-hr.dkim.brevo.com` (DNS only) |
| CNAME | `brevo2._domainkey` | `b2.empiriausluge-hr.dkim.brevo.com` (DNS only) |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

The DKIM records must stay **DNS only** — proxying a CNAME breaks DKIM lookup.

Brevo authenticates by DKIM, so it needs no SPF include. The SPF TXT is locked by
Email Routing and should be left alone; removing Cloudflare's include would break
inbound forwarding.

Brevo SMTP endpoint: `smtp-relay.brevo.com`, port `587`, login `b9a902001@smtp-brevo.com`,
password is an SMTP key generated in Brevo under **SMTP & API**.

In Gmail, set **Settings → Accounts and Import → When replying to a message →
"Reply from the same address the message was sent to"**, so replies to `info@` go out
as `info@`.

## Rebuilding from scratch

### Cloudflare Pages



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
