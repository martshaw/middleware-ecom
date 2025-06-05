import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeProducts } from './utils/normalizeProducts';
import { handleRewrite } from './utils/rewriteHandlers';
import { lookupProduct } from './utils/productLookup';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle product detail API requests
  const productDetailMatch = pathname.match(/^\/api\/(shopify|salesforce)\/([^/]+)$/);
  if (productDetailMatch && !request.headers.get('x-middleware-processed')) {
    const [, source, id] = productDetailMatch;
    
    const { product, status, error } = await lookupProduct(source, id, request);
    
    if (!product) {
      return NextResponse.json(
        { error: error || 'Product not found' },
        { status }
      );
    }
    
    const response = NextResponse.json({ product });
    // Set cache headers for ISR
    response.headers.set('x-middleware-processed', '1');
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return response;
  }

  // Handle product listing API requests
  if (
    (pathname.startsWith('/api/products') ||
      pathname.startsWith('/api/shopify') ||
      pathname.startsWith('/api/salesforce')) &&
    !request.headers.get('x-middleware-processed')
  ) {
    const response = await fetch(request.url, {
      headers: { 'x-middleware-processed': '1' }
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.next();
    }

    // Normalize product data
    const normalizedData = normalizeProducts(data);
    const res = NextResponse.json(normalizedData);
    res.headers.set('x-middleware-processed', '1');
    return res;
  }

  // Handle rewrites for friendly URLs
  const rewriteResponse = handleRewrite(request);
  if (rewriteResponse) {
    return rewriteResponse;
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/salesforce',
    '/shopify',
    '/api/products',
    '/api/products/:path*',
    '/api/shopify',
    '/api/shopify/:path*',
    '/api/salesforce',
    '/api/salesforce/:path*',
  ],
};
