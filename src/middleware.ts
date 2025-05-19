import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only transform product API responses
  if (
    (pathname.startsWith('/api/products') || pathname.startsWith('/api/shopify') || pathname.startsWith('/api/salesforce')) &&
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
      return NextResponse.next(); // fallback if not json
    }
    // Normalize image and alt fields for all products
    if (Array.isArray(data.products)) {
      data.products = data.products.map((p: { images?: { edges?: { node?: { url?: string } }[] }, imageGroups?: { images?: { link?: string }[] }[], image?: string, name?: string, title?: string }) => ({
        ...p,
        image:
          (p.images && Array.isArray(p.images.edges) && p.images.edges.length > 0 && p.images.edges[0]?.node?.url)
            ? p.images.edges[0].node.url
          : (p.imageGroups && Array.isArray(p.imageGroups) && p.imageGroups.length > 0 && p.imageGroups[0].images && Array.isArray(p.imageGroups[0].images) && p.imageGroups[0].images.length > 0 && p.imageGroups[0].images[0]?.link)
            ? p.imageGroups[0].images[0].link
          : p.image || null,
        alt: p.name || p.title || 'Product image',
      }));
    } else if (Array.isArray(data)) {
      data = data.map((p: { images?: { edges?: { node?: { url?: string } }[] }, imageGroups?: { images?: { link?: string }[] }[], image?: string, name?: string, title?: string }) => ({
        ...p,
        image:
          (p.images && Array.isArray(p.images.edges) && p.images.edges.length > 0 && p.images.edges[0]?.node?.url)
            ? p.images.edges[0].node.url
          : (p.imageGroups && Array.isArray(p.imageGroups) && p.imageGroups.length > 0 && p.imageGroups[0].images && Array.isArray(p.imageGroups[0].images) && p.imageGroups[0].images.length > 0 && p.imageGroups[0].images[0]?.link)
            ? p.imageGroups[0].images[0].link
          : p.image || null,
        alt: p.name || p.title || 'Product image',
      }));
    }
    const res = NextResponse.json(data);
    res.headers.set('x-middleware-processed', '1');
    return res;
  }

  if (pathname === '/salesforce') {
    const url = request.nextUrl.clone();
    url.pathname = '/products';
    url.searchParams.set('source', 'salesforce');
    return NextResponse.rewrite(url);
  }

  if (pathname === '/shopify') {
    const url = request.nextUrl.clone();
    url.pathname = '/products';
    url.searchParams.set('source', 'shopify');
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/salesforce',
    '/shopify',
    '/api/products',
    '/api/products/(.*)',
    '/api/shopify',
    '/api/shopify/(.*)',
    '/api/salesforce',
    '/api/salesforce/(.*)'
  ],
};
