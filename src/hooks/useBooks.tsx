import { useState, useEffect } from 'react';

type Book = {
  title: string;
  author: string;
  year: number;
};

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/files');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        const booksData = data.files.map(
          ({ metadata }: { metadata: Book }) => metadata
        );
        setBooks(booksData);
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
