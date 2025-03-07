import getEnvVar from '@/lib/getEnvVar';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${getEnvVar('BACKEND_URL')}/list-files`);

    if (!response.ok) throw new Error(`${response.status}`);

    const files = await response.json();
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching file list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file list' },
      { status: 500 }
    );
  }
}
