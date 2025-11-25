# StoryForge

An AI-powered interactive story game built with React, Vite, Tailwind CSS, and Express.js backend with OpenAI integration.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- OpenAI API key (get from https://platform.openai.com/api-keys)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root and add your OpenAI configuration:
```
LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_MAX_TOKENS=600
LLM_TEMPERATURE=0.8
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### Development

Start both the frontend and backend servers simultaneously:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:client    # Frontend only (http://localhost:5173)
npm run dev:server    # Backend only (http://localhost:3001)
```

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create `vercel.json` for backend configuration
3. Deploy:
```bash
vercel
```

### Deploy to Render

1. Push your code to GitHub
2. Create new Web Service on Render
3. Add environment variables in Render dashboard
4. Connect your GitHub repo

### Deploy to Heroku

1. Install Heroku CLI
2. Create app and add environment variables:
```bash
heroku create your-app-name
heroku config:set LLM_API_KEY=your_key
heroku config:set LLM_PROVIDER_URL=https://api.openai.com/v1/chat/completions
heroku config:set LLM_MODEL=gpt-4o-mini
```

3. Deploy:
```bash
git push heroku main
```

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `LLM_PROVIDER_URL` | OpenAI API endpoint | `https://api.openai.com/v1/chat/completions` |
| `LLM_API_KEY` | Your OpenAI API key | `sk-proj-...` |
| `LLM_MODEL` | Model to use | `gpt-4o-mini` |
| `LLM_MAX_TOKENS` | Max response tokens | `600` |
| `LLM_TEMPERATURE` | Response creativity (0-2) | `0.8` |
| `PORT` | Server port (optional) | `3001` |

### Important Deployment Notes

1. **Build Frontend First**: Run `npm run build` before deploying to generate optimized production files
2. **Set NODE_ENV**: On production servers, set `NODE_ENV=production`
3. **CORS**: The app includes CORS for development. Update `server.js` for production if needed
4. **API Keys**: Never commit `.env` files. Always set environment variables on your hosting platform
5. **Demo Mode**: If no valid API key is provided, the app runs in demo mode with mock stories

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js API proxy
- **API**: Anthropic Claude API (backend-only to avoid CORS issues)

## Features

- **AI-Powered Stories**: Generate unique interactive stories using Claude API
- **Character Customization**: Choose from 16 different avatars with unique abilities
- **20 World Settings**: From Fantasy Realm to Magical Academy
- **18 Personality Types**: Shape your character's personality
- **15 Ending Types**: Choose how your story concludes
- **Interactive Choices**: Your decisions influence the story progression
- **Beautiful UI**: Modern gradient design with Tailwind CSS
- **Development Tools**: React DevTools support

## Project Structure

```
/workspaces/Project/
├── server.js              # Express.js backend
├── src/
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # React entry point
│   ├── index.css          # Tailwind CSS
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── .env                   # Environment variables (create this)
└── package.json           # Dependencies and scripts
```

## Technologies

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
- Express.js
- Claude API (Anthropic)

## Troubleshooting

If you get CORS errors:
- Ensure the backend server is running on `http://localhost:3001`
- Check that your `ANTHROPIC_API_KEY` is set in the `.env` file

If API calls fail:
- Verify your Anthropic API key is valid
- Check you have sufficient API credits
