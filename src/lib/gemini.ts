import { GoogleGenerativeAI } from '@google/generative-ai';
import { integrationDb } from './db';

export interface OptimizedListing {
  title: string;
  description: string;
  tags: string[];
  category: string;
  seoScore: number;
  improvements: string[];
  seoKeywords: string[];
}

export async function optimizeProductListing(
  rawInput: string,
  platform: 'etsy' | 'amazon' | 'both'
): Promise<OptimizedListing> {
  const dbKey = integrationDb.findByPlatform('gemini')?.accessToken;
  const apiKey = dbKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add it in Integrations → AI Configuration.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // gemini-2.0-flash: fast, free, current model supported by key
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const platformLabel = platform === 'both' ? 'Etsy and Amazon' : platform;

  const prompt = `You are an expert e-commerce listing optimizer for ${platformLabel}.

Analyze the following product information and generate an optimized listing:

Product Info:
${rawInput}

Return a JSON object with these EXACT fields (no extra text, no markdown, just raw JSON):
{
  "title": "SEO-optimized product title (max 140 chars for Etsy, 200 for Amazon)",
  "description": "Compelling, keyword-rich description with paragraphs (300-500 words)",
  "tags": ["array", "of", "13", "relevant", "keyword", "tags"],
  "category": "most relevant product category",
  "seoScore": 85,
  "improvements": ["List of 3-5 specific improvements made to the listing"],
  "seoKeywords": ["array", "of", "6-8", "additional", "SEO", "hooks", "search", "terms", "and", "ranking", "triggers", "to", "boost", "traffic"]
}

Focus on:
- High-traffic search keywords naturally woven in
- Clear, benefit-driven language
- Proper formatting with bullet points in description
- Platform-specific best practices (Etsy: handmade/vintage tone; Amazon: feature-first, spec-heavy)

CRITICAL: Return ONLY the raw JSON object. No markdown fences, no explanation text.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if AI adds them anyway
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(text) as OptimizedListing;
  } catch {
    // Last resort: extract the first {...} block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as OptimizedListing;
    }
    throw new Error(`AI returned unexpected format. Raw response: ${text.slice(0, 200)}`);
  }
}
