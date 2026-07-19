import { NextResponse } from 'next/server';
import { optimizeProductListing } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawInput, platform } = body;
    if (!rawInput) {
      return NextResponse.json({ error: 'rawInput is required' }, { status: 400 });
    }
    const result = await optimizeProductListing(rawInput, platform || 'both');
    return NextResponse.json(result);
  } catch (err: unknown) {
    const originalMessage = err instanceof Error ? err.message : String(err);
    
    // Check if this is a Quota/Rate limit error
    const isRateLimit = 
      originalMessage.includes('429') || 
      originalMessage.toLowerCase().includes('quota') || 
      originalMessage.toLowerCase().includes('rate limit') || 
      originalMessage.toLowerCase().includes('too many requests');

    if (isRateLimit) {
      return NextResponse.json({
        error: `⚠️ Gemini API Quota Exceeded! Your free key has run out of requests.

How to fix this:
1. Wait 30-60 seconds (if it's a per-minute limit) and click 'Analyze' again.
2. Go to 'Integrations' and change your Google AI Studio API Key.
3. Make sure your API key in Google AI Studio has billing enabled if you require high volume listings.`
      }, { status: 429 });
    }

    return NextResponse.json({ error: originalMessage }, { status: 500 });
  }
}
