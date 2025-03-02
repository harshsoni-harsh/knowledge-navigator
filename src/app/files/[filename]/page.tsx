'use client';

import { join } from 'path';
import { PageLayout } from '@/components/page-layout';
import ViewerPrebuilt from './ViewerPrebuilt';
import { use, useEffect, useState } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ filename: string }>;
}) {
  const { filename } = use(params);
  const [fileExists, setFileExists] = useState(true);

  const pdfPath = join('/', 'uploads', filename);

  useEffect(() => {
    const checkFile = async () => {
      try {
        const response = await fetch(pdfPath, { method: 'HEAD' });
        setFileExists(response.ok);
      } catch (error) {
        if (error) setFileExists(false);
      }
    };

    checkFile();
  }, [pdfPath]);

  return (
    <PageLayout title="PDF Viewer">
      {fileExists ? (
        <ViewerPrebuilt {...{ pdfPath }} />
      ) : (
        <div className="size-full grid place-items-center">File not found</div>
      )}
    </PageLayout>
  );
}
