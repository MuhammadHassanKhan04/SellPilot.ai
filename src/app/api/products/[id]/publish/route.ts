import { NextResponse } from 'next/server';
import { productDb, integrationDb } from '@/lib/db';
import { publishToEtsy } from '@/lib/etsy';
import { publishToAmazon, parseAmazonCredentials } from '@/lib/amazon';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const { etsy, amazon } = await request.json();

  const product = productDb.findById(id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const tags: string[] = JSON.parse(product.tags || '[]');
  const results: string[] = [];
  const errors: string[] = [];
  const updates: Partial<typeof product> = {};

  // ── Etsy ──────────────────────────────────────────────────────────────────
  if (etsy) {
    const etsyInt = integrationDb.findByPlatform('etsy');
    const keystring = etsyInt?.accessToken;
    const oauthToken = etsyInt?.refreshToken;
    const shopId = etsyInt?.shopId;

    if (!etsyInt?.isConnected || !keystring || !oauthToken || !shopId) {
      errors.push('Etsy not fully connected. Please provide API Key, OAuth Token, and Shop ID in Integrations.');
    } else {
      try {
        const listing = await publishToEtsy(keystring, oauthToken, shopId, {
          title: product.title,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          tags,
        });
        updates.etsyListingId = String(listing.listing_id);
        updates.status = 'published';
        results.push(`✅ Published to Etsy (Listing ID: ${listing.listing_id})`);
      } catch (err) {
        errors.push(`Etsy publish failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // ── Amazon ────────────────────────────────────────────────────────────────
  if (amazon) {
    const amzInt = integrationDb.findByPlatform('amazon');
    const sellerId = amzInt?.sellerId;
    const rawCreds = amzInt?.refreshToken;

    if (!amzInt?.isConnected || !rawCreds) {
      errors.push('Amazon not fully connected. Please provide your SP-API credentials in Integrations.');
    } else {
      try {
        const creds = parseAmazonCredentials(rawCreds);
        const { sku } = await publishToAmazon(creds, sellerId || '', {
          title: product.title,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          tags,
        });
        updates.amazonListingId = sku;
        updates.status = 'published';
        results.push(`✅ Published to Amazon (SKU: ${sku})`);
      } catch (err) {
        errors.push(`Amazon publish failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    productDb.update(id, updates);
  }

  const hasSuccess = results.length > 0;
  return NextResponse.json(
    { success: hasSuccess, message: [...results, ...errors].join('\n') || 'No action taken.', results, errors },
    { status: !hasSuccess && errors.length > 0 ? 400 : 200 }
  );
}
