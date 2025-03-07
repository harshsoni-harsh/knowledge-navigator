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
import getEnvVar from '@/lib/getEnvVar';

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults('');

    if (query) {
      const retrieveResponse = await fetch(
        `${getEnvVar("BACKEND_URL")}/retrieve?question=${encodeURIComponent(query)}`
      );

      if (retrieveResponse.ok) {
        setIsSearching(false);
        const reader = retrieveResponse.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = (await reader?.read()) || {};
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          console.log(buffer);

          let boundary = buffer.indexOf('\n');
          while (boundary !== -1) {
            const line = buffer.substring(0, boundary).trim();
            buffer = buffer.substring(boundary + 1);

            if (line) {
              try {
                const data = JSON.parse(line);
                if (data.answer) {
                  setSearchResults((prev) =>
                    prev ? `${prev}${data.answer}` : data.answer
                  );
                }
              } catch (e) {
                console.error('Error parsing streamed data:', e);
              }
            }
            boundary = buffer.indexOf('\n');
          }
        }
      } else {
        console.error('Failed to retrieve:', retrieveResponse.statusText);
      }
    }
  };

  return (
    <div className="min-w-full">
      <Card className="min-w-full">
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
    </div>
  );
}
