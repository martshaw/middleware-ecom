import { notFound } from 'next/navigation';
import ProductDetail from '../../../ui/ProductDetail';


interface ProductPageParams {
  source: string;
  id: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: ProductPageParams;
}) {
  const { source, id } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const res = await fetch(`${apiUrl}/api/${source}`, {
      cache: 'no-store',
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      notFound();
    }

    const data = await res.json();
    const products = data.products || [];

    // Products are already normalized by middleware!
    const product =
      products.find((p: { id: string }) => p.id === id) ||
      products.find((p: { sku?: string }) => p.sku === id);

    if (!product) {
      notFound();
    }

    return <ProductDetail product={product} source={source} />;
  } catch {
    notFound();
  }
}
