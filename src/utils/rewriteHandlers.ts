// Handlers for rewriting friendly URLs to product sources
import { NextRequest, NextResponse } from 'next/server';

export function handleRewrite(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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
  
  return null;
}
