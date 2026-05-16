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

## Step 3: Deploy to Cloudflare Pages

### A. Via Dashboard (easiest)
1. Go to https://dash.cloudflare.com
2. Click **Pages** → **Create a project** → **Connect to Git**
3. Authorize GitHub and select the `studystreak` repo
4. Configure build:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **Save and Deploy**
6. Your app is live at `https://studystreak.pages.dev` 🎉

### B. Set Up Auto-Deploy (GitHub Actions)
1. Get your Cloudflare API Token:
   - Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template
2. Get your Account ID from the Cloudflare dashboard sidebar
3. In GitHub repo → Settings → Secrets → Actions, add:
   - `CLOUDFLARE_API_TOKEN` = your token
   - `CLOUDFLARE_ACCOUNT_ID` = your account ID
4. Every push to `main` now auto-deploys ✅

---

## Step 4: Custom Domain (Optional)

1. In Cloudflare Pages → your project → Custom domains
2. Add your domain (e.g. `studystreak.app`)
3. Follow DNS setup instructions
4. SSL is automatic ✅

---

## Step 5: Add Stripe Payments

1. Create account at stripe.com
2. Create Products:
   - "StudyStreak Pro" — $16.99/month recurring
   - "StudyStreak Premium" — $23.99/month recurring
3. Copy the Price IDs (start with `price_`)
4. Copy `.env.example` to `.env`
5. Add environment variables:
   - `VITE_STRIPE_PUBLIC_KEY=pk_live_xxx`
   - `VITE_STRIPE_PRICE_PRO_MONTHLY=price_xxx`
   - `VITE_STRIPE_PRICE_PREMIUM_MONTHLY=price_xxx`
   - Optional annual billing IDs:
     - `VITE_STRIPE_PRICE_PRO_ANNUAL=price_xxx`
     - `VITE_STRIPE_PRICE_PREMIUM_ANNUAL=price_xxx`

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
