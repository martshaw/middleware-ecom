import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'src/app/api/shopify/shopify_products_example.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  const products = data.products || data;
  const updatedProducts = products.map(product => {
    let alt = "Product image";
    if (
      product.images &&
      Array.isArray(product.images.edges) &&
      product.images.edges.length > 0 &&
      product.images.edges[0].node &&
      typeof product.images.edges[0].node.altText === "string"
    ) {
      alt = product.images.edges[0].node.altText;
    } else if (product.title) {
      alt = product.title;
    }
    return {
      ...product,
      alt
    };
  });
  return NextResponse.json({ products: updatedProducts });
}
