'use client';

import { useState } from 'react';
import { Book, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Mock data for books
const mockBooks = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
  },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: 1951,
  },
];

export function BookLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');

  const filteredAndSortedBooks = mockBooks
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'year') {
        return a.year - b.year;
      }
      return a[sortBy].localeCompare(b[sortBy]);
    });

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
        <Select value={sortBy} onValueChange={setSortBy}>
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
        {filteredAndSortedBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Year: {book.year}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Book className="mr-2 h-4 w-4" />
                Read
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
