import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('books') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await fetch(`${process.env.BACKEND_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('File uploaded successfully:', uploadData);
        } else {
          console.error('Failed to upload file:', uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }

      uploadedFiles.push(`${file.name}`);
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
