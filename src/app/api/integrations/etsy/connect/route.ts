import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { apiKey, oauthToken, shopId } = await request.json();
    if (!apiKey || !oauthToken || !shopId) {
      return NextResponse.json({ error: 'API Key, OAuth Access Token, and Shop ID are all required.' }, { status: 400 });
    }

    // Store: accessToken = keystring (x-api-key), refreshToken = oauthToken (Bearer), shopId = shopId
    const integration = integrationDb.upsert('etsy', {
      accessToken: apiKey,       // Etsy API Keystring
      refreshToken: oauthToken,  // Etsy OAuth Access Token
      shopId: shopId,
      isConnected: 1,
    });

    return NextResponse.json({ ...integration, isConnected: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
