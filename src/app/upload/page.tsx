import { BookUploadForm } from '@/components/book-upload-form';
import { PageLayout } from '@/components/page-layout';

export default function UploadPage() {
  return (
    <PageLayout title="Upload Book">
      <BookUploadForm />
    </PageLayout>
  );
}
