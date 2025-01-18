'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BookUploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter((file) => {
        if (file.type !== 'application/pdf') {
          alert(`File "${file.name}" is not a valid PDF.`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          alert(`File "${file.name}" exceeds the size limit (100MB).`);
          return false;
        }
        return true;
      });
      setFiles(validFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('books', file); // Use 'books' as the field name
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed. Please try again.');
      }

      alert('Books uploaded successfully!');
      setFiles([]);
      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Books</CardTitle>
        <CardDescription>Add multiple books to your library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Label htmlFor="books">Upload Books (PDF)</Label>
          <div className="flex items-center">
            <Input
              id="books"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              ref={uploadRef}
              multiple // Allow multiple file selection
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => uploadRef.current?.click()}
              aria-label="Select files"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </Button>
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Selected files:</p>
              <ul className="list-disc list-inside">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={files.length === 0 || uploading}>
            {uploading ? 'Uploading...' : 'Upload Books'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
