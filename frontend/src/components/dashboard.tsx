'use client';

import { useState } from 'react';
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
import { fetchPromptResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string>('');
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults('');

    if (query) {
      try {
        const res = await fetchPromptResponse(query);
        setSearchResults(res);
      } catch (err) {
        console.error(err);
        toast({title: 'Check your console error'});
      } finally {
        setIsSearching(false);
      }
    }
  };

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
          <form onSubmit={handleSearch} className="relative flex">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="What would you like to explore?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 mr-4 focus-visible:ring-0"
            />
            <Button type="submit" className="transform" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <Card>
                {!isSearching ? (
                  <CardContent className="p-4 max-w-full whitespace-pre-wrap">
                    {searchResults
                      .replaceAll('&nbsp;', ' ')
                      .split(/<br\s*\/?>/)
                      .map((line, index) => (
                        <p key={index}>
                          {line.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
                            part.match(/^https?:\/\//) ? (
                              <a
                                key={i}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                {part}
                              </a>
                            ) : (
                              part
                            )
                          )}
                        </p>
                      ))}
                  </CardContent>
                ) : (
                  <CardContent className="p-4 flex justify-center">
                    <LoaderCircle className="animate-spin" />
                  </CardContent>
                )}
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
  );
}
