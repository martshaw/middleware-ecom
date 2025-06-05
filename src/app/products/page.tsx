import ProductList from '../ui/ProductList';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  // Next.js 15: searchParams may be a promise, must await
  const params = typeof searchParams.then === 'function' ? await searchParams : searchParams;
  const source = (params as { source?: string }).source || undefined;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  let data = [];
  let title = 'All Products';
  try {
    // Using force-cache to leverage the benefits of ISR
    // The cache will be invalidated based on the revalidate setting above
    const url = source ? `${apiUrl}/api/${source}` : `${apiUrl}/api/products`;
    const res = await fetch(url, { 
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch products${source ? ` from ${source}` : ''}`, res.status);
      data = [];
    } else {
      const responseData = await res.json();
      data = Array.isArray(responseData.products) ? responseData.products : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    data = [];
  }
  if (source === 'salesforce') title = 'Salesforce Products';
  if (source === 'shopify') title = 'Shopify Products';
  return <ProductList title={title} data={data} source={undefined} />;
}
