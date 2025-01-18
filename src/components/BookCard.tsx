import { Book, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Book as BookType } from '@/types/book';
import Link from 'next/link';

type BookCardProps = {
  book: BookType;
  onSelect: () => void;
};

export function BookCard({ book, onSelect }: BookCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Year: {book.year}</p>
      </CardContent>
      <CardFooter>
        <div className="w-full flex">
          <Link
            href={`/files/${book.title}`}
            className="w-full flex items-center justify-center gap-2 rounded-l-md border border-input bg-background px-4 py text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <Book className="h-4 w-4" />
            <span>Read</span>
          </Link>
          <Button
            className="rounded-l-none border-l-0"
            variant="outline"
            onClick={onSelect}
            aria-label="More information"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
