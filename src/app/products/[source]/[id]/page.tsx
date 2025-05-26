import { notFound } from 'next/navigation';
import ProductDetail from '../../../ui/ProductDetail';

interface Params {
  source: string;
  id: string;
}

export default async function ProductDetailPage({ params }: { params: Params | Promise<Params> }) {
  const awaitedParams = await params;
  const { source, id } = awaitedParams;
  console.log('page loaded')
  try {
    const res = await fetch(`http://localhost:3000/api/${source}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch data from source: ${source}`);
      notFound();
    }

    const data = await res.json();
    const products = data.products || [];

    // Extract the actual product objects for lookup
    type ProductEntry = { data?: { product?: { id: string; [key: string]: unknown } }; id?: string; sku?: string; [key: string]: unknown };
    const productList = products.map((entry: ProductEntry) =>
      entry.data && entry.data.product ? entry.data.product : entry
    );
    let product;
    if (source === "shopify") {
      // Try to match by full GID or by numeric ID
      product =
        productList.find((p: { id: string }) => p.id === id) ||
        productList.find((p: { id: string }) => {
          const match = p.id.match(/Product\/(\d+)/);
          return match && match[1] === id;
        });
    } else {
      product =
        productList.find((p: { id: string }) => p.id === id) ||
        productList.find((p: { sku: string }) => p.sku === id);
    }

    if (!product) {
      console.error(`Product with ID ${id} not found in source: ${source}`);
      notFound();
    }

    return <ProductDetail product={product} source={source} />;
  } catch (error) {
    console.error('Error fetching product details:', error);
    notFound();
  }
}
