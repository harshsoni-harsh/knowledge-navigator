'use client';

import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchPromptResponse } from '@/lib/retrieval';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string>('');
  const [prompts, setPrompts] = useState<string[]>(['general']);
  const [reactContent, setReactContent] = useState<React.ReactNode>('');
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults('');

    if (query) {
      try {
        const res = await fetchPromptResponse(query, prompts[0]);
        setSearchResults(res);
      } catch (err) {
        console.error(err);
        toast({ title: 'Check your console error' });
      } finally {
        setIsSearching(false);
      }
    }
  };

  const compileMarkdown = useCallback(async () => {
    const htmlString = await marked(searchResults.trim(), { async: true });
    const cleanedHtml = DOMPurify.sanitize(htmlString).replaceAll('&nbsp;', ' ');
    setReactContent(parse(cleanedHtml));
  }, [searchResults]);

  useEffect(() => {
    compileMarkdown();
  }, [compileMarkdown]);

  return (
    <Card className="my-6 mx-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Explore Your Library
        </CardTitle>
        <CardDescription>
          Search for books, authors, or topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="relative flex flex-col gap-3">
          <div className='relative flex w-full'>
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="What would you like to explore?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 mr-4"
            />
            <Button type="submit" className="transform" disabled={isSearching}>
              {isSearching ? 'Asking...' : 'Ask AI'}
            </Button>
          </div>
          <ToggleGroup type="multiple" className='w-fit' variant={'outline'} onValueChange={setPrompts} value={prompts}>
            <ToggleGroupItem value="general">General</ToggleGroupItem>
            <ToggleGroupItem value="suggested-readings">Suggested Readings</ToggleGroupItem>
            <ToggleGroupItem value="flashcards">Flashcards</ToggleGroupItem>
          </ToggleGroup>
        </form>
        {
          isSearching ? <CardContent className="p-4 flex justify-center">
            <LoaderCircle className="animate-spin" />
          </CardContent> :
            searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <Card>
                  <CardContent className="p-4 max-w-full bg-zinc-900 rounded-md">
                    {reactContent}
                  </CardContent>
                </Card>
              </div>
            )}
      </CardContent>
    </Card>
  );
}
