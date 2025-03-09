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
