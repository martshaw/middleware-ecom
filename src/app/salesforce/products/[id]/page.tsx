import { notFound } from 'next/navigation';
import ProductDetail from '../../../ui/ProductDetail';

// Define the expected product shape
interface Product {
  id: string;
  name: string; // Add the required 'name' property
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
}

// Define the page props type explicitly
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SalesforceProductDetailPage({ params }: PageProps) {
  // Await the params to resolve the dynamic route parameter
  const { id } = await params;

  try {
    // Fetch data with Next.js fetch, leveraging caching
    const res = await fetch('http://localhost:3000/api/salesforce', {
      next: { revalidate: 60 }, // Cache for 60 seconds, adjust as needed
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    const data: { products: Product[] } = await res.json();
    const product = data.products?.find((p) => p.id === id);

    if (!product) {
      notFound(); // Use Next.js notFound() for 404 handling
    }

    return <ProductDetail product={product} source="salesforce" />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound(); // Fallback to 404 on fetch errors
  }
}
