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

## Outbound mail — Resend SMTP relay

Email Routing only *receives*. Sending as `info@empiriausluge.hr` goes through Resend
as an SMTP relay, with Gmail's "Send mail as" on top.

The domain is verified in Resend, region **Ireland (eu-west-1)**. Records in the zone:

| Type | Name | Content |
| --- | --- | --- |
| TXT | `resend._domainkey` | DKIM public key |
| CNAME | `rsend` | `rsend-euw1.forge.rmta.net` (DNS only) |
| CNAME | `send` | `send.forge.rmta.net` (DNS only) — custom Return-Path |

Gmail SMTP settings: `smtp.resend.com`, port `587`, username `resend`, password is a
Resend API key.

### Three things not to get wrong

1. **Do not add Resend's "Enable Receiving" MX record.** Resend offers
   `MX @ -> inbound-smtp.eu-west-1.amazonaws.com` at priority 2. The Cloudflare Email
   Routing MX records are priority 3/53/75, so that record would win and silently break
   inbound mail to `info@`. Receiving is Cloudflare's job; Resend is send-only here.
2. **Leave tracking metrics unconfigured** in Resend. Configuring a tracking subdomain
   turns on the open pixel and link rewriting, which is why we left Brevo: its injected
   beacon got mail tagged `[*Newsletter*]` by recipient gateways, and tracking opens of
   named individuals is undisclosed personal data processing.
3. **The DKIM/return-path CNAMEs must stay DNS-only.** Proxying them breaks DKIM.

No SPF change is needed — Resend aligns on the `send` return-path subdomain, so the
apex SPF stays exactly as Email Routing wrote it. That record is locked by Email
Routing; removing Cloudflare's include would break inbound forwarding.

DMARC is `v=DMARC1; p=none;` — policy published, no aggregate reports. Tighten to
`p=quarantine` only after a period of confirmed SPF/DKIM alignment.

In Gmail, set **Settings -> Accounts and Import -> When replying to a message ->
"Reply from the same address the message was sent to"**, so replies to `info@` go out
as `info@`.

Verified end to end on 16 September 2026: outbound via `eu-west-1.amazonses.com` with
no newsletter tagging, inbound `dkim=pass` / `spf=pass` / `dmarc=pass`.

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

- [x] Email Routing live, `info@empiriausluge.hr` receives mail
- [x] Site live at `https://empiriausluge.hr` with company name, address, OIB and MBS
- [x] Domain verified in Business Manager (meta-tag method, verified 16 Sep 2026)
- [ ] App settings -> **Privacy Policy URL:** `https://empiriausluge.hr/privacy`
- [ ] App settings -> **Terms of Service URL:** `https://empiriausluge.hr/terms`
- [ ] Business verification in Security Center: legal name, address and OIB must match
      the registry. Try **email confirmation to `info@empiriausluge.hr`** first — a
      domain-matched address often avoids the phone step.
- [ ] Only if Meta explicitly asks for a phone: add one and leave it up until the WABA
      is live, rather than removing it after the checkmark appears.

The verification meta tag lives in `index.html` `<head>`. Do not move it into a
template or inject it with JavaScript — Meta re-checks periodically and fails the
domain if the tag is not in the static head.

Note: the WhatsApp Business API sender number cannot be a number already active on
regular WhatsApp or the WhatsApp Business app. Plan on a separate number.
