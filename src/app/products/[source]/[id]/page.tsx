import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ source: string; id: string }>;
}

// Revalidate this page every 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { source, id } = resolvedParams;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/${source}/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const data = await res.json();
    const product = data.product;

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: `${product.name} | ${source.charAt(0).toUpperCase() + source.slice(1)}`,
      description: product.description || `View details for ${product.name} from ${source}.`,
      openGraph: {
        title: `${product.name} | ${source.charAt(0).toUpperCase() + source.slice(1)}`,
        description: product.description || `View details for ${product.name} from ${source}.`,
        type: 'website',
        images: product.image ? [{ url: product.image }] : [],
      },
    };
  } catch {
    return {
      title: 'Product Details',
      description: 'View product details from our store.',
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { source, id } = resolvedParams;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiUrl}/api/${source}/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const data = await res.json();
    const product = data.product;

    if (!product) {
      notFound();
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.image && (
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.alt || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.description && (
                <div className="prose max-w-none mb-6">
                  <p>{product.description}</p>
                </div>
              )}
              <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
