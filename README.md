# 🚀 PM Simulator - 12 Weeks in 30 Minutes

Interactive Project Management simulator where you experience a realistic 12-week software project by making irreversible decisions.

---

## 📋 WHAT YOU'LL NEED

- Node.js 18+ (download from nodejs.org)
- Claude API key (free from console.anthropic.com)
- 10 minutes

---

## 🏃 QUICK START (Local Development)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Add Your Claude API Key
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and add your Claude API key:
```
VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

Get your free key: https://console.anthropic.com/

**Note:** If you don't add API key, the app still works but uses fallback feedback (not AI-generated).

### Step 3: Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 4: Test It!
1. Click "Start Project"
2. Read project brief
3. Make decisions through Week 1-3
4. See how your choices affect metrics
5. Complete the simulation

---

## 🌐 DEPLOY TO VERCEL (Free, 5 minutes)

### Why Vercel?
- ✅ Free forever
- ✅ Automatic HTTPS
- ✅ Deploy in 1 click
- ✅ Auto-deploy on git push

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"New Project"**
4. **Import** your GitHub repository
5. Click **"Deploy"** (no config needed!)

### Step 3: Add Environment Variable
1. In Vercel project dashboard, go to **Settings → Environment Variables**
2. Add:
   - **Key:** `VITE_CLAUDE_API_KEY`
   - **Value:** Your Claude API key
   - **Environment:** Production
3. Click **Save**
4. **Redeploy** (Deployments tab → click ⋯ → Redeploy)

### Step 4: Get Your URL
Your app is live at: `https://your-project.vercel.app`

---

## 🧪 FOR TESTING WITH 10 PM

### Send Testers:
1. Your Vercel URL: `https://your-project.vercel.app`
2. Google Form for feedback (see validation-plan.md)

### What to Track:
- Completion rate (did they finish all 3 weeks?)
- Realism feedback (does it feel like real PM work?)
- AI feedback quality (helpful or generic?)
- Would they pay? (product-market fit)

### Success Criteria:
- ✅ 70%+ completion rate
- ✅ Realism score 4+/5
- ✅ AI feedback 4+/5
- ✅ 50%+ would pay

---

## 📁 PROJECT STRUCTURE

```
pm-simulator/
├── src/
│   ├── App.jsx                    # Main router & state management
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # All styles
│   ├── screens/
│   │   ├── WelcomeScreen.jsx      # Landing screen
│   │   ├── ProjectBriefScreen.jsx # Project context
│   │   ├── WeekScreen.jsx         # Main decision screen
│   │   ├── ConsequencesScreen.jsx # Show decision results
│   │   ├── FeedbackScreen.jsx     # AI feedback
│   │   └── FinalReviewScreen.jsx  # Project summary
│   ├── data/
│   │   └── scenario-data.json     # All scenario content (3 weeks)
│   └── utils/
│       └── claudeAPI.js           # Claude API integration
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🎮 HOW IT WORKS

1. **Linear Flow:** Welcome → Brief → Week 1 → Consequences → Feedback → Week 2 → ... → Final Review
2. **No Going Back:** Decisions are irreversible (just like real PM work)
3. **Metrics Tracking:** 4 metrics (Client Trust, Team Mood, Tech Debt, Timeline Risk)
4. **AI Feedback:** Claude analyzes each decision and provides realistic PM perspective
5. **Cumulative Effects:** Early decisions affect later weeks

---

## 🔧 TECH STACK

- **React 18** - UI framework
- **Vite** - Build tool (fast!)
- **Claude API** - AI feedback generation
- **Vanilla CSS** - Styling (no Tailwind, no dependencies)
- **Vercel** - Hosting (free)

---

## 💰 COST

### Development:
- **Free** (all tools are free)

### Running:
- **Vercel Hosting:** $0/month (free forever)
- **Claude API:** ~$0.50-1 for 10 testers (120 API calls)
- **Total:** ~$1 for validation

### Scaling (100 users/month):
- **Hosting:** Still $0
- **Claude API:** ~$5-10/month
- **Total:** <$10/month

---

## ❓ TROUBLESHOOTING

### "Cannot find module" error
```bash
npm install
```

### "API key not found" warning
- Check `.env` file exists
- Check key starts with `sk-ant-`
- Restart dev server after adding key

### AI feedback shows fallback text
- This is normal if no API key
- Add key to `.env` for real AI feedback
- Fallback text still works for testing flow

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### Deployment failed on Vercel
- Check you pushed latest code to GitHub
- Verify environment variable is set
- Check Vercel build logs for errors

---

## 🚀 NEXT STEPS

### After Validation:
1. Add Weeks 4-12 (same pattern as 1-3)
2. Improve AI feedback prompts
3. Add payment flow (Stripe)
4. Build 2-3 more scenarios
5. Launch on Product Hunt

### To Add More Weeks:
Edit `src/data/scenario-data.json`:
```json
{
  "weeks": [
    { "weekNumber": 1, ... },
    { "weekNumber": 2, ... },
    { "weekNumber": 3, ... },
    { "weekNumber": 4, ... }  // Add more weeks here
  ]
}
```

Update `App.jsx` line 90:
```javascript
if (currentWeek >= 12) {  // Change from 3 to 12
```

---

## 📞 SUPPORT

If stuck:
1. Check this README
2. Check `.env.example` for correct format
3. Check browser console for errors (F12)
4. Check Vercel deployment logs

---

## 🎯 GOALS

**MVP Goal:** Validate with 10 PM
**Success:** 70%+ completion, 4+/5 realism, 50%+ would pay
**Timeline:** 1-2 weeks testing
**Decision:** Go/Iterate/Pivot based on feedback

---

## 📄 LICENSE

Private project - not open source yet.

---

## 🙏 CREDITS

Built with React, Vite, and Claude API.
Scenario based on real PM experiences.

---

**Ready to test!** 🚀

Questions? Check troubleshooting section above.
