'use client';

import { useEffect, useRef, useState } from 'react';
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
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Dashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [promptTypes, setPromptTypes] = useState<string[]>(['general']);
  const [resultsByPrompt, setResultsByPrompt] = useState<Record<string, string>>({});
  const [reactContentByPrompt, setReactContentByPrompt] = useState<Record<string, React.ReactNode>>({});
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResultsByPrompt({});
    setReactContentByPrompt({});

    if (query && promptTypes.length > 0) {
      try {
        const results = await Promise.allSettled(
          promptTypes.map((prompt) => fetchPromptResponse(query, prompt))
        );

        const markdownMap: Record<string, string> = {};
        promptTypes.forEach((promptType, idx) => {
          if (results[idx].status === 'fulfilled') {
            markdownMap[promptType] = results[idx].value;
          } else {
            console.error(`Error in prompt "${promptType}":`, results[idx].reason);
            markdownMap[promptType] = `Failed to generate result. Check console.`;
          }
        });
        setResultsByPrompt(markdownMap);
      } catch (err) {
        console.error(err);
        toast({ title: 'Check your console error' });
      } finally {
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    const compileAllMarkdown = async () => {
      const compiled: Record<string, React.ReactNode> = {};
      for (const [prompt, md] of Object.entries(resultsByPrompt)) {
        const htmlString = await marked(md.trim(), { async: true });
        const cleanedHtml = DOMPurify.sanitize(htmlString).replaceAll('&nbsp;', ' ');
        compiled[prompt] = parse(cleanedHtml);
      }
      setReactContentByPrompt(compiled);
    };

    if (Object.keys(resultsByPrompt).length > 0) {
      compileAllMarkdown();
    }
  }, [resultsByPrompt]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        searchButtonRef.current?.click();
      }
      if (e.key === '/' && document.activeElement === inputRef.current) {
        inputRef.current?.focus();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  

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
              ref={inputRef}
            />
            <Button type="submit" className="transform" disabled={isSearching} ref={searchButtonRef}>
              {isSearching ? 'Asking...' : 'Ask AI'}
            </Button>
          </div>
          <ToggleGroup type="multiple" className='w-fit' onValueChange={(newValues) => {
            if (newValues.length > 0) {
              setPromptTypes(newValues);
            }
          }}
            value={promptTypes}>
            <ToggleGroupItem value="general">General</ToggleGroupItem>
            <ToggleGroupItem value="suggested-readings">Suggested Readings</ToggleGroupItem>
            <ToggleGroupItem value="cheatsheet">Cheatsheet</ToggleGroupItem>
            <ToggleGroupItem value="qna">QnA</ToggleGroupItem>
          </ToggleGroup>
        </form>
        {
          (isSearching && Object.entries(reactContentByPrompt).length === 0) ? <CardContent className="p-4 flex justify-center">
            <LoaderCircle className="animate-spin" />
          </CardContent> :
            Object.entries(reactContentByPrompt).length > 0 && (
              <div className="mt-4 space-y-4">
                {Object.entries(reactContentByPrompt).length > 0 && (
                  <Accordion type="multiple" className="mt-4 -mx-2" defaultValue={Object.keys(reactContentByPrompt)}>
                    {Object.entries(reactContentByPrompt).map(([prompt, content]) => (
                      <AccordionItem value={prompt} key={prompt} className='data-[state=open]:border rounded-md data-[state=open]:mt-4'>
                        <AccordionTrigger className="capitalize hover:no-underline cursor-pointer px-4 data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800 font-bold">
                          {prompt.replace('-', ' ')}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 dark:bg-zinc-900 rounded-md [&_a]:text-blue-500 [&_a:hover]:underline">
                          {content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            )}
      </CardContent>
    </Card>
  );
}
