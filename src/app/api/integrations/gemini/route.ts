import { NextResponse } from 'next/server';
import { integrationDb } from '@/lib/db';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), '.env.local');

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    if (!apiKey) return NextResponse.json({ error: 'apiKey required' }, { status: 400 });

    // 1. Save to SQLite database for instant runtime hot-reload
    integrationDb.upsert('gemini', {
      accessToken: apiKey,
      isConnected: 1,
    });

    // 2. Also back up to .env.local
    let content = '';
    try {
      content = await readFile(CONFIG_PATH, 'utf-8');
    } catch {
      content = '';
    }

    if (content.includes('GEMINI_API_KEY=')) {
      content = content.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${apiKey}`);
    } else {
      content += `\nGEMINI_API_KEY=${apiKey}`;
    }
    await writeFile(CONFIG_PATH, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Gemini API key saved and activated successfully (no restart required)!'
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to save key' }, { status: 500 });
  }
}
