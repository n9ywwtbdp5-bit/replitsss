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
| Deployment | Vercel |
| Auth/Data | Supabase |
| Payments | Stripe Checkout + Supabase Edge Functions |

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
└── package.json
```

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Set build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add the variables from `.env.example` in Vercel and Supabase Edge Function secrets.

Every push to `main` auto-deploys. 🎉

## 💳 Stripe + Supabase Setup

1. Create Stripe products/prices for Pro and Premium monthly plans, plus optional annual plans.
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optional `VITE_SUPABASE_FUNCTION_URL` to Vercel.
3. Add Stripe secrets and price IDs to Supabase Edge Function secrets.
4. Apply the Supabase migration, then deploy `stripe-checkout` and `stripe-webhook`.
5. Configure the Stripe webhook endpoint to call your `stripe-webhook` function for checkout/session and subscription events.

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
