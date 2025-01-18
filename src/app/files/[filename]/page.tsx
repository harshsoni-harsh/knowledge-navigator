import { join } from 'path';
import { PageLayout } from '@/components/page-layout';
import ViewerPrebuilt from './ViewerPrebuilt';

export default async function Page({
  params,
}: {
  params: Promise<{ filename: string }>;
}) {
  const { filename } = await params;
  const pdfPath = join('/', 'uploads', filename);

  return (
    <PageLayout title="PDF Viewer">
      <ViewerPrebuilt {...{ pdfPath }} />
    </PageLayout>
  );
}
