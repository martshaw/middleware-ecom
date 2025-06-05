import { NextRequest } from 'next/server';
import { normalizeProducts } from './normalizeProducts';

type Product = {
  id: string;
  [key: string]: string | number | boolean | null | undefined;};

type ProductLookupResult = {
  product: Product | null;
  status: number;
  error?: string;
};

export async function lookupProduct(
  source: string,
  id: string,
  request: NextRequest
): Promise<ProductLookupResult> {
  try {
    // Validate source
    if (!['shopify', 'salesforce'].includes(source)) {
      return {
        product: null,
        status: 400,
        error: `Invalid source: ${source}`
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const endpoint = `${apiUrl}/api/${source}`;
    
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'x-middleware-processed': '1',
        'x-request-id': request.headers.get('x-request-id') || ''
      }
    });

    if (!response.ok) {
      return {
        product: null,
        status: response.status,
        error: `Failed to fetch data from source: ${source}`
      };
    }


    const data = await response.json();
    const products = data.products || [];

    // Extract the actual product objects for lookup
    const productList = products.map((entry: Record<string, unknown>) =>
      (entry as { data?: { product?: Product } }).data?.product ? (entry as { data: { product: Product } }).data.product : entry
    );

    let product: Product | undefined;

    if (source === 'shopify') {
      // Try to match by full GID or by numeric ID
      product =
        productList.find((p: Product) => p.id === id) ||
        productList.find((p: Product) => {
          if (!p.id) return false;
          const match = String(p.id).match(/[\/:](\d+)$/);
          return match && match[1] === id;
        });
    } else {
      // For Salesforce, try both id and sku
      product =
        productList.find((p: Product) => p.id === id) ||
        productList.find((p: Product) => (p as Product & { sku?: string }).sku === id);
    }

    if (!product) {
      return {
        product: null,
        status: 404,
        error: `Product with ID ${id} not found in source: ${source}`
      };
    }

    // Normalize the product data
    const normalizedData = normalizeProducts({ products: [product] });
    const normalizedProduct = normalizedData.products?.[0] || product;

    return {
      product: {
        ...normalizedProduct,
        id: String(normalizedProduct.id || id),
        source
      },
      status: 200
    };
  } catch (error) {
    console.error('Error in product lookup:', error);
    return {
      product: null,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
