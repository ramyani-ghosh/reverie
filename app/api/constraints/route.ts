import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public/constraints.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const constraints = JSON.parse(data);

  return NextResponse.json(constraints);
}
