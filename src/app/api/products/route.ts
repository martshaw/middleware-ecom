import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'src/app/api/products/example-products.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  return NextResponse.json({ products: data.products || data });
}
