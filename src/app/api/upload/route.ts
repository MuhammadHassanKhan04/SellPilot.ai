import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const savedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename and make it unique
      const ext = path.extname(file.name) || '.jpg';
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
      const uniqueName = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await writeFile(filePath, buffer);
      savedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({ urls: savedUrls });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
