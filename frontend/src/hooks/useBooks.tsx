import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { getAllFilesMetadata } from '@/app/actions';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getAllFilesMetadata();
        setBooks(books);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, error };
}
