import { notFound } from 'next/navigation';
import ProductDetail from '../../../ui/ProductDetail';


interface ProductPageParams {
  source: string;
  id: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { source, id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    // This will be handled by our middleware
    const res = await fetch(`${apiUrl}/api/${source}/${id}`, { 
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Failed to fetch product ${id} from ${source}: ${res.statusText}`);
      notFound();
    }

    const data = await res.json();
    const product = data.product;

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
