import { Suspense } from 'react';
import { ProductList } from '../../../components/ProductList';
import { ProductListSkeleton } from '../../../components/ProductListSkeleton';
import { ProductListError } from '../../../components/ProductListError';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Metadata } from 'next';

/**
 * Generate static paths for known product sources
 * This enables static generation of these pages at build time
 */
export async function generateStaticParams() {
  return [
    { source: 'shopify' },
    { source: 'salesforce' }
  ];
}

// Enable Incremental Static Regeneration (ISR) with 60-second revalidation
export const revalidate = 60;

interface PageProps {
  params: Promise<{ source: string }>;
}

/**
 * Generates dynamic metadata for the product listing page
 * Creates SEO-friendly titles and descriptions based on the source
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const source = resolvedParams.source;
  const title = source.charAt(0).toUpperCase() + source.slice(1);
  
  return {
    title: `${title} Products | Your Store`,
    description: `Browse our collection of ${source} products. Find the best deals and latest items.`,
    openGraph: {
      title: `${title} Products | Your Store`,
      description: `Browse our collection of ${source} products. Find the best deals and latest items.`,
      type: 'website',
    },
  };
}

/**
 * Product Listing Page Component
 * 
 * Server-side rendered page that displays a list of products
 * Uses Suspense for loading states and ErrorBoundary for error handling
 * Implements ISR for dynamic content updates
 */
export default async function ProductsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const source = resolvedParams.source;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {source} Products
      </h1>
      
      {/* Error boundary to catch and handle any rendering errors */}
      <ErrorBoundary fallback={<ProductListError />}>
        {/* Suspense boundary for loading states */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList source={source} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
