import { NextResponse } from 'next/server';
import { productDb, integrationDb } from '@/lib/db';
import Link from 'next/link';

export async function GET() {
  try {
    const products = productDb.findAll();
    return NextResponse.json(products);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, quantity, tags, category, rawInput, images } = body;
    if (!title || price === undefined) {
      return NextResponse.json({ error: 'title and price are required' }, { status: 400 });
    }
    const product = productDb.create({
      title,
      description: description || '',
      price: parseFloat(price),
      quantity: quantity || 1,
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
      category: category || null,
      rawInput: rawInput || null,
      images: images || '[]',
      status: 'draft',
      etsyListingId: null,
      amazonListingId: null,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
