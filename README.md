# 🔥 StudyStreak — Never Break the Chain

> The habit tracker students are obsessed with. Track streaks, earn XP, and gamify your grind.

![StudyStreak Banner](https://via.placeholder.com/1200x400/FF6B35/FFFFFF?text=🔥+StudyStreak)

## ✨ Features

- **🔥 Streak Tracking** — Daily habit chains with freeze shields
- **⚡ XP & Leveling** — Earn points for every minute studied
- **⏱️ Smart Timer** — Pomodoro + custom sessions per subject
- **📊 Analytics** — Weekly charts, calendar heatmap, subject breakdown
- **🏆 Achievements** — 50+ badges to unlock
- **💳 Subscriptions** — Free / Pro ($8.99/mo) / Premium ($12.99/mo)

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/studystreak.git
cd studystreak

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State | Zustand (persisted) |
| Charts | Recharts |
| Deployment | Cloudflare Pages |
| Payments | Stripe (integrate separately) |

## 📁 Project Structure

```
studystreak/
├── public/
│   ├── favicon.svg
│   └── _redirects          # Cloudflare SPA routing
├── src/
│   ├── components/
│   │   ├── Layout.jsx      # Sidebar + nav
│   │   └── PaywallModal.jsx
│   ├── pages/
│   │   ├── Landing.jsx     # Marketing homepage
│   │   ├── Dashboard.jsx   # Main app hub
│   │   ├── Timer.jsx       # Study timer
│   │   ├── Progress.jsx    # Charts & analytics
│   │   ├── Achievements.jsx
│   │   └── Pricing.jsx     # Plans + billing
│   ├── store.js            # Zustand global state
│   ├── App.jsx             # Routes
│   ├── main.jsx
│   └── index.css           # Design system
├── index.html
├── vite.config.js
├── wrangler.toml           # Cloudflare config
└── package.json
```

## ☁️ Deploy to Cloudflare Pages

### Option A: GitHub Integration (Recommended)

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create a project
3. Connect your GitHub account and select this repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy** ✅

Every push to `main` auto-deploys. 🎉

### Option B: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=studystreak
```

## 💳 Adding Stripe Payments

1. Create a [Stripe account](https://stripe.com)
2. Create two products: Pro ($8.99/mo) and Premium ($12.99/mo)
3. Copy `.env.example` to `.env` and set:
   - `VITE_pk_live_51TXg47HU1AxqRSaJZ5Btv3S7cw6JWk1np8AkqIKJC5yuyIdYqium68kdyu6baNSmZqA5DtfkAvby3naYJJSxkXmD00d8XPnmCC`
   - `VITE_STRIPE_PRICE_PRO_MONTHLY`
   - `VITE_STRIPE_PRICE_PREMIUM_MONTHLY`
   - Optional annual IDs: `VITE_STRIPE_PRICE_PRO_ANNUAL`, `VITE_STRIPE_PRICE_PREMIUM_ANNUAL`
4. Checkout is handled in `src/lib/stripeCheckout.js` and used by both `src/pages/Pricing.jsx` and `src/components/PaywallModal.jsx`

## 🎨 Design System

Colors defined in `src/index.css` as CSS variables:

| Variable | Value | Use |
|----------|-------|-----|
| `--brand-orange` | `#FF6B35` | Primary CTA |
| `--brand-yellow` | `#FFD23F` | Accents, XP |
| `--brand-green` | `#06D6A0` | Success, streaks |
| `--brand-purple` | `#9B5DE5` | Premium tier |
| `--brand-pink` | `#F72585` | Highlights |

Fonts: **Boogaloo** (display) + **Nunito** (body) via Google Fonts

## 📱 TikTok & Instagram Content Ideas

To hit $10k/month, here's a content playbook:

- **"Day X of my study streak"** — personal accountability series
- **Show the app's streak screen** — satisfying numbers, fire animation
- **Before/after GPA** — proof content
- **Study with me** — use the timer on screen while studying
- **"I dare you to study for 25 minutes"** — challenge format

Monetization path: 1,000 paying users × $8.99 = ~$17k/month 🚀

## 📄 License

MIT — build freely, deploy proudly.

---

Built with ❤️ for students everywhere. **Never break the chain. 🔥**
