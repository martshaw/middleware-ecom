import ProductList from '../../ui/ProductList';

interface Params { source?: string }

export default async function ProductsBySourcePage({ 
  params 
}: { 
  params: Params | Promise<Params> 
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { source } = resolvedParams;
  const endpoint = source ? `/api/${source}` : '/api/products';
  
  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, { 
      cache: 'no-store',
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    let title = 'All Products';
    if (source === 'salesforce') title = 'Salesforce Products';
    if (source === 'shopify') title = 'Shopify Products';
    return <ProductList title={title} data={data.products || []} source={source} />;
  } catch (error) {
    console.error('Error fetching products:', error);
    return <ProductList title="Error Loading Products" data={[]} source={source} />;
  }
}
