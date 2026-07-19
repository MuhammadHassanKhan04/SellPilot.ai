import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';
import { verifyAmazonCredentials, parseAmazonCredentials } from '@/lib/amazon';

export async function POST(request: Request) {
  try {
    const { clientId, clientSecret, refreshToken, sellerId } = await request.json();
    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json({ error: 'Client ID, Client Secret, and Refresh Token are required.' }, { status: 400 });
    }

    // Verify credentials before saving
    const creds = { clientId, clientSecret, refreshToken };
    try {
      await verifyAmazonCredentials(creds);
    } catch (verifyErr) {
      return NextResponse.json({
        error: `Credential verification failed: ${verifyErr instanceof Error ? verifyErr.message : String(verifyErr)}`,
      }, { status: 400 });
    }

    // Store credentials as JSON in refreshToken field
    const integration = integrationDb.upsert('amazon', {
      accessToken: clientId, // store clientId for reference
      refreshToken: JSON.stringify({ clientId, clientSecret, refreshToken }),
      sellerId: sellerId || null,
      isConnected: 1,
    });

    return NextResponse.json({ ...integration, isConnected: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
