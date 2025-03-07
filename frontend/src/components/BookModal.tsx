import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from '@/types/book';
import formatFileSize from '@/lib/formatFileSize';

type BookModalProps = {
  book: Book;
  onClose: () => void;
};

export function BookModal({ book, onClose }: BookModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="break-words">{book.name}</CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Size: {formatFileSize(parseInt(book.size))}</p>
          <p>Year: {book.year}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
