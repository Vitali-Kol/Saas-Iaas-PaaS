# Saas-Iaas-PaaS
## CloudFlow SaaS - Pilverakenduste Platvorm (Õppetöö Projekt)

> **Aine:** Pilverakenduste maailm: SaaS-lahenduste loomine ja haldamine  
> **Eesmärk:** Hinne "A" nõuete täitmine (Multi-tenancy, OAuth 2.0, Stripe Billing, Sentry seire ja Pilve-deploy).

---

## 🎯 Hinne "A" Nõuete Kaetus (Slide 8)

1. **Meeskonnatöö (Teamwork)**
   * Struktureeritud koodibaas (Next.js 14 App Router, TypeScript, Tailwind CSS).
   * Valmis GitHubi lükkamiseks ja tiimitööks (Pull Requestid, issue-d).

2. **Identiteedihaldus (Identity Management & OAuth 2.0)**
   * Ei mingit paroolide kohalikku salvestamist (Slide 6).
   * Integreeritud OAuth 2.0 (Google ja GitHub) ning toetus Supabase Auth ja Clerk teenustele.

3. **Arveldusteenus (Billing & Stripe)**
   * Freemium ja Tiered Pricing mudelid (Free 0€, Pro 29€, Enterprise 99€).
   * Stripe Checkout otspunkt: `/api/stripe/checkout`
   * Stripe Webhooks otspunkt: `/api/stripe/webhook`
   * Automaatne funktsioonide piiramine (Free plaanil kuni 3 ülesannet).

4. **Multi-tenancy (Andmete Eraldamine)**
   * Loogiline andmete eraldamine läbi unikaalse `tenant_id`.
   * Reaalajas tenantite vahetamine päises (nt. *Baltic Tech OÜ*, *Tallinn Roasters Hub*, *Nordic AI*).
   * API otspunkt: `/api/tenants?tenantId=...` tagastab ainult konkreetse organisatsiooni andmed.

5. **Deploy ja Monitooring (Sentry & Pilv)**
   * Valmis koheseks deploy'ks: **Render**, **Railway** või **Vercel**.
   * Reaalajas süsteemi uptime ja vastuseaja (&lt;200ms) indikaatorid.
   * Vigade püüdmine (Sentry Exception Tracking) koos test-vea nupuga.

---

## 🚀 Kiire Käivitamine (Local Development)

### 1. Sõltuvuste paigaldus
```bash
npm install
```

### 2. Arendusserveri käivitamine
```bash
npm run dev
```
Ava brauseris: [http://localhost:3000](http://localhost:3000)

---

## 📦 Kuidas teha esimene Deploy (Slide 8: Samm 3)

### Variant A: Vercel (Kõige kiirem - 2 minutit)
1. Loo GitHubis uus repositoorium ja lükka see kood sinna:
   ```bash
   git init
   git add .
   git commit -m "feat: initial saas multi-tenant starter"
   git branch -M main
   git remote add origin https://github.com/SINU-KASUTAJA/saas-project.git
   git push -u origin main
   ```
2. Mine aadressile [vercel.com](https://vercel.com) ja logi sisse GitHubiga.
3. Vali **"Add New Project"** -> Impordi oma repositoorium -> Vajuta **"Deploy"**.
4. Valmis! Sul on avalik HTTPS link õppejõule näitamiseks.

### Variant B: Render (Slaididel soovitatud)
1. Mine [render.com](https://render.com) ja logi sisse GitHubiga.
2. Vali **"New Web Service"** ja ühenda oma GitHubi repo.
3. Seadistused:
   - **Environment:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start`
4. Vajuta **"Deploy"**.

---

## 🔑 Keskkonnamuutujad (`.env.local`)

Rakendus töötab koheselt ka ilma väliste võtmeteta (Mock/Demo režiimis). Päris API võtmete lisamiseks vaata `.env.example`:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...
```
