import { Suspense } from 'react';
import { ProductList } from '../../../components/ProductList';
import { ProductListSkeleton } from '../../../components/ProductListSkeleton';
import { ProductListError } from '../../../components/ProductListError';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Metadata } from 'next';

// Generate static params at build time
export async function generateStaticParams() {
  return [
    { source: 'shopify' },
    { source: 'salesforce' }
  ];
}

// Revalidate this page every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ source: string }>;
}

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

export default async function ProductsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const source = resolvedParams.source;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {source} Products
      </h1>
      
      <ErrorBoundary fallback={<ProductListError />}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList source={source} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
