import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeProducts } from './utils/normalizeProducts';
import { handleRewrite } from './utils/rewriteHandlers';

// For advanced testing, see next/experimental/testing/server in Next.js 15.1+

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only transform product API responses for specific endpoints
  // and avoid infinite loops by checking for a custom header
  if (
    (pathname.startsWith('/api/products') ||
      pathname.startsWith('/api/shopify') ||
      pathname.startsWith('/api/salesforce')) &&
    !request.headers.get('x-middleware-processed')
  ) {
    // Proxy the request to the actual API endpoint, adding a header to prevent re-processing
    const response = await fetch(request.url, {
      headers: { 'x-middleware-processed': '1' }
    });

    // Try to parse the response as JSON
    let data;
    try {
      data = await response.json();
    } catch (error) {
      // If the response is not JSON (e.g., an error page), log and skip transformation
      console.error('Error parsing JSON:', error);
      return NextResponse.next(); // fallback if not json
    }

    // Normalize image and alt fields for all products in the response
    data = normalizeProducts(data);

    // Create a new JSON response with the normalized data
    const res = NextResponse.json(data);
    // Mark this response as processed to prevent infinite middleware loops
    res.headers.set('x-middleware-processed', '1');
    return res;
  }

  // Handle rewrites for friendly URLs (/salesforce, /shopify)
  const rewriteResponse = handleRewrite(request);
  if (rewriteResponse) {
    return rewriteResponse;
  }

  // For all other requests, continue as normal
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
