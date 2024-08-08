import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const directoryPath = path.join(process.cwd(), 'public/story-cards');
  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.jpeg'));

  return NextResponse.json(files);
}
