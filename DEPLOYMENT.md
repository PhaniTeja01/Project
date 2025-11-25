# Deployment Checklist & Guide

## Pre-Deployment Checklist

- [ ] All dependencies installed: `npm install`
- [ ] `.env` file created with all required variables
- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend server runs without errors: `node server.js`
- [ ] Local testing complete: `npm run dev`
- [ ] `.env` file in `.gitignore` (never commit API keys!)
- [ ] Remove any hardcoded API keys from code

## Required Environment Variables

```
LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-proj-your_actual_key_here
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=600
LLM_TEMPERATURE=0.8
PORT=3001
NODE_ENV=production
```

## Platform-Specific Deployment

### Option 1: Deploy to Render (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Create Render Account** at https://render.com

3. **Create Web Service**:
   - Connect GitHub repo
   - Runtime: Node.js
   - Build Command: `npm install && npm run build`
   - Start Command: `node server.js`
   - Add all environment variables

4. **Deploy**:
   - Render automatically deploys on push

### Option 2: Deploy to Vercel + Node Backend

**Frontend on Vercel:**
```bash
npm i -g vercel
vercel
```

**Backend on Render or Railway:**
- Deploy only `server.js` and dependencies
- Set frontend URL in CORS (update `server.js` origin)

### Option 3: Deploy to Railway.app

1. Create account at https://railway.app
2. Connect GitHub
3. Create new project from repo
4. Add all environment variables
5. Deploy

### Option 4: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm run build
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t storyforge .
docker run -p 3001:3001 -e LLM_API_KEY=your_key storyforge
```

## Production Optimization

### Update CORS for Production
In `server.js`, update the CORS configuration:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com'
    : '*',
  credentials: true
}));
```

### Update Vite Config for Production
The `vite.config.js` proxy only works in development. For production, the frontend needs to call the backend correctly.

## Troubleshooting Deployment Issues

### Issue: "Cannot find module 'express'"
**Fix**: Run `npm install` on the server

### Issue: "API key not found"
**Fix**: Verify all environment variables are set on your hosting platform

### Issue: CORS errors in production
**Fix**: Update the CORS origin in `server.js` to match your frontend domain

### Issue: Backend 404 errors
**Fix**: Ensure backend is running on the correct port and frontend is calling the right API endpoint

### Issue: Build fails
**Fix**: 
1. Clear `node_modules`: `rm -rf node_modules && npm install`
2. Check for syntax errors: `npm run build`
3. Verify all imports are correct

## Post-Deployment

1. Test the deployed application:
   - Generate stories with different characters/worlds
   - Verify API integration working
   - Test all avatar and setting options

2. Monitor logs for errors:
   - Check backend logs for API errors
   - Review browser console for frontend errors

3. Set up monitoring (optional):
   - Use platform's built-in monitoring
   - Set up error tracking with services like Sentry

## Demo Mode Fallback

If deployment fails with API errors, the app automatically falls back to demo mode with mock stories. This allows the app to function even without a valid API key.

To verify demo mode works:
1. Set `LLM_API_KEY=invalid` in `.env`
2. Restart server
3. Check logs for "Running in DEMO MODE"
4. Generate stories - should use mock data

## Performance Tips

1. **Frontend**: Already optimized with Vite
2. **Backend**: Consider caching stories if using same prompts
3. **API Calls**: Set appropriate timeout values
4. **Database**: For production, add a database for story history
