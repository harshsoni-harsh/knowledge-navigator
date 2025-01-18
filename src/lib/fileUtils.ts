import { stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import mime from 'mime';

export const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await stat(dirPath);
  } catch (error: unknown) {
    if ((error as { code: string }).code === 'ENOENT') {
      await mkdir(dirPath, { recursive: true });
    } else {
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  }
};

export const saveFile = async (file: File, uploadDir: string) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${file.name.replace(/\.[^/.]+$/, '')}.${mime.getExtension(file.type)}`;
  const filePath = join(uploadDir, filename);

  await writeFile(filePath, buffer);
  return filename;
};
