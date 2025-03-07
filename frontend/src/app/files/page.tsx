import { BookLibrary } from '@/components/BookLibrary';
import { PageLayout } from '@/components/page-layout';

export default function BooksPage() {
  return (
    <PageLayout title="My Files">
      <BookLibrary />
    </PageLayout>
  );
}
