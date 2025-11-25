# Quick Start Deployment Guide

## 🚀 Deploy Without Errors - Quick Steps

### Step 1: Local Setup & Testing
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# LLM_API_KEY=sk-proj-your_key_here

# Test locally
npm run dev
# Visit http://localhost:5173
```

### Step 2: Build for Production
```bash
# Build frontend
npm run build

# Verify build output
ls -la dist/
```

### Step 3: Choose Your Hosting Platform

#### ✅ Easiest: Deploy to Render.com

1. Go to https://render.com
2. Sign up and connect your GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repo
5. Fill in settings:
   - **Name**: storyforge
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
6. Scroll to "Environment" and add:
   ```
   LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
   LLM_API_KEY=sk-proj-your_actual_key
   LLM_MODEL=gpt-4o-mini
   LLM_MAX_TOKENS=600
   LLM_TEMPERATURE=0.8
   NODE_ENV=production
   ```
7. Click "Create Web Service"
8. Done! Render will auto-deploy when you push to GitHub

#### Alternative: Deploy to Railway.app

1. Go to https://railway.app
2. Connect GitHub
3. Import project
4. Add environment variables in dashboard
5. Deploy

#### Alternative: Deploy to Heroku

1. Install Heroku CLI
2. Run:
```bash
heroku create your-app-name
heroku config:set LLM_API_KEY=sk-proj-your_key
heroku config:set LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
heroku config:set LLM_MODEL=gpt-4o-mini
heroku config:set NODE_ENV=production
git push heroku main
```

### Step 4: Test Deployment

After deployment, test:
1. Open the app URL
2. Create a character with all settings
3. Generate a story
4. Check that text is different from previous runs
5. Try different characters/worlds

## ⚠️ Common Deployment Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` on server |
| API returns 401 | Check OpenAI API key is valid |
| CORS errors | Verify frontend URL matches CORS origin |
| Stories not generating | Check `.env` variables are set correctly |
| 404 errors | Verify build command ran and dist/ exists |
| App in demo mode | Your API key may be invalid, check logs |

## 📋 Pre-Deployment Checklist

```
☐ Node.js v16+ installed locally
☐ npm install completed successfully
☐ .env file created with real API key
☐ npm run build completes without errors
☐ npm run dev works on localhost
☐ .env added to .gitignore
☐ Latest code pushed to GitHub
☐ Hosting platform account created
☐ Environment variables set on platform
```

## 🔍 Verify Deployment Success

```bash
# Check server health
curl https://your-app-url.com/health

# Check API endpoint
curl -X POST https://your-app-url.com/api/generate-story \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test prompt"}'

# If you get a story object back, it's working!
```

## 📞 Troubleshooting

### If nothing works:
1. Check the hosting platform's logs
2. Verify all environment variables are set
3. Try running `npm run dev` locally to test
4. Make sure .env has correct API key format (should start with `sk-proj-`)

### Still having issues?
1. Check DEPLOYMENT.md for detailed instructions
2. Verify your OpenAI API key is valid at https://platform.openai.com
3. Check if demo mode fallback is working (should show "Running in DEMO MODE" in logs)

## 🎯 After Successful Deployment

1. **Monitor Logs**: Check platform logs regularly for errors
2. **Test Features**: Try all avatar types, world settings, personalities
3. **Share Link**: Your app is now live! Share the URL with others
4. **Iterate**: Make improvements and redeploy (platform auto-deploys on git push)

---

**Total deployment time: ~5-10 minutes**

Once deployed, every time you push to GitHub, your app automatically updates! 🚀
