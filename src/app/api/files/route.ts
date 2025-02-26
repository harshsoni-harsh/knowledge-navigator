import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    const files = await readdir(uploadDir);

    const filesWithMetadata = await Promise.all(
      files.map(async (file) => {
        const fileStat = await stat(join(uploadDir, file));

        const title = file;

        return {
          filename: file,
          size: fileStat.size,
          createdAt: fileStat.birthtime,
          updatedAt: fileStat.mtime,
          metadata: {
            title: title || 'Unknown',
          },
        };
      })
    );

    return NextResponse.json({ files: filesWithMetadata });
  } catch (error) {
    console.error('Error fetching file list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file list' },
      { status: 500 }
    );
  }
}
