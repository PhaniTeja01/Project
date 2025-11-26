import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Rate limiting - OpenAI free tier is 3 requests per minute (20 seconds between requests)
const requestTimestamps = {};
const RATE_LIMIT_MS = 20000; // Wait 20 seconds between requests to respect OpenAI's RPM limit

function isRateLimited(clientId = 'default') {
  const now = Date.now();
  const lastRequest = requestTimestamps[clientId] || 0;
  
  if (now - lastRequest < RATE_LIMIT_MS) {
    const secondsWait = Math.ceil((RATE_LIMIT_MS - (now - lastRequest)) / 1000);
    return { limited: true, secondsWait };
  }
  
  requestTimestamps[clientId] = now;
  return { limited: false };
}

// CORS configuration for production and development
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from dist folder (built React app) in production
if (NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

// Mock story generator for demo mode - returns clean story and choices
function generateMockStory(prompt) {
  // Extract context from prompt
  const context = {
    character: prompt.match(/Character:\s*([^\n-]+)/)?.[1]?.trim() || 'Hero',
    class: prompt.match(/\(([^)]+)\)/)?.[1]?.trim() || 'Adventurer',
    personality: prompt.match(/Personality:\s*([^\n]+)/)?.[1]?.trim() || 'Brave',
    world: prompt.match(/World:\s*([^\n]+)/)?.[1]?.trim() || 'Unknown Land',
    ending: prompt.match(/Ending:\s*([^\n]+)/)?.[1]?.trim() || 'Happy',
    isContinuation: prompt.includes('Continue this story'),
    choiceMade: prompt.match(/Choice made:\s*([^\n]+)/)?.[1]?.trim(),
  };

  let storyText = '';

  if (!context.isContinuation) {
    // First chapter - clean opening story (no prompt text)
    const openingStories = [
      `${context.character} arrives in ${context.world}. As a ${context.class}} with a ${context.personality}} nature, they sense the weight of untold adventures ahead. The landscape stretches before them, full of mysteries waiting to be uncovered.`,
      
      `In ${context.world}}, ${context.character}} awakens to their destiny. With the skills of a ${context.class}} and the personality of someone who is ${context.personality}}, they assess the situation carefully. Something significant is about to happen.`,
      
      `${context.character}} stands ready in ${context.world}}. As a ${context.class}}, they've faced challenges before, but their ${context.personality}} nature tells them this time is different. The adventure unfolds before them.`,
      
      `The ${context.world}} welcomes ${context.character}}, a capable ${context.class}} with a ${context.personality}} disposition. Something in the air suggests the beginning of an epic journey. Multiple paths lie ahead.`,
      
      `${context.character}} enters ${context.world}} with determination. Their experience as a ${context.class}} and their ${context.personality}} outlook prepare them for what's to come. The story begins in earnest now.`,
    ];

    storyText = openingStories[Math.floor(Math.random() * openingStories.length)];
  } else {
    // Continuation - clean story (no prompt echo)
    const continuationStories = [
      `Following the choice to "${context.choiceMade}}", the adventure takes a turn. ${context.character}} navigates ${context.world}} with skill, their ${context.class}} experience helping them adapt. As someone ${context.personality}}, they press forward.`,
      
      `The decision to "${context.choiceMade}}" changes everything. ${context.character}} finds themselves deeper in ${context.world}} than expected. With ${context.class}} training and a ${context.personality}} spirit, they face new challenges.`,
      
      `"${context.choiceMade}}" leads ${context.character}} further into the heart of ${context.world}}. Their ${context.class}} abilities are tested, and their ${context.personality}} nature guides their next move.`,
      
      `By choosing "${context.choiceMade}}", ${context.character}} sets off a chain of events. Through ${context.world}}, they adapt as only a skilled ${context.class}} can. Their ${context.personality}} resolve strengthens.`,
    ];

    storyText = continuationStories[Math.floor(Math.random() * continuationStories.length)];
  }

  // Generate context-aware choices
  const choiceOptions = [
    [
      `Use your ${context.class}} skills`,
      `Trust your ${context.personality}} instincts`,
      `Seek allies for help`,
    ],
    [
      `Confront the challenge directly`,
      `Find a clever solution`,
      `Take a safer route`,
    ],
    [
      `Act with urgency`,
      `Take time to investigate`,
      `Get advice from others`,
    ],
    [
      `Take the risky path`,
      `Play it safe`,
      `Find a balanced approach`,
    ],
  ];

  const choices = choiceOptions[Math.floor(Math.random() * choiceOptions.length)];

  return {
    story: storyText,
    choices: choices
  };
}


app.post('/api/generate-story', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.LLM_API_KEY;
    const providerUrl = process.env.LLM_PROVIDER_URL;
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    const maxTokens = parseInt(process.env.LLM_MAX_TOKENS || '600');
    const temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.8');

    // Check rate limit
    const rateLimitCheck = isRateLimited();
    if (rateLimitCheck.limited) {
      return res.status(429).json({ 
        error: `Too many requests. Please wait ${rateLimitCheck.secondsWait} seconds.`,
        message: `Rate limited - OpenAI free tier allows 3 requests per minute`
      });
    }

    // If no API key, return mock response
    if (!apiKey || !apiKey.includes('sk-proj')) {
      const mockData = generateMockStory(prompt);
      const mockResponse = {
        content: [
          {
            type: 'text',
            text: `STORY: ${mockData.story}\nCHOICES:\n1. ${mockData.choices[0]}\n2. ${mockData.choices[1]}\n3. ${mockData.choices[2]}`
          }
        ]
      };
      return res.json(mockResponse);
    }

    // Use OpenAI API with retry logic
    let retries = 3;
    let lastError = null;

    while (retries > 0) {
      try {
        const response = await fetch(providerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens,
            temperature: temperature,
          }),
        });

        const data = await response.json();

        // Handle rate limit (429) - exponential backoff
        if (response.status === 429) {
          lastError = data;
          retries--;
          if (retries > 0) {
            const waitMs = (3 - retries) * 5000; // 5s, 10s delays
            console.log(`Rate limited. Retrying in ${waitMs/1000}s... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            continue;
          }
        }

        if (!response.ok) {
          console.error('OpenAI API error:', data);
          
          // For rate limits, return fallback
          if (response.status === 429) {
            const mockData = generateMockStory(prompt);
            return res.json({
              content: [
                {
                  type: 'text',
                  text: `STORY: ${mockData.story}\nCHOICES:\n1. ${mockData.choices[0]}\n2. ${mockData.choices[1]}\n3. ${mockData.choices[2]}`
                }
              ]
            });
          }
          
          return res.status(response.status).json(data);
        }


        // Transform OpenAI response to match our expected format
        const transformedResponse = {
          content: [
            {
              type: 'text',
              text: data.choices[0].message.content
            }
          ]
        };

        return res.json(transformedResponse);
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`Request failed. Retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // If all retries failed, use mock data
    console.error('All retries failed, falling back to mock data:', lastError);
    const mockData = generateMockStory(prompt);
    return res.json({
      content: [
        {
          type: 'text',
          text: `STORY: ${mockData.story}\nCHOICES:\n1. ${mockData.choices[0]}\n2. ${mockData.choices[1]}\n3. ${mockData.choices[2]}`
        }
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route to serve index.html for React app in production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';
  if (!apiKey || !apiKey.includes('sk-proj')) {
    console.log('⚠️  No valid OpenAI API key found. Running in DEMO MODE with mock stories.');
    console.log('To use real AI-generated stories, add your OpenAI API key to .env');
  } else {
    console.log(`✅ OpenAI API key configured. Using ${model} for story generation.`);
  }
});

