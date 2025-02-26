'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulating an API call
    setTimeout(() => {
      setSearchResults([
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ]);
      setIsSearching(false);
    }, 1500);
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
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p>{result}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
