import { NextResponse } from 'next/server';
import { productDb } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const product = productDb.findById(id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { title, description, price, quantity, tags, category, images } = body;
    const updated = productDb.update(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(quantity !== undefined && { quantity: parseInt(quantity, 10) }),
      ...(tags !== undefined && { tags: JSON.stringify(Array.isArray(tags) ? tags : []) }),
      ...(category !== undefined && { category }),
      ...(images !== undefined && { images }),
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    productDb.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
