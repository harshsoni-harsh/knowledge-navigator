'use server';
import { prisma } from '@/lib/prisma';
import { Book } from '@/types/book';

export async function getAllFilesMetadata() {
  const allMetadata = await prisma.fileMetadata.findMany();
  return allMetadata;
}

export async function addFileMetadata(metadata: Omit<Book, 'id'>) {
  const { id } = await prisma.fileMetadata.create({ data: metadata });
  return id;
}

export async function fetchPromptResponse(prompt: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/retrieve?question=${encodeURIComponent(prompt)}`
  );

  if (!res.ok) throw new Error(`Failed to retrieve: ${res.statusText}`);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let streamData = "";
  let buffer = '';
  
  while (true) {
    const { done, value } = (await reader?.read()) || {};
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    
    let boundary = buffer.indexOf('\n');
    while (boundary !== -1) {
      const line = buffer.substring(0, boundary).trim();
      buffer = buffer.substring(boundary + 1);
      
      if (line) {
        try {
          const data = JSON.parse(line);
          if (data.answer) {
            streamData += data.answer;
          }
        } catch (e) {
          console.error('Error parsing streamed data:', e);
        }
      }
      boundary = buffer.indexOf('\n');
    }
  }
  return streamData;
}
