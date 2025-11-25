# 🚀 StoryForge Deployment Guide - Complete

## Summary of What's Been Set Up

Your StoryForge app is now ready for deployment! Here's what I've configured:

### ✅ Files Created/Updated:

1. **README.md** - Updated with OpenAI instructions
2. **DEPLOYMENT.md** - Comprehensive deployment guide
3. **QUICK_DEPLOY.md** - Quick reference for deployment
4. **.env.example** - Template for environment variables
5. **package.json** - Added `start` and `prod` scripts
6. **server.js** - Enhanced with CORS and production config
7. **vercel.json** - Ready for Vercel deployment
8. **deploy.sh** - Automated deployment checklist script

---

## 🎯 Fastest Way to Deploy (Choose One)

### Option A: Render.com (Recommended - Easiest)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Go to https://render.com
# 3. Sign up and create Web Service
# 4. Connect your GitHub repo
# 5. Build Command: npm install && npm run build
# 6. Start Command: node server.js
# 7. Add environment variables (see below)
```

**Environment Variables to Add:**
```
LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-proj-[YOUR_ACTUAL_KEY_HERE]
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=600
LLM_TEMPERATURE=0.8
NODE_ENV=production
```

### Option B: Railway.app

```bash
# 1. Go to https://railway.app
# 2. Login with GitHub
# 3. New Project → Import from GitHub
# 4. Select your repo
# 5. Add environment variables in dashboard
# 6. Done! Auto-deploys on git push
```

### Option C: Heroku

```bash
npm install -g heroku
heroku login
heroku create your-app-name
heroku config:set LLM_API_KEY=sk-proj-your_key
heroku config:set LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
heroku config:set LLM_MODEL=gpt-4o-mini
heroku config:set NODE_ENV=production
git push heroku main
```

---

## ✅ Pre-Deployment Checklist

Run this before deploying:

```bash
# Run automated checker
bash deploy.sh

# Or manually:
npm install
npm run build
npm run dev  # Test locally
```

Verify:
- ✅ No error messages
- ✅ App runs on http://localhost:5173
- ✅ Stories generate successfully
- ✅ All avatars/worlds display correctly

---

## 🔐 Security Checklist

- ✅ `.env` file is in `.gitignore` (never commit it!)
- ✅ API key never shown in code
- ✅ CORS configured for production
- ✅ Environment variables set on hosting platform
- ✅ Demo mode fallback enabled (app works without API key)

---

## 📊 What Gets Deployed

### Frontend:
- React app built to `dist/` folder
- Optimized with Vite
- Tailwind CSS styling
- All static assets

### Backend:
- Express.js server on port 3001
- OpenAI API integration
- Mock story generator fallback
- Health check endpoint (`/health`)

---

## 🧪 Test After Deployment

```bash
# Check server is running
curl https://your-deployed-url.com/health
# Should return: {"status":"ok","environment":"production"}

# Test API
curl -X POST https://your-deployed-url.com/api/generate-story \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test"}'
```

---

## 📝 Environment Variables Reference

| Variable | Required | Example |
|----------|----------|---------|
| `LLM_API_KEY` | ✅ Yes | `sk-proj-...` |
| `LLM_PROVIDER_URL` | ✅ Yes | `https://api.openai.com/v1/chat/completions` |
| `LLM_MODEL` | ✅ Yes | `gpt-4o-mini` |
| `LLM_MAX_TOKENS` | ⚠️ Optional | `600` |
| `LLM_TEMPERATURE` | ⚠️ Optional | `0.8` |
| `NODE_ENV` | ⚠️ Optional | `production` |
| `PORT` | ⚠️ Optional | `3001` |

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "API key not found"
Check environment variables on hosting platform match `.env`

### CORS errors
Your frontend URL may not match CORS origin. Check `server.js`

### Build fails
```bash
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Demo mode instead of real API
- Check API key format (must start with `sk-proj-`)
- Verify no typos in environment variables
- Check logs for "Running in DEMO MODE"

---

## 📚 Documentation Files

- **README.md** - Overview and setup
- **DEPLOYMENT.md** - Detailed deployment options
- **QUICK_DEPLOY.md** - Quick reference guide
- **.env.example** - Environment template
- **deploy.sh** - Automated checklist script

---

## 🎉 Next Steps

1. Choose a hosting platform (Render recommended)
2. Set up environment variables
3. Deploy!
4. Share your live app with others

**Estimated deployment time: 5-10 minutes**

---

## 📞 Need Help?

1. Check logs on your hosting platform
2. Review DEPLOYMENT.md for detailed options
3. Verify `.env` variables match what's set on platform
4. Test locally with `npm run dev` first
5. Check that API key starts with `sk-proj-`

---

**Your app is ready to go live! 🚀**
