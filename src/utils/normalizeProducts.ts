// Utility to normalize product data from different sources (Shopify, Salesforce, etc.)
type ImageNode = {
  url?: string;
  altText?: string;
};

type ImageEdge = {
  node?: ImageNode;
};

type ImageGroup = {
  images?: Array<{ link?: string }>;
};

type PriceRange = {
  minVariantPrice?: { amount?: string | number };
  maxVariantPrice?: { amount?: string | number };
};

export type Product = {
  id?: string | number;
  sku?: string;
  name?: string;
  title?: string;
  price?: number | string | { amount?: string | number };
  originalPrice?: number | string | { amount?: string | number };
  priceRange?: PriceRange;
  images?: { edges?: ImageEdge[] };
  imageGroups?: ImageGroup[];
  image?: string;
  imageUrl?: string;
  description?: string;
  alt?: string;
  handle?: string;
  source?: string;
  [key: string]: unknown;
};

export type NormalizedProduct = {
  id: string;
  sku?: string;
  name: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  alt: string;
  source?: string;
  [key: string]: unknown;
};

/**
 * Extracts a numeric ID from various formats including Shopify GID
 * @example
 * extractId('gid://shopify/Product/123') // '123'
 * extractId('Product/123') // '123'
 * extractId(123) // '123'
 */
function extractId(id: string | number | undefined): string {
  if (id === undefined) return '';
  if (typeof id === 'number') return String(id);
  
  // Handle Shopify GID format (gid://shopify/Product/123)
  const gidMatch = id.match(/[\/:](\d+)$/);
  if (gidMatch) return gidMatch[1];
  
  // Handle Product/123 format
  const productMatch = id.match(/Product[\/:](\d+)/i);
  if (productMatch) return productMatch[1];
  
  return String(id);
}

/**
 * Normalizes price to a number
 * @example
 * normalizePrice('19.99') // 19.99
 * normalizePrice(19.99) // 19.99
 * normalizePrice({ amount: '19.99' }) // 19.99
 * normalizePrice(undefined) // undefined
 */
type PriceInput = string | number | { amount?: string | number } | null | undefined;

function normalizePrice(price: PriceInput): number | undefined {
  if (price === undefined || price === null) return undefined;
  
  // Handle price range objects
  if (typeof price === 'object' && 'amount' in price) {
    return normalizePrice(price.amount);
  }
  
  // Convert string to number
  if (typeof price === 'string') {
    const num = parseFloat(price);
    return isNaN(num) ? undefined : num;
  }
  
  // If it's already a number, return it
  if (typeof price === 'number') {
    return price;
  }
  
  return undefined;
}

/**
 * Extracts the first available image URL from various product data structures
 */
function extractImageUrl(product: Product): string | undefined {
  return (
    // Shopify format
    product.images?.edges?.[0]?.node?.url ||
    // Salesforce format
    product.imageGroups?.[0]?.images?.[0]?.link ||
    // Direct image properties
    product.image ||
    product.imageUrl ||
    // Fallback to any image URL in the product data
    (typeof product['imageUrl'] === 'string' ? product['imageUrl'] : undefined) ||
    (typeof product['image_url'] === 'string' ? product['image_url'] : undefined) ||
    // Default fallback image
    undefined
  );
}

/**
 * Normalizes product data from various sources to a consistent format
 */
export function normalizeProducts(data: Product[] | { products: Product[] }): { products: NormalizedProduct[] } {
  // Handle both array and { products: [...] } formats
  const products: Product[] = Array.isArray(data) ? data : data.products || [];

  // Flatten nested product objects (e.g., { data: { product: {...} } })
  const flattened = products.map(entry => {
    // Handle { data: { product: {...} } } structure
    if (typeof entry === 'object' && entry !== null && 'data' in entry) {
      const data = (entry as { data?: { product?: Product } }).data;
      if (data && typeof data === 'object' && 'product' in data) {
        return data.product as Product;
      }
    }
    return entry;
  });

  // Normalize each product
  const normalized = flattened.map((product): NormalizedProduct => {
    if (!product) return { id: '', name: 'Unknown Product', alt: 'Product image' };
    
    const id = extractId(product.id);
    const name = product.name || product.title || 'Unnamed Product';
    const alt = product.alt || name || 'Product image';
    
    // Handle price normalization
    const price = normalizePrice(product.price || product.priceRange?.minVariantPrice);
    const originalPrice = normalizePrice(product.originalPrice || product.priceRange?.maxVariantPrice);
    
    // Extract image URL
    const image = extractImageUrl(product);
    
    return {
      ...product,
      id,
      sku: product.sku || id,
      name,
      price,
      originalPrice,
      image,
      description: product.description || '',
      alt,
      source: product.source
    };
  });

  return { products: normalized };
}
