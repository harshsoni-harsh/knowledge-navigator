'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBooks } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { BookModal } from '@/components/BookModal';
import { Book } from '@/types/book';

export function BookLibrary() {
  const { books, loading, error } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'year'>('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const booksPerPage = 6;

  const filteredAndSortedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBooks = filteredAndSortedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  if (loading) {
    return <p>Loading books...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as 'title' | 'author' | 'year')
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Sort by Title</SelectItem>
            <SelectItem value="author">Sort by Author</SelectItem>
            <SelectItem value="year">Sort by Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedBooks.map((book) => (
          <BookCard
            key={book.title}
            book={book}
            onSelect={() => setSelectedBook(book)}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage * booksPerPage >= filteredAndSortedBooks.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
