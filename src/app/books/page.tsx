import { BookLibrary } from '@/components/book-library';
import { PageLayout } from '@/components/page-layout';

export default function BooksPage() {
  return (
    <PageLayout title="My Books">
      <BookLibrary />
    </PageLayout>
  );
}
