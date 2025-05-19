import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'src/app/api/shopify/shopify_products_example.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  const products = data.products || data;
  const updatedProducts = products.map(product => ({
    ...product,
    alt: product.images.edges[0].node.altText || product.title || "Product image"
  }));
  return NextResponse.json({ products: updatedProducts });
}
