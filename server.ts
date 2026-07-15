/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parse & CORS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Configure Multer for in-memory image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Lazy initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * AI Auto-Enhance: Calls Gemini (gemini-3.5-flash) to analyze image and return filter values.
 */
app.post('/api/auto-enhance', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const ai = getGeminiClient();
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype;

    const prompt = `
      You are an expert Photo Editor and Color Grader. 
      Analyze the lighting, contrast, exposure, white balance, saturation, highlights, and shadow levels of this image.
      Provide optimized adjustment settings to make this image look professionally balanced, vibrant, and clear.
      
      You MUST return your answer strictly as a JSON object with the following properties (all numeric slider values):
      - brightness: number (value from 80 to 130, where 100 is neutral)
      - contrast: number (value from 80 to 135, where 100 is neutral)
      - exposure: number (value from 85 to 125, where 100 is neutral)
      - highlights: number (value from -40 to 40, where 0 is neutral)
      - shadows: number (value from -30 to 50, where 0 is neutral)
      - temperature: number (value from -25 to 25, where 0 is neutral)
      - tint: number (value from -15 to 15, where 0 is neutral)
      - saturation: number (value from 90 to 130, where 100 is neutral)
      - vibrance: number (value from 95 to 135, where 100 is neutral)
      - gamma: number (value from 85 to 115, where 100 is neutral)
      - sharpness: number (value from 5 to 35, where 0 is neutral)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brightness: { type: Type.NUMBER },
            contrast: { type: Type.NUMBER },
            exposure: { type: Type.NUMBER },
            highlights: { type: Type.NUMBER },
            shadows: { type: Type.NUMBER },
            temperature: { type: Type.NUMBER },
            tint: { type: Type.NUMBER },
            saturation: { type: Type.NUMBER },
            vibrance: { type: Type.NUMBER },
            gamma: { type: Type.NUMBER },
            sharpness: { type: Type.NUMBER },
          },
          required: [
            'brightness', 'contrast', 'exposure', 'highlights', 'shadows', 
            'temperature', 'tint', 'saturation', 'vibrance', 'gamma', 'sharpness'
          ]
        }
      }
    });

    const resultText = response.text || "{}";
    const adjustments = JSON.parse(resultText);

    res.json({ success: true, adjustments });
  } catch (error: any) {
    console.error('AI Auto-Enhance Error:', error);
    res.status(500).json({ error: 'AI Auto-Enhance failed: ' + error.message });
  }
});

/**
 * AI Background Generator: Calls Gemini (gemini-3.1-flash-lite-image or similar)
 * to generate a stunning background.
 * Includes a smart stock fallback matching keywords if generative API requires a premium key.
 */
app.post('/api/generate-background', async (req, res) => {
  const { prompt, aspectRatio = '1:1', theme } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Set up keyword fallbacks for professional royalty-free Unsplash studio backdrops
  const getFallbackStockUrl = (searchPrompt: string): { url: string; msg: string } => {
    const query = searchPrompt.toLowerCase();
    
    if (query.includes('office') || query.includes('room') || query.includes('corporate') || query.includes('work') || query.includes('desk')) {
      return {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched a professional executive office studio backdrop.'
      };
    }
    if (query.includes('neon') || query.includes('cyberpunk') || query.includes('city') || query.includes('alley') || query.includes('night') || query.includes('tokyo')) {
      return {
        url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched an atmospheric neon cyberpunk street alley backdrop.'
      };
    }
    if (query.includes('marble') || query.includes('stage') || query.includes('luxury') || query.includes('gold') || query.includes('platform') || query.includes('pedestal')) {
      return {
        url: 'https://images.unsplash.com/photo-1582298538104-fc2c0a5a0029?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched an elegant luxury marble display stage backdrop.'
      };
    }
    if (query.includes('sunset') || query.includes('beach') || query.includes('ocean') || query.includes('sea') || query.includes('sand') || query.includes('palm') || query.includes('tropical')) {
      return {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched a serene tropical sandy beach sunset backdrop.'
      };
    }
    if (query.includes('mountain') || query.includes('mist') || query.includes('forest') || query.includes('tree') || query.includes('nature') || query.includes('fog') || query.includes('landscape')) {
      return {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched an epic misty mountain pine forest backdrop.'
      };
    }
    if (query.includes('spotlight') || query.includes('glow') || query.includes('dark') || query.includes('bokeh') || query.includes('light') || query.includes('stage')) {
      return {
        url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched a warm bokeh spotlight studio stage backdrop.'
      };
    }
    if (query.includes('interior') || query.includes('loft') || query.includes('home') || query.includes('living') || query.includes('apartment') || query.includes('kitchen') || query.includes('wall')) {
      return {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched a modern minimalist luxury living loft backdrop.'
      };
    }
    if (query.includes('studio') || query.includes('grey') || query.includes('paper') || query.includes('headshot') || query.includes('portrait') || query.includes('backdrop') || query.includes('solid')) {
      return {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
        msg: 'Matched a classic charcoal grey studio headshot paper backdrop.'
      };
    }
    
    // Abstract defaults
    const defaults = [
      'https://images.unsplash.com/photo-1582298538104-fc2c0a5a0029?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80'
    ];
    const pickedUrl = defaults[Math.floor(Math.random() * defaults.length)];
    return {
      url: pickedUrl,
      msg: 'Matched a high-fidelity abstract studio backdrop matching your description.'
    };
  };

  try {
    const ai = getGeminiClient();
    
    // Enrich prompt with creative background keywords
    let enrichedPrompt = `A high-quality, professional backdrop of: ${prompt}. `;
    if (theme) {
      enrichedPrompt += `Theme is ${theme}. Suitable as a studio backdrop or commercial photo scenery. `;
    }
    enrichedPrompt += `Photorealistic, soft focus bokeh background, highly detailed, clean resolution, 8k.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          { text: enrichedPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio === '16:9' ? '16:9' : '1:1'
        }
      }
    });

    // Find the generated image in the response parts
    let base64Image: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error('No image was returned from the generative model.');
    }

    res.json({
      success: true,
      imageUrl: `data:image/png;base64,${base64Image}`,
      isFallback: false,
      message: 'AI backdrop artwork custom-generated by Gemini.'
    });
  } catch (error: any) {
    console.warn('AI Background Generation failed, returning smart stock matching:', error.message);
    const fallback = getFallbackStockUrl(prompt);
    res.json({
      success: true,
      imageUrl: fallback.url,
      isFallback: true,
      message: `Stock Backdrop Loaded: ${fallback.msg} (AI limits active - custom generation requires a paid key)`
    });
  }
});

/**
 * AI Background Removal Endpoint.
 * Identifies the main foreground subject using Gemini (gemini-3.5-flash) and returns
 * a set of polygon coordinates outline the subject's exact contours for high-precision
 * vector masking on the client.
 */
app.post('/api/remove-background', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    const ai = getGeminiClient();
    const base64Image = imageFile.buffer.toString('base64');
    const mimeType = imageFile.mimetype;

    const prompt = `
      Analyze this image and identify the main foreground subject(s) (e.g., person, pet, product, car).
      Define a highly detailed polygon contour around the exact outer boundaries of the main subject(s).
      
      Generate a list of points representing the boundary, where each point is an [x, y] coordinate array
      normalized to a scale of 0 to 100 (where [0,0] is the top-left corner and [100,100] is the bottom-right corner).
      
      Provide a highly detailed silhouette path containing between 40 to 80 points to accurately capture the curves, corners, and edges.
      If there are multiple detached foreground subjects, you can return multiple polygons (one for each subject).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
        prompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            polygons: {
              type: Type.ARRAY,
              description: "Array of polygons. Each polygon is an array of [x, y] coordinates from 0 to 100.",
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ['subject', 'polygons']
        }
      }
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);

    res.json({
      success: true,
      subject: result.subject || 'Subject detected',
      polygons: result.polygons || [],
      isFallback: false
    });
  } catch (error: any) {
    console.error('AI Background Removal Error:', error);
    // Return a structured error response that enables the client-side border-connected flood-fill fallback
    res.json({ 
      success: false, 
      error: error.message,
      isFallback: true 
    });
  }
});

// ============================================================================
// SERVING FRONTEND SPA
// ============================================================================

async function startServer() {
  // Skip server listener and asset serving when running in a serverless function environment
  if (process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT) {
    return;
  }

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import of createServer to prevent it from loading in production builds
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

// Export the app for Netlify / Serverless Functions
export default app;
export { app };
