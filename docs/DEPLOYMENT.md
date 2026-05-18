# 🚀 Deployment Guide — StudyStreak

## Step 1: Open in VS Code

```bash
# Open the project folder in VS Code
code studystreak.code-workspace
```

Install the recommended extensions when prompted.

---

## Step 2: Push to GitHub

```bash
# 1. Create a new repo at github.com (name: studystreak, set to Public or Private)

# 2. In your terminal inside the project folder:
git init
git add .
git commit -m "🔥 Initial commit — StudyStreak v1.0"

# 3. Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/studystreak.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import the GitHub repository.
3. Configure build:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add the variables from `.env.example`.
5. Click **Deploy**.

Every push to `main` triggers a new Vercel deployment when Git integration is connected.

---

## Step 4: Custom Domain (Optional)

1. In Vercel → your project → Domains
2. Add your domain (e.g. `studystreak.app`)
3. Follow DNS setup instructions
4. SSL is automatic ✅

---

## Step 5: Add Stripe Payments

1. Create account at stripe.com
2. Create Products:
   - "StudyStreak Pro" — $8.99/month recurring
   - "StudyStreak Premium" — $12.99/month recurring
3. Copy the Price IDs (start with `price_`)
4. Add public Supabase variables to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Optional: `VITE_SUPABASE_FUNCTION_URL`
5. Add Stripe secrets and price IDs to Supabase Edge Function secrets:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_PRO_MONTHLY`
   - `STRIPE_PRICE_PREMIUM_MONTHLY`
   - Optional annual billing IDs: `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_PRICE_PREMIUM_ANNUAL`

---

## 💰 Revenue Milestones

| Users | Plan | Monthly Revenue |
|-------|------|----------------|
| 100 | Pro | $1,699 |
| 300 | Pro | $5,097 |
| 590 | Pro | $10,024 ✅ |
| 417 | Premium | $10,004 ✅ |
| Mix | Both | 🚀 Scale |

**Path to $10k/month: 590 Pro subscribers or 417 Premium subscribers.**

TikTok/Instagram content strategy → free traffic → email list → conversion funnel.
