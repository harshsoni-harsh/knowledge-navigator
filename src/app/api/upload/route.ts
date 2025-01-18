import { NextRequest, NextResponse } from 'next/server';
import { ensureDirectoryExists, saveFile } from '@/lib/fileUtils';
import { logger } from '@/lib/logger';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('books') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    for (const file of files) {
      const relativeUploadDir = `/uploads`;
      const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

      await ensureDirectoryExists(uploadDir);

      await saveFile(file, uploadDir);

      uploadedFiles.push(`${relativeUploadDir}/${file.name}`);
    }

    return NextResponse.json({ fileUrls: uploadedFiles });
  } catch (error) {
    logger.error('Error during file upload:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Something went wrong.',
      },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
