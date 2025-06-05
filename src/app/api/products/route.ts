import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// This is a fallback API route that returns example products
// In a real application, this would fetch from your database or external API
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'src/app/api/products/example-products.json');
    const fileContents = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    
    return new NextResponse(JSON.stringify({ products: data.products || data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-middleware-processed': '1',
      },
    });
  } catch (error) {
    console.error('Error in products API route:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
