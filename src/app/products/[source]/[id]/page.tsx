import { notFound } from 'next/navigation';
import ProductDetail from '../../../ui/ProductDetail';

interface Params { source: string; id: string }

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { source, id } = params;
  const res = await fetch(`http://localhost:3000/api/${source}`, { cache: 'no-store' });
  const data = await res.json();
  const product = (data.products || []).find((p: { id: string }) => p.id === id);
  if (!product) notFound();
  return <ProductDetail product={product} source={source} />;
}
