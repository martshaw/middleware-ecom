import ProductList from '../../ui/ProductList';

interface Params { source?: string }

export default async function ProductsBySourcePage(
  props: { 
    params: Promise<Params | Promise<Params>> 
  }
) {
  const params = await props.params;
  const resolvedParams = params instanceof Promise ? await params : params;
  const { source } = resolvedParams;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  console.log('Fetching products for source:', apiUrl, source);
  const endpoint = source ? `${apiUrl}/api/${source}` : `${apiUrl}/api/products`;

  try {
    const res = await fetch(endpoint, { 
      cache: 'no-store',
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch products from source: ${source}`, res.status);
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

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
