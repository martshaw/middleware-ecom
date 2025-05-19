import ProductList from '../../ui/ProductList';

interface Params { source?: string }

export default async function ProductsBySourcePage({ params }: { params: Params }) {
  const { source } = params;
  const endpoint = source ? `/api/${source}` : '/api/products';
  const res = await fetch(`http://localhost:3000${endpoint}`, { cache: 'no-store' });
  const data = await res.json();
  let title = 'All Products';
  if (source === 'salesforce') title = 'Salesforce Products';
  if (source === 'shopify') title = 'Shopify Products';
  return <ProductList title={title} data={data.products || []} source={source} />;
}
