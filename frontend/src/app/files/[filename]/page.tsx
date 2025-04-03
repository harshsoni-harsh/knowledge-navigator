'use client';

import { PageLayout } from '@/components/page-layout';
import ViewerPrebuilt from './ViewerPrebuilt';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Page({
  params,
}: {
  params: Promise<{ filename: string }>;
}) {
  const { filename } = use(params);
  const [fileExists, setFileExists] = useState(true);
  const [searchOnSelect, setSearchOnSelect] = useState(false);

  const pdfPath = `/api/file?filename=${encodeURIComponent(filename)}`;

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

  const AIButton = (
    <div className='flex gap-2 ml-auto items-center pr-4'>
      <Label htmlFor="ai-mode" className='font-bold'>AI Explainer</Label>
      <Switch id="ai-mode" checked={searchOnSelect} onCheckedChange={setSearchOnSelect}  />
    </div>
  )

  return (
    <PageLayout title="PDF Viewer" secondaryElement={AIButton}>
      {fileExists ? (
        <ViewerPrebuilt {...{ pdfPath, searchOnSelect }} />
      ) : (
        <div className="size-full grid place-items-center">File not found</div>
      )}
    </PageLayout>
  );
}
