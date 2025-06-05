import ProductList from '../ui/ProductList';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  // Next.js 15: searchParams may be a promise, must await
  const params = typeof searchParams.then === 'function' ? await searchParams : searchParams;
  const source = (params as { source?: string }).source || undefined;
  let data = [];
  let title = 'All Products';
  try {
    const res = await fetch(`/api/products${source ? `?source=${source}` : ''}`, { cache: 'no-store' });
    data = await res.json();
    if (!Array.isArray(data)) data = [];
  } catch (error) {
    console.error('Error fetching products:', error);
    data = [];
  }
  if (source === 'salesforce') title = 'Salesforce Products';
  if (source === 'shopify') title = 'Shopify Products';
  return <ProductList title={title} data={data} source={undefined} />;
}
