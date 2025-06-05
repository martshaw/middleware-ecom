import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { memo } from 'react';

interface ProductListProps {
  title: string;
  data: Array<{
    id: string;
    sku?: string;
    name: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    description?: string;
    alt?: string;
  }>;
  source?: string;
}

// Memoize the ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(({ product, source }: { product: ProductListProps['data'][0], source?: string }) => (
  <Card className="overflow-hidden transition-all hover:shadow-lg">
    <Link href={`/products/${source}/${product.id}`} className="block">
      <div className="relative aspect-square">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.alt || product.name || 'Product Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={true}
            loading="eager"
            unoptimized={true} // Use this if you want to avoid Next.js image optimization
            quality={75} // Adjust quality as needed
            placeholder="blur"
            blurDataURL={product.image} // Use the same image as a placeholder
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {product.price && (
            <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          )}
          {product.originalPrice && product.originalPrice > (product.price || 0) && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
    </Link>
  </Card>
));

ProductCard.displayName = 'ProductCard';

export default function ProductList({ title, data, source }: ProductListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} source={source} />
        ))}
      </div>
    </div>
  );
}
