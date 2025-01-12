'use client';

import { useState } from 'react';
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
import { uploadBook } from '@/app/actions';

export function BookUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('book', file);

    try {
      await uploadBook(formData);
      alert('Book uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a New Book</CardTitle>
        <CardDescription>Add a new book to your library</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="book">Upload Book (PDF)</Label>
            <div className="mt-1 flex items-center space-x-4">
              <Input
                id="book"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('book')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
            </div>
          </div>
          <Button type="submit" disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
