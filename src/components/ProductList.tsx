'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Product } from '../types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductListProps {
  source: string;
}

export function ProductList({ source }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = source ? `${apiUrl}/api/${source}` : `${apiUrl}/api/products`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [source]);

  useEffect(() => {
    fetchProducts();
    
    // Cleanup function
    return () => {
      setProducts([]);
      setError(null);
    };
  }, [fetchProducts]);

  const handleAddToCart = useCallback((e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Adding to cart:', productId);
  }, []);

  const productGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          href={`/products/${source}/${product.id}`}
          key={product.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow block"
          prefetch={false} // Disable prefetching for better performance with many products
        >
          {product.image && (
            <div className="relative w-full h-48 mb-4">
              <Image
                src={product.image}
                alt={product.alt || product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-md"
                loading="lazy"
                quality={75}
              />
            </div>
          )}
          <h2 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h2>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={(e) => handleAddToCart(e, product.id)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </Link>
      ))}
    </div>
  ), [products, source, handleAddToCart]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm animate-pulse">
            <div className="bg-gray-200 h-48 rounded-md mb-4" />
            <div className="bg-gray-200 h-6 w-3/4 mb-2" />
            <div className="flex justify-between items-center">
              <div className="bg-gray-200 h-6 w-1/4" />
              <div className="bg-gray-200 h-10 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
        <button
          onClick={() => fetchProducts()}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          No Products Found
        </h2>
        <p className="text-gray-500">
          We couldn&apos;t find any products matching your criteria.
        </p>
      </div>
    );
  }

  return productGrid;
} 